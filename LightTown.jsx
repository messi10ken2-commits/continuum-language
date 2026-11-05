import React,{useEffect,useState} from 'react';
import {Check,LockKeyhole,Star} from 'lucide-react';
import CompanionArt from './CompanionArt.jsx';
import {companions} from './adventure-model.mjs';

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
  <CompanionArt kind={kind} mood={celebrate?'delight':'idle'} celebrate={celebrate}/>
  {speaking&&<span className="town-waves"><i/><i/><i/></span>}
 </span>:null;
}

const roofs={es:'#b65c53',en:'#5a7191',pt:'#398596',ja:'#a54a62',zh:'#a84e48',ko:'#496f72',fr:'#77518b',de:'#426852',ar:'#33848c',it:'#a75442'};
export function TownScene({language,kind,places=[],decoration=0,celebrate=false}){
 return <div className="town-scene">
  <img className="town-scenery" src={'/illustrated-lessons/'+language+'-cafe.webp'} alt=""/>
  <svg className="town-terrain" viewBox="0 0 450 240" preserveAspectRatio="none" aria-hidden="true">
   <path d="M5 155 155 40l286 43-6 105-151 50L5 191Z" fill="#9d7158"/>
   <path d="M5 155 155 40l286 43-6 65-151 61Z" fill="#a3ac6b"/>
   <path d="m284 209 151-61 6-65-70-11q21 49-87 137Z" fill="#5c98a5"/>
   <path d="m55 145 106-61 91 20 40 50-85 31-37-30 77-28 130-21" fill="none" stroke="#e0c499" strokeWidth="19" strokeLinejoin="round"/>
  </svg>
  {places.map((place,i)=><button key={place.id} className="town-building" data-position={i} data-status={place.status} aria-current={place.status==='current'?'step':undefined} onClick={place.onOpen} disabled={!place.onOpen}>
   <svg viewBox="0 0 150 115" aria-hidden="true">
    <ellipse cx="76" cy="102" rx="69" ry="11" fill="#3c251b" opacity=".25"/>
    <path d="m26 54 51-24 50 17v47l-50 16-51-16Z" fill="#c79970"/>
    <path d="m77 57 50-10v47l-50 16Z" fill="#96674d"/>
    <path d="m16 56 37-42 52 3 30 32-58 23Z" fill={i===0?'#78527d':roofs[language]}/>
    <path d="m16 56 37-42 24 58Z" fill="#482543" opacity=".28"/>
    <path d="m53 30 65 3m-60 11 68-2m-61 15 68-6" stroke="#492c46" opacity=".35" fill="none" strokeWidth="2"/>
    <path d="m36 70 28 9v19l-28-9Zm55 8 21-7v17l-21 8Z" fill="#ffe1a4"/>
    <path d="m48 74 0 19m54-18v16" stroke="#805c3d" strokeWidth="3"/>
    <path d="m73 86 11-3v24l-11 4Z" fill="#694536"/>
   </svg>
   <span className="town-pin">{place.status==='done'?<Check/>:place.status==='current'?<Star/>:<LockKeyhole/>}</span>
   <span className="town-building-label">{place.title}</span>
  </button>)}
  {decoration>0&&<svg className="town-decoration" viewBox="0 0 110 80" aria-hidden="true">
   <ellipse cx="49" cy="66" rx="43" ry="10" fill="#c29673"/>
   <path d="M49 22v44M29 53v16m39-16v16" stroke="#694535" strokeWidth="3"/>
   <ellipse cx="49" cy="51" rx="22" ry="7" fill="#d9a56a"/>
   <path d="M11 30q17-20 38-23 23 3 38 23-10 9-19 1-10 8-19 0-10 8-19 0-10 7-19-1Z" fill="#f1c4a1" stroke="#b77b69" strokeWidth="2"/>
   {decoration>1&&<path d="m76 58 21-3-1 12-17 3Z" fill="#aa557e"/>}
   {decoration>2&&<path d="M98 55V24m-5-2 5-8 6 8-3 7h-6Z" fill="#ffc667" stroke="#644e38" strokeWidth="2"/>}
  </svg>}
  <TownCompanion kind={kind} celebrate={celebrate}/>
 </div>;
}
