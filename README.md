# Continuum Language

Continuum connects language self-study, assessments and teacher notes in one
learner account. The audited implementation contains four target languages
(Spanish, Japanese, Brazilian Portuguese and English), A1–C1 materials and six
independent display languages. See [QA_REPORT.md](QA_REPORT.md) for exact tested
scope, confirmed defects and limitations; this is not a complete localization or
real-device certification claim.

## Implemented

- PostgreSQL-backed learner/teacher accounts, profiles, teacher review and bookmarks
- Server-graded exercises, saved lesson drafts, checkpoints and assessment history
- Listening/writing/speaking tasks, consent-based AI feedback and pronunciation matching
- Language-scoped teacher sharing, privacy controls, class notes and learning evidence
- Recurring patterns, review pool, visual recaps, conversation embeds and character writing
- Reviewed/interface translation caches and native, AI studio and device audio

Scheduling, live chats/meetings, paid bookings/payments, email verification and
password reset are not implemented. Do not mistake legacy prototype components
for working account features.

## Local development

Use a development PostgreSQL database and set `DATABASE_URL`. Keep credentials
out of Git. For local HTTP leave `NODE_ENV` unset; production cookies require HTTPS.

```bash
npm ci
npm run build
npm start
```

`GET /api/health` verifies database connectivity. Tables are created at startup.
`npm run dev` serves only the frontend. Preserve existing production connections
and read [DEPLOYMENT.md](DEPLOYMENT.md) before any release.

## QA

```bash
npm run test:qa
npm run build
npm audit --omit=dev
npm run test:qa:browser
node scripts/qa-performance.mjs
```

The complete test suite uses PGlite. Browser QA requires Chromium and a built
frontend; it starts its own disposable test server/database and removes AI keys
inside the test process. It creates only synthetic accounts and closes its own
services. No production URL, Railway token or payment credentials are required.
Performance results are written to `/tmp/continuum-qa-performance-results.json`;
browser results to `/tmp/continuum-qa-browser-results.json`. Human listening and
physical-device checks are still required.

`node scripts/qa-postgres.mjs` additionally requires the isolated local PostgreSQL
service at 127.0.0.1:55432 (continuum_dev). It creates and deletes only a randomly
named QA database and verifies real server restart persistence. Never point these
scripts at production.
