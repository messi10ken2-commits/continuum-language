import React,{useState} from 'react';
import {LocalNotifications} from '@capacitor/local-notifications';import {Share} from '@capacitor/share';
import {Native} from './native-runtime.mjs';import {t} from './interface-runtime.mjs';
export default function NativeAccountTools({user}){
 const [time,setTime]=useState('20:00'),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(false),[busy,setBusy]=useState(false),[notice,setNotice]=useState('');
 const [ai,setAI]=useState(()=>localStorage.getItem('continuumNativeAIConsent:v1:'+user.id)==='yes');
 const run=async action=>{if(busy)return;setBusy(true);setNotice('');try{await action()}catch(e){setNotice(e.message)}finally{setBusy(false)}};
 const remind=()=>run(async()=>{
  const permission=await LocalNotifications.requestPermissions();if(permission.display!=='granted')throw Error(t('Notification permission is not enabled.'));
  const [hour,minute]=time.split(':').map(Number);
  await LocalNotifications.cancel({notifications:[{id:9001}]});
  await LocalNotifications.schedule({notifications:[{id:9001,title:'Continuum',body:t('Your next chapter awaits'),schedule:{on:{hour,minute},repeats:true},extra:{section:'learn'}}]});setNotice(t('Learning reminder saved.'));
 });
 const removeReminder=()=>run(async()=>{await LocalNotifications.cancel({notifications:[{id:9001}]});setNotice(t('Learning reminder removed.'));});
 const deletion=()=>run(async()=>{
  const r=await fetch('/api/account/deletion-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password,confirm:true})});const data=await r.json();if(!r.ok)throw Error(data.error);
  setPassword('');setConfirm(false);setNotice(t('Your deletion request is saved in Support. The team will confirm completion there.'));
 });
 return <section className="native-tools" aria-label={t('App settings')}>
  <h3>{t('App settings')}</h3>{notice&&<p role="status">{t(notice)}</p>}
  <label><span>{t('Optional AI services')}</span><input type="checkbox" checked={ai} onChange={e=>{const allowed=e.target.checked;setAI(allowed);localStorage.setItem('continuumNativeAIConsent:v1:'+user.id,allowed?'yes':'no');if(!allowed)window.dispatchEvent(new Event('pagehide'));}}/>{t('Allow Continuum to send my submitted text, recorded speech and learning context to OpenAI or Google Gemini for AI conversation and feedback. I can turn this off here. Regular lessons remain available.')}</label>
  <label>{t('Learning reminder')}<input type="time" value={time} onChange={e=>setTime(e.target.value)}/></label>
  <button disabled={busy} className="outline-button" onClick={remind}>{t('Save reminder')}</button> <button disabled={busy} className="text-button" onClick={removeReminder}>{t('Turn off reminders')}</button>
  <p><button className="text-button" onClick={()=>void Share.share({title:'Continuum',text:t('One continuous record—across self-study and every class.'),url:'https://continuum-language-production.up.railway.app'})}>{t('Share Continuum')}</button></p>
  {user.role==='learner'&&<><h3>{t('App Store')}</h3><p>{t('Store purchases are in preparation. The app will show local prices, eligible trials and renewal terms before purchase.')}</p><button className="outline-button" disabled={busy} onClick={()=>run(async()=>{
   const result=await Native.restore();if(!result.transactionIds.length){setNotice(t('No purchases to restore.'));return;}
   for(const id of result.transactionIds){const r=await fetch('/api/billing/store-sandbox',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:'apple',purchase:id})});if(!r.ok)throw Error(t('Store verification is not configured for this environment.'));}
   window.dispatchEvent(new Event('continuum-membership-changed'));setNotice(t('Purchases restored.'));
  })}>{t('Restore purchases')}</button></>}
  <h3>{t('Account deletion')}</h3><p>{t('Request deletion of your account and personal learning data. Subscription cancellation is separate. The team will confirm the processing time and completion in Support.')}</p>
  {!confirm?<button className="text-button native-danger" onClick={()=>setConfirm(true)}>{t('Request account deletion')}</button>:<form onSubmit={e=>{e.preventDefault();deletion()}}><label>{t('Confirm your password')}<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="outline-button native-danger" disabled={busy}>{t('Confirm deletion request')}</button><button type="button" className="text-button" onClick={()=>{setConfirm(false);setPassword('')}}>{t('Cancel')}</button></form>}
 </section>;
}
