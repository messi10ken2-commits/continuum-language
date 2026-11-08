import React,{useEffect,useId,useRef,useState} from 'react';
import {ArrowRight,Sparkles} from 'lucide-react';
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
 return createPortal(<dialog ref={dialog} className={`lesson-milestone lesson-milestone-${kind}`} aria-labelledby={titleId} onCancel={event=>{event.preventDefault();onClose()}}>
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

export function LessonPromotion({user}){
 const key='continuum-lesson-promotion:'+user.id;
 const [offer,setOffer]=useState(0),[seconds,setSeconds]=useState(promotionDurationSeconds);
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
   if(state.current.pending)setOffer(state.current.pending);
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
     setOffer(0);
     setSeconds(promotionDurationSeconds);
     queued.length=0;
     return;
    }
    queued.splice(0).forEach(record);
    if(state.current.pending)setOffer(state.current.pending);
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
 useEffect(()=>{
  if(!offer)return;
  const deadline=performance.now()+promotionDurationSeconds*1000;
  const timer=setInterval(()=>{
   const remaining=Math.max(0,Math.ceil((deadline-performance.now())/1000));
   setSeconds(remaining);
   if(!remaining)clearInterval(timer);
  },100);
  return()=>clearInterval(timer);
 },[offer]);
 if(!offer)return null;
 const close=()=>{
  if(seconds>0)return;
  state.current={...state.current,pending:Math.max(0,state.current.pending-1)};
  save();
  setOffer(state.current.pending);
  setSeconds(promotionDurationSeconds);
 };
 const scene=seconds>11?0:seconds>7?1:seconds>2?2:3;
 const title=t(['More room to speak','Vocabulary and expression review','Learn without interruptions','Go further with Premium'][scene]);
 const summary=t(['Longer AI conversations with up to 48 replies per session.','Revisit words and phrases from your lessons as they come up for review.','No Continuum ads. YouTube may still show its own ads.','Make more room for real-life practice.'][scene]);
 return <MilestoneDialog kind="premium" label={t('Continuum Premium promotion')} title={title} onClose={close} art={<PremiumAdScene key={scene} scene={scene}/>}>
  <p>{summary}</p>
  <progress className="milestone-timer" aria-label={t('Continuum Premium promotion')} value={promotionDurationSeconds-seconds} max={promotionDurationSeconds}/>
  {seconds>0&&<p>{tf('Continue in {0} seconds',[seconds])}</p>}
  <button className="milestone-primary" disabled={seconds>0} onClick={()=>{close();window.dispatchEvent(new Event('continuum-premium-request'))}}>{t('Explore Premium')}<ArrowRight size={18} aria-hidden="true"/></button>
  <button className="milestone-skip" disabled={seconds>0} onClick={close}>{t('Continue learning')}</button>
 </MilestoneDialog>;
}
