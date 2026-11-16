import React,{useEffect,useRef,useState} from 'react';
import {companionNames} from './adventure-model.mjs';
import {t} from './interface-runtime.mjs';
import {companionRig,createCompanionPuppet} from './companion-puppet.mjs';

// A textured 2.5D puppet, not a replacement 3D animal. Audio amplitude drives
// local jaw deformation; microphone amplitude never makes the partner speak.
export default function ConversationCompanion({kind,state='idle',level=0,utterance=''}){
 const selected=companionRig[kind]?kind:'bird',rig=companionRig[selected],button=useRef(null),image=useRef(null),canvas=useRef(null),wake=useRef(()=>{}),turns=useRef(0),activity=useRef({state,level,gestureAt:0,question:false});
 const [renderer,setRenderer]=useState('image');activity.current.state=state;activity.current.level=Number.isFinite(level)?Math.min(1,Math.max(0,level)):0;
 useEffect(()=>{turns.current++;activity.current.question=/[?？؟]/.test(utterance);activity.current.gestureAt=turns.current===1||turns.current%3===0||/[!！]/.test(utterance)?performance.now():-Infinity;wake.current()},[utterance]);
 useEffect(()=>{wake.current()},[state,level]);
 useEffect(()=>{
  const root=button.current,img=image.current,surface=canvas.current,preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let puppet=null,frame=0,previous=0,visible=true,dead=false,renderedJaw=0;
  const fit=()=>{const {width,height}=root.getBoundingClientRect();if(!width||!height)return;const scale=Math.min((width-16)/(rig.head[2]*2.1),(height-18)/(rig.size[1]*.96));root.style.setProperty('--rig-width',rig.size[0]*scale+'px');root.style.setProperty('--rig-height',rig.size[1]*scale+'px');root.style.setProperty('--rig-left',(width/2-rig.head[0]*scale)+'px');root.style.setProperty('--rig-top',Math.max(0,(height-rig.size[1]*scale)*.3)+'px')};
  const enabled=()=>visible&&!document.hidden&&!root.closest('[inert]')&&!preference.matches;
  const draw=time=>{
   frame=0;if(dead||!puppet)return;
   const moving=enabled(),a=activity.current,speaking=a.state==='speaking',live=['speaking','listening','thinking','connecting','preparing'].includes(a.state),age=(time-a.gestureAt)/1000;
   const target=moving&&speaking?a.level:0;renderedJaw+= (target-renderedJaw)*.55;
   const t=time/1000,blink=moving?Math.max(0,1-Math.abs((t%5.4)-.16)/.12):0;
   puppet.draw({jaw:renderedJaw<.015?0:.12+Math.sqrt(renderedJaw)*.88,blink,head:moving?(Math.sin(t*(speaking?2.4:1.35))*(a.state==='listening'?.022:.012)+(a.state==='thinking'?-.02:a.question&&speaking?.018:0)):0,arm:moving&&age>=0&&age<1.4?Math.sin(age*8)*.055*Math.sin(age/1.4*Math.PI):0});
   if(moving&&(live||age<1.4||renderedJaw>.015))frame=requestAnimationFrame(tick);
  };
  const tick=time=>{if(time-previous<1000/24){frame=requestAnimationFrame(tick);return}previous=time;draw(time)};
  const start=()=>{if(!frame&&!dead&&puppet)frame=requestAnimationFrame(tick)};wake.current=start;
  const sync=()=>{cancelAnimationFrame(frame);frame=0;root.dataset.motion=enabled()?'on':'off';if(!enabled()){renderedJaw=0;puppet?.draw({});return}start()};
  const initialize=()=>{if(dead||!img.naturalWidth)return;puppet?.dispose();puppet=createCompanionPuppet(surface,img,rig);setRenderer(puppet?'puppet':'image');activity.current.gestureAt=performance.now();if(puppet){puppet.draw({});sync()}};
  const lost=e=>{e.preventDefault();cancelAnimationFrame(frame);frame=0;puppet?.dispose();puppet=null;setRenderer('image')};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()});observer.observe(root);
  const resize=new ResizeObserver(fit);resize.observe(root);fit();
  img.addEventListener('load',initialize);surface.addEventListener('webglcontextlost',lost);surface.addEventListener('webglcontextrestored',initialize);document.addEventListener('visibilitychange',sync);preference.addEventListener('change',sync);
  if(img.complete&&img.naturalWidth)initialize();
  return()=>{dead=true;wake.current=()=>{};cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();img.removeEventListener('load',initialize);surface.removeEventListener('webglcontextlost',lost);surface.removeEventListener('webglcontextrestored',initialize);document.removeEventListener('visibilitychange',sync);preference.removeEventListener('change',sync);puppet?.dispose();surface.getContext('webgl')?.getExtension('WEBGL_lose_context')?.loseContext()};
 },[kind]);
 return <button ref={button} type="button" className="call-companion" data-companion={selected} data-renderer={renderer} data-state={state} aria-label={t(companionNames[kind]||companionNames.bird)+' · '+t('Delighted reaction')} onClick={()=>{activity.current.gestureAt=performance.now();wake.current()}}>
  <img ref={image} className="call-companion-art" src={'/light-town/'+selected+'.webp'} alt="" draggable="false"/>
  <canvas ref={canvas} className="call-companion-puppet" aria-hidden="true"/>
 </button>;
}
