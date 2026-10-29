# Instagram visual autopost — Continuum × Kotoba

Dedicated to Instagram: **three image + caption posts per week**, Monday/Wednesday/Friday **19:00 Kuala Lumpur time**.

Topics rotate: Monday broad language-learning tips; Wednesday verified Continuum pre-launch behind-the-scenes; Friday language-learning mindset. No Japan-only tips. Caption text is generated with the existing OpenAI API key and an approved fallback caption is used if generation fails. Visuals are original illustrated 1080×1080 PNG branded cards rendered locally on GitHub Actions (CairoSVG) without paying a separate image-generation service. These are illustrations, NOT authentic application screenshots. They follow the color system of the earlier image examples, but are different template assets.

Workflow: `.github/workflows/instagram-autopost.yml`
Script: `social_automation/instagram_poster.py`
Unit tests: `social_automation/test_instagram_poster.py`

## Setup and automatic activation

- Reuse repository secrets **BUFFER_API_KEY** and **OPENAI_API_KEY** already configured for X and Threads.
- Reuse variable **SOCIAL_AUTOPUBLISH_ENABLED=true** (same master stop switch as the existing system).
- Instagram account must be a **Professional (Business or Creator)** account connected to Buffer using automatic publishing, not a personal-account notification-only channel.
- With exactly one Instagram channel connected to Buffer, the script discovers it automatically. If several Instagram channels are connected, set repository Actions variable **INSTAGRAM_CHANNEL_ID** to the appropriate channel ID.
- The workflow installs CairoSVG, verifies tests, looks 9 days ahead, checks Buffer for an existing scheduled/sent entry at each target date/time, creates a public PNG on a dedicated GitHub branch `instagram-media`, and schedules an **automatic** Buffer image post with caption and attachment URL.
- Image URLs use `raw.githubusercontent.com/<repo>/instagram-media/assets/instagram/YYYY-MM-DD.png`, hosted via the repository's public GitHub branch. The workflow verifies HTTP 200 and PNG signature before sending a URL to Buffer.
- The media branch is created automatically and contains only graphics. The existing X/Threads workflow and queue are not modified.
- GitHub scheduled workflows can be late or missed; four daily checks and a nine-day lookahead reduce gaps. Missed past slots are not backfilled.
- The new workflow starts on merge/push of its own file to `main` and then regularly checks four times a day. Future edits to unrelated app files do not trigger extra Instagram jobs.
- Manual workflow dispatch defaults to **dry_run=true**: it checks rendering, but does **not** queue or publish. Set dry_run=false only when intentionally scheduling real posts.
- To stop new automated posts, set `SOCIAL_AUTOPUBLISH_ENABLED=false` and separately pause already scheduled Buffer posts if needed.

**Buffer media requirement:** assets must be publicly accessible PNG/JPG files, and Instagram requires a properly connected Professional account for actual automatic publication. If Buffer is not connected or rejects publishing, the GitHub workflow fails visibly; it never claims success without a confirmed image attachment.

**Caution:** The Wednesday factual brand brief describes Continuum's status as of October 2026. Update this content when Continuum officially launches so you don't continue posting pre-launch statements afterward.

**Future expansion:** swap a curated approved image library or authentic, permission-checked Continuum interface screenshots into the renderer if desired.