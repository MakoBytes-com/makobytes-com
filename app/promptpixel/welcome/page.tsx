import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Welcome to PromptPixel Pro",
  robots: { index: false },
};

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#0f1218] text-white flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-semibold tracking-tight">MakoBytes</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/15">
            <Check className="h-7 w-7 text-[#10B981]" strokeWidth={3} aria-hidden />
          </div>
          <h1 className="mb-3 text-3xl font-black tracking-tight">
            You&apos;re Pro. Welcome aboard.
          </h1>
          <p className="text-white/70 leading-relaxed">
            Your license key is on its way to your inbox right now. To
            activate: open PromptPixel → <strong className="text-white">Settings</strong> →{" "}
            <strong className="text-white">License</strong> → paste the key and
            click <strong className="text-white">Activate</strong>.
          </p>
          <p className="mt-6 text-sm text-white/50">
            No email after a few minutes? Check spam, or write us at{" "}
            <a href="mailto:rsailors@makologics.com" className="text-[#3B82F6] hover:underline">
              rsailors@makologics.com
            </a>
            .
          </p>
        </div>
      </div>

      <footer className="text-center text-white/40 text-sm py-6">
        <Link href="/promptpixel" className="text-[#3B82F6] hover:underline">
          makobytes.com/promptpixel
        </Link>
      </footer>
    </main>
  );
}
