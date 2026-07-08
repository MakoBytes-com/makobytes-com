// Inbound JWT verification for the master control-plane fleet-reporting
// endpoints (/api/master/*). The master CP signs a short-lived RS256 JWT
// (audience = this client's CLIENT_ID, scope = "<area>.read") and calls the
// read-only master endpoints below. We verify against MASTER_PUBLIC_KEY.
//
// Fails closed: any missing env var, bad signature, wrong audience, wrong
// algorithm, or scope mismatch throws — the routes translate that into a 401.

import { importSPKI, jwtVerify, type JWTPayload } from "jose";

export type VerifiedMasterToken = JWTPayload & { scope: string; client_id?: string };

export async function verifyMasterToken(token: string, requiredScope?: string): Promise<VerifiedMasterToken> {
  const pemRaw = process.env.MASTER_PUBLIC_KEY;
  if (!pemRaw) throw new Error("MASTER_PUBLIC_KEY env var is not set");
  const pem = pemRaw.replace(/\\n/g, "\n").trim();
  const aud = (process.env.CLIENT_ID ?? "").trim();
  if (!aud) throw new Error("CLIENT_ID env var is not set");
  const key = await importSPKI(pem, "RS256");
  const { payload } = await jwtVerify(token, key, { audience: aud, algorithms: ["RS256"] });
  const verified = payload as VerifiedMasterToken;
  if (requiredScope && verified.scope !== requiredScope) throw new Error("scope mismatch");
  return verified;
}
