# Native release requirements

Updated 18 November 2026. Implemented code does not establish activated service or device verification.

| Area | Implemented | Remaining |
| --- | --- | --- |
| Native app | Bundled project, Keychain, lifecycle, safe areas, consent | Passing native login/restart/logout evidence and physical iPhone matrix |
| Backend | Native sessions deployed in PR #117 | Follow-up deployment after green checks |
| Recovery | TLS SMTP/webhook and encrypted outbox | Approved provider, sender/domain configuration, secrets and real delivery test |
| Account deletion | In-app request, guarded owner fulfilment, synthetic relational erasure tests | Published timing/retention policy; provider/backup evidence; operator rehearsal; explicit activation |
| Apple billing | Official signed verification, ownership, notifications, restore and reconciliation | Real credentials/products, Sandbox end-to-end tests, approved prices/terms, separately reviewed live purchase UI |
| Local StoreKit | Disposable test configuration and generation check | Xcode product/purchase/cancel/pending/restore interaction |
| Local reminders | Opt-in plugin and UI | Device permission, delivery and timezone checks |
| Remote push | Not implemented | APNs implementation, entitlement, credentials and device validation |
| Universal Links | Development custom scheme only | Owned domain/team, Associated Domains/AASA, routing implementation and validation |
| Privacy/safety | Manifest, permission localization, consent, report/block | Policy/provider reconciliation, moderation operations and store declarations |
| Store listing | Brand assets and checklist | Final IDs, screenshots, legal/operator/support details, age answers and review access |
| Distribution | Development project | Enrollment resolution, signing, archive, TestFlight, review and release |
| Performance | Bounded/lazy 3D and background pause | Physical memory/FPS/heat/battery, microphone and route tests |

See OPERATIONS.md. Retention review deadlines are not evidence of external/backup purge. No real deletion, charge or mail delivery was tested. A simulator build is not an App Store archive.
