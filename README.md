# Continuum Language

Continuum connects self-study, assessments and teacher notes in one learner account.

## Included

- Learner and teacher accounts with PostgreSQL-backed sessions and profiles
- Spanish, English, Portuguese and Japanese target-language courses, exercises and assessments
- Saved lesson drafts, server-graded results and language-specific learning history
- Teacher sharing codes, per-language access, revocation and class notes
- Writing/speaking submissions, teacher review and optional provider-backed assessment
- Independent Base Language settings for English, Spanish, Portuguese, French, Chinese and Japanese

Base Language localization is incremental. Menus and selected instructional content are translated; many screens and lessons still appear in English. See [I18N.md](I18N.md) for coverage, authoring/review workflow and current limits. These settings do not add new target-language courses or change assessment scores.

## Run locally

With Node 24 and Docker available:

```bash
npm ci
bash scripts/dev-local.sh
```

The helper starts an isolated PostgreSQL database, builds the client and serves the app on port 3000. It supplies its own development database URL; no database secret is required. Use synthetic data in this development database. Cloud snapshot retention of container data has not been verified.

For an existing database, set `DATABASE_URL`, run `npm run build`, then `npm start`. `GET /api/health` verifies database connectivity. Additive database migrations run at startup. `npm run dev` serves the frontend alone.

## Validate

```bash
npm run check:release
npm audit --omit=dev
```

The full test suite includes API checks using PGlite and needs no external database. For real browser checks, start the local app, use Chromium, and run:

```bash
node scripts/check-base-language-browser.mjs
```

This creates a synthetic local account and checks registration, preference persistence, failed saves, logout races, independent target selection and a complete lesson. `CHROMIUM_BIN` can select the Chromium executable.

With the development PostgreSQL container running, `node scripts/check-base-language-migration.mjs` creates and removes its own isolated database to verify upgrading the previous user schema, preserving existing records, and repeating migrations safely.

See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup and release validation. Email verification, password reset and paid bookings remain outside the current implemented account flow.
