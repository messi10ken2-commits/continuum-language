# iOS validation evidence

Updated 20 November 2026 (Japan). This document distinguishes tested source from deployed code and from an installed iPhone release. The latest validation below covers PR #122; deployment is not established by successful CI.

## Current application evidence

Application source `568e38f1e03bf68e90ae0849ef6a18e70f352985`:

- [Native and shared-backend run 44691976266](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44691976266): actual iOS 26.5 simulator login, Keychain restoration across process restart and logout passed (88.923 seconds); actual four-screen capture passed (58.516 seconds). Two tests, zero failures.
- The native test uses the isolated HTTPS fixture and actual WebKit network requests. It received POST /api/auth/login 200. This verifies the custom-scheme write fix that ordinary HTTPS browser pages alone did not reproduce.
- Shared regression: 634 tests, 632 passed, zero failures, two reported skips before native synchronization. After ios:sync, all 18 native tests passed with no skips.
- Chromium and WebKit passed typed link continuation through login, class navigation and inaccessible-booking rejection. Both also passed real HTTPS JSON/FormData delivery, scoped bearer continuity, token stripping and redirect rejection.
- [Full application run 44691982452](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44691982452) passed regression, companion/immersion, synthetic erasure in Chromium and WebKit, Light motion/accessibility, audio recovery, six-language layouts, language audit, production dependency audit, Docker build and unprivileged runtime checks.

Native transport constructs ordinary string/URL API requests directly at the approved HTTPS origin before encoding their body. Caller-supplied Request objects retain the one-time encoded-body retargeting fallback. The regression test reproduces a custom-scheme blob abort and checks Unicode JSON, multipart bytes, abort propagation and credential-bearing URL rejection. API scoping, credentials:omit and redirect:error remain enforced.

## Deletion and restore rehearsal

The synthetic erasure test exports an actual PGlite data directory before deletion, restores it into a separate database, observes the original user and sessions return, creates a fresh preview and reapplies erasure. Original user, sessions and learner profile are removed; the unrelated user remains. The encrypted completion notice is drained through a local test adapter.

This covers a snapshot that contains the deletion-request row. An older snapshot without that row needs an independent encrypted deletion journal and a separately implemented/rehearsed reconstruction path. Neither actual Railway snapshot restoration nor provider erasure nor Gmail inbox receipt is established by this test. See [the operations runbook](ACCOUNT_DELETION_RUNBOOK_JA.md).

## Local StoreKit: partial verification, not complete

The disposable DEBUG lab requires its copied Info.plist opt-in and a verified AppTransaction environment of .xcode. It does not submit purchases to the backend, finish transactions before verification or grant Premium. Shipping opt-in and live billing remain disabled.

The newest iOS 26.5 command-line test environment failed StoreKitTest configuration overrides with SKInternalErrorDomain Code 3. Apple DTS identifies the corresponding command-line StoreKit configuration problem as FB22237318 in [Apple's forum](https://developer.apple.com/forums/thread/826971).

[Compatibility run 44694401549](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44694401549), using installed iOS 26.2 with Xcode 26.6, activated the guarded lab and passed product loading (two fixtures) and an empty restore. It failed while awaiting purchase success. Recording inspection showed a purchase control underneath the native status bar. A bounded safe tap/scroll correction is being checked in [run 44699062305](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44699062305).

Purchase success, purchase-sheet cancellation, pending and restore-after-purchase must not be marked complete until that actual interaction test passes. The server-free isolation assertion runs only after successful UI interaction and has not yet passed that full sequence. Synthetic JWS/notification unit tests do not substitute for StoreKit interaction.

## Service and release limits

- No real email, account erasure, charge, Apple Sandbox transaction, TestFlight or App Store submission occurred.
- Ken confirmed individual operation under the public name Ken Ishizawa, acknowledgement within two business days and normal deletion within seven calendar days. Backup direction is daily/weekly/monthly with approximately 90-day maximum; actual schedules, expiry and external copies still require evidence.
- Tax/record classification is explicitly unresolved; no financial retention period is inferred.
- Real erasure, live Apple billing and mail maintenance remain gated. Secure Google authorization, actual inbox verification, independent deletion-journal storage, physical iPhone testing and distribution signing remain outstanding.
- Native source/backend deployment does not automatically update an installed iPhone binary.
