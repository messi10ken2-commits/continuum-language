# Mail and Japan operations — working draft

Updated 19 November 2026. Ken supplied `continuum.language@gmail.com` and Japan as the operating country. This does not establish a registered company, Japanese residence, legal address, tax status or a solution to Malaysia/Apple enrollment restrictions. No real account has been erased and no inbox receipt has been verified.

## Selected first-stage mail setup

Use the existing TLS SMTP transport with Gmail for a limited operational pilot. Public contact, sender identity and authorized test inbox: `continuum.language@gmail.com`. This is a Gmail mailbox; it is not a domain that Continuum can authenticate through a separate sender-domain service. Do not configure Resend to send as gmail.com. Check Gmail account availability and sending limits before broader launch; move transactional mail to an owned-domain service if volume or deliverability requires it.

Set these public values in the production service’s Variables page:

| Setting | Value |
| --- | --- |
| AUTH_MAIL_PROVIDER | smtp |
| AUTH_SMTP_HOST | smtp.gmail.com |
| AUTH_SMTP_PORT | 465 |
| AUTH_SMTP_USER | continuum.language@gmail.com |
| AUTH_MAIL_FROM | continuum.language@gmail.com |
| AUTH_MAIL_TEST_RECIPIENT | continuum.language@gmail.com |
| AUTH_RECOVERY_PUBLIC_ORIGIN | https://continuum-language-production.up.railway.app |

Store `AUTH_SMTP_PASSWORD` as a Gmail App Password in secure service settings; never paste it into chat, source code, screenshots or the ordinary account-password field. Google requires two-step verification and may restrict App Password availability. The current transport supports SMTP user/App Password; OAuth2 is not implemented. If App Passwords are unavailable, implement OAuth2 or choose an approved owned-domain provider rather than using the ordinary Google password.

Generate `MAIL_OUTBOX_KEY` as 32 random bytes encoded as 64 hex characters in a secure administrative environment. Keep it in service secrets and retain it until queued messages are drained/expired. Do not reuse the APNs token encryption key. Keep `READINESS_MAINTENANCE_ENABLED` off until the settings are complete; this flag also starts Apple/push maintenance, whose independent enable flags must remain off until separately ready.

## Actual arrival check

1. Enable the encrypted mail worker after configuration. Sign in as the platform owner and open Administration → Email. Configuration booleans must be ready.
2. Enter the owner’s Continuum password and request one delivery check. The destination is fixed by the server; the browser cannot send to an arbitrary address. This queues one encrypted message.
3. Wait for the real message in the supplied Gmail inbox, checking Spam as needed. Enter its reference and ten-character code in the owner Email screen within 30 minutes. The code is never returned by the send/status APIs.
4. Record the server confirmation time. The `delivered` outbox status means SMTP acceptance; only the entered inbox code sets `inboxConfirmed`.
5. Rehearse password reset using a synthetic account whose inbox the operator controls. Verify the real link is single-use, expires, resets the password and revokes prior sessions. Do not test with another person’s account.

The automated suite substitutes the delivery function and verifies authorization, encryption, fixed destination, wrong-code rejection and one-use proof. It does not contact Gmail. Gmail credentials are still missing, so actual delivery remains pending.

## Account deletion proposal, not activated policy

Proposed operational target: acknowledge verified requests and aim to complete active-account deletion within **7 days**, after resolving paid classes, credits, subscription cancellation/refunds and required provider processing. This is a proposed service target, not a published legal promise or automatic erasure timer.

Proposed review cadence: review retained shared/financial records every **30 days**. This is a review cadence, not permission to delete required accounting records after 30 days. The current retention-deadline setting controls an operator review date; it does not automatically purge financial records. Backup expiry must be taken from the actual configured backup service/plan and restore procedures; no number is assumed.

Japanese accounting retention depends on the operator’s business/tax status and record type; do not apply a blanket period measured from account deletion. Identify the operator, applicable duties and fiscal-record schedule before finalizing the retained-record policy. Keep only required fields, restrict access and record the reason and correct expiry per record class. Review actual provider contracts/transfers (Railway/PostgreSQL currently US region, Google mailbox, optional AI providers, Apple and payment providers) before publication.

Do not set `ACCOUNT_DELETION_POLICY_PUBLISHED=true` or enable real erasure until the operator identity, backup period, provider handling and retention schedule are confirmed and the actual policy is published. The owner’s preview/acknowledgement/password safeguards remain mandatory. Deleting an account does not cancel a store subscription.

## Sources checked

- Google SMTP and TLS: https://developers.google.com/workspace/gmail/imap/imap-smtp
- Google App Password conditions: https://support.google.com/mail/answer/185833
- Japan PPC guidance: https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/
- NTA individual-business record guidance (conditional on actual status): https://www.nta.go.jp/taxes/shiraberu/shinkoku/kojin_jigyo/0021012-127_01.pdf
