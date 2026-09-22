---
name: Never `vercel deploy --prod` from a tmp project-link folder
description: A `vercel link` tmp folder is fine for env operations (env add/rm/ls), but `vercel deploy` from there uploads an empty project and takes the site down.
type: feedback
---

# Never run `vercel deploy --prod` from a tmp folder that only has `.vercel/project.json`

**The rule:** When I cd into a tmp folder (e.g. `/tmp/link-foo/`) just
to `vercel link --project NAME` so I can run env operations
(`vercel env add/rm/ls/pull`) on a project I don't have a local
checkout of, I MUST NEVER run `vercel deploy --prod` from there.

The tmp folder has the project link metadata (`.vercel/project.json`)
but **no source code**. `vercel deploy` uploads the working directory
contents as the build payload. A deploy from a tmp folder ships an
empty project — replacing the live site with a 404.

**Why:** 2026-04-29, during the makobytes-com breach response. After
rotating env vars from `/tmp/link-makobytes-com/` (a folder with only
`.vercel/project.json`), I ran `vercel --prod --yes` to refresh
Lambdas with new env values. The "deploy" succeeded from Vercel's
perspective and was promoted to `makobytes.com`. The site 404'd for
~3 minutes until I noticed and re-deployed from the real codebase at
`c:\Users\Russell.Sailors\OneDrive\Desktop\Mako AI
Projects\Web Projects\makobytes.com\`.

**How to apply:**

For env-only operations on a project I don't have checked out:
- `cd` into a tmp folder, `vercel link --project NAME`, run
  `vercel env add/rm/ls/pull`. ✅ Safe — no deploy.

When a redeploy is needed to pick up env changes:
1. Find the actual codebase. Check
   `c:\Users\Russell.Sailors\OneDrive\Desktop\Mako AI Projects\Web
   Projects\<project>\` first (Russell's standard path), or fall back
   to `git clone` or git remote if needed.
2. `cd` to the real folder.
3. `vercel link --yes --project NAME` (idempotent if already linked).
4. `vercel --prod --yes` from there.

Alternative: trigger a redeploy without uploading new source by either
(a) using the Vercel dashboard's "Redeploy" button, or
(b) `git commit --allow-empty -m "trigger redeploy" && git push`
    if auto-deploy from the GitHub integration is wired up.

For the future: never assume `vercel deploy` is harmless just because
I'm only "doing env stuff." The deploy command is destructive when run
from the wrong directory. Treat it like a `git push --force`.
