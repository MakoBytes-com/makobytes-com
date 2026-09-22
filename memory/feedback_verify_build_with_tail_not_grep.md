---
name: Verify build output with tail, not a grep filter
description: When checking `npm run build`, never grep-filter the output — use `tail -N` so you actually see error lines. Grep with a fixed pattern can hide errors that don't match the pattern.
type: feedback
originSessionId: e2e2588d-0283-401b-bbce-013770098934
---
On 2026-05-03 I ran `npm run build 2>&1 | grep -E "(error|✓|Compiled|Failed)"` to confirm a clean build before pushing. The pattern matched `✓ Compiled successfully` from a partial earlier line of the OUTPUT but did NOT match the actual error string `> Build error occurred` (which has no capital E in "Error" and no other matched word). So I read the green ✓ and pushed — violating God Mode Command 1 ("Never submit a build to be published if it has errors").

The build itself was actually fine on Vercel — the local error was a Windows EPERM file-lock from a stale dev server, not a code error — but the *process* was wrong. I should have caught the failure before pushing.

**Why:** Russell's God Mode rules are non-negotiable. "Never submit a build to be published if it has errors" means I have to be CERTAIN the build is clean, not statistically-confident based on a grep filter that could miss errors.

**How to apply:**
- After `npm run build`, always `2>&1 | tail -25` (or read the full output) so the actual error string is visible if one exists.
- Don't grep-filter the build output. The error format varies (`> Build error occurred`, `Failed to compile`, `Type error:`, `EPERM`, etc.) and any fixed pattern will eventually miss one.
- If I see *anything* that's not a clean static-page render summary at the end, treat it as a failure and investigate before pushing.
- If a build fails locally because of a file lock or env issue I'm sure isn't a code problem, kill the locking process / clean `.next/` and rebuild to confirm — don't push until I have a green build.
- If I push and *then* discover the build was broken, revert the commit immediately rather than waiting to see what Vercel does.
