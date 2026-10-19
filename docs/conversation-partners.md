# Conversation partners

Five fictional AI personas are selected by course language and scenario in
`conversation-partners.mjs`. Reopening a conversation uses the same mapping.
These are portraits, not video avatars, real teachers, or native recordings.
The waveform and border follow audio activity. No camera is requested.

Project assets: `public/conversation-partners/{mira,hana,rafael,lucia,theo}-v1.webp`.
Mira is the user-supplied, previously AI-generated Approachable Language Tutor in
Warm Daylight image. The other four original portraits were generated with the
built-in image generation tool, then resized and converted to WebP for the app.
Original files remain outside the repository. No identity edits were made.

Generation prompt set (photorealistic-natural):
- Hana: Approachable Japanese woman around 32, shoulder-length dark hair, teal
  shirt, facing the camera across a cafe table, head and shoulders, natural
  daylight and skin texture, warm closed-mouth smile, softly blurred cafe.
- Rafael: Approachable Brazilian man around 34, short curly dark hair, medium
  brown skin, neat beard, terracotta overshirt, facing the camera across a cafe
  table, natural daylight and skin texture, softly blurred leafy cafe.
- Lucía: Approachable Spanish woman around 30, wavy dark auburn hair, olive
  complexion, cream blouse and muted coral cardigan, camera-facing, natural
  daylight and skin texture, softly blurred city cafe.
- Theo: Friendly Black British male professional around 36, short natural hair,
  neat stubble, navy open-collar shirt, camera-facing, natural daylight and skin
  texture, softly blurred coworking lounge.
All prompts requested a portrait 3:4 head-and-shoulders composition, a relaxed
closed-mouth smile, no text, logos, flags, headsets, other people, illustration,
or glamour retouching. Assets are not evidence of the speaker's nationality.

Each persona has a server-selected synthetic voice and a separate cache key.
Normal curriculum speech remains on its original voice and cache. Device voice
is still an explicit fallback and may not match the portrait.

Review recovery: require three goal entries in both instructions and example;
retry incomplete JSON/schema once; restore harmless quote typography to the
saved learner text; omit unverifiable corrections/evidence with a partial-review
notice. Provider errors leave the session active and offer review-only retry.
Diagnostic logs contain operation/error codes, never conversation content.
