import { kv } from "@vercel/kv";

/**
 * Vercel KV wrapper for analytics storage.
 *
 * Schema:
 *   counters:total:<eventType>            -> integer counter (all-time)
 *   counters:daily:<eventType>:<YYYY-MM-DD> -> integer counter (per day)
 *   events:log                            -> list of last 100 events as JSON
 *
 * Graceful fallback: if KV env vars are missing (e.g. local dev or
 * pre-configuration), every function silently no-ops or returns empty
 * defaults so the site never crashes on missing infrastructure.
 */

export const TRACKED_EVENTS = [
  "pageview",
  "pageview_home",
  "click_download",
  "click_buy",
  "click_app_card",
  "click_cta",
] as const;

export type TrackedEvent = (typeof TRACKED_EVENTS)[number];

export type EventRecord = {
  id: string;
  type: TrackedEvent | string;
  page: string;
  ts: number;
  ref?: string;
  ua?: string;
  meta?: Record<string, string>;
};

export type DailyCount = {
  date: string;
  count: number;
};

const EVENT_LOG_KEY = "events:log";
const EVENT_LOG_MAX = 100;

function isKvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function dateKey(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export async function recordEvent(record: EventRecord): Promise<void> {
  if (!isKvConfigured()) return;

  const day = todayKey();
  const totalKey = `counters:total:${record.type}`;
  const dailyKey = `counters:daily:${record.type}:${day}`;

  try {
    // Increment counters and push event to log in parallel
    await Promise.all([
      kv.incr(totalKey),
      kv.incr(dailyKey),
      kv.lpush(EVENT_LOG_KEY, record),
      kv.ltrim(EVENT_LOG_KEY, 0, EVENT_LOG_MAX - 1),
    ]);
  } catch (err) {
    // Never let analytics errors break a page render
    console.error("[storage.recordEvent] failed", err);
  }
}

export async function getTotal(eventType: string): Promise<number> {
  if (!isKvConfigured()) return 0;
  try {
    const v = await kv.get<number>(`counters:total:${eventType}`);
    return v ?? 0;
  } catch {
    return 0;
  }
}

export async function getToday(eventType: string): Promise<number> {
  if (!isKvConfigured()) return 0;
  try {
    const v = await kv.get<number>(
      `counters:daily:${eventType}:${todayKey()}`,
    );
    return v ?? 0;
  } catch {
    return 0;
  }
}

export async function getLastNDays(
  eventType: string,
  days: number,
): Promise<DailyCount[]> {
  if (!isKvConfigured()) {
    return Array.from({ length: days }, (_, i) => ({
      date: dateKey(days - 1 - i),
      count: 0,
    }));
  }

  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    keys.push(`counters:daily:${eventType}:${dateKey(i)}`);
  }

  try {
    const values = await kv.mget<(number | null)[]>(...keys);
    return keys.map((k, i) => ({
      date: k.split(":").pop() ?? "",
      count: values?.[i] ?? 0,
    }));
  } catch {
    return Array.from({ length: days }, (_, i) => ({
      date: dateKey(days - 1 - i),
      count: 0,
    }));
  }
}

export async function getRecentEvents(
  limit: number = 50,
): Promise<EventRecord[]> {
  if (!isKvConfigured()) return [];
  try {
    const raw = await kv.lrange<EventRecord | string>(EVENT_LOG_KEY, 0, limit - 1);
    return raw
      .map((s) => {
        if (typeof s === "object" && s !== null) return s as EventRecord;
        try {
          return JSON.parse(s as string) as EventRecord;
        } catch {
          return null;
        }
      })
      .filter((x): x is EventRecord => x !== null);
  } catch {
    return [];
  }
}

export function isStorageConfigured(): boolean {
  return isKvConfigured();
}
