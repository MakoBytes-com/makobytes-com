---
name: vercel-preview-env-corruption-repair
description: "makobytes preview env WAS hit by the 2026-07-28 ciphertext bug; repaired 2026-09-21, plus the forensic trick and two false-positive traps"
metadata: 
  node_type: memory
  type: project
  originSessionId: ac4dc246-493d-47bf-93af-992245cfa4a9
  modified: 2026-09-21T09:56:00.490Z
---

On 2026-09-21 makobytes.com was checked as the last project affected by the
2026-07-28 Vercel env corruption (a script read env via `GET /v9/projects/<id>/env`,
which returns ciphertext envelopes starting `eyJ2IjoidjIi`, and wrote them back
as literal PREVIEW values).

**makobytes WAS hit.** Five PREVIEW entries carry `createdAt = 2026-07-28T09:09:55–56Z`:
CLIENT_ID, NEXT_PUBLIC_TURNSTILE_SITE_KEY, SUPABASE_SERVICE_KEY, SUPABASE_URL,
TURNSTILE_SECRET_KEY. The script **created new preview-only entries** rather than
patching existing ones, which is why production's timestamps stayed old and clean.

**It was already repaired** at 2026-09-21T09:33:54–55Z by another session, ~320 ms
apart (a PATCH loop), about 18 minutes before this session started. Verified good
rather than taken on trust: zero `eyJ2IjoidjIi` values remain; Turnstile secret
returns `invalid-input-response` from Cloudflare siteverify (= accepted); Supabase
service-key `ref` claim matches the URL subdomain `ixowuzznvnbhbckduthv`.
Nothing was missing — all 18 keys exist on both targets.

**The forensic trick worth keeping:** `createdAt` survives a later repair while
`updatedAt` does not. To prove whether a project was ever hit, look for
`createdAt` ≈ `2026-07-28T09:09`, not `updatedAt`.

**Two false positives that cost time — do not repeat:**

1. `MASTER_PUBLIC_KEY` holds **two concatenated PEM blocks** and
   `crypto.createPublicKey()` throws `DECODER routines::unsupported` on it. This
   is NOT corruption. `lib/master-jwt.ts:13-31` deliberately supports two PEMs
   during a master signing-key rotation and splits them on the BEGIN/END regex
   before verifying. Check how a value is consumed before calling it broken.
2. `look_at_page` reported the two hero images as broken on the live site. They
   are not — both return HTTP 200 and optimize correctly (1.68 MB → 417 KB).
   Confirm image 404s with curl before reporting them.

`ADMIN_ALLOWED_EMAILS` is **not** a mail destination — `lib/auth.ts` uses it purely
as a Google-OAuth sign-in allowlist and it fails closed when unset.
`russell.sailors@gmail.com` is Russell's real Google identity and must stay in it
or he loses production admin. It must never be swapped for a sink address.

See [[preview-contact-mail-sink]] for the one gap this session actually closed.
