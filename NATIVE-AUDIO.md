# Kana recording attribution

Human speech recordings: **FUN Japanese Learning** (<https://funjapaneselearning.com>).
Distributed by **Arsalan Anwari**, *Kana Sounds*:
<https://huggingface.co/datasets/arsalan-anwari/kana-sounds>.

The dataset states that its recordings are licensed under **Creative Commons
Attribution 4.0 International**: <https://creativecommons.org/licenses/by/4.0/>.
No endorsement of Continuum is implied.

The 104 basic, voiced, semi-voiced and contracted sound recordings serve both
hiragana and katakana (208 glyph strings). Source paths appear in
`native-kana-map.mjs`; SHA-256 checksums of the original MP3s appear in
`native-kana-checksums.json`.

Adaptation: decoded and resampled to 24 kHz mono, repeated twice with 180 ms
leading silence, a 700 ms inter-recording pause, and 320 ms trailing silence,
then encoded as 64 kbps MP3. Existing silence in the original is retained.
No phoneme is trimmed, stretched or pitch-shifted. The optional 0.85× player
uses pitch-preserving playback. `native-kana.json` stores the adapted MP3s as
base64, loaded only on the server; they are never shipped in the JavaScript bundle.

The API selects these files before its AI cache or provider limits. No speech
provider or database call is required for the recordings. The player identifies
them as “Human recording”; other curriculum audio remains explicitly labelled
“AI studio voice”. A recording label does not constitute phonetic expert review.


## Portuguese and Spanish pronunciation recordings (native-words-v1)

These are recordings of human speakers, not generated speech. Exact NFC text and locale are matched; accents are never stripped. The server serves bundled copies before looking up generated speech, so provider quotas do not block these recordings.

The complete per-recording attribution, source URL, license URL, original SHA-256, distributed SHA-256 and adaptation notes are in `native-word-map.mjs`. Distributed audio is in `native-words.json` as base64 MP3. Each adapted recording retains its individual source license, including CC BY-SA where applicable; these licenses apply to the recordings, not to unrelated application code. No endorsement is implied.

- **pão (pt-BR)** — Izaias Rodrigues / Association Shtooka; Belém, Brazil. [CC BY 3.0 US](https://creativecommons.org/licenses/by/3.0/us/). [Original source](https://fsi-languages.yojik.eu/audiocollections/archives/por-balm-izaias_flac.tar.xz). Excerpt from “o pão”, starting at 0.44 s (after the article, before the p release); original word ending retained. 180 ms leading and 320 ms trailing silence; mono MP3 conversion.
- **mão (pt-BR)** — Myriam Dechamps / Bernadette Perrin-Riou / WimsEdu; São Paulo, Brazil. [CC BY 3.0 US](https://creativecommons.org/licenses/by/3.0/us/). [Original source](https://fsi-languages.yojik.eu/audiocollections/archives/por-wims-voc_flac.tar.xz). Full standalone recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion.
- **pero (es-ES)** — Precision27 / Lingua Libre; Spanish; region not specified. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0). [Original source](https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Precision27-pero.wav). Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.
- **perro (es-ES)** — Millars / Lingua Libre; Spain. [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0). [Original source](https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Millars-perro.wav). Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.
- **rojo (es-ES)** — Rodelar / Lingua Libre; Spanish; region not specified. [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0). [Original source](https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Rodelar-rojo.wav). Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.
- **papa (es-ES)** — Millars / Lingua Libre; Spain. [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0). [Original source](https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Millars-papa.wav). Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.
- **papá (es-ES)** — Marreromarco / Lingua Libre; Spanish; region not specified. [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0). [Original source](https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Marreromarco-pap%C3%A1.wav). Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.

Portuguese provenance: the por-balm-izaias package identifies Izaias Rodrigues’s language region as Belem and its license as CC BY 3.0 US; pão comes from `por-2950284e.flac` (o pão). The article ends before the 0.44 s excerpt boundary; the p release and entire vowel/tail remain. The por-wims-voc package identifies Myriam Dechamps’s language region as São Paulo, Brazil; mão is the complete standalone `por-23c64b38.flac`. Both packages explicitly license teaching reuse. No pitch or speaking-rate change is baked into the files.

Coverage is selected words only: pão, mão, pero, perro, rojo, papa and papá. Other words and full sentences retain their existing labelled audio path. Speaker regions not established by source metadata are explicitly unspecified.
