import React,{useEffect,useState} from 'react';
import {opsRequest} from './ops-client.mjs';
import {t} from './interface-runtime.mjs';

const usd=value=>value==null?'—':new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:5}).format(value);
const featureNames={conversation:'AI Conversation','focused-speaking':'Focused Practice Speaking','focused-writing':'Focused Practice Writing','cefr-assessment':'CEFR assessment','skill-assessment':'Skill assessment','recurring-patterns':'Recurring Patterns','studio-speech':'Studio speech',translation:'Interface translation'};
const label=value=>t(featureNames[value]??value);
const number=value=>value==null?'—':Number(value).toLocaleString();

function StatsTable({caption,headings,rows}){
 return <div className="ops-table-wrap" tabIndex={0} role="region" aria-label={t(caption)}>
  <table className="ops-table"><caption>{t(caption)}</caption>
   <thead><tr>{headings.map(heading=><th key={heading} scope="col">{t(heading)}</th>)}</tr></thead>
   <tbody>{rows.map(({key,cells})=><tr key={key}>{cells.map((cell,index)=><td key={index}>{cell}</td>)}</tr>)}</tbody>
  </table>
 </div>;
}
export default function AIOwnerDashboard(){
 const [days,setDays]=useState(7),[offset,setOffset]=useState(0),[revision,reload]=useState(0),[data,setData]=useState(null),[error,setError]=useState(''),[resolving,setResolving]=useState(null);
 useEffect(()=>{
  const controller=new AbortController();
  setError('');setData(null);
  opsRequest('/api/owner/ai-usage?days='+days+'&offset='+offset,'GET',null,controller.signal).then(setData).catch(e=>{if(e.name!=='AbortError')setError(e.message);});
  return()=>controller.abort();
 },[days,offset,revision]);
 const resolve=async key=>{
  setResolving(key);setError('');
  try{await opsRequest('/api/owner/ai-usage/resolve','POST',{key});reload(n=>n+1);}catch(e){setError(e.message);}finally{setResolving(null);}
 };
 const attributedCost=data?.tiers.free?.cost==null&&data?.tiers.premium?.cost==null?null:(data.tiers.free?.cost??0)+(data.tiers.premium?.cost??0);
 const max=Math.max(0,...Object.values(data?.trend??{}).map(row=>row.cost??0));
 return <section className="panel">
  <h2>{t('AI Usage & Cost Monitoring')}</h2>
  <p>{t('USD estimates use provider-reported usage and configured model rates. Unpriced calls are excluded from the dollar totals and shown separately.')}</p>
  <label>{t('Reporting period (UTC)')} <select value={days} onChange={e=>{setDays(Number(e.target.value));setOffset(0);}}>{[[1,'Today'],[7,'Last 7 days'],[30,'Last 30 days']].map(([value,name])=><option key={value} value={value}>{t(name)}</option>)}</select></label>
  <button className="text-button" onClick={()=>reload(n=>n+1)}>{t('Refresh')}</button>
  {error&&<p role="alert">{t(error)}</p>}
  {data?<><div className="ops-metrics">
   {[[1,'Today'],[7,'Last 7 days'],[30,'Last 30 days']].map(([period,name])=><div key={period}><strong>{t(name)}</strong><p>{usd(data.byPeriod[period].cost)} · {number(data.byPeriod[period].unknown)} {t('unpriced calls')}</p></div>)}
   <div><strong>{t('Active AI users')}</strong><p>{number(data.activeUsers)} · {usd(data.activeUsers&&attributedCost!=null?attributedCost/data.activeUsers:null)} {t('estimated per user')}</p></div>
  </div>
  <h3>{t('Daily estimated cost (UTC)')}</h3>
  <ul className="ops-ai-trend">{Object.entries(data.trend).map(([day,row])=><li key={day}><time dateTime={day}>{day}</time>{row.cost!=null&&max>0&&<meter min={0} max={max} value={row.cost} aria-label={t('Estimated USD')}/>}<span>{usd(row.cost)}{row.unknown>0?' · '+row.unknown+' '+t('unpriced calls'):''}</span></li>)}</ul>
  <StatsTable caption="Free and Premium" headings={['Plan','Completed uses','Provider calls','Unpriced calls','Estimated USD']} rows={['free','premium','unattributed'].map(tier=>{const row=data.tiers[tier];return {key:tier,cells:[t(({free:'Free',premium:'Premium',unattributed:'Unattributed'})[tier]),number(row?.used??0),number(row?.calls??0),number(row?.unknown??0),usd(row?.cost)]};})}/>
  <StatsTable caption="Usage by feature" headings={['Feature','Completed uses','Provider calls','Unpriced calls','Estimated USD']} rows={Object.entries(data.features).map(([feature,row])=>({key:feature,cells:[label(feature),number(row.used),number(row.calls),number(row.unknown),usd(row.cost)]}))}/>
  <StatsTable caption="User cost ranking" headings={['Account','Plan','Conversation','Writing','Speaking','Today','Last 7 days','Last 30 days','Unpriced calls','Estimated per evaluation']} rows={data.users.map(row=>{const evaluations=(row.writing??0)+(row.speaking??0);return {key:row.id,cells:[<>{row.name}<br/><small>{row.id}</small></>,t(row.tier==='premium'?'Premium':'Free'),number(row.conversations??0),number(row.writing??0),number(row.speaking??0),usd(row.today),usd(row.week),usd(row.month),number(row.unknown??0),usd(evaluations&&row.evaluation_cost!=null?row.evaluation_cost/evaluations:null)]};})}/>
  <button className="text-button" disabled={!offset} onClick={()=>setOffset(n=>Math.max(0,n-50))}>{t('Previous')}</button>
  <button className="text-button" disabled={data.users.length<50} onClick={()=>setOffset(n=>n+50)}>{t('Next')}</button>
  <StatsTable caption="Models and measured usage" headings={['Model','Stage','Calls','Failures','Input tokens','Output tokens','Audio input tokens','Audio output tokens','Unpriced calls','Estimated USD']} rows={data.models.map(row=>({key:[row.provider,row.model,row.stage].join(':'),cells:[row.provider+' · '+row.model,row.stage,number(row.calls),number(row.failures),number(row.input),number(row.output),number(row.audioInput),number(row.audioOutput),number(row.unknown),usd(row.cost)]}))}/>
  <StatsTable caption="AI usage alerts" headings={['Time','Risk','Alert','Target','Feature','Observed','Threshold','Estimated USD','Status']} rows={data.alerts.map(row=>({key:row.key,cells:[new Date(row.at).toLocaleString(),t(row.risk==='high'?'High':'Warning'),t(row.kind),row.target,label(row.feature),row.unit==='USD'?usd(row.value):number(row.value),row.unit==='USD'?usd(row.threshold):number(row.threshold),usd(row.cost),row.resolvedAt?t('Resolved'):<button type="button" disabled={resolving!==null} onClick={()=>resolve(row.key)}>{t('Mark resolved')}</button>]}))}/>
  {!data.alerts.length&&<p>{t('No recent AI usage alerts.')}</p>}
  </>:!error&&<p role="status">{t('Loading…')}</p>}
 </section>;
}
