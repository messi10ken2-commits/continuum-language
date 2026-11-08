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
- Staging public domain: `https://unique-contentment-staging.up.railway.app` (Railway-managed TLS/DNS). Public end-to-end HTTP from outside Railway has not been established by this run.
- Stripe sandbox webhook endpoint: `we_1UZTho9Eu6Fev9ZMCGk0EsV1`, version `2026-09-30.endive`, at `https://unique-contentment-staging.up.railway.app/api/billing/webhook`. Its signing secret has been stored in **Staging only**, without exposing it in Git.
- Sandbox Customer Portal configuration: `bpc_1UZTir9Eu6Fev9ZMUYHvqlPd`. Payment method updates, invoices/receipts, and cancellation at period end are enabled; plan switching remains disabled pending dedicated proration testing. Configuration ID is set on Staging.
- `BILLING_PUBLIC_URL` and both price IDs are configured on Staging. `BILLING_ENABLED=false` and `BILLING_SANDBOX_DEPLOYMENT=false` **remain** in place; no Stripe secret API key is configured. No real purchases were enabled.
- Two direct Stripe **sandbox** hosted Checkout Sessions were successfully created, one with the $9.99 monthly Price and one with the $79.99 annual Price, each with 3 trial days, required payment method, and zero immediate due. Line item price IDs and intervals were verified. These uncompleted sessions do **not** test completed card entry, webhook delivery, app entitlements, paid invoices, or renewal.
- **Important discovered compatibility issue:** the Continuum Sandbox account defaults to Stripe Managed Payments **enabled**, while the existing application Checkout request disables Adaptive Pricing. Stripe rejected initial sandbox Checkout requests. Explicitly setting `managed_payments: {enabled:false}` fixes the conflict. This has been added to the PR along with a regression test. Do not enable Managed Payments without separately evaluating its merchant-of-record, eligibility, tax and pricing consequences.

The original billing guard only accepted `RAILWAY_ENVIRONMENT_NAME=billing-staging`. This branch also supports `Staging`, but still requires `BILLING_SANDBOX_DEPLOYMENT=true`, explicit Stripe **test** mode, Price IDs, webhook secret, and HTTPS origin. The production environment does **not** satisfy the sandbox guard. The PR is not merged or deployed.

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

The sandbox event destination and test Customer Portal have been configured (see above). The **missing prerequisite** is a Continuum Sandbox `sk_test_...` key in Railway Staging, entered by the operator through Railway's secret settings; this cannot be retrieved by the connected Stripe API. Never use a Kotoba or Continuum live key.

## Verification and go-live gates

1. First repair staging app startup and isolated DB. Confirm the test secret key belongs to the verified Continuum sandbox account.
2. Configure Stripe sandbox webhook and capture its endpoint signing secret separately from the Stripe API key.
3. Confirm trial offer on both prices, explicit consent, payment method collection, and **72-hour** free trial.
4. Use Stripe test cards and Test Clocks to verify trial-to-paid, monthly/annual renewals, payment failures, cancellation, refunds, disputes, retries/idempotency, and invoice history. Check server-side Premium entitlement; Checkout redirects alone never unlock Premium.
5. Verify an actual hosted invoice/PDF in learner Membership, and that one learner cannot view another customer's invoices.
6. Execute repository tests. PR invoice safety and frontend build pass; the general workflow is currently obstructed by a third-party `ffmpeg-static` download returning HTTP 504, so full QA still requires a successful rerun.
7. Keep production `BILLING_ENABLED=false` until a **separate** live Stripe account setup, live Price IDs, tax review, legal/refund terms, webhook, user-controlled test charge/refund, and final operational sign-off.

**Paid teacher lessons, teacher payouts, Connect, and separate one-time invoices are not included in this sandbox Premium integration.** Stripe Billing automatically provides invoices for Premium subscriptions. Use the Stripe Dashboard for exceptional/manual invoicing until that independent purchase flow is specified.
