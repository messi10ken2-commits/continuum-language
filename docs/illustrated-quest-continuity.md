# Illustrated destination continuity

The previous reference-layout overrides hid the RPG scene and restored the photography header/navigation on facility screens. The illustrated learner now keeps a single world HUD, XP/goal/journal strip, illustrated backdrop and destination dock when opening Learn, Practice Studio, Memory, Classes and Level Test. Learn has a direct dock entry. Account deliberately retains the existing grouped settings layout, as requested. Teacher and photography layouts are outside the new `quest-continuity` scope.

The inner screens retain working React components, grading, audio, drafts, permissions and billing. Illustrated Studio has six distinct contextual images, a compact progress ribbon and a three-column desktop/two-column mobile grid. Memory opens its timeline and puts the detailed activity graph behind its daily-record disclosure. Its real evidence remains accessible. The owner membership preview remains in Account for illustrated owners, rather than preceding every destination. No fake appointments, scores or example users are introduced.

The train is now original painted rolling stock with visible roof, windows and bogies. An optimized transparent WebP replaces the flat SVG; its wheel baseline follows the existing per-language railway motion paths. Animation pause and reduced-motion handling remain. This is an illustrated 2D sprite, not a physically simulated 3D train.

## Original generated assets

Built-in image generation was used, followed by alpha trimming, cropping and WebP encoding for delivery. Assets are self-hosted; no remote image dependencies or copied proprietary assets.

- `public/rpg-media/commuter-train.webp`: three connected cream/silver carriages, violet/navy stripe, realistic watercolor/ink, elevated oblique roof view, horizontal axis, transparent background, no rails/scenery/text/logo. 1000 px wide, approximately 69 KB.
- `public/journey-illustrated/{conversation,pronunciation,vocabulary,listening,classes,library}-v2.webp`: six equal panels generated together in a 3-by-2 sheet, then extracted. Prompt: delicate detailed watercolor travel illustration, soft cream sunlight, sage foliage, muted lavender; café conversation, microphone/headphone desk, vocabulary bookshop, commuter station, teacher study room, academic library; no UI, typography or logos. Each image 720 px wide.

Reference compositions are adapted to real app data and narrow screens. The reference's sample teachers, appointment dates and decorative charts are not substituted for actual user data.

## Validation

- `npm run test:qa`: 334 passed, 0 failed.
- `npm run audit:interface`: 51 files, 1191 calls, 0 issues.
- `npm run check:runtime`: Node 24.22.1.
- `npm run build`: successful (existing bundle-size/lucide directive warnings).
- `scripts/qa-quest-continuity.mjs`: Chromium, Account and five quest destinations at 390 and 1440 px, world HUD/dock continuity, bounded content, loaded train and motion path, no browser errors.
- `scripts/qa-rpg-lessons.mjs`: see execution report; actual seeded lesson grading and Continue scrolling across four learning languages and mobile/desktop.

Physical Safari is not covered by the Chromium run.
