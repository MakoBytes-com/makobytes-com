"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { findUserById, recordLogin } from "@/lib/auth/users";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkLoginRateLimit, clearEmailRateLimit } from "@/lib/auth/rateLimit";
import { verifyTotp, decryptTotpSecret, consumeRecoveryCode } from "@/lib/auth/totp";

const MIN_FAIL_MS = 800;
const GENERIC = "That code didn't match. Try again.";

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

export async function verifyOtpAction(_prev: { error: string | null }, formData: FormData) {
  const startedAt = Date.now();
  const session = await getSession();
  if (!session.pendingUserId || !session.pendingEmail || !session.pendingExpiresAt || session.pendingExpiresAt < Date.now()) {
    session.destroy();
    redirect("/promptpixel/admin/login");
  }

  const code = String(formData.get("code") ?? "").trim();
  const useRecovery = formData.get("use_recovery") === "1";
  const next = String(formData.get("next") ?? "/promptpixel/admin");
  const token = String(formData.get("cf-turnstile-response") ?? "");
  const ip = await clientIp();

  const rate = await checkLoginRateLimit(ip, session.pendingEmail);
  if (!rate.allowed) return failWithDelay(startedAt, rate.reason ?? GENERIC);
  const captcha = await verifyTurnstile(token, ip);
  if (!captcha.ok) return failWithDelay(startedAt, "Please complete the verification challenge.");

  const user = await findUserById(session.pendingUserId);
  if (!user || !user.totpSecret || user.disabledAt) {
    session.destroy();
    return failWithDelay(startedAt, "Session expired. Sign in again.");
  }

  let accepted = false;
  if (useRecovery) accepted = await consumeRecoveryCode(user.id, code);
  else {
    try { accepted = verifyTotp(decryptTotpSecret(user.totpSecret), code); } catch { accepted = false; }
  }
  if (!accepted) return failWithDelay(startedAt, GENERIC);

  await clearEmailRateLimit(session.pendingEmail);
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  session.role = user.role;
  session.pendingUserId = undefined;
  session.pendingEmail = undefined;
  session.pendingExpiresAt = undefined;
  await session.save();
  await recordLogin(user.id);
  redirect(next.startsWith("/promptpixel/admin") ? next : "/promptpixel/admin");
}
