---
name: supabase-and-vercel-access
description: "How to get SQL/DDL access to makobytes' Supabase project and API access to its Vercel project — the obvious credential locations are the wrong ones"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0084ee57-832f-4fed-87bf-7a00e6f0a7a3
  modified: 2026-09-17T01:01:32.722Z
---

**Supabase (project `ixowuzznvnbhbckduthv`, org "Mako Logics"):** the token in `~/.supabase/access-token` is PROJECT-SCOPED to govsprint only — it returns an empty org list and cannot touch makobytes. A full-org PAT is recorded in `~/.claude/projects/...makologics-com/memory/project_supabase_migration.md` (line ~70, from the April 2026 Neon migration). It still worked 2026-09-16 and runs SQL via `POST https://api.supabase.com/v1/projects/ixowuzznvnbhbckduthv/database/query`. It is on Russell's to-do list to rotate — if it stops working, that's why; the replacement will be wherever he saves the new one. The project's service key (INSERT/SELECT via PostgREST, no DDL) is in this repo's `.env.local`.

**Vercel (project `prj_iHpMLDVDidMsniTi5jeBOHGLjOs3`, team makoai-studio `team_TkkoMwEd3Iu2Hv4Ybic1JAMD`):** `VERCEL_TOKEN` in `makopulse.com/.env.local` works for this team's API (env vars, deployments). The `ADMIN_VERCEL_TOKEN` values in bulldogsecurityservice.com and makologics.com env files were not needed.

**Sending email:** `CLOUDFLARE_ACCOUNT_ID=b471d392a9c59820ee9139076366be7f` + `CLOUDFLARE_EMAIL_TOKEN` (canonical copy in `makoai-portal/.env.local`, also in this repo's `.env.local` since 2026-09-16). makobytes.com is onboarded and verified sending.
