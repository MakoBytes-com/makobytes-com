// Content Security Policy — enforcing. It shipped Report-Only first and was
// flipped once the audit confirmed a clean console; add an allow rule here
// before loading anything from a new origin. Spline (3D scene) and Unsplash
// (hero images) are explicitly allowed — they're already in images.remotePatterns.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live https://prod.spline.design https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://prod.spline.design https://images.unsplash.com https://*.googleusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://vercel.live https://prod.spline.design wss://prod.spline.design https://challenges.cloudflare.com",
  "media-src 'self'",
  "frame-src 'self' https://prod.spline.design https://challenges.cloudflare.com",
  "form-action 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  },
  { key: "Content-Security-Policy", value: csp },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "prod.spline.design" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    // www redirects to the apex here rather than in Vercel's domain settings:
    // a domain-level redirect is answered before this config runs, so it went
    // out with Vercel's short default HSTS (no includeSubDomains, no preload).
    // Done here, headers() below applies to the 308 as well. It must stay
    // first so www requests never hit the path redirects below on www.
    //
    // PromptPixel was retired 2026-07-25; PixelCopy (pixelcopy.app) is its
    // successor. Old links and search results land on the successor product.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.makobytes.com" }],
        destination: "https://makobytes.com/:path*",
        permanent: true,
      },
      { source: "/promptpixel", destination: "https://pixelcopy.app", permanent: true },
      { source: "/sheet", destination: "/", permanent: true },
      { source: "/sheet/:path*", destination: "/", permanent: true },
      { source: "/promptpixel/:path*", destination: "https://pixelcopy.app", permanent: true },
    ];
  },
  async headers() {
    // Long-lived static assets get immutable caching — rename the file (or
    // version the filename) instead of replacing content in place, or repeat
    // visitors keep the stale copy for up to a year.
    const IMMUTABLE_CACHE = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/videos/:path*", headers: IMMUTABLE_CACHE },
      { source: "/images/:path*", headers: IMMUTABLE_CACHE },
    ];
  },
};

export default nextConfig;
