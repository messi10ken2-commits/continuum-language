# Continuous regional panorama maps

Each learning language uses one uninterrupted wide painted landscape across the complete scrollable map. The renderer creates exactly one `painted-panorama`, with full-canvas, nonrepeating image layers. It no longer duplicates a portrait scene per viewport. The station, village café and garden occupy different horizontal regions of one shared river, horizon and terrain.

## Worlds and assets

English uses the established countryside/village style; Spanish uses a Mediterranean coastal town; Portuguese uses a Brazilian tropical coastal neighbourhood and heritage tram; Japanese uses a riverside town, tiled wooden buildings, cherry blossoms and local railway. Region identity is selected by the learning language, independently of interface language.

Twelve new assets in `public/living-map-panorama` provide matched quiet/day/evening panoramas for four languages. The built-in image tool used the approved regional portrait scenes as stylistic references, recomposed each as a single wide landscape with one station on the left, a café in the middle and a distinct garden on the right, then made registered daytime and quiet-state edits. Prompts explicitly prohibited repeated or mirrored panels, seams, collage and UI. Entire images are normalized to 1920×896 WebP; no portrait tiling or side-by-side image stitching is used. SHA256 hashes, versioned URLs and per-world effect coordinates are recorded in the manifest. Earlier immutable assets remain available for older clients.

## Map layout and motion

The world spans at least three viewport widths. The authored chapter sequence is distributed across the available width, with 3–5 chapter nodes per region for current courses. All chapter buttons remain within the canvas. Drag, touch scrolling and zoom explore the same continuous scene; replay/pause controls are mounted at the viewport frame so they stay available at every scroll position and replay does not reset exploration.

Station, train, café, garden, steam, water and lamp masks are aligned to percentage coordinates in each panorama rather than repeated at every viewport. Four completed nonempty chapters still progressively restore the station (1), open the café (2), grow the garden (3), and crossfade to evening lighting (4). Completion uses each selected language/CEFR level's full learning record and authored pass thresholds. Existing rewards, assessment levels, companion auto-scroll and Premium rules remain unchanged. Replay markers stay scoped by account/language/level. Reduced motion shows a static completed scene.

Validation covers asset bytes/aspect/dimensions, chapter criteria, distinct regional selection and geometry for 8–25 chapters at multiple viewport sizes. Browser checks cover every restoration stage in all four languages, exactly one nonrepeating panorama, left/middle/right exploration, pinned controls, replay without a scroll reset, drag, zoom, last-chapter selection, language switching without progress leakage, reduced motion and narrow-screen bounds.
