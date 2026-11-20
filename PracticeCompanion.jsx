import React,{useEffect,useRef,useState} from 'react';
import CompanionArt from './CompanionArt.jsx';
import {companionNames} from './adventure-model.mjs';
import {companionReactions} from './companion-reactions.mjs';
import {t} from './interface-runtime.mjs';
const labels={hello:'Happy greeting',call:'Hear their call',delight:'Delighted reaction',finale:'Our journey celebration'};
export default function PracticeCompanion({user,language}){
 const identity=user?.id+':'+language,[loaded,setLoaded]=useState(null),[event,setEvent]=useState(''),[replay,setReplay]=useState(0),[error,setError]=useState('');
 const audio=useRef(null),timer=useRef(null),next=useRef(0),generation=useRef(0);
 const data=loaded?.identity===identity?loaded.data:null,kind=data?.companion,bond=data?.bonds?.[kind],modes=companionReactions(bond);
 useEffect(()=>{let live=true;setLoaded(null);if(user?.id)fetch('/api/adventure?language='+encodeURIComponent(language),{credentials:'same-origin'}).then(r=>r.ok?r.json():null).then(data=>{if(live)setLoaded({identity,data})}).catch(()=>{});return()=>{live=false}},[identity]);
 useEffect(()=>{const element=audio.current;next.current=0;setEvent('');setError('');return()=>{generation.current++;clearTimeout(timer.current);element?.pause()}},[identity,kind]);
 if(!kind)return null;
 const react=()=>{
  if(!modes.length)return;
  const mode=modes[next.current++%modes.length],token=++generation.current;clearTimeout(timer.current);audio.current?.pause();if(audio.current)audio.current.currentTime=0;
  setError('');setEvent(mode);setReplay(n=>n+1);
  if((mode==='call'||mode==='finale')&&audio.current){audio.current.volume=.55;audio.current.play().catch(e=>{if(e.name!=='AbortError'&&generation.current===token)setError('The sound could not play. Please try again.')})}
  timer.current=setTimeout(()=>{generation.current++;setEvent('');audio.current?.pause()},mode==='call'?7000:mode==='finale'?6000:3200);
 };
 return <span className="studio-companion"><button type="button" className="studio-companion-touch" disabled={!modes.length} aria-label={t(companionNames[kind])+' · '+t(labels[modes[next.current%modes.length]]||'Happy greeting')} title={!modes.length?t('Happy greeting')+' · '+t('5 chapters'):undefined} onClick={react}><CompanionArt key={kind+':'+replay} kind={kind} celebrate={!!event} mood={event||'idle'} finale={event==='finale'}/></button><audio key={identity+':'+kind} ref={audio} src={bond?.voice||bond?.finale?'/companions-v2/'+kind+'-call.m4a':undefined} preload="none"/>{error&&<span className="studio-companion-error" role="alert">{t(error)}</span>}</span>;
}
