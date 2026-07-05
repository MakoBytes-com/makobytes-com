"use server";

import { currentAdmin } from "@/lib/admin";
import { verifyPassword, hashPassword } from "@/lib/auth/passwords";
import { setUserPassword, setUserTotp, clearUserTotp } from "@/lib/auth/users";
import {
  verifyTotp, encryptTotpSecret, generateAndStoreRecoveryCodes,
} from "@/lib/auth/totp";

type Result = { error: string | null; recoveryCodes?: string[]; ok?: boolean };

export async function changePasswordAction(_prev: Result, formData: FormData): Promise<Result> {
  const user = await currentAdmin();
  if (!user || !user.passwordHash) return { error: "Not signed in." };
  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  if (!(await verifyPassword(current, user.passwordHash))) return { error: "Current password is incorrect." };
  if (next.length < 10) return { error: "New password must be at least 10 characters." };
  if (next !== confirm) return { error: "New passwords don't match." };
  await setUserPassword(user.id, await hashPassword(next));
  return { error: null, ok: true };
}

export async function enrollTotpAction(_prev: Result, formData: FormData): Promise<Result> {
  const user = await currentAdmin();
  if (!user || !user.passwordHash) return { error: "Not signed in." };
  if (user.totpEnrolledAt) return { error: "2FA is already enabled. Disable it first to re-enroll." };
  const secret = String(formData.get("secret") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const current = String(formData.get("current_password") ?? "");
  if (!(await verifyPassword(current, user.passwordHash))) return { error: "Current password is incorrect." };
  if (!verifyTotp(secret, code)) return { error: "That code didn't match. Check your authenticator app's time and try again." };
  await setUserTotp(user.id, encryptTotpSecret(secret));
  const recoveryCodes = await generateAndStoreRecoveryCodes(user.id);
  return { error: null, recoveryCodes };
}

export async function disableTotpAction(_prev: Result, formData: FormData): Promise<Result> {
  const user = await currentAdmin();
  if (!user || !user.passwordHash) return { error: "Not signed in." };
  const current = String(formData.get("current_password") ?? "");
  const code = String(formData.get("code") ?? "").trim();
  if (!(await verifyPassword(current, user.passwordHash))) return { error: "Current password is incorrect." };
  if (!user.totpSecret) return { error: "2FA isn't enabled." };
  const { decryptTotpSecret } = await import("@/lib/auth/totp");
  if (!verifyTotp(decryptTotpSecret(user.totpSecret), code)) return { error: "That code didn't match." };
  await clearUserTotp(user.id);
  return { error: null, ok: true };
}

export async function regenerateCodesAction(_prev: Result, formData: FormData): Promise<Result> {
  const user = await currentAdmin();
  if (!user || !user.passwordHash) return { error: "Not signed in." };
  if (!user.totpEnrolledAt) return { error: "Enable 2FA first." };
  const current = String(formData.get("current_password") ?? "");
  if (!(await verifyPassword(current, user.passwordHash))) return { error: "Current password is incorrect." };
  const recoveryCodes = await generateAndStoreRecoveryCodes(user.id);
  return { error: null, recoveryCodes };
}
