# Illustrated journey passport

Every earned achievement now has local illustrated stamp artwork and an accessible enlarged detail view. Opening Journey passport puts the collection before companion settings. Existing server-earned chapter/return/rhythm records appear automatically; no data migration or repeat learning is required.

There are 185 chapter designs plus two special achievements in each of four learning languages, for 193 distinct SVG compositions. `public/passport-stamps/manifest.json` maps language + stable achievement ID to artwork, title, level, subject and SHA-256. Each composition combines an existing original Continuum watercolor scene, a topic-specific ink emblem, language palette, border, crop, postmark and deterministic edition code. Embedded image bytes make each SVG self-contained. Artwork is decorative and never affects grading or achievement conditions. No new external provider is needed.

Regenerate using `scripts/build-passport-art.cjs` with sharp available through NODE_PATH. The generator fails on unmapped chapter themes. No credentials or learner data enter the artwork. A future chapter needs a generated manifest entry.

The collection only displays server-earned stamps, explicitly labeled Earned. Native dialog details include chapter title, language, CEFR level where applicable, achievement condition and existing earned date. Dates follow the display locale. Achievements with no recorded date do not receive fabricated dates. Escape, close button and backdrop close restore keyboard focus. Phone layout uses two columns and a viewport-bounded scrolling dialog; reduced-motion preferences disable hover transitions.

Validation: complete 193-asset mapping, distinct hashes, valid embedded watercolor assets and reviewed UI translations; historical stamp browser scenarios in all six display locales, 320/390/768/1440 widths, loaded/enlarged art, original earned date, Escape and focus restoration. Original achievement logic remains covered by adventure/bond API tests.
