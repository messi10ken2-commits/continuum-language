"""Automated branded Instagram images and captions via Buffer, separate from X/Threads."""
import argparse, base64, json, os, re, sys, time as pause
from datetime import date, datetime, timedelta, time, timezone
from html import escape
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from zoneinfo import ZoneInfo
from social_automation.poster import buffer_query, q, iso, api_json, extract_response_text

TZ = ZoneInfo("Asia/Kuala_Lumpur")
LAUNCH = date(2026, 10, 30)
LOOKAHEAD = 9
SLOT = time(19, 0)
ASSET_BRANCH = "instagram-media"
TOPICS = {
    0: ("language_tip", [
        ("Learn in phrases, not just words", "Build useful expressions you can use in everyday conversation."),
        ("Shadow natural speech", "Repeat short audio clips to practice rhythm, pronunciation and flow."),
        ("Make vocabulary personal", "Connect new expressions to stories from your own life."),
        ("Turn words into dialogue", "Practice small conversations instead of memorizing isolated terms."),
        ("Recall before reviewing", "Try remembering a phrase before checking your notes."),
        ("Notice everyday patterns", "Watch how native speakers combine words in real contexts."),
        ("Say it out loud", "Speaking for a few minutes makes your practice more active."),
    ]),
    2: ("continuum_update", [
        ("Closer to launch", "We are polishing lesson content, audio and navigation before launch."),
        ("One connected journey", "Our goal is to connect independent practice with human-taught classes."),
        ("Learning maps that motivate", "We are refining illustrated progress maps and learner experience."),
        ("Keep the learning history", "We are refining how progress and recurring challenges inform practice."),
        ("Making lessons feel natural", "We are reviewing explanations, audio and practice interactions."),
        ("The details matter", "Mobile readability and language consistency are under final-stage review."),
        ("People and AI, together", "Our teacher feedback and practice workflows are being refined in testing."),
    ]),
    4: ("learning_mindset", [
        ("Consistency beats intensity", "Small, steady practice builds meaningful progress over time."),
        ("Mistakes are useful feedback", "Each mistake points toward what you can practice next."),
        ("Progress is not a straight line", "It is okay to have slow days while learning a language."),
        ("Start before you feel ready", "You do not need perfect grammar to try speaking."),
        ("Celebrate small wins", "Using just one new expression in a conversation counts."),
        ("Curiosity makes learning stick", "Follow topics you genuinely care about."),
        ("Build a habit you can keep", "Realistic daily practice is better than unsustainable bursts."),
    ]),
}

def publication_dates(today):
    return tuple(d for i in range(LOOKAHEAD+1) if (d := today+timedelta(days=i)).weekday() in TOPICS)

def plan_for(day):
    if day.weekday() not in TOPICS:
        raise ValueError("Instagram posts only Monday, Wednesday, Friday")
    category, choices = TOPICS[day.weekday()]
    heading, description = choices[((day-LAUNCH).days//7) % len(choices)]
    return {"category":category,"heading":heading,"description":description}

def due_at(day):
    return datetime.combine(day,SLOT,TZ).astimezone(timezone.utc)

def instagram_channel(token):
    orgs=buffer_query("query { account { organizations { id name } } }",token)["account"]["organizations"]
    channels=[]
    for org in orgs:
        query=f'query {{ channels(input: {{organizationId: {q(org["id"])}}}) {{ id name service isDisconnected isLocked isQueuePaused }} }}'
        for ch in buffer_query(query,token)["channels"]:
            if str(ch["service"]).lower()=="instagram":
                channels.append(dict(ch,orgId=org["id"]))
    override=os.getenv("INSTAGRAM_CHANNEL_ID","").strip()
    channels=[c for c in channels if not override or c["id"]==override]
    if len(channels)!=1:
        raise RuntimeError(f"Expected exactly one Instagram channel in Buffer; found {len(channels)}. Check connection / INSTAGRAM_CHANNEL_ID.")
    ch=channels[0]
    if any(ch.get(k) for k in ("isDisconnected","isLocked","isQueuePaused")):
        raise RuntimeError("Instagram channel disconnected, locked or paused in Buffer")
    return ch

def exists_in_buffer(token,ch,when):
    start,end=when-timedelta(minutes=2),when+timedelta(minutes=2)
    query=("query { posts(input: {organizationId: "+q(ch["orgId"])
           +", filter: {status: [scheduled, sent], channelIds: "+q([ch["id"]])
           +", dueAt: {start: "+q(iso(start))+", end: "+q(iso(end))
           +"}}}) { edges { node { id dueAt channelId } } } }")
    edges=buffer_query(query,token)["posts"]["edges"]
    return any(e["node"]["channelId"]==ch["id"] and abs(
       (datetime.fromisoformat(e["node"]["dueAt"].replace("Z","+00:00"))-when).total_seconds())<120
       for e in edges)

def fallback_caption(plan):
    cat=plan["category"]
    if cat=="language_tip":
        intro="🌍 A small language tip for your next study session"
        question="Which language are you learning? 💬"
        tags="#LanguageLearning #LearnLanguages #LanguageTips #Continuum"
    elif cat=="continuum_update":
        intro="🛠️ Behind the scenes: Continuum"
        question="We're in the late development and testing stage, not launched yet. What would make your language learning feel more connected? 💬"
        tags="#Continuum #BuildInPublic #EdTech #LanguageLearning"
    else:
        intro="✨ Language-learning mindset"
        question="What's one small step you can take today? 💬"
        tags="#LanguageMindset #LanguageLearning #StudyMotivation #Continuum"
    return f'{intro}\n\n{plan["heading"]}.\n{plan["description"]}\n\n{question}\n\n{tags}'

def caption_for(day,plan):
    key=os.getenv("OPENAI_API_KEY")
    if not key: return fallback_caption(plan)
    prompt=f"""Write an Instagram caption, 80-140 words, for adult learners worldwide.
Publication date: {day}; category {plan["category"]}.
Graphic headline: {plan["heading"]}. Subject: {plan["description"]}.
Conversational English; informative and engaging, good line breaks, 4-7 appropriate hashtags,
a question to prompt genuine discussion, light emoji use.
Brand facts: Continuum is nearing launch but STILL IN DEVELOPMENT.
Its vision is connected learner memory between AI-supported independent study and human teachers.
Teacher workflows have been tested in a pilot, but do not claim any completed paid-class
checkout, app-store release, public availability, specific launch date or unsupported results.
Kotoba already exists for practical Japanese travel. Keep general language tips general.
The image is an original illustrative graphic, NOT an authentic product screenshot.
No invented metrics. Return JSON with the single key caption."""
    payload={"model":os.getenv("OPENAI_MODEL") or "gpt-4.1-mini",
             "instructions":"Careful truthful social media editor. Produce native-sounding Instagram content.",
             "input":prompt,"text":{"format":{"type":"json_schema","name":"ig_caption","strict":True,
             "schema":{"type":"object","properties":{"caption":{"type":"string"}},"required":["caption"],"additionalProperties":False}}}}
    try:
        obj=api_json("https://api.openai.com/v1/responses",payload,key,timeout=70)
        value=json.loads(extract_response_text(obj))["caption"].strip()
        if not 100<=len(value)<=1800 or len(re.findall(r"#\w+",value))<3:
            raise ValueError("Caption length or hashtags not valid")
        if plan["category"]=="continuum_update" and not any(s in value.lower() for s in ("develop","building","testing","working","pre-launch")):
            raise ValueError("Progress post omitted prelaunch language")
        return value
    except (ValueError,KeyError,RuntimeError,HTTPError,URLError) as exc:
        print(f"Caption AI unavailable, using curated text: {exc}",flush=True)
        return fallback_caption(plan)

def wrap_words(s,limit):
    lines=[]; line=""
    for word in s.split():
        nxt=(line+" "+word).strip()
        if len(nxt)>limit and line:
            lines.append(line); line=word
        else: line=nxt
    if line:lines.append(line)
    return lines

def render_svg(plan):
    """Original branded illustration template; clearly conceptual, not an app screenshot."""
    category=plan["category"]
    label={"language_tip":"LANGUAGE TIP","continuum_update":"CONTINUUM UPDATE",
           "learning_mindset":"LEARNING MINDSET"}[category]
    lines=wrap_words(plan["heading"],20)
    if len(lines)>3: raise ValueError("Graphic headline needs shortening")
    titles="".join(f'<text x="80" y="{323+i*83}" font-size="73" font-weight="bold" fill="{["#FFF9E9","#FFD06A","#FFF9E9"][i]}">{escape(line)}</text>' for i,line in enumerate(lines))
    desc=wrap_words(plan["description"],40)
    summary="".join(f'<text x="83" y="{637+i*39}" font-size="27" fill="#EBF7F8">{escape(line)}</text>' for i,line in enumerate(desc[:4]))
    if category=="language_tip":
        art='''<rect x="718" y="375" width="278" height="110" rx="30" fill="#FFF9DF" transform="rotate(-8 718 375)"/><text x="740" y="428" font-size="33" fill="#12406A">Hello!  •••</text><rect x="751" y="509" width="241" height="95" rx="28" fill="#B3EDF1" transform="rotate(5 751 509)"/><text x="763" y="566" font-size="27" fill="#154E70">Let's talk.</text><path d="M632 820 Q775 710 958 810 V927 Q770 840 632 954Z" fill="#FFF1CB"/><path d="M632 820 Q519 741 420 810 V921 Q545 872 632 954Z" fill="#C4F1F0"/><path d="M632 820V954" stroke="#FEC55E" stroke-width="10"/>'''
    elif category=="continuum_update":
        art='''<rect x="678" y="348" width="321" height="360" rx="29" fill="#E1F3FF"/><rect x="701" y="370" width="277" height="70" rx="14" fill="#16446E"/><circle cx="735" cy="404" r="19" fill="#2AE1D5"/><rect x="772" y="397" width="166" height="14" rx="7" fill="#B5E4ED"/><rect x="708" y="473" width="238" height="21" rx="9" fill="#90C5DB"/><rect x="708" y="526" width="197" height="21" rx="9" fill="#23C7CB"/><rect x="708" y="579" width="251" height="21" rx="9" fill="#90C5DB"/><rect x="708" y="632" width="216" height="21" rx="9" fill="#FFCB6A"/><path d="M720 816l53 46 88-115" fill="none" stroke="#FFE189" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>'''
    else:
        art='''<path d="M584 850Q669 762 697 735T780 613T856 552T957 428" fill="none" stroke="#FFD16D" stroke-width="55" stroke-linecap="round"/><path d="M584 850Q669 762 697 735T780 613T856 552T957 428" fill="none" stroke="#FFF6CB" stroke-width="16" stroke-dasharray="20 22" stroke-linecap="round"/><circle cx="957" cy="428" r="75" fill="#FFD16C"/><circle cx="957" cy="428" r="43" fill="#FFF4C9"/><path d="M694 747V667m0 2 79 23-79 27" stroke="#153F6E" stroke-width="8" fill="#FFAE4B"/><path d="M858 562v-79m0 0 71 25-71 23" stroke="#153F6E" stroke-width="8" fill="#FFAE4B"/>'''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
<defs><linearGradient id="bg" x2=".9" y2="1"><stop stop-color="#071A45"/><stop offset="1" stop-color="#065080"/></linearGradient><linearGradient id="ribbon"><stop stop-color="#0AA5E8"/><stop offset=".6" stop-color="#3EE5BE"/><stop offset="1" stop-color="#FFD26E"/></linearGradient></defs>
<rect width="1080" height="1080" fill="url(#bg)"/><circle cx="1010" cy="80" r="298" fill="#1760A1" opacity=".45"/><circle cx="1000" cy="145" r="219" fill="#FFD06A"/>
<path d="M0 815Q198 757 386 862T793 810T1080 844V1080H0Z" fill="#003E80"/><path d="M0 916Q180 840 395 927T790 911T1080 884" stroke="url(#ribbon)" stroke-width="47" fill="none"/>
<path d="M0 994Q226 921 447 972T1080 962" stroke="#068BBD" stroke-width="83" fill="none" opacity=".55"/>
<circle cx="103" cy="101" r="44" fill="#07C7CC"/><path d="M123 82A30 30 0 1 0 126 125" fill="none" stroke="#FFFAE8" stroke-width="13"/><circle cx="135" cy="90" r="13" fill="#FFCB62"/>
<text x="160" y="113" font-family="DejaVu Sans,Arial,sans-serif" font-weight="bold" fill="white" font-size="39">Continuum × Kotoba</text>
<text x="84" y="220" font-family="DejaVu Sans,Arial,sans-serif" fill="#4CE8E4" font-size="30" letter-spacing="6">{label}</text><path d="M84 248H208" stroke="#FFCA64" stroke-width="9" stroke-linecap="round"/>
<g font-family="DejaVu Sans,Arial,sans-serif">{titles}{summary}{art}</g>
<path d="M83 981H190" stroke="#FFD16B" stroke-width="7" stroke-linecap="round"/><text x="83" y="1025" font-family="DejaVu Sans,Arial,sans-serif" font-size="24" fill="#F7F7F6">Language learning, connection &amp; growth.</text>
</svg>'''

def render_png(plan):
    import cairosvg
    return cairosvg.svg2png(bytestring=render_svg(plan).encode("utf-8"),output_width=1080,output_height=1080)

def gh_request(path,token,data=None,method="GET"):
    repo=os.environ["GITHUB_REPOSITORY"]
    url=f"https://api.github.com/repos/{repo}/{path}"
    hdr={"Authorization":f"Bearer {token}","Accept":"application/vnd.github+json",
         "X-GitHub-Api-Version":"2022-11-28","User-Agent":"continuum-instagram-automation"}
    if data is not None: hdr["Content-Type"]="application/json"
    req=Request(url,data=json.dumps(data).encode("utf-8") if data is not None else None,headers=hdr,method=method)
    try:
        with urlopen(req,timeout=40) as resp: return json.load(resp)
    except HTTPError as e:
        if e.code==404: return None
        raise RuntimeError(f"GitHub media API HTTP {e.code}: {e.read(200)}") from e

def host_png(day,png):
    """Persist a public PNG in a dedicated media branch; existing images never overwritten."""
    token=os.environ["GITHUB_TOKEN"]; repo=os.environ["GITHUB_REPOSITORY"]
    path=f"assets/instagram/{day.isoformat()}.png"
    existing=gh_request(f"contents/{path}?ref={ASSET_BRANCH}",token)
    if existing is None:
        ref=gh_request("git/ref/heads/"+ASSET_BRANCH,token)
        if ref is None:
            main=gh_request("git/ref/heads/main",token)
            if main is None: raise RuntimeError("Cannot find main branch")
            gh_request("git/refs",token,{"ref":"refs/heads/"+ASSET_BRANCH,"sha":main["object"]["sha"]},"POST")
        gh_request("contents/"+path,token,{"message":"Add Instagram graphic "+day.isoformat(),
                   "content":base64.b64encode(png).decode("ascii"),"branch":ASSET_BRANCH},"PUT")
    url=f"https://raw.githubusercontent.com/{repo}/{ASSET_BRANCH}/{path}"
    for i in range(20):
        try:
            with urlopen(Request(url,headers={"User-Agent":"continuum-instagram-automation"}),timeout=12) as resp:
                if resp.status==200 and resp.read(8)==b"\x89PNG\r\n\x1a\n":return url
        except (HTTPError,URLError,TimeoutError):
            pass
        pause.sleep(5)
    raise RuntimeError("Published PNG not yet publicly fetchable; retry will pick it up later")

def buffer_schedule(token,ch,caption,url,due):
    mutation=f'''mutation {{ createPost(input: {{text: {q(caption)}, channelId: {q(ch["id"])},
    schedulingType: automatic, mode: customScheduled, dueAt: {q(iso(due))},
    assets: [{{image: {{url: {q(url)}}}}}], aiAssisted: true}}) {{
    ... on PostActionSuccess {{ post {{ id dueAt assets {{ id mimeType }} }} }}
    ... on MutationError {{ message }} }} }}'''
    result=buffer_query(mutation,token)["createPost"]
    post=result.get("post")
    if not post or not post.get("assets"):
        raise RuntimeError("Buffer did not confirm an Instagram post WITH image: "+str(result.get("message","missing image")))
    return post["id"]

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--dry-run",action="store_true",help="Preview one PNG and caption; no posts scheduled")
    parser.add_argument("--date",help="Optional single MYT publication date YYYY-MM-DD")
    args=parser.parse_args()
    now=datetime.now(timezone.utc)
    dates=(date.fromisoformat(args.date),) if args.date else publication_dates(now.astimezone(TZ).date())
    if args.dry_run:
        from pathlib import Path
        for d in dates[:1]:
            p=plan_for(d)
            out=Path("/tmp/continuum-ig-preview-"+d.isoformat()+".png")
            out.write_bytes(render_png(p))
            print(json.dumps({"date":str(d),"topic":p,"caption":fallback_caption(p),"preview":str(out)},ensure_ascii=False))
        print("DRY RUN: no Buffer or GitHub media changes.")
        return
    if os.getenv("SOCIAL_AUTOPUBLISH_ENABLED","").lower()!="true":
        print("Social autopublish flag disabled; no Instagram posts created.")
        return
    token=os.environ["BUFFER_API_KEY"]
    ch=instagram_channel(token)
    count=0
    for d in dates:
        due=due_at(d)
        if due <= datetime.now(timezone.utc)+timedelta(minutes=15):continue
        if exists_in_buffer(token,ch,due):
            print(f"{d}: Instagram slot already in Buffer",flush=True)
            continue
        p=plan_for(d)
        caption=caption_for(d,p)
        image_url=host_png(d,render_png(p))
        post=buffer_schedule(token,ch,caption,image_url,due)
        print(f"{d}: Instagram image and caption scheduled: {post}",flush=True)
        count+=1
    print(f"Instagram recovery complete: {count} new posts.",flush=True)

if __name__=="__main__":
    try:main()
    except (ValueError,KeyError,RuntimeError,HTTPError,URLError) as e:
        print(f"Instagram automation error: {e}",file=sys.stderr)
        sys.exit(1)
