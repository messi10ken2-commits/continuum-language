import React,{useEffect,useRef,useState} from 'react';
import townOpeningVideo from './public/light-town/word-town-opening.mp4?url';
import {Check,LockKeyhole,Star,Gem,Sparkles} from 'lucide-react';
import {companions,companionNames} from './adventure-model.mjs';
import {t,tf} from './interface-runtime.mjs';
import {townPlacedRewards} from './light-town.mjs';
import {townArt,townRewardImage} from './light-town-art.mjs';
import {useLightMotion} from './light-motion.mjs';

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
 const [reacting,setReacting]=useState(false);
 useEffect(()=>{
  if(!reacting)return;
  const timer=window.setTimeout(()=>setReacting(false),900);
  return()=>window.clearTimeout(timer);
 },[reacting]);
 return kind?<button type="button" className="town-companion" data-companion={kind}
  data-speaking={speaking} data-reacting={reacting}
  aria-label={t(companionNames[kind])+' · '+t('Delighted reaction')}
  onClick={()=>setReacting(true)}>
  <span className="town-companion-ground" aria-hidden="true"/>
  <span className="town-companion-depth" aria-hidden="true">
   <img className="town-companion-sprite" src={'/light-town/'+kind+'.webp'} alt="" data-celebrate={celebrate}/>
  </span>
  {speaking&&<span className="town-waves" aria-hidden="true"><i/><i/><i/></span>}
 </button>:null;
}

export function townRewardLabel(item,language='es'){
 const name=!['es','ja'].includes(language)&&item.art==='maple'?t('Ornamental tree'):t(item.name);
 return item.edition>1?tf('{0} · Edition {1}',[name,item.edition]):name;
}

export function TownRewardArt({item,language='es'}){
 const style={'--town-reward-hue':((item.edition-1)*27)%360+'deg'};
 return <img className="town-reward-art" src={townRewardImage(language,item)} alt="" style={style}/>;
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

export function TownScene({language,kind,places=[],collection=[],placements=[],highlight,built,newPlot,celebrate=false}){
 const motion=useLightMotion();
 const art=townArt(language);
 const builtLots=built??art.stages.length-1;
 const [companionX,companionY,companionWidth]=art.companion;
 return <div ref={motion} className={'town-scene'+(celebrate?' town-scene-celebrate':'')} style={{'--companion-x':companionX+'%','--companion-y':companionY+'%','--companion-width':companionWidth+'%'}}>
  <img key={art.stages[builtLots]} className={'town-scenery'+(newPlot===undefined?'':' town-stage-new')} src={art.stages[builtLots]} alt="" width="1050" height="700"/>
  {places.map((place,i)=><button key={place.id} className="town-building" style={{left:art.pins[i][0]+'%',top:(place.status==='current'&&builtLots===i?art.pins[i][1]+23:art.pins[i][1])+'%'}} data-status={place.status} aria-current={place.status==='current'?'step':undefined} aria-label={place.label} onClick={place.onOpen} disabled={!place.onOpen}>
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

export function TownOpening({children,enabled=true,onComplete}){
 const [playing,setPlaying]=useState(false);
 const [playAction,setPlayAction]=useState(null);
 const video=useRef(null),complete=useRef(onComplete);
 complete.current=onComplete;
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setPlaying(enabled&&!reduced);
  setPlayAction(null);
  if(enabled&&reduced)complete.current?.();
 },[enabled]);
 useEffect(()=>{
  if(!playing)return;
  let live=true;
  video.current?.play()?.catch(()=>{if(live)setPlayAction(action=>action==='retry'?action:'play')});
  return()=>{live=false};
 },[playing]);
 const finish=()=>{video.current?.pause();setPlaying(false);complete.current?.()};
 const play=()=>{
  const player=video.current;if(!player)return;
  if(playAction==='retry')player.load();
  setPlayAction(null);
  player.play()?.catch(()=>setPlayAction(action=>action==='retry'?action:'play'));
 };
 return <div className="town-opening-frame">
  <div inert={playing||undefined}>{children}</div>
  {playing&&<div className="town-opening">
   <video ref={video} src={townOpeningVideo} autoPlay muted playsInline aria-hidden="true" onPlaying={()=>setPlayAction(null)} onPause={e=>{if(!e.currentTarget.ended)setPlayAction(action=>action==='retry'?action:'play')}} onEnded={finish} onError={()=>setPlayAction('retry')}/>
   {playAction&&<button className="town-opening-play" type="button" onClick={play}>{t(playAction==='retry'?'Try again':'Play')}</button>}
   <button className="town-opening-continue" type="button" onClick={finish}>{t('Continue')}</button>
  </div>}
 </div>;
}

export function TownRewardScene({language,kind,item,collection,placements,built}){
 const placed=townPlacedRewards(collection,placements).some(reward=>reward.index===item.index);
 const [x,y,width]=townArt(language).anchors[item.slot];
 return <div className="town-reward-scene" data-placed={placed} style={{
  '--town-landing-x':x+'%','--town-landing-y':y+'%','--town-landing-width':width+'%'
 }}>
  <TownScene language={language} kind={kind} collection={collection} placements={placements} built={built} highlight={placed?item.index:undefined}/>
  <span className="town-reward-reveal" aria-hidden="true"><Sparkles/></span>
  <span className="town-reward-flight" aria-hidden="true"><TownRewardArt item={item} language={language}/></span>
  {placed&&<span className="town-reward-placed"><Check size={16} aria-hidden="true"/>{t('Placed in town')}</span>}
 </div>;
}
