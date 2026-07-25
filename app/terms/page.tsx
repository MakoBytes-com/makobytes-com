import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "https://makobytes.com/terms" },
};

export default function TermsPage() {
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
        <div className="mono-tag mb-4 text-[#0061aa]">// terms</div>
        <h1 className="mb-8 text-4xl font-black tracking-tight">
          <span className="text-gradient">Terms of Service</span>
        </h1>
        <p className="mono-tag mb-12 text-[#999999]">
          Last updated: July 25, 2026
        </p>

        <div className="space-y-8 text-[#555555]">
          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">Agreement</h2>
            <p className="leading-relaxed">
              By using MakoBytes software or visiting makobytes.com, you agree to
              these terms. If you do not agree, do not use our products.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">
              Free Software
            </h2>
            <p className="leading-relaxed">
              Free MakoBytes apps are provided at no cost for personal and
              commercial use. They are provided &quot;as is&quot; without
              warranty of any kind. MakoBytes is not liable for any damages
              arising from use of the software.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">
              Paid Products
            </h2>
            <p className="leading-relaxed">
              Paid MakoBytes products are sold on their own product sites (for
              example, PixelCopy at pixelcopy.app). The license model, pricing,
              and any subscription terms are stated plainly on each
              product&apos;s site at the point of purchase, and those terms
              govern that product.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">Refunds</h2>
            <p className="leading-relaxed">
              Paid products come with a 30-day money-back guarantee. If you are
              not satisfied, email{" "}
              <a
                href="mailto:admin@makobytes.com"
                className="text-[#0061aa] transition hover:text-[#004d88]"
              >
                admin@makobytes.com
              </a>{" "}
              within 30 days of purchase for a full refund. No forms, no
              questions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">
              Restrictions
            </h2>
            <p className="leading-relaxed">
              You may not redistribute, resell, sublicense, or reverse-engineer
              MakoBytes software. One license is valid for one user. If you need
              multiple licenses for a team, contact us.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">
              Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              MakoBytes software is provided &quot;as is.&quot; To the maximum
              extent permitted by law, MakoBytes shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages
              arising from use of the software. Total liability shall not exceed
              the amount paid for the software.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">Changes</h2>
            <p className="leading-relaxed">
              We may update these terms from time to time. Continued use of
              MakoBytes products after changes constitutes acceptance of the
              updated terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#333333]">Contact</h2>
            <p className="leading-relaxed">
              Questions? Email{" "}
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
