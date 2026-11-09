"""Prelaunch showcase: reuse the in-app promo and real in-app artwork through Buffer.

Additional slots do not alter the existing Instagram and X/Threads calendars.
No paid advertising or ad-platform campaign is created by this module.
"""
import argparse
import base64
import io
import json
import os
import sys
import time as pause
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from social_automation.poster import TZ, buffer_query, discover_channels, iso, q
from social_automation.instagram_poster import ASSET_BRANCH, gh_request, instagram_channel

REPO = "messi10ken2-commits/continuum-language"
PUBLIC_ASSETS = "https://raw.githubusercontent.com/" + REPO + "/main/"
VIDEO_URL = PUBLIC_ASSETS + "public/membership/premium-promotion-v2.mp4"
FIRST_DAY = date(2026, 11, 11)
LAST_DAY = date(2026, 12, 31)
LOOKAHEAD_DAYS = 2
MIN_LEAD = timedelta(minutes=20)

# The following are actual media assets from the app, not screen captures.
VISUALS = (
    ("Build a world as you learn", "Light Mode", "public/light-town/diorama.webp"),
    ("See your journey unfold", "Illustration Mode", "public/illustrated-lessons/ja-learning-map.webp"),
    ("Learn in real-life contexts", "Photo lessons", "public/lesson-media/cafe.jpg"),
    ("Explore across languages", "Language journeys", "public/journey-media/fr-paris.webp"),
)

# Wed/Sat: Instagram; Thu/Sun: X and Threads, so the promotional content
# is shared with a one-day delay without displacing the regular posting slots.
SHOWCASE_SLOTS = {
    2: (("instagram", "video", time(19, 45)),),
    3: (("x", "video", time(18, 30)), ("threads", "video", time(18, 30))),
    5: (("instagram", "gallery", time(19, 45)),),
    6: (("x", "gallery", time(18, 30)), ("threads", "gallery", time(18, 30))),
}

VIDEO_HOOKS = (
    "What if your learning didn't reset between practice sessions?",
    "A 15-second peek at the learning experience we're building.",
    "AI practice and human guidance belong on the same journey.",
    "One learner, one evolving journey, multiple ways to practice.",
)
GALLERY_HOOKS = (
    "Every lesson can feel like a little journey.",
    "A language-learning world that grows with your progress.",
    "Beyond flashcards: explore the worlds we're building.",
    "The details of language learning should feel inviting.",
)


def slots_for(day):
    if not FIRST_DAY <= day <= LAST_DAY:
        return ()
    return SHOWCASE_SLOTS.get(day.weekday(), ())


def visual_day(day):
    """Sunday reposts reuse Saturday's exact four-image gallery."""
    return day - timedelta(days=1) if day.weekday() == 6 else day


def caption(platform, kind, day):
    index = max(0, (day - FIRST_DAY).days // 7) % 4
    if kind == "video":
        hook = VIDEO_HOOKS[index]
        if platform == "instagram":
            return (
                f"🎬 {hook}\n\n"
                "Here's an illustrated 15-second look at Continuum Premium concepts: "
                "AI conversations, vocabulary and expression review, and exclusive courses.\n\n"
                "Our bigger idea: independent practice and human-taught lessons should "
                "contribute to the same learning journey and Learning Memory.\n\n"
                "We're in the final development and quality-check stage before rollout. "
                "Continuum has NOT launched publicly as an app yet; this is a promotional animation, "
                "not a recording of the interface.\n\n"
                "What would you want to try first? 💬\n\n"
                "#Continuum #LanguageLearning #BuildInPublic #EdTech"
            )
        if platform == "x":
            return (
                f"🎬 {hook} AI conversations, review & exclusive courses: "
                "a 15s look at the Premium experience we're building. "
                "Continuum is still in final testing—not publicly launched. #Continuum"
            )
        return (
            f"🎬 {hook}\n\nOur 15-second illustrated preview shows planned Premium "
            "experiences: AI conversation, vocabulary review and exclusive lessons. "
            "Continuum connects practice with human teaching through shared learner memory.\n\n"
            "Still in final development, not publicly launched. Which would you try first?"
        )
    hook = GALLERY_HOOKS[index]
    if platform == "instagram":
        return (
            f"🌍 {hook}\n\n"
            "Four glimpses of the visual experiences inside Continuum: "
            "a buildable Light Mode town, an illustrated learning map, "
            "real-life photographic lesson settings, and language-inspired scenery.\n\n"
            "These images use actual in-app artwork, presented in branded social cards; "
            "they are not unedited screenshots of the full interface. "
            "We're refining the platform across 10 learning languages and three interface modes "
            "before public rollout.\n\n"
            "Which learning world would you explore? ✨\n\n"
            "#Continuum #LanguageLearning #LanguageApp #BuildInPublic"
        )
    if platform == "x":
        return (
            f"🌍 {hook} A Light Mode town, illustrated learning maps, "
            "photo-based lessons and language journeys. "
            "A peek at real in-app artwork—not full UI screenshots. "
            "Continuum is in final development. #Continuum"
        )
    return (
        f"🌍 {hook}\n\n"
        "A buildable town in Light Mode. Illustrated progress maps. "
        "Real-world lesson imagery. Language-inspired scenes.\n\n"
        "These are selected in-app visual assets shown as social cards—not full interface "
        "screenshots. We're polishing the experience before public release. "
        "Which visual world is your favorite?"
    )


def due_at(day, hour):
    return datetime.combine(day, hour, TZ).astimezone(timezone.utc)


def build_gallery_card(index):
    """Create portrait, social-safe images using existing in-app art, never fabricated UI."""
    from PIL import Image, ImageDraw, ImageFont, ImageOps
    heading, category, src = VISUALS[index]
    image_path = Path(__file__).resolve().parents[1] / src
    if not image_path.is_file():
        raise RuntimeError(f"Missing in-app visual: {src}")
    art = Image.open(image_path).convert("RGB")
    canvas = Image.new("RGB", (1080, 1350), "#081C3A")
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((36, 32, 1044, 1316), radius=38, fill="#10365B")
    draw.rounded_rectangle((60, 266, 1020, 1077), radius=30, fill="#EAF3F4")
    picture = ImageOps.contain(art, (914, 762), method=Image.Resampling.LANCZOS)
    canvas.paste(picture, ((1080 - picture.width) // 2, 290 + (762 - picture.height) // 2))
    draw.rounded_rectangle((77, 76, 370, 123), radius=16, fill="#25C3C3")
    fontfile = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    try:
        title_font = ImageFont.truetype(fontfile, 42)
        body_font = ImageFont.truetype(fontfile, 27)
        small_font = ImageFont.truetype(fontfile, 20)
    except OSError:
        title_font = ImageFont.load_default()
        body_font = title_font
        small_font = title_font
    draw.text((99, 83), "CONTINUUM", font=small_font, fill="#081C3A")
    draw.text((77, 170), heading, font=title_font, fill="#FDFCF8")
    draw.text((81, 1117), category + "  |  In-app visual", font=body_font, fill="#8DE2DF")
    draw.text((81, 1205), "In development · Final quality checks", font=small_font, fill="#E8EFF0")
    buff = io.BytesIO()
    canvas.save(buff, format="JPEG", quality=87, optimize=True, subsampling=0)
    return buff.getvalue()


def verify_public(url, signature):
    """One small download, not a heavyweight file fetch; fail closed if private/missing."""
    request = Request(url, headers={"User-Agent": "Continuum-Showcase/1.0"})
    for attempt in range(4):
        try:
            with urlopen(request, timeout=14) as response:
                if response.status == 200 and response.read(max(len(signature), 24)).startswith(signature):
                    return True
        except (URLError, HTTPError, TimeoutError):
            pass
        if attempt < 3:
            pause.sleep(3)
    raise RuntimeError("Public media unavailable; cannot schedule: " + url)


def github_media_branch(token):
    branch = gh_request("git/ref/heads/" + ASSET_BRANCH, token)
    if branch is not None:
        return
    main = gh_request("git/ref/heads/main", token)
    if main is None:
        raise RuntimeError("GitHub main ref not found")
    gh_request("git/refs", token, {
        "ref": "refs/heads/" + ASSET_BRANCH, "sha": main["object"]["sha"]
    }, "POST")


def gallery_urls(day, token):
    if not token:
        raise RuntimeError("GITHUB_TOKEN is required for gallery publishing")
    github_media_branch(token)
    output = []
    for i in range(len(VISUALS)):
        path = f"assets/showcase/{day.isoformat()}-{i+1:02d}.jpg"
        if gh_request(f"contents/{path}?ref={ASSET_BRANCH}", token) is None:
            body = {
                "message": f"Add prelaunch showcase card {day.isoformat()} #{i+1}",
                "content": base64.b64encode(build_gallery_card(i)).decode("ascii"),
                "branch": ASSET_BRANCH,
            }
            gh_request("contents/" + path, token, body, "PUT")
        url = f"https://raw.githubusercontent.com/{os.environ['GITHUB_REPOSITORY']}/{ASSET_BRANCH}/{path}"
        verify_public(url, b"\xff\xd8\xff")
        output.append(url)
    return output


def existing_post(token, channel, when):
    """Never duplicate an occupied slot; includes previously sent posts."""
    start = when - timedelta(minutes=2)
    end = when + timedelta(minutes=2)
    query = (
        "query { posts(input: {organizationId: " + q(channel["orgId"])
        + ", filter: {status: [scheduled, sent], channelIds: " + q([channel["id"]])
        + ", dueAt: {start: " + q(iso(start)) + ", end: " + q(iso(end))
        + "}}}) { edges { node { id dueAt channelId } } } }"
    )
    edges = buffer_query(query, token)["posts"]["edges"]
    for edge in edges:
        post = edge["node"]
        if post["channelId"] != channel["id"]:
            continue
        actual = datetime.fromisoformat(post["dueAt"].replace("Z", "+00:00"))
        if abs((actual - when).total_seconds()) < 120:
            return True
    return False


def create_showcase_post(token, channel, platform, kind, day, when, urls):
    if not urls or (kind == "video" and len(urls) != 1) or (kind == "gallery" and len(urls) != 4):
        raise ValueError("Showcase media must contain one video or four images")
    body = caption(platform, kind, day)
    if platform == "x" and len(body) > 255:
        raise ValueError("X promotional caption exceeds safety limit")
    assets = ", ".join(
        ("{video: {url: " + q(url) + ", metadata: {thumbnailOffset: 2500}}}")
        if kind == "video" and platform == "instagram"
        else ("{video: {url: " + q(url) + "}}") if kind == "video"
        else ("{image: {url: " + q(url) + "}}")
        for url in urls
    )
    metadata = ""
    if platform == "instagram":
        post_type = "reel" if kind == "video" else "post"
        metadata = f", metadata: {{instagram: {{type: {post_type}, shouldShareToFeed: true, isAiGenerated: {str(kind == 'video').lower()}}}}}"
    query = (
        "mutation { createPost(input: {"
        + "text: " + q(body) + ", channelId: " + q(channel["id"])
        + ", schedulingType: automatic, mode: customScheduled, dueAt: " + q(iso(when))
        + ", assets: [" + assets + "]" + metadata
        + ", aiAssisted: false"
        + "}) { ... on PostActionSuccess { post { id dueAt assets { id mimeType } } }"
        + " ... on MutationError { message } } }"
    )
    result = buffer_query(query, token)["createPost"]
    post = result.get("post")
    if not post or len(post.get("assets") or []) != len(urls):
        raise RuntimeError("Buffer did not confirm all showcase media: " + str(result.get("message", "missing assets")))
    return post["id"]


def target_dates(today, selected=None):
    if selected is not None:
        return (selected,)
    return tuple(today + timedelta(days=n) for n in range(LOOKAHEAD_DAYS + 1))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print campaign slots and captions, no remote effects")
    parser.add_argument("--date", help="Specific Malaysia publication date YYYY-MM-DD")
    args = parser.parse_args()
    today = datetime.now(TZ).date()
    requested = date.fromisoformat(args.date) if args.date else None
    targets = [(day, p, kind, hour) for day in target_dates(today, requested)
               for p, kind, hour in slots_for(day)]
    if args.dry_run:
        for day, platform, kind, hour in targets:
            print(json.dumps({"date": str(day), "platform": platform, "format": kind,
                              "time_myt": hour.isoformat(timespec="minutes"),
                              "caption": caption(platform, kind, day)}, ensure_ascii=False))
        print("Dry run only: no assets published and no Buffer posts created.")
        return
    if os.getenv("SOCIAL_AUTOPUBLISH_ENABLED", "").lower() != "true":
        print("Autopublish flag disabled: showcase skipped.")
        return
    if (os.getenv("SHOWCASE_PROMO_ENABLED") or "true").lower() != "true":
        print("Showcase promotion disabled.")
        return
    if not targets:
        print("No eligible showcase slots in rolling window.")
        return

    token = os.environ["BUFFER_API_KEY"]
    instagram = instagram_channel(token)
    social = discover_channels(token)
    channels = {**social, "instagram": instagram}
    media_cache = {}
    count = 0
    for day, platform, kind, hour in targets:
        when = due_at(day, hour)
        if when <= datetime.now(timezone.utc) + MIN_LEAD:
            continue
        ch = channels[platform]
        if existing_post(token, ch, when):
            print(f"{day}: {platform} {kind} showcase already queued", flush=True)
            continue
        if kind == "video":
            if "video" not in media_cache:
                verify_public(VIDEO_URL, b"\x00\x00\x00")
                media_cache["video"] = [VIDEO_URL]
            urls = media_cache["video"]
        else:
            image_date = visual_day(day)
            if image_date not in media_cache:
                media_cache[image_date] = gallery_urls(image_date, os.environ["GITHUB_TOKEN"])
            urls = media_cache[image_date]
        ident = create_showcase_post(token, ch, platform, kind, day, when, urls)
        print(f"Showcase queued: {platform}, {kind}, {day} {hour}, Buffer id {ident}", flush=True)
        count += 1
    print(f"Showcase check complete: {count} new scheduled posts.")


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, ValueError, KeyError, HTTPError, URLError) as exc:
        print(f"Showcase scheduling failed safely: {exc}", file=sys.stderr)
        sys.exit(1)
