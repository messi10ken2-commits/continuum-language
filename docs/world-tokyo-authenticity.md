# Tokyo World visual refinement

The World remains an authored Tokyo-inspired district. It is not a geographic or photorealistic reproduction of Shibuya.

- People: retained licensed CC0 face/hair rigs, replaced stiff collars with travel T-shirts and exposed forearms, added woven bump UVs and restrained folds, shaped the neckline, connected cuffs to shoes with blended ankle cloth. Upper-body breathing and independent gaze leave stationary feet planted. Existing distance-based IK walking/running remains intact.
- Companions: all eight species use full-body Light-inspired colors, rounded organic heads/bodies, purple wheat scarves, travel packs, blankets and buckles. Independent blinking, breath, ear/head/tail motion and pack follow-through; speed-smoothed alternating steps and flat stance feet. Reduced motion restores a stationary pose.
- Street life: two residents on Low and four otherwise; authored clear sidewalk routes, smooth starts/turns, endpoint pauses and yielding near player/companion. Only the existing two immutable model downloads are reused; each actor owns its skeleton.
- Night: original upright Japanese illuminated sign atlas, magenta/cyan accents, warm/cool occupied windows, mounting brackets and colored storefront spill. Lighting respects the existing nearest-three-light limit. Emission changes on shared materials survive static batching and reset for daytime. Shop signs sit in front of their actual facades. No full-screen bloom or flashing signs.
- Town: roof-height downpipes, overhead service wires, mixed occupied/dark rooms and skyline depth. Fixed transparent foliage caching so revisiting the World does not create opaque gray tree cards.

Budgets are guarded by the existing tests: outdoor static scene under 170 draws and 68k triangles, each character under 14k triangles and both self-contained GLBs under 4.1 MB combined, each companion under 7.5k triangles at default quality. New sign canvas is one 1024-square atlas. Scene-owned textures, materials, geometry and independently animated skeletons are released on exit.

Validation includes geometry/resource checks, real shipped-rig foot placement, crowd route traversal/yielding, merged-material day/night switching, rendered desktop/mobile street/interior captures, eight-companion and front/back/walking human galleries, browser controls/lifecycle tests, and native integration checks. Software-rendered browser frame rates are not device performance measurements.

Rollback: revert this PR and redeploy the previous main commit; no DB migration, account data change or curriculum progress change is introduced.
