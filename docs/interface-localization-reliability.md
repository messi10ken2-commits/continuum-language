# Responsive header and interface translation reliability

The photography header now keeps the logo, a short Photo/Illustrated selector and a compact learner/teacher account control on one row. Full accessible account labels and the full World style control in Account remain available. Controls have 44px touch targets. The same compact layout selector also fits the RPG HUD. Layout preferences, account navigation and learning records retain their existing contracts.

The reported course-band sentence was interpolated before translation, producing strings absent from the allowlisted localization corpus. It now translates a registered template before inserting the learning-language name and CEFR band. Lesson draft/latest/best/production-result messages, recurring-pattern fallbacks and status labels, speech retry hints and video/copying-pad accessibility labels use the same pattern. Learning examples, answer values, recorded learner evidence and free-form teacher observations stay in their original language.

Reviewed bundled translations cover all five non-English display languages for the new templates, six previously unregistered interface phrases, Overview shortcut descriptions and common record labels. New bundled copy takes precedence over old client translation caches. Existing provider-backed translation of long lesson explanations, protected target text, error/retry reporting and source allowlisting are preserved; this is not a claim that every provider-produced explanation has been independently linguistically reviewed.

`npm run audit:interface` performs a read-only AST scan of all root JSX interface files, verifies that multi-word literal translation calls have registered sources and flags visible English template literals. It does not collect user data or send anything to a translation provider. Its regression test prevents those source-registration/template omissions from returning. The audit checks static source coverage; runtime data, lesson-specific linguistic accuracy and every possible provider failure remain separate concerns.

Validation commands:

- `npm run test:qa`
- `npm run audit:interface`
- `npm run audit:language`
- `npm run build`
- `npm run test:header:browser` with installed Playwright and `QA_BROWSERS=chromium,webkit`
- `npm run test:rpg:browser`

The header suite uses disposable learner/teacher accounts, all six display locales, 320/390/768/1440px layouts, all four course languages and A1–C1 bands. It checks logo/control bounds, row alignment, touch targets, account navigation and photo/RPG switching. AI providers are disabled in local browser QA; no production accounts, real payments, secrets or infrastructure settings are changed.
