# Visual learning, version 1

This release adds 269 silent, captioned recap videos, one for every regular lesson across Spanish, English, Brazilian Portuguese and Japanese. Checkpoints and level tests retain their assessment flow. There are also 20 new scene lessons (five per language, A1–C1), each with eight questions and a separate checkpoint. Existing lesson IDs, saved answers and grading contracts remain intact.

The recaps are authored educational slides, not live-action interviews, recordings of native speakers, or phonetic demonstrations. The interface labels them as captioned recaps with no spoken soundtrack. All examples and complete explanatory notes remain accessible in Explore and in the transcript. Clips never autoplay and are loaded only when requested. The HTTP endpoint supports byte ranges and HEAD for Safari playback and seeking.

## Photography

Photos are redistributed as contextual illustrations under the [Unsplash License](https://unsplash.com/license). They are not evidence for factual comprehension answers and do not depict the fictional speakers. Photo source IDs (prefix each with `https://images.unsplash.com/photo-`) are:

| File | Source ID |
| --- | --- |
| cafe.jpg | 1501339847302-ac426a4a7cbb |
| travel.jpg | 1436491865332-7a61a109cc05 |
| station.jpg | 1474487548417-781cb71495f3 |
| city.jpg | 1486406146926-c627a92ad1ab |
| work.jpg | 1522071820081-009f0129c71c |
| food.jpg | 1542838132-92c53300491e |
| shopping.jpg | 1441986300917-64674bd600d8 |
| study.jpg | 1513258496099-48168024aec0 |
| japan.jpg | 1540959733332-eab4deabeeaf |
| nature.jpg | 1441974231531-c6227db76b6e |
| home.jpg | 1484154218962-a197022b5858 |

Downloaded at width 960, quality 75; the video render crops a copy to fit a contextual image panel. No claim of photographer, model or brand endorsement is made.

## Rebuilding clips

1. Install Pillow and ffmpeg in the build environment.
2. Supply the variable Noto Sans JP font from [Google Fonts](https://github.com/google/fonts/tree/main/ofl/notosansjp) (SIL Open Font License). The font is used at weight 450 and is not distributed with the application.
3. Run `node scripts/export-lesson-media.mjs` from the repository root.
4. Run `python scripts/build-lesson-media.py /path/to/NotoSansJP.ttf`.
5. Run `node --test lesson-media.test.mjs` and `node lesson-media-render.test.mjs`.

Videos use H.264, yuv420p, fast-start MP4, 720×404 at 10 fps. Each example lasts six seconds. The manifest contains the exact duration, byte length and SHA-256 of every clip. Four server-only JSON bundles keep these bytes out of the browser's JavaScript bundle. Change the URL version before replacing publicly cached videos. Photos likewise require new filenames if replaced.
# Visual learning expansion (October 2026)

All lesson introductions, practice questions, checkpoints, level reviews and result pages now display a contextual photograph (conversation practice uses the video's photographic poster). Exercise photos are selected from the visible question prompt, with the lesson theme as fallback, never from the correct answer. Photos illustrate context and are not evidence for answers. They can be enlarged without leaving the lesson.

Two independent A1 English listening lessons, `en-conversation-v1-welcome` and `en-conversation-v1-neighbours`, use original five-minute VOA Learning English videos with human speech, teaching repetitions and on-screen captions. Each has eight original Continuum questions, a collapsible main-dialogue transcript, speed selection and a ten-second rewind control. The video remains available during each exercise. Existing saved lesson IDs and answers are unchanged. These specialist chapters are excluded from existing cumulative exam pools.

Source and credit:
- https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html
- https://learningenglish.voanews.com/a/lets-learn-english-lesson-2-hello/3113733.html
- https://learningenglish.voanews.com/p/6861.html explicitly permits educational and commercial reuse of VOA Learning English materials with credit, excluding third-party agency materials. These are VOA's own teaching productions. Their original credits remain visible. Poster images are frames from the corresponding videos.

Videos stream from the official VOA CDN, only when requested by the learner. No auto-play or synthetic replacement audio is used. An original-source link and dialogue transcript remain available if the external CDN fails. Availability depends on that CDN. The previous 269 silent visual recaps remain clearly labelled and unchanged. Spanish, Portuguese and Japanese do not gain human conversation videos in this release.

Validation: `node conversation-media.test.mjs`, existing media/course/render tests, production build, full decoding and audible audio-stream checks of both original MP4 files, and live browser playback. Higgsfield generation was unavailable (free plan, zero credits); no generated video was published.

## Additional native conversation videos (October 2026)

Spanish, Brazilian Portuguese and Japanese now have A1 real-conversation lessons in `multilingual-conversations.mjs`. Videos remain hosted by their creators and use the official YouTube embedded player; no video/audio files or paid transcripts have been copied. Attribution and a direct source link are always visible. Playback is user initiated, supports fullscreen, and uses the provider's own speed/caption controls. YouTube availability, ads and regional restrictions remain provider-controlled.

- Spanish: Easy Spanish, *Introduce Yourself in Slow Spanish | Super Easy Spanish 120* — https://www.youtube.com/watch?v=JsGQizTuPSo
- Brazilian Portuguese: Easy Languages, *Introduce Yourself in Brazilian Portuguese | Super Easy Brazilian Portuguese 7* — https://www.youtube.com/watch?v=3ggDuePqcAo
- Japanese: Japanese with Shun, *Super Easy Japanese conversation with @kensanokaeri* — https://www.youtube.com/watch?v=hySkqIAFRCs

All three sources use official embeds; local photos are illustrative covers, not video stills. Metadata availability does not constitute individual rights clearance.

## Source-only video comprehension — 2026-10-09

All 21 creator-video lessons now contain source-based comprehension only. The 152 independent language-practice questions and their unquoted example-phrase panels have been removed. `video-comprehension.mjs` supplies replacements grounded in public YouTube captions or the creator’s official episode transcript. There are 162 questions in total: 156 with contextual playback windows and six with an official transcript reference.

- Spanish, Portuguese and Japanese A1: eight video-content questions each.
- A2–C1: eight each, except Japanese C1 (four) and Portuguese C1 (six).
- The existing two VOA A1 sets and eight TED C1 comprehension checks are retained.
- Japanese C1 is explicitly an introduction-only check, 0:14–1:05. The available authored English subtitle track covers only that introduction. No claims are made about unverified later dialogue.
- Portuguese C1 uses the official Carioca Connection transcript at https://podcast.cariocaconnection.com/episodes/brazilian-blueprint-for-2025-with-carioca-connection-part-1/transcript. The transcript clock changes with podcast editions/ad insertion, so its times are **not** presented as verified YouTube times. Each question links to the official transcript with a section label.

The other new sources use public timestamped YouTube captions reviewed on 2026-10-08. Several are automatic captions: questions paraphrase clear content, avoid using recognition errors as language models, and provide context windows rather than claiming exact phrase onset. Full third-party transcripts are not redistributed. A future editorial pass should review original audio for finer alignment.

Video introductions and listening guides now focus on understanding the recording. Questions, answer explanations and optional full playback remain in the same lesson flow. All new exercise sets have `exerciseVersion: v3-video-20261009`; old drafts are ignored rather than reinterpreted against replacement question indices. The server rejects outdated draft/submission versions. Completed historical results are retained. New-version drafts resume normally.

Verification: all 450 activity introductions and exercise screens render; all conversation questions grade correctly; coverage is enforced for four languages and A1–C1; contextual player parameters and the explicit untimed-transcript exception are tested; old/new draft handling is covered. Production build passes.
