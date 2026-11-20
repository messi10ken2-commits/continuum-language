# Japanese scene practice and regional audio recovery

The earlier embedded Japanese course taught introductory phrases (A2) and had no verified timestamps. The active replacement, `ja-premium-video-v4`, is B2 practice built around JapanesePod101’s formal sales presentation, `uJb7K2ZT50I`. It asks about time scales, forecast conditions, campaign effects, a concession and the annual outlook. B2 is Continuum’s practice classification, not a claim of official JLPT/CEFR equivalence.

The official watch metadata identifies Learn Japanese with JapanesePod101.com, reports 218 seconds and allows embedding. The publisher places the lesson in its advanced listening and JLPT N2 learning paths:

- https://www.youtube.com/watch?v=uJb7K2ZT50I
- https://www.japanesepod101.com/lesson/japanese-listening-comprehension-for-advanced-learners-1-a-japanese-business-presentation

Scene windows were checked against the official English caption track, which includes the Japanese dialogue. The inspected VTT SHA-256 is `1376fed627a4433b5033f3151e75ee9c0d21bcb286061e215dd1bfe0a2417ced`. Questions use the first dialogue (0:43–1:52), not the later answer replay. No full transcript or video is copied into the application. Original question order and grading associations survive session shuffling. Earlier v2 and v3 question sets, drafts, answers and scores remain separate and accessible; the new course does not inherit old mastery.

Each question displays its source time window and an accessible seek slider showing full-video timestamps. The official YouTube iframe API supplies actual playback position and seeking. Replay resets the designated scene, playback stops at the window end, and advancing questions resets optional full-video mode. External media consent gates both iframe and API script. Revoking consent destroys the player and timers. If the API is unavailable, the original iframe controls and source link remain available. Provider availability, advertisements and browser autoplay policies still apply.

## Audio defects and changes

The previous pipeline accepted nonempty but silent PCM as valid, and regional cache hits were served without checking signal energy. A browser autoplay rejection also discarded a prepared clip, forcing the next tap to make another asynchronous protected fetch, which could lose Safari’s playback gesture again. These are reproducible code defects; screenshots alone cannot establish whether a specific historical production response contained silence or was blocked by the browser.

New generated PCM is checked for audible varying signal before success. Empty, silent or DC-only successful provider responses get at most one retry per provider, then the configured provider fallback. HTTP limits/timeouts are not blindly retried. Existing regional WAV cache hits receive the same signal check; invalid entries are regenerated through the existing coalesced, budgeted path and replaced only with valid audio. An energy check detects silence, not linguistic correctness, accent authenticity or complete transcription.

Isolated Latin-script pronunciation words (including `thongs` in en-AU and `trem` in pt-BR) are read twice with a pause. Their versioned cache keys bypass older recordings; labels explain the repetition. Sentence input stays intact, kana retains its existing mora-aware recipe, native human clips remain unchanged, and conversation-persona replies do not gain word repetition. Audio locale and authorization remain server-bound. Unsupported synthetic Kansai is still disabled.

When autoplay is rejected, the prepared clip is retained for synchronous playback on the learner’s next tap. Browser checks assert this needs only one audio response and does not create duplicate playback.

## Validation

Regression coverage includes malformed/silent PCM, bounded provider retries and fallback, silence-cache replacement/coalescing, exact word/locale cache revision, historical grading isolation, all 28 current courses, and real HTTP audio authorization. Chromium/WebKit browser checks use a simulated official-player API and nonsilent WAV fixtures to verify seeking, end stops, replay, question transitions, privacy cleanup and gesture recovery on desktop/mobile layouts. External source identity and scene captions were independently inspected. Automated checks do not certify physical speaker output or the pronunciation quality of every future generated recording. Exact full-suite, build and deployment results are recorded in the pull request.
