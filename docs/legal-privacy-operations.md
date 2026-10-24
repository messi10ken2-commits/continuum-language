# Help, policy and privacy operations

Public URLs: `/terms`, `/privacy`, `/help`, `/privacy-settings`. Account, welcome/sign-in screens and the main app footer link to them. Terms/Privacy/Help are rendered by the server with real HTML, headings, navigation and a same-origin-only CSP; they work without an account or JavaScript. Help search uses a GET query and escapes input. Public documents are the English version; account/privacy controls participate in the existing interface translation system.

## Contact

The owner supplied `continuum.language@gmail.com` as the public contact. Email links open the user's mail app; no email is sent automatically. Replies to email are handled through that email inbox. In-app contacts remain in Admin → Contacts; no email-ingestion integration has been added. `/?open=support` opens Support for signed-in users and preserves that destination through sign-in. People who cannot sign in can still email support from any public page.

## Real privacy controls

- **Optional external video:** off until an explicit choice in this browser. Stored as `continuumPrivacyV1` in local storage and labelled as a device/browser preference shared across accounts on that browser. Both YouTube and remote native video elements are withheld before permission. YouTube uses its privacy-enhanced domain after permission. Local media, original-publisher links and available transcripts remain accessible. Revocation removes mounted players in the same tab and other tabs through browser storage notifications. It cannot undo data already sent to a provider. Provider permission is not a claim that no data is processed.
- **Teacher self-study sharing:** uses the existing learner-only `/api/privacy` permission and existing language-scoped teacher access. Settings reads this permission from `/api/privacy/settings`. Teachers and signed-out visitors do not get a learner switch. Existing teacher links, class notes and progress are not deleted by the switch.
- **AI patterns:** shows the existing per-language enabled state. Stop one or all languages using learner-only `/api/privacy/patterns` DELETE. This clears generated reports/fingerprints/request tokens and disables analysis; it does not delete underlying evidence. Existing request-token checks prevent an in-flight analysis from restoring a revoked report. New analysis still needs fresh explicit consent in Learning memory. This control does not disable separately requested AI conversation, assessment, interface translation or studio speech.
- **Essential storage:** explains actual sign-in and learning/interface state. No unsupported ad/analytics switches were added. Main fonts are now self-hosted under `public/fonts/`, with their SIL licences preserved, so there is no background Google Fonts request.

## Policy maintenance and scope

`public-documents.mjs` holds original Continuum-specific Terms, Privacy and Help copy, the supplied contact address and version date. Update the version and notify affected users when materially changing practices. The screenshots were layout references; no Busuu legal text, brand or proprietary assets were copied. Registration links the Terms and Privacy Policy separately from optional media/pattern choices. This update does not add a historical terms-acceptance database or retroactively claim existing users agreed to a version.

The statements reflect the current implementation, including saved skill recordings, AI provider processing, manual verified data requests, payment record retention and the absence of self-service password reset. No fixed retention schedule, instant export/deletion, automatic refunds, jurisdiction, registered-company details, DPO, certification or global legal compliance was invented. The legal operator's full identity/address, applicable jurisdiction-specific duties, provider contracts/transfers and operational retention schedule still require owner/legal review. Do not treat the text as legal certification. Account deletion/export requests must be verified and fulfilled through the support process; this release does not implement automatic account deletion or export.

Primary reference material checked for notice structure/provider disclosures:
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/
- https://support.google.com/youtube/answer/171780
- https://ai.google.dev/gemini-api/terms
- https://developers.openai.com/api/docs/guides/your-data
- https://railway.com/legal/privacy
- https://stripe.com/privacy

## Checks

```sh
node --test legal-privacy.test.mjs legal-privacy-api.test.mjs conversation-media.test.mjs
npm run test:qa
npm run build
npm run check:runtime
npm audit --omit=dev
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs QA_BROWSERS=chromium,webkit node scripts/qa-legal-privacy.mjs
```

The browser script uses a disposable database and synthetic learner/teacher accounts. It tests no-JavaScript public pages, search, mailto links, signup/account entry points, zero external requests before permission, approved timed playback URLs, cross-tab revocation/reload, saved sharing changes, pattern report removal, role boundaries and desktop/mobile layouts. External video network is stubbed to validate gating/URLs rather than contacting a real provider. No production accounts, contacts, payments or privacy settings are mutated in these checks.
