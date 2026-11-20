"""Photo-style language-learning vlog carousels for Instagram via Buffer.

Generates one fictional 2x2 photo journal with GPT Image Mini, creates four
Instagram-ready JPEG cards with accurate text overlays, stores them on the
public instagram-media GitHub branch, and schedules as one Buffer carousel.
"""
import base64, io, os, time
from datetime import date
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from social_automation.instagram_poster import (
    ASSET_BRANCH, buffer_query, due_at, exists_in_buffer, gh_request,
    instagram_channel, iso, q,
)

# The first carousel is after the currently scheduled Instagram posts.
VLOG_FIRST_DATE = date(2026, 11, 9)
VLOG_SPACING_DAYS = 7
SLIDE_STEPS = (
    ("STUDY WITH ME", "A day of language learning"),
    ("10:00 AM", "Listen and repeat 3 useful phrases"),
    ("2:00 PM", "Use one phrase on the go"),
    ("8:30 PM", "Say it aloud and write a quick reflection"),
)
PROMPTS = (
    "A realistic language-learning day in four small moments",
    "Everyday listening, shadowing and practical conversations",
    "Build a confident speaking habit through small daily routines",
    "The story of a language learner's progress, one step at a time",
)


def is_vlog_day(day):
    return day >= VLOG_FIRST_DATE and (day - VLOG_FIRST_DATE).days % VLOG_SPACING_DAYS == 0


def media_paths(day):
    return [f"assets/instagram/{day.isoformat()}-vlog-{n}.jpg" for n in range(1, 5)]


def media_urls(day):
    repo = os.environ["GITHUB_REPOSITORY"]
    return [f"https://raw.githubusercontent.com/{repo}/{ASSET_BRANCH}/{path}" for path in media_paths(day)]


def media_all_hosted(day):
    token = os.environ["GITHUB_TOKEN"]
    return all(gh_request(f"contents/{path}?ref={ASSET_BRANCH}", token) for path in media_paths(day))


def make_collage_photo(day):
    """One paid generation per four-image carousel. Fail safely on API errors."""
    key = os.environ["OPENAI_API_KEY"]
    theme = PROMPTS[(day - VLOG_FIRST_DATE).days // 7 % len(PROMPTS)]
    prompt = f"""Make ONE premium photorealistic 2-by-2 CONTACT SHEET with 4 equally sized
rectangular photos, clear panel boundaries, no overlay text or lettering.
All four show THE SAME FICTIONAL adult language learner (young woman with
dark hair in a casual bun, navy outfit; keep the same recognisable face).
Photograph A top left: 10 AM cozy bright bedroom study, cup of coffee,
paper notebook, phone on desk. Photograph B top right: headphones, short
listening practice by sunny window. Photograph C bottom left: 2 PM on the
go at an outdoor cafe or transit stop, natural candid documentary feel.
Photograph D bottom right: 8:30 PM warm golden light at home, notebook and
gentle speaking/reflective practice.
This is a fictional, illustrative learner journey, not a real user's vlog,
not a product screenshot. NO written words or fake app logos on devices.
Fashion/editorial documentary photography, friendly natural imperfections,
soft sunlight, 35mm film aesthetic, carefully composed, real-ish not CGI.
Deep navy, cobalt, turquoise and subtle warm orange brand accents.
Theme: {theme}. Every photo must fill its own quadrant, no overlap."""
    payload = {
        "model": os.getenv("INSTAGRAM_IMAGE_MODEL") or "gpt-image-1-mini",
        "prompt": prompt,
        "size": "1024x1536",
        "quality": os.getenv("INSTAGRAM_IMAGE_QUALITY") or "medium",
        "output_format": "jpeg",
        "output_compression": 82,
        "n": 1,
    }
    req = Request("https://api.openai.com/v1/images/generations",
                  data=__import__("json").dumps(payload).encode("utf-8"),
                  headers={"Authorization": "Bearer " + key,
                           "Content-Type": "application/json"},
                  method="POST")
    with urlopen(req, timeout=210) as resp:
        data = __import__("json").load(resp)
    content = data.get("data") or []
    if not content or not content[0].get("b64_json"):
        raise RuntimeError("Image generation did not return image bytes")
    raw = base64.b64decode(content[0]["b64_json"], validate=True)
    if len(raw) < 10_000:
        raise RuntimeError("Generated image was suspiciously small")
    return raw


def make_slides(photo_bytes):
    """Render legible editorial captions in Pillow, no AI-generated text."""
    from PIL import Image, ImageDraw, ImageFont, ImageOps
    original = Image.open(io.BytesIO(photo_bytes)).convert("RGB")
    w, h = original.size
    if w < 800 or h < 1100:
        raise RuntimeError(f"Invalid photo-collage dimensions {original.size}")
    font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    regular_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    images = []
    for i, (headline, subhead) in enumerate(SLIDE_STEPS):
        col, row = i % 2, i // 2
        panel = original.crop((col * w // 2, row * h // 2,
                               (col + 1) * w // 2, (row + 1) * h // 2))
        panel = ImageOps.fit(panel, (1080, 1350), method=Image.Resampling.LANCZOS)
        overlay = Image.new("RGBA", panel.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        draw.rounded_rectangle((45, 62, 1035, 288), radius=34,
                               fill=(7, 28, 62, 225))
        draw.rounded_rectangle((40, 1210, 1040, 1310), radius=28,
                               fill=(7, 28, 62, 220))
        title = ImageFont.truetype(font_path, 68 if len(headline)<18 else 56)
        small = ImageFont.truetype(regular_path, 36 if len(subhead)>38 else 41)
        foot = ImageFont.truetype(font_path, 37)
        draw.text((84, 92), headline, font=title, fill="#FFFFFF")
        # Wrap to stay clear of edges and not rely on generated text.
        words, lines, acc = subhead.split(), [], ""
        for word in words:
            test = (acc + " " + word).strip()
            if draw.textbbox((0,0),test,font=small)[2] > 890 and acc:
                lines.append(acc);acc=word
            else:acc=test
        if acc:lines.append(acc)
        if len(lines)>2:raise RuntimeError("Slide subheading too long")
        for j,line in enumerate(lines):
            draw.text((84, 175 + j * 47), line, font=small, fill="#81E8E4")
        draw.text((84, 1237), "Continuum × Kotoba", font=foot, fill="#FFFFFF")
        draw.text((920, 1243), f"{i+1}/4", font=small, fill="#FFD572")
        finished = Image.alpha_composite(panel.convert("RGBA"),overlay).convert("RGB")
        output = io.BytesIO()
        finished.save(output,format="JPEG",quality=88,optimize=True,subsampling=0)
        images.append(output.getvalue())
    return images


def host_photo_carousel(day, slides):
    token=os.environ["GITHUB_TOKEN"]
    paths=media_paths(day)
    if len(slides)!=4:
        raise ValueError("Carousel requires exactly four images")
    for path,blob in zip(paths,slides):
        if gh_request(f"contents/{path}?ref={ASSET_BRANCH}",token):
            continue
        if not (blob[:3]==b"\xff\xd8\xff"):
            raise RuntimeError("Invalid JPEG content")
        gh_request("contents/"+path,token,
                   {"message":"Add four-scene language-learning vlog "+day.isoformat(),
                    "content":base64.b64encode(blob).decode("ascii"),
                    "branch":ASSET_BRANCH},"PUT")
    urls=media_urls(day)
    for url in urls:
        ready=False
        for attempt in range(20):
            try:
                with urlopen(Request(url,headers={"User-Agent":"continuum-ig-carousel"}),timeout=15) as resp:
                    ready=resp.status==200 and resp.read(3)==b"\xff\xd8\xff"
                    if ready:break
            except (HTTPError,URLError,TimeoutError):pass
            time.sleep(4)
        if not ready:raise RuntimeError("Public JPEG not yet ready: "+url)
    return urls


def vlog_caption(day):
    theme=PROMPTS[(day-VLOG_FIRST_DATE).days//7 % len(PROMPTS)]
    return (f"📸 Study with me — a day of language learning!\n\n"
            f"Today's idea: {theme.lower()}.\n\n"
            "☀️ 10:00 AM — Listen to one short clip. Repeat three useful phrases.\n"
            "☕ 2:00 PM — Put your headphones on and practise one phrase while you're out.\n"
            "🌙 8:30 PM — Say one sentence out loud and write a quick reflection.\n\n"
            "You don't need a perfect schedule. Small moments add up, "
            "and practising in context makes new language easier to use.\n\n"
            "Which part of the day works best for you? 💬\n\n"
            "Illustrative study-vlog concept from Continuum × Kotoba.\n"
            "#LanguageLearning #StudyWithMe #StudyVlog #LearnLanguages #Continuum")


def schedule_carousel(token, channel, day, urls, caption):
    if len(urls)!=4:
        raise ValueError("A four-image carousel is required")
    assets=", ".join("{image: {url: "+q(url)+"}}" for url in urls)
    mutation=("mutation { createPost(input: {text: "+q(caption)
              +", channelId: "+q(channel["id"])
              +", schedulingType: automatic, mode: customScheduled, dueAt: "+q(iso(due_at(day)))
              +", assets: ["+assets+"]"
              +", metadata: {instagram: {type: post, shouldShareToFeed: true}}, aiAssisted: true"
              +"}) { ... on PostActionSuccess { post { id dueAt assets { id mimeType } } }"
              +" ... on MutationError { message } } }")
    outcome=buffer_query(mutation,token)["createPost"]
    post=outcome.get("post")
    if not post or len(post.get("assets") or [])!=4:
        raise RuntimeError("Buffer did not confirm all FOUR carousel images: "
                           +str(outcome.get("message",outcome)))
    return post["id"]


def produce_and_schedule(day, token=None, channel=None):
    if not is_vlog_day(day):
        raise ValueError("Outside vlog Mondays")
    token=token or os.environ["BUFFER_API_KEY"]
    channel=channel or instagram_channel(token)
    due=due_at(day)
    if exists_in_buffer(token,channel,due):
        print(f"{day}: Existing Instagram post retained; no replacement",flush=True)
        return None
    if media_all_hosted(day):
        urls=media_urls(day)
    else:
        photo=make_collage_photo(day)
        slides=make_slides(photo)
        urls=host_photo_carousel(day,slides)
    pid=schedule_carousel(token,channel,day,urls,vlog_caption(day))
    print(f"{day}: four-image lifestyle carousel scheduled in Buffer: {pid}",flush=True)
    return pid
