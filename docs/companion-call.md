# Companion-first chapter calls

Chapter calls use a fixed viewport stage with a single current utterance overlaid near the controls. New utterances fade-replace the previous one; long paragraphs scroll inside a bounded caption and never size the character. The complete session remains saved for review and Learning Memory. History is available explicitly in settings, not stacked in the call.

The original eight furry illustrations are reused as textures. `companion-puppet.mjs` deforms a single quad locally at authored jaw/eye/head/paw landmarks; it is a 2.5D puppet, not a new rigged 3D model. Head nods, subtle blink deformation and occasional paw gestures are state driven. This does not produce film-quality facial acting or phoneme-aligned visemes.

Natural voice playback uses the already decoded PCM to build a small amplitude envelope. Sampling at the audible media element's `currentTime` keeps jaw motion aligned with playback, playback speed and pauses without routing Safari output through a new audio graph. Microphone levels never drive the partner's jaw. Optional replay analysis uses an offline decoder only for this call UI. Device speech remains dependent on the browser's boundary events. No extra generation calls or shared private-output cache is introduced.

The renderer is capped at 24 frames/second, stops when hidden/offscreen/inert and respects reduced motion. Idle states stop requesting animation frames. The small original texture bounds the drawing buffer; the buffer is retained for reliable paused presentation. Graphics failure/context loss reveals the approved image fallback, and unmount releases resources. Existing Light lessons and maps continue using their original companion component.

Verification includes many saved messages with one visible caption, long-text geometry, draft retry/idempotency, history on demand, review/close, original artwork for all eight kinds, quiet/loud audio envelopes, buffering/stop, reduced motion and graphics fallback. Browser captures compare three jaw amplitudes for each character. Physical iPhone keyboard, real-device GPU behavior, acoustic pronunciation and phoneme-accurate lip alignment are not certified by headless tests.

No data migrations. Rollback target before this change: `5329f35c194e9f0ae115995f7587e07dadf2bbad`.
