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

def first_day(day):
    """The one approved brand-introduction date. Configurable if launch is postponed."""
    return day == date.fromisoformat(os.getenv("INTRO_POST_DATE") or "2026-10-19")

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

def generate(day):
    key = os.environ["OPENAI_API_KEY"]
    launch = first_day(day)
    keys = FIRST_DAY_TIP_KEYS if launch else KEYS
    topic = "how to ask for receipts in Japan" if launch else TOPICS[(day.toordinal() - 1) % len(TOPICS)]
    guidance = f"""Create {len(keys)} ORIGINAL posts for Continuum × Kotoba for {day.isoformat()}, focused on {topic}.
Audience: adults worldwide; English main language, Japanese examples with accurate translation when useful.
Brand truth: Kotoba is already launched and offers practical Japanese for travelers.
Continuum is an IN-DEVELOPMENT project combining AI self-study and human language
teaching with the goal of connecting learners' progress. Never claim Continuum is launched,
publicly available as an app, or that any planned feature already works.
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
        guidance += """Morning: a practical Japanese travel mini-lesson.
Afternoon: an engaging language-learning insight or thoughtful question.
Evening: an honest build-in-public note about the Continuum vision, clearly in development.
"""
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

def schedule(buffer_key, channel_id, text, when):
    query = f'''mutation {{ createPost(input: {{text: {q(text)}, channelId: {q(channel_id)},
        schedulingType: automatic, mode: customScheduled, dueAt: {q(iso(when))},
        aiAssisted: true}}) {{
          ... on PostActionSuccess {{ post {{ id dueAt }} }}
          ... on MutationError {{ message }}
        }} }}'''
    result = buffer_query(query, buffer_key)["createPost"]
    if not result.get("post"):
        raise RuntimeError(f"Buffer refused scheduled post: {result.get('message', 'unknown error')}")
    return result["post"]["id"]

def demo_posts():
    return {
      "x_morning": "In Japan, a simple 'Sumimasen' (すみません) can help you politely get someone's attention. A small phrase, a smoother trip. 🇯🇵",
      "threads_morning": "One useful travel word in Japanese: すみません (sumimasen). You can use it to get someone's attention politely. What Japanese travel situation would you like to practice?",
      "x_afternoon": "A few minutes of speaking practice can be more meaningful than memorizing a long word list. Which phrase would you actually use today?",
      "threads_afternoon": "Try this today: pick one practical phrase and say it out loud in a real-world scenario. Not just memorization—rehearsal. What's one phrase you wish you knew in another language?",
      "x_evening": "We're building Continuum around one idea: your progress shouldn't vanish between self-study and lessons with a teacher. Still in development. 🌍",
      "threads_evening": "Why should progress from independent study feel separate from progress with a teacher? That's one of the problems we're trying to solve with Continuum. We're still building, and we'll share the journey here.",
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--demo", action="store_true", help="Preview examples without API keys or side effects")
    parser.add_argument("--dry-run", action="store_true", help="Generate AI content but do not schedule")
    parser.add_argument("--date", help="Target date in Malaysia YYYY-MM-DD; default tomorrow")
    args = parser.parse_args()
    target = datetime.fromisoformat(args.date).date() if args.date else datetime.now(TZ).date() + timedelta(days=1)
    start = datetime.fromisoformat(os.getenv("CAMPAIGN_START", "2026-10-18")).date()
    end = datetime.fromisoformat(os.getenv("CAMPAIGN_END", "2026-11-16")).date()
    if target < start or target > end:
        print(f"No action: {target} outside pilot campaign {start} to {end}")
        return
    if args.demo:
        print(json.dumps({"date": str(target), "sample": demo_posts()}, indent=2, ensure_ascii=False))
        return
    if not args.dry_run and os.getenv("SOCIAL_AUTOPUBLISH_ENABLED", "").lower() != "true":
        print("Autopublish disabled. Set SOCIAL_AUTOPUBLISH_ENABLED=true after reviewing preview.")
        return
    buffer_key = os.environ["BUFFER_API_KEY"]
    print("Step 1/3: Discovering connected Buffer channels...", flush=True)
    channels = discover_channels(buffer_key)
    print("Step 2/3: Checking existing Buffer scheduled posts...", flush=True)
    already = scheduled_slots(buffer_key, channels, target)
    needed = {(platform, slot) for platform in ("x", "threads") for slot, _ in SLOTS} - already
    if not needed:
        print("All six slots are already scheduled; nothing to do.")
        return
    print("Step 3/3: Generating new draft text with OpenAI...", flush=True)
    posts = generate(target)
    times = target_datetimes(target)
    for platform, slot in sorted(needed):
        body = with_link(posts[f"{platform}_{slot}"], platform, slot, target)
        print(f"{target} {platform} {slot}: {body}")
        if not args.dry_run:
            post_id = schedule(buffer_key, channels[platform]["id"], body, times[slot])
            print(f"Scheduled: {platform} {slot}, Buffer post {post_id}")
    if args.dry_run:
        print("Dry run complete. Nothing was published or scheduled.")

if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, RuntimeError, HTTPError, URLError) as exc:
        print(f"Automation failed safely: {exc}", file=sys.stderr)
        sys.exit(1)
