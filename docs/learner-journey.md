# Continuum learner journey and contextual visuals

## Scope

The approved learner concepts now share a soft violet, sage and sand presentation, with real contextual photography in preference to generated scenery. Overview, learning memory, the assessment introduction/report, Practice Studio, classes, Account, support, onboarding and lesson surfaces retain their existing functionality. Teacher workspace headers use neutral shared-study photography rather than pretending the teacher teaches the currently selected learner language. Operational owner/reviewer interfaces keep their controls and authorization.

The learner’s five fixed navigation destinations and the owner-only Admin destination remain unchanged. No database schema is replaced, no deployment configuration/secrets change, and no payment or grading rules are modified.

## Open learning map

The map groups the actual active curriculum by language, CEFR course band and chapter. All chapters and their individual activities are selectable. Learners can pan/scroll, zoom/reset, switch to a compact chapter list and choose real regional scenery. Map zoom/selection remain local UI state, stable across rerenders. Opening an activity uses the existing lesson/draft/retry/grade/save path.

Completion is derived from authenticated `exercise` records with valid scores meeting the authored pass threshold. Imported scores remain in existing records but do not fabricate map completion or journey milestones. A chapter’s next activity is the first not yet passed; completed chapters can be reviewed. Exploring bands or earning milestones never sets an assessed CEFR level.

## Consistency and milestones

The existing authenticated activity endpoint supplies signed-in days, active app study time and study days. A shared account-scoped hook feeds the rhythm strip, account milestones and activity record without multiple independent polling loops. Switching account clears the previous account’s values. The last-seven-calendar-days chart includes zero-study days and uses the activity time zone’s day key; it does not invent per-lesson/class durations or offline attendance.

Daily goals are 5, 10, 15, 20 or 30 minutes, validated on the server and saved in the existing private learner profile JSON. Existing clients/profiles receive a default of ten minutes. Account can change the goal while preserving the other profile fields.

Four milestones are derived from saved evidence: first recorded exercise, five distinct activities explored, one hour of accumulated active study, and seven study days. Low scores can still count as practice; only passing scores count towards chapter completion. Milestones are separate from proficiency, spending and teacher ranking. There are no lives, forced sequential locks, fake XP or competitive leaderboards.

## Guided first entry

New learner registration is preceded by language, goal, pace and starting-point steps, then the existing secure account form. Age confirmation, password rules, role selection, legal links and separate AI/media choices remain. Only a successfully created learner receives the selected initial profile; signing in to an existing account does not overwrite its profile. If profile saving fails after account creation, the signed-in learner can finish setup instead of creating another account. Existing unfinished learner accounts receive a four-step setup; teachers retain their established application/review flow. Passwords are never placed in the journey draft or local storage.

## Visual sourcing and performance

Eight real regional scenes cover Kyoto (two scenes), London, Sydney, Barcelona, Sayulita, Lisbon and Fernando de Noronha. Individual photo pages explicitly labelled each as free under the Unsplash License when inspected. Credits, authors, locations and original photo IDs are in `journey-photo-credits.json`; a public `/visual-credits.html` page includes the established lesson collection too. Header photos are decorative and not evidence for exercise answers or photos of a user’s actual teacher. Failed scenery becomes a neutral surface with working controls, rather than a falsely labelled replacement photograph.

The new scenes are self-hosted WebP at 1440×720 and 640×360 with responsive sources, lazy loading and fixed dimensions. The full set is approximately 1.3 MB; pages fetch only the displayed scene/size. No third-party image connection or generation request happens merely by opening a page. Existing local lesson photographs and actual teacher profile images are reused. A new licensed passenger-station image replaces the freight-train/airport mismatch for station contexts; originals retain their versioned addresses. No generated image was needed for this release, because suitable authorized real imagery was available.

Course introductions retain the larger context/photo example presentation; exercises use quieter cards and clear audio/answer controls. Existing source-video players, privacy gating, clip timelines, kana, pronunciation audio, accepted alternatives, randomization, feedback and scroll behavior remain. Assessments receive imagery on introductory/report surfaces, not answer-revealing images in scored questions. Reduced-motion preferences and keyboard navigation are supported; the chapter-list alternative avoids depending on dragging.

## Verification

Model tests cover all languages/bands, complete activity coverage, canonical score thresholds, source/language isolation and milestone evidence. HTTP tests cover validated, persisted goals and account separation. Browser QA exercises the guided signup through account/profile creation, four language maps, scenery/zoom/list selection, lesson entry/resume, Account preferences and responsive layouts. Existing navigation, teacher support, owner access and lesson-session checks are also run. Exact final QA/build/audit/CI/deployment results are recorded in the pull request.

Study time remains approximate and scoped to active in-app study; it is not a measurement of offline study or attendance in external classes. Regional scenes are examples, not an exhaustive representation of every country or culture using a language.
