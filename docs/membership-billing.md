# Premium membership and Stripe operations

Premium is a learner subscription. Existing free learning remains available. Premium adds ad-free use, access to all current features, four exclusive practical courses, and three introductory class tickets awarded once after the first positive paid subscription invoice. The exclusive course contents and grading remain on the server. Account contains membership controls; the owner Admin page contains billing status, an event audit, participating teachers and an optional first-party ad campaign.

## Enable purchases

Purchases stay disabled until all required settings are present. No production price or currency has been assumed, and no real charge was made during implementation.

1. Decide the amount, currency and monthly/yearly intervals. Create a Stripe Premium product and positive recurring Prices. Configure the Stripe customer portal, including cancellation. Do not enable arbitrary price changes to products this application does not recognize.
2. Start with a Stripe sandbox. Set the variables in `.env.example` through the deployment's secret settings. Never put secret keys in Git or browser code. Test and live keys, Prices and webhook secrets must belong to the same mode/account.
3. Register a **snapshot** webhook at `https://continuum-language-production.up.railway.app/api/billing/webhook`. The installed Stripe SDK is 23.0.0, API version `2026-09-30.endive`. Use that event API version. Subscribe to:
   - `checkout.session.completed`, `checkout.session.async_payment_succeeded`
   - `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - `invoice.paid`, `invoice.payment_failed`
   - `charge.refunded`, `charge.dispute.created`, `charge.dispute.closed`
4. Save that endpoint's signing secret as `STRIPE_WEBHOOK_SECRET`. Set `BILLING_PUBLIC_URL` to the exact public HTTPS origin. Set `BILLING_ENABLED=true` only when ready for testing or sales. Turning sales off does not disable the customer portal or processing existing subscription webhooks.
5. Test successful checkout, declined payment, renewal, cancellation at period end, refund, duplicate events and portal access in Stripe sandbox. Verify the database and Admin audit. Then configure the equivalent live settings and perform an operator-controlled live purchase/refund before inviting paying users.
6. Select approved participating teachers under Admin. Agree how their introductory classes will be funded before selling the benefit. A ticket covers one eligible class up to the configured duration (default 60 minutes).

The purchase button sends the learner to Stripe's hosted checkout to review the actual configured price. Card details are never collected or stored by Continuum. The success URL alone cannot grant membership. Stripe connection, Prices, endpoint registration and real end-to-end payments still require operator setup.

## Membership and tickets

- Server-verified active, paid, unexpired subscriptions grant Premium. Failed/unpaid/paused/expired subscriptions do not. Scheduled cancellation retains access until the paid period ends. A paid zero-value invoice can retain access, but does not trigger the initial paid ticket award.
- Renewals and rejoining never award three more tickets. An active membership is required to reserve an unused ticket. Standard cancellation returns the ticket; confirmed rescheduling transfers it; completing the class consumes it. Existing reservations are not automatically cancelled just because membership expires.
- A full refund or unresolved dispute for a recorded Premium invoice blocks Premium and revokes unused tickets, cancelling future confirmed ticket bookings with an explanatory reason. Completed teaching is preserved. Partial refunds do not automatically revoke access. Refunds and dispute resolution are managed in Stripe; this implementation does not initiate refunds or cancel Stripe subscriptions automatically.
- After resolving a dispute, Stripe's current state determines access. Refund blocks require operator support review; a new payment does not silently remove them. Histories above 100 subscriptions fail closed for support review.
- Webhooks verify signed raw bytes, reject a test/live mismatch, process in a transaction and deduplicate event IDs. Current Stripe subscription state determines access, so delayed events cannot restore cancelled membership. Failures return a retryable status. Checkout retries reuse the same durable purchase request and Stripe idempotency key.
- If changing Prices, retain old IDs in `STRIPE_PREMIUM_LEGACY_PRICE_IDS` for existing subscribers. Never delete the membership/ticket grant history to reset an account.

## Scope and verification

Individual classes remain the existing zero-price pilot. Subscription revenue is not teacher earnings. Stripe Connect, teacher payouts, paid individual-class checkout, an automated refund service and tax-policy decisions are outside this release. Premium ticket teachers must be arranged by the operator.

`node billing-api.test.mjs` uses a disposable database and signed mock Stripe events: checkout retries, server entitlements, ticket lifecycle/concurrency, refunds, cancellation, renewals and duplicate webhooks. `node billing-render.test.mjs` covers six display languages. `node scripts/qa-billing.mjs` exercises the built mobile UI with synthetic accounts. These tests do not replace a real Stripe sandbox checkout. Exclusive course descriptions and detailed teaching feedback are currently authored in English; shared membership UI supports the six display languages.
