# Regional media and teacher popularity

## Regional examples and sound

Original side-by-side examples now cover British/American/Australian English, Spain/Mexico/Río de la Plata Spanish (including present voseo and affirmative commands), and Brazilian/European Portuguese. Gallery examples and an expandable comparison section offer exact-text, exact-locale audio on demand. There are 29 comparison pairs: 58 forms, 53 supported synthetic or existing human-backed readings. Nothing is pre-generated or charged merely by opening the page. Premium authorization remains required for exercise audio; client text/locale overrides are ignored. Cache keys separate text and locale, and protected audio is not publicly cached. Device fallback is disabled for these comparisons to prevent silently substituting another regional voice.

Japanese pairs include standard counterparts alongside Kansai expressions. The five Kansai forms deliberately do not use the previously inaccurate synthetic Kansai voice. The original native Japanese comparison video by Miku Real Japanese and Yuyu plays in an embedded, privacy-gated YouTube player; SBS original-speaker links remain available. The human video is not misrepresented as a recording of every table row. Written equivalences teach meaning; synthetic regional styles are not certified accents.

## Japanese exclusive video

The active Japanese video course now uses JapanesePod101's official `n6ciMT6KhVo`, with eight original comprehension questions checked against the publisher's public transcript and its numbered phrases. The creator/title and `playableInEmbed: true` were checked from YouTube player metadata. The current player stays inside Continuum; original-site links are optional recovery/reference links. No external video/audio was downloaded for hosting or extracted into new recordings. Free video previews remain available without buying the exercise course, including the Miku regional comparison.

The new Japanese lesson has ID `ja-premium-video-v3` and A2 practice difficulty. The previous `ja-premium-video-v2` question set, grading, results and local drafts remain separate. Learners with earlier results/drafts see a previous-version section, including the saved best score. Old scores are not presented as mastery of the new video. Protected access and optional answer review also resolve the archived course.

Primary sources checked:

- https://www.youtube.com/watch?v=n6ciMT6KhVo
- https://www.japanesepod101.com/lesson/absolute-beginner-japanese-for-every-day-1-the-25-most-common-phrases-that-we-use-in-japan
- https://www.youtube.com/watch?v=tW1kj38VZ2c
- https://www.jpf.go.jp/j/project/japanese/teach/tsushin/hint/201107.html

Precise clip offsets were not invented. Videos can become unavailable or restricted by their provider; the original reference remains as fallback. Engine tests use a synthetic iframe document for third-party frames, while actual publisher availability/embedding was checked separately through YouTube metadata. Physical speaker quality and regional accent authenticity are not certified by automated tests.

## Ranking teacher search

Approved teacher search defaults to a rolling 90-day popularity index and now supports public name/headline/bio search and a recently-approved sort. Ranking is computed afresh from class records when searching, including expiry from the window. It is filtered to the selected teaching language before scoring, and ties have a stable approval-time/ID order. Only the top 100 matching results are returned, as in the previous directory limit. Searches are debounced; supporting booking/event indexes are additive.

Score (0–100), with priors to avoid treating sparse records as perfect or terrible:

- 20 × min(distinct learners with completed classes / 10, 1)
- 20 × (learners with at least two completed classes + 1) / (distinct learners + 2)
- 40 × (completed classes + 3) / (completed classes + teacher-caused confirmed-class cancellations + 4)
- 20 × (booking decisions within 24 hours + 2) / (eligible booking requests + 4)

Only the learner's original booking requests are response opportunities; instant bookings do not require an artificial teacher reply. A still-pending request enters the denominator after 24 hours. Historical unknown response timings are not fabricated. Cancellations require an event attributable to the teacher and a previously confirmed class; learner, administrator and replacement/reschedule cancellations are not automatically treated as teacher fault.

No-history teachers start at a neutral internal score of 50. Public cards say “Building teaching record” until at least three completed classes and two distinct learners exist. Displayed index/rank are aggregate, not student star ratings or a guarantee of quality/attendance. No private messages, learner identities, booking detail, ethnicity, gender, price, profile views, bookmarks or paid placement are used/exposed by this index. Published profiles remain approved-only. Privacy policy and the directory explain the calculation and its limitations.

The index can fall after cancellations, fewer returning learners, overdue decisions or older positive activity expiring, and recover as recent signals improve. It uses existing recorded class statuses, not independently verified physical attendance or payment volume. Fraud/attendance auditing and student-star-review collection are separate future features; no invented ratings were added.

## Validation

Unit and actual HTTP/PGlite tests cover ranking weights, degradation, language isolation, expiry, provisional state, private-field exclusion, validated search/sort; all comparison routes, locale binding, protected caching and unsupported Kansai refusal; new Japanese source and archived grading separation. Full QA, production build, content audit, runtime and dependency checks run before release. Browser checks exercise the built UI in Chromium/WebKit with disposable accounts, actual cached audio bytes and synthetic external iframe content. See the pull request for exact results and any environment limitations.
