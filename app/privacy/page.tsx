import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "https://makobytes.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-white text-[#333333]">
      <div className="pointer-events-none fixed inset-0 grid-overlay opacity-40" />

      <nav className="border-b border-[#dbdbdb]/50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#777777] transition hover:text-[#333333]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            MakoBytes
          </Link>
        </div>
      </nav>

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="mono-tag mb-4 text-[#0061aa]">// privacy</div>
        <h1 className="mb-8 text-4xl font-black tracking-tight">
          <span className="text-gradient">Privacy Policy</span>
        </h1>
        <p className="mono-tag mb-12 text-[#999999]">
          Last updated: April 9, 2026
        </p>

        <div className="space-y-8 text-[#555555]">
          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">Overview</h2>
            <p className="leading-relaxed">
              MakoBytes builds desktop software that runs entirely on your
              machine. We believe your data is yours. This policy explains what
              little data we do collect and how we handle it.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">
              PromptPixel Desktop App
            </h2>
            <p className="leading-relaxed">
              PromptPixel runs 100% locally on your Windows PC. It uses
              Windows-native APIs for screen capture, OCR, and speech
              recognition. No screenshots, prompts, voice recordings, or any
              other user data ever leave your machine. There is no telemetry, no
              analytics, no cloud processing, and no account required. The only
              network activity is initiated by the AI chat application you paste
              into, which is controlled by that provider, not MakoBytes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">
              MakoBytes Website (makobytes.com)
            </h2>
            <p className="leading-relaxed">
              Our website collects basic, anonymous analytics to understand how
              visitors use the site. This includes page views, button clicks, and
              referrer information. We do not use third-party analytics services.
              Data is stored in a private database and is never shared with or
              sold to third parties. We do not use cookies for tracking. We do
              not collect personally identifiable information through the website
              unless you voluntarily provide it (for example, by emailing us).
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">
              Purchases and Payments
            </h2>
            <p className="leading-relaxed">
              Payments are processed by our payment provider (Polar). MakoBytes
              does not store credit card numbers or payment details. Your email
              address is collected for license delivery and support purposes
              only. We will never send you marketing emails unless you
              explicitly opt in.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">
              Your Rights
            </h2>
            <p className="leading-relaxed">
              You can request deletion of any data we hold about you by emailing{" "}
              <a
                href="mailto:admin@makobytes.com"
                className="text-[#0061aa] transition hover:text-[#004d88]"
              >
                admin@makobytes.com
              </a>
              . Since PromptPixel stores everything locally, there is nothing for
              us to delete on our end for the desktop app.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">Contact</h2>
            <p className="leading-relaxed">
              Questions about this policy? Email{" "}
              <a
                href="mailto:admin@makobytes.com"
                className="text-[#0061aa] transition hover:text-[#004d88]"
              >
                admin@makobytes.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
