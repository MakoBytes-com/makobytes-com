import Stripe from "stripe";

// Server-only Stripe client. Same rule as lib/cloud.ts: never import from a
// client component. Throws when unconfigured so routes fail loudly, not
// silently, in a misdeployed environment.
export function stripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key);
}

export const PRO_PRICE_ENV = "STRIPE_PRICE_PROMPTPIXEL";

export function proPriceId(): string {
  const id = process.env[PRO_PRICE_ENV];
  if (!id) throw new Error(`${PRO_PRICE_ENV} not configured`);
  return id;
}
