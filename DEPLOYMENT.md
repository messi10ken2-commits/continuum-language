# Continuum deployment

The app has a Node API and a React frontend. It needs PostgreSQL.

## Railway setup

1. Add a private PostgreSQL service.
2. On the app service set `DATABASE_URL` to the reference variable `${{Postgres.DATABASE_URL}}` and `NODE_ENV=production`.
3. Deploy this repository. `npm run build` creates the frontend; `npm start` runs the API and serves the frontend. `/api/health` checks database availability. Tables are created on startup.

The production service previously used build-time overrides to inject a newer frontend because the GitHub integration could not write to the repository. After this branch is merged, remove the obsolete `CONTINUUM_*`, `NIXPACKS_INSTALL_CMD`, `NIXPACKS_BUILD_CMD`, `NIXPACKS_START_CMD`, `RAILPACK_INSTALL_CMD`, `RAILPACK_NODE_NPM_INSTALL`, and `NO_CACHE` overrides from the Railway web service, then deploy from the repository. Keep `DATABASE_URL` and `NODE_ENV`. Do not delete the PostgreSQL service or its volume.

## Current product scope

- Learner and teacher accounts use salted scrypt password hashes and PostgreSQL-backed sessions.
- Completed subjunctive exercises are graded and stored on the server; earlier browser scores can be imported with an explicit action.
- A learner generates a one-use, 24-hour sharing code for a teacher and can revoke access. Connected teachers see practice results and can add class notes.
- The unauthenticated preview contains sample learning data. Email verification, password reset, paid bookings, and other exercises still need implementation before a broad release.
