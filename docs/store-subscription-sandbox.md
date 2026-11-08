# Continuum store subscription Sandbox

The first public release can ship with store subscriptions already tested. The Web app remains the source of learning data and membership access. Public Stripe Checkout is a separate rollout.

## Store setup before release

- Apple. Create an app record in App Store Connect and configure the auto-renewable subscriptions in one subscription group. Use the app bundle ID and an App Store Server API In-App Purchase key. Test on a development build with a Sandbox Apple Account or on TestFlight. Submit the first subscriptions with the app version.
- Google. Create the app record and subscription products in Play Console, configure the base plans, and use a matching Android package ID. Grant the service account access to the Play Developer API. Run the Android build through internal testing with license testers and test payment methods.
- Put provider credentials in the Staging secret settings. Set the bundle ID, package ID and comma-separated product allowlists. Enable `STORE_BILLING_SANDBOX=true` in isolated Staging. Test access is ignored in Production even when the flag is present.

## Native client contract

1. After learner sign-in, GET `/api/billing/store-sandbox` using the existing authenticated session. Use `appleAccountToken` as StoreKit's `appAccountToken` or `googleObfuscatedAccountId` as Play Billing's obfuscated account ID.
2. After the purchase or during a refresh or restore, POST `{provider, purchase}` to the same endpoint. For Apple, send the original transaction ID as a string. For Google, send the purchase token.
3. The backend checks the store's current state, configured product and account ownership. It acknowledges eligible Google purchases and updates the shared Premium entitlement. Use the normal membership API to refresh the app UI. Cancelled subscriptions retain access up to their verified expiry. Revoked or suspended purchases lose access when verified again. Verified expiry is also enforced on membership reads.

## Remaining before release

- Build the iOS and Android clients, implement store purchase and restore screens, and run real end-to-end Sandbox tests with the registered products and native builds.
- Add verified Apple server notifications and authenticated Google real-time developer notifications to reconcile renewals, refunds and revocations without waiting for the app to open. The current Sandbox endpoint refreshes when the client submits the purchase.
- Add the production store adapters, rollout controls and device/store review checks. Test purchases are stored separately and cannot grant production Premium.

- [Apple Sandbox testing](https://developer.apple.com/help/app-store-connect/test-in-app-purchases/overview-of-testing-in-sandbox/)
- [Apple submission requirements](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase/)
- [Google Play Billing testing](https://developer.android.com/google/play/billing/test)
