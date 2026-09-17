import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { sendMail } from "@/lib/mail";
import { serverSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Contact form backend for the MakoOS contact.eml window.
 *
 * - Validates + length-caps every field.
 * - `company` is a honeypot: bots that fill it get a cheerful 200 and
 *   nothing else happens.
 * - Rate-limited per IP via the same Upstash KV the track route uses
 *   (skipped gracefully when KV isn't wired, e.g. local dev).
 * - Every accepted submission is stored in `contact_submissions` BEFORE the
 *   email goes out, so a mail-provider outage can never lose one again
 *   (the Resend 403 outage of 2026-09 lost every submission it swallowed).
 * - Delivery via Cloudflare Email Service from the verified makobytes.com
 *   domain, straight to the monitored makologics inbox (no forwarding hops —
 *   lesson learned from the makoai.studio black-hole incident).
 */

const TO = "admin@makologics.com";
const FROM = "MakoBytes Contact <contact@makobytes.com>";

let ratelimit: Ratelimit | null | undefined;
function getRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    ratelimit = null;
    return ratelimit;
  }
  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "ratelimit:contact",
    analytics: false,
  });
  return ratelimit;
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim().slice(0, 120) : "";
  const email = typeof b.email === "string" ? b.email.trim().slice(0, 200) : "";
  const message = typeof b.message === "string" ? b.message.trim().slice(0, 5000) : "";
  const honeypot = typeof b.company === "string" ? b.company.trim() : "";

  // Bots that fill the honeypot get a happy nothing.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || !message || !EMAIL_RX.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, a valid email, and a message." },
      { status: 400 },
    );
  }

  // Turnstile — the captcha gate. Fails closed: no secret, no sends.
  const captcha = typeof b["cf-turnstile-response"] === "string" ? b["cf-turnstile-response"] : "";
  const tsSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!tsSecret) {
    console.error("[contact] TURNSTILE_SECRET_KEY missing — refusing to send");
    return NextResponse.json(
      { ok: false, error: "Verification unavailable — email admin@makobytes.com directly." },
      { status: 500 },
    );
  }
  const ipForCaptcha =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "";
  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: tsSecret,
      response: captcha,
      ...(ipForCaptcha ? { remoteip: ipForCaptcha } : {}),
    }),
  })
    .then((r) => r.json())
    .catch(() => ({ success: false }));
  if (!verify.success) {
    return NextResponse.json(
      { ok: false, error: "Captcha check didn't pass — give it a second and try again." },
      { status: 400 },
    );
  }

  const rl = getRatelimit();
  if (rl) {
    const ip =
      req.headers.get("x-real-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const { success } = await rl.limit(ip);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "Too many messages — give it a few minutes and try again." },
        { status: 429 },
      );
    }
  }

  // Persist FIRST. Once this row exists the submission cannot be lost, no
  // matter what the mail provider does.
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;
  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;
  let rowId: number | null = null;
  try {
    const { data, error } = await serverSupabase()
      .from("contact_submissions")
      .insert({ name, email, message, ip, user_agent: userAgent })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    rowId = data.id;
  } catch (e) {
    // Storage failing is serious but not a reason to drop the message —
    // fall through and still try to email it.
    console.error("[contact] contact_submissions insert failed:", e instanceof Error ? e.message : e);
  }

  const mail = await sendMail({
    to: TO,
    from: FROM,
    replyTo: email,
    subject: `makobytes.com contact — ${name}`,
    html: `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#26303b">
      <p style="margin:0 0 4px"><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>
      <p style="margin:0 0 16px"><strong>Via:</strong> makobytes.com — MakoOS contact.eml</p>
      <div style="border:1px solid #e0e6ed;border-radius:8px;padding:14px;white-space:pre-wrap">${esc(message)}</div>
    </div>`,
    timeoutMs: 15_000,
  });

  if (rowId !== null) {
    // Record how delivery went; best-effort, the row itself is what matters.
    await serverSupabase()
      .from("contact_submissions")
      .update(
        mail.ok
          ? { email_sent: true, emailed_at: new Date().toISOString(), email_error: null }
          : { email_sent: false, email_error: (mail.error ?? "unknown").slice(0, 500) },
      )
      .eq("id", rowId)
      .then(({ error }) => {
        if (error) console.error("[contact] delivery-status update failed:", error.message);
      });
  }

  if (!mail.ok && rowId === null) {
    // Both the database AND the email failed — the only case where the
    // sender must be told their message did not get through.
    console.error("[contact] TOTAL FAILURE — stored nowhere, emailed nowhere:", mail.error);
    return NextResponse.json(
      { ok: false, error: "Sending failed — email admin@makobytes.com directly." },
      { status: 502 },
    );
  }
  if (!mail.ok) {
    console.error("[contact] email failed but submission is stored (id", rowId, "):", mail.error);
  }

  return NextResponse.json({ ok: true });
}
