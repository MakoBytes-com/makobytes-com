import { NextRequest, NextResponse } from "next/server";
import { recordEvent, type EventRecord } from "@/lib/admin/storage";
import { randomBytes, createHash } from "crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { serverSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hard cap on meta payload size — anyone POSTing here can attach an arbitrary
// JSON object. Without a cap a single client could push megabyte-scale junk
// per event and fill the analytics store.
const MAX_META_BYTES = 1024;

// Per-IP rate limit: 30 events / minute, sliding window. This is generous for
// a real visitor (every page view + a handful of clicks) but kills any
// scripted abuser. Initialized lazily so missing env vars don't blow up at
// import time during local dev.
let ratelimit: Ratelimit | null | undefined;
function getRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    ratelimit = null; // KV not wired (local dev) — skip rate limiting
    return ratelimit;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "ratelimit:track",
    analytics: false,
  });
  return ratelimit;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

/**
 * Public event tracking endpoint.
 * Called from client components for page views and button clicks.
 *
 * Body: { type, page, meta? }
 * Response: { ok: true } — never returns an error to the client so a
 *   tracking failure (or rate-limit hit) never affects user-facing UX,
 *   and an attacker can't probe whether they're being throttled.
 */
export async function POST(req: NextRequest) {
  try {
    // Rate-limit by client IP first — cheapest rejection path.
    const rl = getRatelimit();
    if (rl) {
      const ip = getClientIp(req);
      const { success } = await rl.limit(ip);
      if (!success) {
        // Silent drop — opaque success response, no Retry-After header.
        return NextResponse.json({ ok: true });
      }
    }

    const body = await req.json().catch(() => ({}));
    const type: string = String(body.type || "unknown").slice(0, 64);
    const page: string = String(body.page || "/").slice(0, 256);

    // Validate + size-cap meta. Reject anything that doesn't fit cleanly
    // rather than silently truncating (truncation produces invalid JSON in
    // downstream consumers). EventRecord.meta is Record<string, string>, so
    // also coerce every value to a string and drop non-primitive entries.
    let meta: Record<string, string> | undefined;
    if (body.meta && typeof body.meta === "object" && !Array.isArray(body.meta)) {
      const raw = body.meta as Record<string, unknown>;
      const sanitized: Record<string, string> = {};
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
          sanitized[String(k).slice(0, 64)] = String(v).slice(0, 256);
        }
      }
      if (JSON.stringify(sanitized).length <= MAX_META_BYTES) {
        meta = sanitized;
      }
    }

    const ref = req.headers.get("referer") || undefined;
    const ua = req.headers.get("user-agent") || undefined;

    const record: EventRecord = {
      id: randomBytes(8).toString("hex"),
      type,
      page,
      ts: Date.now(),
      ref: ref?.slice(0, 256),
      ua: ua?.slice(0, 256),
      meta,
    };

    await recordEvent(record);

    // Dual-write raw rows to Supabase (pageviews → page_views, clicks →
    // analytics_events) — the fleet portal's master endpoints read these. The
    // KV counters above keep the /admin dashboard working. Best-effort: a
    // Supabase hiccup must never break tracking.
    try {
      if (!page.startsWith("/admin")) {
        const sessionRaw = typeof body.sessionId === "string" ? body.sessionId.slice(0, 40) : null;
        const referrerRaw =
          typeof body.referrer === "string" && body.referrer
            ? String(body.referrer).slice(0, 300)
            : ref?.slice(0, 300) || null;
        const ip = getClientIp(req);
        const day = new Date().toISOString().slice(0, 10);
        const visitor = createHash("sha256").update(`${ip}|${ua ?? ""}|${day}`).digest("hex").slice(0, 16);
        const country = req.headers.get("x-vercel-ip-country") ?? null;
        const supabase = serverSupabase();

        if (type.startsWith("pageview")) {
          await supabase.from("page_views").insert({
            path: page,
            referrer: referrerRaw,
            ua: ua?.slice(0, 300) ?? null,
            country,
            visitor,
            session_id: sessionRaw,
          });
        } else {
          await supabase.from("analytics_events").insert({
            event_type: type,
            path: page,
            meta: meta ?? null,
            visitor,
            session_id: sessionRaw,
          });
        }
      }
    } catch (dbErr) {
      console.error("[/api/track] supabase dual-write failed", dbErr);
    }
  } catch (err) {
    console.error("[/api/track] failed", err);
  }
  return NextResponse.json({ ok: true });
}
