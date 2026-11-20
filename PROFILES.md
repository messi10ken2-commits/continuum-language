# First-time setup and teacher discovery

Learners choose learning languages, an initial language, an optional goal, and either an A1–C1 course starting level or placement assessment. Self-selection is not an assessed CEFR result. Completing assessment setup opens Level test. The language selector and course level controls remain available afterward. Existing accounts without a profile are asked to complete setup once; existing progress is preserved.

Teacher profiles require a public name, photo, headline, biography, teaching languages, spoken languages/proficiency, experience, approach, qualifications, time zone, introduction video link, and an accuracy/publication confirmation. Photos are resized in the browser and stored with the profile. Video introductions link to the teacher's YouTube/Vimeo video. Optional credential notes remain private to the teacher and reviewers. Do not collect identity documents here.

Draft → pending → approved / changes_requested. Saving an edit hides the profile; resubmission requires another review. Reviews are revision-checked and audited. Profile approval means editorial review, not certified identity or qualifications. Only approved profiles appear in the public language-filtered directory. Learner bookmarks are account-private and never create teacher access to learning records. Published teachers can be contacted through a separate, explicit language-sharing consent. Pilot class proposals, messages and follow-up assignments are available in Classes; online payments remain disabled. See docs/classroom-pilot.md.

## Provisioning reviewers

There is no public signup as an administrator and no first-user auto-admin rule. Confirm the operator's existing Continuum account UUID, then run in a trusted environment with the deployment's DATABASE_URL:

    node scripts/grant-profile-reviewer.mjs <confirmed-account-uuid>

The UUID is displayed in Account. Never assign reviewer access by an unverified signup email alone. The reviewer must sign in again (or refresh) to see **Review teachers**. All review APIs check the platform_reviewers table. Reviewers cannot approve their own profile. The dashboard can approve/publish, request changes/hide, and review submitted private notes. Feedback is visible to the teacher. No automatic approval is performed.

## Validation

    node profiles-api.test.mjs
    node profiles-render.test.mjs
    npm run build

The API integration test uses the actual server with an isolated in-memory PostgreSQL engine. It does not create production accounts.

## Owner administration

`CONTINUUM_OWNER_USER_ID` is a server-only deployment setting containing the confirmed owner's learner account UUID. Only that authenticated learner gets the Admin navigation and editorial correction endpoints. It is never accepted from request bodies or client storage. Removing the setting revokes this owner path immediately on the next deployment; independently provisioned reviewer roles remain separate. The dashboard provides aggregate account/profile counts, language/status/name filters, publication decisions, review history, and owner-only headline/biography/approach corrections. Corrections increment the profile revision, create an audit entry, notify the teacher via saved feedback, and return the profile to pending. It does not modify language or qualification claims.
