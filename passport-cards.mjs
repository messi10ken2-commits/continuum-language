import regionalPhotos from './journey-photo-credits.json' with {type:'json'};
import destinations from './public/passport-real/destinations.json' with {type:'json'};
import art from './public/passport-stamps/manifest.json' with {type:'json'};
import photos from './public/passport-real/catalog.json' with {type:'json'};
import {passportScenery} from './passport-scenery.mjs';
const chapters=language=>Object.keys(art).filter(k=>k.startsWith(language+':chapter:')).map(k=>k.slice(language.length+1));
export function passportCards(stamps=[],language='es'){
 const ids=chapters(language),available=photos.filter(p=>p.language===language),planned=destinations.filter(p=>p.language===language),assigned=new Map();
 for(const p of available){const i=planned.findIndex(d=>d.id===p.id),id=ids[i%ids.length];if(!assigned.has(id))assigned.set(id,[]);assigned.get(id).push(p)}
 return stamps.flatMap(stamp=>{
  const real=assigned.get(stamp.id);
  if(real?.length)return real.map(p=>({...stamp,key:stamp.id+':'+p.id,photo:p}));
  if(stamp.id.startsWith('chapter:')){const regional=regionalPhotos.filter(p=>p.id.startsWith(language+'-'));const p=regional[ids.indexOf(stamp.id)%regional.length];if(p)return [{...stamp,key:stamp.id,photo:{id:'regional:'+p.id,language,place:p.place,src:'/journey-media/'+p.id+'.webp',credit:{title:p.place,source:p.source,author:p.author,license:p.license,licenseUrl:p.licenseUrl,changes:'Resized'}}}]}
  return [{...stamp,key:stamp.id,scene:passportScenery(language,stamp.id)}];
 });
}
