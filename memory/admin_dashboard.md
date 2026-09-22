---
name: Admin dashboard architecture
description: How the makobytes.com admin dashboard works (built 2026-04-09 in commit 1d39acd)
type: project
originSessionId: 148a86eb-82a1-4146-8847-74e614df860f
---
makobytes.com has a self-hosted admin dashboard at `/admin` for tracking page views, downloads, buy clicks, and a conversion funnel.

## Routes
- `/admin` — login form (single password)
- `/admin/dashboard` — auth-gated stats page (server component, fetches from Vercel KV)
- `POST /api/track` — public event tracking endpoint (called by client components)
- `POST /api/admin/login` — password verify, sets signed cookie
- `POST /api/admin/logout` — clears cookie

## Storage: Vercel KV (Redis)
Schema:
- `counters:total:<eventType>` — integer counter, all-time
- `counters:daily:<eventType>:<YYYY-MM-DD>` — integer counter, per day
- `events:log` — list of last 100 events as JSON

Tracked event types (`lib/admin/storage.ts` TRACKED_EVENTS):
- `pageview`, `pageview_home`, `pageview_promptpixel`
- `click_download`, `click_buy`, `click_app_card`, `click_cta`

## Auth: single-password env var
- `ADMIN_PASSWORD` env var holds the shared admin password (set in Vercel project settings)
- `ADMIN_SESSION_SECRET` is the HMAC secret for signing session tokens (falls back to ADMIN_PASSWORD if unset)
- Login mints a token: `<issuedTimestamp>.<nonce>.<hmacSig>` and drops it in an httpOnly cookie
- Session valid for 7 days
- All compares are `crypto.timingSafeEqual` to prevent timing attacks
- 600ms artificial delay on failed logins

## Required env vars on Vercel
- `KV_REST_API_URL` — auto-injected when KV database is connected
- `KV_REST_API_TOKEN` — auto-injected when KV database is connected
- `ADMIN_PASSWORD` — set manually in project settings
- `ADMIN_SESSION_SECRET` — optional, falls back to ADMIN_PASSWORD

## Graceful degradation
Every storage call checks `isStorageConfigured()` and returns empty defaults if KV isn't connected. The dashboard renders zeros + a yellow "setup required" callout pointing to the Vercel KV setup steps. Tracking endpoints always return 200 even on failure so user UX never breaks.

## Components
- `lib/admin/storage.ts` — KV wrapper (recordEvent, getTotal, getToday, getLastNDays, getRecentEvents)
- `lib/admin/auth.ts` — verifyPassword, createSessionToken, verifySessionToken, isAuthed
- `components/admin/track-pageview.tsx` — client component, fires once on mount
- `components/admin/track-link.tsx` — wraps `<a>` with click tracking before navigation
- `components/admin/stat-card.tsx` — server component, big number + label + today subline
- `components/admin/trend-chart.tsx` — Recharts AreaChart wrapper, multi-series gradient fill
- `components/admin/events-feed.tsx` — table of recent events with icons + time-ago
- `app/admin/page.tsx` — login screen
- `app/admin/login-form.tsx` — client login form
- `app/admin/dashboard/page.tsx` — main dashboard (4 cards, funnel, trend, feed)
- `app/admin/dashboard/logout-button.tsx` — client logout button

## Instrumentation in main pages
- `app/page.tsx` (hub): TrackPageView "pageview_home", PromptPixel nav button uses TrackLink "click_app_card"
- `app/promptpixel/page.tsx`: TrackPageView "pageview_promptpixel", 3 download buttons + 1 buy button wrapped in TrackLink

## Phase 2 ideas (not yet built)
- GitHub Releases API integration for real .exe download counts (needs repo URL)
- IP geolocation for visitor map
- Top referrers chart
- CSV export endpoint
- Email alerts on threshold events
- Real download URL hookup (currently `#download` is a placeholder anchor)

## When debugging
- Check `isStorageConfigured()` first — if false, KV env vars are missing
- All KV operations are wrapped in try/catch and log to console.error on failure
- Dashboard fetches all stats in `Promise.all` for parallelism
- Event log is capped at 100 entries via `lpush` + `ltrim`
