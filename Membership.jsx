import {Check, MessageCircle, Star} from 'lucide-react';
import PremiumGuide from './PremiumGuide.jsx';
import {InvitationAdmin,InvitationRedeem} from './PremiumAccess.jsx';
import React,{useEffect,useRef,useState} from 'react';
import {t,tf} from './interface-runtime.mjs';
import './membership.css';
export async function billingRequest(path='',method='GET',body){const r=await fetch('/api/billing'+path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok)throw Error(d.error||'Please try again');return d;}
export const membershipStatusLabel=status=>t(({active:'Active',free:'Free',trialing:'Trial',past_due:'Past due',unpaid:'Unpaid',incomplete:'Incomplete',incomplete_expired:'Expired',paused:'Paused',canceled:'Cancelled',cancelled:'Cancelled',payment_review:'Payment review'})[status]||status);
export function MembershipAd({user}){const [ad,setAd]=useState(null);useEffect(()=>{let live=true;if(user)billingRequest().then(d=>{if(live)setAd(d.membership.adFree?null:d.ad)}).catch(()=>{});return()=>{live=false}},[user?.id]);return ad?<aside className="membership-ad" aria-label={t('Advertisement')}><small>{t('Advertisement')}</small><a href={ad.url} target="_blank" rel="sponsored noopener noreferrer">{ad.title}</a><p>{ad.body}</p></aside>:null;}
export function PremiumTicketChoice({thread,replaces}){const [d,setD]=useState(null);useEffect(()=>{let live=true;billingRequest().then(x=>{if(live)setD(x)}).catch(()=>{});return()=>{live=false}},[thread.id]);if(replaces||!d?.eligibleTeachers?.includes(thread.teacherId))return null;return d?.membership.premium&&d.tickets.some(t=>t.state==='available')?<label className="premium-ticket-choice"><input name="premiumTicket" type="checkbox"/>{t('Use a Premium class ticket')}<small>{t('Use tickets for eligible classes with participating teachers. Duration limits apply.')} ≤ {d.maxClassMinutes} {t('min')}</small></label>:null;}
export const storeName=provider=>({apple:'App Store',google:'Google Play',apple_sandbox:'App Store',google_sandbox:'Google Play'})[provider];
const benefits=[
 ['AI conversation sessions per day','1','15'],
 ['Focused Practice AI evaluations per day','2','15'],
 ['AI feedback','Summary','Detailed'],
 ['Exclusive courses','—','Included'],
];
function PlanFeatures({premium}){
 return <ul className="store-plan-features">
  <li><Check aria-hidden="true"/><span>{t('Regular lessons and Learning Memory')}</span></li>
  {premium&&<li><Check aria-hidden="true"/><span>{t('Vocabulary and expression review')}</span></li>}
  {benefits.map(([label,free,paid])=><li key={label}><Check aria-hidden="true"/><span>{t(label)}</span><strong>{t(premium?paid:free)}</strong></li>)}
  {premium&&<li><Check aria-hidden="true"/><span><b>{t('Meet a teacher')}</b><br/>{t('One introductory class ticket')} · {t('Coming with paid store subscriptions')}</span></li>}
  {premium&&<li><Check aria-hidden="true"/><span>{t('No Continuum ads. YouTube may still show its own ads.')}</span></li>}
 </ul>;
}
export default function Membership({user,initialData=null,onLearn,focusOffer=false,language='en'}){
 const [data,setData]=useState(initialData),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const panel=useRef(null);useEffect(()=>{if(data&&focusOffer)panel.current?.scrollIntoView({block:'start',behavior:'smooth'})},[!!data,focusOffer]);
 useEffect(()=>{let live=true;const load=()=>billingRequest().then(result=>{if(live){setData(result);setError('')}}).catch(e=>{if(live)setError(e.message)});load();window.addEventListener('continuum-membership-changed',load);return()=>{live=false;window.removeEventListener('continuum-membership-changed',load)}},[user.id]);
 const refresh=async()=>{setBusy(true);setError('');try{setData(await billingRequest())}catch(e){setError(e.message)}finally{setBusy(false)}};
 if(user.role!=='learner')return null;
 if(!data)return <section className="panel membership-panel"><h2>{t('Membership')}</h2>{error&&<p role="alert">{t(error)}</p>}</section>;
 const m=data.membership,provider=storeName(m.source),tickets=data.tickets||[];
 return <section ref={panel} className={`panel membership-panel store-membership ${m.premium?'premium-active':''}`}>
  <div className="store-membership-heading"><div><span className="eyebrow">CONTINUUM</span><h2>{t('Membership')}</h2></div><span className="store-plan-badge">{t('Your plan')} · {t(m.premium?'Premium':'Free')}</span></div>
  {error&&<p className="auth-error" role="alert">{t(error)}</p>}
  {!m.premium?<div className="store-plan-grid">
   <article className="store-plan store-plan-premium">
    <div className="store-plan-ribbon"><Star size={16} aria-hidden="true"/>{t('Go further with Premium')}</div>
    <div className="store-plan-body"><div className="store-plan-intro"><div><h3>Premium</h3><p>{t('Make more room for real-life practice.')}</p></div><img className="store-plan-companion" src="/companions-v2/capybara-head-happy.webp" alt="" width="72" height="72"/></div>
     <PlanFeatures premium/>
     <div className="store-plan-purchase"><strong>{t('Monthly')} · {t('Yearly')}</strong><p>{t('Store purchases are in preparation. The app will show local prices, eligible trials and renewal terms before purchase.')}</p><span>{t('App Store')}</span><span>{t('Google Play')}</span></div>
    </div>
   </article>
   <article className="store-plan"><div className="store-plan-body"><div className="store-plan-intro"><div><h3>{t('Free')}</h3><p>{t('Build a daily learning habit.')}</p></div><MessageCircle className="store-plan-icon" size={27} aria-hidden="true"/></div><PlanFeatures/><button className="outline-button store-continue" onClick={onLearn}>{t('Keep learning for free')}</button></div></article>
  </div>:<>
   {provider&&<p className="membership-notice">{provider} · {t('Sandbox subscription')}{m.paidUntil&&<> · {tf('Access until {0}',[new Date(m.paidUntil).toLocaleString()])}</>}</p>}
   {m.testerPermanent&&<p>{t('Tester Premium')}: {t('Never')}</p>}
   {m.testerUntil&&!m.testerPermanent&&<p>{t('Tester Premium until')}: {new Date(m.testerUntil).toLocaleDateString()}</p>}
   {m.trialActive&&m.source==='trial'&&<p>{t('Your free digital Premium trial ends at')} {new Date(m.trialEndsAt).toLocaleString()}</p>}
   <PremiumGuide premium courses={data.courses} language={language} ticketProgrammeAvailable={data.ticketProgrammeAvailable} showUpcomingTicket/>
   <div className="store-practice-action"><button className="primary" onClick={onLearn}>{t('Open Practice Studio')}</button></div>
  </>}
  <p className="store-manage-note">{t('Manage or restore your subscription in the app where you purchased it.')}</p>
  <div className="membership-actions"><button className="text-button" disabled={busy} onClick={refresh}>{t('Refresh membership')}</button><a href="/terms">{t('Terms of Service')}</a><a href="/privacy">{t('Privacy Policy')}</a></div>
  <InvitationRedeem/>
  {(data.ticketProgrammeAvailable||tickets.length>0)&&<><h3>{t('Class tickets')}</h3><div className="membership-tickets">{['available','reserved','used','revoked'].map(state=><span key={state}>{t({available:'Available',reserved:'Reserved',used:'Used',revoked:'Revoked'}[state])} <b>{tickets.filter(x=>x.state===state).length}</b></span>)}</div></>}
 </section>;
}
export function BillingAdmin(){const [d,setD]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[ad,setAd]=useState({title:'',body:'',url:'https://',enabled:false});
 const load=()=>billingRequest('/admin').then(x=>{setD(x);if(x.ad)setAd(x.ad)});useEffect(()=>{load().catch(e=>setError(e.message))},[]);const save=async body=>{setBusy(true);setError('');try{await billingRequest('/admin','PUT',body);await load()}catch(e){setError(e.message)}finally{setBusy(false)}};return <section className="panel membership-panel"><h2>{t('Billing operations')}</h2><InvitationAdmin/>{error&&<p role="alert">{t(error)}</p>}{d&&<><h3>{t('App store subscriptions')}</h3><p>{t('Sandbox figures are separate from production sales.')}</p><div className="store-admin-grid">{d.stores?.map(store=><article key={store.provider} className="store-plan store-plan-body"><h4>{storeName(store.provider)}</h4><p>{t(store.sandboxReady?'Sandbox ready':store.configured?'Sandbox disabled':'Setup required')}</p><p>{t('Active test subscribers')}: <b>{store.active}</b></p><p>{t('Last verified')}: {store.lastVerified?new Date(store.lastVerified).toLocaleString():'—'}</p></article>)}</div><h3>{t('Ticket programme teachers')}</h3>{d.teachers.map(x=><p key={x.id}>{x.name} <button disabled={busy} onClick={()=>save({teacherId:x.id,enabled:!x.enabled})}>{t(x.enabled?'Disable':'Enable')}</button></p>)}<details><summary>{t('Advertisement')}</summary><form onSubmit={e=>{e.preventDefault();save({ad})}}>{['title','body','url'].map(k=><label key={k}>{t(({title:"Title",body:"Body",url:"Link"})[k])}<input value={ad[k]} maxLength={k==='body'?300:k==='title'?100:1500} onChange={e=>setAd({...ad,[k]:e.target.value})}/></label>)}<label><input type="checkbox" checked={ad.enabled} onChange={e=>setAd({...ad,enabled:e.target.checked})}/>{t('Enable')}</label><button disabled={busy}>{t('Save')}</button></form></details></>}</section>}
