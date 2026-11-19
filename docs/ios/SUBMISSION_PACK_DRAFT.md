# App Store submission pack — draft, not submitted

19 November 2026. Contact: continuum.language@gmail.com. Operating country supplied by Ken: Japan. Legal operator name/type/address and tax status are unconfirmed. App Store seller identity must match the actual approved enrollment; a country label here cannot change Apple eligibility.

## Metadata

Use STORE_LISTING_DRAFT.md for the English/Japanese name, subtitle, description and keywords. Public endpoints on the current service:

- Support: https://continuum-language-production.up.railway.app/help
- Privacy: https://continuum-language-production.up.railway.app/privacy
- Terms: https://continuum-language-production.up.railway.app/terms

Verify these pages against the final release configuration. Describe only features enabled in the submitted build. Do not advertise remote push, verified Universal Links or native purchases until their actual activation/device checks pass.

## Screenshot production

The iOS integration workflow launches the real bundled app against an ephemeral HTTPS backend. A separate synthetic learner, Alex, is used to capture Overview, Learn, Practice and Classes. No real user records are used; demo credentials exist only in the disposable fixture and are not a permanent review login. The simulator status bar uses 9:41 and a full battery. Screens are XCTest PNG attachments named Store-EN-01 through Store-EN-04, exported on successful runs as well as failures.

Before upload, inspect every actual image for clipping, stale loading/errors, privacy leakage, keyboard/permission overlays, legibility and consistency with shipping behavior. Confirm supported iPhone dimensions and PNG color/alpha constraints against current App Store Connect specifications. Preserve original dimensions; do not stretch, fabricate UI or imply progress/outcomes not actually represented. These captures are English; Japanese store screenshots still require a localized capture pass. Do not label the run completed until it succeeds and the images are visually reviewed.

## Privacy declaration worksheet

This is a schema/behavior map for review, not a submitted Apple questionnaire. Reconcile optional services, actual release flags, provider agreements and Xcode’s aggregated privacy report before selecting final answers.

| Apple data category candidate | Actual data/use to assess | Linked/purpose considerations |
| --- | --- | --- |
| Contact Info: Name, Email Address | Account/profile, teacher identity, support and transactional mail | Account-linked; app functionality/customer support |
| Identifiers: User ID | Internal account, teacher relationships, submissions, billing ownership | Account-linked; app functionality/security |
| Identifiers: Device ID | Optional APNs token/installation reference, encrypted/hashed server registration | Account/session-linked when enabled; notification functionality; no advertising identifier |
| User Content: Emails or Text Messages | Private class/support conversations; email requests | Account-linked; participant/support functionality; email service processes mailbox content |
| User Content: Audio Data | Saved speaking skill recordings; optional pronunciation/AI speech input | Account-linked where saved; functionality; distinguish transient pronunciation from stored submissions |
| User Content: Other User Content | Written exercises, teacher notes, assignments/profile content | Account-linked; learning/class functionality |
| Usage Data: Product Interaction | Lesson attempts/progress, learning time, assessment and review activity | Account-linked; app functionality/personalization; do not call all first-party activity tracking |
| Purchases: Purchase History | Membership/transaction receipts, class tickets, store ownership | Account-linked; access/billing; no raw card details in app database |
| Diagnostics | Review actual production logs/error tooling and retention | No new third-party crash SDK added; absence of one does not establish zero diagnostic collection |
| Other Data | Derived assessment/skill estimates and learning patterns | Review the closest questionnaire categories; account-linked, optional AI processing as applicable |

No IDFA/ATT advertising SDK or cross-company audience tracker was added in this phase. Existing first-party promotional media does not by itself establish Apple “tracking”; assess actual sharing/use against Apple’s definition. Do not select “Data Not Collected” for the whole app. Platform age restriction is 18+; answer Apple’s content/age questionnaire from actual AI/chat/user-generated-content behavior rather than equating the platform rule with Apple’s rating.

Privacy draft additions for final operator review: Google mailbox/SMTP purpose, encrypted APNs token and session retention, generic notification contents/preferences, currently US-region hosting, optional AI processors, active-account deletion handling and a record-class retention schedule. Do not claim that all providers offer zero retention or that deletion cancels a store subscription. MAIL_JAPAN_OPERATIONS_DRAFT.md distinguishes proposed timing from approved policy.

## Reviewer access and notes

A stable reviewer backend/account has not been approved/provisioned. The loopback synthetic fixture cannot be used by Apple reviewers. Provision a dedicated adult demo learner on the approved deployed backend, with only synthetic learning/class/assignment data, and a separately restricted teacher demo if needed. Keep a secret random password in the App Store Connect review field or approved secret channel; never commit it. Rehearse a clean install and login from an external device. Keep access available throughout review, disable destructive/admin privileges and rotate credentials after review.

Draft notes to adapt to the enabled release:

“Continuum is for adult language learners and teachers. Use the supplied synthetic demo learner to review Overview, Learn, Practice and Classes. The Account screen contains privacy controls, reporting/help and account deletion status. Optional AI submission asks consent before transmitting content; microphone access follows the user’s speaking action. Class records are language/participant restricted. Report/block is available in class conversations. Confirmed teacher classes and self-study share a learning record. [Insert exact paths and enabled subscription products/restore behavior after real Sandbox testing.] [Explain any feature unavailable to the review account with a concrete reason; do not describe dormant preparation as available.]”

Do not submit with the bracketed release-dependent fields unresolved. Native purchases remain disabled until actual products and real Sandbox lifecycle tests pass. A simulated local StoreKit purchase is not server entitlement proof.

## Price, trial and renewal disclosure template

Before presenting purchase confirmation, display actual StoreKit localized product title, price/currency, billing duration, included access, trial eligibility/duration (only if Apple returns an eligible approved offer), the first charge and renewal behavior, cancellation path, Terms/Privacy links and Restore Purchases. Never hardcode the fixture prices 0.99/9.99 as commercial prices. Do not promise a three-day trial or auto-charge unless the final Apple offer is actually registered and eligible.

EN template: “{localized price} per {billing period}. [If eligible: {approved trial duration} free, then {localized price} per {billing period}.] Renews automatically unless cancelled under the App Store terms shown at purchase. Manage or cancel in Apple Settings → your name → Subscriptions. Deleting your Continuum account does not cancel your subscription.”

JA template: “{請求期間}ごとに{現地通貨の価格}。[対象の場合のみ：{承認済み無料期間}は無料、その後は{請求期間}ごとに{現地通貨の価格}。] 購入時に表示されるApp Storeの条件に従って自動更新されます。解約・管理はAppleの「設定」→ご自身の名前→「サブスクリプション」から行えます。Continuumの退会だけではサブスクリプションは解約されません。”

Final country availability, tax/merchant duties, approved prices, real products, seller identity, legal disclosures and release consent remain explicit release requirements. This pack does not register products, publish a policy or submit an app.

## Official references

- https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/
- https://developer.apple.com/help/app-store-connect/reference/app-information/app-privacy/
