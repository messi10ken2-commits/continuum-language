# Continuum deployment

The app has a Node API and a React frontend. It needs PostgreSQL.

## Reviewed GitHub-to-Railway deployment

Before deploying, run `npm ci`, `npm run check:release` and `npm audit --omit=dev`. The browser check in README.md requires the isolated local app and Chromium. The repository validation workflow performs the automated test/build/audit checks; it does not deploy.

Develop on a feature branch, open a pull request targeting `main`, and obtain review and successful checks before merging. Codex must not merge or deploy without the owner's approval. Railway's native GitHub integration deploys approved commits on `main`; no Railway API token, CLI deployment, or GitHub deployment secret is required.

### Owner: verify Railway in the dashboard

1. Open the existing Railway project and select the Continuum application service in its production environment (not the PostgreSQL service).
2. Open **Settings → Source**. Confirm the connected repository is `messi10ken2-commits/continuum-language`. If disconnected, use **Connect Repo** and authorize Railway's GitHub app for this repository. Confirm no unreviewed commit would deploy before changing the connection.
3. Set or verify the deployment branch is **main**. Under Source, enable automatic deployments if disabled (the enabled state may offer **Disable Auto Deploys**). Do not select the feature branch or manually trigger a deployment for unreviewed work.
4. Enable **Wait for CI** where available. Railway should wait for the GitHub checks on the same commit to succeed before deploying. This supplements GitHub branch protection; it does not configure it.
5. Preserve all existing service variables, build/start overrides, database connections, volumes and payment settings. Keep production secrets in Railway. Do not remove overrides without a separate review of their purpose. The checked-in `railway.json` remains unchanged: `npm run build`, `npm start`, and `/api/health`.
6. After an approved merge, open **Deployments**, select the deployment for that exact main commit, and verify its status is successful. Check the health endpoint and the learner/teacher flows below. A GitHub merge or a green CI run alone does not prove deployment succeeded.

These dashboard settings cannot be established from `railway.json` or the public website URL. They require owner verification; they have not been inspected from this workspace.

### Owner: protect main in GitHub

1. Open the repository's **Settings → Branches → Add branch protection rule** (or an equivalent branch ruleset) and target `main`.
2. Enable **Require a pull request before merging**, require at least one approval, and dismiss stale approvals after new commits.
3. Enable **Require status checks to pass before merging** and select the `validate` job from **Validate application** after its first GitHub Actions run. Require the branch to be up to date before merging.
4. Apply the rule to administrators and prevent bypasses where supported, and disable force pushes and branch deletion. Save the rule. Availability depends on repository visibility and the GitHub plan.
5. Verify an unapproved PR or one with a failing required check cannot be merged. CI alone does not block merging unless these rules are enabled.

The existing validation workflow runs on pull requests targeting `main` and pushes to `main`, using Node 24 and `npm ci` with `package-lock.json`. It runs `npm run check:release` (tests, build, translation coverage) and `npm audit --omit=dev`, with read-only repository permissions and no production credentials. No lint or type-check script exists in this repository, so CI does not invent either check. GitHub Actions execution and branch protection still require verification on GitHub.

Keep `.env` credentials out of Git; the ignore rules cover `.env` and `.env.*`, with exceptions for non-secret example/sample templates. If an earlier Codex environment draft lists `RAILWAY_TOKEN`, remove that obsolete requirement in the environment settings; do not populate it. No Railway token is used by this workflow.

## Current product scope

- Learner and teacher accounts use salted scrypt password hashes and PostgreSQL-backed sessions.
- Courses, lesson drafts, server-graded exercises and assessments support four target languages; earlier browser scores can be imported with an explicit action.
- A learner generates a one-use, 24-hour sharing code for a teacher and can revoke access. Teacher access is restricted to explicitly shared languages and the learner's self-study privacy setting.
- Six Base Language settings are independent of the target language. Translation coverage remains partial and authored translations await educational review; publish this feature as an incremental preview with English fallback. See I18N.md for the remaining scope.
- Authentication is required for learner/teacher screens. Email verification, password reset and paid bookings are not implemented.

## Database and rollout validation

The Base Language migration adds `users.base_language` with the default `en`. It preserves existing users, lesson IDs, assessment records, history and teacher relationships. Keep a verified backup of the production database before rollout and test the migration against a staging copy. Never use `scripts/dev-local.sh` or its trust-authenticated database for production.

After a staging deployment, check `/api/health`, sign in as existing learner and teacher accounts, change Base Language and reload, verify the target language/history remain unchanged, complete one exercise, and confirm teacher language-sharing restrictions. Production cookies require HTTPS when `NODE_ENV=production`.

Local validation has passed the full 156-check suite, production client build, dependency audit, Chromium workflow and a PostgreSQL upgrade simulation using the previous users schema. The migration check preserves synthetic account/history/sharing records and is repeatable. Production/staging infrastructure and migration of actual production accounts have not been validated in this workspace; no production deployment was performed. The existing client bundle-size warning remains a performance consideration, not a suppressed build error.
