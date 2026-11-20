import {t} from './interface-runtime.mjs';
import React,{useEffect,useState} from 'react';
import {opsRequest} from './ops-client.mjs';
import {mailDiagnosticHints} from './mail-diagnostics.mjs';
const when=value=>value?new Date(value).toLocaleString():'—';
const providerLabel=status=>({pending:'Queued / retry pending',delivered:'Accepted by provider',expired:'Expired'})[status]||status;
export default function OwnerMail(){
 const [data,setData]=useState(null),[password,setPassword]=useState(''),[receipt,setReceipt]=useState(''),[code,setCode]=useState(''),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 const refresh=()=>opsRequest('/api/owner/mail').then(setData);
 useEffect(()=>{let live=true;opsRequest('/api/owner/mail').then(d=>{if(live)setData(d)}).catch(e=>{if(live)setError(e.message)});return()=>{live=false}},[]);
 const waiting=data?.authorization?.state==='checking'||data?.checks.some(c=>c.providerStatus==='pending'&&Date.parse(c.expiresAt)>Date.now());
 useEffect(()=>{
  if(!waiting)return;let live=true,running=false;
  const timer=setInterval(async()=>{if(document.hidden||running)return;running=true;try{const next=await opsRequest('/api/owner/mail');if(live)setData(next)}catch(e){if(live)setError(e.message)}finally{running=false}},10000);
  return()=>{live=false;clearInterval(timer)};
 },[waiting]);
 const run=async action=>{setBusy(true);setError('');setNotice('');try{await action();await refresh()}catch(e){setError(e.message)}finally{setBusy(false);setPassword('')}};
 return <section lang="en">
  <h2>Email operations</h2>
  <p>Configuration checks confirm that settings are present. They do not prove Google authorization, successful sending or inbox arrival. Secrets stay in secure server settings.</p>
  <p>After sending one test, allow about a minute for the worker. Pending results refresh automatically. Confirm arrival only with the code from the actual email.</p>
  <button className="text-button" disabled={busy} onClick={()=>void run(async()=>{})}>{t('Refresh')}</button>
  {error&&<p role="alert">{t(error)}</p>}{notice&&<p role="status">{notice}</p>}
  {data&&<>
   <p>Provider: {data.provider} · Sender: {data.from||'Not configured'} · Test inbox: {data.testRecipient||'Not configured'}</p>
   <p>Transport configured: {String(data.transportConfigured)} · Encrypted queue configured: {String(data.outboxConfigured)} · Worker enabled: {String(data.workerEnabled)}</p>
   {data.authorization&&<div className="panel">
    <strong>Google token renewal check: {data.authorization.state}</strong>
    <p>Checked: {when(data.authorization.checkedAt)}. Successful token renewal does not prove Gmail API acceptance or inbox arrival.</p>
    {data.authorization.code&&<p role="status"><code>{data.authorization.code}</code>{data.authorization.httpStatus&&<> · HTTP {data.authorization.httpStatus}</>}<br/>{mailDiagnosticHints[data.authorization.code]||'Review the safe server diagnostics.'}</p>}
   </div>}
   <form onSubmit={e=>{e.preventDefault();void run(async()=>{const r=await opsRequest('/api/owner/mail/test','POST',{password});setReceipt(r.id);setNotice('Test email queued. Wait for the provider result below; do not repeatedly submit new tests.')})}}>
    <label>Confirm your Continuum password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
    <button className="outline-button" disabled={busy||!data.testEnabled}>Send one test email</button>
   </form>
   <form onSubmit={e=>{e.preventDefault();void run(async()=>{await opsRequest('/api/owner/mail/confirm','POST',{id:receipt,code});setCode('');setNotice('Inbox arrival confirmed.')})}}>
    <label>Test reference<input required value={receipt} onChange={e=>setReceipt(e.target.value)}/></label>
    <label>Inbox verification code<input autoComplete="off" required value={code} onChange={e=>setCode(e.target.value)} maxLength={10}/></label>
    <button className="outline-button" disabled={busy}>Confirm inbox arrival</button>
   </form>
   <div className="ops-table-wrap"><table><thead><tr><th>Reference</th><th>Requested / expires</th><th>Provider status</th><th>Attempts</th><th>Last result / next step</th><th>Next retry</th><th>Inbox verified</th></tr></thead><tbody>
    {data.checks.map(c=><tr key={c.id}>
     <td>{c.id}</td><td>{when(c.createdAt)}<br/><small>Expires: {when(c.expiresAt)}</small></td>
     <td>{providerLabel(c.providerStatus)}</td><td>{c.attempts}<br/><small>{when(c.lastAttemptAt)}</small></td>
     <td>{c.lastErrorCode?<><code>{c.lastErrorCode}</code>{c.lastErrorStatus&&<> · HTTP {c.lastErrorStatus}</>}<p>{mailDiagnosticHints[c.lastErrorCode]||'Review the safe server diagnostics.'}</p></>:c.providerStatus==='delivered'?<>Provider accepted: {when(c.providerAcceptedAt)}{c.providerMessageId&&<><br/><small>Provider reference: {c.providerMessageId}</small></>}</>:c.attempts>0?'Older attempts have no detailed diagnostic. Review the token renewal check before sending a fresh test.':'Waiting for the worker.'}</td>
     <td>{c.providerStatus==='pending'&&Date.parse(c.expiresAt)>Date.now()?when(c.nextAttemptAt):'—'}</td>
     <td>{c.confirmedAt?when(c.confirmedAt):'Not confirmed'}</td>
    </tr>)}
   </tbody></table></div>
  </>}
 </section>;
}
