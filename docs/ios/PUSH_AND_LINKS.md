# Remote push and Universal Links

Updated 19 November 2026. Implementation is present; Apple provisioning and real-device delivery/link validation remain pending. All server and app activation gates default off. Local reminders remain a separate feature.

## Implemented behavior

- Capacitor Push Notifications 8.1.3, actual native bundle/environment capability reporting and explicit user opt-in. Classes, messages and practice categories use offline translations in all display languages. Refusing permission leaves learning available.
- Authenticated native-bearer device registration; randomized installation reference, HMAC identifiers and AES-256-GCM APNs token storage. Tokens are not saved in browser storage, logs or app URLs. Rotation preserves same-user queued work. Registration is bound to an expiring session; logout/reset/deletion revoke the device and its queued work through database foreign keys.
- Transactional class-message/class-event notifications and upcoming-class reminders. Per-device categories, deduplication, expiry, leases, bounded retry/backoff, stale booking revisions, participant/block checks and invalid-token removal. Generic localized lock-screen text contains no chat text, notes, scores or participant names. Pending destination data is redacted after expiry/delivery; terminal metadata is removed after seven days when maintenance runs. Delivery is at-least-once; a crash after APNs acceptance may duplicate a notification.
- Native HTTPS and development links and notification taps share a typed destination schema. Allowed paths: `/app/learn`, `/app/practice`, `/app/classes`, `/app/account`, `/app/support`. Optional language, lessonId, threadId or bookingId are validated. Unknown hosts/fields, embedded credentials, traversal and token-bearing navigation links are rejected. The pending destination stays in memory through sign-in/profile completion and is cleared on logout. Each destination loads fresh server-authorized records.
- AASA endpoints at `/.well-known/apple-app-site-association` and `/apple-app-site-association`, without redirects. Both return 404 until a real full App Identifier and explicit enable flag are configured. HTTPS web fallback uses the same route contract.

## Apple handoff

1. Finish Apple enrollment. Confirm the final registered bundle ID, full **App Identifier prefix + bundle ID**, signing Team ID, APNs key ID/team/private key, and approved HTTPS domain. The App Identifier prefix can differ from the Team ID; do not substitute one blindly. The existing Railway HTTPS hostname can serve the association document; no custom domain has been registered here.
2. Run `npm run ios:sync`, then `APPLE_APP_IDENTIFIER=... APPLE_SIGNING_TEAM_ID=... APP_LINK_ORIGIN=https://... APNS_ENVIRONMENT=Sandbox node docs/ios/prepare-capabilities.mjs`. It produces a disposable project copy with explicit push/Associated Domains entitlements and bundle/team settings. It does not alter the base development project or create an Apple provisioning profile. A valid matching profile is still required.
3. Server secrets: independent random 64-hex `PUSH_TOKEN_KEY`, `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_PRIVATE_KEY`. Public settings: `APNS_BUNDLE_ID`, `APNS_ENVIRONMENT`, `APPLE_APP_IDENTIFIER`, `APP_LINK_ORIGIN`. Configure keys only in secure service settings.
4. In isolated staging, set `PUSH_REGISTRATION_ENABLED=true`, `PUSH_DELIVERY_ENABLED=true`, `APP_LINKS_ENABLED=true` and the maintenance flag only after reviewing the real configuration. Sandbox is rejected by the production deployment. Production APNs requires a distribution-signed app and explicit Production environment. A local simulator capture is not APNs verification.
5. On a physical iPhone: test permission granted/denied/revoked, token rotation, category change, account switch/logout, fresh/stale/cancelled class reminders, blocked chats and foreign-record denial. Confirm actual APNs delivery, cold/foreground/background tap routing, logged-out sign-in continuation, installed/uninstalled Universal Links and web fallback. Inspect signed entitlements, AASA response and Apple CDN association behavior. Do not claim activation until these checks pass.

Registration can be enabled independently of delivery for staged testing. Disabling delivery stops new queueing/sending; disabling registration prevents changes. Disabling the maintenance flag pauses all readiness workers. Keep token encryption keys until all corresponding registrations are removed; multi-key rotation is not implemented.

## Validation

`app-links.test.mjs`, `push-api.test.mjs` and `native-push.test.mjs` cover strict routing/pending consumption, default-off identity gating, real ES256 signature verification, encrypted rotation/session ownership, retry/expiry/dedup/logout and explicit opt-in without real provider traffic. Existing classroom authorization tests also run. They do not establish Apple device delivery or Universal Links provisioning.

Apple references: https://developer.apple.com/documentation/xcode/supporting-associated-domains · https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns · https://developer.apple.com/documentation/usernotifications/establishing-a-token-based-connection-to-apns
