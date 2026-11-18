# iOS validation evidence

Updated 18 November 2026, Malaysia. Foundation PR #117 is merged and its native-session backend deployed at 99d6a22. Readiness follow-up PR #118 is not an App Store release.

## Completed checks

- At ba8a9441, shared-backend and general regression CI each ran 619 tests: 618 passed, zero failed, one explicitly skipped because clean checkout lacks generated native assets.
- After ios:sync, all 12 native tests passed with zero skips, including the local StoreKit fixture-copy check.
- Web/native production builds and native project configuration checks passed.
- Apple tests validate actual synthetic certificate/JWS signatures, ownership, grace, cancellation, revocation/refunds, duplicate/out-of-order notifications and stale-state protection. Production trusts only pinned Apple G3 with online checks; synthetic roots are injected test-only.
- Erasure tests cover owner isolation, reauthentication, stale previews, unknown/missing foreign keys, actual synthetic learner/teacher erasure, unrelated-user preservation and encrypted notice handling. Mail tests cover TLS settings, retries, expiry and payload redaction.
- Synthetic browser rehearsal on branch qa/ios-readiness-ui at 91b4bb72 passed Chromium and WebKit: default-off gate, preview and confirmations, wrong-password preservation, actual synthetic erasure, queued notice and desktop/390px fit. Run: https://github.com/messi10ken2-commits/continuum-language/actions/runs/44245086636.
- Production dependency audit reported zero vulnerabilities. Development tooling still has the existing unpatched Picomatch advisory GHSA-fc5q-39xc-vjpf; it was not suppressed or bypassed.

## Native UI investigation

Unsigned simulator compilation succeeded, but unsigned Keychain access failed. Normal local simulator signing resolved that error. The next actual native login test at ba8a9441 failed with Fetch is aborted; the isolated HTTPS backend trace showed GET /api/auth/me succeeded but no login POST arrived. This is a real unresolved test at that checkpoint, not an authentication pass.

The follow-up disables Capacitor's global HTTP patch in favor of standard WebKit Fetch, preserving the existing exact-origin CORS, credential scoping, abort and redirect:error policy. Upstream 8.6.2 bridge code routes GET through a proxy and POST through the native HTTP adapter without carrying the same abort/redirect options. The fix and project guard require a new Mac run; record its actual result below after completion. No TLS exception, insecure token fallback or fabricated Apple identity was added.

## Limits

No physical iPhone, microphone-route behavior, local reminder delivery, StoreKit UI interaction, real Apple purchase/refund, SMTP delivery, production erasure, distribution archive, TestFlight or App Store submission is verified. Retention deadlines are operator review dates, not evidence of automatic external/backups purge. The local execution environment disconnected during finalization; code and test evidence were preserved through GitHub, and further checks continue there.
