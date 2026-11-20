# Continuum × Kotoba — AI → Buffer → X & Threads

**Standalone social automation:** nothing in the Continuum app, learner database, Railway deployment, or payments is changed.

## How it works

- GitHub Actions performs recovery checks at **02:23, 08:23, 14:23, and 20:23 Kuala Lumpur time** every day. Runs inspect today's remaining publish slots plus the next **two days**. Any missing future posts are generated and scheduled automatically. Existing slots are skipped, so successful retries do not pay for duplicate AI generation.
- GitHub cron runs are best-effort and can be delayed or dropped. These four checks and the two-day queue buffer provide resilience, but no GitHub-only setup guarantees an exact trigger time.
- Each day at **09:00, 15:00, 21:00 Malaysian time**, Buffer automatically publishes one post to each of X and Threads.
- **Special first day (default: 2026-10-19, Kuala Lumpur time):** the **09:00** post on both **X** and **Threads** is a fixed brand introduction: Kotoba is already live; Continuum is still being developed; language connects people and cultures. The other **four posts** in the six-post batch cover requesting receipts in Japanese, with platform-specific wording. There are two welcome posts, not one, because each social account needs its own first post.
- Regular days afterward: **4 English-language posts and 2 posts in the same rotating non-English language**, one on X and one on Threads.
- **Updated 2026-10-27:** The **21:00 development diary posts** (X and Threads) now reflect Continuum's **late-stage pre-launch status** and rotate through concrete, verified themes: connected learning memory, teacher/learner pilot workflows, learner-friendly study maps, lesson/audio QA, mobile polish and language consistency. They are still truthful about pre-release testing: no release date, final sign-off, completed paid-class checkout or public availability is promised.
- The morning travel-Japanese micro-lessons and afternoon language-learning conversation posts, publishing times, and multilingual rotation are unchanged. On Japanese rotation days, the 21:00 development diary is localized to Japanese, preserving its specific update.
- **Existing queued Buffer posts are never overwritten by automation.** If the queue already contains an older development-diary post, update it manually in Buffer. New copy is generated only for unscheduled slots; the recovery workflow skips filled slots.
- The progress brief is grounded in the 2026-10-27 development stage and should be revised after the official Continuum launch to avoid stale pre-launch statements.

- The day-by-day language cycle is **Japanese → Portuguese → Spanish → French → Simplified Chinese → repeat**, starting **2026-10-20** (the first day after the default launch introduction). The language is calculated from the local publication date so retries cannot change it, and both channels are always synchronized.
- On **Japanese** days, **21:00** posts on both platforms are about **Continuum's in-development behind-the-scenes story**, written in Japanese; **never translate Japanese-learning tips into Japanese**.
- On Portuguese, Spanish, French, or Simplified Chinese days, **09:00** posts on both platforms teach **practical Japanese for travelers** in that target language (Japanese examples may appear). The other four posts remain in English. Afternoon remains interactive language-learning commentary and evening remains honest development updates.
- The first day's **two welcome posts and four receipt tips stay exactly as previously approved and scheduled in Buffer**. No change to existing Buffer queue is necessary; new localization applies only to later dates. The first day is unaffected by this rule.
- Each regular day uses an additional small OpenAI request to adapt the X and Threads pair, so API usage costs increase somewhat compared with one request. The model is prompted for native-sounding language, but occasional mistakes remain possible; review weekly.
- To postpone the first day, add or adjust the **GitHub Actions repository variable** `INTRO_POST_DATE` using `YYYY-MM-DD`. Preview in Dry Run before enabling scheduling. Its default is `2026-10-19`; if the first public batch will be on a different date, you **must** change this variable first.
- Keep `SOCIAL_AUTOPUBLISH_ENABLED` unset/false until the two introductory drafts and Buffer queue are reviewed. Do not set it true just to preview: Dry Run works while publishing is disabled.
- The script checks Buffer's existing **scheduled and sent** posts before adding new ones, to avoid repeating a slot after retries. Before the first batch, confirm no older post is queued earlier than the introduction.
- **30-day trial:** October 18–November 16, 2026 inclusive, Malaysia publication dates. No new posts scheduled afterward, including during the lookahead period.
- **Disabled by default.** Merely merging this PR does not enable public posting.

## Connect accounts and activate

1. Register at https://buffer.com and connect the existing **X** and **Threads** accounts. When connecting Threads, sign in to the corresponding Meta/Instagram account.
2. At https://buffer.com/api (Buffer API settings), generate a personal API key. Keep it private.
3. Create a funded OpenAI API project/key at the OpenAI API platform. ChatGPT Plus does not include API credits. Set a modest API budget alert/limit.
4. In the GitHub repo open **Settings → Secrets and variables → Actions → Secrets** and add two repository secrets:
   - BUFFER_API_KEY
   - OPENAI_API_KEY
5. Under **Actions → Variables**, optionally add publicly safe values:
   - KOTOBA_URL — an actual tested https URL for Kotoba
   - CONTINUUM_URL — an actual tested https URL for Continuum
   - OPENAI_MODEL — optional; default is gpt-4.1-mini
   - X_CHANNEL_ID and THREADS_CHANNEL_ID — only if Buffer contains more than one channel for a social network
6. Merge this **draft PR** after reviewing it. Run the GitHub Actions job manually once (or allow daily cron). It will do nothing while posting is disabled.
7. To authorize real automatic posting, add GitHub Actions variable **SOCIAL_AUTOPUBLISH_ENABLED = true**.
8. Open **Actions → Continuum Kotoba Social Autopost → Run workflow**. After it succeeds, open Buffer's calendar and verify six posts are queued for tomorrow (three per account). Monitor the first day's posts.

Never paste API keys into a chat, public issue, README, or source file.

## No-account demonstration

Run locally with Python 3.12:

    python social_automation/poster.py --demo --date 2026-10-18

With credentials set in your own private environment, run a fresh AI text generation dry run without queuing posts:

    python social_automation/poster.py --dry-run

Note: dry run still uses the OpenAI API (costs may apply) and queries your Buffer account.

## Stop button

Set the GitHub variable SOCIAL_AUTOPUBLISH_ENABLED to false to stop **new scheduling**. Also **pause or delete any already queued posts in Buffer** if you need to prevent them from going live.

## Operational notes

- Buffer Free supports three connected social channels and ten pending scheduled posts per channel. The rolling buffer holds at most three slots for today and six slots for the next two days (nine per channel); additional manually queued content can consume remaining capacity. If Buffer rejects a post, the run fails visibly and a later check retries missing slots.
- GitHub scheduled workflows use UTC and may run late. The retry cron uses 00:23, 06:23, 12:23 and 18:23 UTC (08:23, 14:23, 20:23 and 02:23 in Malaysia). Buffer's UTC dueAt field governs publication time. Recovery skips already-past slots and requires at least 10 minutes of lead time to schedule a new post.
- Manual **Run workflow** with **dry_run unchecked** also repairs missing slots in the rolling window. **Dry run** generates only a preview for tomorrow, avoiding unnecessarily expensive previews. Use `--date YYYY-MM-DD` for an explicit single-date repair.
- Verify the new configuration is active by checking the next green run's log for `Recovery check complete`. A green result with `0 missing Buffer posts scheduled` is normal when Buffer already has everything queued.
- If an account is disconnected, locked, or the queue is paused, the automation refuses to schedule.
- The OpenAI model may still produce imperfect language or factual claims despite automated checks. Review Buffer's calendar periodically.
- No external link is invented: only values from validated environment variables are ever appended, and only to occasional promotional posts.
- Repeated or automated posting must comply with X and Threads policies; do not raise cadence to spam-like levels.

Developer references:
- https://developers.buffer.com/examples/create-scheduled-post.html
- https://developers.buffer.com/examples/get-scheduled-posts.html
- https://developers.buffer.com/examples/get-channels.html
- https://developers.openai.com/api/docs/guides/structured-outputs

## Organic improvement and shared Instagram vlogs (from November 2026)

- New X/Threads posts use a **best-effort, no-paid-trend-service** snapshot of Google's *Trending Now* RSS exports for the US, UK and Malaysia. Only explicitly language-related trending search terms enter the editor brief; if none match or a feed is unavailable, the evergreen editorial plan continues unchanged. Search interest is **not** presented as X/Threads popularity.
- The same generation also attempts a read-only query for **sent post metrics** from Buffer over an earlier 14-day window. It ranks content only with reported engagement rates or reported interactions divided by views/impressions. Missing metrics are not treated as zeros. Buffer describes post metrics as experimental and access requires a personal API key with `insightsRead`; if unavailable, the regular posts continue with no invented performance conclusions.
- On **Tuesday at 15:00 MYT**, starting **2026-11-10**, if the previous Monday's four-photo Instagram vlog carousel is publicly hosted, X and Threads each receive **the exact same four JPEGs** on their existing afternoon slot. Captions are adapted to platform limits and label the fictional vignette illustrative. The Instagram original remains scheduled for **Monday 19:00 MYT**. No extra images are generated and no additional post slot is added.
- Instagram media is read from `instagram-media/assets/instagram/YYYY-MM-DD-vlog-[1-4].jpg`; URLs are checked before Buffer scheduling. If any photo is missing, the original afternoon learning post is scheduled instead. Existing Buffer posts remain untouched and are never duplicated.
- The existing 09:00 Japanese travel tips, 21:00 pre-launch development updates, and five-language rotation are preserved. Only the Tuesday afternoon topic is swapped when photos exist.
- No additional OpenAI completion/image calls are used for trend/metrics analysis or reposting. The **existing** automatic AI post generation and Instagram image generation are still billable API activity; this is not a guarantee of zero operating cost.
- Trial campaign end is unchanged: **2026-11-16**. To keep this running beyond that date, update the campaign end deliberately after evaluating the pilot.

Sources: https://support.google.com/trends/answer/3076011?hl=en and https://developers.buffer.com/guides/post-metrics

