import React,{useEffect,useMemo,useRef,useState} from 'react';
import {loadImmersiveUnit} from './immersive/loader.mjs';
import {immersiveRecordingPlaylist} from './immersive/audio-playlist.mjs';
import {t,tf} from './interface-runtime.mjs';
import SentenceAudio,{stopSentenceAudio} from './SentenceAudio.jsx';
import {TownCompanion} from './LightTown.jsx';
import AISpeaking from './AISpeaking.jsx';
import './immersive.css';

export default function ImmersiveMaterial({lesson,question,user,light=false,suspended=false,celebrate=false,companionKind,onReady}){
 const [unit,setUnit]=useState(null),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0),[speaking,setSpeaking]=useState(false),[live,setLive]=useState(false);
 const dialog=useRef(null);
 const kind=companionKind;
 useEffect(()=>{if(live)dialog.current?.showModal();else dialog.current?.close()},[live]);
 const source=question?.immersiveSource||{stage:lesson.immersive.stage,part:0};
 const [allAudio,setAllAudio]=useState(!light);
 useEffect(()=>{let active=true;setUnit(null);setFailed(false);onReady?.(false);
  loadImmersiveUnit(lesson.language,lesson.immersive.key).then(data=>{if(active){setUnit(data);onReady?.(true)}}).catch(()=>{if(active)setFailed(true)});
  return()=>{active=false;stopSentenceAudio()};
 },[lesson.id,retry]);
 useEffect(()=>{setAllAudio(!light);setLive(false);setSpeaking(false);stopSentenceAudio()},[question?.id,light]);
 useEffect(()=>{if(suspended){setLive(false);stopSentenceAudio()}},[suspended]);
 const stage=source.stage==='checkpoint'?'reading':source.stage;
 const part=Math.min(source.part||0,Math.max(0,(stage==='roleplay'?unit?.questions.roleplay:unit?.[stage])?.length-1));
 const recordings=useMemo(()=>{
  if(!unit)return [];
  return immersiveRecordingPlaylist(lesson,unit,{stage,part,all:allAudio});
 },[unit,stage,part,allAudio,lesson.id]);
 if(failed)return <div className="immersive-material-error" role="alert"><p>{t('Could not load this chapter. Try again.')}</p><button type="button" onClick={()=>setRetry(n=>n+1)}>{t('Try again')}</button></div>;
 if(!unit)return <div className="immersive-loading" role="status">{t('Loading chapter…')}</div>;
 const text=stage==='roleplay'?unit.questions.roleplay[part]?.sceneLine:unit[stage]?.[part]?.text;
 return <section className={'immersive-material '+(light?'immersive-compact':'')} data-stage={stage} data-scene={lesson.immersive.scene}>
  <div className="immersive-scene" inert={suspended||live?'':undefined}>
   <span className="immersive-scene-window" aria-hidden="true"/><span className="immersive-scene-shelf" aria-hidden="true"/>
   {kind&&<TownCompanion kind={kind} speaking={speaking} celebrate={celebrate}/>}
   <span className="immersive-scene-table" aria-hidden="true"/>
  </div>
  <div className="immersive-source" inert={live?'':undefined}>
   <div className="immersive-source-head"><b>{t(stage==='reading'?'Reading':stage==='listening'?'Listening':'Guided roleplay')}</b><span>{tf('Part {0} of {1}',[part+1,stage==='roleplay'?6:unit[stage].length])}</span></div>
   <p className="immersive-provenance">{t('Original fictional case study · Continuum')}</p>
   {stage==='reading'&&(light?<p className="immersive-excerpt" lang={lesson.locale} dir="auto">{text}</p>:<div className="immersive-reading" tabIndex={0} aria-label={t('Reading passage')} lang={lesson.locale} dir="auto">{unit.reading.map((p,i)=><p key={i} data-current={i===part}><span className="immersive-part-number" aria-hidden="true">{i+1}</span>{p.text}</p>)}</div>)}
   {stage==='roleplay'&&<p className="immersive-dialogue-line" lang={lesson.locale} dir="auto">{text}</p>}
   <div className="immersive-audio"><SentenceAudio key={stage+':'+part+':'+allAudio} text={recordings.map(r=>r.text).join('\n\n')} lang={lesson.locale} playlist={recordings} onPlaybackChange={setSpeaking}/>
    {stage!=='roleplay'&&<button type="button" className="text-button" aria-pressed={allAudio} onClick={()=>setAllAudio(v=>!v)}>{t(allAudio?'Listen to this part':'Listen to the full recording')}</button>}
   </div>
   {stage==='listening'&&<details><summary>{t('Show transcript')}</summary><div className="immersive-reading" lang={lesson.locale} dir="auto">{(allAudio?unit.listening:[unit.listening[part]]).map((p,i)=><p key={i}>{p.text}</p>)}</div></details>}
   <details className="immersive-reference"><summary>{t('Chapter sources')}</summary><p>{t('These are original fictional learning materials, not reports of real events. The recording uses an AI studio voice.')}</p>
    <h3>{t('Reading')}</h3><div className="immersive-reading" lang={lesson.locale} dir="auto">{unit.reading.map((p,i)=><p key={i}>{p.text}</p>)}</div>
    <h3>{t('Listening transcript')}</h3><div className="immersive-reading" lang={lesson.locale} dir="auto">{unit.listening.map((p,i)=><p key={i}>{p.text}</p>)}</div>
   </details>
   {lesson.immersive.stage==='roleplay'&&<div className="immersive-live">
    <p>{t('Practise decisions in the guided roleplay, then use your own voice in the live conversation. Guided scores measure your choices, not speaking proficiency.')}</p>
    <button type="button" className="outline-button" disabled={!user||suspended} aria-expanded={live} onClick={()=>{stopSentenceAudio();setLive(v=>!v)}}>{t(live?'Close live conversation':'Live AI conversation')}</button>
    {!user&&<p>{t('Sign in to save a live AI conversation.')}</p>}
    
   </div>}
  </div>
  <dialog ref={dialog} className="immersive-live-panel" aria-label={t('Live AI conversation')} onCancel={e=>{e.preventDefault();setLive(false)}} onClose={()=>setLive(false)}>{live&&!suspended&&<AISpeaking embedded language={lesson.language} user={user} initialScenario={lesson.immersive.unit} initialLevel={lesson.level} companion={kind||'capybara'} onBack={()=>setLive(false)}/>}</dialog>
 </section>;
}
