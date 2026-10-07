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
