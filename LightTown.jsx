import React,{useEffect,useState} from 'react';
import {Check,LockKeyhole,Star,Gem} from 'lucide-react';
import {companions} from './adventure-model.mjs';
import {t,tf} from './interface-runtime.mjs';
import {townPlacedRewards} from './light-town.mjs';
import {townArt} from './light-town-art.mjs';

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
  <img className="town-companion-sprite" src={'/light-town/'+kind+'.webp'} alt="" data-celebrate={celebrate}/>
  {speaking&&<span className="town-waves"><i/><i/><i/></span>}
 </span>:null;
}

export function townRewardLabel(item,language='es'){
 const regional=townArt(language).atlas;
 const name=regional&&item.art==='rose-arch'?t('Flower arch'):regional&&language!=='ja'&&item.art==='maple'?t('Ornamental tree'):t(item.name);
 return item.edition>1?tf('{0} · Edition {1}',[name,item.edition]):name;
}

export function TownRewardArt({item,language='es'}){
 const art=townArt(language),style={'--town-reward-hue':((item.edition-1)*27)%360+'deg'};
 const sprite=art.sprites?.[item.slot];
 if(sprite)return <svg className="town-reward-art" aria-hidden="true" viewBox={sprite.join(' ')} width={sprite[2]} height={sprite[3]} style={style}>
  <image href={art.atlas} width="672" height="672"/>
 </svg>;
 return <img className="town-reward-art" src={'/light-town/'+item.art+'.webp'} alt="" style={style}/>;
}

export function TownCollection({language,items,placements,onPlace,busy,failed}){
 if(!items.length)return null;
 const placed=new Set(townPlacedRewards(items,placements).map(item=>item.index));
 const saved=new Set(placements.map(placement=>placement.rewardIndex));
 return <details className="town-collection">
  <summary>{t('Town collection')} · {items.length}</summary>
  {failed&&<p role="alert">{t('Could not save town decoration.')}</p>}
  <ul>{items.map(item=><li key={item.index}>
   <button type="button" aria-pressed={placed.has(item.index)} disabled={busy||saved.has(item.index)} onClick={()=>onPlace(item)}>
    <TownRewardArt item={item} language={language}/><span>{townRewardLabel(item,language)}</span>
    <small>{t(saved.has(item.index)?'Placed in town':placed.has(item.index)?'Keep this color':'Place in town')}</small>
   </button>
  </li>)}</ul>
 </details>;
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

export function TownScene({language,kind,places=[],collection=[],placements=[],highlight,celebrate=false}){
 const art=townArt(language);
 return <div className={'town-scene'+(celebrate?' town-scene-celebrate':'')} data-regional={!!art.atlas}>
  <img className="town-scenery" src={art.scenery} alt="" width="1050" height="700"/>
  {places.map((place,i)=><button key={place.id} className="town-building" style={{left:art.pins[i][0]+'%',top:art.pins[i][1]+'%'}} data-status={place.status} aria-current={place.status==='current'?'step':undefined} aria-label={place.label} onClick={place.onOpen} disabled={!place.onOpen}>
   {place.status==='current'&&<span className="town-marker-callout" aria-hidden="true">{t('Up next')}</span>}
   <span className="town-pin">{place.status==='done'?<Check/>:place.status==='current'?<Star/>:<LockKeyhole/>}</span>
  </button>)}
  {townPlacedRewards(collection,placements).sort((a,b)=>art.anchors[a.slot][1]-art.anchors[b.slot][1]).map(item=>{
   const [x,y,width]=art.anchors[item.slot];
   return <span className="town-decoration" style={{left:x+'%',top:y+'%',width:width+'%'}} data-slot={item.slot} data-new={highlight===item.index} key={item.slot}>
    <TownRewardArt item={item} language={language}/><span className="sr-only">{townRewardLabel(item,language)}</span>
   </span>;
  })}
  <TownCompanion kind={kind} celebrate={celebrate}/>
 </div>;
}
