# iOS validation evidence

Prepared 18 November 2026, Malaysia. Baseline: `3f18a51`. Native integration PR: #117.

## Verified locally during finalization

- `npm run build`: pass, web production bundle.
- `npm run ios:sync`: pass, bundled native web build and Capacitor/SwiftPM synchronization.
- `npm run ios:check`: pass, configuration/HTTPS/Keychain/plugin registration and actual scene controller checks.
- `npm run test:native`: **11 tests passed, zero failed**. Includes transport scoping, Keychain origin arguments, consent, expiry/no write retries, native lifecycle semantics, localization and synthetic native account/safety APIs. The glob also includes pre-existing native recording-quality checks.
- `npm audit --omit=dev`: **zero reported production dependency vulnerabilities**, after moving Vite and its React build plugin into devDependencies. They are build/test tools; the production Node server serves built assets and does not import them. Docker builds before pruning devDependencies.

The full development dependency audit still reports the Picomatch ReDoS advisory `GHSA-fc5q-39xc-vjpf` through build tooling. At verification the upstream advisory listed no patched version, and the registry's newest Picomatch was 4.0.7. No major-version downgrade or suppression was applied. Keep development servers local and do not accept untrusted glob input. Recheck upstream before release. Reference: https://github.com/advisories/GHSA-fc5q-39xc-vjpf.

## Remote evidence and explicit limits

- Previous shared-backend CI at `035420a8`: **612 tests passed**. This is not the result of a later commit.
- Unsigned Xcode simulator builds have succeeded. A startup test on `7656df7c` failed; scene/plugin registration was corrected in `035420a8`.
- Mac job for `035420a8` was cancelled before a runner was assigned, with no test steps. It supplies no evidence that the startup fix worked.
- Code-validation head `8df12e802cbf8f3e5cb3a545ebb9adcdeeb19ede` includes backend-scoped Keychain, background media/3D pause and asynchronous passport readiness. Its CI is tracked here: https://github.com/messi10ken2-commits/continuum-language/actions?query=branch%3Acodex%2Fios-integration.
- Physical iPhone, real microphone/route behavior, reminders, StoreKit purchases, App Store review and real-device performance are **not verified**. No real payment, production data mutation or signed distribution was performed.

CI outcomes are recorded below only after completion. A green structural/build test alone is not a passing native authentication test.

The final workflow also selects the newest installed iOS simulator runtime and bounds its startup to eight minutes. The complete CI rerun for this source is pending at the time this file is committed; consult PR checks and the final PR validation note for its outcome.
