import RenewalTrialOffer,{trialPrice} from './RenewalTrialOffer.jsx';
import PremiumGuide from './PremiumGuide.jsx';
import BillingInvoices from './BillingInvoices.jsx';
import {InvitationAdmin,InvitationRedeem} from './PremiumAccess.jsx';
import React,{useEffect,useRef,useState} from 'react';
import {t,tf} from './interface-runtime.mjs';
import {premiumPlans} from './premium-pricing.mjs';
import './membership.css';
export async function billingRequest(path='',method='GET',body){const r=await fetch('/api/billing'+path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok)throw Error(d.error||'Please try again');return d;}
export const membershipStatusLabel=status=>t(({active:'Active',free:'Free',trialing:'Trial',past_due:'Past due',unpaid:'Unpaid',incomplete:'Incomplete',incomplete_expired:'Expired',paused:'Paused',canceled:'Cancelled',cancelled:'Cancelled',payment_review:'Payment review'})[status]||status);
const redirect=url=>{const u=new URL(url);if(u.protocol!=='https:'||!['checkout.stripe.com','billing.stripe.com'].includes(u.hostname))throw Error('Invalid payment destination');window.location.assign(u.href)};
export function MembershipAd({user}){const [ad,setAd]=useState(null);useEffect(()=>{let live=true;if(user)billingRequest().then(d=>{if(live)setAd(d.membership.adFree?null:d.ad)}).catch(()=>{});return()=>{live=false}},[user?.id]);return ad?<aside className="membership-ad" aria-label={t('Advertisement')}><small>{t('Advertisement')}</small><a href={ad.url} target="_blank" rel="sponsored noopener noreferrer">{ad.title}</a><p>{ad.body}</p></aside>:null;}
export function PremiumTicketChoice({thread,replaces}){const [d,setD]=useState(null);useEffect(()=>{let live=true;billingRequest().then(x=>{if(live)setD(x)}).catch(()=>{});return()=>{live=false}},[thread.id]);if(replaces||!d?.eligibleTeachers?.includes(thread.teacherId))return null;return d?.membership.premium&&d.tickets.some(t=>t.state==='available')?<label className="premium-ticket-choice"><input name="premiumTicket" type="checkbox"/>{t('Use a Premium class ticket')}<small>{t('Use tickets for eligible classes with participating teachers. Duration limits apply.')} ≤ {d.maxClassMinutes} {t('min')}</small></label>:null;}
export default function Membership({user,initialData=null,onLearn,focusOffer=false,language='en'}){
 const [data,setData]=useState(initialData),[error,setError]=useState(''),[busy,setBusy]=useState(false),[interval,setInterval]=useState('month'),[key,setKey]=useState(()=>crypto.randomUUID());
 const panel=useRef(null);useEffect(()=>{if(data&&focusOffer)panel.current?.scrollIntoView({block:'start',behavior:'smooth'})},[!!data,focusOffer]);
 useEffect(()=>{
  let live=true;
  const url=new URL(window.location.href),returned=url.searchParams.get('billing');
  const sync=returned==='success'||returned==='return';
  const load=async()=>{
   if(sync)try{
    const result=await billingRequest('/sync','POST',{});
    if(live){setData(result);url.searchParams.delete('billing');history.replaceState(history.state,'',url);}
    return;
   }catch(e){if(live)setError(e.message);}
   const result=await billingRequest();
   if(live)setData(result);
  };
  load().catch(e=>{if(live)setError(e.message)});
  return()=>{live=false};
 },[user.id]);
 const run=async fn=>{setBusy(true);setError('');try{await fn()}catch(e){setError(e.message)}finally{setBusy(false)}};
 if(user.role!=='learner')return null;
 if(!data)return <section className="panel membership-panel"><h2>{t('Membership')}</h2>{error&&<p role="alert">{t(error)}</p>}</section>;
 const m=data.membership,plans=data.plans??Object.values(premiumPlans);
 const selected=plans.find(p=>p.interval===interval)||plans[0];
 const monthly=plans.find(p=>p.interval==='month'),yearly=plans.find(p=>p.interval==='year');
 const annualSavings=monthly&&yearly?monthly.amount*12-yearly.amount:0;
 const mayPurchase=!m.premium&&!['past_due','unpaid','incomplete','paused','payment_review'].includes(m.status);
 const checkoutAvailable=data.checkoutAvailable&&data.intervals.includes(selected?.interval);

 return <section ref={panel} style={{scrollMarginTop:90}} className={`panel membership-panel ${m.premium?'premium-active':''}`}><span className="eyebrow">CONTINUUM · {t('Membership')}</span><h2>{t('Your plan')}: {t(m.premium?'Premium':'Free')}</h2><InvitationRedeem/>{m.testerPermanent&&<p>{t('Tester Premium')}: {t('Never')}</p>}{m.testerUntil&&!m.testerPermanent&&<p>{t('Tester Premium until')}: {new Date(m.testerUntil).toLocaleDateString()}</p>}{error&&<p className="auth-error" role="alert">{t(error)}</p>}
 {m.customer&&<p>{membershipStatusLabel(m.status)}{m.plan?.interval&&<> · {t(m.plan.interval==='year'?'Yearly':'Monthly')}{m.plan.amount&&m.plan.currency?<> · {trialPrice(m.plan)} / {t(m.plan.interval)}</>:null}</>}{m.paidUntil&&<> · {tf(m.cancelAtPeriodEnd?'Access until {0}':'Next billing date: {0}',[new Date(m.paidUntil).toLocaleString()])}</>}</p>}
 {['past_due','unpaid','incomplete','paused'].includes(m.status)&&<p className="membership-notice" role="status">{t('Update your payment method in Manage subscription.')}</p>}
 {mayPurchase&&selected&&<fieldset className="membership-pricing"><legend>{t('Your plan')}</legend>
  <div className="membership-plan-options">{plans.map(plan=><label key={plan.interval}><input type="radio" name="premium-plan" value={plan.interval} checked={selected.interval===plan.interval} disabled={busy} onChange={()=>setInterval(plan.interval)}/><span>{t(plan.interval==='year'?'Yearly':'Monthly')} <strong>{trialPrice(plan)} / {t(plan.interval)}</strong></span></label>)}</div>
  {selected.interval==='year'&&<p>{tf('Billed annually at {0}. Equivalent to {1} per month.',[trialPrice(selected),trialPrice({...selected,amount:Math.round(selected.amount/12)})])}{annualSavings>0&&<> {tf('Save about {0}% ({1} per year).',[Math.round(annualSavings/(monthly.amount*12)*100),trialPrice({...selected,amount:annualSavings})])}</>}</p>}
  <p>{t('Automatically renews. Cancel in Account → Membership. Stripe shows any applicable tax before confirmation.')}</p>
  <div className="membership-comparison"><table><thead><tr><th scope="col">{t('Feature')}</th><th scope="col">{t('Free')}</th><th scope="col">{t('Premium')}</th></tr></thead>
  <tbody><tr><th scope="row">{t('Regular lessons, review and Learning Memory')}</th><td>{t('Included')}</td><td>{t('Included')}</td></tr>
  <tr><th scope="row">{t('AI conversation sessions per day')}</th><td>1</td><td>15</td></tr>
  <tr><th scope="row">{t('Focused Practice AI evaluations per day')}</th><td>2</td><td>15</td></tr>
  <tr><th scope="row">{t('AI feedback')}</th><td>{t('Summary')}</td><td>{t('Detailed')}</td></tr>
  <tr><th scope="row">{t('Exclusive courses')}</th><td>—</td><td>{t('Included')}</td></tr></tbody></table></div>
  <p><a href="/terms">{t('Terms of Service')} · {t('Payment problems and refunds')}</a></p>
 </fieldset>}
 {m.trialActive&&m.source==='trial'&&<p className="membership-notice">{t('Your free digital Premium trial ends at')} {new Date(m.trialEndsAt).toLocaleString()}. {t(m.trialKind==='subscription'?(m.cancelAtPeriodEnd?'Trial renewal is cancelled. Premium access continues until the trial ends.':'Your payment method will be charged automatically when the trial ends unless you cancel renewal first.'):'This earlier cardless trial will not automatically charge you. Your saved learning stays after the trial.')}</p>}
 {m.trialActive&&m.trialKind==='subscription'&&m.trialOffer&&<p>{t('Renewal price')}: <b>{trialPrice(m.trialOffer)} / {t(m.trialOffer.interval==='year'?'year':'month')}</b></p>}
 {m.trialEligible&&mayPurchase&&selected&&<RenewalTrialOffer key={selected.interval} interval={selected.interval} available={checkoutAvailable} busy={busy} onCheckout={offer=>run(async()=>redirect((await billingRequest('/checkout','POST',{interval:offer.interval,key,trial:true,consent:true,offer})).url))}/>}
 {m.trialActive&&m.trialKind==='subscription'&&!m.cancelAtPeriodEnd&&<button className="outline-button" disabled={busy} onClick={()=>run(async()=>{setData(await billingRequest('/cancel-trial','POST',{confirm:true}));window.dispatchEvent(new CustomEvent('continuum-membership-changed',{detail:{message:'Trial renewal cancelled. Your access continues until the trial ends.'}}))})}>{t('Cancel trial renewal')}</button>}
 {m.trialUsed&&!m.trialActive&&!m.premium&&<p>{t('Your free trial has ended. Your progress is saved. Choose Premium to continue using digital Premium features.')}</p>}
 <PremiumGuide premium={m.premium} courses={data.courses} language={language} ticketProgrammeAvailable={data.ticketProgrammeAvailable}/>
 <div className="membership-actions">
  {mayPurchase&&selected&&<button className="primary" disabled={busy||!checkoutAvailable} onClick={()=>run(async()=>redirect((await billingRequest('/checkout','POST',{interval:selected.interval,key})).url))}>{t('Review price on Stripe')}</button>}
  {m.customer&&<button className="outline-button" disabled={busy||!data.portalAvailable} onClick={()=>run(async()=>redirect((await billingRequest('/portal','POST',{})).url))}>{t('Manage subscription')}</button>}
  <button className="text-button" disabled={busy} onClick={()=>run(async()=>setData(m.customer&&data.portalAvailable?await billingRequest('/sync','POST',{}):await billingRequest()))}>{t('Refresh membership')}</button>
 </div>{mayPurchase&&!checkoutAvailable&&!m.trialEligible&&<p>{t('Checkout is not open yet.')}</p>}
 {(data.ticketProgrammeAvailable||data.tickets.length>0)&&<><h3>{t('Class tickets')}</h3><div className="membership-tickets">{['available','reserved','used','revoked'].map(state=><span key={state}>{t({available:'Available',reserved:'Reserved',used:'Used',revoked:'Revoked'}[state])} <b>{data.tickets.filter(x=>x.state===state).length}</b></span>)}</div></>}
 <BillingInvoices customer={m.customer} request={billingRequest}/>
 {m.premium&&<button className="primary" onClick={onLearn}>{t('Open Practice Studio')}</button>}

 </section>;
}
function BillingReport({report}){
 if(!report)return null;
 const {accounts,invoices,refunds,events}=report;
 const accountLabels={free:'Free',premium:'Premium',trials:'Trial',monthly:'Monthly',yearly:'Yearly',cancelling:'Renewal stopped',unpaid:'Unpaid',review:'Payment review'};
 const rows=(items,label)=>items.map(item=><li key={item.currency+'-'+(item.interval||'')}>{label(item)} {trialPrice({currency:item.currency,amount:Number(item.amount)})}</li>);
 return <section>
  <div className="ops-metrics">{Object.entries(accountLabels).map(([key,label])=><div key={key}><strong>{t(label)}</strong><p>{accounts[key]}</p></div>)}</div>
  <h3>{t('Paid invoice amounts this month (UTC)')}</h3>
  <p>{t('Gross invoice payments. Stripe fees, taxes and bank payouts are separate.')}</p>
  {invoices.length?<ul>{rows(invoices,item=>t(item.interval==='month'?'Monthly':item.interval==='year'?'Yearly':'Unattributed'))}</ul>:<p>—</p>}
  <p>{t('Paid invoice events')} {events.paid} · {t('Failed payment events')} {events.failed}</p>
  <h3>{t('Recorded refunds')}</h3>{refunds.length?<ul>{rows(refunds,()=>null)}</ul>:<p>—</p>}
  <p>{t('Estimated MRR / ARR')} {accounts.mrr==null?'—':trialPrice({currency:'usd',amount:Math.round(Number(accounts.mrr))})+' / '+trialPrice({currency:'usd',amount:Math.round(Number(accounts.mrr)*12)})}</p>
  <p>{t('MRR adds monthly list prices and one twelfth of annual list prices. ARR is MRR × 12.')}{accounts.unpriced>0&&<> {tf('{0} subscriptions lack a comparable price.',[accounts.unpriced])}</>}</p>
 </section>;
}
export function BillingAdmin(){const [d,setD]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[ad,setAd]=useState({title:'',body:'',url:'https://',enabled:false});
 const load=()=>billingRequest('/admin').then(x=>{setD(x);if(x.ad)setAd(x.ad)});useEffect(()=>{load().catch(e=>setError(e.message))},[]);const save=async body=>{setBusy(true);setError('');try{await billingRequest('/admin','PUT',body);await load()}catch(e){setError(e.message)}finally{setBusy(false)}};return <section className="panel membership-panel"><h2>{t('Billing operations')}</h2><InvitationAdmin/>{error&&<p role="alert">{t(error)}</p>}{d&&<><h3>{t('Stripe configuration')}</h3><pre>{JSON.stringify(d.settings,null,2)}</pre><BillingReport report={d.report}/><h3>{t('Ticket programme teachers')}</h3>{d.teachers.map(x=><p key={x.id}>{x.name} <button disabled={busy} onClick={()=>save({teacherId:x.id,enabled:!x.enabled})}>{t(x.enabled?'Disable':'Enable')}</button></p>)}<h3>{t('Membership')}</h3>{d.members.map(x=><p key={x.id}>{x.name} · {membershipStatusLabel(x.status)}{x.paymentReview?' · '+t('Payment review'):''}{x.interval?' · '+t(x.interval==='year'?'Yearly':'Monthly'):''}{x.paidUntil?' · '+new Date(x.paidUntil).toLocaleString():''}{x.cancelAtPeriodEnd?' · '+t('Renewal stopped'):''}</p>)}<h3>{t('Payment events')}</h3>{!d.events.length?<p>{t('No payment events yet.')}</p>:d.events.map(x=><p key={x.id}>{x.type} · {new Date(x.at).toLocaleString()}</p>)}<details><summary>{t('Advertisement')}</summary><form onSubmit={e=>{e.preventDefault();save({ad})}}>{['title','body','url'].map(k=><label key={k}>{t(({title:"Title",body:"Body",url:"Link"})[k])}<input value={ad[k]} maxLength={k==='body'?300:k==='title'?100:1500} onChange={e=>setAd({...ad,[k]:e.target.value})}/></label>)}<label><input type="checkbox" checked={ad.enabled} onChange={e=>setAd({...ad,enabled:e.target.checked})}/>{t('Enable')}</label><button disabled={busy}>{t('Save')}</button></form></details></>}</section>}
