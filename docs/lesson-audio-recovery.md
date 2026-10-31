# Lesson audio recovery and Portuguese human recordings

Production diagnostics on 2026-10-31 showed OpenAI HTTP 401 and Gemini HTTP 429 for studio generation. The old lesson player automatically attempted device speech after the failed asynchronous request, which could lose iOS user activation. Browser speech had no start/end watchdog and synchronous synthesis errors could escape its event handler. Ordinary cached studio WAVs were not validated for audible signal.

## Changes

- Ten additional bundled Portuguese human recordings: avó, avô, lá, lã, mau, pau, pó, pôr, caro and bom dia. Exact NFC text and Brazilian locale matching preserve accents and keep contrast words separate. They bypass provider credentials, quotas, generation budget and AI caches. Full attribution, source license, original filename, adaptation notes and checksums are in native-word-map.mjs and NATIVE-AUDIO.md.
- Studio failures now stop cleanly and offer an explicit device-voice button. Device playback starts on that fresh tap rather than automatically after a network wait. Regional/private players that disallow device substitution retain that restriction.
- Device playback uses exact locale selection, waits briefly for voice discovery, catches browser API exceptions, resumes paused synthesis, bounds missing start/end events, and clears all timers, listeners and remaining chunks on cancellation/unmount. Actual speech-start events control the playing state and completion callbacks.
- Studio fetches have a 30-second bound. Empty payloads, media errors and 15 seconds without playback progress produce a retry state. A prepared recording survives an autoplay rejection and is reused on the next tap.
- All studio WAV cache hits and new generated audio are validated for audible varying signal by default. Human MP3s remain on their provider-independent path. Signal validation detects silence/malformed data; it does not certify pronunciation or full semantic correctness.
- Authentication failures back off for ten minutes; quota failures respect a bounded retry delay. The backoff is keyed by provider, credential fingerprint and model, so corrected credentials recover immediately. No credentials are logged or persisted by this mechanism.

## Operational limitation

Playback fixes cannot repair an invalid provider credential or increase provider quota. A valid OpenAI credential or restored Gemini availability is still needed for uncached AI-generated words and sentences. Existing cached audible recordings and bundled human recordings continue to work. AI speech remains labelled as generated, and device speech remains labelled as device speech.

## Validation

Tests cover exact accent/locale matching, hashes, actual MP3 decoding and audible PCM for all bundled word recordings; provider-independent serving; silent-cache rejection and regeneration; failed-provider backoff and corrected-key recovery; device exceptions, pauses, late voices, stalled start/end, complete chunk playback and stale-event cancellation. Browser QA exercises the real React player with controlled audio APIs in Chromium and WebKit, including explicit fallback, gesture recovery, empty recordings, media stalls and unmount cleanup. These checks do not substitute for a physical iPhone listening review.
