# Companion-first chapter calls

Chapter calls use a fixed viewport stage with a single current utterance overlaid near the controls. New utterances fade-replace the previous one; long paragraphs scroll inside a bounded caption and never size the character. The complete session remains saved for review and Learning Memory. History is available explicitly in settings, not stacked in the call.

Capybara calls now lazy-load the approved pop-style v3 GLB from `/companions-3d/capybara-pop-v3.glb`. `companion-call-rig.mjs` applies the existing audible playback amplitude to real jaw bones and mouth/tongue morph targets, with variable blink timing and smooth listening/thinking/speaking weights. This is amplitude-driven mouth motion, not phoneme-level lip sync. Other companions retain the textured puppet described below.

The original illustrations are reused as textures. `companion-puppet.mjs` deforms a single quad locally at authored jaw/eye/head/paw landmarks; it is a 2.5D puppet, not a new rigged 3D model. Head nods, subtle blink deformation and occasional paw gestures are state driven. This does not produce film-quality facial acting or phoneme-aligned visemes.

Natural voice playback uses the already decoded PCM to build a small amplitude envelope. Sampling at the audible media element's `currentTime` keeps jaw motion aligned with playback, playback speed and pauses without routing Safari output through a new audio graph. Microphone levels never drive the partner's jaw. Optional replay analysis uses an offline decoder only for this call UI. Device speech remains dependent on the browser's boundary events. No extra generation calls or shared private-output cache is introduced.

The renderer is capped at 24 frames/second, stops when hidden/offscreen/inert and respects reduced motion. Idle states stop requesting animation frames. The small original texture bounds the drawing buffer; the buffer is retained for reliable paused presentation. Graphics failure/context loss reveals the approved image fallback, and unmount releases resources. Existing Light lessons and maps continue using their original companion component.

Verification includes many saved messages with one visible caption, long-text geometry, draft retry/idempotency, history on demand, review/close, original artwork for all eight kinds, quiet/loud audio envelopes, buffering/stop, reduced motion and graphics fallback. Browser captures compare three jaw amplitudes for each character. Physical iPhone keyboard, real-device GPU behavior, acoustic pronunciation and phoneme-accurate lip alignment are not certified by headless tests.

No data migrations. Rollback target before this change: `5329f35c194e9f0ae115995f7587e07dadf2bbad`.

## Capybara production integration (2026-11-16)

The model comes from the approved v3 Blender prototype. The production renderer caps at 24 fps and 1.25 device pixel ratio, loads only when a capybara call enters view, suspends animation offscreen/hidden/inert, and renders a neutral static pose for reduced motion. Unmount aborts loading and disposes geometry/materials/skeletons/WebGL. Model/network/WebGL/context failures retain the original capybara image. No new provider calls, recordings, microphone routing, or database changes. The bundled demonstration voice and prototype HTML are not shipped.

The focused automated suite covers production GLTF binding, actual jaw/morph deformation, PCM/silence/pauses, state transitions and existing conversation voice flow. Local browser launch is unavailable in this environment; Safari/iPhone GPU behavior and the real-device visual/audio flow remain to be checked.

Rollback: revert the production integration commit to restore the existing capybara puppet; previous main is `678bf73d8efaae469f0cc5c35665da4c75b37daa`.
