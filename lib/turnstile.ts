// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare Turnstile — server-side token verification.
//
// The widget on the waitlist form produces a token (`cf-turnstile-response`)
// that we POST to /api/waitlist. This helper verifies that token against
// Cloudflare's `siteverify` endpoint before we accept the signup.
//
// Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
// ─────────────────────────────────────────────────────────────────────────────

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: string };

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Dev / unconfigured: if no secret is set, treat as a passthrough so local
  // UI work isn't blocked. Production deploys MUST have TURNSTILE_SECRET_KEY
  // set or every submission will be rejected (see /api/waitlist).
  if (!secret) {
    return { ok: true };
  }

  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  let res: Response;
  try {
    res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      // Don't cache verification responses
      cache: "no-store",
    });
  } catch {
    return { ok: false, reason: "verify_network_error" };
  }

  if (!res.ok) {
    return { ok: false, reason: `verify_http_${res.status}` };
  }

  const json = (await res.json().catch(() => null)) as
    | { success?: boolean; "error-codes"?: string[] }
    | null;
  if (!json) {
    return { ok: false, reason: "verify_parse_error" };
  }

  if (json.success) return { ok: true };
  const codes = json["error-codes"] ?? [];
  return {
    ok: false,
    reason: codes.length > 0 ? codes.join(",") : "verify_failed",
  };
}
