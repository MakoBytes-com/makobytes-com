import { NextRequest, NextResponse } from "next/server";
import { stripeClient, proPriceId } from "@/lib/stripe";
import { reportError } from "@/lib/errlog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Browser-friendly buy entry: the desktop app (and any "Buy Pro" link) opens
// GET /promptpixel/buy, we mint a Checkout session and bounce straight to
// Stripe. Email is collected by Stripe itself. One-time $25 payment.
export async function GET(req: NextRequest) {
  try {
    const stripe = stripeClient();
    const origin = req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: proPriceId(), quantity: 1 }],
      allow_promotion_codes: true,
      // One-time payments don't create a Customer by default; force it so
      // the admin dash and future refunds have a customer to point at.
      customer_creation: "always",
      // Stripe Tax: price is tax-exclusive (product txcd_10202000, downloadable
      // software). Tax is only actually charged in jurisdictions with an active
      // registration in Stripe; elsewhere Stripe just monitors thresholds.
      automatic_tax: { enabled: true },
      success_url: `${origin}/promptpixel/welcome`,
      cancel_url: `${origin}/promptpixel#pricing`,
      metadata: { app: "promptpixel" },
    });
    if (!session.url) return NextResponse.redirect(`${origin}/promptpixel#pricing`, 302);
    return NextResponse.redirect(session.url, 302);
  } catch (e) {
    await reportError("buy.checkout", e);
    return NextResponse.redirect(new URL("/promptpixel#pricing", req.nextUrl.origin), 302);
  }
}
