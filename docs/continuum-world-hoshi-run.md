# Hoshi Mart and running refinement

Hoshi Mart now has a dedicated interior rather than the café-shaped shared room. References guide its polished ceramic tiles, white linear ceiling lights, checkout/POS terminals, hot-food case, coffee machine, stocked double-sided gondolas, glazed refrigerator walls, freezers and entrance glazing. More than 1,000 individual products share an original 16-design packaging atlas with Japanese labels, food illustrations, nutrition panels and barcodes. The street window display uses the same goods with a smaller geometry set. Door sensor/rails, payment decal, bin cabinets and umbrella stand stay behind the established facade collider.

New solid fixtures have shared rendering/navigation footprints. A clear central route reaches the existing Ren interaction; both side aisles remain accessible. Only Hoshi Mart uses quarter-metre path cells, with line-of-sight waypoint reduction, so the companion can follow narrow aisles without increasing outdoor search cost. Old saves inside new fixtures return to the established safe entry.

The running cycle now includes a smooth heel-recovery/knee-drive flight path, coordinated arm swing, elbow bend, subtle pelvis/shoulder counter-rotation and bounded vertical weight transfer. Shoe vertices from the actual shipped rigs determine heel/toe compensation so the rolling foot does not sink into the pavement. Walking, reduced motion and the optional-model fallback remain supported. Movement speeds and input bindings are unchanged in this refinement.

## Validation and budgets

- Local: 33 World/interface/native-policy tests passed; production build passed. The kinematic test measures real shoe vertices in both shipped GLBs, checks ground clearance, planted walking support and a running flight phase.
- Layout test checks entry, central/side aisles, checkout interaction, new fixture collisions and safe saved-position recovery.
- Static outdoor: 161 draw groups / 65,578 triangles; bounded at <170 / <68,000. Hoshi interior: 42 / 31,326; bounded at <55 / <35,000. Café budget remains unchanged. Source-owned canvas atlases are cached and disposed with their scene. No new network art downloads or dependencies.
- Browser evidence covers the street storefront, full store, aisle, checkout, existing places and an eight-pose side-view running gallery. Final CI and production verification are recorded in the pull request.

The reference is a visual direction target. Physical iPhone quality/performance and Xcode compilation require device/macOS review. Phase 2 conversation, missions and personal NPC memory are unchanged.
