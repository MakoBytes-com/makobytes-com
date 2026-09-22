---
name: Build Progress
description: Running log of completed and pending work
type: project
updated: 2026-05-03
originSessionId: e2e2588d-0283-401b-bbce-013770098934
---
## Done — 2026-05-03 (theme + audit + verification session)

### Theme
- ✅ Full retheme: dark cinematic → makobot.com light navy palette
- ✅ Hero image: Gemini-generated curved-monitor scene, navy/white,
  text overlay on the left (white gradient mask on mobile)
- ✅ Replaced AI Prompt Hive app card with MakoBot card (links to
  https://makobot.com)
- ✅ Sitewide email change: `hello@` → `admin@makobytes.com`
- ✅ Admin dashboard rethemed (login, dashboard, stat cards, events
  feed, trend chart, logout button) to match public site

### Security audit fixes
- ✅ /api/track per-IP sliding-window rate limit (30 req/min) via
  @upstash/ratelimit + @upstash/redis
- ✅ /api/track meta capped at 1 KB, string-coerced
- ✅ /api/polar-webhook post-signature type guard validates the
  benefit_grant.created shape (10/10 fuzz cases pass)
- ✅ CSP allows https://*.googleusercontent.com so admin avatar loads

### SEO audit fixes
- ✅ app/icon.tsx (256×256), app/apple-icon.tsx (180×180),
  app/opengraph-image.tsx (1200×630) — Next-native via next/og,
  replaces broken /favicon.ico /apple-touch-icon.png /og-image.png
- ✅ public/llms.txt + public/llms-full.txt for AI-search readiness
- ✅ app/robots.ts with explicit AI-crawler allows (15+ named bots)
- ✅ app/sitemap.ts lastModified pinned to a Date constant
- ✅ PromptPixel <title> double-suffix fixed

### Verification
- ✅ Visual confirm: OG image, favicon, apple-icon all render correctly
- ✅ /api/track smoke + burst (50 reqs) + edge cases all 200
- ✅ Polar webhook type guard fuzz: 10/10 pass
- ✅ Manual perf snapshot: TTFB 152 ms, 10 KB gzipped HTML, 63 KB hero

## Done — 2026-04-29

- ✅ Vercel breach response: all 10 sensitive env vars rotated and
  re-added as Sensitive. New Upstash KV provisioned. AUTH_SECRET
  regenerated; AUTH_GOOGLE_SECRET rotated by Russell. See
  [project_breach_response.md](project_breach_response.md).

## Done — 2026-04-09 (and earlier)

- ✅ PromptPixel page: 5 Pro features, demo carousel, FAQ, pricing
- ✅ Replaced shared-password admin auth with Google OAuth (Auth.js v5)
- ✅ Admin dashboard with Vercel KV analytics
- ✅ AI Prompt Hive card (later replaced with MakoBot)
- ✅ Cloudflare DNS, Vercel domain config
- ✅ Privacy + terms pages
- ✅ Sitemap.ts, mobile touch fixes

## In Progress / Next Up

- [ ] Russell: Polar test-mode purchase to confirm email-license-key
      delivery path end-to-end (only thing requiring his hands)
- [ ] Russell: Lighthouse run via https://pagespeed.web.dev/analysis?url=https://makobytes.com
- [ ] Russell: OG card preview via https://www.opengraph.xyz/
- [ ] Russell: confirm `audit_smoke_test` event appeared in /admin/dashboard
- [ ] Wire Polar checkout link into "Buy Pro" button (waiting on Polar checkout issue)
- [ ] Russell creating GitHub release on russellsailors-hub/PromptPixel-Source with v2 exe → wire download link
- [ ] Add real testimonials
- [ ] Produce Animaker video
- [ ] Mobile hamburger menu (nav links currently hidden on mobile with no fallback)

## Blocked / Waiting On

- **Polar checkout**: Has an issue, Russell waiting on support.
- **v2 download**: Russell creating release on russellsailors-hub/PromptPixel-Source.
- **postcss CVE GHSA-qx2v-qp2m-jg93**: transitive via Next 16, fix would
  require Next 16 → 9 downgrade. Waiting on upstream Next patch.
  Realistically unexploitable here (no user-supplied CSS surface).
- **Pixa MCP**: out of credits — image generation has to come via
  Russell's own Gemini access until topped up.

## Notes

- Site: https://makobytes.com (live)
- Hero image source: Gemini-generated, processed by sharp WebP q=88,
  logo painted out via sharp composite at sampled bg color #fdfefd
- Admin: /admin (Google OAuth allowlist) → /admin/dashboard
- Payment processor: Polar
- Tracking: /api/track → Vercel KV (rate-limited 30/min/IP)
- v1 repo: russellsailors-hub/PromptPixel (OLD — v1.0.0, v1.0.1)
- v2 source repo: russellsailors-hub/PromptPixel-Source
- MakoBot project: separate domain at makobot.com, sister product
