# Responsive header and interface translation reliability

The photography header now keeps the logo, a short Photo/Illustrated selector and a compact learner/teacher account control on one row. Full accessible account labels and the full World style control in Account remain available. Controls have 44px touch targets. The same compact layout selector also fits the RPG HUD. Layout preferences, account navigation and learning records retain their existing contracts.

Recurring-pattern coaching explicitly requests the selected display language. Report fingerprints include that language so English or stale-language reports cannot appear as translated results. The UI ignores obsolete requests and hides reports for a different interface language; source evidence and consent/revocation controls remain unchanged. No schema migration is needed.

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

## Saved skill headings and Practice Studio cards

Skill history and expanded records translate the authored task title at render time and subscribe to display-language changes. Original prompts, learner responses, teacher feedback, scores, dates and task IDs remain saved as before. All 60 composed core headings (five bands, three skills, four learning languages) have bundled translations, as do the AI conversation and Vocabulary review card headings. Reviewed copy covers Japanese, Spanish, Portuguese, Chinese and French without a provider request or cached translation.

`node --test skill-title-localization.test.mjs` checks every core/lesson/assessment/premium heading in all five non-English interface languages, preserved band labels and original English titles. It also renders the Japanese Studio menu in both photography and illustrated contexts. These are runtime translation and server-render checks, not physical-device certification.

## Additional display languages

The display-language picker supports English, Japanese, Spanish, Portuguese, Simplified Chinese, French, Korean, Indonesian, Russian and Modern Standard Arabic. This does not add learning languages. Existing preferences migrate in place.

`additional-display-copy.json` bundles Korean, Indonesian, Russian and Arabic translations of the public interface catalog. `display-language-seed.mjs` supplies editorial overrides for navigation, privacy, placement, booking and restoration terminology. The build-time generator uses the same protected-source rules and locale guidance as runtime lesson explanations; it never reads learner data. Missing dynamic lesson explanations continue through the existing authenticated, cached translation service.

Arabic sets document direction to RTL, and switching away restores LTR. Spatial maps and calendar geometry retain LTR coordinates; language-tagged learning examples, email addresses, URLs and code are isolated from the surrounding direction. Browser QA covers both themes, learner/teacher accounts and 320–1440px widths.

## Static UI coverage regression

`node scripts/audit-display-coverage.mjs` checks literal translation calls, display props, conditional labels, mapped string/tuple/object labels, and unsafe visible string concatenation across JSX screens. All authored UI sources must have offline copy in all nine non-English display locales. Known brand names, URL/code placeholders and explicitly language-tagged learning material are excluded.

`interface-audit-copy.json` fills previously live-only UI gaps without overwriting established reviewed translations; `interface-audit-seed.mjs` overrides the reported overview labels, grammar labels, subscription statuses and the name-safe learning-memory template. Personalized headings use `tf` placeholders: names are inserted after translation and are never sent to the translation service.

Browser coverage checks learner/teacher navigation, expanded Account settings, Overview period buttons, memory headings, both visual layouts and phone/desktop bounds. It compares visible authored UI text against its translations, excluding learning-language examples and authored user content.

The regression covers 1,944 source phrases. Provider/cache tests choose approved learning text without bundled translations so newly offline UI copy cannot accidentally bypass their queue, cache and failure-path checks.
