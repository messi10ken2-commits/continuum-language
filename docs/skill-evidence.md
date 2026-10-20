# Independent production skills and audio pronunciation

Writing and speaking task difficulty is separate from an independent provisional CEFR estimate. The overall diagnostic/course recommendation is unchanged. Version `skill-evidence-v3` asks for cross-band judgement, limitations, confidence (low/medium), and exact response quotations. At least two verified quotations and sufficient response material are required. A task percentage is never converted to CEFR. Older results display no independent level and can be reassessed with explicit learner consent.

Writing requires at least 20 words (40 characters for Japanese); speaking requires at least 15 seconds of decoded audio. These are minimum evidence gates, not guarantees of a reliable CEFR estimate. A single task is not a certification or a full proficiency assessment.

Pronunciation is evaluated by the existing audio-capable provider using actual decoded recordings. Four criteria: sound articulation; rhythm/stress/timing; intonation/phrasing; intelligibility. Feedback must cite acoustic observations, respect intelligible regional accents and not infer pronunciation from spelling/transcripts. This is an AI estimate, not a calibrated phoneme-alignment instrument. Criterion design follows the Council of Europe's emphasis on intelligibility and prosody: https://www.coe.int/en/web/common-european-framework-reference-languages/phonological-competence

Placement speaking combines communication (80%) and pronunciation (20%); if pronunciation cannot be assessed the combined score is withheld. Duration is decoded from server-side PCM, never accepted from client duration for evaluation. Independent CEFR is an additional judgement rather than a percent-to-band conversion.

AI conversation attaches validated acoustic feedback only to server-processed voice turns. The conversation review requires at least two assessed clips and 15 seconds total; duration weights are capped at 45 seconds per clip. Typed and legacy transcript-only turns cannot generate acoustic scores. Communication score additionally requires four verified quotations. A combined conversation practice score is shown only when both components exist. Raw conversation audio remains ephemeral; feedback/ratings are saved with the conversation. Existing conversations cannot be retroactively assessed from transcripts.

Expression watch-outs: 240 previously shared warnings now have term-specific notes. All 380 entries were checked for duplicated notes within each lesson. Existing exercise seeds retain answer keys and ordering; note-only corrections apply to legacy generated questions and saved vocabulary review items at read/grade time. No database migration or bulk paid reassessment.

Validation: `node --test skill-evidence.test.mjs`; `node skill-evidence-render.test.mjs`; existing AI, speaking, skills API, content, review API and build checks. Provider tests use deterministic mocks and synthetic WAV; they verify data flow and evidence gates, not empirical CEFR/pronunciation calibration.

## Recovery and latency follow-up

Placement speech now authorizes authored audio from every supported diagnostic version (1–4), so historical paused tests remain playable. Unsupported form/version combinations are caught individually; the public endpoint still rejects arbitrary private text.

The conversation text/review provider is independent from pattern-analysis routing. Conversation consent already permits either configured vendor. OpenAI is tried first, with a bounded 18-second request and a configured Gemini fallback. Rate-limited/unavailable vendors cool down for subsequent two-provider requests; a sole configured vendor remains retryable manually. No fabricated review is returned when all providers fail. Voice turns likewise prefer OpenAI, cap each provider wait at 18 seconds and limit context to the last 12 messages. Malformed optional pronunciation metadata is excluded without discarding a valid conversational reply.

Conversation TTS provider waits are bounded separately from ordinary authored lesson audio (12/15 seconds). On 429/503/504 or transport timeout, the continuous voice loop explicitly switches its selector and status notice to device voice and continues with the same saved reply. Device voice may sound different; natural voice remains selectable. User cancellation never triggers late fallback playback. These bounds reduce long stalls, not provider quota limits or guaranteed response time.

The failed validation run at commit 8e53960 came from a blank line parsed as an empty untranslated key in skill-evidence-copy. Blank rows are now filtered; no translation coverage check was removed.

## Automatic playback isolation

Continuous conversation now reuses a gesture-unlocked HTML media element for natural speech output, separate from the microphone AudioContext. Audio bytes are copied before decodeAudioData (which may detach its input) so the media blob retains valid PCM. The speaking state starts on the media `playing` event, with a progress watchdog to pause and request user resume if playback stalls. Every stop releases playback, object URLs and microphone tracks; microphone context is resumed before capture. Browser QA uses Chromium with synthetic voice/microphone data; physical Safari speaker output requires user-device confirmation.

## Communication scores and turn pacing

A review with absent/unverified communication ratings now requests one compact score-only repair, grounded in exact saved learner quotes. Verified communication and recorded pronunciation combine at 80/20; neither component supplies a default for the other. If evidence/provider remains insufficient the score stays unassessed, with an explicit notice and consent-gated reassessment button. Owners can refresh only reviews missing communication scores; completed turns stay closed, revision/lease/privacy checks remain enforced.

Natural voice is prefetched only for voice turns explicitly requesting it, after the server saves the exact generated reply. Prefetch and playback use the same authorized private cache, in-flight task and daily budget; device-voice users do not trigger it. Audio waits still depend on the provider. The voice-turn prompt requests brief acoustic notes, the default end-of-speech pause is 1.3 rather than 2.2 seconds (longer remains selectable), natural media playback is 1× with preserved pitch, and device fallback is capped at 0.9×. No provider-latency guarantee is implied.
