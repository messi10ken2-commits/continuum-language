# Continuum iOS handoff

Updated 19 November 2026. Foundation PR #117 and readiness PR #118 are merged; production baseline is 5444e0c. The owner supplied Japan as the operating country and continuum.language@gmail.com as the contact/test inbox. Legal operator details remain unconfirmed. This is a development app, not an App Store release candidate.

## Architecture

The app bundles React/Vite in Capacitor 8.6.2 with SwiftPM and shares the production Node/PostgreSQL backend, accounts, learning records, classes and all three presentation modes. All ten learning languages retain the shared curriculum. Application JavaScript is bundled, not loaded from an arbitrary remote WebView URL. The target is iPhone, iOS 17.4+, light appearance. iPad/dark-mode support is not claimed. Bundle identifier com.continuum.language.dev, custom scheme continuum-dev and subscription IDs are provisional.

Native sessions are scoped by API origin and stored in Keychain with WhenUnlockedThisDeviceOnly. Tokens are not persisted in localStorage/UserDefaults. Bearer transport attaches credentials only to the approved HTTPS API and refuses redirects; writes are never automatically retried. Exact-origin CORS and existing web cookie/CSRF handling coexist. Logout revokes the native session. Backgrounding pauses media, 3D work, animations and study tracking. Safe areas, keyboard, offline status, external links, sharing, haptics, local reminders, optional AI consent and class report/block are implemented. Native ads expose Close/Report. Physical performance, acoustic quality and OS permission behavior need device validation.

## Readiness additions

Recovery mail now has TLS SMTP/authenticated HTTPS transport, encrypted transactional outbox, retry/expiry and redaction. Account deletion has a guarded, password-confirmed owner fulfilment process that removes the original account/private content, cancels future pending classes and queues completion mail. Approved minimal shared-class/financial structure may remain under a new non-login record. Policy periods, provider-held records, backup procedures and user notice require actual operator decisions. Retention expiry is a manual review, not automatic purge.

Apple verification now uses Apple's official server library and pinned root. Signed transaction/renewal ownership, grace, refund/revocation, idempotent notifications and reconciliation are implemented with synthetic cryptographic tests. Real Apple credentials/end-to-end validation remain pending. Live native purchasing stays disabled. No real charge, mail delivery or account erasure was performed.

Read [OPERATIONS.md](OPERATIONS.md) before configuration. Run node docs/ios/check-deployment-readiness.mjs for a read-only report. Default-off gates prevent deployment from activating mail, erasure or live verification.

## Mac and StoreKit development

Follow [MAC_SETUP.md](MAC_SETUP.md). Production already supports native sessions; destructive/payment tests belong to isolated staging or the synthetic fixture. Simulator CI uses synthetic accounts, temporary TLS certificates and local signing. Paid distribution identity is not configured. Actual simulator login, process restart with Keychain restoration, logout and a second restart passed at e9fa4ac7. A locally signed simulator build and screenshots are available in [the successful Mac run](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44251194134). See [TEST_RESULTS.md](TEST_RESULTS.md) for evidence and the remaining device limits.

After npm run ios:sync, run node docs/ios/prepare-local-storekit.mjs. Open the printed disposable project on a Mac and choose App-Local-StoreKit. Only the copy enables the local debug flag, adds the StoreKit fixture and omits the local test scheme's Archive action. Shipping settings remain unchanged. Prices 0.99/9.99 are test placeholders, with no family sharing or introductory offer. Exercise product lookup, purchase/cancel/pending/restore in Xcode. Local transactions cannot grant server Premium. Fixture generation is tested; actual StoreKit interaction is not yet verified.

Remote APNs registration/delivery and strict Universal Links routing/AASA are implemented behind default-off gates. Actual Apple identifiers, signing/provisioning and real-device validation remain pending. See PUSH_AND_LINKS.md and SUBMISSION_PACK_DRAFT.md. Existing on-device reminders and the development custom scheme require physical-device checks. See [RELEASE_REQUIREMENTS.md](RELEASE_REQUIREMENTS.md).

## Distribution and policy

Microphone/camera descriptions, localized permission copy, privacy manifest, AI consent and brand assets are present. Reconcile actual SDK/provider collection, retention and aggregate Xcode privacy reports with published policy and store answers. Do not activate dormant services until published descriptions match operations. No App Store Connect products, final prices, trial terms, questionnaires, review account or screenshots are approved. No distribution archive, TestFlight upload or App Store submission was made.

Keep the follow-up unmerged until required tests pass. Observe Railway deployment health. Rollback application code without dropping additive tables or losing the mail encryption key. See OPERATIONS.md for irreversible-operation safeguards and manual dependencies.

Official references: [Capacitor](https://capacitorjs.com/docs/ios), [Apple account deletion](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion), [StoreKit testing](https://developer.apple.com/documentation/Xcode/setting-up-storekit-testing-in-xcode), [Apple server library](https://github.com/apple/app-store-server-library-node).
