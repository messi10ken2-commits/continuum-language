import React,{useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Pause,Play,RotateCcw} from 'lucide-react';
import {t} from './interface-runtime.mjs';
import {livingMapState,livingMapTheme} from './living-map-model.mjs';
import './living-map.css';
export default function LivingMap({chapters,width,height,identity='map',language='en',controlsTarget}){
 const art=livingMapTheme(language),{completed,phase}=livingMapState(chapters),[paused,setPaused]=useState(false),[replay,setReplay]=useState(0),[changing,setChanging]=useState(false),[controlsHost,setControlsHost]=useState(null),previous=useRef(null);
 useEffect(()=>setControlsHost(controlsTarget?.current?.parentElement||null),[controlsTarget]);
 useEffect(()=>{const key='continuumPaintedWorld:'+identity;let old=previous.current;try{old??=Number(localStorage.getItem(key)||0);localStorage.setItem(key,String(completed))}catch{}if(completed>old){setReplay(n=>n+1);setChanging(true)}previous.current=completed;const timer=setTimeout(()=>setChanging(false),6500);return()=>clearTimeout(timer)},[completed,identity]);
 const labels=['A world that grows with you','The station is restored','The café is open','The neighbourhood is blooming','Warm lights across your neighbourhood'];
 const fx=art.effects,unlocked=phase>=art.motion.unlockPhase,mask=([x,y,rx,ry])=>({maskImage:`radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%,#000 62%,transparent 100%)`});
 const bounds=([x,y,w,h])=>({left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
 const paint=(name,extra={})=>({backgroundImage:`url(${art[name].src})`,...extra});
 return <div className={'living-map painted-world phase-'+phase+(paused?' motion-paused':'')+(changing?' world-changing':'')} data-phase={phase} data-language={language} data-panorama="continuous" data-motion-unlocked={unlocked}>
 <div className="painted-panorama" key={replay} style={{width,height}} aria-hidden="true">
 <div className="painted-layer painted-quiet" style={paint('quiet')}/>
 {!unlocked&&<>
 {phase>=1&&<div className="painted-layer painted-station" style={paint('day',mask(fx.station))}/>}
 {phase>=2&&<div className="painted-layer painted-cafe" style={paint('day',mask(fx.cafe))}/>}
 {phase>=3&&<div className="painted-layer painted-garden" style={paint('day',mask(fx.garden))}/>}
 </>}
 {unlocked&&<>
 <div className="painted-layer painted-evening painted-still" data-stationary-scenery="true" style={{backgroundImage:`url(${art.motion.still.src})`}}/>
 <div className="painted-object-stage" data-object-motion="unlocked">
 {art.motion.clouds.map((cloud,i)=><span className="painted-cloud" data-moving-object="cloud" key={i} style={{...bounds(cloud),animationDelay:(-i*13)+'s'}}><svg viewBox="0 0 240 80" preserveAspectRatio="none"><path d="M8 53Q4 35 28 35Q30 13 58 22Q73 0 98 21Q127 5 143 29Q169 14 187 35Q218 29 227 49Q246 62 219 68Q155 82 90 70Q44 79 8 63Z" fill="#e5b5c7"/><path d="M18 56Q50 45 83 55Q128 43 161 54Q199 47 223 58Q158 75 99 65Q51 73 18 62Z" fill="#ffc995"/></svg></span>)}
 <span className="painted-train-rig" data-moving-object="train" style={bounds(art.motion.train.bounds)}>
 <img className="painted-train-sprite" src={art.motion.train.src} alt="" draggable="false"/>
 <i className="painted-headlight" data-moving-object="light" style={{left:art.motion.headlight[0]+"%",top:art.motion.headlight[1]+"%"}}/>
 {art.locomotiveSteam&&<span className="painted-steam train-steam"><i/><i/><i/></span>}
 </span>
 <span className="painted-person-rig" data-moving-object="person" style={bounds(art.motion.person.bounds)}><img src={art.motion.person.src} alt="" draggable="false"/></span>
 {fx.lamps.map(([x,y],j)=><i className="painted-lamp" data-moving-object="light" key={j} style={{left:x+'%',top:y+'%',animationDelay:j*.5+'s'}}/>)}
 </div>
 {art.motion.foreground.map((clipPath,i)=><div key={i} className="painted-layer painted-foreground" style={{backgroundImage:`url(${art.motion.still.src})`,clipPath}}/>)}
 </>}

 </div>
 {controlsHost&&createPortal(<div className={"living-map-controls"+(changing?" world-changing-controls":"")} onPointerDown={e=>e.stopPropagation()}><span className="painted-status" role="status" aria-live="polite">{t(labels[phase])}</span>{phase>0&&<><button type="button" onClick={()=>{setPaused(false);setReplay(n=>n+1)}} aria-label={t('Replay world restoration')}><RotateCcw size={15}/></button><button type="button" onClick={()=>setPaused(v=>!v)} aria-pressed={paused} aria-label={t(paused?'Resume map motion':'Pause map motion')}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></>}</div>,controlsHost)}
 </div>
}
