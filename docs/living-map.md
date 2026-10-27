# Painted living map — approved design implementation

The approved October 27 preview is the visual reference. `public/living-map-v2` holds matched quiet/day/evening watercolor scene plates: stone station and railway on the left, central river and bridge, riverside café on the right, foreground garden and hillside village. All architecture is painted within the landscape; the prior flat vector scenery is removed. The map uses a portrait 5:7 scene ratio and real interactive route nodes above the artwork, retaining horizontal exploration, zoom and chapter selection. The approved watercolor treatment, scene composition and interaction design are shared across four distinct regional worlds.

## Completion criteria

Each selected language and CEFR level uses its full learning record through the existing `journeyChapters` function. Every activity must meet its authored pass mark before the chapter counts. One completed nonempty chapter reveals the station and painted train; two open the café; three add the cultivated garden; four crossfade to the approved warm evening landscape. Restored features are derived from real completion data and stay visible on return. Empty or partially completed chapters do not trigger restoration. No assessment level or companion eligibility is granted by these effects.

A visual-only, account/language/level-scoped local marker detects newly completed chapters and replays the scene transition, including later chapters after the fourth. Replay also runs on demand; pause freezes ambient motion. Reduced-motion preference displays the completed scene statically.

## Integrated motion

Soft masks reveal matching painted station, café and garden regions. The painted train has a short registered arrival shift along its existing track; painted flowers sway very slightly; steam rises from the locomotive and café. Evening light pulses and water shimmer stay within their painted locations. No vector building, generic train sticker or separate scenery strip is overlaid. These are lightweight image/CSS effects, not a generated video.

## Source assets

Built-in image generation extracted the standalone landscape from the approved mockup and produced matched daylight and quiet starting-state versions, preserving viewpoint and building placement. Prompts required removal of all UI, matching watercolor brushwork, a softly lit restored evening village, a daylight restored version, and a daytime closed-station/café version without train or cultivated flower beds. Assets are normalized to 1059×1485 WebP and their SHA256/versioned URLs are recorded in `manifest.json`.

Companion reward auto-scroll from the previous release is retained. Existing reward thresholds, sound gesture handling, navigation cleanup and Premium selection rules remain unchanged.

Validation covers model criteria, immutable image bytes/dimensions, four learning languages, progressive phases, raster loading, short train movement, replay/pause, reduced motion, responsive bounds and chapter selection.

## Language-specific worlds

`LivingMap` receives the learning-language code explicitly from `IllustratedMap`. This selects a complete quiet/day/evening set through `livingMapTheme`; interface translation does not select the artwork. Unsupported codes fall back to the English set.

- English retains the approved riverside village artwork.
- Spanish uses a Mediterranean Spanish town inspired by the original Spanish map: terracotta roofs, olive/cypress planting, sea views and a regional train.
- Portuguese uses a Brazilian tropical hillside setting as requested: colourful colonial houses, palms, rounded coastal mountains, Atlantic bay and a yellow heritage tram. It supersedes the earlier Portugal-inspired map.
- Japanese uses a riverside Japanese town inspired by the original Japanese map: tiled wooden architecture, cherry blossoms, pagoda, Japanese station and a lavender local electric train.

All regional scene plates share the same station/café/garden/river locations for the existing animation masks. Electric trains and the Brazilian tram do not emit locomotive steam; café steam, movement, light and water effects remain active. Existing chapter thresholds, selected-level rules, account/language/level replay markers and reduced-motion behaviour are retained.

Nine additional scene assets were generated with the built-in image tool. Prompts used the approved evening composition and each original language map as references, required the corresponding local architecture/vegetation/vehicle identity, then produced aligned daytime-restored and quiet starting-state edits without changing scene geometry. All assets are normalized WebP at 1059×1485, with content hashes and versioned URLs in the per-language manifest. The prior English image paths are retained for cache stability.

Verification additionally checks distinct language themes, Brazilian/Japanese mappings, safe fallback, all twelve asset hashes and dimensions, and switching English → Japanese → English in one signed-in session without exchanging completion state.
