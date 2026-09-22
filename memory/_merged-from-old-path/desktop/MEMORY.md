> ## ⚠️ OLDER MEMORY — project folder has moved (flagged 2026-07-27)
>
> Mako web projects moved from `OneDrive\Desktop\Mako AI Projects` to
> `OneDrive - Mako Logics LLC\Business\Mako Studio\Mako AI Projects`, so this folder is
> the **older** memory for `makobytes-com`. Current sessions write to:
>
> `~/.claude/projects/c--Users-Russell-Sailors-OneDrive---Mako-Logics-LLC-Business-Mako-Studio-Mako-AI-Projects-Web-Projects-makobytes-com/memory/`
>
> **Check the newer folder first for current state.** This one is NOT invalid and in some
> projects holds history the newer folder never received — worth reading during a
> "Recover", but verify any path, ID, key or file reference still exists before acting.

## Memory Index

- **session_summary.md** — Latest session state and next steps
- **build_progress.md** — Running log of completed work and blockers
- **project_breach_response.md** — Vercel April 2026 breach response: full env rotation 2026-04-29. New Upstash KV, all 10 sensitive vars now flagged Sensitive.
- **feedback_never_deploy_from_tmp_link.md** — Hard rule: never `vercel deploy --prod` from a `/tmp/link-*` folder; it ships empty source and 404s the site. Bit us 2026-04-29.
- **feedback_skip_local_dev_test.md** — Don't ask Russell to verify on localhost; push to live once `npm run build` is clean. He's a live-URL-only workflow.
- **feedback_verify_build_with_tail_not_grep.md** — Never grep-filter `npm run build` output. Use `tail -N`. Grep masked a "> Build error occurred" line on 2026-05-03 and I pushed anyway.
- **feedback_project_closure_playbook.md** — Project shutdown order: confirm scope → backup → cloud → local. Empty-for-reuse vs full-delete branch. Vercel/GitHub/Supabase CLI gotchas from [retired project].ai 2026-05-01.
- **active_skills.md / admin_dashboard.md / feedback_no_purple.md / product_pricing_model.md / product_promptpixel_real.md / project_hero_direction.md / project_overview.md / project_site_structure.md / project_type.md** — pre-existing project memory
- **stop_hook_canary.log** — Timestamp log of hook execution events
