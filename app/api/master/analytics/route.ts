// Master CP analytics-pull endpoint. Returns the canonical fleet analytics
// shape (matching the Mako fleet data model) so master's per-client analytics
// tab renders directly from a cached snapshot without ever fanning out live.
//
// This app is on supabase-js against a REMOTE schema (no SQL/RPC layer), so we
// fetch a bounded, 30-day-windowed set of raw rows and bucket in JS. Every
// query is windowed to 30 days, excludes /admin* paths, and is row-capped so
// the master pull stays well under its 8s timeout.
//
// Column reality (verified against this repo's own code):
//   page_views:       path, referrer, ua, country, visitor, session_id, created_at
//                     (insert: app/api/track/route.ts)
//   analytics_events: event_type, path, meta, visitor, session_id, created_at
//                     (insert: app/api/track/route.ts)
// There is no `name`/`data` column here (unlike the Bulldog reference), so
// "conversions" maps to click_download events and "events" groups by event_type.

import { NextResponse, type NextRequest } from "next/server";
import { serverSupabase } from "@/lib/supabase";
import { verifyMasterToken } from "@/lib/master-jwt";

export const dynamic = "force-dynamic";

const DAYS = 30;
const ROW_CAP = 20000; // matches the admin analytics page fetch cap

type PvRow = {
  path: string | null;
  referrer: string | null;
  country: string | null;
  session_id: string | null;
  created_at: string;
};
type AeRow = { event_type: string | null; created_at: string };

function startOfDayUTCDaysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
function shortDate(d: Date): string {
  return d.toLocaleString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" });
}
function normalizeReferrer(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "").toLowerCase();
    if (!host || host === "localhost") return null;
    if (host.endsWith("makobytes.com")) return null; // self-referral
    return host;
  } catch {
    const t = raw.trim();
    return t.length ? t.slice(0, 120) : null;
  }
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", CA: "Canada", MX: "Mexico", GB: "United Kingdom", IE: "Ireland",
  DE: "Germany", FR: "France", NL: "Netherlands", ES: "Spain", IT: "Italy", AU: "Australia",
  NZ: "New Zealand", IN: "India", JP: "Japan", CN: "China", SG: "Singapore", BR: "Brazil",
  ZA: "South Africa", AE: "United Arab Emirates", IL: "Israel", PH: "Philippines", KR: "South Korea",
  SE: "Sweden", NO: "Norway", DK: "Denmark", FI: "Finland", PL: "Poland", PT: "Portugal",
  BE: "Belgium", CH: "Switzerland", AT: "Austria", TR: "Turkey",
};

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ ok: false, error: "missing bearer token" }, { status: 401 });
  }

  try {
    await verifyMasterToken(auth.slice("Bearer ".length).trim(), "analytics.read");
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "verification failed" },
      { status: 401 },
    );
  }

  try {
    const supabase = serverSupabase();
    const since = startOfDayUTCDaysAgo(DAYS - 1).toISOString();

    const [pvRes, aeRes] = await Promise.all([
      supabase
        .from("page_views")
        .select("path, referrer, country, session_id, created_at")
        .gte("created_at", since)
        .not("path", "ilike", "/admin%")
        .order("created_at", { ascending: false })
        .limit(ROW_CAP),
      supabase
        .from("analytics_events")
        .select("event_type, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(ROW_CAP),
    ]);
    if (pvRes.error) throw pvRes.error;
    if (aeRes.error) throw aeRes.error;

    const pvRows = (pvRes.data ?? []) as PvRow[];
    const aeRows = (aeRes.data ?? []) as AeRow[];

    // ── totals ──
    const sessions = new Set<string>();
    for (const r of pvRows) if (r.session_id) sessions.add(r.session_id);
    let conversions = 0;
    const eventCounts = new Map<string, number>();
    for (const r of aeRows) {
      const name = r.event_type ?? "unknown";
      eventCounts.set(name, (eventCounts.get(name) ?? 0) + 1);
      if (name === "click_download") conversions += 1;
    }
    const totals = { views: pvRows.length, sessions: sessions.size, conversions };

    // ── daily traffic (30 pts, oldest → newest) ──
    const viewsByDay = new Map<string, number>();
    const sessionsByDay = new Map<string, Set<string>>();
    for (const r of pvRows) {
      const k = r.created_at.slice(0, 10);
      viewsByDay.set(k, (viewsByDay.get(k) ?? 0) + 1);
      if (r.session_id) {
        let s = sessionsByDay.get(k);
        if (!s) { s = new Set(); sessionsByDay.set(k, s); }
        s.add(r.session_id);
      }
    }
    const traffic: Array<{ date: string; views: number; sessions: number }> = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = startOfDayUTCDaysAgo(i);
      const k = d.toISOString().slice(0, 10);
      traffic.push({
        date: shortDate(d),
        views: viewsByDay.get(k) ?? 0,
        sessions: sessionsByDay.get(k)?.size ?? 0,
      });
    }

    // ── top pages ──
    const pageCounts = new Map<string, number>();
    for (const r of pvRows) {
      if (!r.path) continue;
      pageCounts.set(r.path, (pageCounts.get(r.path) ?? 0) + 1);
    }
    const topPages = [...pageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    // ── top referrers (named + direct bucket) ──
    const refCounts = new Map<string, number>();
    let direct = 0;
    for (const r of pvRows) {
      const source = normalizeReferrer(r.referrer);
      if (!source) { direct += 1; continue; }
      refCounts.set(source, (refCounts.get(source) ?? 0) + 1);
    }
    const topReferrers = {
      named: [...refCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([source, count]) => ({ source, count })),
      direct,
    };

    // ── top countries ──
    const countryCounts = new Map<string, number>();
    for (const r of pvRows) {
      if (!r.country) continue;
      countryCounts.set(r.country, (countryCounts.get(r.country) ?? 0) + 1);
    }
    const topCountries = [...countryCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([code, count]) => ({ code, name: COUNTRY_NAMES[code] ?? code, count }));

    // ── events (grouped by event_type) ──
    const events = [...eventCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      ok: true,
      totals,
      traffic,
      topPages,
      topReferrers,
      topCountries,
      timeOnPage: [], // not tracked on this app
      events,
      ctaByLocation: [], // no CTA-location event convention on this app
      webVitals: [], // web-vitals events not collected on this app
      webVitalsByPath: [],
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "internal error" },
      { status: 500 },
    );
  }
}
