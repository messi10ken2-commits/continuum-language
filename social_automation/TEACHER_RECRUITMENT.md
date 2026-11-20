# Continuum — Teacher Recruitment Automation (10 languages)

This is an X + Threads prelaunch tutor-interest campaign using the existing Buffer channels. It does NOT imply that paid bookings, payouts or native apps are launched.

## Timing and rotation

- First: Tuesday November 10, 2026 at 17:15 MYT: Japanese teacher outreach.
- Then Monday, Wednesday and Saturday at 17:15 MYT.
- Japanese → English → Mandarin Chinese → Korean → Spanish → Portuguese → French → German → Arabic → Italian → repeat.
- Both channels recruit for the same language on the same date with distinct native-language captions.
- Run today-plus-tomorrow recovery checks three times per day.
- Campaign stops December 31, 2026 unless updated to match actual launch status.
- Keep regular learning tips, development diary, Instagram and showcase posts unchanged.

## Editorial principles

Invite teachers to help shape Continuum early, connecting AI-supported practice and real human teaching through learning memory. Early involvement is an opportunity to join the founding discussion, NOT guaranteed student acquisition or income. No invented rates, commission discounts, teacher approvals, waiting students, booking guarantees, public app launch or launch date.

Copy is localized to native-language audiences. The target audience can include native and highly proficient teachers without asserting a nationality requirement.

AI generation uses the configured OpenAI model, bounded X/Threads messages and best-effort broad Google language-learning trending terms (not live native X or Threads trends). When available, Buffer experimental teacher-only performance metrics inform hooks; unavailable data is ignored. If text validation or generation fails, a carefully prepared native-language fallback is posted instead. Review language accuracy of live AI captions periodically.

## Applications / call to action

By default, the posts invite interested candidates to reply or comment. No fictitious direct teacher registration URL is included. When a real, accessible, verified signup destination is ready, configure the optional GitHub Actions variable CONTINUUM_TEACHER_URL (HTTPS only) to append it when length permits.

The app registration and teacher application can be switched off independently. Verify registration is enabled before promoting any direct-signup link. No applicant messages or comments are automatically answered or collected.

## Activation

Source: social_automation/teacher_recruitment.py
Workflow: .github/workflows/teacher-recruitment-autopost.yml
Tests: social_automation/test_teacher_recruitment.py

Uses existing BUFFER_API_KEY, OPENAI_API_KEY, OPENAI_MODEL, X_CHANNEL_ID, THREADS_CHANNEL_ID.
The existing SOCIAL_AUTOPUBLISH_ENABLED=true master flag is required.
TEACHER_RECRUITMENT_ENABLED=false disables only this campaign (unset/empty means enabled when master flag is true).

Safe preview:
python -m social_automation.teacher_recruitment --dry-run --date 2026-11-10

The workflow checks Buffer scheduled and sent posts before creating a new entry. GitHub Actions checks are best effort, with retries before publication. A successful Buffer queue insertion is not proof of publication. Free-plan queue limits may prevent additional posts when many future posts are already queued. See workflow logs and Buffer channels for confirmed post IDs.

Monitoring: The optional #ContinuumTeachers tag identifies recruiting posts; teacher-only analytics require three comparable measured entries and access to experimental Buffer metrics. Without metrics, no performance claim is made. No paid ad spend is initiated.
