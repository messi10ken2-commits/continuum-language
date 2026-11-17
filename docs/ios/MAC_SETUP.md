# Run Continuum on a Mac and iPhone

This development project uses Capacitor 8.6.2, SwiftPM and Xcode 26 or later on a compatible macOS version. The app requires iOS 17.4+. Use Node 24.22.1 (the repository's `.node-version`) and npm; CocoaPods is not required.

## Simulator

1. Install Xcode, open it, accept its license and install an iOS simulator runtime through Xcode Settings → Components. Select Xcode as the command-line tools installation in Settings → Locations.
2. Clone the repository and select `codex/ios-integration`. Keep production and development checkouts separate.
3. In Terminal, at the repository root:

```sh
npm ci
npm run ios:sync
npm run ios:check
npm run ios:open
```

This opens `ios/App/App.xcodeproj`. Let Swift package dependencies finish resolving. Select the **App** scheme and an iPhone simulator, then Run. Simulator builds need no signing team. If Xcode asks for a team, confirm an iPhone simulator is selected rather than “Any iOS Device”.

The default API is production. Native account functionality requires this branch's backend changes, which have not been deployed to production. For functional development, use an approved HTTPS staging backend running this branch:

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
xcodebuild -project ios/App/App.xcodeproj -scheme App -sdk iphonesimulator -configuration Debug -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build
```

The native XCTest requires the isolated HTTPS backend/certificate and synthetic account established by `.github/workflows/ios-integration.yml`; running it against the production API is not supported. Follow that workflow for reproducible fixture setup rather than creating a real learner account with its hard-coded test identity.
