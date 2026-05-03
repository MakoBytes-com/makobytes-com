import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // /admin is auth-gated and shouldn't be indexed; /api is non-content.
  // AI crawlers are explicitly named with their own rules so the policy is
  // legible (rather than implicit via User-agent: *) — this site is a product
  // catalog, we want to be cited by AI assistants.
  const SITE_DISALLOW = ["/admin", "/api"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: SITE_DISALLOW,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "anthropic-ai",
          "Claude-Web",
          "Google-Extended",
          "PerplexityBot",
          "Perplexity-User",
          "Applebot-Extended",
          "CCBot",
          "Bytespider",
          "Amazonbot",
          "DuckAssistBot",
        ],
        allow: "/",
        disallow: SITE_DISALLOW,
      },
    ],
    sitemap: "https://makobytes.com/sitemap.xml",
    host: "https://makobytes.com",
  };
}
