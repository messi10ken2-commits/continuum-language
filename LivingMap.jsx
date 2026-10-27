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
 const fx=art.effects,mask=([x,y,rx,ry])=>({maskImage:`radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%,#000 62%,transparent 100%)`});
 const [tx,ty,trx,tryy]=fx.train;
 const hole=`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000' preserveAspectRatio='none'><defs><filter id='b'><feGaussianBlur stdDeviation='7'/></filter></defs><rect width='1000' height='1000' fill='white'/><ellipse cx='${tx*10}' cy='${ty*10}' rx='${trx*7}' ry='${tryy*7}' fill='black' filter='url(#b)'/></svg>`)}")`;
 const paint=(name,extra={})=>({backgroundImage:`url(${art[name].src})`,...extra});
 return <div className={'living-map painted-world phase-'+phase+(paused?' motion-paused':'')+(changing?' world-changing':'')} data-phase={phase} data-language={language} data-panorama="continuous">
 <div className="painted-panorama" key={replay} style={{width,height}} aria-hidden="true">
 <div className="painted-layer painted-quiet" style={paint('quiet')}/>
 {phase>=1&&<div className="painted-layer painted-station" style={paint('day',mask(fx.station))}/>}
 {phase>=2&&<div className="painted-layer painted-cafe" style={paint('day',mask(fx.cafe))}/>}
 {phase>=3&&<div className="painted-layer painted-garden" style={paint('day',mask(fx.garden))}/>}
 {phase>=4&&<div className="painted-layer painted-evening" style={paint('evening',{maskImage:hole})}/>}
 {phase>=1&&<><div className="painted-layer painted-train" style={paint(phase>=4?'evening':'day',mask(fx.train))}/>{art.locomotiveSteam&&<span className="painted-steam train-steam" style={{left:fx.steam[0]+"%",top:fx.steam[1]+"%"}}><i/><i/><i/></span>}</>}
 {phase>=2&&<span className="painted-steam cafe-steam" style={{left:fx.cafeSteam[0]+"%",top:fx.cafeSteam[1]+"%"}}><i/><i/></span>}
 {phase>=3&&<div className="painted-layer painted-flower-motion" style={paint(phase>=4?'evening':'day',{...mask(fx.garden),transformOrigin:fx.garden[0]+'% 95%'})}/>}
 {phase>=4&&<><div className="painted-water" style={{left:fx.water[0]+"%",top:fx.water[1]+"%",width:fx.water[2]+"%",height:fx.water[3]+"%"}}/>{fx.lamps.map(([x,y],j)=><i className="painted-lamp" key={j} style={{left:x+'%',top:y+'%',animationDelay:j*.5+'s'}}/>)}</>}
 </div>
 {controlsHost&&createPortal(<div className={"living-map-controls"+(changing?" world-changing-controls":"")} onPointerDown={e=>e.stopPropagation()}><span className="painted-status" role="status" aria-live="polite">{t(labels[phase])}</span>{phase>0&&<><button type="button" onClick={()=>{setPaused(false);setReplay(n=>n+1)}} aria-label={t('Replay world restoration')}><RotateCcw size={15}/></button><button type="button" onClick={()=>setPaused(v=>!v)} aria-pressed={paused} aria-label={t(paused?'Resume map motion':'Pause map motion')}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></>}</div>,controlsHost)}
 </div>
}
