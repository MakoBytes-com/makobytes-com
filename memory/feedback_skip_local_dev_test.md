---
name: Skip local dev server, push to live
description: Russell prefers I skip the localhost dev-server visual-test step and push directly once the production build is clean
type: feedback
originSessionId: e2e2588d-0283-401b-bbce-013770098934
---
On this project (and likely globally), Russell does not want me to spin up `npm run dev` and ask him to eyeball the page on http://localhost before pushing. He'd rather I push to main once the production build passes and verify on the live URL.

**Why:** He stated flatly *"I dont like using local servers push it live"* (2026-05-03) after I'd offered "take a look on localhost before I commit." His workflow is live-URL-only — he's said this before in `live_urls_only` global guidance — and the localhost roundtrip just adds friction.

**How to apply:**
- Once `npm run build` succeeds and the routes return 200 in TypeScript/Turbopack output, commit + push.
- Do NOT start a dev server "to let him verify" — he won't.
- Use the live deploy URL for any visual confirmation. Poll the live site after push (curl + grep for the new content), then hand him the live URL to eyeball.
- This applies even for non-trivial changes like full retheme, hero swaps, or layout reshuffles. Push to a deploy preview or main and verify on Vercel.
- Caveat: if I'm running a quick automated check (curl smoke-test, sanity-grep on the rendered HTML, or `next build`), that's fine — those don't ask anything of him. The thing he doesn't want is *me asking him to look at localhost*.
