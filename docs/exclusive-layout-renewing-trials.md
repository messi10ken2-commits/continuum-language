# Exclusive lesson layouts and renewing Premium trials

## Lesson presentation

The shared player no longer renders an Example panel when the example is empty. All four exclusive video courses use `examples: []`; the old unconditional card created the blank area reported in Safari. Source video, explanations, publisher references and Start practice remain.

Academic chart captions, row labels and methodological caveats now come from reviewed static English, Spanish, Portuguese and Japanese copy selected by the **course language**, with the correct `lang` attribute. Menu language is independent. Values remain 72/100 and 68/100; the chart continues to disclose its hypothetical, self-selected, non-causal nature. No proprietary reference artwork is copied.

## New trial contract

Future trials require explicit agreement to the real recurring price/frequency and collection of payment details in Stripe Checkout. The learner sees the configured Stripe Price first, checks an unchecked renewal-agreement checkbox, and confirms in Stripe. Stripe shows the final total and exact first billing date. The trial starts when Checkout creates the subscription and lasts three days (`subscription_data.trial_period_days=3`); Stripe handles subsequent recurring collection, not an application cron job.

The database stores account, offer/amount/currency/interval, consent timestamp and terms version with the durable checkout intent. Retries reuse the same Stripe idempotency key/session. Price/terms mismatches require a fresh review. Opening a checkout grants no access. Reconciliation requires an authenticated, signed event (or the learner's own authenticated sync), the configured product price, current trialing status, the server's trial metadata and an account-bound consent record. There is one trial per account. Missing payment methods cancel at the end; failed renewal does not grant paid access. Human-class tickets are granted only after a qualifying positive paid invoice, never the trial's zero invoice.

Account → Membership shows trial end, agreed renewal price and a **Cancel trial renewal** action. This schedules cancellation at the trial end and keeps access until then. It remains available when new sales are paused. Manage subscription remains available for later paid subscription changes. Cancellation uses the account's own server-resolved Stripe customer/subscription. Lock order is consistent across checkout, sync and webhook reconciliation.

Existing cardless trials retain their original no-automatic-charge terms; no payment mandate is inferred or created for them. They may separately choose an ordinary paid subscription through Stripe. New cardless starts are retired. Terms/Privacy and offer copy distinguish these contracts.

## Production activation (currently not configured)

On inspection, Railway's production service had **no STRIPE_* or BILLING_* variables**. This release therefore deploys payment capability with checkout disabled; it does not claim that real automatic charges are active. No secrets or prices were invented or modified.

Configure these in Railway's production app service, using the actual Stripe account and actual business prices:

| Variable | Value/purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | The Stripe account's secret API key; keep it in Railway, never client code or chat. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the matching Stripe-mode endpoint `https://continuum-language-production.up.railway.app/api/billing/webhook`. |
| `STRIPE_PREMIUM_MONTHLY_PRICE_ID` | An active, positive, fixed recurring monthly Price in the same account/mode. |
| `STRIPE_PREMIUM_YEARLY_PRICE_ID` | Optional equivalent yearly Price. At least one plan is required. |
| `BILLING_PUBLIC_URL` | `https://continuum-language-production.up.railway.app` |
| `BILLING_ENABLED` | `true` only after keys, price(s) and the webhook are configured. |

Configure Stripe's customer portal to allow subscription management/cancellation. Publish Continuum's `/terms` and `/privacy` URLs in Stripe's business settings and enable appropriate trial/billing reminder messages. Webhook events handled: checkout.session.completed, checkout.session.async_payment_succeeded, customer.subscription.created/updated/deleted/trial_will_end, invoice.paid, invoice.payment_failed, charge.refunded, charge.dispute.created/closed. Keys, prices, webhook mode and endpoint must match. Validate in Stripe test mode first (including a test-clock trial expiry, successful charge, failed charge and pre-expiry cancellation), then configure live mode. Synthetic 9.90 USD in tests is a fixture, not a proposed or live price.

Stripe references checked for this implementation:

- https://docs.stripe.com/payments/checkout/free-trials
- https://docs.stripe.com/billing/subscriptions/trials/free-trials

The existing Checkout integration uses the documented trial-period parameters; the newer Trial Offer API is not generally supported by Checkout outside private preview. No infrastructure connection/settings changes are necessary for the code deployment.

## Verification

- `npm run test:qa`: 306 passed, 0 failed.
- Billing integration fixtures: consent/price mismatch, concurrent requests, required payment collection, confirmed-only access, cancellation with sales disabled, failed payment, paid conversion and tickets, old cardless isolation, and returning to an ordinary paid checkout after a completed trial.
- Chromium and WebKit against the actual built UI and HTTP/PGlite backend: real price/unchecked agreement, Stripe redirect payload (synthetic destination), confirmed trial/cancellation, all four video intros and all four academic charts at 1280px/390px, no horizontal overflow or JavaScript errors.
- Build, language audit, runtime and production dependency checks run before merge; results in the PR.

No production learner charges, subscriptions or cancellation requests are used as tests. Browser engine checks do not claim a physical iPhone/Safari test or live Stripe certification. Real Stripe test-clock validation and live configuration remain prerequisites to activating paid trials.
