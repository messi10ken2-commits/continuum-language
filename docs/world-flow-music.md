# World flow, neon and music

- Four additional upright illuminated signs and another bookshop ribbon. Two accent circuits use short, smoothly eased dimming events (roughly once per 19 seconds), plus tiny brightness drift. Windows stay steady; daylight and reduced-motion settings disable fluctuations. The existing static geometry and nearest-three-light limits remain enforced.
- Auto/Medium/High target 60 fps; Low retains 30 fps. Camera orbit/follow, companion acceleration, full-turn head tracking, celebrations and pedestrian stopping use continuous damping. Camera damping still checks building collision segments.
- Building crossings reuse one WebGL renderer and a World-scoped two-model decoded art pool. The environment reflection is reused, nearby interior code is prefetched, and old scene resources stay alive until the replacement's first frame. A short, bounded 2D snapshot covers the swap; it is removed after the reveal. No second GPU context is used for that preview. Closing World frees the renderer, pooled models, audio and remaining retired scene resources. Quality changes and lost-context recovery deliberately recreate the renderer when needed; cached environment maps are invalidated after context loss.
- The companion selection resolves before the first scene is created, with a bounded fallback, avoiding an initial bird-to-selected-companion scene rebuild.
- Original 72-bpm instrumental electric-piano score; 64 beats per phrase, quiet default level, no lyrics or external music download. The Explore Tokyo gesture unlocks one audio context before lazy screen loading. Music is enabled by default and has a persistent mute control; ambient noise remains independently optional. Music ducks 20 dB during NPC interactions, including microphone use, fades back afterwards, and suspends while hidden, unfocused or in list view. Browser playback restrictions fall back to the next World interaction. Nothing records microphone data for music.

## Measured comparison

Local Chromium software-rendered comparison against release `71fc5e5`, using the same five-scene sequence (outdoors → café → outdoors → market → outdoors), camera, assets and quality. Median visual-ready time of the four warm crossings:

| Profile | Previous | Updated | Difference |
| --- | ---: | ---: | ---: |
| Low / phone viewport | 655.8 ms | 467.3 ms | 28.7% faster |
| Auto / desktop viewport | 1435.5 ms | 1305.3 ms | 9.1% faster |

Each five-scene sequence fell from five renderer contexts and ten model decodes to one renderer context and two decodes. A preceding comparison run measured 30.6% (Low) and 17.0% (Auto); timings vary with software GPU load. These are controlled software-browser timings, not device performance guarantees or a claim about first cold World startup. Reproduce locally with `node scripts/qa-continuum-world-flow.mjs --compare` when the baseline commit is present. CI runs the new flow without the baseline dependency and guards the context/decode bounds.

Real OfflineAudioContext output at the default music gain: peak 0.03373, RMS 0.004779; NPC-ducked output RMS 0.000478 (20 dB reduction), without clipping. Browser tests cover gesture playback, persisted mute, pause/resume, NPC ducking, doorways and cleanup. Existing movement, collision, reduced motion, localization, GPU-resource and native checks remain required.

Rollback is a code revert and redeploy; no database migration or learner-progress change is involved.
