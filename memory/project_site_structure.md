---
name: Site structure
description: makobytes.com is a multi-app hub, not a single product site. PromptPixel is the first product.
type: project
originSessionId: 148a86eb-82a1-4146-8847-74e614df860f
---
**MakoBytes is a studio / app publisher, not a single product.** Established 2026-04-09.

- `makobytes.com/` (root) = Generic MakoBytes hub. Hero introduces the studio, grid of app cards showing current + upcoming apps. Each card links to its dedicated product page.
- `makobytes.com/promptpixel` = Full PromptPixel landing (hero with animated app mockup, how-it-works, features, pricing, testimonials, FAQ, CTA, footer).
- Future apps each get their own `/[product-slug]` route following the same template.

**Why:** Russell plans to ship multiple apps under the MakoBytes brand. Treating the root as a single-product site would require a painful rewrite every time a new app launches.

**How to apply:**
- When the user references "the landing page" they usually mean the **hub at /**, not the PromptPixel page. Confirm scope if unclear.
- When adding a new app: create `app/[slug]/page.tsx` using the PromptPixel page as a template, then add a card to the hub's app grid.
- Keep the hub minimal and focused on app discovery. Product detail lives on the product pages.
- Current app cards: 1 real (PromptPixel, available now) + 2 "coming soon" placeholders. Replace placeholders as real apps ship.
