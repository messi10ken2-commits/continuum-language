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
