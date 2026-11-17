# Remote notifications and Universal Links preparation

Local reminders and the `continuum-dev` scheme are implemented. Remote push and Universal Links are not activated by this PR. The following is the implementation contract for completing them after identifiers/capabilities are confirmed.

## Remote notification flow

1. Ask for permission only after the user opts into an explained notification category. Keep lessons usable when denied.
2. Register through Capacitor Push Notifications/APNs on supported physical devices. Send the current device token to an authenticated HTTPS endpoint; never treat an APNs token as a session credential.
3. Store a hashed device identifier, encrypted APNs token, user ID, platform, bundle/environment, categories and timestamps. Replace rotated tokens; unlink on logout/account deletion. Do not embed server/APNs credentials in the app.
4. Queue eligible class/reminder events server-side with per-user authorization, category preferences, deduplication, TTL and retry/backoff. APNs signing keys belong in server secret settings. Remove invalid tokens on provider feedback.
5. Send minimal visible text: avoid private chat, teacher notes or assessment content in lock-screen payloads. A tap contains a destination identifier, not trusted content or credentials.
6. Allowlist destinations and fetch fresh authorized content after a tap. A notification must not expose another learner's class or bypass login.

No endpoint, device-token table, APNs delivery worker or Capacitor remote-push plugin is currently implemented. Complete tests for rotation, logout, revoked permission, denied authorization, duplicate events and cold-start taps before activation. Do not present local-reminder success as remote-push coverage.

## Universal Links contract

Confirm an owned HTTPS domain, final bundle ID and Apple Team ID. Add `applinks:DOMAIN` to the signed target's Associated Domains and serve a valid `apple-app-site-association` for that Team ID/bundle without redirects. Limit paths to intended app destinations rather than matching every web URL.

Only accept the configured HTTPS host and allowlisted destinations. Reset tokens must retain the backend's single-use/expiry rules and must not be logged. Do not route arbitrary external URLs into the native WebView. Test installed/uninstalled behavior, cold start, logged-out navigation, malformed links, and web fallback with the actual signed app.

No Team ID/domain association is invented here and no AASA file is published. Custom scheme support is a development aid, not a Universal Links claim or a substitute for verified links.
