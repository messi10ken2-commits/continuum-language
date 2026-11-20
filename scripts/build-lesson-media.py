"""Render public curriculum recap videos. Requires Pillow, ffmpeg and a Japanese-capable font.
Run node scripts/export-lesson-media.mjs, then python scripts/build-lesson-media.py FONT_PATH.
Clips are silent, captioned visual recaps, not filmed conversations or native-speaker footage.
"""
import json,sys,pathlib,subprocess,concurrent.futures,base64,hashlib
from PIL import Image,ImageDraw,ImageFont,ImageOps
root=pathlib.Path(__file__).resolve().parent.parent
build=root/'.media-build';build.mkdir(exist_ok=True)
fontpath=sys.argv[1]
def font(n):
 f=ImageFont.truetype(fontpath,n)
 if hasattr(f,'set_variation_by_axes'):f.set_variation_by_axes([450])
 return f
rows=json.loads((build/'catalog.json').read_text())
def wrap(text,f,width):
 lines=[];line=''
 # Character-based wrapping also supports Japanese, preserving full strings in the web transcript.
 for token in str(text):
  if token=='\n' or f.getlength(line+token)>width:
   lines.append(line.strip());line='' if token=='\n' else token
  else:line+=token
 if line:lines.append(line.strip())
 return lines

def para(d,text,xy,size,width,maxlines,fill):
 f=font(size);lines=wrap(text,f,width)
 if len(lines)>maxlines:lines=lines[:maxlines];lines[-1]=lines[-1].rstrip(' .,;')+'…'
 for i,line in enumerate(lines):d.text((xy[0],xy[1]+i*(size+7)),line,font=f,fill=fill)

def render(row):
 folder=build/row['id'];folder.mkdir(exist_ok=True)
 frames=row['frames'];photo=Image.open(root/'public/lesson-media'/f"{row['theme']}.jpg").convert('RGB')
 for i,f in enumerate(frames):
  im=Image.new('RGB',(720,404),'#f6f4ef');d=ImageDraw.Draw(im)
  im.paste(ImageOps.fit(photo,(230,260)),(22,92))
  d.rounded_rectangle((22,287,252,366),12,fill='#202943')
  para(d,row['level']+' · '+row['skill'],(36,301),16,200,2,'white')
  d.text((24,16),'CONTINUUM  /  VISUAL RECAP',font=font(13),fill='#6460a6')
  para(d,row['title'],(24,39),22,672,1,'#202943')
  d.text((278,90),f['label'].upper(),font=font(13),fill='#6460a6')
  para(d,f['text'],(278,119),27,410,4,'#202943')
  para(d,f['meaning'],(278,266),17,404,3,'#515873')
  for j in range(len(frames)):
   x=278+j*140;d.rounded_rectangle((x,369,x+126,375),3,fill='#6558ce' if j==i else '#dad7e8')
  im.save(folder/f'{i}.png')
 listing=folder/'frames.txt';listing.write_text(''.join(f"file '{i}.png'\nduration 6\n" for i in range(len(frames)))+f"file '{len(frames)-1}.png'\n")
 out=folder/'recap.mp4'
 subprocess.run(['ffmpeg','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-t',str(len(frames)*6),'-vf','fps=10,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','29','-threads','1','-movflags','+faststart','-an',str(out)],check=True)
 return row['language'],row['id'],out.read_bytes()
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(render,rows))
manifest={}
for language in ['es','en','pt','ja']:
 clips={id:base64.b64encode(data).decode() for lang,id,data in results if lang==language}
 (root/f'lesson-videos-{language}.json').write_text(json.dumps(clips,separators=(',',':')))
 print(language,len(clips),sum(len(x) for x in clips.values()),flush=True)
for lang,id,data in results:manifest[id]={'language':lang,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'duration':next(len(r['frames'])*6 for r in rows if r['id']==id)}
(root/'lesson-video-manifest.json').write_text(json.dumps(manifest,separators=(',',':')))
print('Rendered',len(results),'videos',flush=True)
