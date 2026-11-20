# Personal vocabulary and expression review

Learners open Review from the prominent card in Learn. Pools are scoped to the signed-in learner and selected learning language. Teachers cannot access this API. Guests are asked to sign in.

Misses are derived server-side from authored answers when a draft is saved after Continue or a lesson is completed. The existing one-retry flow saves the first answer, so a correct retry does not hide the original mistake. Source events are deduplicated across draft saves, completion and history catch-up. Each entry remains tied to its source lesson and meaning. Grammar-only questions are excluded.

On first access, historical attempts with per-question evidence are imported once. Aggregate-only old scores cannot identify individual words and are not guessed. A saved entry's quiz uses the current contextual question when a matching coverage key exists; it does not quiz the learner on notation such as `+ gerund`.

Review answers are graded on the server. A wrong answer resets strength to zero and is immediately due; successive correct answers use 1, 3 and 7 day intervals. The UI labels these Needs review, Practising and Strong, not a validated proficiency score. A session contains at most 10 items, prioritising due items within the selected filter. A user can practise early if none are due. Each submitted answer persists immediately; exiting a review retains completed answers.

Tests: `node review-api.test.mjs`, `node --test review-pool.test.mjs`, `node curriculum-render.test.mjs`, and `npm run build`. API tests run in isolated PGlite, never the live database.
