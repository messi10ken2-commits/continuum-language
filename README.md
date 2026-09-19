# Continuum Language

Continuum connects self-study and teacher notes in one learner account. The current release provides a working subjunctive exercise, saved practice results, and teacher sharing by one-time code.

## Included

- Learner and teacher accounts with PostgreSQL-backed sessions
- Server-graded practice results that persist across devices
- Explicit import of earlier browser-only practice results
- One-time teacher sharing codes, access revocation, and class notes
- A public sample preview with CEFR report and additional lessons shown as prototypes

## Run locally

Use a PostgreSQL database and set `DATABASE_URL`. For a local session cookie, leave `NODE_ENV` unset.

```bash
npm install
npm run build
npm start
```

Open `http://localhost:3000`. `GET /api/health` verifies database connectivity. Tables are created at startup. `npm run dev` serves the frontend alone; use the steps above to test account features.

See [DEPLOYMENT.md](DEPLOYMENT.md) for Railway setup and the transition from the older deployment overrides.

## Still in development

Email verification, password reset, paid class booking, audio transcription, and exercises besides the subjunctive preview are not connected yet. The unauthenticated CEFR profile is sample data and is not an official assessment.
