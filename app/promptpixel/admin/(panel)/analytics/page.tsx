import Link from "next/link";
import { serverSupabase } from "@/lib/supabase";
import { Stat, Section } from "../ui";
import { TrafficChart, DonutChart, DownloadsChart } from "./charts";
import {
  isoDaysAgo, trafficDaily, topPages, topReferrers, topCountries, deviceSplit,
  browserSplit, sessionStats, uniqueVisitors, formatDuration, countryName,
  type PageViewRow, type Tally,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

const RANGES = [
  { key: "7", label: "7 days", days: 7 },
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "all", label: "All time", days: 3650 },
] as const;
const DEFAULT_RANGE = RANGES[1];

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range = "30" } = await searchParams;
  const sel = RANGES.find((r) => r.key === range) ?? DEFAULT_RANGE;

  const supabase = serverSupabase();
  let q = supabase
    .from("page_views")
    .select("path, referrer, ua, country, visitor, session_id, created_at")
    .order("created_at", { ascending: false })
    .limit(20000);
  if (sel.key !== "all") q = q.gte("created_at", isoDaysAgo(sel.days));
  // Downloads live in analytics_events (click_download from the landing page),
  // not as pseudo page_views like pixelcopy's download:msix rows.
  let dq = supabase
    .from("analytics_events")
    .select("created_at")
    .eq("event_type", "click_download")
    .order("created_at", { ascending: false })
    .limit(20000);
  if (sel.key !== "all") dq = dq.gte("created_at", isoDaysAgo(sel.days));
  const [{ data: rowsRaw }, { data: dlRaw }, { count: activeCount }] = await Promise.all([
    q,
    dq,
    supabase.from("accounts").select("id", { count: "exact", head: true }).eq("subscription_status", "active"),
  ]);

  const rows = (rowsRaw ?? []) as PageViewRow[];
  const dls = (dlRaw ?? []) as PageViewRow[];

  const sess = sessionStats(rows);
  const visitors = uniqueVisitors(rows);
  const downloads = dls.length;
  const traffic = trafficDaily(rows, Math.min(sel.days, 90));
  const dlSeries = trafficDaily(dls, Math.min(sel.days, 90));
  const active = activeCount ?? 0;

  const funnel = [
    { label: "Page views", value: rows.length },
    { label: "Downloads", value: downloads },
    { label: "Paid (Pro)", value: active },
  ];
  const funnelMax = Math.max(1, ...funnel.map((f) => f.value));
  const empty = rows.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Site analytics</h1>
          <p className="text-sm text-white/50">
            {empty ? "Collecting data — visit the site to seed it." : `${sel.label} · ${rows.length} page views · ${visitors} visitors`}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-white/10 p-1">
          {RANGES.map((r) => (
            <Link
              key={r.key}
              href={`/promptpixel/admin/analytics?range=${r.key}`}
              className={`rounded-md px-3 py-1.5 text-sm ${r.key === sel.key ? "bg-[#3B82F6] text-white" : "text-white/60 hover:bg-white/10"}`}
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Page views" value={String(rows.length)} accent />
        <Stat label="Visitors" value={String(visitors)} sub="unique" />
        <Stat label="Sessions" value={String(sess.sessions)} sub={`${sess.avgDepth}/visit`} />
        <Stat label="Avg. time" value={formatDuration(sess.avgSeconds)} sub="on site" />
        <Stat label="Downloads" value={String(downloads)} />
        <Stat label="Conversion" value={visitors ? `${((downloads / visitors) * 100).toFixed(1)}%` : "—"} sub="visitor→dl" />
      </div>

      <Section title="Traffic">
        {empty ? <Empty /> : <TrafficChart data={traffic} />}
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Top pages"><Bars rows={topPages(rows)} link /></Section>
        <Section title="Referrers"><Bars rows={topReferrers(rows)} /></Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Countries">
          {topCountries(rows).length === 0 ? <Empty /> : (
            <ul className="space-y-2">
              {topCountries(rows).map((c) => (
                <li key={c.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-white/70">
                    <span className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-xs text-white/50">{c.label}</span>
                    {countryName(c.label)}
                  </span>
                  <span className="tabular-nums text-white/50">{c.value}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
        <Section title="Devices">{empty ? <Empty /> : <DonutChart data={deviceSplit(rows)} />}</Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Browsers">{empty ? <Empty /> : <DonutChart data={browserSplit(rows)} />}</Section>
        <Section title="Downloads over time">{downloads === 0 ? <Empty /> : <DownloadsChart data={dlSeries} />}</Section>
      </div>

      <Section title="Conversion funnel">
        <div className="space-y-3">
          {funnel.map((f, i) => {
            const prev = i > 0 ? (funnel[i - 1]?.value ?? f.value) : f.value;
            const step = prev > 0 ? ((f.value / prev) * 100).toFixed(0) : "0";
            return (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-28 text-sm text-white/60">{f.label}</div>
                <div className="h-6 flex-1 overflow-hidden rounded bg-white/5">
                  <div className="h-full rounded bg-[#3B82F6]" style={{ width: `${(f.value / funnelMax) * 100}%` }} />
                </div>
                <div className="w-24 text-right text-sm tabular-nums">
                  <span className="font-semibold">{f.value}</span>
                  {i > 0 && <span className="ml-1 text-xs text-white/40">{step}%</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function Bars({ rows, link }: { rows: Tally[]; link?: boolean }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (rows.length === 0) return <Empty />;
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="text-sm">
          <div className="mb-1 flex justify-between gap-2">
            {link ? (
              <a href={r.label} target="_blank" rel="noreferrer" className="truncate text-[#4b9be6] hover:underline">{r.label}</a>
            ) : (
              <span className="truncate text-white/70">{r.label}</span>
            )}
            <span className="shrink-0 tabular-nums text-white/50">{r.value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded bg-white/5">
            <div className="h-full rounded bg-[#3B82F6]" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Empty() {
  return <p className="py-8 text-center text-sm text-white/40">No data in this range yet.</p>;
}
