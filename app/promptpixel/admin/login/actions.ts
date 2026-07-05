"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { findUserByEmail, recordLogin } from "@/lib/auth/users";
import { verifyPassword } from "@/lib/auth/passwords";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkLoginRateLimit, clearEmailRateLimit } from "@/lib/auth/rateLimit";

const MIN_FAIL_MS = 800;
const GENERIC = "Invalid email or password.";

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}
async function failWithDelay(startedAt: number, error: string) {
  const elapsed = Date.now() - startedAt;
  if (elapsed < MIN_FAIL_MS) await new Promise((r) => setTimeout(r, MIN_FAIL_MS - elapsed));
  return { error };
}

export async function loginAction(_prev: { error: string | null }, formData: FormData) {
  const startedAt = Date.now();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/promptpixel/admin");
  const honeypot = String(formData.get("company_website") ?? "").trim();
  const token = String(formData.get("cf-turnstile-response") ?? "");

  if (honeypot) return failWithDelay(startedAt, GENERIC); // bot
  if (!email || !password) return failWithDelay(startedAt, "Email and password are required.");

  const ip = await clientIp();
  const rate = await checkLoginRateLimit(ip, email);
  if (!rate.allowed) return failWithDelay(startedAt, rate.reason ?? GENERIC);

  const captcha = await verifyTurnstile(token, ip);
  if (!captcha.ok) return failWithDelay(startedAt, "Please complete the verification challenge.");

  const user = await findUserByEmail(email);
  if (!user || !user.passwordHash || user.disabledAt) return failWithDelay(startedAt, GENERIC);

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return failWithDelay(startedAt, GENERIC);

  await clearEmailRateLimit(email);
  const session = await getSession();
  const safeNext = next.startsWith("/promptpixel/admin") ? next : "/promptpixel/admin";

  // 2FA-enabled: hold as pending, don't set userId yet.
  if (user.totpSecret && user.totpEnrolledAt) {
    session.userId = undefined;
    session.email = undefined;
    session.name = undefined;
    session.role = undefined;
    session.pendingUserId = user.id;
    session.pendingEmail = user.email;
    session.pendingExpiresAt = Date.now() + 5 * 60 * 1000;
    await session.save();
    redirect(`/promptpixel/admin/2fa?next=${encodeURIComponent(safeNext)}`);
  }

  // No 2FA: full session.
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  session.role = user.role;
  session.pendingUserId = undefined;
  session.pendingEmail = undefined;
  session.pendingExpiresAt = undefined;
  await session.save();
  await recordLogin(user.id);
  redirect(safeNext);
}
