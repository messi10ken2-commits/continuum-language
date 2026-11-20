"""Package generated illustration assets without changing existing artwork.
Usage: python scripts/build-illustration-catalog.py /absolute/path/plan.json
The plan contains lang, key, region, subject and the generated source path.
"""
import hashlib,json,sys
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent.parent
plan=json.loads(Path(sys.argv[1]).read_text())
target=root/'public/illustrated-lessons';manifest_path=target/'manifest.json'
manifest=json.loads(manifest_path.read_text());assets={a['file']:a for a in manifest['assets']}
missing=[]
for a in plan:
 if not a.get('source'):
  missing.append(a['lang']+'-'+a['key']);continue
 source=Path(a['source']);name=a['lang']+'-'+a['key']+'.webp';dest=target/name
 source_hash=hashlib.sha256(source.read_bytes()).hexdigest()
 if dest.exists() and assets.get(name,{}).get('sourceSha256')==source_hash and assets.get(name,{}).get('width')==960 and dest.stat().st_size==assets[name]['bytes']:continue
 image=Image.open(source).convert('RGB');image.resize((960,540),Image.Resampling.LANCZOS).save(dest,'WEBP',quality=76,method=4)
 b=dest.read_bytes();assets[name]={'file':name,'language':a['lang'],'context':a['key'],'width':960,'height':540,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'source':source.name,'sourceSha256':source_hash,'generation':'built-in image_gen','prompt':{'setting':a['region'],'scene':a['subject'],'style':'Soft hand-drawn watercolor and gouache, delicate ink lines, warm daylight, adult everyday life; no UI or lettering.'}}
manifest['version']=2;manifest['assets']=list(assets.values());manifest['provenance']='Original Continuum watercolor illustrations. New regional contextual assets and additional study scenes generated individually using the existing Japanese cafe illustration as a style reference; originals retained.'
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'packaged':len(plan)-len(missing),'remaining':len(missing),'total_catalogue_assets':len(assets),'bytes':sum(a['bytes'] for a in assets.values())}))
