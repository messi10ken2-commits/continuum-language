import json,urllib.request,urllib.parse,re,html,time,hashlib,io
from pathlib import Path
from PIL import Image,ImageOps
root=Path(__file__).resolve().parent.parent;out=root/'public/passport-real';cache=root/'.media-build/passport-recovery';rows={d['id']:d for d in json.loads((out/'destinations.json').read_text())}
queries={'en-gh':'Cape Coast Castle exterior','en-ki':'Tarawa lagoon','en-mw':'Lake Malawi lake beach','en-mh':'Majuro lagoon','en-gd':'St Georges Grenada harbour','en-gi':'Rock of Gibraltar panorama','en-sd':'Meroe pyramids Sudan','es-co':'Cartagena Colombia skyline','es-cu':'Havana panorama','es-do':'Punta Cana beach','es-uy':'Colonia del Sacramento lighthouse','pt-br':'Sugarloaf Mountain Rio panorama','es-madrid':'Gran Via Madrid street','ja-sapporo':'Sapporo Snow Festival snow sculpture','ja-nara':'Nara Park deer landscape','ja-yakushima':'Yakushima forest river','ja-nikko':'Nikko Toshogu gate','ja-nagasaki':'Nagasaki harbour panorama','ja-kagoshima':'Sakurajima volcano panorama','es-extra-06':'Teotihuacan Pyramid Sun','es-extra-10':'Ushuaia city panorama','es-extra-13':'Cocora Valley wax palms','es-extra-16':'La Paz Bolivia panorama','es-extra-17':'Manuel Antonio National Park beach','pt-extra-08':'Recife skyline','pt-extra-20':'Guimaraes castle exterior','pt-extra-22':'Mindelo Cape Verde harbour','pt-extra-23':'Santa Maria Sal beach','ja-extra-10':'Tottori sand dunes landscape','ja-extra-11':'Amanohashidate sandbar panorama','ja-extra-19':'Furano lavender field','ja-extra-29':'Enoshima island panorama'}
def req(url):
 time.sleep(2)
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'ContinuumPassport/1.0 (educational photographs; retains attribution)'}),timeout=25).read()
def clean(s):return html.unescape(re.sub('<[^>]+>','',s or '')).strip()
for id,query in queries.items():
 try:
  p=dict(action='query',format='json',generator='search',gsrsearch=query+' filetype:bitmap -filetype:svg',gsrnamespace=6,gsrlimit=8,prop='imageinfo',iiprop='url|extmetadata|size',iiurlwidth=960);data=json.loads(req('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(p)));pages=list(data.get('query',{}).get('pages',{}).values())
  pages.sort(key=lambda p:(-len(re.findall(r'panorama|landscape|skyline|aerial|view',p['title'],re.I)),p.get('index',99)))
  success=False
  for page in pages:
   info=page.get('imageinfo',[{}])[0];m=info.get('extmetadata',{});lic=clean(m.get('LicenseShortName',{}).get('value'));title=page['title'];desc=clean(m.get('ImageDescription',{}).get('value'))
   if not re.search('CC BY|CC0|Public domain|PDM',lic,re.I) or re.search('NC|ND',lic):continue
   if re.search(r'\b(map|portrait|painting|engraving|drawing|etching|lithograph|manuscript|watercolour|watercolor|antique|taxi|moth|captain|rickshaw|train|palanquin|scan)\b|IA dr |Insulae',title+' '+desc,re.I):continue
   if info.get('width',0)<600 or info.get('height',0)<350 or not 1.05<info['width']/info['height']<2.7:continue
   im=ImageOps.exif_transpose(Image.open(io.BytesIO(req(info.get('thumburl') or info['url'])))).convert('RGB');im=ImageOps.fit(im,(960,680));f=out/(id+'.webp');tmp=f.with_suffix('.replacement');im.save(tmp,'WEBP',quality=86,method=6);tmp.replace(f)
   d={**rows[id],'src':'/passport-real/'+f.name,'kind':'photograph','credit':{'title':title,'source':info['descriptionurl'],'author':clean(m.get('Artist',{}).get('value')),'license':lic,'licenseUrl':m.get('LicenseUrl',{}).get('value') or info['descriptionurl'],'changes':'Cropped and resized'},'sha256':hashlib.sha256(f.read_bytes()).hexdigest()};(cache/(id+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2));success=True;break
  print(id,'REPLACED' if success else 'UNRESOLVED',flush=True)
 except Exception as e:print(id,str(e),flush=True)
