# Mail and Japan operations — working draft

Updated 19 November 2026. The owner supplied continuum.language@gmail.com and Japan as the operating country. Ken confirmed individual operation and a two-business-day acknowledgement / seven-calendar-day normal deletion target on 19 November. Ken confirmed the public individual operator name as Ken Ishizawa on 20 November. Ken selected daily/weekly/monthly backups with an approximately 90-day maximum retention direction on 20 November. Public address, tax status and actual backup settings/expiry evidence remain unconfirmed. No real account has been erased and no inbox receipt has been verified.

## Selected first-stage mail setup

Use Gmail's HTTPS API for a limited operational pilot with the supplied Gmail identity. This avoids relying on Railway SMTP egress, which is available only on Pro and higher plans. The connected metadata does not expose the workspace plan; a browser check reached a separate sign-in requirement. No paid plan was changed. A Gmail address cannot be verified as an owned sender domain through Resend.

Public contact, From address and authorized test inbox: continuum.language@gmail.com. The Gmail API transport uses fixed Google HTTPS endpoints, OAuth refresh credentials, UTF-8 MIME, strict recipient/header checks, redirect rejection and bounded request timeouts. No new mail provider or advertising SDK is added. Sending can duplicate after a crash; exactly-once delivery is not promised. Gmail's account limits still apply; assess an owned-domain transactional service before higher-volume launch.

| Setting | Value |
| --- | --- |
| AUTH_MAIL_PROVIDER | gmail-api |
| AUTH_MAIL_FROM | continuum.language@gmail.com |
| AUTH_MAIL_TEST_RECIPIENT | continuum.language@gmail.com |
| AUTH_RECOVERY_PUBLIC_ORIGIN | https://continuum-language-production.up.railway.app |
| READINESS_MAINTENANCE_ENABLED | false until authorized configuration is ready |

The existing encryption key remains server-side in MAIL_OUTBOX_KEY. Retain it until queued messages are drained/expired; do not reuse it for push tokens.

## Secure Google setup still required

1. In a Google Cloud project controlled by the operator, enable the Gmail API and configure the OAuth application/client according to Google's current guidance. Select the actual continuum.language@gmail.com account when granting access.
2. Obtain an offline refresh grant for the minimum gmail.send scope through Google's official OAuth flow. Only the operator mailbox connects; learners do not grant Gmail access. Review applicable consent, publishing and verification requirements rather than assuming an exemption.
3. Store AUTH_GMAIL_CLIENT_ID, AUTH_GMAIL_CLIENT_SECRET and AUTH_GMAIL_REFRESH_TOKEN in the production service's secure Variables settings. Never paste client secrets, refresh/access tokens, authorization codes or a Google password into chat or source control. The current implementation consumes a securely provisioned refresh grant; it does not create a Google Cloud project or present a public Google-connection UI.
4. Testing-mode refresh grants involving Gmail normally expire after seven days. Do not use an expiring development grant as the permanent production setup. Review Google publishing/verification requirements and test revocation/reconnection before launch.
5. After configuration, enable READINESS_MAINTENANCE_ENABLED for the owner-requested arrival check. Apple/push/erasure gates stay independently off. A configuration boolean is not proof of a valid grant or delivery.

No Google OAuth credentials or refresh grant have been supplied. The worker remains off. An App Password is not used by the HTTPS transport.

SMTP remains an optional alternative when Railway Pro-or-higher SMTP egress is confirmed: AUTH_MAIL_PROVIDER=smtp, smtp.gmail.com, port 465 with TLS, supplied Gmail username/From and a Gmail App Password in AUTH_SMTP_PASSWORD. Google App Passwords require eligible two-step verification. Do not use an ordinary Google password or purchase a Railway upgrade automatically. The previously prepared SMTP host/username fields are harmless while the selected provider is gmail-api.

## Actual arrival check

1. Sign in as the platform owner and open Administration → Email after secure Google setup and worker activation. Configuration booleans must be ready.
2. Enter the owner's Continuum password and request one test. The server fixes the recipient; the browser cannot send to an arbitrary address.
3. In the real supplied Gmail inbox, inspect From (must be continuum.language@gmail.com), recipient and message content, including Spam if needed. Enter the reference and ten-character proof code from that message within 30 minutes.
4. Record the confirmation time. The outbox status delivered means provider acceptance; only the received proof sets inboxConfirmed.
5. Rehearse reset delivery, single-use/expiry, password change and session revocation with a synthetic account and an inbox the operator controls.

Active maintenance removes inbox-check metadata 30 days after its proof expires. Message payloads are removed on delivery/expiry. This technical log limit is separate from financial retention. Automated tests mock Google/provider traffic and verify MIME, credential scoping, failures, encryption and proof handling; they do not establish real inbox arrival.

## Account deletion proposal, not activated policy

Owner-selected operational target: acknowledge verified requests within **2 business days** and aim to complete active-account deletion within **7 calendar days**, after resolving paid classes, credits, subscription cancellation/refunds and required provider processing. This is an owner-selected service target, not yet a published legal promise or automatic erasure timer.

Proposed review cadence: review retained shared/financial records every **30 days**. This is a review cadence, not permission to delete required accounting records after 30 days. The current retention-deadline setting controls an operator review date; it does not automatically purge financial records. Backup expiry must be taken from the actual configured backup service/plan and restore procedures; no number is assumed.

Japanese accounting retention depends on the operator’s business/tax status and record type; do not apply a blanket period measured from account deletion. Identify the operator, applicable duties and fiscal-record schedule before finalizing the retained-record policy. Keep only required fields, restrict access and record the reason and correct expiry per record class. Review actual provider contracts/transfers (Railway/PostgreSQL currently US region, Google mailbox, optional AI providers, Apple and payment providers) before publication.

Do not set `ACCOUNT_DELETION_POLICY_PUBLISHED=true` or enable real erasure until the operator identity, backup period, provider handling and retention schedule are confirmed and the actual policy is published. The owner’s preview/acknowledgement/password safeguards remain mandatory. Deleting an account does not cancel a store subscription.

## Sources checked

- Google SMTP and TLS: https://developers.google.com/workspace/gmail/imap/imap-smtp
- Google App Password conditions: https://support.google.com/mail/answer/185833
- Japan PPC guidance: https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/
- NTA individual-business record guidance (conditional on actual status): https://www.nta.go.jp/taxes/shiraberu/shinkoku/kojin_jigyo/0021012-127_01.pdf


Additional checked sources:
- Railway SMTP plan restriction: https://docs.railway.com/networking/outbound-networking
- Gmail MIME/send API: https://developers.google.com/workspace/gmail/api/guides/sending
- Google refresh grants: https://developers.google.com/identity/protocols/oauth2/web-server
- Google token lifetime and publishing: https://developers.google.com/identity/protocols/oauth2

## Detailed operational review

See [ACCOUNT_DELETION_RUNBOOK_JA.md](ACCOUNT_DELETION_RUNBOOK_JA.md) for the per-record handling, proposed service targets, backup evidence checklist and isolated restore/re-erasure procedure. Public address/tax classification, actual backup configuration and final policy publication remain pending.
