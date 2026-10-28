# Ten-language platform expansion — implementation ledger

User request: add Simplified Mandarin Chinese (`zh`), Korean (`ko`), French (`fr`), German (`de`), Modern Standard Arabic (`ar`), and Italian (`it`) throughout photo and illustrated interfaces, matching existing structure/quality. Add dedicated Chinese/Korean/Arabic script learning and German umlaut/ß learning. Scrutinize functions, connections, translations and authored accuracy. Existing languages: es, ja, pt, en. Do not deploy until the cross-platform release checks pass.

## Work plan

- [ ] Shared learning-language registry, locale/direction/script metadata; replace backend whitelists and SQL constraints where applicable; preserve existing IDs and histories.
- [ ] Six authored A1–C1 curricula, chapter/checkpoint/summary/exercise coverage, substantial references, examples and mixed question formats. Adapt grammar to each language, rather than copying Spanish paradigms. Preserve existing records.
- [ ] Script and pronunciation studios, character/audio/reading/handwriting practice; German ä ö ü ß/ẞ and meaningful accent handling. Never label unassessed handwriting as correct.
- [ ] Independent placement reading/language-use/listening with productive tasks, workshop tasks, AI conversations, review/memory and class assignments.
- [ ] Exclusive-course and focused-skill coverage, permissions, server-owned audio and score storage, native-language examples and appropriate question formats.
- [ ] Both layout selectors, illustrated/map/RPG assets and photo credits, passport/rewards, onboarding/profile/teacher filters, analytics/privacy/account connections.
- [ ] Display copy and protected target-language text; Arabic direction and typography; Chinese segmentation and Korean spacing; correct TTS locales/style prompts; no silent Spanish fallback.
- [ ] Structural/semantic regression audits, API isolation/authorization, persisted drafts/scores, browser matrices on phone/desktop, full CI, production build, merge/deploy and live verification.

## Established defaults

Simplified written Chinese with standard Mandarin (`zh-CN`); standard Korean (`ko-KR`); France French (`fr-FR`); standard German (`de-DE`); Modern Standard Arabic (`ar-SA`, explicitly instructed MSA); Italian (`it-IT`). Learning-language and display-language registries stay separate. Course bands are editorial CEFR-inspired stages; do not imply an accredited CEFR certificate or an empirically calibrated placement examination.

## Repository/deployment

Repository: `messi10ken2-commits/continuum-language`. Branch: `feat/six-learning-languages`, based on main `0055a328ac6a36b5b1973482e36854f227cdbcdc`. Production: https://continuum-language-production.up.railway.app . Existing direct GitHub blob/tree/commit APIs work; git fetch/clone works, git push has no configured auth. PR merge triggers Railway production deployment. Never report deployment without scoped terminal SUCCESS and live bundle/health verification.

## Audit notes

Existing ordinary course structure: A1 6 chapters × 2 lessons, A2 6 × 2 (plus the Spanish/Portuguese past-aspect addition), B1 6 × 2, B2 5 × 2, C1 6 × 2 (including the recent idiom chapter), one checkpoint per chapter and one level summary. Three original international languages each have 58 ordinary learning lessons. Specialist pronunciation, script, visual and conversation paths are separate. Existing exclusive catalog: 9 courses per language. New content must be authored for each language; identifiers/answer keys must not be relabelled English or Spanish.

Hardcoded learning-language checks found in: review-api, privacy-api, adventure-api, owner-api, localization-api, speech-api, illustrated-art, JourneyLayout. Other modules use maps keyed by the original four, notably speaking-content, premium-skills, assessment-rounded/variety, international course/assessment, passport assets, RPG and lesson artwork. Assessment routing currently recognizes only `(es|ja|pt|en)-diagnostic-[234]`.

Browser runtime recovered in this session: `/tmp/c1-run/chromium`; Playwright at `$CODEX_PRIMARY_RUNTIME_NODE_MODULES/playwright/index.mjs`; `LD_LIBRARY_PATH=/tmp/c1-run/al2023/lib:/tmp/c1-run`; CJK font configuration `/tmp/c1-run/fontconfig/fonts.conf`. These are temporary and may be pruned. `node_modules/ffmpeg-static/ffmpeg` currently links to `/usr/bin/ffmpeg` locally after `npm ci --ignore-scripts`; CI runs normal npm ci.

## Current checkpoint

Shared registry expanded (not deployed). Backend direct whitelists now use learningLanguageIds. Added six studio speech locales with language-specific reading instructions; Unicode speech-token matching replaces Latin-only filtering. Script studio now accepts lesson locale/audio/guidance and limits kana attribution to Japanese. Added target-script CSS. Review dictation uses registry locales.

Authoring schema and 58-slot layout are in curriculum/authoring.mjs and curriculum/layout.mjs. expanded-learning-course.mjs builds authored core lessons, reference tables/toolkits, expanded exercises, chapter transfer pools, summaries and production tasks. NOT YET imported into course.mjs/exercise-variants/skills: wait until all packs are complete. French A1/A2/B1 are currently authored (36/58 ordinary lessons), parsed and preview-built successfully. French B2/C1 and all other packs are outstanding. No new language is released; do not deploy partial work.

Accuracy caveat found during source review: an older Goethe worksheet still says there is no uppercase ß and offers oversimplified umlaut mnemonics. Do not copy that statement. German lessons must cover modern ẞ/SS capitalization, preserve ä/ö/ü contrasts and distinguish German/Austrian ß practice from Swiss ss. Use current Council for German Orthography material for the rule.

French checkpoint: all 58 ordinary lessons across A1–C1 now authored in curriculum/fr.mjs (including 10 C1 idiom models), preview-built into 92 items/34 chapters. No exercise answer exceeds 150 characters. This is not yet connected to the live catalog; remaining packs and platform surfaces are still required.

Expansion checkpoint: fr/de/it/zh/ko each now have 58 ordinary authored units, successfully preview-built into 92 items/34 chapters and 726 expanded exercises per language, with no answer longer than the player limit of 150 characters. Arabic content and all platform integration still pending. Foundation tests (pronunciation-score, ai-assessment, existing curriculum-parity) passed 27/27. No new language is connected to the public course catalog yet.
