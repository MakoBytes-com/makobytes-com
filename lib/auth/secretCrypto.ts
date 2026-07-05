import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";

// The stored TOTP secret is AES-256-GCM ciphertext, keyed by an HKDF-SHA256
// derivation of SESSION_SECRET. Rotating SESSION_SECRET invalidates every
// stored TOTP secret (and every session) — by design.
const VERSION = "v1";
const IV_BYTES = 12;
const KEY_BYTES = 32;
// Fixed at first deploy — changing this bricks every stored TOTP secret.
const HKDF_SALT = Buffer.from("makobytes-secret-crypto-salt/v1");
const HKDF_INFO = Buffer.from("totp-secret/v1");

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
function getKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var is not set");
  return Buffer.from(hkdfSync("sha256", Buffer.from(secret, "utf8"), HKDF_SALT, HKDF_INFO, KEY_BYTES));
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${VERSION}.${b64url(iv)}.${b64url(Buffer.concat([ct, tag]))}`;
}

export function decryptSecret(token: string): string {
  const [ver, ivB64, bodyB64] = token.split(".");
  if (ver !== VERSION || !ivB64 || !bodyB64) throw new Error("bad ciphertext");
  const iv = unb64url(ivB64);
  const body = unb64url(bodyB64);
  const tag = body.subarray(body.length - 16);
  const ct = body.subarray(0, body.length - 16);
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}
