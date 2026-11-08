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

## Confirmed Railway staging blocker

Project `a9fc8ce8-6a6d-4052-b77a-a8e9d0be5223` has an environment **Staging**, currently with a single `unique-contentment` app service sourced from main. Its latest deployment is **CRASHED** because `DATABASE_URL` is missing. No public domain or staging PostgreSQL service is configured.

The original billing guard only accepted `RAILWAY_ENVIRONMENT_NAME=billing-staging`. This branch also supports the existing `Staging` name, while *requiring* `BILLING_SANDBOX_DEPLOYMENT=true`, explicit Stripe **test** mode, Price IDs, a webhook secret, and HTTPS public origin. The production environment does **not** satisfy the sandbox guard.

Do not use the production database for payment tests. Provision a separate staging Postgres database and publicly reachable staging HTTPS domain before attempting end-to-end Checkout. Creating cloud resources may incur cost, so do this with operator approval.

## Staging-only variable checklist

Set these on the **Staging application service only**, never on Kotoba or production:

```ini
NODE_ENV=production
BILLING_ENABLED=true
BILLING_SANDBOX_DEPLOYMENT=true
BILLING_STRIPE_MODE=test
BILLING_MONTHLY_AMOUNT_CENTS=999
BILLING_YEARLY_AMOUNT_CENTS=7999
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_1UZTLm9Eu6Fev9ZMTnuYtxdk
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_1UZTLo9Eu6Fev9ZM5sut42KI
PREMIUM_TICKET_PROGRAMME_ENABLED=false
BILLING_PUBLIC_URL=https://YOUR-STAGING-DOMAIN
STRIPE_SECRET_KEY=YOUR-CONTINUUM-SANDBOX-SECRET-KEY
STRIPE_WEBHOOK_SECRET=YOUR-STAGING-WEBHOOK-SIGNING-SECRET
STRIPE_PORTAL_CONFIGURATION_ID=OPTIONAL-TEST-PORTAL-CONFIGURATION
DATABASE_URL=YOUR-ISOLATED-STAGING-POSTGRES-URL
```

**Do not check actual keys into Git or paste them into chat.** Supply using Railway secret-variable settings. `BILLING_PUBLIC_URL` must match the staging app's HTTPS origin, not the live application. For a sandbox deployment, do not set `BILLING_LIVE_APPROVED=true`.

Configure a **Stripe sandbox event destination** with the version expected by the installed Stripe SDK for `https://YOUR-STAGING-DOMAIN/api/billing/webhook`. Subscribe to the events listed in `docs/membership-billing.md`. Configure a test Customer Portal to support cancellation and payment-method updates.

## Verification and go-live gates

1. First repair staging app startup and isolated DB. Confirm the test secret key belongs to the verified Continuum sandbox account.
2. Configure Stripe sandbox webhook and capture its endpoint signing secret separately from the Stripe API key.
3. Confirm trial offer on both prices, explicit consent, payment method collection, and **72-hour** free trial.
4. Use Stripe test cards and Test Clocks to verify trial-to-paid, monthly/annual renewals, payment failures, cancellation, refunds, disputes, retries/idempotency, and invoice history. Check server-side Premium entitlement; Checkout redirects alone never unlock Premium.
5. Verify an actual hosted invoice/PDF in learner Membership, and that one learner cannot view another customer's invoices.
6. Execute repository tests. PR invoice safety and frontend build pass; the general workflow is currently obstructed by a third-party `ffmpeg-static` download returning HTTP 504, so full QA still requires a successful rerun.
7. Keep production `BILLING_ENABLED=false` until a **separate** live Stripe account setup, live Price IDs, tax review, legal/refund terms, webhook, user-controlled test charge/refund, and final operational sign-off.

**Paid teacher lessons, teacher payouts, Connect, and separate one-time invoices are not included in this sandbox Premium integration.** Stripe Billing automatically provides invoices for Premium subscriptions. Use the Stripe Dashboard for exceptional/manual invoicing until that independent purchase flow is specified.
