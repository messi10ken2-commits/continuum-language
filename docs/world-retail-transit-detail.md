# World retail, Osaka and station detail

The expansion rooms now have authored shelves, stock and service fixtures instead of a common set of solid blocks. Aoba has 300 shelved books with original jacket/spine atlas art, a new-release display and two low display islands. Asahi has event notices, desk surfaces and a pair of meeting islands; the music room has keyboard keys and speaker cones. Akari has 54 cooking takoyaki, a steel griddle/extractor, menu prices, condiments and dining islands. The arcade has boxed souvenir stock with original packaging and produce displays. Furniture islands have matching ground collision rectangles, keeping the central service/exit route open.

The station ticket machines sit clear of the right-hand aisle. A signed, level route leads through ticket gates onto a covered platform and through an open Shinkansen doorway. The carriage has a blue waistline, recessed windows, luggage racks and seats. Tokyo-to-Osaka physical travel requires a walkable position inside that boarding doorway; talking at the counter no longer travels. Earned district locks are still checked by the server. List view remains the accessible travel alternative. Osaka's existing return counter is retained.

Osaka adds an Ebisubashi-labelled bridge, an original in-app Glico runner panel, a modelled suspended fugu advertisement and ten commercial fronts with awnings, lanterns, windows, menu strips and stock. Side elevations facing the river receive windows and fascia detail as well. This is a compact scene inspired by Dotonbori, not a geographic survey or a claim to reproduce the current real-world advertising inventory.

## Surface stability

- The old 10 m bridge overlapped the paving banks at the same height by 1 m on either side. The deck now ends exactly at the bank edge (8 m), at the shared 0.06 m surface height.
- Canal retaining edges are split at the bridge opening so a raised strip no longer crosses the walking route.
- The two station signs that previously intersected use separate wall bands. All expansion-room signs are checked pairwise for coplanar overlap.
- Ray tests cover the bridge centre and both approaches: exactly one opaque walking face at floor height and no raised retaining kerb.
- The existing recessed building slab fix remains in place.

## Validation

The Phase 3 browser walkthrough now walks from the hall entrance through gates onto the platform and into the carriage using keyboard input before pressing Board Shinkansen. It captures platform/boarding frames, then verifies Osaka rooms, day/night, reload persistence, return travel, Japanese/Arabic large text and a single retained renderer with two person decodes. Server tests reject counter travel and accept the actual boarding position. Model tests verify each segment of the transit path and reject carriage walls/track boundaries.

Static expansion scenes remain below 50 draw submissions per room and Osaka below 100, with batching and atlas textures. The old generic-room 12k-triangle cap becomes 24k for the authored retail/food fixtures; Osaka retains its 50k cap. These are geometry budgets, not a physical-iPhone frame-rate measurement. Physical iPhone heat, battery and VoiceOver need device testing.
