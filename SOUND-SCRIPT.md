# Sound and script studios

Adds 16 pronunciation lessons (four each for Spanish, English, Brazilian Portuguese and Japanese), eight sound checkpoints, and nine Japanese character lessons. Characters cover both basic kana alphabets, voiced kana, combined small kana in both scripts, long vowels / small tsu, and 12 useful kanji words.

Each sound studio includes articulation / timing guidance, model audio, listening or feature checks, written listening recall, phrase practice and optional recording/playback. Browser TTS voice quality and regional realizations vary. Japanese uses recording/playback without automatic text-match scoring because kanji/kana transcription is not a pronunciation measure. Other languages retain the existing explicitly labelled speech-recognition match, not phoneme assessment.

Character studios offer hideable readings, audio, optional pointer copying and written recall. The pad is not stroke-order instruction or handwriting grading. Equivalent romanizations are accepted for basic kana where specified; kanji readings are word-specific.

Specialist IDs contain v1 and are separate from historical lessons. Core seeded summaries exclude specialist chapters so saved question sequences stay stable. New studios use fixed full practice sets and existing save/resume APIs; sound checkpoint seeds cover both taught lessons. The frozen v2 core exercise generator excludes specialists.

Validation: sound-script.test.mjs, curriculum-render.test.mjs (all specialist intros and exercises), pronunciation-api.test.mjs, existing core content and exercise suites, production build.

## Studio audio (2026-10-06)

All SentenceAudio controls now request cached server-generated speech instead of silently choosing a device voice. Public lesson, exercise and assessment text is allowlisted; private learner text and recordings are not submitted to this endpoint. Keys remain on the server. Generated WAVs are cached in PostgreSQL and bounded to 256 MB. New generations are limited to four concurrent requests and 1,000 per day (TTS_DAILY_LIMIT override); cached playback remains available.

OpenAI gpt-4o-mini-tts / marin is used first with language-specific instructions; Gemini speech is the fallback. These are AI voices, not human recordings or guaranteed phonetic ground truth. Isolated Japanese kana are read twice with a pause, with explicit は/へ/を/ん readings. Samples are padded with silence without stretching or trimming phonemes. 0.85× playback preserves pitch. Browser speech is only an explicit, labelled fallback and requires an exact-locale installed voice. Changing characters, stopping or leaving a page cancels obsolete playback.

Provider documentation: https://developers.openai.com/api/docs/guides/text-to-speech and https://ai.google.dev/gemini-api/docs/speech-generation . Voice/model changes should bump speechVersion to invalidate old cache entries. Verify actual provider availability and representative Japanese, Brazilian Portuguese and Spanish clips after deployment; API/format checks do not certify native pronunciation.
