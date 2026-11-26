# Tokyo shop block — materials and street detail

The café/market block receives the concentrated art pass. This is a fictional Tokyo-inspired street, not a measured reconstruction of Shibuya or a claim of photorealism.

- Unmodified Poly Haven CC0 concrete colour, OpenGL normal and roughness scans. Source URLs and file hashes live in `public/world-tokyo/pbr/SOURCES.md` and its manifest. No external asset requests at runtime.
- Auto uses physically based surface lighting and the pavement/concrete normal maps. Its extra images total 868,521 bytes; Medium/High opt into all nine PBR images (4,022,253 bytes). Low retains Lambert surfaces without normal/roughness downloads. Auto/Low retain daytime baked building/tree shadows and night-specific visibility.
- Physical texture proportions on the large ground planes and primary front walls reduce stretched masonry and road grain.
- The two playable shopfronts gain tile plinths, recessed window frames/blinds/sills, condenser fans/grilles/brackets, downpipes, noren, original convenience-store bands, Japanese product/service/pricing signs and tenant boards.
- Flush stop lettering, stop line and pavement drains, with service cables above the walking area. New solid facade detail stays behind existing colliders. Entrances, exits, NPC interactions, the revised mobile HUD, user positions and course progress retain their existing behaviour.
- Static batching now combines different static shapes sharing the same material/shadow state while retaining instancing for identical geometry. Joint groups remain separate for actor animation. Merged geometry and shared textures are owned/disposed by the World.

Measured static outdoor scene: 123 draw objects and 56,016 triangles on Auto/Low; 118 / 55,982 on Medium. The static draw cap remains below 125; the triangle cap is 60,000. These exclude actors and do not measure physical-device FPS, GPU memory, heat or battery use.

Validation includes texture provenance/hash/download budgets, linear map decoding, neutral fallbacks, clone upload/disposal, Low quality fallback, collision/interaction invariants, Chromium/WebKit operation flows, close café/market day/night views, Medium physical surfaces, native CORS for named files only, real app entry and native build checks. Final results and screenshots are attached to the PR's CI run.
