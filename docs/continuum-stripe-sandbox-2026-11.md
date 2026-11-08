# Continuum — Stripe sandbox integration record (2026-11-08)

This is an operator runbook for the **Continuum Stripe Sandbox**. It is not the Kotoba merchant account or Continuum live account.

## Verified Stripe sandbox objects

- Stripe account: `acct_1UZSoS9Eu6Fev9ZM` (test/sandbox, not livemode).
- Product: `Continuum Premium`, ID `prod_Vaee0jVa5TV8KP`.
- Monthly recurring Price: `price_1UZTLm9Eu6Fev9ZMTnuYtxdk` — USD 999 cents, 1 month.
- Annual recurring Price: `price_1UZTLo9Eu6Fev9ZM5sut42KI` — USD 7999 cents, 1 year.
- Both Prices active with `tax_behavior=exclusive`.
- Trial length: **3 days**, applied when Continuum creates a subscription Checkout Session; no separate trial Price.
- Current tax decision: operator reports that the business does not currently collect sales tax/GST/VAT. Do **not** automatically enable Stripe Tax or assume no legal registration obligations exist. Review tax registrations, location, and product tax code before going live.
- No live products, customers, subscriptions, or charges were created by this change.

## Staging resources verified and sandbox testing progress

- Isolated Staging PostgreSQL `Postgres-DN6v` with its own persistent Railway volume was created with operator approval. It is **not** the production database.
- The Staging app `unique-contentment` started successfully after `DATABASE_URL` was configured via `\${{Postgres-DN6v.DATABASE_URL}}` using Railway's private reference. Railway deployment status: SUCCESS, startup log: `Continuum API ready`.
- Staging public domain: `https://unique-contentment-staging.up.railway.app` (Railway-managed TLS/DNS). The external Staging smoke test reached the app, registered disposable learners, verified both offers, and opened Stripe-hosted Checkout without granting Premium.
- Stripe sandbox webhook endpoint: `we_1UZTho9Eu6Fev9ZMCGk0EsV1`, version `2026-09-30.endive`, at `https://unique-contentment-staging.up.railway.app/api/billing/webhook`. Its signing secret has been stored in **Staging only**, without exposing it in Git.
- Sandbox Customer Portal configuration: `bpc_1UZTir9Eu6Fev9ZMUYHvqlPd`. Payment method updates, invoices/receipts, and cancellation at period end are enabled; plan switching remains disabled pending dedicated proration testing. Configuration ID is set on Staging.
- Staging has a Sandbox API key, endpoint signing secret, and both test Price IDs. The owner previously completed monthly Sandbox Checkout in Staging and confirmed Premium access.
- Two separate Sandbox subscriptions entered a 72-hour trial. Manually ending those trials generated paid $9.99 monthly and $79.99 annual invoices. Sandbox also produced a payment-failed invoice, successful partial and full refunds, and an active subscription with cancellation scheduled for period end. Railway recorded HTTP 200 deliveries for the test webhook traffic. The direct Stripe fixtures were separate from the Staging learner entitlement tests.
- The operator advanced Test Clocks in Stripe Dashboard. Stripe confirmed automatic monthly renewal ($9.99, `3ZKX1P77-0003`), the first payment after a 72-hour trial ($79.99, `ZSEE1YIZ-0002`), annual renewal ($79.99, `ZSEE1YIZ-0003`), and a separate annual subscription's cancellation at period end. Stripe reported successful delivery and Railway Staging returned HTTP 200 for the corresponding webhooks. These Stripe-created fixtures verify the billing lifecycle and delivery to Staging. Learner entitlement checks use separate application fixtures.
- The operator paid previously failed invoice `GZ5X2HLR-0001` through the Stripe-hosted invoice page with a successful test card. Stripe confirmed payment collection of $9.99, active subscription status and successful `invoice.paid` delivery. Railway Staging returned HTTP 200. This verifies manual recovery. Automatic retry scheduling was not exercised.
- A separate Sandbox subscription paid using Stripe's dispute test card. Stripe opened dispute `du_1UZW9o9Eu6Fev9ZMfXAgksyn` and closed it as won after receiving the documented test evidence. Staging returned HTTP 200 for the dispute webhooks. Application tests use signed synthetic events to verify entitlement recovery, cancellation, disputes, and duplicate or out-of-order delivery.
- **Important discovered compatibility issue:** the Continuum Sandbox account defaults to Stripe Managed Payments **enabled**, while the existing application Checkout request disables Adaptive Pricing. Stripe rejected initial sandbox Checkout requests. Explicitly setting `managed_payments: {enabled:false}` fixes the conflict. This has been added to the PR along with a regression test. Do not enable Managed Payments without separately evaluating its merchant-of-record, eligibility, tax and pricing consequences.
- The operator selected Managed Payments for the web launch. The Sandbox Premium product uses the personal-use SaaS tax code `txcd_10103000`. `BILLING_TAX_MODE=managed` opts new Checkout Sessions into Managed Payments, omits the conflicting pricing and tax parameters, and lets Stripe render its trial disclosure. The app still requires trial consent. Direct Stripe Sandbox creation of an open three-day Managed Payments Checkout succeeded. Hosted completion, localized totals, renewal, cancellation and invoice access must be verified in Managed Payments before live activation. Earlier lifecycle tests used standard Stripe payments.

The billing guard accepts `billing-staging` and `Staging`. It requires `BILLING_SANDBOX_DEPLOYMENT=true`, explicit Stripe **test** mode, Price IDs, webhook secret, and HTTPS origin. The production environment does **not** satisfy the sandbox guard. PR #91 feeds Railway Staging and has not been merged into Production.

## Staging-only variable checklist

Set these on the **Staging application service only**, never on Kotoba or production:

```ini
NODE_ENV=production
BILLING_ENABLED=false  # switch to true ONLY for isolated end-to-end sandbox tests
BILLING_SANDBOX_DEPLOYMENT=true
BILLING_STRIPE_MODE=test
BILLING_MONTHLY_AMOUNT_CENTS=999
BILLING_YEARLY_AMOUNT_CENTS=7999
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_1UZTLm9Eu6Fev9ZMTnuYtxdk
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_1UZTLo9Eu6Fev9ZM5sut42KI
PREMIUM_TICKET_PROGRAMME_ENABLED=false
BILLING_PUBLIC_URL=https://unique-contentment-staging.up.railway.app
STRIPE_SECRET_KEY=YOUR-CONTINUUM-SANDBOX-SECRET-KEY
STRIPE_WEBHOOK_SECRET=YOUR-STAGING-WEBHOOK-SIGNING-SECRET
STRIPE_PORTAL_CONFIGURATION_ID=bpc_1UZTir9Eu6Fev9ZMUYHvqlPd
DATABASE_URL=YOUR-ISOLATED-STAGING-POSTGRES-URL
```

**Do not check actual keys into Git or paste them into chat.** Supply using Railway secret-variable settings. `BILLING_PUBLIC_URL` must match the staging app's HTTPS origin, not the live application. For a sandbox deployment, do not set `BILLING_LIVE_APPROVED=true`.

Use Railway's secret settings for any future rotation of the Continuum Sandbox key and Staging webhook signing secret. Keep Kotoba and Continuum Live credentials out of Staging.

## Verification and go-live gates

1. First repair staging app startup and isolated DB. Confirm the test secret key belongs to the verified Continuum sandbox account.
2. Configure Stripe sandbox webhook and capture its endpoint signing secret separately from the Stripe API key.
3. Confirm trial offer on both prices, explicit consent, payment method collection, and **72-hour** free trial.
4. Use Stripe test cards and Test Clocks to verify trial-to-paid, monthly/annual renewals, payment failures, cancellation, refunds, disputes, retries/idempotency, and invoice history. Check server-side Premium entitlement; Checkout redirects alone never unlock Premium.
5. Verify an actual hosted invoice/PDF in learner Membership, and that one learner cannot view another customer's invoices.
6. Execute repository tests. Invoice safety, unpaid Staging Checkout and frontend compilation passed. The corrected Photo-mode selector cleared the earlier `.study-page` timeout in GitHub Actions. The six-language browser test now reaches its mobile layout assertion and reports overflow in the Chinese Photo A1 map fixture. Desktop and mobile payment-screen QA remains open.
7. Keep production `BILLING_ENABLED=false` until a **separate** live Stripe account setup, live Price IDs, tax review, legal/refund terms, webhook, user-controlled test charge/refund, and final operational sign-off.

Teacher classes use the existing booking and ticket flow. Future paid classes need a separate payment record linked to each booking, package credits, cancellation and refund reconciliation, and a teacher earnings ledger. Teacher payouts and Connect require separate business approval and a verified payout design.
