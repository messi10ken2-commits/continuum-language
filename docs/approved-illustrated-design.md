# Approved illustrated mobile design

The illustrated learner layout now follows the approved mobile watercolor screens: a small brand/language/account header, scenic page introductions, navy type, violet actions, white rounded panels, and five persistent navigation destinations. Lesson practice uses a focused screen with progress and Save & exit. Photography and teacher layouts retain their existing structure.

Overview contains live consistency metrics, a pannable course map, memory/test shortcuts, and activity totals. Learn uses a resumable lesson and expandable chapters instead of stacked promotional panels. Practice Studio has six illustrated actions. Memory uses one expandable timeline with real scores, dates, categories, lesson images and attempt history. Assessment has the illustrated entrance and skill report, keeping the original detailed report available. Classes use actual teacher information, a week calendar and functional messaging/scheduling actions. Existing account settings remain available, including switching layouts.

## Artwork

`public/illustrated-lessons/manifest.json` records the 55 WebP assets, source hashes, sizes and reference crop coordinates. This includes 48 new scenes (12 settings in each of four learning languages), six artwork crops from approved references, and an original map landscape recreated from the approved overview. No fabricated user records, grades, teachers or appointment data are embedded in artwork. Lesson setting selection ignores answers and scores. Images load locally and lazily; the full set is approximately 2.9 MB.

Preparation: `node scripts/prepare-approved-illustrations.cjs` requires original generated atlases/references beside the repository and a development installation of sharp. Runtime deployment uses the committed WebP files and needs no image generation service.

## Verification

- Production build and interface/content audits.
- Full existing unit/API/render suite, plus artwork hash/size/provenance, answer-independent mapping, reviewed translations, and basic/detailed report boundary tests.
- `scripts/qa-approved-design.mjs`: built frontend, disposable database/accounts, 320/390/768/1440 widths in both layouts, illustrated navigation persistence, no horizontal page overflow, lesson introduction/question artwork, save/exit, Practice Studio reveal, populated teacher/class messaging and saved assessment report.
- Screenshots compared with approved mobile previews. Live records replace the previews’ illustrative data; empty states and required consent remain visible. Browser checks use headless Chromium, not a physical iPhone or Safari. AI provider calls and checkout were not exercised by this visual change.

Run browser checks with `PLAYWRIGHT_MODULE` and `QA_BROWSER_EXECUTABLE` if Playwright/Chromium are not installed locally.
