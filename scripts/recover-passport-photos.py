"""Reacquire recovered Commons destination queries; retain credits and per-item failures."""
import json,urllib.request,urllib.parse,concurrent.futures,re,html,hashlib,io,time
from pathlib import Path
from PIL import Image,ImageOps
root=Path(__file__).resolve().parent.parent
out=root/'public/passport-real'; cache=root/'.media-build/passport-recovery';cache.mkdir(parents=True,exist_ok=True)
rows=json.loads((out/'destinations.json').read_text())
def request(url):
 time.sleep(1)
 req=urllib.request.Request(url,headers={'User-Agent':'ContinuumPassport/1.0 (educational travel photo collection; source attribution retained)'})
 with urllib.request.urlopen(req,timeout=25) as r:return r.read()
def clean(s):return html.unescape(re.sub('<[^>]+>','',s or '')).strip()
def recover(d):
 p=cache/(d['id']+'.json')
 if p.exists():
  cached=json.loads(p.read_text());f=root/('public'+cached['src'])
  if f.exists() and f.stat().st_size and hashlib.sha256(f.read_bytes()).hexdigest()==cached['sha256']:return cached
 try:
  params=dict(action='query',format='json',generator='search',gsrsearch='intitle:"'+d['place']+'" filetype:bitmap',gsrnamespace=6,gsrlimit=5,prop='imageinfo',iiprop='url|extmetadata|size',iiurlwidth=960)
  data=json.loads(request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))
  for page in sorted(data.get('query',{}).get('pages',{}).values(),key=lambda x:x.get('index',99)):
   info=page.get('imageinfo',[{}])[0];meta=info.get('extmetadata',{});license=clean(meta.get('LicenseShortName',{}).get('value'));title=page['title']
   if not re.search(r'CC BY|CC0|Public domain|PDM',license,re.I) or re.search(r'NC|ND',license):continue
   if re.search(r'\b(map|flag|coat of arms|locator|diagram|portrait|stamp|banknote|painting|engraving|drawing|passport|sketch)\b|\.tiff?$',title,re.I):continue
   if info.get('width',0)<600 or info.get('height',0)<350 or not .9<info['width']/info['height']<2.7:continue
   if re.search(r'\b(map|painting|engraving|drawing|etching|lithograph|manuscript|watercolour|watercolor|antique)\b|IA dr |Insulae',title+' '+clean(meta.get('ImageDescription',{}).get('value')),re.I):continue
   raw=request(info.get('thumburl') or info['url']);im=Image.open(io.BytesIO(raw));im=ImageOps.exif_transpose(im).convert('RGB');im=ImageOps.fit(im,(960,680));f=out/(d['id']+'.webp');temp=f.with_suffix('.tmp');im.save(temp,'WEBP',quality=86,method=6);temp.replace(f)
   result={**d,'src':'/passport-real/'+f.name,'kind':'photograph','credit':{'title':title,'source':info['descriptionurl'],'author':clean(meta.get('Artist',{}).get('value')),'license':license,'licenseUrl':meta.get('LicenseUrl',{}).get('value') or info['descriptionurl'],'changes':'Cropped and resized'},'sha256':hashlib.sha256(f.read_bytes()).hexdigest()}
   p.write_text(json.dumps(result,ensure_ascii=False,indent=2));return result
  return {**d,'error':'No eligible photograph found for recovered query'}
 except Exception as e:return {**d,'error':str(e)}
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
 for d in pool.map(recover,rows):
  results.append(d);(out/'recovery-status.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n');print(d['id'], 'OK' if d.get('src') else d.get('error'),flush=True)
(out/'catalog.json').write_text(json.dumps([d for d in results if d.get('src')],ensure_ascii=False,indent=2)+'\n')
print('DONE',len(results),'PHOTOS',sum(bool(x.get('src')) for x in results),flush=True)
