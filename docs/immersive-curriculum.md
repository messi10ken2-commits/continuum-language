# Integrated immersion curriculum

## Scope and learning contract

Ten learning languages each receive two B1, three B2 and four C1 chapters:
90 chapters, 360 lessons and 2,160 authored questions. Every chapter follows
Reading → Listening → Immersive conversation → Chapter checkpoint. There is no
standalone writing stage. The new IDs use `LANG-immersive-TOPIC-v1-STAGE`.

The nine cases cover a neighbourhood market, evening library access, tourism,
flexible work, food surplus, urban heat, digital archives, transport evidence
and heritage governance. These are original fictional case studies, with an
article followed by an interview that clarifies or revises parts of the plan.
They are not real reporting or licensed documentary footage. The interface
identifies that provenance and synthetic studio narration explicitly.

Reading passages, listening scripts, roleplay lines and spoken response options
are authored in the learning language. Comprehension instructions, explanations
and paraphrase options use the existing selected-interface-language localization
system. Native utterances are protected from interface translation. Fixed new
UI copy covers all ten supported interface languages; these differ from the ten
learning languages (Indonesian/Russian UI; German/Italian learning content).

Standard presents the full article and full recording, with individual parts
available. Light presents six manageable source windows/questions in one run;
its checkpoint is included. Five of six first-attempt answers are needed to
meet the existing ≥80% threshold. It does not restore historical multi-round
practice. New chapters are optional branches in Light, with their internal
stages ordered, and do not lock old lessons. Historical lesson IDs, relative
ordering, grading versions, accounts and saved records remain intact.

The conversation lesson combines guided decisions and an optional live AI
conversation using the chapter's canonical language, level, goals and source
facts. Guided choices are not claimed as speaking proficiency. Live voice/text
uses existing consent, daily allowance, idempotency, review and recovery paths.
Article evidence and later interview updates are labeled separately in model
context. A used free allowance cannot silently open a different chapter's
conversation. No payment implementation or allowance increase is introduced.

## Companion motion

Light's existing eight companions now have procedural Three.js geometry with
perspective, lighting, blinking, breathing, greeting and speech-reactive motion.
The lesson scene and embedded live room use the selected companion. The old
illustration is the fallback when WebGL is unavailable or loses context.
Speech motion follows playback state/envelope, not phoneme-accurate lip sync.

The renderer loads only when visible, caps rendering at 30 fps and device pixel
ratio at 1.5, suspends offscreen/inactive/inert scenes and respects reduced
motion. Unmount releases geometry, materials, renderer and context. Live rooms
use native dialogs; closing them stops media and requests. Starting an embedded
session scrolls that dialog, preserving the underlying lesson's position.

## Data, audio and efficiency

Standard uses existing server-side lesson grading. Light uses existing
versioned sessions, immutable completed evidence, rewards and town placement.
Completed immersion Light sessions contribute calculated first-attempt evidence
to Learning Memory, scoped by account and learning language. They do not become
Standard mastery. Historical Light sessions do not retain the original wrong
wording, so derived evidence never fabricates that quotation. The report
fingerprint changes when new evidence is saved.

`/api/immersive/audio/:lesson/:source/:part` accepts only authored canonical
source windows of at most 1,800 characters, never arbitrary submitted text.
It uses the existing speech cache, synthesis deduplication, daily budget,
concurrency limit, administrator pause and usage metering. Navigation does not
generate narration. Playback uses one current roleplay turn, or one/full
reading/listening recording, with existing cancellation and next-clip lookahead.
No bulk paid generation was performed during authoring. Detached audio playback
registers audible study activity, so longer narration remains tracked beyond
the idle-input timeout, without an additional timer or heartbeat stream.
Completed Light state switches directly to the result view even if the save
finishes before the asynchronous navigation continuation.

Narratives load as separate learning-language chunks. If a browser retains a failed
module fetch, the explicit retry uses a bounded, cacheable public
`/api/immersive/content/:language` response with the identical authored pack;
it does not reload the lesson, expose learner data or call an AI provider. Shared instructional
questions and evidence are stored once rather than repeated in ten metadata
packs. For all ten packs, an equivalent UTF-8 metadata representation decreased
from 1,106,780 to 323,784 bytes; gzip from 297,692 to 101,720 bytes. These are
representation measurements, not confirmed production bandwidth or operating
cost savings. The real renderer is a separate lazy chunk (~539 kB raw / 134 kB
gzip in the local build). A same-runtime comparison against the previous
production source measured the initial JavaScript at 8,514,845 → 8,862,966
bytes (+4.1%), and Node-default gzip at 2,142,974 → 2,253,408 bytes (+5.2%).
This is feature overhead, not a load-time improvement. The existing large main
bundle remains a performance limitation. Physical-phone performance remains
unmeasured.

Runtime React, React DOM, icon and Vite-plugin versions are pinned to the
already locked production versions. Playwright 1.62.1 is a pinned development
dependency, so installing browser QA no longer re-resolves `latest` runtime
packages after the production build.

## Verification and release status

Local verification includes all 90 source packs, canonical answer/source-window
integrity, grading of all 360 lessons, six-question Light contracts, ≥80%
first-attempt threshold, old-version boundaries, branch availability, source
lookup restrictions, administrator audio control, in-memory PostgreSQL save and
privacy tests, AI chapter/level enforcement, free allowance and idempotency,
source-grounded mocked text/voice requests, and Learning Memory invalidation.
The application build and structural language audit pass locally. The production
dependency audit reports no known vulnerabilities at the time of this run.

The real 3D renderer's eight species and lifecycle were verified in Chromium CI.
The expanded Chromium/WebKit integration suite covers forty native Light stage
screens per engine, load recovery, audio sequence, six-question completion,
mode/draft preservation, live-dialog cleanup, phone RTL and desktop layout.
Its results and production Docker verification must be confirmed before merge.
The workflow uploads screenshots for visual inspection.

At this documentation checkpoint, the full feature is on the working branch,
not yet deployed. Do not treat a passing source audit as native-editor semantic
certification, pronunciation listening verification or physical iPhone testing.
No destructive migration is required. The rollback target is the previously
live commit `cbc55bdfa96ac8451b2358103ef66c25db491d7d`; keep new records intact
when rolling back and reintroduce their reader before interpreting them again.
