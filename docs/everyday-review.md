# Everyday language and deferred review

The v7 exercise contract adds 80 original conversational entries to 40 existing
lessons across English, Spanish, Brazilian Portuguese and Japanese, A1–C1.
Each entry has an original example, translation, usage situation, register and
pitfall. Regional slang is labelled rather than presented as universal usage.
Two extra tasks per entry cover contextual/listening interpretation and producing
a conversational phrase. Existing v2–v6 seeded attempts keep their question sets;
new sessions use v7. Existing chapter/checkpoint IDs and scores are retained.

Vocabulary review now offers context or dictation. Dictation uses the saved real
example (or word if no example exists), with the correct target locale. The text
is hidden before grading. The same question generator runs on the server; the
client cannot supply an answer key. Formula strings and oversized sentences are
excluded. Both modes share word strength and the existing 1/3/7-day schedule.
No new paid voice provider or recording licence is introduced by this change.

Ordinary lesson errors return once each after all first-pass questions, in their
original order. The score and weakness evidence use only first responses. A full
first-pass draft with errors can be saved and resumed; reopening during review
restarts that short review block. Checkpoints and level tests remain single-pass.

Validation: `npm run test:review`, `npm run test:review:browser`, content and
curriculum rendering checks. Browser tests use disposable data, no paid audio.

Usage references consulted (examples and explanations in the lesson are original):
- https://dictionary.cambridge.org/dictionary/english/no-worries
- https://dictionary.cambridge.org/dictionary/english/give-a-heads-up
- https://dle.rae.es/guay
- https://dicionario.priberam.org/grana
- https://dictionary.goo.ne.jp/word/やばい/
