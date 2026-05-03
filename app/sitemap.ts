import { MetadataRoute } from "next";

// Pinned to a real content-change date rather than `new Date()`, so search
// engines don't see the timestamp tick on every crawl and infer phantom
// changes. Bump this when adding/restructuring real public pages.
const LAST_MODIFIED = new Date("2026-05-03T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://makobytes.com",
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://makobytes.com/promptpixel",
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://makobytes.com/privacy",
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://makobytes.com/terms",
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
