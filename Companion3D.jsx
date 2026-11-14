import React,{useEffect,useRef,useState} from 'react';

// One lazy renderer module, no model downloads or per-frame React updates.
let rendererModule;
export default function Companion3D({kind='capybara',speaking=false,celebrate=false,reacting=false,level=0,children}){
 const host=useRef(null),player=useRef(null),values=useRef({speaking,celebrate,reacting,level});
 values.current={speaking,celebrate,reacting,level};
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const element=host.current;if(!element)return;setReady(false);
  let live=true,creating=false,inView=false;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>player.current?.setActive(inView&&!document.hidden&&!element.closest('[inert]'),preference.matches);
  const start=async()=>{
   if(creating||player.current||!live)return;creating=true;
   try{
    rendererModule??=import('./companion-3d-renderer.mjs').catch(error=>{rendererModule=undefined;throw error});
    const {createCompanion}=await rendererModule;
    if(!live)return;
    player.current=createCompanion(element,kind,()=>values.current);
    setReady(true);sync();
   }catch{element.dataset.renderer='fallback'}
  };
  const observer=new IntersectionObserver(entries=>{
   inView=entries[0].isIntersecting;
   if(inView)void start();sync();
  });observer.observe(element);
  const inert=new MutationObserver(sync);
  for(let ancestor=element;ancestor;ancestor=ancestor.parentElement)inert.observe(ancestor,{attributes:true,attributeFilter:['inert']});
  document.addEventListener('visibilitychange',sync);preference.addEventListener('change',sync);
  const lost=e=>{e.preventDefault();setReady(false);player.current?.setActive(false,true);element.dataset.renderer='fallback'};
  element.addEventListener('webglcontextlost',lost,true);
  return()=>{live=false;observer.disconnect();inert.disconnect();document.removeEventListener('visibilitychange',sync);preference.removeEventListener('change',sync);element.removeEventListener('webglcontextlost',lost,true);player.current?.dispose();player.current=null;};
 },[kind]);
 return <span className="companion-3d" ref={host} data-ready={ready} aria-hidden="true">{children}</span>;
}
