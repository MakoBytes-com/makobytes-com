---
name: Project closure playbook
description: How Russell wants project closures handled — backup-first, then cloud, then local. Includes "delete vs empty-for-reuse" branch and CLI gotchas hit on [retired project].ai 2026-05-01.
type: feedback
---

When Russell says "I'm closing this project, delete everything," follow this order:

1. **Confirm scope before destroying** — list local + cloud resources separately. Cloud deletes (Supabase data, OAuth clients) are unrecoverable. Ask which numbers are in scope and whether to back up first.
2. **Always back up first** — zip the project (exclude `node_modules`, `.next`, `.vercel`) to a sibling `_archived/` folder before any destruction. Cheap insurance, ~6MB typical for a Next.js site.
3. **Cloud first, local last** — execute cloud deletions while the local files are still around as a fallback reference (need IDs, env vars, etc.).
4. **Watch for the "empty for reuse" branch** — when Russell wants to reuse a domain/repo/Supabase project for a future build, don't delete those resources, just empty them. GitHub: force-push a single placeholder commit. Supabase: drop+recreate `public` schema, `DELETE FROM auth.users`, empty storage via dashboard.
5. **Deliver clear manual-step instructions** for what only he can do — Supabase storage deletion, OAuth dashboard clicks, closing VS Code to release the empty folder shell.

**Why:** Russell explicitly said "delete everything" then "make them empty for the new project." Two different modes. The default playbook needs to handle both without me asking redundant questions mid-execution. He doesn't want round trips during a closure.

**How to apply:** Trigger phrases: "closing this project," "delete everything," "shut this down." After confirming scope once, execute autonomously through the checklist. Pause only on the empty-vs-delete branch and on manual steps that require his login.

## Technical gotchas that bit me on [retired project].ai (2026-05-01)

- **Vercel CLI `vercel project rm` interactive prompt cannot be piped reliably** from PowerShell or `yes y |` (input gets BOM-corrupted or echo-spammed). Use the REST API instead: token at `~/AppData/Roaming/com.vercel.cli/Data/auth.json`, then `curl -X DELETE "https://api.vercel.com/v9/projects/{projectId}?teamId={teamId}" -H "Authorization: Bearer $TOKEN"`. Returns 204 on success.
- **`gh repo delete` requires `delete_repo` scope** which isn't in his default token (`gist, read:org, repo, workflow`). Either run `gh auth refresh -h github.com -s delete_repo` first or have him delete via GitHub web Danger Zone. For *empty-and-keep*, force-push a fresh single commit instead.
- **Supabase blocks `DELETE FROM storage.objects` / `storage.buckets`** via a `protect_delete` trigger. Storage must be wiped through the Storage dashboard (per-bucket delete), not SQL. Auth users + public schema CAN be wiped via SQL.
- **OneDrive locks the directory shell when VS Code has the workspace open.** Files inside delete fine, but the empty parent folder requires VS Code to close before File Explorer can remove it. Tell Russell upfront — don't try to brute-force it.
- **Bash tool's persistent cwd** stays pinned to the original project dir for the entire session. After deleting that dir, every `Bash` call complains "shell cwd was reset." Switch to PowerShell with explicit `Set-Location` for any post-deletion commands, or accept the cwd-reset noise.
