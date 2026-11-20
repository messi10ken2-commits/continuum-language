# iOS validation evidence

Updated 20 November 2026 (Japan). Successful CI, backend deployment and an installed iPhone build are separate milestones.

## Authentication and app screens

The HTTPS custom-scheme request fix is merged in PR #122 (production baseline 8671c58).
[Run 44702913008](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44702913008) passed actual iOS 26.5 simulator login, process restart with Keychain restoration, logout and another restart (125.455 seconds), plus all four native screen captures (77.564 seconds): two tests, zero failures. The screen test waits for completed sign-in before navigation.

Shared regression: 634 tests, 632 passed, zero failures, two skips before native synchronization; all 18 native tests passed after synchronization. Chromium and WebKit passed real HTTPS JSON/FormData delivery, scoped bearer continuity, redirect rejection and typed app-link continuation.
[Full application run 44691982452](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44691982452) passed broader regression, browser, dependency, language, Docker and unprivileged runtime checks.

Native transport encodes ordinary string/URL API requests at the approved HTTPS origin. Caller-supplied Request objects retain the encoded-body retargeting fallback. Credentials are scoped, redirects rejected, abort propagated and writes never automatically retried.

## Local StoreKit app responses: passed

[Run 44710866561](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44710866561) used matching Xcode 26.2 and iOS 26.2, an isolated HTTPS backend with a trusted temporary certificate and synthetic credentials. The simulator's strict HTTPS health probe passed. The actual native UI test passed in 146.386 seconds with zero failures and saved seven screenshots:

1. Two fixture products loaded.
2. Empty restore.
3. Successful local purchase, with a real local StoreKit transaction.
4. Restore found that purchase.
5. Ask to Buy pending.
6. Cancellation response and its app notice.
7. Restore remained empty after cancellation.

Cancellation is injected into the native purchase API using Apple's `SKTestSession.setSimulatedError(.generic(.userCancelled), forAPI: .purchase)`. It verifies the app's response to StoreKit cancellation, not a person tapping Cancel in the Apple confirmation sheet. That manual interaction remains a device check.

The subsequent authenticated server assertion passed: **actual local StoreKit purchases did not grant server Premium**. The lab requires DEBUG, its copied plist opt-in and a verified AppTransaction environment of .xcode. It does not submit purchases to the backend or finish unverified transactions. Live billing remains disabled.

Only the local StoreKit CI lane pins Xcode/runtime 26.2. The ordinary native lane remains on the current runner. Apple's command-line configuration issue FB22237318 affects newer StoreKit CLI environments; no TLS or StoreKit environment guard was weakened.

## iPhone build and installation

[Run 44700974415](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44700974415) successfully archived an unsigned arm64 iPhone Release build using the production API origin. The archive has no local StoreKit configuration or enabled lab flag. Later StoreKit bridge changes are DEBUG-only.

This is not a signed/installable IPA, TestFlight upload or physical iPhone test. Follow [the iPhone installation guide](IPHONE_AUTH_INSTALL_JA.md) to sign and run the normal App scheme from the owner's Mac, then repeat login/relaunch/logout on the phone. Updating Railway does not replace an installed native binary.

## Deletion and restore rehearsal

Synthetic erasure exports a PGlite snapshot, restores it into a separate database and reapplies deletion while preserving an unrelated user. This does not prove actual Railway backup restoration, provider erasure or Gmail inbox delivery. An older snapshot without a deletion-request row still needs an independent encrypted deletion journal and rehearsed reconstruction. See [the operations runbook](ACCOUNT_DELETION_RUNBOOK_JA.md).

## Remaining release limits

No real charge, Apple Sandbox transaction, email delivery, account erasure, TestFlight or App Store submission occurred. Physical iPhone layout, permission, audio, thermal and billing-sheet checks remain owner-side. Live billing, mail maintenance and real erasure remain gated.

Ken confirmed individual operation under Ken Ishizawa, acknowledgement within two business days and normal deletion within seven calendar days. Daily/weekly/monthly backups with approximately 90-day maximum are an agreed direction; actual schedules/expiry and external copies still need evidence. Tax/record classification remains unresolved.
