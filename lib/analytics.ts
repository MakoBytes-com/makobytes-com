// Analytics aggregation — pure functions over raw page_view rows. Mirrors the
// Mako fleet pattern (makologics.com/src/lib/analytics/queries.ts): raw rows in,
// dashboard-ready shapes out. Computed in TS rather than SQL so it stays on
// supabase-js without RPCs; fine at this volume.

export type PageViewRow = {
  path: string;
  referrer: string | null;
  ua: string | null;
  country: string | null;
  visitor: string | null;
  session_id: string | null;
  created_at: string;
};

export type DailyPoint = { date: string; views: number; visitors: number; sessions: number };
export type Tally = { label: string; value: number };

// ── date helpers (UTC-safe) ──
export function isoDaysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}
function dayKey(iso: string): string {
  return iso.slice(0, 10);
}
function shortDate(key: string): string {
  const [, m, d] = key.split("-");
  return `${Number(m)}/${Number(d)}`;
}

// ── referrer normalization (drops self + www, buckets Direct) ──
export function normalizeReferrer(raw: string | null, selfHost = "makobytes.com"): string {
  if (!raw) return "Direct / none";
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "");
    if (!host || host === selfHost || host === "localhost") return "Direct / none";
    return host;
  } catch {
    const t = raw.trim();
    return t.length ? t.slice(0, 120) : "Direct / none";
  }
}

// ── device / browser from UA ──
export function deviceOf(ua: string | null): "Mobile" | "Tablet" | "Desktop" {
  if (!ua) return "Desktop";
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "Mobile";
  return "Desktop";
}
export function browserOf(ua: string | null): string {
  if (!ua) return "Unknown";
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Other";
}

// ── gap-filled daily traffic series ──
export function trafficDaily(rows: PageViewRow[], days: number): DailyPoint[] {
  const viewsByDay = new Map<string, number>();
  const visitorsByDay = new Map<string, Set<string>>();
  const sessionsByDay = new Map<string, Set<string>>();
  for (const r of rows) {
    const k = dayKey(r.created_at);
    viewsByDay.set(k, (viewsByDay.get(k) ?? 0) + 1);
    if (r.visitor) (visitorsByDay.get(k) ?? visitorsByDay.set(k, new Set()).get(k)!).add(r.visitor);
    if (r.session_id) (sessionsByDay.get(k) ?? sessionsByDay.set(k, new Set()).get(k)!).add(r.session_id);
  }
  const out: DailyPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const k = dayKey(isoDaysAgo(i));
    out.push({
      date: shortDate(k),
      views: viewsByDay.get(k) ?? 0,
      visitors: visitorsByDay.get(k)?.size ?? 0,
      sessions: sessionsByDay.get(k)?.size ?? 0,
    });
  }
  return out;
}

// ── generic top-N tally ──
function tally(items: string[], limit = 10): Tally[] {
  const m = new Map<string, number>();
  for (const i of items) m.set(i, (m.get(i) ?? 0) + 1);
  return [...m.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, limit);
}

export function topPages(rows: PageViewRow[]) {
  return tally(rows.map((r) => r.path));
}
export function topReferrers(rows: PageViewRow[]) {
  return tally(rows.map((r) => normalizeReferrer(r.referrer)));
}
export function topCountries(rows: PageViewRow[]) {
  return tally(rows.map((r) => r.country ?? "??"));
}
export function deviceSplit(rows: PageViewRow[]): Tally[] {
  return tally(rows.map((r) => deviceOf(r.ua)), 3);
}
export function browserSplit(rows: PageViewRow[]): Tally[] {
  return tally(rows.map((r) => browserOf(r.ua)), 6);
}

// ── sessions + average session duration (JS analogue of the SQL LEAD() dwell) ──
export function sessionStats(rows: PageViewRow[]): { sessions: number; avgSeconds: number; avgDepth: number } {
  const bySession = new Map<string, number[]>();
  for (const r of rows) {
    if (!r.session_id) continue;
    (bySession.get(r.session_id) ?? bySession.set(r.session_id, []).get(r.session_id)!).push(new Date(r.created_at).getTime());
  }
  let totalSeconds = 0;
  let counted = 0;
  let totalDepth = 0;
  for (const times of bySession.values()) {
    times.sort((a, b) => a - b);
    totalDepth += times.length;
    const first = times[0];
    const last = times[times.length - 1];
    if (times.length >= 2 && first !== undefined && last !== undefined) {
      const secs = (last - first) / 1000;
      if (secs >= 2 && secs <= 1800) { totalSeconds += secs; counted += 1; }
    }
  }
  return {
    sessions: bySession.size,
    avgSeconds: counted ? Math.round(totalSeconds / counted) : 0,
    avgDepth: bySession.size ? Math.round((totalDepth / bySession.size) * 10) / 10 : 0,
  };
}

export function uniqueVisitors(rows: PageViewRow[]): number {
  return new Set(rows.filter((r) => r.visitor).map((r) => r.visitor)).size;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", GB: "United Kingdom", CA: "Canada", AU: "Australia", DE: "Germany",
  FR: "France", IN: "India", BR: "Brazil", JP: "Japan", NL: "Netherlands", ES: "Spain",
  IT: "Italy", MX: "Mexico", SE: "Sweden", PL: "Poland", "??": "Unknown",
};
export function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}
