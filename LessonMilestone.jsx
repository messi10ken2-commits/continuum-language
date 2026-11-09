import React,{useEffect,useId,useRef,useState} from 'react';
import {ArrowRight,Sparkles,Volume2,VolumeX} from 'lucide-react';
import {createPortal} from 'react-dom';
import {billingRequest} from './Membership.jsx';
import {playRewardSound} from './feedback-sound.mjs';
import {t,tf} from './interface-runtime.mjs';
import './lesson-milestone.css';
import PremiumAdScene from './PremiumAdScene.jsx';
import {promotionAfterCompletion,promotionDurationSeconds} from './lesson-promotion.mjs';

function MilestoneDialog({kind,label,title,art,children,onClose}){
 const dialog=useRef(null),titleId=useId();
 useEffect(()=>{
  const element=dialog.current;
  element.showModal();
  element.querySelector('[data-milestone-focus]')?.focus({preventScroll:true});
  return()=>element.close();
 },[]);
 return createPortal(<dialog ref={dialog} className={`lesson-milestone lesson-milestone-${kind}`} aria-labelledby={titleId} onCancel={event=>{event.preventDefault();onClose?.()}}>
  <div className="milestone-content">
   <span className="milestone-label"><Sparkles size={18} aria-hidden="true"/>{label}</span>
   <h2 id={titleId}>{title}</h2>
   <div className="milestone-art">{art}</div>
   {children}
  </div>
 </dialog>,document.body);
}

const completionEvent='continuum-lesson-completed';

export default function LessonMilestone({user,completionId,reward,visible=true}){
 const [rewardSeen,setRewardSeen]=useState(false);
 const playedReward=useRef(false);
 const waitingForReward=!!reward&&!rewardSeen;
 useEffect(()=>{
  if(!visible||!waitingForReward||playedReward.current)return;
  playedReward.current=true;
  void playRewardSound();
 },[visible,waitingForReward]);
 useEffect(()=>{
  if(!visible||waitingForReward||user?.role!=='learner'||!completionId)return;
  window.dispatchEvent(new CustomEvent(completionEvent,{detail:{userId:user.id,id:completionId}}));
 },[visible,waitingForReward,user?.id,user?.role,completionId]);

 if(!visible||!waitingForReward)return null;
 return <MilestoneDialog kind="reward" label={t('New reward unlocked')} title={reward.title} art={reward.art} onClose={()=>setRewardSeen(true)}>
  <p>{reward.description}</p>
  <button className="milestone-primary" data-milestone-focus onClick={()=>setRewardSeen(true)}>{t('Continue')}<ArrowRight size={18} aria-hidden="true"/></button>
 </MilestoneDialog>;
}

function PromotionDialog({onFinish}){
 const video=useRef(null),lastPlayedPosition=useRef(0);
 const [videoUnavailable,setVideoUnavailable]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [muted,setMuted]=useState(true);
 const [seconds,setSeconds]=useState(promotionDurationSeconds);
 useEffect(()=>{
  const element=video.current;
  let elapsed=0,lastTick=performance.now(),lastPosition=0,stalledFor=0;
  const play=()=>void element.play().catch(error=>{
   if(error.name!=='AbortError')setVideoUnavailable(true);
  });
  const syncPlayback=()=>{
   lastTick=performance.now();
   if(!element)return;
   if(document.hidden)element.pause();
   else if(!element.ended)play();
  };
  syncPlayback();
  document.addEventListener('visibilitychange',syncPlayback);
  const timer=setInterval(()=>{
   const now=performance.now();
   const delta=now-lastTick;
   lastTick=now;
   if(document.hidden)return;
   if(element){
    if(element.ended)return;
    if(element.paused)play();
    stalledFor=element.currentTime>lastPosition?0:stalledFor+delta;
    lastPosition=element.currentTime;
    if(stalledFor>=10000)setVideoUnavailable(true);
    return;
   }
   elapsed+=delta;
   const remaining=Math.max(0,Math.ceil(promotionDurationSeconds-elapsed/1000));
   setSeconds(remaining);
   if(!remaining)clearInterval(timer);
  },250);
  return()=>{
   clearInterval(timer);
   document.removeEventListener('visibilitychange',syncPlayback);
  };
 },[videoUnavailable]);
 const scene=seconds>11?0:seconds>7?1:seconds>2?2:3;
 const label=t('Continuum Premium promotion');
 return <MilestoneDialog kind="premium" label={label} title={t('Go further with Premium')} onClose={seconds===0?()=>onFinish(false):undefined} art={videoUnavailable
  ?<PremiumAdScene key={scene} scene={scene}/>
  :<video
   ref={video}
   className="premium-ad-video"
   src="/membership/premium-promotion-v2.mp4"
   aria-label={label}
   autoPlay
   muted={muted}
   playsInline
   disablePictureInPicture
   disableRemotePlayback
   onContextMenu={event=>event.preventDefault()}
   onPlay={({currentTarget})=>{if(document.hidden)currentTarget.pause()}}
   onSeeking={({currentTarget})=>{
    if(currentTarget.currentTime!==lastPlayedPosition.current)currentTarget.currentTime=lastPlayedPosition.current;
   }}
   onTimeUpdate={({currentTarget})=>{
    if(currentTarget.seeking||currentTarget.ended)return;
    lastPlayedPosition.current=currentTarget.currentTime;
    setSeconds(Math.max(1,Math.ceil(promotionDurationSeconds-currentTarget.currentTime)));
   }}
   onEnded={()=>setSeconds(0)}
   onError={()=>setVideoUnavailable(true)}
  />
 }>
  {seconds>0?<>
   {!videoUnavailable&&<button className="milestone-sound" type="button" aria-label={t('Audio')} aria-pressed={!muted} onClick={()=>setMuted(!muted)}>
    {muted?<VolumeX size={22} aria-hidden="true"/>:<Volume2 size={22} aria-hidden="true"/>}
   </button>}
   <div className="milestone-ad-footer">
    <progress className="milestone-timer" aria-label={label} value={promotionDurationSeconds-seconds} max={promotionDurationSeconds}/>
    <p>{tf('Continue in {0} seconds',[seconds])}</p>
   </div>
  </>:<div className="milestone-ad-footer">
   <button className="milestone-primary" onClick={()=>onFinish(true)}>{t('Explore Premium')}<ArrowRight size={18} aria-hidden="true"/></button>
   <button className="milestone-skip" onClick={()=>onFinish(false)}>{t('Continue learning')}</button>
  </div>}
 </MilestoneDialog>;
}

export function LessonPromotion({user}){
 const key='continuum-lesson-promotion:'+user.id;
 const [offer,setOffer]=useState(false),[adNumber,setAdNumber]=useState(0);
 const status=useRef(null),state=useRef({recent:[],count:0,pending:0});
 const save=()=>{
  try{localStorage.setItem(key,JSON.stringify(state.current))}catch{}
 };
 useEffect(()=>{
  if(user.role!=='learner')return;
  let active=true,revision=0;
  const queued=[];
  try{
   const stored=JSON.parse(localStorage.getItem(key));
   if(Array.isArray(stored?.recent)&&[0,1].includes(stored.count)&&Number.isSafeInteger(stored.pending)&&stored.pending>=0)state.current=stored;
  }catch{}
  const record=id=>{
   state.current=promotionAfterCompletion(state.current,id);
   save();
   if(state.current.pending)setOffer(true);
  };
  const completed=({detail})=>{
   if(detail.userId!==user.id)return;
   if(status.current==='free')record(detail.id);
   else if(status.current===null)queued.push(detail.id);
  };
  const verify=()=>{
   const token=++revision;
   status.current=null;
   billingRequest().then(({membership})=>{
    if(!active||token!==revision)return;
    status.current=membership?.adFree===false?'free':'premium';
    if(status.current==='premium'){
     if(state.current.pending){state.current={...state.current,pending:0};save()}
     setOffer(false);
     queued.length=0;
     return;
    }
    queued.splice(0).forEach(record);
    if(state.current.pending)setOffer(true);
   }).catch(()=>{});
  };
  window.addEventListener(completionEvent,completed);
  window.addEventListener('continuum-membership-changed',verify);
  verify();
  return()=>{
   active=false;
   window.removeEventListener(completionEvent,completed);
   window.removeEventListener('continuum-membership-changed',verify);
  };
 },[key,user.id,user.role]);
 if(!offer)return null;
 const finish=openPremium=>{
  state.current={...state.current,pending:Math.max(0,state.current.pending-1)};
  save();
  setOffer(state.current.pending>0);
  setAdNumber(number=>number+1);
  if(openPremium)window.dispatchEvent(new Event('continuum-premium-request'));
 };
 return <PromotionDialog key={adNumber} onFinish={finish}/>;
}
