---
name: Session Summary
description: Latest session state for resuming work
type: project
updated: 2026-07-05
---

## What happened (2026-07-05, LATEST — hero = rotating app cards, AWAITING RUSSELL'S GO)

Russell rejected the video-background direction entirely (chrome wave shipped as v1; workstation v2 previewed; 4 robot-developer candidates generated but declined). New direction from him: "just create animated cards of each app and have them rotate." Built a pure-CSS 3D card carousel in the hero — the 3 catalog apps (PromptPixel/MakoBot/PixelCopy) as cards on a Y-axis wheel at 120°, each holding face-front ~4.5s then turning (18s cycle, keyframes `hero-carousel-spin` in globals.css). Decorative/aria-hidden (real clickable cards remain in catalog section), reduced-motion shows a static card, faint `grid-overlay` texture behind, hero min-heights dropped for natural two-column layout (text left, carousel right, stacks on mobile). All video assets removed from working tree (v1 recoverable from commit `eb0c184`); zero video bytes shipped. Build clean. **Preview (NOT production): https://makobytes-48ew2ypxz-makoai-studio.vercel.app — waiting for Russell's word before commit+push.** Production still serves v1 chrome-wave video. ~182 Higgsfield credits used today (~447 remain — robot candidates: f43e4a37/a208c400/b91d55df/b2c19551 in library if ever wanted).

## Superseded same day (hero video v2 — declined, never shipped)

Russell found the liquid-chrome wave too abstract; wanted something showing "AI developing apps" and asked to see 4 examples before going live. Generated 4 on-theme candidates (holo-desk UI assembly, robot hand placing app tiles, dev workstation with code, blueprint-to-app). Russell picked the workstation one but asked to remove the glowing X icon + flashing blue gadget. Flow used: extracted the exact frame he liked → nano-banana image edit removed both elements → seedance re-animated from that cleaned start_image (slow code scroll + gentle push-in) → palindrome encode. v2 assets in repo (hero-loop-v2.mp4 2.9MB / .webm 1.7MB / hero-poster-v2.webp) with page.tsx pointing at v2 filenames (renamed, not overwritten, because of immutable cache). Local build clean. **Preview deploy (NOT production): https://makobytes-lxc2xz9gs-makoai-studio.vercel.app — waiting for Russell's approval before commit+push.** Old v1 files still in repo; remove in the ship commit if approved. Live production still serves v1 chrome wave. ~86 Higgsfield credits used total today (543 remain). NOTE: v2 scene has a dark-grey backdrop vs the site's white theme — white scrim handles text legibility but the hero reads darker than v1; flagged to Russell.

## Previous session (2026-07-05 — hero video v1, shipped)

Russell didn't like the hero section and asked for a video background — looping/reversing so it looks seamless — generated with his Higgsfield license. Shipped and verified live (commit `eb0c184`):

- **Generated 2 candidates** with Seedance 1.5 Pro (8s, 1080p, 16:9, silent, 24 credits each; ~581 credits remain). Picked the one with a consistent silver/sapphire liquid-chrome wave on bright white — the other morphed from an odd chrome blob. Prompt theme: slow ambient liquid-chrome waves, brand palette.
- **Seamless loop**: ffmpeg palindrome — forward + reversed appended (first frame of the reversed half trimmed to avoid a double frame at the apex), so the loop point is invisible. Same pattern as makobot.com's old hero video.
- **Encodes**: hero-loop.webm (VP9, 2.4MB) + hero-loop.mp4 (H.264 CRF27, 3.7MB) + hero-poster.webp (45KB) in public/videos + public/images.
- **Hero markup** ([app/page.tsx](../app/page.tsx)): video replaces the static hero.webp Image (file left in repo, now unreferenced). Video tag is emitted via dangerouslySetInnerHTML because React (even 19) never renders the `muted` attribute into server HTML and Chrome/iOS gate autoplay on the attribute. `motion-reduce` users get the poster still instead. White scrim gradient (solid over text column → clear over the wave) keeps dark text legible; stronger mobile fade kept.
- **next.config.mjs**: immutable Cache-Control added for /videos/* and /images/* (rename files instead of editing in place, or repeat visitors keep stale copies).
- Post-deploy verified: muted attribute present in live HTML, all 3 assets 200 with immutable cache, all 6 security headers intact.

## Previous session (2026-07-05 — PixelCopy card)

Russell asked to replace the "App Three" placeholder on the makobytes.com homepage with PixelCopy, linking out to pixelcopy.app the same way the MakoBot card links to makobot.com. Done and verified live.

## What shipped

- **PixelCopy card** in the homepage catalog ([app/page.tsx](../app/page.tsx)): available status, tagline "Capture your Windows screen like a pro.", description covering region/scrolling/fullscreen capture + recording, GIFs, annotations, OCR, pin-to-screen. Price "Free + Pro $8/mo", Windows, external link to https://pixelcopy.app. Icon = `SquareDashed` (the locked PixelCopy brand glyph). Commit `7a591a9`.
- **Meta + OG description refresh** on the homepage: now names PromptPixel, MakoBot, PixelCopy; dropped the "one-time purchase / no subscriptions" claim from metadata since PixelCopy Pro is $8/mo (OG now says "Yours to keep").
- **npm audit fix**: cleared 2 moderate + 1 low advisories (js-yaml, brace-expansion, @babel/core — dev tooling only). Commit `7cd44d0`.
- **Remote URL updated**: repo moved to the MakoBytes-com GitHub org; local origin now points at `MakoBytes-com/makobytes-com`.

Both builds verified clean locally before push; PixelCopy card confirmed rendering on live makobytes.com after deploy.

## Open items / flagged for Russell

- **Brand-copy tension (not changed, needs Russell's call):** the visible hero still says "No subscriptions. No bloat. No BS." and the Philosophy section leads with the perpetual-license/JetBrains story. PixelCopy Pro at $8/mo contradicts both. Only the metadata was softened; on-page brand copy is Russell's decision.
- Open Dependabot PRs on the repo (js-yaml, recharts, tailwind-merge, tailwindcss, @types/node, minor-and-patch group) — the audit fix may supersede some; PRs can be reviewed/merged or closed.
- Older blockers from April (PromptPixel exe hosting decision, download tracking approach, Vercel KV custom-prefix connection) were not touched this session — see build_progress.md.
