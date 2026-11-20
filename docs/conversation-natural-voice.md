# Natural conversation voice and responsiveness

A transient network or provider 429/503 response used to set `deviceVoice=true` in both the voice loop and React preferences. That selection lasted for subsequent rallies and sessions; subsequent turn requests also stopped preparing natural audio. Production logs confirmed Gemini TTS quota failures and a rejected OpenAI backup credential. Static lesson bundles cannot cover arbitrary conversation replies.

Natural voice now remains the selected voice. A short transient failure gets one bounded reconnect attempt. Longer provider cooldowns pause playback with the saved reply intact and the existing Resume control available. Device speech requires an explicit selection. Microphone capture never advances before a complete spoken reply. Prepared audio survives an autoplay block or an intentional pause, so Resume can replay the same bytes without another generation request. Cancellation interrupts reconnect waits and stale epochs cannot speak.

Conversation speech tries Gemini 3.8 Flash-Lite TTS first, then the configured full Gemini TTS model, then the configured OpenAI voice. Both Gemini models use the same partner voice; the default lesson model and its pronunciation recipe are unchanged. Short conversational delivery instructions replace the longer lesson-teacher style only for partners. A 26-second overall provider recovery budget fits inside the player's 30-second request bound. Model-specific quota/unavailability cooldowns are respected; HTTP 401 cools the rejected credential across models, while a corrected credential can recover immediately. No credentials are logged or exposed. Existing private authorization, coalesced cache, concurrency and daily cost limits remain in place.

The opening can be prepared after conversation consent while the learner enters voice mode, using the same private cache as playback. Later voice replies continue to be prepared ahead of playback. The multimodal reply path prefers Gemini, skips unavailable providers on later rallies, and disables additional thinking only on supported Gemini 2.5 Flash models; reviews retain their existing processing and acoustic-evidence rules. Malformed reply JSON may recover through the other configured provider, while an explicitly inaudible recording still requires a new recording.

Provider references checked November 1, 2026:

- https://ai.google.dev/gemini-api/docs/speech-generation (Flash-Lite for conversational cascades; stable prebuilt voices and short styles)
- https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash-lite-tts
- https://ai.google.dev/gemini-api/docs/generate-content/thinking (Gemini 2.5 Flash supports thinkingBudget=0)

Regression coverage includes repeated rallies through transient voice failure, quota pause without device speech, explicit device selection, cancellation, retained prepared audio, persona/model fallback, failed-key cooldown, bounded provider recovery, private opening/reply prefetch and browser media playback in Chromium and WebKit. These tests use synthetic provider responses. They do not certify provider quota availability or measure real production response latency. A rejected backup credential still needs replacement to make that provider usable; the application cannot increase provider quotas.
