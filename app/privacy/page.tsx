import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "https://makobytes.com/privacy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-[#e4e9ef] py-6 first:pt-0 last:border-b-0 last:pb-0">
      <h2 className="font-display text-xl font-bold text-[#111b26]">{title}</h2>
      <div className="mt-2.5 text-[15px] leading-relaxed text-[#4d5a68]">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="paper-grid min-h-screen text-[#26303b]">
      <nav className="border-b border-[#d7dee6]/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0061aa] bg-white text-sm font-bold text-[#0061aa]">
              M
            </span>
            <span className="font-display text-base font-bold tracking-tight text-[#26303b]">MakoBytes</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-[#55606c]">
            <Link href="/" className="flex items-center gap-1.5 transition hover:text-[#0061aa]">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to MakoOS
            </Link>
            <Link href="/sheet" className="hidden transition hover:text-[#0061aa] sm:block">
              Spec sheet
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-[#0061aa]" aria-hidden="true" />
          <span className="spec-label">// privacy.txt</span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111b26] sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8a95a1]">
          Last updated: July 25, 2026
        </p>

        <div className="plate mt-10 p-7 sm:p-9">
          <Section title="Overview">
            <p>
              MakoBytes builds desktop software that runs entirely on your
              machine. We believe your data is yours. This policy explains what
              little data we do collect and how we handle it.
            </p>
          </Section>

          <Section title="MakoBytes Desktop Apps">
            <p>
              MakoBytes desktop apps run locally on your Windows PC using
              Windows-native APIs. Your content stays on your machine unless
              you explicitly send it somewhere yourself. Products with their
              own websites (for example, PixelCopy at pixelcopy.app) publish
              their own privacy policies covering any optional cloud features;
              those policies govern that product.
            </p>
          </Section>

          <Section title="MakoBytes Website (makobytes.com)">
            <p>
              Our website collects basic, anonymous analytics to understand how
              visitors use the site. This includes page views, button clicks, and
              referrer information. We do not use third-party analytics services.
              Data is stored in a private database and is never shared with or
              sold to third parties. We do not use cookies for tracking. We do
              not collect personally identifiable information through the website
              unless you voluntarily provide it (for example, through the contact
              form or by emailing us).
            </p>
          </Section>

          <Section title="Contact Form">
            <p>
              When you use the contact form, we receive the name, email address,
              and message you type — nothing else — and use them only to reply
              to you. The form is protected by Cloudflare Turnstile, which may
              process technical signals (such as your IP address) to tell humans
              from bots, under{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0061aa] underline-offset-4 hover:underline"
              >
                Cloudflare&apos;s privacy policy
              </a>
              . Messages are delivered by our email provider (Resend) and
              retained only as ordinary correspondence.
            </p>
          </Section>

          <Section title="Purchases and Payments">
            <p>
              makobytes.com does not sell anything directly and does not
              collect payment information. Paid products are purchased on
              their own product sites (for example, PixelCopy at
              pixelcopy.app), where payments are handled by that site&apos;s
              payment processor. MakoBytes never stores credit card numbers.
              We will never send you marketing emails unless you explicitly
              opt in.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>
              You can request deletion of any data we hold about you by emailing{" "}
              <a
                href="mailto:admin@makobytes.com"
                className="font-semibold text-[#0061aa] underline-offset-4 hover:underline"
              >
                admin@makobytes.com
              </a>
              . Since our desktop apps store everything locally, there is
              typically nothing for us to delete on our end.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy? Email{" "}
              <a
                href="mailto:admin@makobytes.com"
                className="font-semibold text-[#0061aa] underline-offset-4 hover:underline"
              >
                admin@makobytes.com
              </a>
              .
            </p>
          </Section>
        </div>
      </div>

      <footer className="bg-white">
        <div className="ruler-x" aria-hidden="true" />
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a95a1]">
            © 2026 MakoBytes · Mako Logics LLC
          </span>
          <div className="flex gap-5 text-sm text-[#55606c]">
            <Link href="/" className="transition hover:text-[#0061aa]">
              MakoOS
            </Link>
            <Link href="/sheet" className="transition hover:text-[#0061aa]">
              Spec sheet
            </Link>
            <Link href="/terms" className="transition hover:text-[#0061aa]">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
