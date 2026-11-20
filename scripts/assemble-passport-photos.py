"""Build the usable catalogue from preserved per-photo records and editorial decisions."""
from pathlib import Path
import json,hashlib,ast,sys
from PIL import Image
root=Path(__file__).resolve().parent.parent;cache=root/'.media-build/passport-recovery';out=root/'public/passport-real'
# These initial source candidates failed the contact-sheet review.
review=set('en-gh en-ki en-mw en-mh en-gd en-gi en-sd es-co es-cu es-do es-uy pt-br es-madrid ja-sapporo ja-nara ja-yakushima ja-nikko ja-nagasaki ja-kagoshima es-extra-06 es-extra-10 es-extra-13 es-extra-16 es-extra-17 pt-extra-08 pt-extra-20 pt-extra-22 pt-extra-23 ja-extra-10 ja-extra-11 ja-extra-19 ja-extra-29'.split())
replaced=set()
for p in cache.glob('replacements*.log'):
 if p.exists():replaced.update(line.split()[0]for line in p.read_text().splitlines()if line.endswith('REPLACED'))
final_reject=set('en-gh en-mh en-gd es-cu es-madrid ja-sapporo ja-nara es-extra-06 ja-extra-10'.split())
accepted=[];unresolved=[]
for d in json.loads((out/'destinations.json').read_text()):
 p=cache/(d['id']+'.json');reason='No usable licensed photograph acquired'
 if p.exists():
  r=json.loads(p.read_text());f=root/('public'+r['src'])
  if d['id'] in final_reject or (d['id'] in review and d['id'] not in replaced):reason='Initial source rejected in visual review; replacement unavailable'
  else:
   try:
    b=f.read_bytes();assert len(b)>0;assert hashlib.sha256(b).hexdigest()==r['sha256'];Image.open(f).verify();assert r['credit']['author'];assert r['credit']['source'];r['credit']['licenseUrl']=r['credit'].get('licenseUrl') or r['credit']['source'];
    if '--freeze' in sys.argv:
     name=d['id']+'-'+r['sha256'][:12]+'.webp';target=out/name;tmp=target.with_suffix('.final');tmp.write_bytes(b);tmp.replace(target);r['src']='/passport-real/'+name
    accepted.append(r);continue
   except Exception:reason='Photo integrity or attribution check failed'
 unresolved.append({**d,'reason':reason})
(out/'catalog.json').write_text(json.dumps(accepted,ensure_ascii=False,indent=2)+'\n');(out/'unresolved.json').write_text(json.dumps(unresolved,ensure_ascii=False,indent=2)+'\n')
print('Accepted',len(accepted),'Unresolved',len(unresolved))
