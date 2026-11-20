# Continuum Premium web billing

| Plan | Recurring amount |
| --- | --- |
| Monthly | USD 9.99 billed monthly |
| Yearly | USD 79.99 billed annually |
| Trial | 3 days, with the selected plan billed automatically unless cancelled |

The annual plan is equivalent to about USD 6.67 per month and saves USD 39.89 per year against 12 monthly payments. Classroom purchases use a separate flow.

## Sandbox

1. Use the existing Stripe sandbox and an isolated database. In Railway, use an isolated environment named `billing-staging` with its own URL and set `BILLING_SANDBOX_DEPLOYMENT=true`. Local development does not need that flag.
2. In the sandbox create or select the Continuum Premium product with two recurring USD prices. An operator with a sandbox key can run `node scripts/provision-billing-sandbox.mjs --apply` from the repository. Set `STRIPE_PREMIUM_PRODUCT_ID` to reuse an existing product. The script prints the two Price IDs only.
3. Configure the sandbox environment with `BILLING_STRIPE_MODE=test`, `BILLING_PUBLIC_URL`, the sandbox key, both Price IDs, and the sandbox webhook signing secret. Set `BILLING_ENABLED=true` in the isolated environment when ready. Keep the signing secret and API key in secret storage.
4. In Stripe, create the event destination at `<staging URL>/api/billing/webhook`. Subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.trial_will_end`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`, `charge.dispute.created` and `charge.dispute.closed`.
5. Configure a sandbox Customer Portal with payment method management, invoices and cancellation at period end. Set `STRIPE_PORTAL_CONFIGURATION_ID` to use a specific configuration. Enable plan switching only after reviewing and testing the portal's renewal date and proration settings for the two prices.
6. Run hosted Checkout for each plan. Compare the currency, amount, interval and first billing date shown by Stripe with Membership. Test completion, cancellation, refresh, a card decline, and portal cancellation. Use a sandbox subscription simulation to exercise the trial end and renewal, with the same configuration and webhook destination. Verify old or repeated events, refunds and disputes in Admin. The local HTTP tests use a fake Stripe API, including the webhook signature path.

## Live readiness

- Complete the Stripe account and business verification and confirm payment methods, supported selling regions, refund terms, tax treatment and registrations. Review the terms shown at Checkout and configure trial and renewal notices in Stripe.
- Create separate Live product prices, portal configuration and webhook destination for production. Set `BILLING_STRIPE_MODE=live` with matching Live credentials and Price IDs. Configure `BILLING_TAX_MODE=automatic` only when Stripe Tax and the applicable registrations have been set up. Use `off` only after the operator has determined how the business will handle applicable taxes.
- Keep `BILLING_ENABLED=false` and `BILLING_LIVE_APPROVED=false` through code deployment and configuration review. Live Checkout requires both flags, the two distinct Price IDs, matching currency/amount/interval, and an explicit tax mode. Enable both flags only after the operator signs off. The operator should perform and verify the first real payment and refund.
- Keep `PREMIUM_TICKET_PROGRAMME_ENABLED=false` until teacher participation, compensation, eligible durations and refund/cancellation rules are approved. Mark participating approved teachers in Admin → Billing. Previously granted tickets remain in the learner's record.
- For future pricing, create new Stripe prices, update the expected amounts and the two current Price IDs, and keep the former IDs in `STRIPE_PREMIUM_LEGACY_PRICE_IDS`. Existing subscriptions keep their Stripe prices until explicitly migrated.
- Review native app store purchase rules separately when planning in-app sales.

Admin figures are based on the invoice, refund and webhook data synchronized to Continuum. Recorded invoice totals are gross, and event counts include processing events rather than unique net payments. MRR and ARR are list-price estimates for known active USD subscriptions. Check Stripe reports for tax, fees, bank payouts, full historical reconciliation and refund settlement.

Official references: [Checkout trials](https://docs.stripe.com/payments/checkout/free-trials), [subscription simulations](https://docs.stripe.com/billing/testing/test-clocks), [Customer Portal configuration](https://docs.stripe.com/customer-management/configure-portal), [Stripe Tax registrations](https://docs.stripe.com/tax/registering).
