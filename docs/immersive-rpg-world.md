# Continuum adventure world

The existing Illustrated world preference now opens a separate full-screen learning RPG presentation. Photography remains the default and retains its dashboard/navigation. The two options use the same authenticated application state, curriculum, drafts, server grading, teacher access, subscriptions and learning records. Onboarding and teacher/admin workflows retain their existing presentation. An owner-only Admin control stays in the game dock; the actual console opens in its original operational interface.

## Play

- The complete town is the scene, rather than a map inside an overview card. On desktop the default camera fits the whole world. Mobile starts with an explorable close view; Fit map and the live minimap show the entire town. Drag, wheel, pinch and keyboard arrows control the camera. Buttons and the quest journal provide keyboard access to all destinations.
- Tap a path, use W/A/S/D, or the directional controls to move the traveller through a connected, weighted road graph. Actual animation-frame movement follows the drawn curved road segments. Interrupted travel cancels its arrival callback, including repeated clicks or choosing a different destination. The traveller uses a transparent four-frame walking sprite, facing changes, a ground shadow and fading footprints.
- Every chapter beacon maps to the existing active curriculum and exposes every real activity. Every CEFR course band remains freely selectable; no new prerequisites or paywall bypasses are added. Choosing a course level does not change assessment evidence. Returning from a report/profile picks up the chosen course band.
- The practice café, memory library, teachers’ guild, observatory and traveller’s lodge lead to actual Practice Studio, learning memory, class workspace, level test and Account. These use in-world windows, not a second database or fake demo. The dock provides immediate access without needing to walk.
- Adventure XP awards 20 points per distinct real passed exercise, once, with imported/invalid scores excluded. Rank increases every 100 XP. These are game progress, explicitly separate from assessed CEFR. Existing records count; repeated submissions cannot farm extra XP for the same lesson. Daily study time uses the existing active-study service, never time spent moving around the town.
- Clouds, train, river highlights, birds, beacon lights and trails animate. World motion can be paused and that preference is saved per account in this browser. Reduced-motion preferences disable automatic visual animation and use instant traveller movement. Background world animations pause inside learning windows and in hidden tabs. Native exercise audio and recording are untouched.
- Escape closes game help/journals or returns from a window; it leaves text inputs and native dialogs to their own keyboard handling. Switching world style during a question keeps the same mounted lesson, selected answer, seed and score. Game windows scroll internally; Continue reveals the question within that viewport. Photography retains page scrolling.

## Assets

Original generated artwork is locally hosted at `public/rpg-media/`: four language towns plus `traveller.webp` and `traveller-walk.webp` (approximately 2.6 MB combined, loaded on demand). Source PNGs are converted to WebP while retaining alpha for the traveller. No new runtime dependencies.

Built-in image-generation prompt set: full-bleed high-angle 55-degree watercolor RPG overworld, whole town filling the landscape with no empty sky; warm ivory/sage/lavender palette; looping paths, river bridges, café, bookshop/library, school, guild and station; no text, labels, UI or markers. Japanese hillside town/cherry trees/commuter railway; English riverside stone village; Spanish Mediterranean terracotta town; Portuguese pastel riverside town. Traveller: original adult explorer, lavender jacket, cream trousers, brown boots, sage backpack and journal, transparent background. Animation: same character identity in a precisely aligned 2×2 transparent walking-pose sheet. Reference concepts guide atmosphere; UI, destinations, paths and data remain real interactive elements.

## Verification

`npm run test:qa`, `npm run build`, `npm run check:runtime`, `npm run audit:language`, `npm audit --omit=dev`.

`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs QA_BROWSERS=chromium,webkit npm run test:rpg:browser` covers four-language towns, 320/390/1440px layout, camera controls, road movement, every destination window, active-question continuity across styles, motion pause persistence, reduced-motion and keyboard exit. The prior `test:illustrated:browser` command points to this current suite.

`PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs QA_BROWSERS=chromium,webkit node scripts/qa-rpg-lessons.mjs` verifies real seeded grading and Continue inside the fixed quest window for all four languages at 1280/390px. Existing `qa-journey`, `qa-learner-navigation` and `qa-lesson-session` cover unchanged photography, teacher, owner and signup flows.

No production accounts, charges, migration, secrets or Railway configuration changes are required.

Release checks executed: 326 automated tests passed; Chromium and WebKit both passed the complete world suite and all four-language quest-window Continue checks at desktop/mobile sizes. Photography journey/signup, normal-page Continue, and learner/teacher/owner navigation regressions also passed. Touch verification uses real browser touch input; Chromium additionally exercises native two-finger pinch. Linux browser test dependencies were downloaded and extracted into an isolated temporary directory; no production dependencies or environment settings changed.
