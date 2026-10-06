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
