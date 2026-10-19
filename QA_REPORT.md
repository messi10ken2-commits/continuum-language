# Continuum — system QA audit

Audit date: 2026-10-14 (Asia/Kuala_Lumpur). Branch: `qa/full-system-audit`.
Baseline: `f7ee92c` on main. No merge, production deployment, production DB access,
real payment transaction or Railway token was used.

## 1. Overall health and inventory

The application has 452 lessons across 185 chapters: Spanish 111, Japanese 119,
Brazilian Portuguese 111 and English 111, spanning A1–C1. Base/display languages
are English, Japanese, Spanish, Portuguese, Simplified Chinese and French.
Inventory covers authentication, learner profiles, teacher profile review and
bookmarks, language-scoped teacher sharing and notes, lesson drafts and grading,
assessments, pronunciation matching, productive/listening skills, recurring
patterns, spaced review, visual recaps, conversation embeds, writing/drawing,
translation and native/AI/device audio.

Current local functional checks pass; that does not prove every real device,
provider response or deployment is correct. No P0 was demonstrated. A P1 browser
privacy race was reproduced and fixed. Human educational review and real-device
listening remain necessary.

## 2. Feature coverage

| Feature | Status | Evidence and boundary |
|---|---|---|
| Registration, login/logout, roles, server authorization | Pass | Real server source with disposable DB; invalid inputs, origins, rate limits and role checks |
| Learner and teacher profiles, review/admin, bookmarks | Pass | Existing profile API/render tests; owner/reviewer boundaries, revision checks, private credential notes |
| Teacher sharing/revocation, language scope and privacy | Pass | Teacher-language/API tests; learner/teacher isolation; no real accounts accessed |
| Lessons, exercise grading, variants, drafts, checkpoints, progression | Pass | Complete data/API/render suite across four target languages; representative browser flows; not all 452 lessons manually clicked |
| Assessments, saved history, retries, CEFR evidence | Pass | Assessment/curriculum/API tests, including productive sections and idempotency |
| Recurring patterns, review pool, class/self-study evidence | Pass | Evidence, consent, language-scope, cache and duplicate-submission tests; external AI mocked |
| 24 base/target language combinations | Pass | Browser language independence/navigation; reviewed-copy and protected-learning-text tests; does not certify every translation |
| Translation completeness/educational quality | Not Tested in full | Authored copy and protection rules checked; live provider translation and independent human review unavailable; dynamic English fallback remains |
| Audio catalog, limits/cache, PCM integrity, cancellation/lookahead | Pass | Speech, response-performance and sentence-audio tests; browser native audio decoding and explicit Spanish answer locale |
| Visual recaps, video range/HEAD, cues and transcripts | Pass | 269 bundled videos validated for manifest/hash/container integrity; conversation/media tests; no claim of watching all videos |
| External YouTube availability or regional embed restrictions | Not Tested | Requires accessible providers/real browser network and manual checks |
| Character-writing module | Pass | Drawing-pad/character-content tests; physical stylus/touch device not tested |
| Desktop and mobile-sized layout/navigation | Pass | Chromium at 1440, 390 and 320 px; 18 learner screens; no document overflow; physical mobile browsers not tested |
| Native voice pronunciation quality / live AI TTS | Not Tested | Nine recordings decoded in Chromium; linguistic quality, acoustic clipping and physical-device playback require listening |
| Scheduling, chat, meetings, paid bookings/payments | Not Implemented | No working server-side booking/chat/payment workflow found; legacy prototype components are not treated as live features |
| Email verification and password reset | Not Implemented | Existing app explicitly identifies these limits |
| Production/Railway infrastructure and database migration | Not Tested | No production access, Railway credentials or deployment performed |

## 3. Findings, reproductions and corrections

| ID | Severity | Reproduction and cause | Files / correction |
|---|---|---|---|
| QA-01 | P1 privacy | Delay GET `/api/practice` during UI sign-in, sign out, then release response. One private learner record appeared in `continuumPracticeHistory`, becoming guest/device import data. Unscoped asynchronous history/notes writes outlived the account. | `main.jsx`: account revision guards initial auth, sign-in, exercise saves and import; clear history/notes on account change. Browser reproduction failed before and passes after. Does not delete previously stored device data. |
| QA-02 | P2 translation | Keep account A translation pending, sign out, bind B with same display language, queue B text, then fail A request. Failure marked B queue failed and suppressed its request. | `interface-runtime.mjs`: capture account binding and ignore stale-account errors. `interface-session.test.mjs` fails against baseline and passes after. Public approved curriculum translation caches remain shared intentionally. |
| QA-03 | P2 API input | POST `null` JSON to login or send malformed Origin; server returned 500 instead of a client error. JSON shape and URL parsing were unchecked. | `server.mjs`: require object bodies, catch invalid Origin and return 400/403. `request-validation.test.mjs` tests null, arrays, primitives, broken JSON and origins. |
| QA-04 | P2 service failure | Uncached localization without a provider threw an intentional 503, but global error handler converted it to generic 500. | `server.mjs`: preserve the safe intentional 503 response and its original-text fallback message. API regression runs with providers disabled. |
| QA-05 | P2 voice selection | Automatic detection reads Spanish `He metido la pata.` as English because `he` is an English detection token. Target-answer buttons used auto locale despite a known lesson locale. | `SelfStudy.jsx`: use explicit options/answer locale, then lesson locale for target answer audio. Browser captures `/api/speech` from the actual ambiguous answer button and verifies `es-ES`. English instruction detection is unchanged. |
| QA-06 | P2 localization | Reveal a visual lesson meaning or recap transcript under a non-English display language: label/meaning/note fields bypassed localization. Conversation hints, exercise action labels and workshop titles/prompts/tips also bypassed it; the A1 writing task prompt was absent from the public translation corpus. | `LessonMedia.jsx`, `ConversationVideo.jsx`, `SelfStudy.jsx`, `SkillsWorkshop.jsx`, `localization-corpus.mjs`: route explanatory fields through existing localization and register public visual text with model protection. Learning examples/phrases and answer data remain intact. `media-localization.test.mjs` validates the sources/protection, including workshop instructions/tips; missing live translations still fall back honestly. |
| QA-07 | P2 dependency | `npm audit` reported source-map-js <1.2.2, GHSA-68fv-2mgg-jv7q, reflected in four high-severity dependency entries. | `package-lock.json`: update source-map-js 1.2.1 → 1.2.2; audit now reports zero vulnerabilities. This advisory concerns source-map processing in the toolchain; it is not evidence of a production breach. |
| QA-08 | P2 test coverage | Full baseline suite: 171 checks, 166 pass, five failures absent from normal CI. Old tests assumed no specialist checkpoint questions, Spanish-only chapter mappings, prompt-only uniqueness and teacher language access by default. | `curriculum-parity.test.mjs`, `transfer.test.mjs`, `learning-patterns.test.mjs`: update fixtures/contracts with stronger source/context/full-question checks and explicit shared language. No grading/material/permission/rate-limit changes. CI now runs the complete suite via `test:qa`. |
| QA-09 | P3 documentation | README described only a subjunctive preview and recommended planned prototype behavior as current; deployment instructions advised deleting historical overrides without inspection. | README/DEPLOYMENT updated to audited scope; preserve existing production configuration and require review. |
| QA-10 | P2 translation cost/latency | Send the same two uncached public texts simultaneously in opposite orders. Batch-key caching called the provider twice. | `localization-api.mjs`: coalesce in-flight work per locale/context/source cache key, preserving output IDs, validation and the three-batch concurrency limit. `localization-coalescing.test.mjs` reproduces 2 calls before and 1 after. |

Authentication rate limiting was explicitly checked and works (12 invalid login
attempts permitted, 13th returns 429). An initial suspicion was disproved; it was
not changed. No live learner information was used to reproduce QA-01.

## 4. Fix scope and regression evidence

New regression tools: `request-validation.test.mjs`, `interface-session.test.mjs`,
`media-localization.test.mjs`, `localization-coalescing.test.mjs`, `scripts/qa-browser.mjs`, and
`scripts/qa-performance.mjs`. Browser QA uses the actual production client build
and actual server source with disposable PGlite data. AI keys are removed only
inside the QA process. It tests the delayed-history/logout race, 24 combinations,
learner/teacher navigation, Spanish answer audio, native audio metadata and
representative lesson interactions. Server authorization is tested separately.

New `npm run test:qa` executes all test files with two workers. Existing product
scripts are retained. CI uses that suite, a build and production dependency audit.
There are no repository lint/type-check scripts, so none were invented.

## 5. Measured performance

Environment: Node v24.19.0, Chromium 154.0.8037.57 on Debian 13, AMD EPYC 9V74 (four available logical CPUs), PGlite 0.5.8,
loopback HTTP, synthetic accounts, providers disabled. API sample sizes exclude
one warm-up request; timings include response body transfer. Measurements are
local observations, not Railway or mobile-network benchmarks.

| Measurement | n | Median ms | p95 ms | Max ms |
|---|---:|---:|---:|---:|
| Health API | 30 | 3.12 | 5.94 | 8.17 |
| Cached translation, 16 distinct entries | 30 | 4.00 | 7.34 | 8.26 |
| Human audio API, pão | 30 | 1.88 | 2.66 | 2.74 |

Browser navigation and native-decoding statistics are recorded in the final
verification below. These are navigation/metadata readiness measurements, not
time-to-first-audible-sample. First uncached external translation/TTS and live AI
analysis latency could not be measured without provider access.

The existing translation batching/lookahead performance tests pass. The coalescing fix reduces duplicate provider work from two invocations to one in the reproduced overlapping-request scenario; no live-provider latency reduction is claimed. The client bundle measured 3,232.81 kB (gzip 721.80) before and 3,233.89 kB (gzip 721.63) after; the large-bundle warning is not suppressed. This audit
fixes correctness and avoids speculative optimization; no before/after production
speedup is claimed. Before/after defect evidence: private history rows leaked
1 → 0 in the same browser scenario; the translation race blocks → permits the
new account request; overlapping reversed batches invoke the provider 2 → 1 times; malformed inputs return 500 → 400/403; intentional provider
unavailability returns 500 → 503; ambiguous Spanish answer locale en-US → es-ES.
Existing large Vite client-bundle warning remains; broad chunking/refactoring
was not introduced without a measured interaction regression.

## 6. Remaining concerns / manual verification

- Of 1,876 catalogued UI-source strings, 355 resolve to static reviewed/core Japanese copy and 302 each to Spanish, Portuguese, Chinese and French copy. Other strings may resolve through provider/cache paths; these counts are not total lesson translation coverage.
- Provider-generated explanations can be incomplete, inconsistent or English
  fallback. Full educational review of all six base languages is not established.
  Static reviewed copy plus protected spans do not prove grammatical correctness.
- Recap MP4 captions are pre-rendered, and external human conversation transcripts
  remain in the target language intentionally. Caption rewriting is outside this
  audit; distinguish learning material from explanatory UI text.
- Human listening is required for Japanese mora/katakana, Portuguese nasal vowels,
  Spanish initial r/rr and accent contrasts. PCM padding and recording hashes do
  not prove pronunciation quality. Check Safari/iOS/Android permissions, autoplay,
  microphone capture, interruption and physical touch/drawing on real devices.
- Teacher profiles/review and sharing work, but scheduling, chat, meetings and
  payment systems are not implemented. No real transaction was attempted.
- Production DB state, migrations on a staging copy, live provider limits,
  Railway status and remote CI execution are not verified by local checks.
- The PGlite adapter executes actual SQL/server code, but does not model multiple
  real PostgreSQL transaction connections. A separate real PostgreSQL smoke check
  covered persistence/restart; distributed replicas and high-load transactions remain untested.
- Existing browser data that may have been affected by QA-01 is not automatically
  removed; deleting/importing user history without consent would be inappropriate.
- No claim is made that the application is bug-free or that every lesson has
  received manual pedagogical or visual review.

## 7. Regression results

Baseline: 171 tests, 166 passed, 5 failed, 0 skipped. The failures were stale test
contracts described in QA-08. After corrections: 176 tests, 176 passed, 0 failed,
0 skipped; production client build successful; dependency audit zero. The final
intentional-503 regression was also rerun separately after the error-handler fix.
A separate real local PostgreSQL run passed restart/session/history/preference/sharing/assessment preservation checks and idempotent practice saves; only its own randomly named database was created and deleted. Production migration remains untested. Browser and final command outcomes are recorded below after completion.

## 8. Deployment readiness

The narrowly scoped corrections are suitable for PR review after the final
checks below. Require the complete `validate` job and independent review before
merge. No automatic merge or deployment is authorized for this audit. Keep
Railway variables, production DB and payment settings unchanged. CI/local tests
cannot establish production readiness for all providers or physical devices.

## Final verification

- `npm ci`: success, frozen lockfile installation verified after dependency correction.
- `npm run test:qa`: 176 passed, zero failed/skipped (50.9 seconds in the final run).
- Production client build: success; large-bundle warning retained.
- `npm audit --omit=dev`: zero reported vulnerabilities; full audit also zero.
- `git diff --check` and Node syntax checks for modified server/runtime/API: pass.
- Browser: delayed history/logout privacy regression, all 24 base/target combinations,
  18 learner screens at 1440/390/320 px, five teacher screens, image modal Escape and
  native button keyboard navigation pass. No uncaught runtime exceptions or document overflow.
- Browser exercise flow: Spanish introductions (8 questions), Japanese A1 lesson 2
  (12), Portuguese A1 lesson 2 (12), English A1 lesson 2 (10): 42 correct answers,
  100% server-saved score in each, Continue/Finish and Restart verified. Public
  answer data is used only by this synthetic QA driver; this is not a claim that
  pedagogical distractors were manually reviewed for every lesson.
- Ambiguous Spanish answer audio request: `es-ES`, verified from the actual button.
- Nine native recordings decode with finite duration (1.36–2.346 seconds); this
  validates metadata/container support, not acoustic pronunciation quality.
- Browser navigation, n=24: median 47.12 ms,
  p95 72.68 ms, maximum 73.74 ms.
- Real local PostgreSQL restart check: pass; its own synthetic database was removed.
- Raw metrics: [qa-evidence/2026-10-14.json](qa-evidence/2026-10-14.json).
- GitHub Actions on this audit branch and production deployment have not been verified.
  Main remains unchanged. Do not merge/deploy without the owner's approval.


## Classroom pilot (2026-10-19)

Language-scoped teacher/learner classroom APIs, two-party chat, mutual class
proposals, overlap protection, rescheduling, external meeting links, shared notes,
assignments, actual lesson practice evidence, submission and feedback were added.
Payments remain disabled (price constrained to zero). Owner operations expose
booking metadata/cancellation and audit history, not chat or meeting links.

Validation covers timezone offsets and DST gaps/repeats; participant/role/language
isolation; stale revisions and idempotent retries; simultaneous booking acceptance;
privacy changes and access revocation; real lesson completion and teacher feedback
in two isolated browser sessions; six display languages; mobile/desktop overflow.
No production accounts were created by these tests. External calendar conflicts,
video-provider connectivity, email/push notifications and paid settlement were not
validated or implemented by this release.
