# Continuum World Phase 3 — Tokyo buildings and Osaka

The original six buildings within the playable Tokyo block now have navigable rooms and NPC activities. The distant skyline is scenery beyond the movement boundary. Existing café/market access, the outdoor station guide, park and earlier learning progress remain available.

| Place | Opens after | Activity |
| --- | --- | --- |
| Komorebi Café / Hoshi Market | Existing access | Orders, preferences and purchases |
| Asahi station concourse | `station-route` | Ticket advice and, later, fictional travel planning |
| Aoba Bookshop | `park-meet` | Reading recommendations and comparing books |
| Alley Music Room | `book-find` | Workshop choices and music preferences |
| Asahi community building | `music-rehearse` | Plan an exchange event and clarify arrangements |
| Osaka · Akari Canal | `station-journey`, following `asahi-plan` | A new canal/bridge shopping district |
| Akari Takoyaki / shopping arcade | Osaka unlocked | Flavours, shopping plans and optional local expressions |

There are 10 main, 15 side and 11 daily mission definitions, with two eligible daily variations shown at a time. Course completions and membership rules are unchanged. Awarded evidence, not accumulated daily XP or NPC-memory consent, unlocks places. The original four main missions retain their IDs and awards.

## Shared data and scene contract

`continuum-world-districts.mjs` holds IDs, outdoor scenes, new locations, room collision layouts, requirements and allowlisted story choices. Tokyo storefront geometry and collision now consume the same location definitions. Osaka supplies one lazy outdoor scene adapter; movement, camera, actors, interiors, missions, voice, learning records, accessibility and resource lifetime are shared. Adding a district does not require copying an application or conversation API.

Tokyo and Osaka share the existing exploration save namespace so a user resumes their last place without losing the previous save. Scene IDs identify the district. A locked saved scene is returned to the initial Tokyo spawn when the profile is loaded. Backend visit and travel validation independently enforces earned mission requirements; the places list is the explicit accessible alternative to physical proximity.

Travel departs from the station counter in 3D, or through list view. Osaka returns via the shopping-arcade information counter. These are fictional scene changes, not real transport reservations or purchases.

## Story, NPCs and privacy

Reading interests and an Osaka activity preference are explicit fixed story choices, persisted in `world_profiles.story_choices`. They can be changed after the relevant achievement. The prompt receives only these allowlisted fictional choices, current mission, level, activity variant and visit time. Introductory Japanese remains short at A1; longer levels can hear today's activity. Day/night selection is recorded as `world_visits.world_time`, so greetings and context match the chosen world time. Outdoor pedestrians thin out during quiet hours without creating more AI requests.

The travel journal uses existing owner-scoped learning events. Relationship activity counts derive from awards and are shown only while NPC memory is enabled. Personal familiarity still requires separately confirmed, consented NPC summaries; game choices do not authorize invented memories. Memory remains off by default, with the same per-NPC five-summary/90-day bounds and revocation/deletion rules. Owner memory listings accommodate all ten NPCs. No recordings or freeform personal facts are stored as new story state.

Schema changes are additive, defaulted columns. User deletion cascades through the existing profile/visit ownership keys. No progress migration, new payment entitlement or real-world transaction is involved.

## Side-wall stability

The reported bright, moving seam coincided with a floor slab edge sharing the opaque exterior wall plane. Shared storefront geometry recesses slab edges four centimetres, including the bookstore and other existing buildings. This removes the coplanar overlap rather than hiding it with a global depth-test override. Geometry ray tests verify separate hit depths at the seam across all existing building dimensions. Browser evidence includes three close wall angles. Existing shadow, render-density and triangle budgets remain enforced.

## Verification and evidence

- `node --test --test-concurrency=2 continuum-world-*.test.mjs`: navigation and unlock chain, profile ownership, real PostgreSQL-compatible migrations, actual server conversation reviews, idempotent awards, memory-off learning records, story-choice persistence after login, travel proximity, selected nighttime greetings and GPU-resource budgets.
- `node scripts/qa-continuum-world-phase3.mjs`: real Chromium/WebKit phone and desktop UI. Initially locked buildings, six new interiors, NPC identity, canvas/model reuse, saved choices, Osaka round trip, daylight/night, wall angles, Japanese/Arabic and large text. CI archives screenshots and per-room software-browser mount/render/geometry metrics under `continuum-world-phase3-evidence`.
- Existing World, Phase 2, art/gait/character, native and full application CI continue to be required. Local baseline before edits was 46 World tests passing.
- New geometry ceilings: each expansion room below 50 static draws / 12k triangles; Osaka below 100 static draws / 50k triangles. The original Tokyo ceiling remains below 170 / 68k. Character assets are unchanged and the open-World pool still decodes only two templates.

Software-browser measurements are not iPhone device guarantees. Physical iPhone heat, battery, microphone/audio routing and VoiceOver measurements still require a physical device; CI validates the shared web paths and Capacitor build separately. No App Store submission is included.

## Rollback

Revert the release commit and redeploy. Leave the two additive columns in place; earlier code ignores them. Do not remove earned awards or learning evidence. The existing World feature flag can hide the entry, and the server conversation flag stops new conversations while retaining privacy deletion controls.

## Osaka return station

Osaka now has an enterable Akari Osaka station at (17,14), door (17,20.5), immediately available with `station-journey`. Its ticket gates, platform and Tokyo-bound carriage share the Tokyo station collision contract. The optional return-route conversation does not gate departure. In 3D the district Travel button selects the local station; in list view it still travels directly. Both physical directions use the matching train doorway. The legacy Osaka arcade counter return remains accepted for cached clients.

The return regression tests reproduce arrival at 8/10 main missions, walk from the Osaka bank through the station into the train, reload inside the train, then board for Tokyo. List-view travel is also tested in both directions.
