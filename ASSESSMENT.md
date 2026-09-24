# Spanish placement and reassessment

This feature provides an experimental **reading and language-use course placement**, not an overall CEFR rating, validated examination, or certificate. Listening, speaking, and writing remain unassessed. C2 is outside the bank. Do not use these results for admissions, employment, or other high-stakes decisions.

## User flow

- A learner opens **Level test** from navigation, Overview, or Learn.
- First completion is placement; later completions are reassessments.
- Each form contains 30 original questions: 3 reading and 3 language-use questions in each A1–C1 difficulty band.
- Answers save one at a time. The learner can pause, refresh, and resume across devices. Saved answers cannot be changed. Skips count as incorrect.
- Only a fully completed test updates placement. The latest completed result, not the best result, is current. The most recent 20 results are displayed; all completed records remain in the database.
- The learning path is a recommendation the learner can explicitly open; no lessons are locked or marked complete by testing.
- Test results follow the existing learner-controlled self-study sharing preference. Hidden results are not returned by teacher APIs. Teacher links and class notes remain unchanged.

## Scoring and limits

Version `es-diagnostic-1` requires at least 2/3 reading AND 2/3 language-use answers in every consecutive band from A1. The highest such band determines the provisional placement. If A1 does not meet the threshold, the display is “Below A1” and the recommended course is A1. This is not proof of a Pre-A1 skill rating. All-correct results cap at C1 task difficulty, not a confirmed C1 proficiency.

These thresholds and task levels are author judgments. The forms have not been piloted, calibrated, statistically equated, or externally validated. Three questions per area per band provide limited evidence; reading items within a band share a passage. Two alternating forms reduce immediate repetition but repeat on later attempts. There is no retake lock; learners are advised to wait several weeks. A score difference should not be interpreted as a precise measure of growth.

Answer keys are kept in the server-only `assessment-bank.mjs`. The assessment UI receives the current question without keys or future items. Scoring uses server-held answers, not a submitted client score. Idempotent retries and row locks avoid double finalization. This is an unproctored learning tool, not cheat-proof testing.

## Reference and next validation work

Council of Europe: [Relating language examinations to CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages/relating-examinations-to-the-cefr). The original passages are not official or endorsed CEFR exam material.

Before making stronger CEFR claims: have language-assessment specialists review descriptors and items, pilot on a diverse learner sample, perform item analysis and standard setting, equate forms, and add validated listening plus rated speaking/writing samples. Never infer an overall CEFR result from lesson completion or this grammar/reading sample alone.

## Verification

Run `npm ci` then `npm test` and `npm run build`. The API integration test executes the actual server source against an isolated in-memory PostgreSQL engine (PGlite); it does not connect to production. It covers ownership, role checks, resume, idempotent retries, scoring, reassessment downgrades, privacy, and independence from lesson scores. Test adapters are not used by `npm start`.
