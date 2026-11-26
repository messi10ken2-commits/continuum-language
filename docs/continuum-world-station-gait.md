# Tokyo station and locomotion refinement

The former shop-shaped Asahi station is replaced by a dedicated glazed concourse with columns, ticket machines and gates. The street meets a paved forecourt and planted oval traffic loop with bus/taxi shelters, crossing, tactile route and lane paint. Behind the gates, stairs lead to a raised platform with canopy and tactile edge; two ballasted tracks include sleepers, rails, overhead supports and wires. The second track is a passing track, not a second passenger platform. The station remains an outdoor information point; boarding and station interiors are outside Phase 1.

A shared station layout drives the central island, rail site, shelter and new street-tree collisions. The minimap supports elliptical island obstacles. Existing destinations, café/market entry and exit, four NPC greetings, saved exploration and companion routing remain in place. Sidewalk curbs/drains end before the forecourt rather than cutting across the rotary.

Walking is 1.55 m/s and running 4.2 m/s with bounded acceleration/deceleration. Facing follows actual displacement when sliding against obstacles. Actor/contact-shadow height follows visible road, plaza and interior surfaces. The real CC0 skeleton now uses actor-relative bone rotations, distance-driven stance/swing cycles, two-bone leg IK, pelvis reach compensation, flat support feet, lifted swing feet and opposing arm swing. Source rig coordinate systems and initial actor headings are accounted for. Reduced motion returns the rest pose; optional GLB failure retains the existing playable fallback.

## Verification

- Local: 32 World/interface/native-policy tests passed; production build passed.
- New CPU tests load both shipped GLBs, measure planted support feet and swing clearance through walk/run transitions, verify rest/reduced motion and finite coordinates.
- New model checks cover station routing, island/shelter/rail-site blocking, information interaction, movement acceleration/stopping and ground heights.
- Static outdoor budget capped at 150 draw groups / 68,000 triangles (previous cap 125 / 60,000), including station and six additional street trees. No additional downloaded art or dependencies. Existing nearest-three night-light budget remains.
- First CI pass: 21 real Chromium scene captures passed, including station/day/night/platform and walk/run; the application unit/API suite passed. Final revision adds the road apron and platform lighting and corrects the control harness to click the existing current-state “Walk” button when enabling running. Both revisions passed all 21 render captures. The software-GPU quality switch exceeded the original 20-second action timeout after applying Low; control QA now retains actionability checks with a 90-second GPU-reset allowance. Art and control/native jobs run independently to expose failures sooner. Final verification is recorded in the pull request.

The reference image remains an art direction target, not a claim of visual parity. Physical iPhone motion/performance still needs device review. Phase 2 AI conversation and personal memory are unchanged.
