// Inbound JWT verification for the master control-plane fleet-reporting
// endpoints (/api/master/*). The master CP signs a short-lived RS256 JWT
// (audience = this client's CLIENT_ID, scope = "<area>.read") and calls the
// read-only master endpoints below. We verify against MASTER_PUBLIC_KEY.
//
// Fails closed: any missing env var, bad signature, wrong audience, wrong
// algorithm, or scope mismatch throws — the routes translate that into a 401.

import { importSPKI, jwtVerify, type JWTPayload } from "jose";

export type VerifiedMasterToken = JWTPayload & { scope: string; client_id?: string };

// MASTER_PUBLIC_KEY normally holds one PEM. During a master signing-key
// rotation it holds TWO, concatenated — the outgoing key and the incoming
// one. There is no JWKS endpoint here and the master signs with exactly one
// key at a time, so listing both is what lets the master flip over without a
// window where every token we receive fails. A single PEM behaves exactly as
// it always has.
//
// Vercel env vars routinely store PEMs with literal "\n" sequences, so
// normalize before splitting.
function masterPublicKeyPems(): string[] {
  const raw = process.env.MASTER_PUBLIC_KEY;
  if (!raw) throw new Error("MASTER_PUBLIC_KEY env var is not set");
  const normalized = raw.replace(/\\n/g, "\n").trim();
  const blocks = normalized.match(
    /-----BEGIN PUBLIC KEY-----[\s\S]*?-----END PUBLIC KEY-----/g,
  );
  // No recognizable block: hand the raw value to importSPKI exactly like
  // before rather than inventing a new failure mode.
  return blocks && blocks.length > 0 ? blocks.map((b) => b.trim()) : [normalized];
}

export async function verifyMasterToken(token: string, requiredScope?: string): Promise<VerifiedMasterToken> {
  const aud = (process.env.CLIENT_ID ?? "").trim();
  if (!aud) throw new Error("CLIENT_ID env var is not set");

  let payload: JWTPayload | undefined;
  let lastErr: unknown;
  for (const pem of masterPublicKeyPems()) {
    let key: Awaited<ReturnType<typeof importSPKI>>;
    try {
      key = await importSPKI(pem, "RS256");
    } catch (err) {
      lastErr = err; // malformed block — try the next one
      continue;
    }
    try {
      ({ payload } = await jwtVerify(token, key, { audience: aud, algorithms: ["RS256"] }));
      break;
    } catch (err) {
      // ONLY a signature mismatch means "wrong key, try the next". Expiry,
      // audience and algorithm failures are real rejections and must not be
      // masked by retrying against another key.
      if ((err as { code?: string })?.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
        lastErr = err;
        continue;
      }
      throw err;
    }
  }
  if (!payload) {
    throw lastErr ?? new Error("master token did not verify against any configured MASTER_PUBLIC_KEY");
  }

  const verified = payload as VerifiedMasterToken;
  if (requiredScope && verified.scope !== requiredScope) throw new Error("scope mismatch");
  return verified;
}
