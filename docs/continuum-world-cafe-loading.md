# Tokyo coffee bar, wider room camera and loading refinement

Komorebi uses an original coffee-bar facade with dark fascia, cream signage, a thin brass accent, warm entrance light and visible window seating. The dedicated room has timber counter slats, three menu boards, espresso equipment, a glass cake case, ceramic cups, eight chairs, tall street windows and slim brass pendants. It takes material/layout cues from everyday Tokyo coffee shops without using another chain's logo. Shared collision coordinates cover the seating and preserve the counter/NPC interaction route.

Both rooms use a 5.8m camera boom (previously 3.8m), 60° desktop/69° portrait field of view, ceiling limit and bounded entrance apron. Ground-level shelf collision no longer incorrectly pulls the elevated camera into the player. Player boundaries are unchanged. The camera still stays within side/back walls or the central entrance opening.

Loading changes:
- Build-time Brotli/gzip files for JavaScript/CSS and the two known World GLBs; request threads only select/stream a prepared representation. Native CORS and encoding variation are both retained. Media range behavior is unchanged.
- Two immutable public GLB byte buffers are retained (<4.1 MB), avoiding another fetch on re-entry. Decoded images, skeletons and GPU resources remain scene-owned and disposed. This is not an account/session data cache.
- Cloth normals are computed once per decoded model rather than once per actor clone; identical geometry is shared for the life of that scene.
- Procedural surface source canvases are cached only for 11 authored names. Scene-owned copies remain independently disposable. Warm scenes avoid thousands of painting calls; cold noise painting uses 6,500 rather than 26,000 rectangles per surface.

Measurements from the production build:
- Traveller GLB: 1,877,432 bytes identity → 1,601,972 Brotli.
- Resident GLB: 1,939,532 → 1,560,375.
- Combined model transfer: 3,816,964 → 3,162,347 (17.2% smaller).
- All generated JavaScript representations: 2,761,949 gzip → 2,128,547 Brotli (22.9% smaller). This is a representation-size comparison, not a claim that every chunk is loaded initially.
- Railway's preceding 1h showed average CPU 0.00022 and memory ~0.376 GB, without evidence of resource saturation. No paid infrastructure upgrade or database change was made.

Local targeted tests, actual static serving/decompression tests and build pass. CI records desktop/portrait coffee-bar views, both room camera distances, warm-cache behavior during a synthetic model outage, genuinely cold offline fallback, Chromium/WebKit interaction and full application regression. Final CI/release evidence is recorded in the pull request. Client/GPU timings are environment-dependent; physical iPhone smoothness and Xcode compilation remain device/macOS checks.
