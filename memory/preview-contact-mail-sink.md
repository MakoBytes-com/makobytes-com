---
name: preview-contact-mail-sink
description: Preview deploys mail the contact form to preview-sink@makologics.com via CONTACT_TO; preview has NO database/KV since 2026-09-24, so its API routes 500 by design
metadata: 
  node_type: memory
  type: project
  originSessionId: ac4dc246-493d-47bf-93af-992245cfa4a9
  modified: 2026-09-25T01:45:36.867Z
---

The contact recipient in `app/api/contact/route.ts` used to be a hardcoded
`admin@makologics.com`, so a submission on any preview deployment emailed the real
monitored inbox. Fixed 2026-09-21 (commit `6143b06`):

```ts
const TO = process.env.CONTACT_TO || "admin@makologics.com";
```

`CONTACT_TO = preview-sink@makologics.com` is set on the **preview target only**
(Vercel env id `kQcNmNkgT1cd3B5K`). It is deliberately **unset in production and
development** so the default applies and live behaviour is byte-identical — that
default-preserving shape is why the change was safe to ship straight to main.

`preview-sink@makologics.com` has no mailbox: Graph `get-mail-tips` returns
`ErrorInvalidUser`, so mail to it is rejected at the gateway and reaches nobody.
Re-verified independently this session.

**Preview has NO database and NO KV access, by design** (Russell's rule, "a
preview is a preview", 2026-09-21). On 2026-09-24 the preview-only copies of
SUPABASE_URL, SUPABASE_SERVICE_KEY and all five KV_* vars were deleted by env id
via the REST API after asserting each target was exactly `["preview"]`.
Production's own entries were untouched. So on a preview deploy, `/api/contact`,
`/api/track`, `/api/master/*` and `/admin` fail (`serverSupabase()` throws
"Supabase env vars not configured"). **That is expected and is not a bug. Never
put the credentials back to "fix" it.** The build does not need them: every
DB/KV route is `force-dynamic`, and `lib/admin/storage.ts` no-ops without KV.
This was verified with a clean-worktree `next build` using only the pulled
preview env. What preview keeps: CLIENT_ID, AUTH_GOOGLE_ID, AUTH_TRUST_HOST,
ADMIN_ALLOWED_EMAILS, Turnstile keys, CLOUDFLARE_*, and CONTACT_TO (this sink).
An earlier version of this note claimed preview deliberately shared production's
database. That was wrong. Removing preview DB access was the fix, not
sinkholing destinations.

Never verify this by submitting the live form. On 2026-09-21 another session
proved a client site's mail with a real password reset; it reached Russell and was
escalated as a possible security breach before being traced back.

See [[vercel-preview-env-corruption-repair]].
