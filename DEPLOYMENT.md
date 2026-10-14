# Continuum deployment

The app has a Node API and a React frontend. It needs PostgreSQL.

## Railway setup

1. Add a private PostgreSQL service.
2. On the app service set `DATABASE_URL` to the reference variable `${{Postgres.DATABASE_URL}}` and `NODE_ENV=production`.
3. Deploy this repository. `npm run build` creates the frontend; `npm start` runs the API and serves the frontend. `/api/health` checks database availability. Tables are created on startup.

Preserve existing Railway variables, database connections, volumes and build/start overrides. Historical overrides require owner review before modification. Use a feature branch and reviewed PR targeting main; the native GitHub integration may deploy main after successful required checks. No Railway API token is required. Do not merge or deploy audit changes without owner approval.

## Current product scope

- Salted scrypt passwords, PostgreSQL-backed sessions, learner and teacher profiles.
- Four target-language courses, drafts, server grading, assessments and history.
- Learner-controlled, language-scoped teacher sharing, class notes and privacy.
- Six independent display languages with reviewed copy, cached translations and
  protected learning examples. Translation completeness/quality remains partial.
- Native/studio/device audio, listening/writing/speaking evidence, recurring
  patterns, review pool, character writing, bundled recaps and conversation embeds.
- Authentication is required for learner/teacher screens. Email verification,
  password reset, scheduling/chat/meetings and paid bookings/payments are not implemented.

See QA_REPORT.md for tested scope, known limitations and release review evidence.
The current QA task does not authorize a production merge or deployment.
