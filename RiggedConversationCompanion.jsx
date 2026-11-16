import React,{useEffect,useRef,useState} from 'react';
import {companionNames} from './adventure-model.mjs';
import {t} from './interface-runtime.mjs';
let rigModule;
export default function RiggedConversationCompanion({kind='capybara',state='idle',level=0}){
 const root=useRef(null),host=useRef(null),values=useRef({state,level}),[ready,setReady]=useState(false);values.current={state,level:Number.isFinite(level)?Math.max(0,Math.min(1,level)):0};
 useEffect(()=>{
  const element=root.current,surface=host.current,preference=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController();let live=true,inView=false,creating=false,player=null,failed=false;
  const sync=()=>{const active=inView&&!document.hidden&&!element.closest('[inert]');element.dataset.motion=active&&!preference.matches&&!failed?'on':'off';player?.setActive(active,preference.matches)};
  const start=async()=>{if(creating||player||failed||!live)return;creating=true;
   try{rigModule??=import('./companion-call-rig.mjs').catch(e=>{rigModule=undefined;throw e});const {createCallRig}=await rigModule;if(!live)return;
    const next=await createCallRig(surface,()=>values.current,{kind,signal:abort.signal,onLost:()=>{failed=true;setReady(false);sync()}});
    if(!live){next.dispose();return}player=next;setReady(true);sync();
   }catch{if(live){failed=true;setReady(false);sync()}}
  };
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)void start();sync()});observer.observe(element);
  const inert=new MutationObserver(sync);for(let ancestor=element;ancestor;ancestor=ancestor.parentElement)inert.observe(ancestor,{attributes:true,attributeFilter:['inert']});
  document.addEventListener('visibilitychange',sync);preference.addEventListener('change',sync);
  return()=>{live=false;abort.abort();observer.disconnect();inert.disconnect();document.removeEventListener('visibilitychange',sync);preference.removeEventListener('change',sync);player?.dispose()};
 },[kind]);
 return <div ref={root} className="call-companion call-companion-3d" data-companion={kind} data-renderer={ready?'rig3d':'image'} data-state={state} role="img" aria-label={t(companionNames[kind])}>
  <img className="call-companion-art" src={'/light-town/'+kind+'.webp'} alt="" draggable="false"/>
  <span ref={host} className="call-companion-rig" aria-hidden="true"/>
 </div>;
}
