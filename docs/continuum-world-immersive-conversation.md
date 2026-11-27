# World conversation settings and immersive NPC UI

Branch: `codex/world-immersive-conversation`, based on `e17a549` (Phase 2).

World entry now shows an initial guide. AI processing consent, use of Japanese class notes and conversation difficulty are saved to the authenticated account in `world_profiles.conversation_settings`. Defaults are opt-out and automatic difficulty. The guide explains where to change the choices; NPC conversations contain no consent checkboxes, difficulty or mission form. Missions are selected in the existing World missions panel. NPC memory stays separately opt-in and requires confirmation of each summary; its existing controls are reachable from World settings.

Talk starts/resumes a compatible session using the existing authenticated visits and speaking pipeline. The existing scene remains visible and animates; learner movement pauses, the camera faces the approached NPC, and exploration HUD controls hide. Only the current NPC line appears in a bounded speech bubble. Microphone status, send/cancel recording, optional text input and conversation tools sit in a bounded bottom dock. Hints, history, translation and allowance details open only when requested. Finishing saves verified Learning Memory evidence and rewards as before; the detailed review is optional to open. Closing an unfinished conversation leaves it resumable under the existing session rules.

Translation uses only a validated assistant message from an owned World session. Its authenticated, rate-limited endpoint reuses the conversation provider deadline/cancellation path and rechecks the memory context revision after generation. An atomic account counter bounds translation to 60 requests per UTC day in addition to the 20/minute limiter, including concurrent requests; generation is attributed to the existing conversation metering context. It writes no translation cache or NPC memory. Conversation data are treated as text, never instructions. New interface copy is supplied in all nine non-English display languages.

## Validation

- Build passed.
- Final related model/API/voice/localization/native run: 62 passed, 2 existing skips, 0 failures (64 tests). This includes the manual recording send/cancel test. The API E2E was subsequently rerun successfully after adding the translation daily cap and UTC reset test.
- Two missing UI strings caught by the first full-suite run were fixed; display coverage, interface templates and World copy tests subsequently passed, including in the 64-test run.
- The full application regression run completed: 675 passed, 1 failed, 2 skipped (678 tests). The sole failure was the offline-copy audit for the two strings fixed during that run. Its final rerun passed; the other 675 checks passed. This is not claimed as a second clean full-suite run.
- Browser QA was updated for initial guide, account persistence, direct NPC start, microphone-denied text fallback, current-line-only display, optional review, translation/history, memory consent/deletion, Learning Memory, 3D camera, movement freeze and landscape layout.
- Browser results are **not verified** in this workspace: Playwright engines are absent, their download is unavailable, the system Chromium launcher lacks its executable, and the cloud browser could not connect to the local test page. No new browser screenshots, FPS, native-device or live-provider quality claims are made.
- GitHub push was blocked by automatic approval review. No remote branch/PR, CI run or production deployment is claimed.

## Deployment and rollback

The additive migration is idempotent and gives old accounts the opt-out guide. No course progress, paid balance, existing NPC memory schema or dependencies change. Review/push the branch and run the updated Chromium/WebKit CI before production. Revert this change to restore the prior NPC form; the unused JSON column is safe to leave in place. Existing World feature flags remain available.
