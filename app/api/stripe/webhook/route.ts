import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { serverSupabase } from "@/lib/supabase";
import { sendLicenseKeyEmail } from "@/lib/email";
import { reportError } from "@/lib/errlog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe → PromptPixel license sync. checkout.session.completed creates the
// account + license key and emails it; charge.refunded revokes the license.
//
// IMPORTANT: this Stripe account is shared across Mako products (PixelCopy,
// MakoPulse, PromptPixel). Every handler below MUST scope itself to
// PromptPixel — sessions via metadata.app, refunds via a payment-intent match
// against our own accounts table — or we'd license other products' purchases.
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("webhook: STRIPE_WEBHOOK_SECRET missing");
    return new NextResponse("Not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    const raw = await req.text();
    event = Stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (e) {
    console.error("webhook signature verification failed", e);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const supabase = serverSupabase();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.app !== "promptpixel") break; // another product's sale
        if (session.payment_status !== "paid") break; // async methods settle via later events

        const email = session.customer_details?.email?.toLowerCase();
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        const paymentIntent =
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
        if (!email) break;

        const { data: account, error } = await supabase
          .from("accounts")
          .upsert(
            {
              email,
              stripe_customer_id: customerId ?? null,
              stripe_payment_intent: paymentIntent ?? null,
              subscription_status: "active",
              source: "stripe",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "email" },
          )
          .select("license_key")
          .single();
        if (error || !account) {
          await reportError("webhook.account_upsert", error ?? new Error("no account row"), { email });
          return new NextResponse("DB error", { status: 500 });
        }

        try {
          await sendLicenseKeyEmail({
            to: email,
            licenseKey: account.license_key,
            customerName: session.customer_details?.name,
          });
        } catch (e) {
          // Key exists in the DB either way — admin can resend from the dash.
          await reportError("webhook.license_email", e, { email });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntent =
          typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (!paymentIntent) break;

        // Only rows we created match — refunds for other products are no-ops.
        const { error } = await supabase
          .from("accounts")
          .update({ subscription_status: "refunded", updated_at: new Date().toISOString() })
          .eq("stripe_payment_intent", paymentIntent);
        if (error) await reportError("webhook.refund_sync", error, { paymentIntent });
        break;
      }
    }
  } catch (e) {
    await reportError("webhook.handler", e, { event: event.type });
    return new NextResponse("Handler error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
