---
name: Hero direction pivot
description: 2026-04-09 pivot from 3D robot to talking robot explainer video in the hero
type: project
originSessionId: 148a86eb-82a1-4146-8847-74e614df860f
---
After burning ~2 hours on the interactive 3D Whobee approach (Spline → Meshy → R3F + .glb + overlay sphere eye-blink workaround), Russell pivoted to a **talking robot explainer video** in the hero instead.

**Why:** A static 3D model doesn't sell the product — it's decoration. A talking video actually explains what PromptPixel does, which is the whole point of a landing page hero. Also bypasses every 3D limitation we hit (merged materials, no rig, no blinking without Blender surgery).

**How to apply:**
- Hero right column: replace the R3F Canvas with an HTML5 `<video>` element
- Video should autoplay muted with captions, click to unmute
- Use the 2D Meshy-generated robot image as the character reference
- Don't delete the .glb or R3F code yet — keep as fallback until video is shot and integrated
- When pitching hero content in the future: lead with video/explainer over decorative 3D

**Workflow locked in (updated 2026-04-09):**
Using **Google Flow** (labs.google/fx/tools/flow) with Veo 3 as the single tool.
Veo 3 generates native audio + lip sync, so no separate voice/animation steps needed.
1. Write a 30-45 second script (Claude drafts, Russell approves)
2. Generate cartoon presenter character in Flow via Imagen
3. Generate scene-by-scene clips in Flow with consistent character
4. Generate app demo footage clips
5. Use Flow's Scene Builder to stitch into one mp4
6. Export, drop in public/, Claude embeds in hero
