# Premium trial, learning activity and language integrity

The cardless-trial section below describes the previous release. Future trial checkout is superseded by [renewing trials](exclusive-layout-renewing-trials.md); existing cardless trials keep their original terms.

## Behaviour

Free learners can explicitly start one 72-hour digital Premium trial from Account → membership. No payment method, automatic subscription, charge or class tickets are created. Server time determines expiry; concurrent requests cannot restart or extend a trial. Existing paid, invited, blocked and owner-preview memberships retain their rules. Premium scenario and focused-practice taps lead Free learners to the offer. The owner account list identifies real trial access separately from previews.

Overview shows signed-in days, study time today, accumulated study time, days with at least one study minute, and the most recent 90 daily records. Lifetime totals remain available. Tracking starts with this release. It approximates active visible lesson, assessment, conversation and review work, pauses for long inactivity and loading/review waits, caps missed heartbeats, and avoids counting multiple active tabs. It does not reconstruct previous usage or measure offline study/external classes. The first detected device timezone fixes daily boundaries consistently across devices. No keystroke content is collected.

## Accuracy safeguards

The reported Spanish phrase **pagar con tarjeta** is correct; Instituto Cervantes explicitly includes it in its A1–A2 inventory of specific notions: https://cvc.cervantes.es/ensenanza/biblioteca_Ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm . The reported malformed replacement was not found in the authored curriculum. Transcript quotation checks alone allowed a proposed AI replacement without checking its language correctness.

Writing/speaking corrections now require a separate verification request that confirms an actual error, a correct replacement and preserved meaning, at high confidence. Style, politeness and regional preferences must not be marked as errors. Known correct card-payment phrases receive a deterministic safeguard. Failed or incomplete verification withholds the correction and its associated numerical language score. Older unstamped AI corrections are withheld in API projections, including correction audio, without deleting transcripts or stored evidence.

Ordinary, exclusive and review exercises share explicit accepted alternatives; Japanese spacing and supported English contractions are normalized without stripping meaningful accents, changing tense or ignoring required order. A learner can explicitly request AI review of an unrecognized typed alternative. Two separate prompts must agree with high confidence on the exact server-resolved task. Approved alternatives are scoped to that learner and exact question fingerprint and used in server grading, evidence, saved progress and review scheduling. Original responses remain unchanged. Checkpoints, exact forms, order and dictation do not gain a broad semantic override. Open writing/speaking is assessed for its actual meaning, rather than equality with a model response. AI review can still make mistakes and is not native-editor certification.

## Audit scope and verification

`npm run audit:language` traverses all 452 lessons (English 111, Spanish 111, Portuguese 111, Japanese 119), including current and earlier exercise versions, 28 exclusive courses and 135 skill tasks. It checks canonical and authored alternative grading, lesson/exercise text for the reported malformed phrase and explicit placeholder text. Current run: 17,886 question instances and 12,332 authored alternative entries, zero flags. Choice metadata alternatives are compared with the selected option text, while typed alternatives are passed through the grader.

This is a structural and known-regression audit, supplemented by the existing multilingual content suites. It is **not** a complete native-speaker semantic review of every explanation or proof that AI cannot make another linguistic error. Broader editorial certification remains a separate task; no automatic fuzzy acceptance replaces teaching contrasts.

New tables are additive: premium_trials, learner_activity_days, learner_presence, verified_answer_variants. Existing Stripe configuration, secrets, infrastructure and historical learning records are preserved. Public Terms and Privacy describe trials, activity and opt-in alternative review.

Validation commands:

- `npm run test:qa`
- `npm run audit:language`
- `npm run build`
- `npm run check:runtime`
- `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs QA_BROWSERS=chromium,webkit npm run test:growth:browser` (requires installed browser binaries/system dependencies)

Automated provider fixtures exercise verification failures and acceptance mechanics; they do not measure a live model's linguistic accuracy. Browser QA uses disposable accounts and an in-memory PostgreSQL engine; production payment/account writes are not used as tests.

Release validation: full QA 305 passed / 0 failed; content audit zero flags; production build and Node 24.22.1 runtime check passed; production dependency audit reported zero vulnerabilities. Additional HTTP checks for trial blocks, review alternatives and assessment/privacy projections passed. Chromium and WebKit both passed the actual built interface against disposable accounts: real Premium-scenario upsell → trial start, no class-ticket grant, desktop/mobile layout, active lesson versus Overview timing, explicit alternative consent and provider-unavailable recovery, and no JavaScript errors. This is browser-engine coverage, not a physical iPhone/Safari test. WebKit required local renderer dependencies and disabled container sandboxing for this test only; production settings are unchanged.
