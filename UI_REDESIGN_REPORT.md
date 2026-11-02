# Continuum platform UI/UX redesign

Implemented 2 November 2026. Base: `a2805317be776b415f81c57afac0cf9b8aab74d8`.

## Presentation changes

The existing React application, services and records remain the foundation. The opt-in `continuum-ui` root scopes the new presentation. Photo and Illustration use separate compositions and share functional components, navigation and saved state.

| Area | Implemented presentation |
| --- | --- |
| App shell and navigation | Compact brand, language and world-style controls; five learner destinations; safe-area-aware bottom bar; desktop sidebar; keyboard focus treatments. Owner Admin entry remains available from Account and the desktop sidebar. |
| Photo Overview | Cultural photograph with overlaid title, floating course-progress panel, continue action and actual tracked activity. Existing memory, assessment, recurring patterns, skill records and learning history remain accessible. |
| Illustrated Overview | Immersive, edge-to-edge interactive learning map followed by the existing companion, passport, quests, milestones and activity panels. |
| Learn and chapters | Level selector, live resume/review/start action, course-progress bar, prominent class-derived focus, chapter disclosures, illustrated/photographic chapter art, connected lesson list and retained perfect-score badges. All activities, checkpoints, level reviews, sound studios and character studios remain reachable. |
| Lesson introductions and exercises | Focused layout, scenic question media, stronger prompt hierarchy, distinct answer states, audio controls, feedback, reference panels, recording/writing surfaces and mobile image dialogs. Applies to ordinary, checkpoint and exclusive lesson players. |
| Practice Studio | Photo mode uses a featured conversation card and paired activities; Illustration uses scenic story strips and the selected companion. Both expose conversation, pronunciation, reviews, focused practice, class follow-up and exclusive courses. |
| AI Conversation and reviews | Scenario cards, voice stage, transcript bubbles, composer, mode controls, saved history, corrections, communication feedback and speaking-goal panels. Scenic banners are removed during focused secondary flows. |
| Assessment and CEFR reports | Placement ring, actual score panel, skill cards, evidence details, questions, response tasks, consent and history surfaces. Provisional placement and unassessed skills retain their existing truthful labels. |
| Memory and progress | Learning shortcuts, evidence/history disclosures, activity period controls, recurring patterns, skill submissions and supporting audio/production feedback. |
| Classes and teachers | Mode-specific section art; class tabs, booking and teacher cards, discovery filters, messages, assignment/feedback cards and lesson follow-up. Actual tutor data remains unchanged. |
| Scheduling and teacher workspace | Availability, calendar/time picker, time-zone controls, slot choices, schedule modes, learner records, notes, assignments and teaching insights use the new scoped components. |
| Account | Identity, language-specific learning profile, actual tracked activity, illustrated journey collection, grouped preferences and nested account/sharing/support controls. Owner membership preview moves into Account. |
| Membership | Existing subscription, benefit, ticket, invitation and Premium course surfaces receive the new component treatment. Billing behavior is unchanged. |
| Onboarding and preferences | Both world styles can be selected before sign-in; language, goal, study rhythm, level selection and profile forms use the new visual language. |
| Privacy and support | Standalone privacy settings, consent toggles, support contacts, message threads and forms receive scoped presentation. No privacy permissions were changed. |

## Language and asset coverage

All ten learning languages remain supported: English, Spanish, Brazilian Portuguese, Japanese, Mandarin Chinese, Korean, French, German, Modern Standard Arabic and Italian.

Photo landscapes now use distinct attributed local photographs for all ten languages. New photographs cover Shanghai, Seoul, Paris, Berlin, Marrakech and Rome; Portuguese uses the existing Brazilian image. Credits are retained in the app and `public/visual-credits.html`.

Illustrated practice cards now use six distinct contextual scenes for each learning language rather than sharing unrelated countries' art. Existing approved illustrations, panoramas and companions are retained. New interface labels have offline translations in all nine non-English display languages.

## Preserved behavior and data

- No server, API, database schema, authentication, billing, deployment configuration, course-content or audio-source files were changed.
- Existing account records, lesson IDs, drafts, seeds, scores, bookings, notes, consent and sharing permissions remain in their existing stores.
- Mode switching still uses the existing account-scoped layout preference and shared progress.
- Map drawing still uses `LivingMap`, its panoramic layers and existing motion components. The original four languages retain `CurveTrain`; the added six do not gain railway features.
- Map chapter spacing now accommodates two-line labels on narrow screens. Dragging, zooming, chapter selection, pause/replay, restoration phases and unlock logic remain intact.
- `OwnerDashboard.jsx`, `owner-console.css` and administrative backend modules are unchanged. Admin and teacher-review routes never receive the new CSS root. Their existing shell, permissions and capabilities remain in use.

## Verification

- Node 24.22.1 runtime check and Vite production build pass.
- Existing API, content, audio-integrity, assessment, speech, billing, class, teacher-sharing and render suites are run against disposable local data and simulated external providers. Final suite counts are reported with the release handoff.
- New regression tests check CSS isolation, ten distinct credited photo landscapes, and complete activity coverage for both presentations in every language and course band.
- Browser checks covered all ten language course screens in both modes at 390 pixels, plus the five primary destinations in both modes at 320, 390, 768 and 1440 pixels: 60 checks with no detected horizontal overflow or broken loaded images.
- Screenshots were visually inspected during the phone-sized Overview, Learn and illustrated Practice checks. Header conflicts and narrow-map label collisions found during this work were corrected.
- Locale coverage and interface-template audits pass. Existing translations take precedence over added copy.

## Verification limits

The redesign should not be described as a pixel-identical reproduction of every reference screen. Reference sample people, scores and dates were replaced with actual application state, and existing artwork was reused.

Not every nested screen received a manual browser inspection. The preview browser blocked further populated-account checks; teacher and secondary workflows rely on the automated API/render coverage and scoped responsive styles. Physical iOS/Android device checks and a formal accessibility audit were not performed.

No live paid AI generation, real microphone recording, payment, refund or teacher payout was executed. Those integrations retain existing implementations and are covered by the existing simulated-provider tests. The existing main-bundle size warning remains; this release does not introduce code splitting.

## Release

The release targets the existing repository's `main` branch and the existing Railway production service `continuum-language` in project `Continuum Language`. No new production application, database or environment is created. The verified commit, Railway deployment status and production health result are recorded in the release handoff.
