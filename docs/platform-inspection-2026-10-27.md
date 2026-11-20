# Platform inspection — 27 October 2026

Scope: current photo and illustrated learner interfaces, teacher/classroom access, curriculum integrity, localization, media playback, responsive navigation, membership and companion regressions. Synthetic accounts and disposable PGlite only; no production records modified.

## Repairs

- Added reviewed Japanese, Spanish, Portuguese, Simplified Chinese and French translations for 17 illustrated navigation, hero, lesson-tool and visual-credit strings. These render without requiring the translation provider, including short Start/Practise/Watch/Explore actions.
- Localized the skill name in focused task headers and teacher rubric labels/anchors, preserving learner responses and target-language examples.
- Updated lesson-clarity and focused-level browser checks to use the current illustrated interface, expandable chapters, and page scroll geometry.
- Added a 240-screen regression sweep: two layouts × six display locales × four viewport widths (320/390/768/1440) × five primary destinations. It checks overflow, offscreen controls outside intentional horizontal scrollers, broken rendered images, replacement characters and uncaught JavaScript errors.

## Verified

- Full pre-change API/model/render suite: 354 tests passed, zero failed/skipped. Added localization regression passed afterward.
- Structural curriculum audit: 452 lessons, 17,886 questions, 12,332 authored alternatives, 28 Premium courses and 375 skill tasks; zero flags.
- Interface template audit: 61 JSX files, 1,296 interface calls; zero flags.
- 240-screen sweep passed after repairs; no document overflow, broken rendered image, replacement character or page exception found.
- Approved illustrated/photo design browser checks and companion bond/avatar/Premium-expiry tests passed, including 320px animation containment.
- Focused practice: both layouts, all four learning languages × all five levels, different transcripts/prompts, direct section entry, focus and back navigation passed.
- Regional audio/teacher ranking and classroom browser scenarios passed.
- English, Spanish, Portuguese, Japanese and 21-second English replay clips decoded and played through their full durations without premature completion.
- Eight companion M4A files had valid nonzero durations.
- Loopback performance (30 samples): health p95 2.1ms, cached 16-item localization p95 3.2ms, existing human audio p95 1.4ms. These are local measurements, not production/mobile latency claims.

## Boundaries

Headless Chromium was used. Physical iPhone Safari, real microphone hardware, provider-generated live audio and a real payment were not exercised. No native-editor certification of all lesson semantics is implied by structural answer checks.

Several legacy browser scripts still target retired RPG selectors or closed Account disclosures (general qa-browser, header-localization, quest-continuity, exclusive-renewal, self-review, owner-console and legal-privacy). Their legacy failures are not counted as passing tests; current navigation, focused-practice and companion checks cover the replaced UI. The underlying billing, privacy, owner, review and teacher APIs passed the full automated suite. Physical-device and live-provider/payment checks remain separate launch checks.
