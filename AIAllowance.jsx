import React,{useEffect,useState} from 'react';
import {t,tf,interfaceLanguage} from './interface-runtime.mjs';
import {requestPremium} from './premium-prompt.mjs';

export function notifyAIAllowance(bucket){window.dispatchEvent(new CustomEvent('continuum-ai-allowance',{detail:bucket}));}
export function aiRequestKey(storageKey){
 try{
  const saved=sessionStorage.getItem(storageKey);
  if(saved)return saved;
  const key=crypto.randomUUID();
  sessionStorage.setItem(storageKey,key);
  return key;
 }catch{return crypto.randomUUID();}
}
export function clearAIRequestKey(storageKey){try{sessionStorage.removeItem(storageKey);}catch{}}

export default function AIAllowance({bucket,user}){
 const [usage,setUsage]=useState(null);
 useEffect(()=>{
  if(!user?.id)return;
  const endpoint=bucket==='focused'?'/api/skills/ai-usage':'/api/speaking/usage';
  let live=true,controller;
  const refresh=event=>{
   if(event?.detail&&event.detail!==bucket)return;
   controller?.abort();
   controller=new AbortController();
   fetch(endpoint,{credentials:'same-origin',signal:controller.signal})
    .then(response=>response.ok?response.json():null)
    .then(data=>{if(live&&data)setUsage(data.usage);}).catch(()=>{});
  };
  refresh();
  window.addEventListener('continuum-ai-allowance',refresh);
  window.addEventListener('focus',refresh);
  const timer=setInterval(refresh,60000);
  return()=>{live=false;controller?.abort();clearInterval(timer);window.removeEventListener('continuum-ai-allowance',refresh);window.removeEventListener('focus',refresh);};
 },[bucket,user?.id]);
 if(!usage||!user?.id)return null;
 const localReset=new Intl.DateTimeFormat(interfaceLanguage(),{weekday:'short',hour:'numeric',minute:'2-digit'}).format(new Date(usage.resetAt));
 const label=bucket==='focused'?'{0} / {1} AI evaluations used today':'{0} / {1} AI conversation sessions used today';
 return <aside className="ai-allowance" aria-label={t('Daily AI usage')}>
  <strong>{tf(label,[usage.used,usage.limit])}</strong>
  <p>{tf('{0} available · Resets at {1} local time.',[usage.remaining,localReset])}</p>
  {usage.reserved>0&&<small>{tf('{0} reserved.',[usage.reserved])}</small>}
  {usage.used>=usage.limit&&(usage.premium?<p>{t('Your daily AI limit has been reached.')}</p>:<button className="text-button" onClick={()=>requestPremium('Daily AI usage')}>{t('Explore Premium')}</button>)}
 </aside>;
}
