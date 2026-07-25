import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "https://makobytes.com/terms" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-[#e4e9ef] py-6 first:pt-0 last:border-b-0 last:pb-0">
      <h2 className="font-display text-xl font-bold text-[#111b26]">{title}</h2>
      <div className="mt-2.5 text-[15px] leading-relaxed text-[#4d5a68]">{children}</div>
    </section>
  );
}

export default function TermsPage() {
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
          <span className="spec-label">// terms.txt</span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#111b26] sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8a95a1]">
          Last updated: July 25, 2026
        </p>

        <div className="plate mt-10 p-7 sm:p-9">
          <Section title="Agreement">
            <p>
              By using MakoBytes software or visiting makobytes.com, you agree to
              these terms. If you do not agree, do not use our products.
            </p>
          </Section>

          <Section title="Free Software">
            <p>
              Free MakoBytes apps are provided at no cost for personal and
              commercial use. They are provided &quot;as is&quot; without
              warranty of any kind. MakoBytes is not liable for any damages
              arising from use of the software.
            </p>
          </Section>

          <Section title="Paid Products">
            <p>
              Paid MakoBytes products are sold on their own product sites (for
              example, PixelCopy at pixelcopy.app). The license model, pricing,
              and any subscription terms are stated plainly on each
              product&apos;s site at the point of purchase, and those terms
              govern that product.
            </p>
          </Section>

          <Section title="Refunds">
            <p>
              Paid products come with a 30-day money-back guarantee. If you are
              not satisfied, email{" "}
              <a
                href="mailto:admin@makobytes.com"
                className="font-semibold text-[#0061aa] underline-offset-4 hover:underline"
              >
                admin@makobytes.com
              </a>{" "}
              within 30 days of purchase for a full refund. No forms, no
              questions.
            </p>
          </Section>

          <Section title="Restrictions">
            <p>
              You may not redistribute, resell, sublicense, or reverse-engineer
              MakoBytes software. One license is valid for one user. If you need
              multiple licenses for a team, contact us.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              MakoBytes software is provided &quot;as is.&quot; To the maximum
              extent permitted by law, MakoBytes shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages
              arising from use of the software. Total liability shall not exceed
              the amount paid for the software.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We may update these terms from time to time. Continued use of
              MakoBytes products after changes constitutes acceptance of the
              updated terms.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions? Email{" "}
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
            <Link href="/privacy" className="transition hover:text-[#0061aa]">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
