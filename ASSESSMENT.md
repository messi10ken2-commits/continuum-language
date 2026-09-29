# Spanish diagnostic and communication workshops

The current version (`es-diagnostic-2`) has 45 objective questions: three reading, three language-use and three listening questions per A1–C1 band. It then presents a writing task and a recorded speaking task at the reading/language-use recommended course band. Original task difficulty is editorial and CEFR-inspired, not externally validated or statistically calibrated. C2 is not tested.

The original reading/language-use placement rule is retained: highest consecutive band with at least 2/3 in each area. Listening has its own consecutive-band threshold of 2/3 and does not silently change the existing placement. Listening uses device-generated Spanish speech, with transcript hidden during tests, replay allowed and no timed limit. The synthetic delivery is a limited sample of listening, not a full real-world listening examination.

Writing and speaking are submitted evidence, not multiple-choice proxies. Submitted work awaits a connected teacher's review; it has no automatic proficiency score. Four criteria are rated 0–4 and reported as a task rubric percentage. This does not determine an overall CEFR level or constitute certification. Skipped skills remain unassessed. Receptive scores exclude productive tasks from their denominator. There is no automatic essay or phoneme scoring in this release.

## Lessons and records

Learn includes three communication workshops per level (15 total): listening with three scored questions and explanations, writing with planning guidance and an original model, and speaking with an original prompt and recording/replay. These have a separate submissions and feedback record; they are not added to the existing multiple-choice mastery count or 85% summary-test certificate. Model texts illustrate structure; they are not prescribed answers.

Draft writing is stored per account/task on the device. Audio remains on the current page until the learner explicitly consents and submits. Submitted audio (up to 90 seconds / 1 MB) and writing persist in PostgreSQL, accessible only to the owner or connected teachers while self-study sharing is enabled. Teacher list, response playback and review routes all recheck this setting. Disconnecting a teacher also revokes access. No speech-recognition provider is invoked for the new speaking tasks. Audio is delivered through authenticated JSON, with no public media URL.

Teachers review submissions from Learning memory, Class notes or Full report, using task fulfilment, organisation/coherence, language control and intelligibility criteria as applicable. Feedback requires a specific written comment. Updated reviews appear in learner records and assessment reports on reload/refresh. A reading/language-use result stays distinct from reviewed productive evidence.

## Persistence and compatibility

Each continued test answer is saved server-side, owned by the learner and immutable. Identical retries are safe. Production samples are separately saved and recovered on resume if submission succeeded before the next test step was saved. Only finishing the assessment updates course placement. The latest completed result replaces previous placement, even if lower. Earlier `es-diagnostic-1` tests remain resumable with 30 original items, and historical records retain their scope.

Schemas are additive; no existing attempts, users, privacy settings or class notes are removed. Answer keys for placement listening are server-only in assessment-listening.mjs. Practice keys are client-visible as with existing lessons. This is an unproctored learning product, not cheat-proof testing.

Reference: Council of Europe CEFR Companion Volume and descriptors: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors . Before stronger claims, expert review, diverse learner pilots, item analysis, standard setting and validation are needed.

## Verification

`npm test` covers original scoring, v1/v2 compatibility, lesson API, assessment API, listening grading, response ownership, immutable retries, submitted-writing/audio records, four-criterion teacher evaluation, privacy revocation, and teacher result visibility, using the actual server against isolated PGlite. It never uses production accounts. `npm run build` checks the production bundle.
