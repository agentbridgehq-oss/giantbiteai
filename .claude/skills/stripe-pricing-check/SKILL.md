---
name: stripe-pricing-check
description: Verify GiantBiteAI's Stripe checkout is wired correctly for both pricing plans (Regular $5.99/mo, Pro $12.99/mo) without spending real money. Use before/after any pricing or Stripe-related deploy.
---

# Stripe pricing sanity check

Confirms the live `/api/checkout` endpoint creates valid Stripe Checkout sessions for both
plans, without ever completing a real payment. This is a read-only / session-creation-only
check — it never charges a card.

## Steps

1. Hit the live checkout endpoint for both plans:
   ```bash
   curl -s -X POST https://giantbiteai-production.up.railway.app/api/checkout \
     -H "Content-Type: application/json" -d '{"plan":"regular"}'
   curl -s -X POST https://giantbiteai-production.up.railway.app/api/checkout \
     -H "Content-Type: application/json" -d '{"plan":"pro"}'
   ```
2. Confirm each response is `{"url": "https://checkout.stripe.com/..."}` with a `cs_live_...`
   session ID in the URL — not a `503`/error. A `503` with "Payments aren't configured yet"
   means `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_REGULAR`, or `STRIPE_PRICE_ID_PRO` is missing
   on Railway.
3. Sanity-check the current expected prices against `client/src/lib/storage.ts`
   (`REGULAR_PRICE_MONTHLY`, `PRO_PRICE_MONTHLY`) — if those constants change, the Stripe
   Price objects themselves (in the Stripe dashboard / via the Stripe MCP connector) need to
   be updated to match, since the server only stores Price IDs, not amounts.
4. Report pass/fail plainly: which plan(s) returned a valid session, which didn't, and why
   (missing env var vs. Stripe API error vs. price ID mismatch).

## What this does NOT do

- Never completes a payment or enters card details.
- Never creates, modifies, or archives Stripe Products/Prices.
- Doesn't verify the post-payment `/api/verify-checkout` → Pro-unlock flow — that still
  requires one real test purchase (refundable) since this is a live (not test-mode) Stripe key.
