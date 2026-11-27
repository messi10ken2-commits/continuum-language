# Continuum World Phase 2 — learning integration

## Baseline and reuse

Base: production `788e6e05ac55c41b240b46c88552ad0377ceaf29` (previous full suite 670 pass / 2 skip / 0 fail). An isolated branch preserves the existing Tokyo renderer, both interiors, controls, RPG map, modes, classes, progress and admin.

World scenarios reuse speaking_sessions, the validated reply/review/real audio pipeline, private natural TTS, quotas/metering, time allowance, leases, turn/start idempotence and teacher sharing rules. No dependencies were added. World learning and NPC personal memory remain separate data models.

## Data flow

Practice → existing World → nearby NPC (or accessible place list) → server-authorized visit → existing speaking start/turn/audio/review → transactional World evidence and reward → learner Learning Memory and scoped teacher view. Optional class context requires an additional checkbox. World UI and dialogue are lazy loaded. Outside a dialogue there are no NPC AI calls.

Four NPCs/locations use A1–C1 scenarios. Four main, eight side and four rotating daily mission definitions each carry three practical communication goals. At least the first goal and two total goals must have exact learner quotes verified by the existing AI review validator. Keywords alone cannot complete a mission. Per-user mission/day reward keys prevent duplicate XP; no practice_attempts/course completions or paid balances are written. Main missions unlock the next story mission while all four original places remain freely explorable. XP/achievement state is server-owned; the companion reacts after a new award when returning to exploration, respecting reduced motion.

## Consent and memory

NPC memory defaults OFF. Enabling is explicit; each saved item also requires a visible confirmation of the exact authored interaction summary. Summaries refer only to fictional interaction topics; arbitrary user text, addresses, contact details, secrets and raw recordings cannot become NPC memory through this endpoint. Limit: five per NPC; expiry: 90 days. OFF deletes memories. Individual/all deletion and expiry clear private speech cache and increment the context revision. An immutable visit consent revision prevents stale sessions from restoring deleted items; a separate context revision cuts off old assistant history. Revocation during generation prevents the response from being committed. Old audio endpoints are invalidated after the context cutoff. No server memory-context cache exists. Expired entries cannot be used; an indexed bounded minute cleanup physically removes them and also runs for the current user on profile access.

Learning evidence, normal conversation history and user-confirmed NPC memories are distinct. Teacher evidence contains learning results only; it follows connected-learner, Japanese-language and self-study-sharing checks. The erasure schema manifest includes every new user FK with ON DELETE CASCADE. Provider JSON/text are treated as untrusted; no model output can choose another owner or write arbitrary memory. Provider calls have deadlines and disconnect cancellation, including voice turns.

## Validation and limits

Tests cover actual HTTP/DB authentication, class context → Japanese NPC → evidence, exact-quote verification, four locations/difficulties, microphone payload transport, ordinary speaking regressions, reward idempotence, consent OFF/ON, ownership, teacher language/sharing scope, deletion/revocation race and stale-session revival. UI QA uses synthetic AI responses in real Chromium/WebKit at 1280/390px: microphone denial → text completion, review, explicit memory save, revisit, deletion, Learning Memory and reload persistence. No real learner data or production provider credit is used by tests. Screenshots/results are CI artifacts. Full CI and deployment evidence are recorded in the PR.

New physical districts/facilities and persistent branching story expansion remain Phase 3. Current Phase 2 unlocks are mission/story progression and achievements within the existing four places. Physical iPhone mic/routing/performance and live-provider conversation quality require device/live-service review; synthetic tests do not establish these. Existing iPhone FPS is not re-labelled as measured.

## Rollback

Set CONTINUUM_WORLD_PHASE2_ENABLED=false: original local NPC dialogue/exploration remains, new World conversation/memory writes and audio are blocked. Previously saved learning evidence remains readable through the learner/teacher permission boundary. There is no destructive schema rollback. The prior production commit above remains the application rollback reference; new migrations only add tables/indexes.
