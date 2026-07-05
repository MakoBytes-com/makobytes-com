"use client";

// Per-tab session id with a 30-minute sliding window (fleet pattern from
// pixelcopy). Cookieless: lives in sessionStorage, so it dies with the tab.
const KEY = "mb_session_id";
const TS_KEY = "mb_session_ts";
const WINDOW_MS = 30 * 60 * 1000;

export function sessionId(): string | null {
  try {
    const now = Date.now();
    const last = Number(sessionStorage.getItem(TS_KEY) ?? 0);
    let id = sessionStorage.getItem(KEY);
    if (!id || now - last > WINDOW_MS) {
      id = Math.random().toString(36).slice(2) + now.toString(36);
      sessionStorage.setItem(KEY, id);
    }
    sessionStorage.setItem(TS_KEY, String(now));
    return id;
  } catch {
    return null; // storage blocked — analytics degrade gracefully
  }
}
