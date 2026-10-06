# Sound and script studios

Adds 16 pronunciation lessons (four each for Spanish, English, Brazilian Portuguese and Japanese), eight sound checkpoints, and nine Japanese character lessons. Characters cover both basic kana alphabets, voiced kana, combined small kana in both scripts, long vowels / small tsu, and 12 useful kanji words.

Each sound studio includes articulation / timing guidance, model audio, listening or feature checks, written listening recall, phrase practice and optional recording/playback. Browser TTS voice quality and regional realizations vary. Japanese uses recording/playback without automatic text-match scoring because kanji/kana transcription is not a pronunciation measure. Other languages retain the existing explicitly labelled speech-recognition match, not phoneme assessment.

Character studios offer hideable readings, audio, optional pointer copying and written recall. The pad is not stroke-order instruction or handwriting grading. Equivalent romanizations are accepted for basic kana where specified; kanji readings are word-specific.

Specialist IDs contain v1 and are separate from historical lessons. Core seeded summaries exclude specialist chapters so saved question sequences stay stable. New studios use fixed full practice sets and existing save/resume APIs; sound checkpoint seeds cover both taught lessons. The frozen v2 core exercise generator excludes specialists.

Validation: sound-script.test.mjs, curriculum-render.test.mjs (all specialist intros and exercises), pronunciation-api.test.mjs, existing core content and exercise suites, production build.
