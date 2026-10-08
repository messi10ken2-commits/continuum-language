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

All three returned valid official oEmbed metadata. The Japanese source is 24:06; learners are guided to start with 2–3 minutes and may watch the remainder optionally. The creator's informal “N6” title is not represented as an official proficiency level. Related phrases and eight questions per lesson are original Continuum language practice, explicitly not a source transcript or questions asserting personal facts about the speakers. Existing VOA lessons and their comprehension questions are preserved. Local photos are illustrative lesson covers, not video stills.

## A2–C1 video expansion (October 8, 2026)

`level-conversations.mjs` adds 16 specialist listening lessons: one each at A2, B1, B2 and C1 in Spanish, Brazilian Portuguese, Japanese and English. Every lesson has a different creator-hosted source, three open listening tasks, four original example phrases and eight independently authored language-practice questions (128 total). The questions are not represented as source transcripts or factual comprehension tests about the speakers. Open listening tasks ask learners to find evidence in a section they choose; they are not automatically scored. The stated CEFR band is the target for Continuum's tasks, not a publisher certification or a JLPT equivalence.

`level-video-sources.json` records the title, channel, source ID and date of successful official YouTube oEmbed verification for all 16 sources. Individual rights review remains pending, as discussed with the owner; technical embedding availability is not treated as rights clearance. No videos, audio tracks, thumbnails or transcripts were downloaded or rehosted. Existing local photographs are illustrative covers. Sources about 2024/2025 are explicitly framed as retrospective material.

| Language | A2 | B1 | B2 | C1 |
|---|---|---|---|---|
| Spanish | Morning routine · Easy Spanish | Compliments · Easy Spanish | Technology · Easy Spanish | Travel motives · Easy Spanish |
| Portuguese (Brazil) | Morning routine · Easy Portuguese | Future plans · Easy Portuguese | Reflections and expectations · Easy Portuguese | Goals and values · Carioca Connection |
| Japanese | Everyday exchange · Japanese with Shun | Travel · Japanese with Shun | Moving · Japanese with Shun | Subtext · Miku Real Japanese |
| English | Daily routine · BBC Learning English | Complaints · BBC Learning English | Art of conversation · BBC Learning English | Persuasive advice · TED / Celeste Headlee |

Validation: official source metadata for all 16; SSR introductions and practice views across all 450 activities; every language/level pair has one new video chapter; eight valid questions and correct/incorrect grading per added lesson; source credits, external fallback links, no autoplay, and source/task distinctions are preserved. Full end-to-end playback depends on YouTube and is not established by metadata or rendering tests.
