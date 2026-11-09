# Continuum × Kotoba — Prelaunch Social Showcase Campaign

## Campaign and scheduling

This is a **free organic prelaunch promotional series**, not paid advertising in Meta/X Ads Manager. It supplements, rather than replaces, existing Instagram/X/Threads posting.

- Wednesday 19:45 MYT: Instagram Reel with the existing vertical 15-second Premium animation.
- Thursday 18:30 MYT: reuse the video on X and Threads with platform-specific copy.
- Saturday 19:45 MYT: Instagram carousel with four branded cards using genuine in-app visuals.
- Sunday 18:30 MYT: the same four cards reused on X and Threads with tailored captions.

All times use Asia/Kuala_Lumpur. Video source: public/membership/premium-promotion-v2.mp4 from the existing Continuum repository. Video is 15 seconds and 720 × 1280 with sound. Stop date is 2026-12-31, or earlier if the product launches or the underlying claims change.

The four image cards use the following actual app media assets:
- public/light-town/diorama.webp — Light Mode world
- public/illustrated-lessons/ja-learning-map.webp — illustrated learning journey
- public/lesson-media/cafe.jpg — photo-based lesson setting
- public/journey-media/fr-paris.webp — language scenery

These are **in-app visual assets**, professionally framed for social media; they are not unedited interface screenshots. For literal screenshots in a future update, use only approved, current, non-sensitive interface captures and host them publicly before scheduling.

## Reusable creative-generation prompt

Act as a social-media creative director promoting Continuum × Kotoba to adult language learners worldwide. Generate distinctive, truthful Instagram Reel, Instagram carousel, X and Threads captions using the existing 15-second Premium animated video and approved real in-app visual material.

Continuum is undergoing final quality assurance before rollout and has **not publicly launched as a mobile app**. Do not claim app-store availability, final launch dates, active teacher payments/payouts, completed paid lesson checkout, perfect results or fabricated usage statistics. The Premium animation illustrates concepts (AI conversation, expression review, exclusive courses), **not** a screen recording. The carousel cards show selected in-app artwork and photo assets, **not** unaltered screenshots of the full interface.

Product narrative: Continuum is building connected learning memory shared between AI-supported independent study and classes with human teachers. Its three visual learning modes are Photo, Illustration and Light. Features under development include authentic contextual lessons, visual maps, companion interactions, and city-building. Learning languages include English, Japanese, Spanish, Portuguese, Chinese, Korean, French, German, Arabic and Italian.

Write in natural, appealing, internationally understandable English. Hooks should address one learner benefit or showcase one concrete visual rather than empty hype. Rotate four perspectives: continuity of progress, AI conversations with review, immersive visual worlds, and AI supporting human instruction. End with an open-ended, non-pressuring question. Keep X captions below 255 characters; one hashtag at most. Keep Instagram captions concise with no more than five useful hashtags. Avoid false urgency, fake testimonials, paid-download instructions, unsupported pricing claims and repetitive hard-selling. Explicitly state the prelaunch/in-development status in each caption. Invite people to follow the development rather than implying the app is already on an app store.

## Automation behavior

Entry point: python -m social_automation.showcase
GitHub Actions workflow: .github/workflows/showcase-autopost.yml

The workflow checks the next two days plus today, four times daily. It detects scheduled or sent Buffer posts in exact target slots before creating anything. Gallery cards are created as JPEG at 1080 × 1350 and placed on a dedicated public GitHub media branch using the existing automation's mechanism. Their URLs are reused by X and Threads. It never deletes or modifies an existing Buffer post, never posts an unverified private media URL, and never purchases paid promotion.

Uses existing BUFFER_API_KEY and the automatic GitHub Actions GITHUB_TOKEN. Requires a connected, enabled Instagram professional profile and X/Threads channels, plus available Buffer queue capacity. Existing SOCIAL_AUTOPUBLISH_ENABLED=true is required. Optionally set SHOWCASE_PROMO_ENABLED=false to pause only these posts; an absent setting means enabled.

Manual safe preview:
    python -m social_automation.showcase --dry-run --date 2026-11-11

Tests:
    python -m unittest social_automation.test_showcase -v

Monitor GitHub Actions results and Buffer queues for initial success. Treat creation of a queued post separately from actual social network publication. Real-time Buffer confirmation is necessary; do not claim posted unless a post's status is sent.
