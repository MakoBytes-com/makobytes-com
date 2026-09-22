---
name: Vercel breach response (2026-04-29)
description: Full rotation of all 10 sensitive env vars on makobytes-com Vercel project after the April 2026 incident. New Upstash KV, new OAuth secret, new AUTH_SECRET. All re-added as Sensitive.
type: project
---

# makobytes-com — Vercel breach response (2026-04-29)

## What was flagged

Vercel dashboard flagged 7 env vars as "Needs Attention" (Apr 9
created, in the breach window): `KV_URL`, `KV_REST_API_URL`,
`KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_REDIS_URL`,
`AUTH_GOOGLE_SECRET`, `AUTH_SECRET`. 3 more (POLAR_*, RESEND_API_KEY)
were post-breach (Apr 20) but stored without Sensitive flag.

## What I did

**Rotated underlying credentials** for the breach-window 7:
- `AUTH_SECRET` — new random base64 (32 bytes), via CLI as Sensitive
  on Production+Preview. Vercel does NOT allow Sensitive vars in
  Development environment, so left unset there (Russell tests on live).
- `AUTH_GOOGLE_SECRET` — Russell generated a new secret for the
  **MakoBytes Web** OAuth client (Client ID `1055659970585-rj3...` in
  the `makobytes` Google Cloud project). Direct test against Google
  token endpoint passed (`invalid_grant` for fake code = creds valid).
- 5 KV vars — old Upstash store `upstash-kv-beige-canvas`
  (`store_6SsZDdtgVIje1NUO`) was DELETED via
  `vercel integration-resource remove ... --disconnect-all --yes`. New
  store `makobytes-kv` provisioned via
  `vercel integration add upstash/upstash-kv`. **Data lost:** analytics
  counters (page views, click events) and webhook dedupe keys (7-day
  TTL on Polar webhook IDs). Both low-value and the code in
  `lib/admin/storage.ts` has graceful fallback for missing KV.

**Promoted to Sensitive** for the post-breach 3:
- `POLAR_WEBHOOK_SECRET`, `POLAR_API_TOKEN`, `RESEND_API_KEY` — values
  preserved (they're post-breach so untainted), just removed and
  re-added with `--sensitive` flag.

**Why the integration-managed KV vars also needed manual re-add:**
Vercel KV integration creates env vars as `Encrypted` but NOT
`Sensitive`. After the new store was provisioned, I had to pull the
new credentials, remove the integration-owned env vars, then re-add
them manually with `--sensitive`. This **detaches them from the
integration's auto-sync** — if credentials are rotated again in the
future, env vars won't auto-update. Acceptable tradeoff for the
Sensitive guarantee post-breach.

## Stored values (chmod 600 on Russell's machine)

`~/.aimemory/makobytes-vercel-*.txt`:
- AUTH_SECRET, AUTH_GOOGLE_SECRET
- POLAR_WEBHOOK_SECRET, POLAR_API_TOKEN, RESEND_API_KEY (preserved)
- KV_URL, KV_REDIS_URL, KV_REST_API_URL, KV_REST_API_TOKEN,
  KV_REST_API_READ_ONLY_TOKEN

## Mid-session fuckup (record so I don't repeat)

After all env rotations, I ran `vercel deploy --prod --yes` from
`/tmp/link-makobytes-com/` — a tmp folder that only had the project
LINK (`.vercel/project.json`), no source code. The "deploy" uploaded
an empty project, replacing the live site. **makobytes.com 404'd for
~3 minutes** until I caught it and re-deployed from the real codebase
at `c:\Users\Russell.Sailors\OneDrive\Desktop\Mako AI
Projects\Web Projects\makobytes.com\`.

**Lesson:** when redeploying via CLI, always `cd` to the actual
codebase folder first. The `vercel link --yes --project NAME` from a
tmp folder is fine for ENV-only operations (like
`vercel env add/rm/ls`), but a deploy from there ships an empty
project. Codified into a feedback memory.

## Final env state

10 of 10 sensitive env vars on makobytes-com are now marked
**Sensitive** (verified via `vercel env pull` returning empty values).
Live site healthy: HTTP 200 on `/`, `/admin`, `/api/auth/providers`.

## RLS / hardening note

This project uses Vercel KV (Upstash Redis), not Supabase, so RLS
isn't applicable. Auth uses NextAuth v5 JWT sessions with an email
allowlist (`ADMIN_ALLOWED_EMAILS`) — only specific emails can access
`/admin`. Polar webhook uses signature verification via
`POLAR_WEBHOOK_SECRET`.

If hardening pass needed in future:
- Confirm Vercel "Deployment Protection" / "Skew Protection" is set
  appropriately (this came up as a 401 on the deploy URL during this
  session — public domain works fine, but the `*.vercel.app` URL
  requires SSO).
- Audit ADMIN_ALLOWED_EMAILS for stale entries.

## Follow-up — OAuth round-trip broken post-rotation (2026-04-30)

The "Live site healthy: HTTP 200 on `/admin`" check above only verified
the sign-in PAGE loaded — it never actually completed a Google OAuth
round-trip. Day after rotation, Russell hit "Access blocked: This app's
request is invalid" from Google when clicking the sign-in button. The
OAuth request was being formed correctly on the Vercel side
(client_id `1055659970585-rj3e1r6uv2fggk5hp8rmucce2s16k46d`,
redirect_uri `https://makobytes.com/api/auth/callback/google`) but
Google rejected it. Fix was in Google Cloud Console for the OAuth
client — Russell self-resolved without specifying which knob (most
likely: missing `https://makobytes.com/api/auth/callback/google` in
the Authorized redirect URIs, OR consent screen still in Testing mode
without him on the Test users list, OR Authorized JavaScript origins
missing `https://makobytes.com`). Console page used:
https://console.cloud.google.com/apis/credentials

**Lesson for next OAuth secret rotation on any project:** "the page
loads" is not a sign-in test. Actually complete the Google sign-in
round-trip end-to-end before declaring the rotation done.
