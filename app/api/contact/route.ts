import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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
 * - Delivery via Resend from the verified makobytes.com domain,
 *   straight to the monitored makologics inbox (no forwarding hops —
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

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY missing — submission not delivered");
    return NextResponse.json(
      { ok: false, error: "Mail service unavailable — email admin@makobytes.com directly." },
      { status: 500 },
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `makobytes.com contact — ${name}`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#26303b">
        <p style="margin:0 0 4px"><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>
        <p style="margin:0 0 16px"><strong>Via:</strong> makobytes.com — MakoOS contact.eml</p>
        <div style="border:1px solid #e0e6ed;border-radius:8px;padding:14px;white-space:pre-wrap">${esc(message)}</div>
      </div>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[contact] resend send failed", res.status, detail.slice(0, 300));
    return NextResponse.json(
      { ok: false, error: "Sending failed — email admin@makobytes.com directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
