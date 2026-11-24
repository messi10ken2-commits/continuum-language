# Native release requirements

Updated 24 November 2026. Implemented code does not establish activated service or device verification.

| Area | Implemented | Remaining |
| --- | --- | --- |
| Native app | Simulator authentication/restart/logout and four-screen capture passed again; unsigned arm64 iPhone Release archive compiled | Owner-side signing/install, physical iPhone matrix and distribution signing |
| Backend | Native sessions and HTTPS write fix deployed through PR #122; rollout evidence in PR #123 for its follow-up | Keep production health and activation gates verified |
| Recovery | TLS SMTP/webhook and encrypted outbox | Gmail HTTPS API transport selected; supplied sender/test inbox recorded. Google authorization, worker activation, actual inbox-code confirmation and password reset/reuse checks reported complete by Ken |
| Account deletion | In-app request, guarded owner fulfilment, synthetic relational erasure tests | Ken reports end-to-end deletion complete; independent encrypted journal/recovery safeguards added in operations closeout; external provider record handling still follows operator policy |
| Apple billing | Official signed verification, ownership, notifications, restore and reconciliation | Real credentials/products, Sandbox end-to-end tests, approved prices/terms, separately reviewed live purchase UI |
| Local StoreKit | Actual product/purchase/pending/restore and native cancellation-response UI passed; server membership remained free | Manual Apple confirmation-sheet cancellation and physical iPhone checks |
| Local reminders | Opt-in plugin and UI | Device permission, delivery and timezone checks |
| Remote push | Encrypted session-bound registration, APNs worker, category controls, class events/reminders, typed tap routing | Actual Apple identifiers/key/profile, physical-device delivery/permission matrix and activation |
| Universal Links | Strict HTTPS routing, default-off AASA and disposable capability-preparation script | Actual full App Identifier, matching signed Associated Domains and installed/uninstalled device validation |
| Privacy/safety | Manifest, permission localization, consent, report/block | Policy/provider reconciliation, moderation operations and store declarations |
| Store listing | EN/JA copy, Japan operations/privacy/review drafts, actual-native screenshot capture workflow | Four EN native captures passed; stable basic review login provisioned and tested. See STORE_RECONCILIATION_2026-11-24.md for reconciled fields and Apple-dependent final inputs |
| Distribution | Development project | Enrollment resolution, signing, archive, TestFlight, review and release |
| Performance | Bounded/lazy 3D and background pause | Physical memory/FPS/heat/battery, microphone and route tests |

See OPERATIONS.md. Retention review deadlines are not evidence of external/backup purge. Ken reports real mail arrival, reset/reuse checks and account deletion complete. No live Apple charge was performed. A simulator build is not an App Store archive.
