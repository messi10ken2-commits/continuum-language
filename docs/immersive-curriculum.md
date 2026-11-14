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
are authored in the learning language. Chapter titles, stage names and chapter goals are bundled in all ten display
languages independently of the target-language source material. This also works
without a provider request and when the display language is English. Comprehension instructions, explanations
and paraphrase options use the existing selected-interface-language localization
system. Native utterances are protected from interface translation. Fixed new
UI copy covers all ten supported interface languages; these differ from the ten
learning languages (Indonesian/Russian UI; German/Italian learning content).

Standard presents the full article and full recording, with individual parts
available. Light presents six manageable source windows/questions in one run;
its checkpoint is included. Standard checkpoints randomize their six authored
questions/choices with revision-bearing seeds; saved drafts and grading use the
same seed. Five of six first-attempt answers are needed to
meet the existing ≥80% threshold. It does not restore historical multi-round
practice. New chapters are optional branches in Light, with their internal
stages ordered, and do not lock old lessons. Historical lesson IDs, relative
ordering, grading versions, accounts and saved records remain intact. New
chapters have ninety illustrated passport stamps and stage-specific lesson
card artwork; existing artwork assignments and photo-to-chapter mappings are
preserved. Previously earned C1 finales and level keepsakes keep their
original core requirements and dates; optional extension chapters cannot
relock them.

The conversation lesson combines guided decisions and an optional live AI
conversation using the chapter's canonical language, level, goals and source
facts. Guided choices are not claimed as speaking proficiency. Live voice/text
uses existing consent, daily allowance, idempotency, review and recovery paths.
Article evidence and later interview updates are labeled separately in model
context. A used free allowance cannot silently open a different chapter's
conversation. No payment implementation or allowance increase is introduced.

## Companion presentation

The approved eight illustrated companion images are used directly, with the
existing CSS breathing, greeting, celebration and speech-reactive movement.
Light lessons retain the cafe setting, selected companion and audio controls.
Visibility, inert-state and reduced-motion controls remain in place.

Standard immersion materials use topic-specific still images: illustrated art
in Illustration mode and real photographs in Photo mode. Scene selection is
independent of answers, scores and learner-entered text. All ten learning
languages are covered. Reading/listening no longer fetch an unused companion.

Procedural WebGL companions are not imported by the application. Their source
is retained for deferred work, but no renderer chunk or model is downloaded.
Live-conversation development is on hold. Existing conversation functionality,
consent, budgets and saved records remain available with illustrated companions.
Native dialog closing still stops media and requests and preserves lesson scroll.

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
These new narratives are on-demand studio recordings, separate from the
unchanged provider-independent historical bundled pack. No bulk paid generation
was performed during authoring. Detached audio playback
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
cost savings. The unused procedural renderer is no longer shipped. Historical
measurements from the initial immersion release follow: a same-runtime comparison against the previous
production source measured the initial JavaScript at 8,514,845 → 8,929,015
bytes (+4.9%), and Node-default gzip at 2,142,974 → 2,264,401 bytes (+5.7%).
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

The Chromium/WebKit integration suite checks forty native Light stage screens
per engine, load recovery, audio sequence, six-question completion, mode/draft
preservation, dialog cleanup, phone RTL and desktop layout. It also verifies
both source stages in both Standard visual styles for all ten languages,
loads the actual still images, checks the restored cafe and capybara, and rejects
procedural canvases in those learner screens. The existing Light motion suite
covers all eight companion choices, tap/keyboard reactions, offscreen suspension
and reduced-motion behavior. These checks and production Docker verification
must pass before deployment; screenshots are uploaded for inspection.

The full Node regression suite runs in parallel with immersion browser QA; the
final existing-browser/security/Docker job requires both to pass. A structural
audit is not native-editor semantic certification, pronunciation listening
verification or physical iPhone testing. No destructive migration is required.
Rollback for this presentation-only restoration is the preceding production
commit `df2b4b1c5c48d9f02d6d0e97b0c40130ab6a8c40`; learner records and
curriculum identifiers remain unchanged.
