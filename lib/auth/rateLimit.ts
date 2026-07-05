import "server-only";
import { serverSupabase } from "@/lib/supabase";

// DB-backed sliding-window limiter (multi-instance safe). Fails OPEN on error
// so a DB hiccup never locks admins out. Mirrors the fleet rate_limit pattern.
export const LOGIN_RL = {
  IP_WINDOW_MS: 15 * 60 * 1000,
  IP_MAX: 10,
  EMAIL_WINDOW_MS: 15 * 60 * 1000,
  EMAIL_MAX: 5,
};

async function checkRateLimit(key: string, windowMs: number, max: number): Promise<{ allowed: boolean }> {
  try {
    const supabase = serverSupabase();
    const since = new Date(Date.now() - windowMs).toISOString();
    const { count } = await supabase
      .from("admin_rate_limit")
      .select("id", { count: "exact", head: true })
      .eq("bucket_key", key)
      .gte("occurred_at", since);
    if ((count ?? 0) >= max) return { allowed: false };
    await supabase.from("admin_rate_limit").insert({ bucket_key: key });
    return { allowed: true };
  } catch {
    return { allowed: true }; // fail open
  }
}

export async function checkLoginRateLimit(ip: string, email?: string): Promise<{ allowed: boolean; reason?: string }> {
  const byIp = await checkRateLimit(`login:ip:${ip}`, LOGIN_RL.IP_WINDOW_MS, LOGIN_RL.IP_MAX);
  if (!byIp.allowed) return { allowed: false, reason: "Too many sign-in attempts from this network. Try again in a few minutes." };
  if (email) {
    const byEmail = await checkRateLimit(`login:email:${email.toLowerCase()}`, LOGIN_RL.EMAIL_WINDOW_MS, LOGIN_RL.EMAIL_MAX);
    if (!byEmail.allowed) return { allowed: false, reason: "Too many sign-in attempts for this account. Try again in a few minutes." };
  }
  return { allowed: true };
}

export async function clearEmailRateLimit(email: string): Promise<void> {
  try {
    await serverSupabase().from("admin_rate_limit").delete().eq("bucket_key", `login:email:${email.toLowerCase()}`);
  } catch {
    // best-effort
  }
}
