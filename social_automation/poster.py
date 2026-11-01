"""Standalone Continuum × Kotoba AI posting to X and Threads via Buffer."""
import argparse
import json
import os
import sys
from datetime import date, datetime, timedelta, time, timezone
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from zoneinfo import ZoneInfo

TZ = ZoneInfo("Asia/Kuala_Lumpur")
SLOTS = (("morning", 9), ("afternoon", 15), ("evening", 21))
KEYS = tuple(f"{network}_{slot}" for slot, _ in SLOTS for network in ("x", "threads"))
FIRST_DAY_TIP_KEYS = ("x_afternoon", "threads_afternoon", "x_evening", "threads_evening")
FIRST_DAY_INTROS = {
    "x_morning": ("👋 We're Continuum × Kotoba. 🇯🇵 Kotoba is live: practical Japanese for travelers. "
                  "🌍 Continuum is in development: AI self-study + human teachers, with progress connected. "
                  "Our goal? Bring people and cultures closer through language."),
    "threads_morning": ("Hi, world! 👋 We're Continuum × Kotoba.\n\n"
                        "🇯🇵 Kotoba is live: practical Japanese for real-life travel.\n"
                        "🧠 Continuum is in development: connecting AI self-study with human teachers, "
                        "so learning progress can carry across both.\n\n"
                        "Our mission? Make language a bridge between people and cultures. "
                        "Here we'll share Japanese tips and our behind-the-scenes journey. 🌍"),
}

def launch_date():
    """The one approved brand-introduction date, read from configuration."""
    return date.fromisoformat(os.getenv("INTRO_POST_DATE") or "2026-10-19")


def first_day(day):
    """Keep the already approved first-day six-post batch unchanged."""
    return day == launch_date()


# Rotate one non-English language per day, aligned across X and Threads.
# The first day is deliberately excluded; it already has six approved posts.
ROTATION = ("Japanese", "Portuguese", "Spanish", "French", "Simplified Chinese")
MULTILINGUAL_SLOTS = {
    "Japanese": "evening",  # Japanese is for Continuum behind the scenes, NOT Japanese tips.
    "Portuguese": "morning",
    "Spanish": "morning",
    "French": "morning",
    "Simplified Chinese": "morning",
}


def multilingual_plan(day):
    """Return (language, two post keys) or None on/before brand launch day."""
    offset = (day - launch_date()).days - 1
    if offset < 0:
        return None
    language = ROTATION[offset % len(ROTATION)]
    slot = MULTILINGUAL_SLOTS[language]
    return language, ("x_" + slot, "threads_" + slot)

TOPICS = [
    "ordering at a cafe in Japan", "asking for directions in Japan",
    "checking into a hotel", "using a train station", "asking whether a shop accepts cards",
    "polite ways to get someone's attention", "food preferences and allergies without medical advice",
    "requesting a receipt", "understanding simple Japanese greetings",
    "shopping for souvenirs", "asking someone to repeat slowly",
    "useful numbers and counters for travel", "asking where the bathroom is",
    "making a reservation", "understanding polite vs casual language",
    "everyday pronunciation practice", "handling common misunderstandings",
    "small language-learning habits", "making language practice stick",
    "preparing for a first conversation",
]

# Editorial source of truth for the launch-preparation campaign (updated 2026-10-27).
# These are pilot / development facts, NOT claims of a public app release.
PRELAUNCH_PROGRESS_FACTS = (
    "Continuum is approaching its public launch, but is still IN DEVELOPMENT. "
    "Its core concept joins structured AI-supported self-study and human-taught "
    "classes through shared learning memory. Learner/teacher workflows have been "
    "implemented and tested in a trial environment, including scheduling, "
    "class notes, assignments, and teacher feedback. Self-study covers English, "
    "Spanish, Portuguese and Japanese. The team is refining learner-facing "
    "progress views, lesson audio, mobile usability, illustrated learning maps, "
    "daily quests, localization and quality checks. "
    "Do NOT claim app-store approval, an available public paid-class system, "
    "completed payments/payouts, completed final testing, a confirmed launch "
    "date, or generally available features that are still in trial."
)

EVENING_PROGRESS_ANGLES = (
    "We are in the late development phase: explain what is being polished before launch, without promising a date.",
    "Shared learner memory: connect self-study, recurring weak points and teacher feedback across the same learning journey.",
    "Teacher-and-learner pilot workflow: class planning, notes, assignments and feedback are being refined together.",
    "Learning experience polish: chapter maps, daily quests and illustrated progress elements that make studying more engaging.",
    "Quality assurance: check lesson explanations, natural audio, pronunciation, navigation and mobile readability.",
    "Cross-language consistency: review learning content, translations and interfaces across the four study languages.",
    "The human side: show why combining teachers and AI-supported independent learning matters as release gets closer.",
)


def evening_progress_angle(day):
    """Pick a concrete, stable topic based on the publication date."""
    return EVENING_PROGRESS_ANGLES[(day - date(2026, 10, 27)).days % len(EVENING_PROGRESS_ANGLES)]


def api_json(url, payload, token, timeout=30):
    req = Request(url, data=json.dumps(payload, ensure_ascii=False).encode(), headers={
        "Content-Type": "application/json", "Authorization": f"Bearer {token}",
        "User-Agent": "continuum-kotoba-social-automation/1.0",
    }, method="POST")
    try:
        with urlopen(req, timeout=timeout) as resp:
            return json.load(resp)
    except HTTPError as e:
        raise RuntimeError(f"Service HTTP {e.code}: {e.read(350).decode(errors='replace')}") from e
    except URLError as e:
        raise RuntimeError("Could not connect to remote service") from e

def buffer_query(query, token):
    result = api_json("https://api.buffer.com", {"query": query}, token)
    if result.get("errors"):
        raise RuntimeError(f"Buffer GraphQL error: {str(result['errors'])[:350]}")
    return result.get("data") or {}

def q(value):
    return json.dumps(value, ensure_ascii=False)

def discover_channels(buffer_key):
    orgs = buffer_query("query { account { organizations { id name } } }", buffer_key)["account"]["organizations"]
    matches = {"x": [], "threads": []}
    for org in orgs:
        query = f'query {{ channels(input: {{organizationId: {q(org["id"])}}}) {{ id name service isDisconnected isLocked isQueuePaused }} }}'
        for item in buffer_query(query, buffer_key)["channels"]:
            service = str(item["service"]).lower()
            platform = "x" if service in ("twitter", "x") else "threads" if service == "threads" else None
            if platform:
                item["orgId"] = org["id"]
                matches[platform].append(item)
    selected = {}
    for platform in ("x", "threads"):
        override = os.getenv(f"{platform.upper()}_CHANNEL_ID", "").strip()
        candidates = [c for c in matches[platform] if not override or c["id"] == override]
        if len(candidates) != 1:
            raise RuntimeError(f"Expected exactly one {platform} channel (found {len(candidates)}). Connect the channel in Buffer or set {platform.upper()}_CHANNEL_ID.")
        if any(candidates[0][k] for k in ("isDisconnected", "isLocked", "isQueuePaused")):
            raise RuntimeError(f"{platform} channel is disconnected, locked or paused")
        selected[platform] = candidates[0]
    return selected

def target_datetimes(day):
    return {slot: datetime.combine(day, time(hour, 0), tzinfo=TZ).astimezone(timezone.utc) for slot, hour in SLOTS}

def iso(dt):
    return dt.isoformat(timespec="milliseconds").replace("+00:00", "Z")

def scheduled_slots(buffer_key, channels, day):
    expected = target_datetimes(day)
    found = set()
    for org in set(c["orgId"] for c in channels.values()):
        ids = [c["id"] for c in channels.values() if c["orgId"] == org]
        start = min(expected.values()) - timedelta(minutes=1)
        end = max(expected.values()) + timedelta(minutes=1)
        query = ("query { posts(input: {organizationId: " + q(org) + ", "
                 + "filter: {status: [scheduled, sent], channelIds: " + q(ids)
                 + ", dueAt: {start: " + q(iso(start)) + ", end: " + q(iso(end))
                 + "}}}) { edges { node { id dueAt channelId } } } }")
        data = buffer_query(query, buffer_key)
        for edge in data["posts"]["edges"]:
            node = edge["node"]
            due = datetime.fromisoformat(node["dueAt"].replace("Z", "+00:00"))
            for platform, channel in channels.items():
                if node["channelId"] == channel["id"]:
                    for slot, date in expected.items():
                        if abs((due - date).total_seconds()) < 60:
                            found.add((platform, slot))
    return found

def content_schema(keys=KEYS):
    return {
        "type": "object",
        "properties": {k: {"type": "string"} for k in keys},
        "required": list(keys),
        "additionalProperties": False,
    }

def extract_response_text(result):
    parts = [item.get("text", "") for output in result.get("output", [])
             for item in output.get("content", []) if item.get("type") == "output_text"]
    if not parts:
        raise RuntimeError("AI returned no text")
    return "".join(parts)

def generate(day, editorial_brief=""):
    key = os.environ["OPENAI_API_KEY"]
    launch = first_day(day)
    keys = FIRST_DAY_TIP_KEYS if launch else KEYS
    topic = "how to ask for receipts in Japan" if launch else TOPICS[(day.toordinal() - 1) % len(TOPICS)]
    guidance = f"""Create {len(keys)} ORIGINAL posts for Continuum × Kotoba for {day.isoformat()}, focused on {topic}.
Audience: adults worldwide; English main language, Japanese examples with accurate translation when useful.
Brand truth: Kotoba is already launched and offers practical Japanese for travelers.
Continuum is an IN-DEVELOPMENT project combining AI self-study and human language
teaching with the goal of connecting learners' progress. Never claim Continuum is launched,
publicly available as an app, or that pilot-only features are already publicly available.
No made-up statistics, trending news, false service claims, or misleading statements.
X posts max 235 characters; Threads posts max 365. No URLs; at most one hashtag.
Write distinct messages for each network and slot. Use friendly, natural English.
"""
    if launch:
        guidance += """LAUNCH DAY: X and Threads FIRST MORNING posts are fixed brand
introductions and do not need AI generation. Generate ONLY four remaining posts
(x_afternoon, threads_afternoon, x_evening, threads_evening), ALL about asking for
receipts in Japan. Make every one practically useful and distinct: e.g.
レシートをください (Please give me the receipt) vs 領収書をください
(Please give me a formal receipt), polite requests or common register situations.
Give accurate Japanese and English; avoid claiming every shop has the same policy.
No generic language tips, product pitches, or development updates in these four.
"""
    else:
        guidance += f"""Morning: a practical Japanese travel mini-lesson.
Afternoon: an engaging language-learning insight or thoughtful question.
Evening: a concrete behind-the-scenes UPDATE about Continuum's real, late-stage
development progress. Move beyond generic "we're building something" statements.
Product facts (editorial grounding; do not copy wholesale): {PRELAUNCH_PROGRESS_FACTS}
The specific angle for this publication date: {evening_progress_angle(day)}
For x_evening and threads_evening ONLY: convey that launch is getting closer
while final checks and refinements continue. Name one specific verified element
from the progress facts and share its user benefit or the current polishing work.
Write TWO DISTINCT, believable posts, each with a human, conversational tone.
Do NOT claim that Continuum has officially launched or is ready to purchase.
Do NOT promise an exact launch date, finalized payment/payout support, perfect
test results, any exact completion percentage, or unrealized live capabilities.
Do NOT repeat the same generic pitch daily. No empty hype like "big news soon".
Keep the usual Japanese travel tips in the morning and the conversational
learning post in the afternoon UNCHANGED in editorial purpose and cadence.
"""
    if editorial_brief and not launch:
        guidance += ("\nEDITORIAL SIGNALS FOR THIS GENERATION (may be incomplete):\n"
                     + editorial_brief[:1800]
                     + "\nUse them only to refine hooks, relevance or helpfulness. "
                       "Never claim that a social topic is trending without a source. "
                       "Do not copy past posts or infer product usage from reactions.\n")
    guidance += "Output ONLY a JSON object with these keys: " + ", ".join(keys)
    payload = {
        "model": (os.getenv("OPENAI_MODEL") or "gpt-4.1-mini"),
        "instructions": "You are a careful social-media editor for a global educational startup. Follow user-provided brand facts strictly. Return JSON conforming to the schema.",
        "input": guidance,
        "text": {"format": {"type": "json_schema", "name": "social_posts", "strict": True, "schema": content_schema(keys)}},
    }
    response = api_json("https://api.openai.com/v1/responses", payload, key, timeout=70)
    posts = validate(json.loads(extract_response_text(response)), keys)
    if launch:
        posts.update(FIRST_DAY_INTROS)
        print("First launch day: two welcome posts + four receipt tips.", flush=True)
    else:
        posts = localize_pair(day, posts, key)
    return validate(posts)

def localize_pair(day, posts, key):
    """Replace exactly one English post per network with the same target language."""
    plan = multilingual_plan(day)
    if plan is None:
        return posts
    language, keys = plan
    source_posts = {k: posts[k] for k in keys}
    print(f"Day's synchronized multilingual language: {language} ({keys[0]}, {keys[1]})", flush=True)
    special = (
        "IMPORTANT: This is a Continuum founder/build-in-public progress update, NOT "
        "a Japanese language-learning tip. Write naturally and fully in Japanese "
        "for Japanese-speaking readers. Preserve the specific late-stage "
        "development / testing insight from the source text; do not dilute "
        "it to a generic vision pitch. Continuum is NOT publicly launched. "
        "Never invent a launch date or represent pilot features as public."
        if language == "Japanese" else
        "Translate/adapt the practical travel-Japanese teaching post into natural, "
        f"fluent {language} for speakers of that language who are learning Japanese. "
        "Keep the Japanese phrase as an example, but explain its meaning and context "
        f"ENTIRELY in {language}, not English. This is for non-Japanese learners."
    )
    instructions = f"""Adapt the two social posts for {day.isoformat()} into {language}.
Language must be IDENTICAL across X and Threads, but do not copy the posts verbatim.
{special}
For both posts: write a real native-sounding {language} post, not a bilingual paragraph,
not an English translation, and not a list of different languages. Keep the intended
topic, project names, accurate facts and cautious in-development status; do not invent
new product or feature claims. Return exactly the two requested JSON keys.
X length 30-235 Unicode characters; Threads length 30-365 Unicode characters.
No URLs, and no more than one hashtag per post.
Original posts to adapt:
{json.dumps(source_posts, ensure_ascii=False)}"""
    payload = {
        "model": (os.getenv("OPENAI_MODEL") or "gpt-4.1-mini"),
        "instructions": "Expert multilingual localization editor for a global learning platform. Use only the requested target language for each post; no unsupported claims. Produce valid JSON only.",
        "input": instructions,
        "text": {"format": {"type": "json_schema", "name": "localized_social_posts",
                            "strict": True, "schema": content_schema(keys)}},
    }
    result = api_json("https://api.openai.com/v1/responses", payload, key, timeout=70)
    localized = validate(json.loads(extract_response_text(result)), keys)
    if any(localized[k].casefold() == posts[k].casefold() for k in keys):
        raise ValueError("AI returned an unchanged English post instead of a localization")
    if language == "Japanese" and any(
        not any("\u3040" <= ch <= "\u30ff" or "\u4e00" <= ch <= "\u9fff" for ch in localized[k])
        for k in keys
    ):
        raise ValueError("Japanese localization contains no Japanese characters")
    if language == "Simplified Chinese" and any(
        not any("\u4e00" <= ch <= "\u9fff" for ch in localized[k])
        for k in keys
    ):
        raise ValueError("Chinese localization contains no Han characters")
    posts.update(localized)
    return validate(posts)


def validate(posts, keys=KEYS):
    if set(posts) != set(keys):
        raise ValueError("AI output missing required posts")
    all_text = []
    for key in keys:
        txt = posts[key].strip()
        limit = 235 if key.startswith("x_") else 365
        if not 30 <= len(txt) <= limit:
            raise ValueError(f"Invalid content length for {key}: {len(txt)}")
        if "http://" in txt or "https://" in txt:
            raise ValueError(f"AI inserted unverified URL into {key}")
        if txt.lower() in all_text:
            raise ValueError("AI generated identical posts")
        all_text.append(txt.lower())
        posts[key] = txt
    return posts

def normalized_url(name):
    url = os.getenv(name, "").strip()
    if not url:
        return ""
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.netloc or parsed.username or parsed.password:
        raise ValueError(f"{name} must be a valid HTTPS URL")
    return url

def with_link(text, platform, slot, day):
    if first_day(day):
        return text  # The launch batch should be strictly intros + receipt tips.
    plan = multilingual_plan(day)
    if plan and (platform + "_" + slot) in plan[1]:
        return text  # Keep a multilingual post fully in its selected language.
    if day.toordinal() % 4 != 0 or slot not in ("morning", "evening"):
        return text
    url = normalized_url("KOTOBA_URL" if slot == "morning" else "CONTINUUM_URL")
    if not url:
        return text
    new_text = text + "\n" + url
    if platform == "x" and len(text) + 25 > 280:
        return text
    if platform == "threads" and len(new_text) > 500:
        return text
    return new_text

def schedule(buffer_key, channel_id, text, when, image_urls=None):
    """Schedule text or an existing four-image Instagram vlog on X/Threads."""
    if image_urls and len(image_urls) != 4:
        raise ValueError("Shared vlog must contain exactly four images")
    assets = (", assets: [" + ", ".join("{image: {url: " + q(url) + "}}"
                                      for url in image_urls) + "]") if image_urls else ""
    query = f'''mutation {{ createPost(input: {{text: {q(text)}, channelId: {q(channel_id)},
        schedulingType: automatic, mode: customScheduled, dueAt: {q(iso(when))},
        aiAssisted: true{assets}}}) {{
          ... on PostActionSuccess {{ post {{ id dueAt assets {{ id mimeType }} }} }}
          ... on MutationError {{ message }}
        }} }}'''
    result = buffer_query(query, buffer_key)["createPost"]
    post = result.get("post")
    if not post:
        raise RuntimeError(f"Buffer refused scheduled post: {result.get('message', 'unknown error')}")
    if image_urls and len(post.get("assets") or []) != 4:
        raise RuntimeError("Buffer did not confirm all four reused vlog images")
    return post["id"]

def demo_posts():
    return {
      "x_morning": "In Japan, a simple 'Sumimasen' (すみません) can help you politely get someone's attention. A small phrase, a smoother trip. 🇯🇵",
      "threads_morning": "One useful travel word in Japanese: すみません (sumimasen). You can use it to get someone's attention politely. What Japanese travel situation would you like to practice?",
      "x_afternoon": "A few minutes of speaking practice can be more meaningful than memorizing a long word list. Which phrase would you actually use today?",
      "threads_afternoon": "Try this today: pick one practical phrase and say it out loud in a real-world scenario. Not just memorization—rehearsal. What's one phrase you wish you knew in another language?",
      "x_evening": "We're building Continuum around one idea: your progress shouldn't vanish between self-study and lessons with a teacher. Still in development. 🌍",
      "threads_evening": "Why should progress from independent study feel separate from progress with a teacher? That's one of the problems we're trying to solve with Continuum. We're still building, and we'll share the journey here.",
    }

LOOKAHEAD_DAYS = 2
MIN_SCHEDULING_LEAD = timedelta(minutes=10)


def posting_dates(today, explicit_date=None, dry_run=False):
    """Normal runs check today plus two future dates; manual preview stays one day."""
    if explicit_date:
        return (explicit_date,)
    if dry_run:
        return (today + timedelta(days=1),)
    return tuple(today + timedelta(days=offset) for offset in range(LOOKAHEAD_DAYS + 1))


def missing_future_slots(day, already, now):
    """Never create duplicates or try to schedule a slot that has already passed."""
    due = target_datetimes(day)
    return {
        (platform, slot)
        for platform in ("x", "threads")
        for slot, _ in SLOTS
        if (platform, slot) not in already
        and due[slot] > now + MIN_SCHEDULING_LEAD
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--demo", action="store_true", help="Preview examples without API keys or side effects")
    parser.add_argument("--dry-run", action="store_true", help="Generate AI content but do not schedule")
    parser.add_argument("--date", help="Target date in Malaysia YYYY-MM-DD; default: rolling recovery window")
    args = parser.parse_args()
    today = datetime.now(TZ).date()
    explicit_date = date.fromisoformat(args.date) if args.date else None
    targets = posting_dates(today, explicit_date, dry_run=args.dry_run)
    start = date.fromisoformat(os.getenv("CAMPAIGN_START", "2026-10-18"))
    end = date.fromisoformat(os.getenv("CAMPAIGN_END", "2026-11-16"))
    targets = tuple(day for day in targets if start <= day <= end)
    if not targets:
        print(f"No action: target dates outside pilot campaign {start} to {end}")
        return
    if args.demo:
        for target in targets:
            print(json.dumps({"date": str(target), "sample": demo_posts()}, indent=2, ensure_ascii=False))
        return
    if not args.dry_run and os.getenv("SOCIAL_AUTOPUBLISH_ENABLED", "").lower() != "true":
        print("Autopublish disabled. Set SOCIAL_AUTOPUBLISH_ENABLED=true after reviewing preview.")
        return

    buffer_key = os.environ["BUFFER_API_KEY"]
    print("Step 1/3: Discovering connected Buffer channels...", flush=True)
    channels = discover_channels(buffer_key)
    from social_automation.strategy import (google_trend_brief, performance_brief,
                                            vlog_assets_for, vlog_caption_for)
    print("Step 2/3: Checking Buffer for missing future slots...", flush=True)
    trend_signal = None
    created = 0
    for target in targets:
        print(f"Checking {target} (Malaysia date)...", flush=True)
        already = scheduled_slots(buffer_key, channels, target)
        needed = missing_future_slots(target, already, datetime.now(timezone.utc))
        if not needed:
            print(f"{target}: all future slots covered (or already passed); nothing to do.", flush=True)
            continue
        print(f"Step 3/3: Generating {target} content for {len(needed)} missing slots...", flush=True)
        if trend_signal is None:
            trend_signal = google_trend_brief() or ""
            print("Relevant public trend signal: " + ("available" if trend_signal else "none; using evergreen topics"), flush=True)
        feedback = performance_brief(buffer_key, channels, target)
        print("Post performance signal: " + ("available" if feedback else "unavailable; no fabricated metrics"), flush=True)
        editorial_brief = "\n".join(x for x in (trend_signal, feedback) if x)
        posts = generate(target, editorial_brief=editorial_brief)
        times = target_datetimes(target)
        vlog_urls = (vlog_assets_for(target)
                     if any(slot == "afternoon" for _, slot in needed) else None)
        if vlog_urls:
            print(f"{target}: reusing 4 Instagram vlog photos in X/Threads afternoon slots", flush=True)
        for platform, slot in sorted(needed):
            shared_images = vlog_urls if slot == "afternoon" else None
            body = (vlog_caption_for(platform) if shared_images else
                    with_link(posts[f"{platform}_{slot}"], platform, slot, target))
            print(f"{target} {platform} {slot}: {body}", flush=True)
            if not args.dry_run:
                post_id = schedule(buffer_key, channels[platform]["id"], body, times[slot], shared_images)
                print(f"Scheduled: {platform} {slot}, Buffer post {post_id}", flush=True)
                created += 1
    if args.dry_run:
        print("Dry run complete. Nothing was published or scheduled.")
    else:
        print(f"Recovery check complete. {created} missing Buffer posts scheduled.", flush=True)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, RuntimeError, HTTPError, URLError) as exc:
        print(f"Automation failed safely: {exc}", file=sys.stderr)
        sys.exit(1)
