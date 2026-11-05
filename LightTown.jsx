import React,{useEffect,useState} from 'react';
import {Check,LockKeyhole,Star,Gem,Flower2,Lamp} from 'lucide-react';
import CompanionArt from './CompanionArt.jsx';
import {companions} from './adventure-model.mjs';
import {t} from './interface-runtime.mjs';

export function useLightCompanion(user,language){
 const [selection,setSelection]=useState(null);
 const owner=user?.id;
 useEffect(()=>{
  if(!owner)return;
  const request=new AbortController();
  fetch('/api/adventure?language='+encodeURIComponent(language),{signal:request.signal})
   .then(r=>r.ok?r.json():null)
   .then(data=>{if(!request.signal.aborted&&companions.includes(data?.companion))setSelection({owner,language,kind:data.companion})})
   .catch(()=>{});
  return ()=>request.abort();
 },[owner,language]);
 return owner?selection?.owner===owner&&selection?.language===language?selection.kind:null:'bird';
}

export function TownCompanion({kind,speaking=false,celebrate=false}){
 return kind?<span className="town-companion" data-companion={kind} data-speaking={speaking} aria-hidden="true">
  {kind==='capybara'?<img className="town-companion-sprite" src="/light-town/capybara.webp" alt="" data-celebrate={celebrate}/>:<CompanionArt kind={kind} mood={celebrate?'delight':'idle'} celebrate={celebrate}/>}
  {speaking&&<span className="town-waves"><i/><i/><i/></span>}
 </span>:null;
}

export const townRewards=['Terrace','Flower bed','Street lamp'];

export function TownRewardArt({index=0}){
 if(index===0)return <img src="/light-town/terrace.webp" alt=""/>;
 const Icon=index===1?Flower2:Lamp;
 return <Icon className="town-reward-icon" aria-hidden="true"/>;
}

export function TownGem(){
 return <Gem className="town-gem" aria-hidden="true"/>;
}

export function TownRibbon({children}){
 return <div className="town-ribbon">{children}</div>;
}

export function TownSegments({value,total,round=false,label}){
 if(total>(round?8:10))return <progress className="town-track" value={value} max={total} aria-label={label}/>;
 return <span className={'town-segments'+(round?' is-round':'')} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={total} aria-valuenow={value}>
  {Array.from({length:total},(_,i)=><i key={i} data-filled={i<value}>{round&&i<value&&<Check size={10}/>}</i>)}
 </span>;
}

export function TownScene({kind,places=[],decoration=0,celebrate=false}){
 return <div className={'town-scene'+(celebrate?' town-scene-celebrate':'')}>
  <img className="town-scenery" src="/light-town/diorama.webp" alt="" width="1050" height="700"/>
  {places.map((place,i)=><button key={place.id} className="town-building" data-position={i} data-status={place.status} aria-current={place.status==='current'?'step':undefined} aria-label={place.label} onClick={place.onOpen} disabled={!place.onOpen}>
   {place.status==='current'&&<span className="town-marker-callout" aria-hidden="true">{t('Up next')}</span>}
   <span className="town-pin">{place.status==='done'?<Check/>:place.status==='current'?<Star/>:<LockKeyhole/>}</span>
  </button>)}
  {decoration>0&&<img className="town-decoration" src="/light-town/terrace.webp" alt=""/>}
  {decoration>1&&<span className="town-flower" aria-hidden="true">🌸</span>}
  {decoration>2&&<span className="town-lantern" aria-hidden="true">🏮</span>}
  <TownCompanion kind={kind} celebrate={celebrate}/>
 </div>;
}
