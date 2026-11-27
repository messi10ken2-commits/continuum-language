import React,{useEffect,useState}from'react';import{t}from'./interface-runtime.mjs';import{worldRequest}from'./continuum-world-request.mjs';
export default function WorldLearningEvidence({user,language,records:provided}){
 const[saved,setSaved]=useState({owner:null,records:[]}),[failed,setFailed]=useState(false);
 useEffect(()=>{if(provided||language!=='ja'||!user)return;const c=new AbortController();worldRequest('/learning?language=ja',null,'GET',c.signal).then(d=>setSaved({owner:user.id,records:Array.isArray(d.records)?d.records:[]})).catch(e=>{if(e.name!=='AbortError')setFailed(true);});return()=>c.abort();},[user?.id,language,provided]);
 const events=provided||(saved.owner===user?.id?saved.records:[]);if(language!=='ja'||(!events.length&&!failed))return null;
 return <section className="panel world-learning-evidence"><h2>{t('Continuum World learning evidence')}</h2>{failed&&<p role="status">{t('World learning evidence could not load. Please reopen this page.')}</p>}{events.map(r=><article key={r.id}><h3 lang="ja">{r.title}</h3><small>{r.level} · {new Date(r.at).toLocaleString()}</small><p>{r.evidence.summary}</p>{r.evidence.goals.filter(g=>g.achieved).map(g=><blockquote key={g.goal} lang="ja">{g.quote}</blockquote>)}<p>{r.evidence.nextStep}</p></article>)}</section>;
}
