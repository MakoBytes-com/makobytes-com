---
name: preview-contact-mail-sink
description: Preview deploys mail the contact form to preview-sink@makologics.com via CONTACT_TO; production is unset on purpose
metadata: 
  node_type: memory
  type: project
  originSessionId: ac4dc246-493d-47bf-93af-992245cfa4a9
  modified: 2026-09-21T09:56:03.538Z
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

Everything else in preview is intentionally **identical** to production
(Supabase service key, Turnstile keys, KV_*, AUTH_*) because those are shared
*keys*, not destinations — preview shares production's database, so divergence
there would corrupt real data. Only destinations get sinkholed.

Never verify this by submitting the live form. On 2026-09-21 another session
proved a client site's mail with a real password reset; it reached Russell and was
escalated as a possible security breach before being traced back.

See [[vercel-preview-env-corruption-repair]].
