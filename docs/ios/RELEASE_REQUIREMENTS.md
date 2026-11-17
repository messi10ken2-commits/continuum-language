# Requirements before native distribution

This list distinguishes paid Apple capabilities from work that can proceed independently. Nothing here is represented as activated.

| Requirement | Current implementation | Remaining action | Dependency |
| --- | --- | --- | --- |
| Native launch/authentication | Project builds; controller registration fixed | Pass isolated XCTest login, process restart, logout; fix any failures | Mac runner/device, no paid enrollment |
| Shared backend | Native bearer support and synthetic API tests | Review and deploy branch backend to HTTPS staging, then production rollout | Deployment review |
| Password recovery | Secure reset API/UI, injected delivery adapter | Choose mailer, configure secret webhook, verify delivery and abuse controls | Owner/provider configuration |
| Account deletion | In-app password-confirmed idempotent Support request | Implement/exercise fulfilment, retention rules, processing period and completion notice | Engineering/operator process |
| Store purchases | Gated StoreKit bridge, sandbox verifier, native UI separation | Production Apple transaction verification, entitlement reconciliation, notifications/refund/revocation tests, approved purchase UI | Engineering plus Apple configuration |
| Store metadata | Provisional bundle/product IDs | Confirm identifiers, prices, subscription group, three-day eligibility/renewal disclosures, review products | Owner + App Store Connect |
| Local StoreKit testing | Debug-only Xcode-environment gate, defaults disabled | Create local Xcode StoreKit configuration; exercise product/cancel/pending cases without granting unverified entitlements | Mac/Xcode, no paid enrollment |
| Remote push | Not implemented | Token lifecycle, authenticated device registration, provider queue/retries, permission UX and APNs testing | Engineering + paid capability/configuration |
| Local reminders | Plugin integration and opt-in UI | Physical delivery/time-zone/permission validation | iPhone |
| Universal Links | Custom development scheme only | Confirm owned domain/team ID, Associated Domains and AASA, validate routing | Domain/signing configuration |
| Privacy | Manifest, descriptions, AI consent | Reconcile actual SDK/data collection; update published policy and store answers | Engineering/owner |
| UGC safety | Report/block APIs and controls | Confirm moderation coverage, response process and review access | Operator process |
| App Review assets | Brand assets exist | Screenshots, support metadata, age questionnaire and synthetic review account | Owner + App Store Connect |
| Distribution | No archive signing/submission | Enrollment resolution, signing, TestFlight, review and release approval | Paid Apple membership |
| Real-device quality | Lifecycle handling implemented | Complete MAC_SETUP.md matrix, measure 3D memory/FPS/heat and audio reliability | Physical iPhones |

## Account deletion fulfilment design to finish

The present endpoint creates a request, not completed deletion. Before release, choose and disclose a realistic processing period, identify any legally retained billing records, and implement an operator procedure that does not require the user to contact support again.

The fulfilment must cover identity/profile, learning records, AI submissions/audio, messages/notes and user-uploaded content as appropriate, plus provider-held data and object storage. Revoke all sessions and recovery tokens. Handle shared teacher/class records and financial retention deliberately; do not blindly delete records needed by another participant or claim erased data that remains identifiable. Notify the user when completed and explain any required retention. Backups need a defined expiry policy.

Rehearse with synthetic users, including teacher/learner relationships, active subscriptions and repeated requests. Preserve audit evidence without retaining unnecessary personal content. The current request's Support ticket is the intake; an operator does not yet have an automated erasure command supplied by this PR.

## Payment activation design to finish

Use the same server-side entitlement model across web and native. Verify Apple-signed transaction data and ownership, approved bundle/product/environment, expiry and revocation. Persist original transaction identity and deduplicate delivery. Process signed App Store Server Notifications V2 idempotently, including renewal, billing retry/grace, refund and revocation. Reconcile entitlements on login/restore and periodically; never trust a client “premium” flag.

Test duplicate/out-of-order notifications, multiple devices, another account's transaction, expired/revoked entitlements, cancellation, pending approval and restore before enabling release purchases. A local Xcode receipt cannot be passed to Apple's sandbox server API to manufacture Premium access. Retain the release purchase gate until this entire path is reviewed.

Live individual teacher classes and digital Premium must retain their separate eligibility/payment paths. Any one-to-many classes or mixed digital package need a fresh policy review. Do not simply enable the existing web checkout inside the native digital upsell.

## Deployment/rollback

Review additive database migrations and take a normal backup before deployment. Keep billing disabled and recovery unavailable until the adapters are configured and tested. Roll source back to the previous known-good deployment if needed; preserve new recovery/block/support data for review rather than dropping tables automatically. Check that any installed native build is compatible with the backend being served.
