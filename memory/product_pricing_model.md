---
name: PromptPixel pricing model
description: Real PromptPixel pricing as of 2026-04-09. NOT lifetime updates.
type: project
originSessionId: 148a86eb-82a1-4146-8847-74e614df860f
---
PromptPixel uses a **perpetual fallback license** model — like JetBrains.

## How it works
- **Free tier:** $0 forever. Core features (hotkey capture, region capture, auto-type prompt, capture feedback, 3-capture history). No expiry, no nags.
- **Pro tier:** $25 one-time. Unlocks Prompt Picker, Auto-Save Backups, OCR, Voice to Prompt, Multi-Target Hotkeys, raises capture history to 50.
- **Year 1 of updates is INCLUDED** in the $25.
- **After Year 1:** user has a choice:
  1. **Keep what you have forever** — no expiry, no nag, no feature loss. Every feature you paid for keeps working indefinitely. You just stop getting new features and bug fixes.
  2. **Renew for $15/year** to keep receiving updates.

## Why this matters for the site
- Do NOT use the phrase "lifetime updates" anywhere — that was the old wrong model.
- "One-time payment" is still accurate for the SOFTWARE, but "one-time" without context implies lifetime updates which is misleading. Use phrases like "$25 once · 1 year of updates included" or "one-time license + optional update renewal."
- The renewal must always be framed as **optional**. The user can opt out and keep their current version forever.
- This model is identical to JetBrains' perpetual fallback license, which is well-understood by the dev/power-user crowd PromptPixel targets.
- "No forced subscription" is the right framing, NOT "no subscription" (which is technically false now).

## Where this is implemented in the code
- Hero check pills (`app/promptpixel/page.tsx` ~line 184)
- Pro pricing card checklist (~line 510)
- Pricing card subtitle / footnote (~line 535)
- FAQ entries about pricing + updates
- Hub philosophy "Pay once. Own it." card (`app/page.tsx`)
