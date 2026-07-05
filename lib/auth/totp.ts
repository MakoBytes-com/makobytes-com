import "server-only";
import { generateSecret, generateURI, verifySync } from "otplib";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import qrcode from "qrcode";
import { serverSupabase } from "@/lib/supabase";
import { encryptSecret, decryptSecret } from "./secretCrypto";

const ISSUER = "PromptPixel Admin";
const RECOVERY_CODE_COUNT = 10;
const EPOCH_TOLERANCE_SEC = 30;

export function generateTotpSecret(): string {
  return generateSecret();
}

export function buildOtpAuthUrl(email: string, secret: string): string {
  return generateURI({ issuer: ISSUER, label: email, secret });
}

export async function buildQrDataUrl(email: string, secret: string): Promise<string> {
  return qrcode.toDataURL(buildOtpAuthUrl(email, secret), {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 260,
    color: { dark: "#ffffff", light: "#0b1a2e" },
  });
}

export function verifyTotp(secret: string, token: string): boolean {
  const cleaned = token.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleaned)) return false;
  try {
    return verifySync({ secret, token: cleaned, epochTolerance: EPOCH_TOLERANCE_SEC }).valid;
  } catch {
    return false;
  }
}

export function encryptTotpSecret(secret: string): string {
  return encryptSecret(secret);
}
export function decryptTotpSecret(encrypted: string): string {
  return decryptSecret(encrypted);
}

// ── recovery codes ── (xxxxx-xxxxx from a no-ambiguous alphabet, bcrypt-stored)
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
function oneRecoveryCode(): string {
  const bytes = randomBytes(10);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += ALPHABET[bytes[i]! % ALPHABET.length];
  return `${s.slice(0, 5)}-${s.slice(5, 10)}`;
}

export async function generateAndStoreRecoveryCodes(userId: string): Promise<string[]> {
  const supabase = serverSupabase();
  await supabase.from("admin_recovery_codes").delete().eq("user_id", userId);
  const plaintexts: string[] = [];
  const rows: { user_id: string; code_hash: string }[] = [];
  for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
    const code = oneRecoveryCode();
    plaintexts.push(code);
    rows.push({ user_id: userId, code_hash: await bcrypt.hash(code, 10) });
  }
  await supabase.from("admin_recovery_codes").insert(rows);
  return plaintexts;
}

export async function consumeRecoveryCode(userId: string, submitted: string): Promise<boolean> {
  const cleaned = submitted.trim().toLowerCase();
  if (!/^[a-z0-9]{5}-[a-z0-9]{5}$/.test(cleaned)) return false;
  const supabase = serverSupabase();
  const { data: rows } = await supabase
    .from("admin_recovery_codes")
    .select("id, code_hash")
    .eq("user_id", userId)
    .is("used_at", null);
  for (const row of rows ?? []) {
    if (await bcrypt.compare(cleaned, row.code_hash as string)) {
      await supabase.from("admin_recovery_codes").update({ used_at: new Date().toISOString() }).eq("id", row.id);
      return true;
    }
  }
  return false;
}

export async function remainingRecoveryCodeCount(userId: string): Promise<number> {
  const { count } = await serverSupabase()
    .from("admin_recovery_codes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("used_at", null);
  return count ?? 0;
}
