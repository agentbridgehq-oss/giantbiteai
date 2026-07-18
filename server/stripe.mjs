import Stripe from "stripe";

// Live recurring price IDs in the connected Stripe account (Regular $5.99/mo, Pro $12.99/mo).
// Used as defaults so checkout works with only STRIPE_SECRET_KEY set; env vars override if present.
const DEFAULT_PRICE_ID_REGULAR = "price_1TmqdaP5z41oM8NhgfcsKcJc";
const DEFAULT_PRICE_ID_PRO = "price_1TmqdXP5z41oM8Nhy9bpnQFy";

let stripeClient = null;

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw Object.assign(new Error("Payments aren't configured yet"), { status: 503 });
  }
  if (!stripeClient) stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
}

export async function createCheckoutSession({ plan, origin, customerEmail }) {
  const priceId = plan === "regular"
    ? (process.env.STRIPE_PRICE_ID_REGULAR || DEFAULT_PRICE_ID_REGULAR)
    : (process.env.STRIPE_PRICE_ID_PRO || DEFAULT_PRICE_ID_PRO);
  if (!priceId) {
    throw Object.assign(new Error("Payments aren't configured yet"), { status: 503 });
  }
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/pricing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    // Capture email for welcome + ownership — Stripe always collects billing email;
    // prefill when we already have it from the pricing form.
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    billing_address_collection: "auto",
  });
  return session.url;
}

export async function verifyCheckoutSession(sessionId) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const paid = session.payment_status === "paid" || session.status === "complete";
  const email =
    session.customer_details?.email ||
    session.customer_email ||
    null;
  return { paid, email, plan: session.metadata?.plan || null };
}
