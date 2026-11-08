import React,{useEffect,useId,useRef,useState} from 'react';
import {ArrowRight,MessageCircle,Sparkles} from 'lucide-react';
import {createPortal} from 'react-dom';
import {billingRequest} from './Membership.jsx';
import {t} from './interface-runtime.mjs';
import './lesson-milestone.css';

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

const promotionSeen=new Map();
export default function LessonMilestone({user,reward,visible=true}){
 const [rewardSeen,setRewardSeen]=useState(false),[offerOpen,setOfferOpen]=useState(false);
 const waitingForReward=!!reward&&!rewardSeen;
 useEffect(()=>{
  if(!visible||user?.role!=='learner'||waitingForReward)return;
  const day=new Date().toISOString().slice(0,10),key='continuum-premium-promotion:'+user.id;
  let active=true;
  // Store a single day per account, so the cap also applies across browser tabs.
  if(promotionSeen.get(key)===day)return;
  try{if(localStorage.getItem(key)===day)return}catch{}
  billingRequest().then(({membership})=>{
   if(!active||membership?.adFree!==false||promotionSeen.get(key)===day)return;
   try{if(localStorage.getItem(key)===day)return;localStorage.setItem(key,day)}catch{}
   promotionSeen.set(key,day);
   setOfferOpen(true);
  }).catch(()=>{});
  const closeOffer=()=>{active=false;setOfferOpen(false)};
  window.addEventListener('continuum-membership-changed',closeOffer);
  return()=>{active=false;window.removeEventListener('continuum-membership-changed',closeOffer)};
 },[user?.id,user?.role,visible,waitingForReward]);

 if(!visible)return null;
 if(waitingForReward)return <MilestoneDialog key="reward" kind="reward" label={t('New reward unlocked')} title={reward.title} art={reward.art} onClose={()=>setRewardSeen(true)}>
  <p>{reward.description}</p>
  <button className="milestone-primary" data-milestone-focus onClick={()=>setRewardSeen(true)}>{t('Continue')}<ArrowRight size={18} aria-hidden="true"/></button>
 </MilestoneDialog>;
 if(!offerOpen)return null;
 const close=()=>setOfferOpen(false);
 return <MilestoneDialog key="premium" kind="premium" label={t('Continuum Premium promotion')} title={t('Big conversations start with small steps.')} onClose={close} art={<>
  <img className="milestone-world" src="/membership/premium-flow-v1.webp" alt=""/>
  <img className="milestone-capybara" src="/companions-v2/capybara-head-happy.webp" alt=""/>
  <span className="milestone-conversation"><MessageCircle size={32} aria-hidden="true"/></span>
 </>}>
  <p>{t('Practise real conversations, get detailed feedback and learn without Continuum ads.')}</p>
  <button className="milestone-primary" onClick={()=>{close();window.dispatchEvent(new Event('continuum-premium-request'))}}>{t('Explore Premium')}<ArrowRight size={18} aria-hidden="true"/></button>
  <button className="milestone-skip" data-milestone-focus onClick={close}>{t('Continue learning')}</button>
 </MilestoneDialog>;
}
