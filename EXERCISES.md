# Expanded normal-lesson practice

New starts use `v2-<uuid>` seeds. The frozen `lesson-exercises.json` snapshot contains 3,025 questions across 224 normal lessons. English lessons have 12–20 questions, Brazilian Portuguese 12–27, Japanese 12–25, and Spanish 7–30. Vocabulary lessons practise all six entries through contextual completion, recall and phrase work. Expression lessons cover every entry in three passes. Grammar practice covers each reference-table row, example construction and authored applications/corrections using additional sentences.

`grammar-practice.mjs` contains the authored supplementary problems; `build-lesson-exercises.mjs` assembles these with reference-based exercises. Generated tasks use explicit model wording for constrained recall. Tile tasks are constrained model reconstruction, not free writing or a judgement that other grammatical word orders are invalid. Real speaking/writing submissions remain separate from objective practice scores. Listening entries retain audio with different toolkit examples.

The runtime reads the frozen snapshot, never regenerating an in-progress set from mutable reference content. Do not overwrite released v2 questions in future content updates: add a new version and retain this snapshot. `v1` continues to identify historical checkpoint sampling; unseeded normal-lesson answers retain the previous questions and keys. Existing lesson IDs and progress records remain valid. A saved old normal exercise displays an explicit button to restart with expanded practice; it is not silently replaced.

Every response is saved with its seed and scored through the same shared code on the server. Word-tile responses are stored as assembled text; tile shuffling is deterministic for a saved seed. Incorrect text answers show a model answer and explanation. Typed responses preserve meaningful accents; typographic apostrophes, character width, case and terminal punctuation are normalised.

Verification:

- `node --test expanded-exercises.test.mjs`: entry/table-row coverage, correct scoring, task diversity, stable seeds, old question keys.
- `node expanded-exercises-api.test.mjs`: long draft save/resume and complete submissions in four languages, with historical unseeded submissions still supported.
- `node curriculum-render.test.mjs`: all international lesson screens plus tile exercises and old-draft upgrade controls in all four languages.
- `npm run build`: production bundle.

Coverage checks establish that content is exercised, not that an exercise has been empirically calibrated. The objective practice score remains separate from assessed CEFR proficiency.
