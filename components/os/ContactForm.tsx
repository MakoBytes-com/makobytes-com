"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";
import { Check, Send } from "lucide-react";

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}

/** The working form inside contact.eml — Turnstile-gated, posts to
 *  /api/contact (Resend). */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setError(json.error || "Sending failed — email admin@makobytes.com directly.");
        window.turnstile?.reset();
      }
    } catch {
      setStatus("error");
      setError("Network hiccup — try again, or email admin@makobytes.com directly.");
      window.turnstile?.reset();
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-[#d9e6d9] bg-[#f2faf5] p-4">
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]" aria-hidden="true" />
        <div>
          <div className="text-[14px] font-semibold text-[#26303b]">Message sent.</div>
          <div className="mt-1 text-[13px] leading-relaxed text-[#4d5a68]">
            A human reads every message — usually the one who wrote the code.
            You&apos;ll hear back at the address you gave.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="overflow-hidden rounded-lg border border-[#dbe2ea]">
      <div className="grid grid-cols-[72px_1fr] items-center gap-2 border-b border-[#e4e9ef] bg-[#f8fafc] px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a95a1]">To</span>
        <span className="font-mono text-[12.5px] text-[#26303b]">admin@makobytes.com</span>
      </div>
      <div className="grid grid-cols-[72px_1fr] items-center gap-2 border-b border-[#e4e9ef] px-3 py-1.5">
        <label htmlFor="ct-name" className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a95a1]">
          Name
        </label>
        <input
          id="ct-name"
          name="name"
          required
          maxLength={120}
          autoComplete="name"
          className="w-full bg-transparent py-1 text-[13.5px] text-[#26303b] outline-none placeholder:text-[#aab4bf]"
          placeholder="Your name"
        />
      </div>
      <div className="grid grid-cols-[72px_1fr] items-center gap-2 border-b border-[#e4e9ef] px-3 py-1.5">
        <label htmlFor="ct-email" className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a95a1]">
          Reply-to
        </label>
        <input
          id="ct-email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className="w-full bg-transparent py-1 text-[13.5px] text-[#26303b] outline-none placeholder:text-[#aab4bf]"
          placeholder="you@example.com"
        />
      </div>
      {/* honeypot — humans never see it, bots can't resist it */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label htmlFor="ct-company">Company</label>
        <input id="ct-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <textarea
        name="message"
        required
        maxLength={5000}
        rows={5}
        className="block w-full resize-none bg-white px-3 py-3 text-[13.5px] leading-relaxed text-[#26303b] outline-none placeholder:text-[#aab4bf]"
        placeholder="Support, sales, refunds, press — anything. Write like you'd write to a person, because one reads it."
      />
      <div className="border-t border-[#e4e9ef] bg-[#f8fafc] px-3 pt-2.5">
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
        <div
          className="cf-turnstile"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          data-theme="light"
          data-size="flexible"
        />
      </div>
      <div className="flex items-center justify-between gap-3 bg-[#f8fafc] px-3 py-2.5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-machined px-4 py-2 text-[13px] font-semibold disabled:opacity-60"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "error" ? (
          <span className="text-[12px] leading-snug text-[#e11d48]">{error}</span>
        ) : (
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#aab4bf]">
            No tickets · no queues
          </span>
        )}
      </div>
    </form>
  );
}
