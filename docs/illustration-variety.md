# Contextual illustration catalogue

The additional-language panorama override is removed from headers, Practice Studio cards and lesson thumbnails. Living-map artwork and restoration are independent and stay on the country panorama path.

Each of the six additional languages has twelve local everyday scenes: station, cafe, market, home, work, study, nature, city, health, travel, food and culture. Ten header sections select ten different scenes for each language. All ten languages use the original Practice Studio card slots and the same image sizing/layout. The original four languages also receive additional library, classroom and listening illustrations.

The lesson assignment catalogue follows the visible chapter order separately for every language and CEFR level. It picks related contexts, balances scene usage and excludes images used by the preceding two lessons. Choices are stable across reloads, layout switches and practice attempts. Questions, answers, scores and learner-entered content do not select decorative artwork.

Generated sources are packaged as lazy-loaded 960 by 540 WebP assets. The image manifest records their exact packaged and source hashes and prompt summaries. Rebuild lesson assignments after a course-order or scene-pool change with `node scripts/build-illustration-assignments.mjs`. Run `node --test illustrated-variety.test.mjs approved-design.test.mjs country-worlds.test.mjs` and the production build after packaging all assets.
