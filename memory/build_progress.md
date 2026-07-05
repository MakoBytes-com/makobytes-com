---
name: Build Progress
description: Running log of completed and pending work
type: project
updated: 2026-07-05
---

## Done

- Designed and implemented PromptPixel.ahk (AutoHotkey v2 script)
- Integrated screenshot capture with Win32 API calls
- Integrated Tesseract OCR via command line
- Integrated Claude API for AI validation and context enrichment
- Implemented clipboard override and timestamp logging
- Tested core functionality (screenshot → OCR → API → clipboard)
- Committed source code to git
- Created build.bat script for .exe compilation
- Tested build process successfully
- Created comprehensive 5-step deployment plan
- Explained AutoHotkey installer behavior to Russell (safe to close running script)
- **AutoHotkey v2 installer completed successfully**
- **Compiled PromptPixel.exe (1.3MB) via Ahk2Exe**
- **Verified .exe survived Windows Defender/ThreatDown scanning**
- **Tested PromptPixel.exe live**: Settings GUI responsive, hotkey (Ctrl+Alt+S) functional, screenshot capture and paste confirmed working in VS Code
- **Designed application icon** (PromptPixel.ico and .png): rounded square, gradient blue, pixel grid "P", chat bubble with dots
- **VirusTotal scanned PromptPixel.exe v1.0.1**: **0/72 detections** — production-ready
- **GitHub CLI authenticated and v1.0.1 Release published** with VirusTotal link and .exe binary
- **v1.1.0 branch reverted entirely**: Rolled back to clean v1.0.1 source from GitHub due to picker positioning bugs, deleted corrupted settings.ini
- **v2.0.0 C# rewrite scaffolded** with WinForms tray icon, hotkey manager, and modular architecture
- **v2.0.0-alpha features complete**: fullscreen capture, region capture, Settings GUI, toast preview, capture history (3 slots), prompt picker (21 default prompts, scrollable), first-launch welcome screen, MakoBytes branding, file logger, crash hooks
- **v2.0.0-alpha r30 locked**: All free-tier features shipped and tested, foundation stable for Pro features
- **Synced private GitHub repo** (PromptPixel-Source): r14–r30 pushed, 1,883 lines added across 9 files
- **Documented public release blockers**: License keys, VirusTotal v2 scan, marketing landing page, pro feature completion
- **Created v2 launch sequence**: 8-step roadmap from features → license → scanning → marketing → public release
- **Shipped r50–r55**: Multi-target hotkeys support added, remove button styling fixed, capture history UI refined
- **Documented Stop hook setup**: Fix provided for "Bash permission denied" error — Russell to add Bash to ~/.claude/settings.json allow-list and restart
- **Code-signing strategy locked**: Azure Trusted Signing ($120/yr, cloud-based, instant SmartScreen) selected over traditional EV/OV certs ($200–500/yr, hardware token)
- **Buy button next step clarified**: Settings-based URL configuration (Option B) is recommended over hardcoding for future flexibility
- **r64 custom license buy URL feature complete**: Added `AppSettings.LicenseBuyUrl` field with Settings UI textbox; `LicenseService.GetBuyUrl()` returns override if set else defaults to `PRICING_URL`; both "Buy" button and tray toast upsell use `GetBuyUrl()`; bonus fix: Settings Save block now preserves all license activation state (`AlphaMode`, `LicenseKey`, `LicenseStatus`, etc.) across form saves
- **Stop hook configuration verified**: settings.json now correctly configured with `defaultMode: "acceptEdits"`, `Write` and `Bash` in allow-list, 45s timeout — hook ready for next resume cycle
- **Payment provider research completed**: Evaluated Paddle, Polar.sh, FastSpring, Keygen, Cryptolens; Polar.sh recommended as best fit (MoR, native license API, responsive support)
- **Polar account review blocker diagnosed**: Found the required Account Review gate (Polar's MoR/anti-fraud compliance step); documented 10-item review form checklist; identified makobytes.com site-live requirement as #1 failure point
- **Polar product creation completed**: Created PromptPixel listing with $25.00 one-time purchase, License Key benefit fully configured, live checkout URL generated and verified
- **Polar customer-portal endpoints verified**: Confirmed validate, activate, deactivate endpoints require **zero authentication** — only organization_id (public UUID) needed in requests
- **License validation architecture simplified**: No proxy, no Cloudflare Worker, no embedded tokens required — pure client-side calls to Polar customer-portal with public org_id
- **r65 refactor plan locked**: Will bump BuildInfo.cs, refactor LicenseService.cs to use customer-portal endpoints, switch FormUrlEncoded→JSON, add org_id field, map response fields
- **r65 built and verified**: Build stamp correct (v2.0.0-alpha · build 2026-04-09-r65), License tab loads, Polar checkout URL displaying, all license buttons (Activate/Deactivate/Buy) present and wired
- **r66 built and verified**: Hardcoded Polar checkout URL in LicenseService.cs, removed BUY URL field from UI, removed stale LemonSqueezy helper text references
- **First real sale completed on Polar**: $25 PromptPixel order processed, invoice generated (MAKO-LOGICS-LLC-TMFPONMMUN-0001), order appears in Polar dashboard with Paid status
- **Created makobytes.com landing page**: Dark premium design with Viktor Oddy style, glassmorphism effects, responsive layout, PromptPixel feature showcase, $25 pricing, Polar buy link integration, updated to blue/silver/grey/white color scheme with Main Logo.png branding, added comprehensive SEO meta tags and structured data, expanded to software catalog with products section, created dedicated PromptPixel product page with features, screenshots, and detailed information
- **Rebuilt makobytes.com as Next.js 14 project**: Full TypeScript + Tailwind + shadcn scaffolding, Spline Whobee robot integrated in hero, inline SVG brand mark, all landing sections ported, 18 files + 1175 lines total, local build verified
- **Committed Next.js rebuild locally**: Commit `0fdc92d` created on main branch with full source code
- **Generated Meshy AI Whobee robot**: Blue chrome textured 3D robot created via Meshy Image-to-3D, exported as `.glb` file (`Meshy_AI_Blue_Chrome_Robot_0409231248_texture.glb`)
- **Committed Spline → Whobee GLB swap**: Commit `396d329` created with interactive-3d-robot.tsx modified to load local `./whobee.glb` instead of Spline scene URL
- **Verified partial build on live site**: UI changes (blue button, split layout) visible on production, confirming Vercel build completed, but old Spline robot still cached in browser (3D model not updated)
- **Analyzed download tracking requirements**: Identified precondition — Download button is placeholder (`href="#download"`), no real .exe hosting yet. Evaluated 4 approaches: A (Vercel Analytics + GitHub, 30min free), B (Plausible/Umami, 1-2hr $0-9/mo), C (custom dashboard, 4-6hr), D (A now + C later). Recommended Option A as optimal for current stage.

- **PixelCopy added to homepage catalog (2026-07-05)**: Replaced "App Three" placeholder card with live PixelCopy card — available status, "Capture your Windows screen like a pro." tagline, Free + Pro $8/mo, SquareDashed glyph (locked brand choice), external link to pixelcopy.app (same pattern as MakoBot card). Meta + OG descriptions updated to name all three apps. Commit `7a591a9`, verified live post-deploy.
- **npm audit cleared (2026-07-05)**: `npm audit fix` resolved 2 moderate + 1 low advisories (js-yaml, brace-expansion, @babel/core — all dev tooling). Build verified clean. Commit `7cd44d0`.
- **GitHub repo moved to MakoBytes-com org (noticed 2026-07-05)**: origin remote updated locally to `https://github.com/MakoBytes-com/makobytes-com.git`.

- **Hero video background shipped (2026-07-05)**: Replaced static hero.webp with a Higgsfield-generated (Seedance 1.5 Pro, 48 credits for 2 candidates) liquid-chrome wave loop — silver/sapphire on bright white, brand palette. Palindrome encode (forward + reverse appended, apex frame deduped) makes the loop point invisible. Ships WebM 2.4MB + MP4 3.7MB + 45KB poster; video tag emitted as raw HTML because React won't render the `muted` attribute server-side and Chrome/iOS gate autoplay on it; reduced-motion users get the poster still. Also added immutable Cache-Control on /videos/* + /images/*. Commit `eb0c184`, verified live post-deploy (markup, asset 200s, security headers intact). Old hero.webp left in repo, now unreferenced.

- **Hero rotating app-card carousel shipped (2026-07-05)**: Replaced the hero video background (after Russell declined the workstation v2 + 4 robot-developer candidates) with a pure-CSS 3D carousel of the three real app cards (PromptPixel/MakoBot/PixelCopy) — 18s stepped rotation, reduced-motion static fallback, decorative/aria-hidden, grid-overlay backdrop. All hero video assets deleted (recoverable from `eb0c184`). Commit `d8b8e2e`, verified live post-deploy.

## In Progress / Next Up

1. **Russell to answer precondition questions**: Where will PromptPixel.exe be hosted? (GitHub/S3/Vercel/own server) + Is a real installer ready now?
2. **Russell to pick download tracking approach**: A (Vercel + GitHub) / B (Plausible) / C (custom) / D (staged)
3. **Fix Download button**: Once hosting decision made, link button to real .exe / GitHub Release / or "join waitlist" form
4. **Implement chosen analytics**: Set up tracking based on Russell's selection

## Blocked / Waiting On

- **Exe hosting infrastructure decision** — Russell must specify where PromptPixel.exe will live before proceeding with download tracking
- **Whobee robot caching on production** — Vercel build succeeded, but old Spline model still showing in browser; likely service worker or CDN cache. Investigating cache clearing strategy.
- **License key delivery clarification** — Investigating Polar dashboard structure to determine if benefit was actually granted; may require product reconfiguration
- **Polar account review** — Paused until license key flow is verified to work end-to-end

## Notes

- v2.0.0-alpha r30 is clean, tested, and ready for feature additions
- Delayed capture recommended for momentum: high value, minimal risk, sets pattern for shipping features
- OCR remains the biggest remaining task (~Windows.Media.Ocr integration)
- All code for r64 is finalized and ready for build
- Stop hook fully operational — no more manual memory saves needed after this session
- Phase 1 can proceed in parallel: Russell builds/scans while Claude scaffolds landing page
- License key validation required before actual paid selling (LemonSqueezy handles this)
