import React,{useEffect,useRef,useState} from 'react';
import {Pause,Play,RotateCcw} from 'lucide-react';
import {t} from './interface-runtime.mjs';
import {livingMapState} from './living-map-model.mjs';
import art from './public/living-map-v2/manifest.json';
import './living-map.css';
export default function LivingMap({chapters,width,height,districtWidth=width,identity='map'}){
 const {completed,phase}=livingMapState(chapters),[paused,setPaused]=useState(false),[replay,setReplay]=useState(0),[changing,setChanging]=useState(false),previous=useRef(null);
 useEffect(()=>{const key='continuumPaintedWorld:'+identity;let old=previous.current;try{old??=Number(localStorage.getItem(key)||0);localStorage.setItem(key,String(completed))}catch{}if(completed>old){setReplay(n=>n+1);setChanging(true)}previous.current=completed;const timer=setTimeout(()=>setChanging(false),6500);return()=>clearTimeout(timer)},[completed,identity]);
 const labels=['A world that grows with you','The station is restored','The café is open','The neighbourhood is blooming','Warm lights across your neighbourhood'],count=Math.max(1,Math.round(width/districtWidth));
 const paint=(name,extra={})=>({backgroundImage:`url(${art[name].src})`,...extra});
 return <div className={'living-map painted-world phase-'+phase+(paused?' motion-paused':'')+(changing?' world-changing':'')} data-phase={phase}>
 {Array.from({length:count},(_,i)=><div className="painted-district" key={i+':'+replay} style={{left:i*districtWidth,width:districtWidth,height}} aria-hidden="true">
 <div className="painted-layer painted-quiet" style={paint('quiet')}/>
 {phase>=1&&<div className="painted-layer painted-station" style={paint('day')}/>}
 {phase>=2&&<div className="painted-layer painted-cafe" style={paint('day')}/>}
 {phase>=3&&<div className="painted-layer painted-garden" style={paint('day')}/>}
 {phase>=4&&<div className="painted-layer painted-evening" style={paint('evening')}/>}
 {phase>=1&&<><div className="painted-layer painted-train" style={paint(phase>=4?'evening':'day')}/><span className="painted-steam train-steam"><i/><i/><i/></span></>}
 {phase>=2&&<span className="painted-steam cafe-steam"><i/><i/></span>}
 {phase>=3&&<div className="painted-layer painted-flower-motion" style={paint(phase>=4?'evening':'day')}/>}
 {phase>=4&&<><div className="painted-water"/>{[[12,68],[47,70],[93,71],[30,87],[63,55],[78,37]].map(([x,y],j)=><i className="painted-lamp" key={j} style={{left:x+'%',top:y+'%',animationDelay:j*.5+'s'}}/>)}</>}
 </div>)}
 <div className="living-map-controls" onPointerDown={e=>e.stopPropagation()}><span className="painted-status" role="status" aria-live="polite">{t(labels[phase])}</span>{phase>0&&<><button type="button" onClick={()=>{setPaused(false);setReplay(n=>n+1)}} aria-label={t('Replay world restoration')}><RotateCcw size={15}/></button><button type="button" onClick={()=>setPaused(v=>!v)} aria-pressed={paused} aria-label={t(paused?'Resume map motion':'Pause map motion')}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></>}</div>
 </div>
}
