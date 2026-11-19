# Readiness operations

All activation gates default off. No real mail, account deletion or Apple charge was performed. Run `node docs/ios/check-deployment-readiness.mjs --strict` for a read-only configuration check; it prints missing setting names and booleans, never secrets. Configured does not mean delivered or provider-verified.

See MAIL_JAPAN_OPERATIONS_DRAFT.md for the supplied Gmail identity and Japan operating-country draft, and PUSH_AND_LINKS.md for implemented default-off remote capabilities.

## Mail and recovery

Use AUTH_MAIL_PROVIDER=smtp with AUTH_SMTP_HOST, AUTH_SMTP_PORT (465 TLS or 587 STARTTLS), AUTH_SMTP_USER, AUTH_SMTP_PASSWORD and a verified single sender address in AUTH_MAIL_FROM. Alternatively choose webhook with an approved HTTPS AUTH_MAILER_WEBHOOK_URL and AUTH_MAILER_WEBHOOK_TOKEN; the provider must honor Idempotency-Key. Redirects are rejected. Configure sender/domain authentication and approve provider retention before real delivery validation.

MAIL_OUTBOX_KEY must be a secret 32-byte key encoded as 64 hexadecimal characters. Enable READINESS_MAINTENANCE_ENABLED only after approving transport. AUTH_RECOVERY_PUBLIC_ORIGIN must be the approved HTTPS origin. Reset payloads expire after 30 minutes and completion mail after seven days; the active worker erases delivered/expired payloads. Failed messages retain ciphertext for bounded retries. SMTP can duplicate after a process crash; exactly-once delivery is not promised. Keep the same encryption key until queued messages are drained or deliberately expired; multi-key rotation is not implemented. Do not log plaintext or credentials. The worker runs every minute with a single-flight guard. A queued notice is not delivered mail.

## Account erasure

Publish the actual policy and processing/retention/subscription handling, then set ACCOUNT_DELETION_POLICY_PUBLISHED=true, ACCOUNT_DELETION_POLICY_VERSION and approved ACCOUNT_DELETION_PROCESSING_DAYS (1-90), ACCOUNT_DELETION_RETENTION_DAYS (1-3650), ACCOUNT_DELETION_BACKUP_DAYS (1-365). These are technical limits, not recommended legal periods. Configure the encrypted mail worker before explicitly setting ACCOUNT_DELETION_ENABLED=true. Do not invent periods to make readiness green.

The user submits a password-confirmed in-app request. The owner opens Administration > Account deletion, previews identity/schema/counts and checks provider-held data, backup procedures, retention, shared history, future-class cancellations and notice to the user. Execution requires all acknowledgements, typing DELETE and the owner's password. Changed identity/counts/policy/schema invalidates a preview; unknown or missing expected user foreign keys fail closed. Owner accounts are protected.

Execution atomically deletes the original account, sessions/recovery tokens, owned learning/generated audio, private class content and support content. Future pending classes are cancelled. Approved minimal shared-class and financial structures may remain under a fresh non-login system record; this requires disclosure and operator approval. It is not a blanket promise of irreversible anonymization or external erasure. Older unowned speech cache requires explicit approval to clear the whole shared legacy cache; bundled human recordings remain.

The receipt records counts, policy, operator, notification reference and retention/backup deadlines without original identity. Retained-record expiry requires manual review/fulfilment; automatic retained-record purge and external-provider erasure are not implemented. Backup expiry is operator-attested, not measured by the app. Before fulfilment, the provider-handling review must also cover continuing web subscription charges, unfulfilled paid classes/credits and any required cancellations or refunds. Resolve these through the approved operator process; the erasure command does not cancel Stripe subscriptions or issue refunds. Store subscription cancellation/refunds are separate; deleting a Continuum account does not cancel App Store subscriptions. Explain those responsibilities before removing account access. Rehearse only with synthetic accounts before activation.

## Apple verification

Keep APPLE_STORE_SERVER_ENABLED=false and APPLE_STORE_LIVE_APPROVED=false until configuration is approved. Supply APPLE_STORE_ENVIRONMENT, APPLE_STORE_BUNDLE_ID, APPLE_STORE_ISSUER_ID, APPLE_STORE_KEY_ID, APPLE_STORE_PRIVATE_KEY and comma-separated APPLE_STORE_PRODUCT_IDS. Production additionally requires numeric APPLE_STORE_APP_ID and explicit live approval. Sandbox is rejected in the production deployment: use isolated staging/local development.

Register POST /api/billing/apple/notifications in App Store Connect for the correct environment and verify real TEST/delivery behavior. The official Apple library checks signed data against the pinned Apple root with online checks. Ownership tokens bind transactions to users. Notifications refetch current Apple state; duplicate/out-of-order delivery cannot simply replay an old entitlement. Maintenance refreshes stale entitlements after six hours, up to 20 per cycle. Test real Sandbox renewals, grace, expiration, restore, refunds, revocation and duplicates before release.

Live native purchasing stays disabled independently of server configuration. Local Xcode purchases cannot grant server Premium. The local fixture prices are placeholders, not approved prices. Actual products, pricing/trial/renewal disclosures and purchase-gate activation require a separately reviewed change.

## Rollout and rollback

Deploy dormant code first and observe database, web and native-auth health. Migrations are additive. Preserve database backups and the encryption key; roll back application code without dropping new tables. Disabling the worker pauses mail/reconciliation. Disabling erasure prevents future executions but cannot undo a committed erasure. Never erase a real account as a deployment smoke test.
