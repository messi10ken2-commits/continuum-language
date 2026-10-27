# Painted living map — approved design implementation

The approved October 27 preview is the visual reference. `public/living-map-v2` holds matched quiet/day/evening watercolor scene plates: stone station and railway on the left, central river and bridge, riverside café on the right, foreground garden and hillside village. All architecture is painted within the landscape; the prior flat vector scenery is removed. The map uses a portrait 5:7 scene ratio and real interactive route nodes above the artwork, retaining horizontal exploration, zoom and chapter selection. The same approved village style applies to all four learning languages.

## Completion criteria

Each selected language and CEFR level uses its full learning record through the existing `journeyChapters` function. Every activity must meet its authored pass mark before the chapter counts. One completed nonempty chapter reveals the station and painted train; two open the café; three add the cultivated garden; four crossfade to the approved warm evening landscape. Restored features are derived from real completion data and stay visible on return. Empty or partially completed chapters do not trigger restoration. No assessment level or companion eligibility is granted by these effects.

A visual-only, account/language/level-scoped local marker detects newly completed chapters and replays the scene transition, including later chapters after the fourth. Replay also runs on demand; pause freezes ambient motion. Reduced-motion preference displays the completed scene statically.

## Integrated motion

Soft masks reveal matching painted station, café and garden regions. The painted train has a short registered arrival shift along its existing track; painted flowers sway very slightly; steam rises from the locomotive and café. Evening light pulses and water shimmer stay within their painted locations. No vector building, generic train sticker or separate scenery strip is overlaid. These are lightweight image/CSS effects, not a generated video.

## Source assets

Built-in image generation extracted the standalone landscape from the approved mockup and produced matched daylight and quiet starting-state versions, preserving viewpoint and building placement. Prompts required removal of all UI, matching watercolor brushwork, a softly lit restored evening village, a daylight restored version, and a daytime closed-station/café version without train or cultivated flower beds. Assets are normalized to 1059×1485 WebP and their SHA256/versioned URLs are recorded in `manifest.json`.

Companion reward auto-scroll from the previous release is retained. Existing reward thresholds, sound gesture handling, navigation cleanup and Premium selection rules remain unchanged.

Validation covers model criteria, immutable image bytes/dimensions, four learning languages, progressive phases, raster loading, short train movement, replay/pause, reduced motion, responsive bounds and chapter selection.
