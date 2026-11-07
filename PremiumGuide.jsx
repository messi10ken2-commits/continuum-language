import React,{useEffect,useState} from 'react';
import {MessageCircle,Target,ClipboardCheck,Ticket,Video,PawPrint,ShieldCheck} from 'lucide-react';
import {t,tf} from './interface-runtime.mjs';
export default function PremiumGuide({user,onAccount,compact=false,premium:initialPremium,courses,language='en'}){
 const [billing,setBilling]=useState(null);
 useEffect(()=>{
  if(!user||initialPremium!==undefined)return;
  let live=true;
  fetch('/api/billing',{credentials:'same-origin'}).then(r=>r.ok?r.json():null)
   .then(data=>{if(live)setBilling(data)}).catch(()=>{});
  return()=>{live=false};
 },[user?.id,initialPremium]);
 const premium=initialPremium??billing?.membership.premium;
 const courseCount=(courses??billing?.courses)?.filter(course=>course.language===language).length;
 const benefits=[
  [MessageCircle,'More room to speak','Longer AI conversations with up to 48 replies per session.'],
  [Target,'Practise for real life','Practise listening, writing and speaking for interviews, work, travel and life abroad.'],
  [ClipboardCheck,'Understand your next step','Get detailed skill feedback, corrections and personalised practice suggestions.'],
  [Video,'Exclusive courses','Explore regional varieties, idioms and academic language.'],
  [PawPrint,'More companions','Choose a capybara, guinea pig, quokka or panda as your learning companion.'],
  [Ticket,'Meet a teacher','One introductory class ticket after your first successful paid subscription.'],
  [ShieldCheck,'Learn without interruptions','No Continuum ads. YouTube may still show its own ads.']
 ];
 return <section className={'premium-guide panel '+(compact?'compact':'')}>
  <div className="premium-guide-hero">
   <img src="/membership/premium-flow-v1.webp" alt="" width="1200" height="800" loading="lazy"/>
   <div>
    <span className="eyebrow">CONTINUUM PREMIUM</span>
    <h2>{t(premium?'Make your Premium time count':'Turn your next real-life moment into progress.')}</h2>
    <p>{t('Keep your regular lessons free. Add deeper practice when you want to go further.')}</p>
    {onAccount&&<button className="primary" onClick={onAccount}>{t(premium?'Manage membership':'Explore Premium')}</button>}
   </div>
  </div>
  <div className="premium-guide-benefits">
   {benefits.map(([Icon,title,copy])=><article key={title}><Icon size={23} aria-hidden="true"/><h3>{t(title)}</h3><p>{Icon===Video&&courseCount>0&&<>{tf('{0} lessons in your learning language.',[courseCount])} </>}{t(copy)}</p></article>)}
  </div>
  <p className="premium-guide-note"><strong>{t('Free')}</strong> · {t('Standard and Light lessons, Word Town, vocabulary review and one AI conversation a day for up to seven minutes.')}</p>
  <small className="premium-guide-ticket-note">{t('The introductory ticket is granted once, not on renewal. Participating teachers and duration limits apply. Tester invitations include a ticket only when specified.')}</small>
 </section>;
}
