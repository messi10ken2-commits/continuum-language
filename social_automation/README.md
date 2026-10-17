# Continuum × Kotoba — AI → Buffer → X & Threads

**Standalone social automation:** nothing in the Continuum app, learner database, Railway deployment, or payments is changed.

## How it works

- At **20:23 Kuala Lumpur time** each day, GitHub Actions asks an OpenAI model to write six differentiated posts for **tomorrow**.
- Each day at **09:00, 15:00, 21:00 Malaysian time**, Buffer automatically publishes one post to each of X and Threads.
- The content mix: practical Kotoba Japanese for travelers in the morning; interactive language-learning ideas in the afternoon; Continuum's **in-development** story in the evening.
- The script checks Buffer's existing scheduled posts before adding new ones to avoid repeated scheduling of the same slot after retries.
- **30-day trial:** October 18–November 16, 2026 inclusive, Malaysia dates. No new posts scheduled afterward.
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

- Buffer Free supports three connected social channels and ten pending scheduled posts per channel; the six daily posts fit as long as no other posts fill the queues.
- GitHub scheduled workflows use UTC and may run late. Buffer's UTC dueAt field governs the exact publication time.
- If an account is disconnected, locked, or the queue is paused, the automation refuses to schedule.
- The OpenAI model may still produce imperfect language or factual claims despite automated checks. Review Buffer's calendar periodically.
- No external link is invented: only values from validated environment variables are ever appended, and only to occasional promotional posts.
- Repeated or automated posting must comply with X and Threads policies; do not raise cadence to spam-like levels.

Developer references:
- https://developers.buffer.com/examples/create-scheduled-post.html
- https://developers.buffer.com/examples/get-scheduled-posts.html
- https://developers.buffer.com/examples/get-channels.html
- https://developers.openai.com/api/docs/guides/structured-outputs
