# Continuum owner console

Sign in with the existing platform owner account and choose **Admin**, or **Account → Open your admin dashboard**. Owner access still requires the exact `CONTINUUM_OWNER_USER_ID` and learner role. Teacher reviewers retain their existing limited teacher-review dashboard.

- **Overview** shows account, actual access, teacher application, class and contact totals.
- **Accounts** searches all learners and teachers, including accounts without a billing record. Filters include role and effective Free/Premium access. Details show subscription source, billing interval, paid-through date, cancellation flag, invitation access, class tickets and recent paid invoices. Owner preview never changes these figures.
- **Contacts** receives private in-app support conversations from learners and teachers. Reply, filter by role/status, view earlier messages and resolve/reopen conversations. Users reach this through **Support**, including during profile onboarding. Replies remain in the app; this is not an external email inbox.
- **Services** pauses or restores 12 service areas. Every change requires a reason and is audited. Changes are enforced on the backend; other browser sessions refresh availability every 30 seconds or when returning to the tab. Owner access, sign-in, support, subscription management and Stripe webhooks remain available. Each control describes which new actions it pauses and which existing records/actions remain available.
- **Content** inspects standard lessons and exclusive courses across all four languages. Authored content continues through the repository's existing code review process.
- **Teachers**, **Classes** and **Billing** retain the existing review, class operations, invitation, teacher-ticket, advertisement and payment-event tools.
- **Audit** records new service changes, owner contact replies/status changes and subscription refreshes. Existing teacher, class and invitation histories remain in their respective tools.

## Subscription refresh

**Refresh from Stripe** retrieves provider state through the existing reconciler and updates local records transactionally. It requires the existing Stripe secret, configured Premium price IDs and a recorded customer. Unknown existing price IDs require configuration review first. It performs no charges, subscription cancellation or refunds. Provider failures preserve existing local state. No secrets are returned to the browser.

## Persistence and rollout

Startup creates only additive tables/indexes: `platform_controls`, `owner_events`, `support_tickets`, `support_messages`, and `support_reads`. Existing users, billing records and learning data are unchanged. A missing service setting means enabled, so the rollout pauses no services by default.

Support replies and service changes use optimistic revisions. Refresh a conversation or setting after a conflict; message drafts are retained. Message submission keys prevent duplicate messages on network retries. Read cursors track only displayed messages so new arrivals remain unread.

## Validation

Use the patched Node version in `.node-version`.

```sh
npm run test:owner
npm run test:qa
npm run build
npm run check:runtime
# Install Playwright separately if it is not available in your QA environment.
# Build first; the disposable database server serves the production bundle.
QA_BROWSERS=chromium,webkit PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs npm run test:owner:browser
```

API tests run the actual HTTP handlers against disposable PostgreSQL-compatible PGlite data. They cover owner-only permissions, learner/teacher privacy, effective plans, read-only Stripe refresh, every service control, concurrency, idempotency, read races and pagination. The browser script uses synthetic owner, learner and teacher accounts in that disposable database, then exercises all console sections and desktop/mobile layouts. It never connects to the production database or sends real user contacts.
