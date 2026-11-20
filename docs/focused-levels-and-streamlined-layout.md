# Focused practice and streamlined photography layout

AI Conversation is unchanged. Focused Practice now selects both free core and Premium tasks by the chosen A1–C1 band in English, Spanish, Portuguese and Japanese. These are editorial task difficulties, not assessed proficiency or certification.

## Content and records

- Four visible Premium situations, three skills, five bands, four languages: 240 distinct task IDs.
- A1 uses shorter, explicitly authored passages and simple scenario-specific response prompts. A2 retains practical details. B1 adds reasons and confirmation; B2 adds conditional arrangements and alternatives; C1 adds evidence limitations and proportionate recommendations.
- Listening scripts explicitly contain the information needed for their answer keys. Production prompts, models, target lengths and speaking durations vary with difficulty. Models are structure examples, not complete mandatory answers.
- All 60 historical task IDs remain unchanged and resolvable. New attempts use level-specific IDs; existing submissions, grading, retry keys and teacher language-sharing permissions retain their existing contracts.
- Passage/model audio uses the existing private Premium speech endpoint with the task's locale. Server-only content stays outside the public client and free catalog. The catalog exposes metadata only.
- New instructions, questions and options have reviewed interface strings in Japanese, Spanish, Portuguese, Chinese and French; target-language passages remain in the learning language.

## Navigation and layout

Selecting Review, Exclusive courses or Focused practice replaces the Studio menu with the destination. Back restores the menu. Focus and scroll use the actual document or RPG content pane. Empty destinations retain a full page height so browser maximum scroll does not leave the heading below unrelated content. Task entry uses the same container-aware behavior. Stale Premium task requests cannot reopen content from a previous language/level after a selection change or unmount.

Photography mode removes large scenic page banners and the overview map/discovery panel. The conventional Learn chapter list, contextual lesson photographs, learning records, daily activity and assessments remain available. Onboarding illustrations/photos and teacher operational banners are preserved. Illustrated mode retains its full-screen animated RPG world, facilities, map and shared records.

## Verification commands

- `npm run test:qa`
- `npm run audit:language`
- `npm run build`
- `npm run check:runtime`
- `npm run test:focused:browser` with `PLAYWRIGHT_MODULE` pointing to installed Playwright; `QA_BROWSERS=chromium,webkit` where available.
- `npm run test:rpg:browser`, `npm run test:journey:browser`, and `node scripts/qa-lesson-session.mjs`.

Browser suites use disposable PGlite accounts and disabled AI providers. They do not test live payment charges or make subjective claims about provider voice quality.
