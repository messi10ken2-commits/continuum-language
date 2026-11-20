# Interface language and learning language

Six interface choices: English, Japanese, Spanish, Brazilian Portuguese,
Simplified Chinese and French. `languages.mjs` continues to define only the four
learning languages. Interface selection never changes the course, active lesson,
answers, grading, speech locale or saved learning progress.

The welcome screen has a language selector. A new browser uses its supported
preferred language; the browser choice is remembered. An authenticated account's
saved preference takes precedence on sign-in. A new account saves the current
browser choice. Account settings can update the preference for either role.

Core entry, registration, learner setup and common navigation use bundled copy
in `interface-copy.mjs`. Other authored UI text, curriculum explanations and
instruction text use `/api/localization` with the existing OpenAI text provider,
falling back to Gemini. `OPENAI_TRANSLATION_MODEL` and
`GEMINI_TRANSLATION_MODEL` are optional overrides. Translation text is rendered
as plain React text, never HTML. Static core copy works without an AI provider.

Only published strings in `interface-sources.json` or the curriculum corpus are
accepted by the authenticated translation endpoint. Learner input and teacher
profile content are not sent for translation. Variable UI slots and exact
learning-language examples/forms are protected and checked before caching.
Course options in the target language, audio, transcripts and answer keys stay
original; English meaning options in non-English lessons can be translated for
display without changing their stored index. Assessment passages and questions
in the tested language remain as authored.

Server cache keys include locale, source, learning context, protection rules and
translation version. Source updates invalidate their own cache. The client has a
bounded cache; persisted settings and server translation cache survive restarts.
A pending or failed translation never blocks a lesson. A visible banner explains
when the original English is still shown and offers retry. Explanations are
labelled as AI translations. This is not a claim of human linguistic review of
all generated translations. Teacher-authored notes and learner submissions keep
their original language.

Tests:
- `node --test localization.test.mjs`
- `node localization-api.test.mjs` (in-memory database only)
- `node localization-render.test.mjs`
- `node curriculum-render.test.mjs`
- `npm run build`

`scripts/localize-interface.mjs` records the original migration and can wrap new
unmigrated JSX files. Keep `interface-sources.json` when extending it; add new
public source copy before requesting runtime translations.
