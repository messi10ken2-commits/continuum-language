# iOS validation evidence

Updated 18 November 2026, Malaysia. Foundation PR #117 deployed native sessions at 99d6a22. Follow-up PR #118 contains the readiness services and native fixes. This is not an App Store release.

## Completed native and API evidence

At application-code commit e9fa4ac7, [Mac and shared-backend CI](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44251194134) completed successfully.

- Actual XCTest on the iOS simulator passed login, navigation to the named synthetic account, process termination/relaunch with Keychain restoration, logout, and another relaunch returning to the unauthenticated welcome screen. One end-to-end test, zero failures, 102.510 seconds.
- The test also requires the tapped control to be unobstructed by the keyboard. Normal local simulator signing enables Keychain; native keyboard resizing, readable input fonts and auth layout wrapping prevent covered controls/focus zoom.
- Shared regression suite: 619 tests, 618 passed, zero failures, one explicit skip for absent generated native assets before ios:sync. After synchronization, all 12 native tests passed with no skips, including the local StoreKit fixture-copy check.
- Web/native builds and native configuration checks passed. The simulator artifact is locally signed, defaults to the production API origin and has live purchases disabled. It is not an iPhone IPA or distribution archive. The separately rebuilt test application uses only the isolated loopback fixture.
- The final documentation/test-wiring commit adds no further application behavior beyond this tested code.

## Browser and production-image evidence

[Full application validation at 8df5c1f2](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44245937513) passed regression, companion/immersion, Light interactions, audio recovery, language/layout/records, content audit, production dependency audit, Docker build and unprivileged runtime checks. Its backend and ordinary web application code are unchanged by the later native-only fixes.

[Account-erasure browser rehearsal](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44245086636) passed Chromium and WebKit: default-off gate, preview/confirmations, wrong-password preservation, actual synthetic erasure, encrypted notice queued, and desktop/390px layouts.

[Real loopback HTTPS transport test](https://github.com/messi10ken2-commits/continuum-language/actions/runs/44250152383) passed Chromium and WebKit with the final transport implementation: actual JSON and multipart audio bytes received, bearer continuity, session-token stripping and blocked cross-origin redirects. This receiver observes real network bodies, not mocked request inspection. Its ephemeral certificate trust bypass is confined to this browser test; the shipping app has no TLS exception.

The native transport now uses standard WebKit Fetch. Retargeted request bodies are materialized once as encoded blobs, retaining multipart boundaries rather than introducing an unsupported streaming upload. Existing credential scoping, abort and redirect:error policies remain enforced. Technical background: [Chrome request-stream restrictions](https://developer.chrome.com/docs/capabilities/web-apis/fetch-streaming-requests) and [upstream Capacitor 8.6.2 bridge](https://github.com/ionic-team/capacitor/blob/8.6.2/core/native-bridge.ts).

## Readiness service checks

- Apple tests verify actual synthetic certificate/JWS signatures, ownership, grace, cancellation, refunds/revocation, duplicate/out-of-order notifications and stale-state protection. Actual services trust only pinned Apple G3 with online checks; synthetic roots are injected only by tests.
- Erasure tests cover owner protection, reauthentication, stale plans, unknown/missing user foreign keys, actual learner/teacher account/content erasure, unrelated-user preservation and encrypted completion notices.
- Mail tests cover TLS settings, safe headers, retry, expiry and delivered-payload redaction. No real provider was contacted.
- Production dependency audit: zero reported vulnerabilities. Development tooling retains the existing unpatched Picomatch advisory GHSA-fc5q-39xc-vjpf; no suppression or downgrade was applied.
- Before rollout, Railway variable-name inspection confirmed all four new activation switches were absent: maintenance, erasure, Apple verification and Apple live approval. They therefore remain disabled by default. No secrets were exposed or configuration changed.

## Limits and rollout evidence

Physical iPhone behavior, microphone routes, reminder delivery, StoreKit purchase/cancel/pending interaction, real Apple Sandbox transactions/refunds, SMTP delivery, real account erasure, distribution signing, TestFlight and App Store submission are not verified. Retention dates require operator review; no automatic external/backups purge is claimed.

The local execution environment disconnected during finalization. Code and evidence were preserved through GitHub and validation continued there. Deployment ID, source SHA, terminal Railway status and read-only production smoke outcomes are recorded in [PR #118](https://github.com/messi10ken2-commits/continuum-language/pull/118) after rollout; do not infer a completed rollout from the tests alone.
