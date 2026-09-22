---
name: PromptPixel real product spec
description: The actual PromptPixel app from app screenshots (2026-04-09). Replaces all prior assumptions.
type: project
originSessionId: 148a86eb-82a1-4146-8847-74e614df860f
---
The site previously described PromptPixel as "OCR-first screenshot-to-prompt generator." That was wrong — based on Russell's actual app screenshots, the product is fundamentally different.

## What PromptPixel actually is

**Tagline (from app):** "One hotkey. Screenshot to clipboard. Paste into any AI."

**Version:** v2.0.0-alpha (build 2026-04-09-r66)

**Platform:** Windows only. Uses Windows OCR + Windows Speech APIs (no third-party services).

**Workflow:**
1. User clicks into their AI chat input (ChatGPT, Claude, etc.)
2. User presses hotkey
3. Screenshot is captured + pasted into the chat input + an optional auto-typed prompt is appended
4. AI sees both the image and the prompt in one keystroke

**This is NOT an OCR-to-prompt generator.** OCR is one feature in the Pro tier. The core product is hotkey-driven screenshot-to-paste with optional prompt auto-typing.

## Free tier features

- **Fullscreen capture hotkey** — default `Ctrl+Alt+S`, customizable
- **Region capture hotkey** — default `Ctrl+Shift+Alt+S`, dims screen and lets user drag a rectangle
- **Capture after delay** (tray menu option)
- **Auto-type a custom prompt after pasting** (AI chat workflow) — e.g. default prompt is "See Image"
- **Capture feedback:**
  - Play sound on capture
  - Show thumbnail toast after capture (auto-dismisses)
  - Confirm before sending dialog (preview + Send/Recapture/Cancel)
- **Recent captures history** — capped at 3 on free tier
- Tray-resident app (camera icon in system tray with right-click menu)
- Lightweight, no third-party services

## Pro tier features ($25)

- **OCR text extraction** (Ctrl+Alt+T) — drag a box, runs Windows OCR on that region, the extracted TEXT lands on clipboard. No image, no vision tokens. Great for code blocks, error messages, PDFs.
- **Voice prompt** (Ctrl+Alt+V) — press the hotkey, speak your prompt. PromptPixel listens with Windows Speech Recognition, then captures the screen, pastes the image, and types your spoken prompt automatically. Hands-free AI prompting.
- **Multi-target hotkeys** — bind extra hotkeys to specific pre-set prompts. Examples:
  - Ctrl+Alt+1 → "Explain this code"
  - Ctrl+Alt+2 → "What's wrong here?"
  - Ctrl+Alt+3 → "Translate to English"
- **Recent captures history** raised from 3 to 50

## Tray menu (right-click camera icon)
- Settings…
- Capture now
- Capture region (drag a box)
- Capture after delay (submenu)
- Recent captures
- Show welcome screen
- Open log folder
- About PromptPixel 2.0.0-alpha
- Exit

## Settings tabs in the app
- **Capture** — fullscreen hotkey, region capture hotkey, after-pasting auto-type prompt
- **Feedback** — sound, toast, confirm dialog, capture history count
- **Pro** — OCR, Voice prompt, Multi-target hotkeys
- **License** — (presumably enter Pro license key)
- **About** — version + build info

## How to apply
- Site copy must use the real tagline: "One hotkey. Screenshot to clipboard. Paste into any AI."
- All hotkey references should use the real defaults: Ctrl+Alt+S, Ctrl+Shift+Alt+S, Ctrl+Alt+T, Ctrl+Alt+V — NOT Ctrl+Shift+P or ⌘+Shift+P (the old wrong references).
- Pricing must be **freemium**: free tier with limits + Pro at $25 unlocks the Pro features, NOT a flat $25 product.
- Features section must split Free vs Pro clearly so users know what they're paying for.
- "OCR" should be positioned as a Pro perk, not the headline feature. The headline is the one-hotkey paste-into-AI workflow.
- Trust signal: built on Windows-native APIs (OCR, Speech) — no third-party services or cloud calls. Privacy-by-default.
- Version label can be shown in nav badge or hero badge: "v2.0.0-alpha"
