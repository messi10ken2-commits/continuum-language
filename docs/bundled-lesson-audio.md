# Bundled lesson audio

This expansion adds 318 licensed human recordings and 396 pre-rendered studio recordings. Existing 17 Portuguese/Spanish human word recordings and 104 Japanese kana recordings remain available. The additional-language exclusive courses have 552 playable gallery/listening references, all covered by the bundled files, including Korean “지금 뭐 해?”. No live synthesis provider, AI cache or generation quota is needed for these references.

## Human recordings

The 318 additions contain complete source utterances with 180 ms leading and 320 ms trailing silence, converted to 24 kHz mono MP3 without pitch or rate changes. Every file has original/distributed SHA-256 checksums and individual source, author, licence and adaptation notes in bundled-audio-manifest.json. The corresponding audio bytes are in the server-only bundled-audio-data-*.json packs. The adapted recordings retain their individual licences; no endorsement is implied.

Sources include Association Shtooka/WimsEdu packs, mirrored at fsi-languages.yojik.eu, and Wikimedia Commons. Shtooka Chinese and German packs use CC BY 2.0 France; the French, Italian, Arabic, English, Spanish and Portuguese packs use CC BY 3.0 US. Wikimedia files retain their individual CC BY/CC BY-SA licences. Ambiguous pronunciations and files with incomplete licence metadata are excluded.

Coverage by locale: zh-CN 104, pt-BR 54, es-MX 39, en-GB 35, fr-FR 29, en-US 20, it-IT 16, de-DE 11, ar-SA 10. Speaker regions are shown as declared in source metadata; inconsistent archive country tags are not used as evidence. Mexican Spanish is not substituted for Spain Spanish, or British English for US English. These locale-specific recordings are used only for exact matching requests. This expansion does not add Korean or Japanese full-word human recordings.

## Studio recordings

The remaining 66 distinct exclusive-course utterances in each of Chinese, Korean, French, German, Arabic and Italian were generated through Artlist using MiniMax Speech 02 HD and the Bright multilingual voice. The 396 files are explicitly labelled AI studio voice, never human. Generation IDs and source time boundaries are retained in the manifest. Each language batch contained explicit three-second separators; 65 detected pauses separated 66 utterances, preserving their original order and complete speech with silence margins. Generated files are distributed for this project under the connected Artlist account's applicable terms, not under the human recordings' Creative Commons licences.

These are standard-language models, not authenticated regional speakers. Regional counterparts without a verified local recording retain their existing text/publisher-reference presentation; no Busan, Hakka, Swiss or other regional accent is fabricated.

## Playback and access

Exact NFC-normalized text and locale select recordings. Accents, punctuation and case remain significant. Human recordings take priority over generated audio. Bundled audio is served before database/cache/provider work. Premium authentication and membership checks still run before serving private course audio; those responses use private, no-store. Audio bytes and the private transcript manifest are excluded from browser bundles. The public human metadata index contains only 237 recordings whose text is already in public curriculum.

The player shows recording type, bundled delivery and individual human attribution. It retains explicit device fallback and playback recovery. Other sentences may still require live AI generation; this does not repair provider credentials or quotas and does not claim every lesson utterance has a human recording.

Validation covers checksums, MP3 decoding and audible signal for every file; all 552 exclusive references with provider/cache/quota calls forbidden; authenticated/unauthenticated course access; exact locale/diacritic matching; browser-bundle exclusion; and Chromium/WebKit playback recovery. Signal checks do not constitute independent native-speaker review of every utterance.

## Ordinary lessons and exclusive context buttons (November 1 follow-up)

The earlier expansion covered exclusive galleries and listening questions, but the shared reference component still sent exclusive context examples to `/api/speech`. That public endpoint correctly rejects private transcript text. Reference buttons now resolve the exact existing protected gallery endpoint through `premiumReferenceAudioEndpoint`; an unmapped private reference renders as text without sending a public request. Existing Premium authentication, membership checks, strict frame indices and `private, no-store` responses remain in effect. This fixes the Italian examples containing “acqua in bocca”, “ho preso un granchio” and “ho la testa fra le nuvole”, together with the same reference path in every course language.

A further 1,199 pre-rendered AI studio clips cover ordinary lesson words and expressions across all ten learning languages: 120 each for Spanish, Japanese, Portuguese, English, Chinese, Korean, French, German and Italian; 119 for Arabic. They include the reported Portuguese “às vezes”. These are **AI studio voices**, not human recordings. Existing human recordings retain playback priority. Live-generation coverage remains incomplete for other sentences; the provider's credentials or quota have not been changed.

The new records carry `collection: ordinary-lessons-v1`, engine/voice, generation ID, source boundaries and audio checksum in the server-owned manifest. The batches used explicit three-second separators; each contained 120 utterances and 119 verified intervening pauses. Full speech with leading/trailing silence is preserved. One ambiguous unvowelled Arabic word, من, was excluded from serving without context. All clips use MiniMax Speech 02 HD / Bright through the connected Artlist account and its applicable terms, consistent with the earlier studio files.

The curriculum scan checks the real speech parts used by ordinary galleries, vocabulary, expressions, examples and listening models in every language. Regression checks cover 198 additional-language exclusive context examples through their protected API, rejection of anonymous/free requests with live providers disabled, the Portuguese phrase, all new clips without provider/cache/quota calls, checksums/decoding/speech signal, and private asset exclusion from production JavaScript. Chromium and WebKit checks click the actual Italian reference buttons and verify protected playback rather than testing only the gallery component. This is not a claim of independent native-speaker review of every generated pronunciation.

## Complete authored curriculum coverage (November 1)

The exhaustive audit covers 15,617 distinct ordinary lesson playback targets across ten languages and 1,634 protected exclusive-course, regional-wording and Premium Practice Studio references, with zero missing saved recordings. It includes full example sentences, complete exercise banks and transfer pools, feedback, tables, sound/script studios, free workshops and resumable archived lessons. The reported Spanish “De vez en cuando cocino con mis amigos.” and Portuguese “Às vezes trabalho em casa.” are served directly from bundled MP3 files with live providers disabled.

The complete index contains 16,448 clips: 399 licensed human recordings and 16,049 explicitly labelled AI studio clips. The existing 17 human word clips and 104 kana clips remain available outside this index. New standard-language studio files use Supertonic 3, preset F3, eight synthesis steps and deterministic seeds, under the included model licence. Chinese clips and selected British/Australian English styles use MiniMax Speech 02 HD / Bright via Artlist, retaining generation IDs and verified segment boundaries. These assets are not described as human recordings.

Regional Spanish and Portuguese wording without a verified regional speaker is explicitly labelled as a standard-language studio voice; native-speaker references remain available for the regional accent. Reference-only unverified regional pronunciations have no synthetic button. English instructions use English voice routing; authored Spanish workshop questions retain their Spanish locale, and phonetic/transliteration annotations no longer become foreign-language review audio.

The server lazy-loads bounded audio packs and serves saved clips before database, quota or provider calls. Premium task prompts/models use authenticated private endpoints. Full text inventories and audio remain server-only. The coverage gate invokes actual speech serving code with cache, providers and quotas forbidden; integrity checks cover every checksum, MP3 decode, duration and audible signal. These checks do not constitute independent native-speaker pronunciation review. Dynamic AI conversation still uses live synthesis.
