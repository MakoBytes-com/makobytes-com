/**
 * Outbound email through Cloudflare Email Service.
 *
 * Migrated from Resend 2026-09-16: the Resend account no longer contained
 * makobytes.com, so contact-form sends were 403ing ("domain is not
 * verified") and submissions silently reached nobody. makobytes.com was
 * onboarded to Cloudflare Email Service the same day (verified sending).
 * Fleet standard since 2026-09-03; reference implementations are
 * handpenned.com/lib/mail.ts and makoanswer/lib/mail.ts.
 *
 * Fails loud rather than silent: callers get `ok: false` plus the reason so
 * they can log it against the submission it belonged to.
 *
 * SERVER ONLY.
 */

export interface MailResult {
  ok: boolean;
  error?: string;
}

interface SendResponse {
  success: boolean;
  errors?: { code?: number; message?: string }[];
}

export function mailConfigured(): boolean {
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_EMAIL_TOKEN);
}

/** Crude but adequate text fallback so every message carries a text part. */
function textFromHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendMail(input: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  /** Bound the whole send — a hung mail API must never eat the route's time budget. */
  timeoutMs?: number;
}): Promise<MailResult> {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_EMAIL_TOKEN;
  if (!account || !token) {
    console.warn("[mail] CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_EMAIL_TOKEN missing — mail NOT sent:", input.subject);
    return { ok: false, error: "Email is not configured on this deployment." };
  }

  const from = input.from ?? "MakoBytes Contact <contact@makobytes.com>";
  const recipients = (Array.isArray(input.to) ? input.to : [input.to]).map((s) => s.trim()).filter(Boolean);
  if (recipients.length === 0) return { ok: false, error: "No recipients." };
  const text = input.text ?? textFromHtml(input.html);

  async function sendOne(fromAddr: string, to: string): Promise<string | null> {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/email/sending/send`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromAddr,
          to,
          reply_to: input.replyTo || undefined,
          subject: input.subject,
          text,
          html: input.html,
        }),
        cache: "no-store",
        signal: input.timeoutMs ? AbortSignal.timeout(input.timeoutMs) : undefined,
      },
    );
    const json = (await res.json().catch(() => ({}))) as SendResponse;
    if (!res.ok || !json.success) {
      return json.errors?.map((e) => e.message).filter(Boolean).join("; ") || `HTTP ${res.status}`;
    }
    return null;
  }

  // One request per recipient: keeps the failure surface per-address, so one
  // bad mailbox never sinks another recipient's copy.
  const failures: string[] = [];
  const fallbackFrom = process.env.MAIL_FALLBACK_FROM;
  for (const to of recipients) {
    try {
      let why = await sendOne(from, to);
      // A sender domain that isn't onboarded to Email Service refuses with
      // "sending_disabled". A wrong-brand sender beats a lost submission, so
      // retry once from the fallback identity (a domain known to be onboarded)
      // rather than dropping the mail.
      if (why && /sending_disabled/.test(why) && fallbackFrom && fallbackFrom !== from) {
        console.warn(`[mail] '${from}' cannot send (domain not onboarded) — retrying from '${fallbackFrom}'`);
        why = await sendOne(fallbackFrom, to);
      }
      if (why) failures.push(`${to}: ${why}`);
    } catch (e) {
      failures.push(`${to}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (failures.length > 0) {
    console.error("[mail] Cloudflare rejected:", failures.join(" | "));
    return { ok: false, error: failures.join(" | ") };
  }
  return { ok: true };
}
