# Run Continuum on a Mac and iPhone

This development project uses Capacitor 8.6.2, SwiftPM and Xcode 26 or later on a compatible macOS version. The app requires iOS 17.4+. Use Node 24.22.1 (the repository's `.node-version`) and npm; CocoaPods is not required.

## Simulator

1. Install Xcode, open it, accept its license and install an iOS simulator runtime through Xcode Settings → Components. Select Xcode as the command-line tools installation in Settings → Locations.
2. Clone the repository and select `main` after the approved readiness changes are merged. Keep production and development checkouts separate.
3. In Terminal, at the repository root:

```sh
npm ci
npm run ios:sync
npm run ios:check
npm run ios:open
```

This opens `ios/App/App.xcodeproj`. Let Swift package dependencies finish resolving. Select the **App** scheme and an iPhone simulator, then Run. Simulator builds need no paid signing team, but keep normal local signing enabled: Keychain access failed in the unsigned CI build. CI now preserves a locally signed simulator build using the default production API origin. It is a simulator app, not an installable iPhone distribution archive. The isolated XCTest rebuild uses loopback HTTPS and synthetic credentials. If Xcode asks for a team, confirm an iPhone simulator is selected rather than “Any iOS Device”.

The default API is production, where native session support was deployed in PR #117 (99d6a22). Use an approved HTTPS staging backend for synthetic development and destructive/payment testing:

```sh
CONTINUUM_API_ORIGIN=https://YOUR-STAGING-HOST npm run ios:sync
npm run ios:open
```

Replace the host before executing. This is a build-time setting. Do not point a distributed app at a local fixture. Do not disable HTTPS or add blanket ATS exceptions. The CI workflow's loopback TLS certificate is for its isolated simulator only.

After changing React or native configuration, run `npm run ios:sync` again and rebuild. Editing web files alone does not update the bundled app. Do not edit generated `ios/App/App/public` assets by hand.

## Connected iPhone with a Personal Team

1. Add your Apple Account in Xcode Settings → Accounts. Connect the unlocked iPhone by cable, trust the Mac and enable Developer Mode on the phone if prompted.
2. In the App target's Signing & Capabilities, select automatic signing and your Personal Team. Use a unique development bundle identifier if Xcode reports a conflict; keep `capacitor.config.json`, Xcode build settings and local test bundle references consistent. Do not register the final store identifier without confirming it.
3. Select the connected iPhone and Run. Follow the phone's trust/developer-app prompts. Free provisioning may require periodic rebuilding and has capability limits; it is not App Store/TestFlight distribution.
4. Use a synthetic staging account. Do not perform real purchases, send real class messages or test deletion against a learner's production account.

Apple Developer enrollment can remain pending while simulator development continues. A Japanese passport/Malaysia account verification dispute must be resolved with Apple; changing account regions is not a development prerequisite proposed here.

## Required physical-device checks

Record device model, OS, build commit, backend and pass/fail evidence. Include at least one smaller supported iPhone and a current Dynamic Island device when available.

| Area | Check |
| --- | --- |
| Startup/account | Cold launch, registration, login, relaunch, expiry, logout and recovery |
| Shared memory | Complete a staging lesson on web, refresh native; then reverse direction |
| Layout | Photo/Illustration/Light, keyboard, safe areas, landscape, large text and VoiceOver |
| Languages | Ten learning languages; UI locales including Japanese, Chinese and RTL Arabic |
| Lessons | Normal/exclusive/Light content, videos, downloads, completion and progress persistence |
| Audio | Permission allow/deny, repeated playback, full sentences, silent switch, Bluetooth and wired routes |
| Interruptions | Lock/unlock, background/foreground, phone-call interruption and audio route change |
| AI | Consent denied/revoked/accepted, microphone denied, timeout and reconnect without duplicate writes |
| Companions | All eight rigs, repeated entry/exit, reduced motion, memory/heat and background pause |
| Classes | Existing bookings, own sender/timestamp, report/block/unblock and external call links |
| Connectivity | Offline launch after installation, network loss mid-request, reconnect and user-visible errors |
| OS features | Share sheet, notification allow/deny, reminder delivery/cancel and notification navigation |
| Account privacy | Settings inside app, deletion request and operator completion confirmation |
| Billing | Restore failure, pending/cancelled states and approved isolated StoreKit scenarios |

The simulator smoke test does not complete this matrix. Do not mark permission, acoustic, thermal or store behavior verified without an actual run.

## Useful commands

```sh
npm run build
npm run build:native
npm run ios:check
npm run test:native
npm run test:qa
xcodebuild -project ios/App/App.xcodeproj -scheme App -sdk iphonesimulator -configuration Debug -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=YES CODE_SIGN_IDENTITY=- build
```

The native XCTest requires the isolated HTTPS backend/certificate and synthetic account established by `.github/workflows/ios-integration.yml`; running it against the production API is not supported. Follow that workflow for reproducible fixture setup rather than creating a real learner account with its hard-coded test identity.

## Local StoreKit interaction lab

After `npm run ios:sync`, run `node docs/ios/prepare-local-storekit.mjs` and open the returned project path with scheme **App-Local-StoreKit**, Debug configuration. The script creates a temporary project copy; do not archive or distribute it. Use the isolated fixture backend for the scripted test, or an explicitly approved staging backend and synthetic learner for manual interaction.

The native bridge enables **Account → App settings → Local StoreKit test** only in DEBUG when both the copied plist flag and a verified Xcode AppTransaction allow it. A normal shipping project never displays this panel. Load products and use the local monthly/yearly buttons. Fixture prices are not approved commercial prices. Successful, cancelled, pending, restored and empty-restore states are shown without changing server membership or finishing a transaction before server verification. This lab does not implement a production paywall.

The disposable test target bundles `LocalStoreKitUITests.swift` plus the StoreKit configuration and uses Apple's StoreKitTest session. Run its `LocalStoreKitUITests/testPurchaseCancelPendingAndRestoreScreens` test to drive the actual app's native bridge and UI. It clears fixture transactions, loads both products, tests empty restore, purchase, restore, Ask to Buy pending and native cancellation response UI using Apple's SKTestSession simulated userCancelled failure. This does not establish a physical or headless system-sheet Cancel tap. The iOS integration workflow's **local-storekit** job runs this against the isolated HTTPS backend, exports result screenshots and checks the server remains free. Never use fixture credentials or this loopback backend for review/distribution.

This local pending scenario uses Ask to Buy as a test mechanism; it does not change Continuum's adult-only audience policy. An Xcode transaction is not real App Store Sandbox verification, a paid subscription, or authorization to grant production Premium.

Command-line StoreKitTest on iOS 26.5 is affected by Apple's reported FB22237318 configuration issue. The local StoreKit CI job selects installed iOS 26.2; the ordinary native lifecycle job continues on the newest runtime. If the exact runtime is unavailable, install it or use the Xcode IDE and record that separately. Never weaken the verified `.xcode` environment guard to bypass a runner problem. Test coverage and actual outcomes are recorded separately in TEST_RESULTS.md.

For the authentication-fixed app on a personal iPhone, follow [the Japanese signing/install checklist](IPHONE_AUTH_INSTALL_JA.md). The arm64 unsigned Release archive verifies compilation and shipping gates; it cannot be installed without owner-side signing.
