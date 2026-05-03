import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makobytes.com"),
  title: {
    default: "MakoBytes — Lightweight Desktop Tools for AI Power Users",
    template: "%s | MakoBytes",
  },
  description:
    "MakoBytes builds fast, private, one-time-purchase desktop apps for people who live in AI workflows. PromptPixel and more on the way.",
  keywords: [
    "MakoBytes",
    "desktop apps",
    "AI tools",
    "productivity",
    "PromptPixel",
    "screenshot to prompt",
    "OCR",
    "ChatGPT workflow",
    "Claude workflow",
    "AI Prompt Hive",
    "AI prompts",
    "prompt storage",
    "save AI prompts",
  ],
  authors: [{ name: "MakoBytes" }],
  openGraph: {
    type: "website",
    url: "https://makobytes.com",
    title: "MakoBytes — Lightweight Desktop Tools for AI Power Users",
    description:
      "Fast. Private. One-time purchase. The MakoBytes app catalog.",
    siteName: "MakoBytes",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MakoBytes — Lightweight Desktop Tools for AI Power Users",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MakoBytes — Lightweight Desktop Tools",
    description: "Fast. Private. One-time purchase. No subscriptions.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0061aa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-white text-[#333333]`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[#0061aa] focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0061aa]"
        >
          Skip to main content
        </a>
        <div id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </div>
      </body>
    </html>
  );
}
