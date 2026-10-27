import {journeyChapters,journeyLevels} from './journey-model.mjs';
import regionalPhotos from './journey-photo-credits.json' with {type:'json'};
import destinations from './public/passport-real/destinations.json' with {type:'json'};
import generatedScenes from './public/passport-scenery/photographic-v2.json' with {type:'json'};
import art from './public/passport-stamps/manifest.json' with {type:'json'};
import photos from './public/passport-real/catalog.json' with {type:'json'};
import {passportScenery} from './passport-scenery.mjs';
const chapters=language=>Object.keys(art).filter(k=>k.startsWith(language+':chapter:')).map(k=>k.slice(language.length+1));
export function passportCards(stamps=[],language='es',{includeLocked=false}={}){
 const ids=chapters(language),available=photos.filter(p=>p.language===language),planned=destinations.filter(p=>p.language===language),assigned=new Map(),used=new Set();
 for(const p of available){const identity=p.sha256||p.credit.source;if(used.has(identity))continue;used.add(identity);const i=planned.findIndex(d=>d.id===p.id),id=ids[i%ids.length];if(!assigned.has(id))assigned.set(id,[]);assigned.get(id).push(p)}
 // Reserve each regional photograph once, across the whole album rather than earned cards.
 const regional=regionalPhotos.filter(p=>p.id.startsWith(language+'-')&&!available.some(a=>a.credit.source===p.source));
 for(const id of ids)if(!assigned.has(id)&&regional.length){const p=regional.shift();assigned.set(id,[{id:'regional:'+p.id,language,place:p.place,src:'/journey-media/'+p.id+'.webp',credit:{title:p.place,source:p.source,author:p.author,license:p.license,licenseUrl:p.licenseUrl,changes:'Resized'}}])}
 const scenes=new Map();let sceneIndex=0;for(const key of Object.keys(art).filter(k=>k.startsWith(language+':'))){const id=key.slice(language.length+1);if(!assigned.has(id)){const scene=generatedScenes[sceneIndex++%generatedScenes.length];scenes.set(id,scene)}}
 const earned=new Map(stamps.map(s=>[s.id,s]));
 const entries=includeLocked?Object.entries(art).filter(([key])=>key.startsWith(language+':')).map(([key,value])=>{const id=key.slice(language.length+1);return earned.get(id)||{id,title:value.title,kind:id.startsWith('chapter:')?'chapter':id,locked:true}}):stamps;
 return entries.flatMap(stamp=>{
  const real=assigned.get(stamp.id);
  if(real?.length)return real.map(p=>({...stamp,key:stamp.id+':'+p.id,photo:p}));
  return [{...stamp,key:stamp.id,scene:scenes.get(stamp.id)}];
 });
}

export function passportMilestone(stamps=[],language='es'){
 const special=stamps.find(s=>['return','rhythm'].includes(s.id));if(special)return special;
 const earned=new Map(stamps.map(s=>[s.id,s]));
 for(const level of journeyLevels){const ids=journeyChapters(language,level).map(c=>'chapter:'+c.id);if(ids.length&&ids.every(id=>earned.has(id))){const dated=ids.map(id=>earned.get(id)).filter(s=>Number.isFinite(Date.parse(s.at))).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));return dated[0]||{id:'level:'+level}}}
 return null;
}
