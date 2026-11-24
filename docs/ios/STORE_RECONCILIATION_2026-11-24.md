# Store submission reconciliation — 24 November 2026

Prepared for entry after Apple enrollment; not a submission or an assertion of physical-device QA.

## Release description

Use the EN/JA descriptions in STORE_LISTING_DRAFT.md. They describe ten study languages,
self-study, optional AI feedback, teachers/classes and shared learning records. Do not
advertise enabled APNs, verified Universal Links or live native purchases while their
release gates remain off. Local StoreKit fixtures are never commercial prices.

Support, privacy and terms were fetched over production HTTPS on this date: all 200,
all three contain the operator contact. Legal pages are public without login or JavaScript.
Operator supplied by Ken: Ken Ishizawa, Japan; contact continuum.language@gmail.com.
Seller identity, address/tax fields must match actual Apple enrollment and are not invented.

## Privacy entries mapped to implementation

All account content below is linked to an account; purpose is App Functionality, including
personalization/security/support within that purpose. Tracking is No for the current
first-party implementation; this does not imply third-party media processes no data.

| App Store category | Actual data / source |
|---|---|
| Contact Info — Name, Email Address | users/profile/support/account mail |
| Identifiers — User ID | account, class relationships, billing ownership; encrypted erasure journal |
| User Content — Emails or Text Messages | class_messages, support_messages, transactional mail |
| User Content — Customer Support | support tickets and responses |
| User Content — Photos or Videos | teacher/profile photos supplied for profiles |
| User Content — Audio Data | speaking skill submissions and requested speech processing |
| User Content — Other User Content | assignments, notes, answers, AI conversations/feedback |
| Usage Data — Product Interaction | lesson attempts, study time, levels and review activity |
| Purchases — Purchase History | membership/receipt/ticket state; no raw payment-card details |
| Diagnostics — Other Diagnostic Data (provider review) | hosting request timestamps, IP/browser details and errors; reconcile Railway logs/provider use for final form |

PrivacyInfo.xcprivacy is reconciled with messages, support and profile-media categories.
Device ID/APNs categories require another check when remote push is actually activated.
No IDFA or third-party advertising SDK has been enabled by this work. Optional external
players and AI processors must retain their existing consent/disclosures. Final App Store
questionnaire answers require the selected release flags and provider configuration;
the aggregated Xcode privacy report must be checked with the final signed archive.

## Reviewer login and notes

Stable basic synthetic adult learner created on the production HTTPS backend. A fresh
native-style login succeeded, /auth/me returned learner and /owner/mail rejected it with
403. Provisioning/login sessions were logged out. Credentials are only in Railway Web
service APP_REVIEW_EMAIL and APP_REVIEW_PASSWORD; copy to App Store Connect Review Info.
This account has no admin role or server Premium and contains no real learner records.

Suggested reviewer notes for the current build:

“Continuum provides self-study and teacher-connected learning for adults. Sign in with
the supplied demo learner. Overview, Learn and Practice are available through the bottom
navigation. Classes shows this synthetic learner's class area. Optional AI submission
requests consent before transmitting content; speaking actions request microphone access.
Account contains privacy controls, support and account deletion. Native subscription
purchases and remote push are not activated in this preparation build. No purchase is
required to review the available free features.”

Do not claim populated classes, a Premium purchase flow, teacher demo access or physical
device login until separately verified. If activating paid features before submission,
replace these notes, supply eligible review access and run real Apple Sandbox validation.

## Prices and renewal

Commercial iOS products are not registered through this work. The shipping gate stays
off, with no fixture amount or three-day trial promoted as a live offer. When Apple
products exist, display StoreKit's localized title, price, period and eligible offer.
The EN/JA renewal/cancellation templates in SUBMISSION_PACK_DRAFT.md are retained.
Deleting an account does not cancel a store subscription. Terms and Privacy links and
Restore Purchases must accompany the activated purchase UI.

## Screenshot evidence

Four actual EN native screen captures passed in run 44702913008 (see TEST_RESULTS.md).
The earlier exported EN screenshot ZIP is already supplied to Ken. A JA screenshot set
is optional for an EN-only store localization and has not been newly captured here.
Final device sizes, signed build, seller fields, price registration and submission are
Apple-dependent steps; no screen was fabricated to show an inactive feature.

References checked:
- https://developer.apple.com/app-store/app-privacy-details/
- https://developer.apple.com/documentation/bundleresources/app-privacy-configuration/nsprivacycollecteddatatypes/nsprivacycollecteddatatype
- https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/
