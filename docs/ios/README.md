# Continuum iOS implementation handoff

Prepared 18 November 2026 (Malaysia). Development branch: `codex/ios-integration`; draft PR: https://github.com/messi10ken2-commits/continuum-language/pull/117. Baseline production source: `3f18a51c335ee88daaadb867b9eb126f75554a27`.

**Status: an implemented native development project, not an App Store release candidate.** The project builds an unsigned simulator application. Shared-backend tests pass; the full native login/persistence/logout test has not yet passed. Production has not been changed by this PR. Use the readiness table below rather than treating Apple enrollment as the only remaining work.

## A. Delivered architecture and scope

The iPhone app packages the existing React/Vite application with Capacitor 8.6.2 and SwiftPM. It shares the server, account IDs, sessions, learning progress, class records and curriculum with the web application. Photo, Illustration and Light remain the shared implementations; all ten learning languages and existing display languages are retained. This avoids a separately maintained native curriculum.

`capacitor.config.json` packages `dist-native`; there is no remote WebView `server.url`, arbitrary cleartext access or wildcard CORS. The provisional bundle identifier is `com.continuum.language.dev`, custom scheme `continuum-dev`. Final identifiers and store product registration are not approved or provisioned.

The app targets **iPhone, iOS 17.4+**, in light appearance. Capacitor's SDK supports earlier iOS versions, but this application deliberately requires WebKit APIs available in 17.4. iPad support and an independently designed dark theme are not claimed.

Entry: `native-entry.mjs` initializes native services before React. `vite.config.mjs` produces the native bundle; `scripts/prepare-native-assets.mjs` copies required fonts/flags, checks native security invariants, and keeps large authored media on the HTTPS backend. Application JavaScript is bundled. Measured uncompressed web assets are approximately 11.22 MB across 49 native files, rather than packaging the roughly 172 MB web output. This is a package-size measurement, not a device latency or FPS result.

## B. Native behavior and security

- Keychain stores the session using `WhenUnlockedThisDeviceOnly`, scoped by API origin. The token is removed from login JSON before application code receives it and is never persisted in localStorage/UserDefaults. Capacitor bridge logging is disabled.
- API transport attaches bearer credentials only to the configured API, omits cookies and disallows credential-bearing redirects. Requests time out; writes are not automatically retried. Authentication expiry clears the secure session. Existing web cookie/CSRF behavior remains.
- Exact native-origin handling is implemented server-side. Native and web accounts use the same existing identity and sessions table. Native logout revokes its own session.
- Safe-area, keyboard, offline status, external link handling, sharing, haptics and opt-in local reminders are included. Privacy settings open inside the authenticated app.
- App inactivity pauses media, 3D work, CSS animation and study tracking. Microphone/audio-session preparation is explicit; interruption and route changes stop the active conversation. Detached sentence audio also stops on pagehide.
- Existing companion rigs retain their rendering limits, lazy loading, disposal and reduced-motion behavior. Real iPhone memory, heat, battery and smoothness measurements remain required.
- Optional provider-bound AI submissions require explicit, revocable per-account/device consent. Regular lessons remain available without that consent.
- Native promotional ads expose Close and Report immediately; the web's existing mandatory 15-second behavior remains separate.
- Class chat gains in-app reporting and bilateral blocking. Blocking prevents messages, not access to existing class/learning records. Race handling is covered by synthetic API tests.

Principal files: `native-policy.mjs`, `native-transport.mjs`, `native-runtime.mjs`, `native-ios.css`, `NativeAccountTools.jsx`, `NativeChatSafety.jsx`, `ios/App/App/AppDelegate.swift`, `ios/App/App/SceneDelegate.swift`.

## C. Account recovery, deletion and payments

Password recovery uses expiring, hashed, single-use tokens and revokes sessions on reset. Responses avoid account enumeration. Delivery is an adapter requiring an approved `AUTH_MAILER_WEBHOOK_URL` and token. Without configuration the feature cannot deliver recovery mail. No mail provider was activated.

Account deletion can be initiated in-app after password confirmation. The current implementation creates an idempotent Support request; **it does not erase personal data automatically**. An operator fulfilment process, retention decision, disclosed processing period and completion notification must be established and exercised before release. See [RELEASE_REQUIREMENTS.md](RELEASE_REQUIREMENTS.md). This is an operational and implementation gap, not an Apple-enrollment restriction.

StoreKit 2 code supports product lookup, native subscription management, restore and a deliberately gated local purchase path. Product identifiers are provisional `com.continuum.premium.monthly` and `.yearly`. Live purchasing remains disabled in release builds. Debug purchase additionally requires an explicit plist flag and verified Xcode StoreKit environment. No prices or introductory trial were configured or charged.

Restore sends transaction IDs to the existing **sandbox-only** backend verifier. The production verifier, App Store Server Notifications V2, renewal/refund/revocation handling and production entitlement reconciliation still require implementation and validation. A local StoreKit purchase does not grant Premium because the server does not trust a local transaction. This is an intentional security boundary, not a completed purchase test.

Digital Premium must use the approved in-app purchase implementation. Qualifying live individual teacher classes remain separate from digital entitlement purchases. The native membership presentation does not bundle class-ticket marketing into a digital plan. Final product eligibility, prices, trial terms, cancellation wording and review evidence need owner decisions.

APNs remote push is not implemented or provisioned. Opt-in on-device reminders are implemented. Universal Links are not provisioned; the custom development scheme is implemented with allowlisted destinations/reset tokens.

## D. Validation and limits

The CI workflow `.github/workflows/ios-integration.yml` builds with Xcode on macOS, launches a simulator, then runs XCTest against an isolated PGlite-backed HTTPS fixture. Synthetic test identities and a test-only root certificate are used; no production learner is modified. The fixture exercises the real server login, Keychain persistence across process restarts and logout.

Earlier unsigned simulator compilation succeeded. A later native test exposed a genuine startup failure: the scene used the default Capacitor controller, skipping custom native plugin registration. The scene now instantiates `ContinuumViewController`, and the structural check asserts that. Its next Mac run was cancelled before a runner was assigned; it did not validate the fix.

At the initial handoff-writing checkpoint, local web/native builds, native project checks and all **11 native tests** pass. The previous shared-backend CI passed **612 tests**. The current full suite includes an additional lifecycle test; results will be recorded in [TEST_RESULTS.md](TEST_RESULTS.md). Browser CI exposed readiness races after navigation for the asynchronous companion canvas and passport stamp; assertions now wait for visible content before counting it, without removing the count checks.

Do not infer acoustic voice quality, physical microphone routing, OS permission behavior, notifications, StoreKit purchases, device FPS, every localized native flow or App Review acceptance from Node tests or Playwright. See the explicit device matrix in [MAC_SETUP.md](MAC_SETUP.md).

## E. Privacy and store preparation

The app has microphone/camera usage descriptions, localized permission descriptions, an app privacy manifest, a branded icon and launch assets. The manifest includes account identity, user content, audio, product interaction and purchase history for functionality; tracking is disabled. These declarations must be reconciled with actual deployment/provider retention and Xcode's aggregate privacy report before submission.

Existing email/password login is retained. No third-party social login was added. Any future social provider changes require a fresh Sign in with Apple applicability review.

Policy/support endpoints: `/privacy`, `/terms`, `/help` on https://continuum-language-production.up.railway.app. Confirm these describe actual native behavior, deletion fulfilment, AI processors and retention. No App Store Connect privacy questionnaire, age-rating questionnaire, screenshots, review account, product metadata or submission was created.

## F. What Ken can do before paid enrollment

Follow [MAC_SETUP.md](MAC_SETUP.md) to run the simulator with Xcode, then use a Personal Team for a connected iPhone where supported. A simulator does not need paid enrollment. Use a staging backend running this branch for functional native authentication: production does not yet contain this PR's native session endpoints.

Without paid enrollment, development can still cover login/logout, lessons, class chat, safe areas, permissions, audio, 3D, offline/reconnect and local reminders. Final App Store/TestFlight distribution, registered identifiers, production StoreKit configuration and APNs provisioning remain separate enrollment-dependent work.

## G. Release, rollout and rollback

Keep PR #117 in draft until native authentication and required browser checks pass and the unresolved launch requirements are assessed. Merge/deployment is not implied by a successful unsigned build. Before deployment, take the normal database backup, review migrations and confirm mail/payment gates. No production secrets, real payment settings or learner records were changed during implementation.

New database tables support recovery, blocking and deletion requests; a source rollback does not erase these records. For rollback, redeploy baseline `3f18a51` or the last known-good web/backend deployment; retain the new tables until their data is reviewed. Native API clients must remain compatible with deployed backend authentication. Do not distribute a build pointing at a backend that lacks native session support.

No native archive was signed, no app was submitted, no real store purchase was attempted and no production deployment was performed. The exact remaining requirements are listed alongside their owner in [RELEASE_REQUIREMENTS.md](RELEASE_REQUIREMENTS.md).

### Official references

- Capacitor iOS setup: https://capacitorjs.com/docs/ios
- Apple review guidelines: https://developer.apple.com/app-store/review/guidelines/
- Account deletion: https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion
- Local StoreKit testing: https://developer.apple.com/documentation/Xcode/setting-up-storekit-testing-in-xcode
- Safari 17.4 APIs: https://webkit.org/blog/15063/webkit-features-in-safari-17-4/

Recheck submission rules and Xcode requirements at release time; this document does not constitute App Review approval.
