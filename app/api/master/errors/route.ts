// Master CP errors-pull endpoint (GET only). Master signs a JWT with
// scope=errors.read and fetches this so its per-client errors tab can render a
// Sentry-style summary without owning the raw rows.
//
// This app's error_events schema (verified against lib/errlog.ts insert and
// admin errors read) is:
//   id, source, context, message, stack, meta, created_at
// It has NO fingerprint / level / module / resolved_at columns (unlike the
// Bulldog reference). So we synthesize:
//   - fingerprint = sha256(context|message) truncated (stable per error kind)
//   - level       = "error" (no severity column)
//   - module      = context
//   - resolved    = false  (rows are deleted, not resolved — there is no
//                    resolved concept, so every existing row is "open")
// Grouping/aggregation is done in JS over a bounded, newest-first window since
// supabase-js can't GROUP BY; counts use fast head-only count queries.

import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "crypto";
import { serverSupabase } from "@/lib/supabase";
import { verifyMasterToken } from "@/lib/master-jwt";

export const dynamic = "force-dynamic";

const GROUP_FETCH_CAP = 5000; // newest rows scanned for grouping

type ErrorRow = {
  source: string | null;
  context: string | null;
  message: string | null;
  created_at: string;
};

type Group = {
  fingerprint: string;
  count: number;
  level: "error";
  module: string;
  message: string;
  last_seen: string;
  first_seen: string;
  resolved: boolean;
};

function fingerprintOf(context: string, message: string): string {
  return createHash("sha256").update(`${context}|${message}`).digest("hex").slice(0, 16);
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ ok: false, error: "missing bearer token" }, { status: 401 });
  }

  try {
    await verifyMasterToken(auth.slice("Bearer ".length).trim(), "errors.read");
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "verification failed" },
      { status: 401 },
    );
  }

  try {
    const supabase = serverSupabase();
    const now = Date.now();
    const since24h = new Date(now - 86_400_000).toISOString();
    const since7d = new Date(now - 7 * 86_400_000).toISOString();

    const [rowsRes, totalRes, open24hRes, open7dRes] = await Promise.all([
      supabase
        .from("error_events")
        .select("source, context, message, created_at")
        .order("created_at", { ascending: false })
        .limit(GROUP_FETCH_CAP),
      supabase.from("error_events").select("id", { count: "exact", head: true }),
      supabase
        .from("error_events")
        .select("id", { count: "exact", head: true })
        .gt("created_at", since24h),
      supabase
        .from("error_events")
        .select("id", { count: "exact", head: true })
        .gt("created_at", since7d),
    ]);
    if (rowsRes.error) throw rowsRes.error;
    if (totalRes.error) throw totalRes.error;
    if (open24hRes.error) throw open24hRes.error;
    if (open7dRes.error) throw open7dRes.error;

    const totalAll = totalRes.count ?? 0;
    const summary = {
      open_24h: open24hRes.count ?? 0,
      open_7d: open7dRes.count ?? 0,
      // No resolved concept in this schema — every existing row is open.
      total_open: totalAll,
      total_all: totalAll,
    };

    // Bucket newest-first rows by synthesized fingerprint.
    const rows = (rowsRes.data ?? []) as ErrorRow[];
    const byFp = new Map<string, Group>();
    for (const r of rows) {
      const context = r.context ?? "unknown";
      const message = r.message ?? "";
      const fp = fingerprintOf(context, message);
      const existing = byFp.get(fp);
      if (!existing) {
        // rows are ordered newest-first, so the first row we see for a
        // fingerprint carries the most recent message/module + last_seen.
        byFp.set(fp, {
          fingerprint: fp,
          count: 1,
          level: "error",
          module: context,
          message,
          last_seen: r.created_at,
          first_seen: r.created_at,
          resolved: false,
        });
      } else {
        existing.count += 1;
        if (r.created_at < existing.first_seen) existing.first_seen = r.created_at;
        if (r.created_at > existing.last_seen) existing.last_seen = r.created_at;
      }
    }

    const groups = [...byFp.values()]
      .sort((a, b) => (a.last_seen < b.last_seen ? 1 : a.last_seen > b.last_seen ? -1 : 0))
      .slice(0, 50);

    return NextResponse.json({
      ok: true,
      summary,
      groups,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "internal error" },
      { status: 500 },
    );
  }
}
