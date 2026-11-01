import {useStudyActivity} from './LearningActivity.jsx';
import {requestPremium} from './premium-prompt.mjs';
import {conversationPracticeActive} from './conversation-activity.mjs';
import {PronunciationEvidence} from './SkillEvidence.jsx';
import React,{useEffect,useRef,useState} from 'react';
import {Mic2,MessageCircle,ArrowLeft,ArrowRight,CheckCircle2,RotateCcw} from 'lucide-react';
import {t,interfaceLanguage} from './interface-runtime.mjs';
import {languageInfo,courseBands} from './languages.mjs';
import {speakingScenarios,scenarioById,maxSpeakingTurns} from './speaking-content.mjs';
import SentenceAudio from './SentenceAudio.jsx';
import {conversationPartner} from './conversation-partners.mjs';
import ConversationAvatar from './ConversationAvatar.jsx';
import {ConversationVoiceLoop} from './conversation-voice.mjs';
import './ai-speaking.css';
async function request(path='',body,signal){const r=await fetch('/api/speaking'+path,{method:body?'POST':'GET',credentials:'same-origin',headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal});const d=await r.json();if(!r.ok)throw Object.assign(Error(d.error||'Conversation unavailable'),{status:r.status});return d;}
export function SpeakingEntry({onOpen,memory=false}){return <section className="panel speaking-entry"><div className="speaking-symbol"><Mic2 size={28}/></div><div><span className="eyebrow">{t('AI CONVERSATION')}</span><h2>{t(memory?'Your conversation reviews':'Speak in real-life situations')}</h2><p>{t(memory?'Return to saved conversations, corrections and your next speaking goal.':'Practise with an AI partner, then get a review based on what you actually said.')}</p></div><button className="primary" onClick={onOpen}>{t(memory?'Open conversation reviews':'Start a conversation')}<ArrowRight size={18}/></button></section>}
export function ConversationReview({session,locale,onRefresh,busy}){const r=session.review;if(r.reviewTier==='basic')return <section className="panel conversation-review"><h2>{t('Your conversation review')}</h2><p>{r.summary}</p>{r.score!=null&&<b>{r.score}%</b>}{r.strengths?.map((x,i)=><p key={i}>{x}</p>)}<p>{t('Detailed corrections and personal practice are included in Premium.')}</p><a href="/?billing=return">{t('View membership')}</a></section>;return <section className="panel conversation-review" aria-labelledby="conversation-review-title"><span className="eyebrow">{t('AFTER YOUR CONVERSATION')}</span><h2 id="conversation-review-title">{t('Your conversation review')}</h2><p>{r.summary}</p>{r.communicationScore==null&&<p className="reference-hint">{t('Communication score needs more verified evidence.')}{onRefresh&&<button className="text-button" disabled={busy} onClick={onRefresh}>{t('Reassess communication')}</button>}</p>}{r.communicationScore!=null&&<p><b>{t('Communication score')}: {r.communicationScore}%</b></p>}{r.score!=null&&<p><b>{t('Speaking score')}: {r.score}%</b> · {t('80% communication + 20% pronunciation')}</p>}<PronunciationEvidence value={r.pronunciation}/>{r.partial&&<p className="reference-hint">{t('Some suggested changes could not be verified and were left out. Your saved transcript is unchanged.')}</p>}<p className="reference-hint">{t('Communication feedback uses your words. Pronunciation uses recorded audio only. These are practice scores, not CEFR certification.')}</p><h3>{t('What went well')}</h3>{r.strengths.length?<ul>{r.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul>:<p>{t('Keep practising to build more evidence.')}</p>}<h3>{t('Your communication goals')}</h3>{r.goals.map((g,i)=><article key={i}><b>{g.achieved?<CheckCircle2 size={17}/>:<RotateCcw size={17}/>} {t(g.goal)}</b>{g.achieved?<blockquote lang={locale}>{g.evidence}</blockquote>:<small>{t('Try this goal in your next conversation.')}</small>}</article>)}<h3>{t('Try a more natural way')}</h3>{r.corrections.length?r.corrections.map((c,i)=><article className="conversation-correction" key={i}><span>{t('You said')}</span><p lang={locale}>{c.original}</p><span>{t('Try saying')}</span><p lang={locale}><strong>{c.improved}</strong></p><SentenceAudio text={c.improved} lang={locale} audioEndpoint={'/api/speaking/'+session.id+'/audio/review/'+i}/><p>{c.explanation}</p></article>):<p>{t(r.partial?'No verified corrections are available in this review.':'No specific corrections were needed in this review.')}</p>}<h3>{t('Your next speaking goal')}</h3><p>{r.nextStep}</p></section>}
export default function AISpeaking({language,user,onBack}){

 const [level,setLevel]=useState(()=>{try{const saved=localStorage.getItem('continuumCourseLevel'+(language==='es'?'':':'+language));return courseBands.includes(saved)?saved:'A1'}catch{return 'A1'}});
 const [scenario,setScenario]=useState('free'),[consent,setConsent]=useState(false),[session,setSession]=useState(null),[history,setHistory]=useState([]),[available,setAvailable]=useState(null),[premium,setPremium]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[text,setText]=useState(''),[mode,setMode]=useState('voice');
 const [voiceNotice,setVoiceNotice]=useState('');
 const [reviewPending,setReviewPending]=useState(false),[reviewFailed,setReviewFailed]=useState(false),[voiceState,setVoiceState]=useState('idle'),[voiceLevel,setVoiceLevel]=useState(0),[deviceVoice,setDeviceVoice]=useState(false),[longPause,setLongPause]=useState(false);
 useStudyActivity(!!session&&!session.review&&conversationPracticeActive({visible:true,busy,error,mode,voiceState}));
 const locale=languageInfo(session?.language||language).locale;
 const turnLimit=session?.budget?.maxTurns||maxSpeakingTurns;
 const expired=!!session?.budget&&session.budget.usedSeconds>=session.budget.limitSeconds;
 const mounted=useRef(true),pending=useRef(false),controller=useRef(),key=useRef(crypto.randomUUID()),last=useRef(),sessionRef=useRef(null),voice=useRef(null);
 const voiceActive=['connecting','preparing','speaking','listening','thinking'].includes(voiceState);
 useEffect(()=>{mounted.current=true;controller.current=new AbortController();request('?language='+language,undefined,controller.current.signal).then(d=>{if(mounted.current){setHistory(d.sessions);setAvailable(d.available);setPremium(d.premium)}}).catch(e=>{if(mounted.current&&e.name!=='AbortError')setError(e.message)});return()=>{mounted.current=false;voice.current?.stop();controller.current?.abort()}},[language,user?.id]);
 useEffect(()=>{if(!session?.id||session.review)return;const id=session.id;let live=true;const ping=()=>{const active=conversationPracticeActive({visible:document.visibilityState==='visible',busy,error,mode,voiceState});return request('/'+id+'/activity',{active}).then(d=>{if(live){setSession(s=>s?.id===id?{...s,budget:d.budget}:s);if(sessionRef.current?.id===id)sessionRef.current={...sessionRef.current,budget:d.budget};}}).catch(()=>{});};void ping();const timer=setInterval(ping,10000);document.addEventListener('visibilitychange',ping);return()=>{live=false;clearInterval(timer);document.removeEventListener('visibilitychange',ping);void fetch('/api/speaking/'+id+'/activity',{method:'POST',credentials:'same-origin',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({active:false})}).catch(()=>{});};},[session?.id,!!session?.review,busy,!!error,mode,voiceState]);
 useEffect(()=>{const thread=last.current?.parentElement;if(thread)thread.scrollTop=thread.scrollHeight},[session?.messages.length]);
 useEffect(()=>{if(session?.id)window.scrollTo({top:0,behavior:'instant'})},[session?.id]);
 useEffect(()=>{if(session?.review)document.querySelector('.conversation-review')?.scrollIntoView({block:'start',behavior:'smooth'})},[session?.id,!!session?.review]);
 const run=async fn=>{if(pending.current)return;pending.current=true;setBusy(true);setError('');try{return await fn()}catch(e){if(mounted.current&&e.name!=='AbortError')setError(e.message)}finally{pending.current=false;if(mounted.current)setBusy(false)}};
 const accept=s=>{if(!mounted.current)return;sessionRef.current=s;setSession(s);setHistory(h=>[s,...h.filter(x=>x.id!==s.id)]);};
 const pauseVoice=()=>{voice.current?.stop();setVoiceState('paused');setVoiceLevel(0)};
 const resetVoice=()=>{voice.current?.stop();voice.current=null;setVoiceState('idle');setVoiceLevel(0);setReviewFailed(false)};
 useEffect(()=>{const pause=()=>{if(voice.current?.active){voice.current.stop();setVoiceState('paused');setVoiceLevel(0)}};const visibility=()=>{if(document.hidden)pause()};document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',pause);return()=>{document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',pause)}},[]);

 const start=()=>run(async()=>{resetVoice();const d=await request('',{language,level,scenario,displayLanguage:interfaceLanguage(),aiConsent:consent,prefetchAudio:mode==='voice'&&!deviceVoice},controller.current.signal);accept(d.session);setText('');key.current=crypto.randomUUID();});
 const open=s=>run(async()=>{resetVoice();const d=await request('/'+s.id,undefined,controller.current.signal);accept(d.session);setText('');key.current=crypto.randomUUID();});
 const audioURL=(s,i=s.messages.length-1)=>'/api/speaking/'+s.id+'/audio/'+i;
 const startVoice=()=>{
  if(!consent||busy||voiceActive)return;
  setReviewFailed(false);setError('');setVoiceNotice('');
  if(!voice.current)voice.current=new ConversationVoiceLoop({locale,
   onVoiceNotice:notice=>{if(mounted.current)setVoiceNotice(notice)},
   onState:value=>{if(mounted.current)setVoiceState(value)},onLevel:value=>{if(mounted.current)setVoiceLevel(value)},onError:e=>{if(mounted.current)setError(e.message)},
   canContinue:()=>!sessionRef.current?.review&&sessionRef.current.messages.filter(m=>m.role==='user').length<(sessionRef.current?.budget?.maxTurns||maxSpeakingTurns)&&!(sessionRef.current?.budget&&sessionRef.current.budget.usedSeconds>=sessionRef.current.budget.limitSeconds),
   onTurn:async audio=>{
    if(pending.current)throw Error('A reply is still being prepared. Please wait.');
    pending.current=true;if(mounted.current)setBusy(true);
    try{const s=sessionRef.current;const d=await request('/'+s.id+'/turn',{revision:s.revision,turnKey:key.current,aiConsent:true,audio,prefetchAudio:!voice.current?.deviceVoice},controller.current.signal);accept(d.session);key.current=crypto.randomUUID();return {url:audioURL(d.session),text:d.session.messages.at(-1).text,locale};}
    finally{pending.current=false;if(mounted.current)setBusy(false);}
   }
  });
  voice.current.deviceVoice=deviceVoice;voice.current.silenceMs=longPause?2200:1300;
  void voice.current.start(audioURL(sessionRef.current),{text:sessionRef.current.messages.at(-1).text,locale});
 };
 const send=()=>run(async()=>{setReviewFailed(false);const d=await request('/'+session.id+'/turn',{revision:session.revision,turnKey:key.current,aiConsent:consent,text},controller.current.signal);accept(d.session);if(mounted.current){setText('');key.current=crypto.randomUUID();}});
 const review=(refreshScores=false)=>{pauseVoice();setReviewFailed(false);return run(async()=>{setReviewPending(true);try{const d=await request('/'+session.id+'/review',{revision:session.revision,aiConsent:consent,refreshScores:refreshScores===true},controller.current.signal);accept(d.session)}catch(e){setReviewFailed(true);throw e}finally{setReviewPending(false)}})};
 const count=session?.messages.filter(m=>m.role==='user').length||0;
 const current=scenarioById(session?.scenario||scenario),partner=conversationPartner(session?.language||language,session?.scenario||scenario);
 const toList=()=>{resetVoice();setSession(null);sessionRef.current=null;setText('');setError('')};
 const consentBox=<label className="speaking-consent"><input type="checkbox" checked={consent} disabled={busy||voiceActive} onChange={e=>setConsent(e.target.checked)}/><span>{t('I agree to send my conversation and submitted recordings to the configured AI provider (Gemini or OpenAI) for replies and feedback. Transcripts and reviews are saved to my account; raw recordings are not stored in conversation history.')} {t('Audio-based pronunciation scores are saved with your conversation.')}</span></label>;
 return <div className={'ai-speaking '+(session?'in-conversation':'')}>
  <button className="text-button" disabled={busy} onClick={()=>{resetVoice();onBack()}}><ArrowLeft size={17}/>{t('Back to learning path')}</button>
  {!session&&<section className="page-intro"><span className="eyebrow">{t('AI CONVERSATION')}</span><h1>{t('Speak in real-life situations')}</h1><p>{t('A short conversation. A useful review. A clearer next step.')}</p><p>{t('Free: one conversation per day, up to 7 minutes. All scenarios are available. Pauses and provider waits do not count. Daily allowance resets at 00:00 UTC.')}</p></section>}
  {error&&<div className="auth-error" role="alert"><p>{t(error)}</p>{reviewFailed&&session?<button className="text-button" disabled={busy} onClick={review}>{t('Try creating review again')}</button>:!session?<button className="text-button" disabled={busy} onClick={()=>run(async()=>{const d=await request('?language='+language,undefined,controller.current.signal);if(mounted.current){setHistory(d.sessions);setAvailable(d.available);setPremium(d.premium)}})}>{t('Try again')}</button>:<button disabled={busy||voiceActive} className="text-button" onClick={()=>run(async()=>{const d=await request('/'+session.id,undefined,controller.current.signal);if(d.session.messages.some(m=>m.key===key.current)){key.current=crypto.randomUUID();if(voice.current)voice.current.retryClip=null;}accept(d.session)})}>{t('Reload saved conversation')}</button>}</div>}
  {!session?<>
   <section className="panel speaking-setup">
    <label>{t('Conversation level')}<select value={level} onChange={e=>setLevel(e.target.value)}>{courseBands.map(l=><option key={l}>{l}</option>)}</select></label>
    <p>{t('Choose the difficulty for this practice. This is not a placement test.')}</p>
    <div className="speaking-scenarios">{speakingScenarios.map(s=><button key={s.id} aria-pressed={scenario===s.id} className={scenario===s.id?'selected':''} onClick={()=>s.premium&&!premium?requestPremium(s.title):setScenario(s.id)}><img className="scenario-partner" src={conversationPartner(language,s.id).image} alt="" width="64" height="64" loading="lazy"/><strong>{t(s.title)}{s.premium?' · Premium':''}</strong><span>{t(s.goals[0])}</span></button>)}</div>
    <h3>{t('Your communication goals')}</h3><ul>{current.goals.map(g=><li key={g}>{t(g)}</li>)}</ul>{consentBox}
    {available===false&&<p role="status">{t('AI conversation is temporarily unavailable. Please try again later.')}</p>}
    <button className="primary" disabled={!consent||busy||available!==true} onClick={start}>{t(busy?'Preparing…':'Start a conversation')}<Mic2 size={18}/></button>
   </section>
   <details className="panel learning-log-group"><summary>{t('Saved conversations')} · {history.length}</summary>{history.length?history.map(s=><button className="speaking-history" key={s.id} disabled={busy} onClick={()=>open(s)}><span><strong>{t(scenarioById(s.scenario)?.title)}</strong><small>{s.level} · {new Date(s.at).toLocaleDateString()} · {t(s.review?'Review ready':'In progress')}</small></span><ArrowRight size={18}/></button>):<p>{t('Your conversations and reviews will appear here.')}</p>}</details>
  </>:<>
   <section className="panel conversation-room">
    <div className="speaking-session-head"><div><span className="eyebrow">{session.level} · {t(session.scenario==='free'?'AI conversation partner':'AI roleplay partner')}</span><h2>{t(current.title)}</h2></div><button className="text-button" disabled={busy} onClick={toList}>{t('Back to conversations')}</button></div>
    {!session.review&&<div className="conversation-modes" role="group" aria-label={t('Reply method')}><button className={mode==='voice'?'selected':''} disabled={busy} onClick={()=>setMode('voice')}><Mic2 size={17}/>{t('Voice conversation')}</button><button className={mode==='text'?'selected':''} disabled={busy} onClick={()=>{resetVoice();setMode('text')}}><MessageCircle size={17}/>{t('Text chat')}</button></div>}
    <div className={'conversation-live-layout '+(mode==='voice'&&!session.review?'with-avatar':'')}>
     {mode==='voice'&&!session.review&&<div className="voice-stage">
      <ConversationAvatar state={voiceState} level={voiceLevel} partner={partner}/>
      <p className="voice-flow-note">{t('Speak naturally. Your reply sends after a short pause, and your partner answers aloud.')}</p>
      <button className={'primary voice-main-button '+(voiceActive?'live':'')} disabled={!consent||(!voiceActive&&busy)||(count>=turnLimit||expired)} onClick={voiceActive?pauseVoice:startVoice}><Mic2 size={20}/>{t(voiceActive?'Pause conversation':voiceState==='idle'?'Start voice conversation':'Resume conversation')}</button>
      <div className="voice-preferences"><label>{t('Voice')}<select value={deviceVoice?'device':'studio'} disabled={voiceActive||busy} onChange={e=>{setDeviceVoice(e.target.value==='device')}}><option value="studio">{t('Natural AI voice')}</option><option value="device">{t('Device voice · quality varies')}</option></select></label><label>{t('Thinking time')}<select value={longPause?'relaxed':'natural'} disabled={voiceActive||busy} onChange={e=>setLongPause(e.target.value==='relaxed')}><option value="relaxed">{t('A little longer')}</option><option value="natural">{t('Short pause')}</option></select></label></div>
      <small>{t('AI-generated portrait with a synthetic voice. Not a live video. Your camera is not used.')}</small>
     </div>}
     <div className="conversation-chat">
      {voiceNotice&&<p className="reference-hint" role="status">{t(voiceNotice)}</p>}
      <div className="conversation-thread" role="log" aria-label={t('Conversation transcript')}>{session.messages.map((m,i)=><article className={'conversation-message '+m.role} key={i}><small>{m.role==='assistant'?partner.name+' · AI':t(m.mode==='voice'?'You · voice transcript':'You · typed reply')}</small><p lang={locale}>{m.text}</p>{m.role==='assistant'&&!voiceActive&&<SentenceAudio text={m.text} lang={locale} compact audioEndpoint={audioURL(session,i)}/>}</article>)}<div ref={last}/></div>
      {!session.review&&mode==='text'&&count<turnLimit&&!expired&&<form className="conversation-composer" onSubmit={e=>{e.preventDefault();if(consent&&!busy&&text.trim())send()}}><label className="sr-only" htmlFor="conversation-reply">{t('Your reply')}</label><textarea id="conversation-reply" value={text} maxLength={2000} disabled={busy} lang={locale} placeholder={t('Type a message…')} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();if(consent&&!busy&&text.trim())send()}}} rows={2}/><button type="submit" className="primary" disabled={busy||!consent||!text.trim()} aria-label={t('Send reply')}><ArrowRight size={22}/></button></form>}
      {busy&&<p className="conversation-thinking" role="status">{t(reviewPending?'Creating your review…':'Your partner is thinking…')}</p>}
     </div>
    </div>
    {!session.review&&<>
     {expired&&<p role="status">{t('Your conversation time is complete. Finish and get your review.')}</p>}
     {!consent&&consentBox}
     <div className="conversation-bottom"><span>{session.budget&&<><b>{Math.max(0,Math.ceil((session.budget.limitSeconds-session.budget.usedSeconds)/60))} {t('minutes remaining')}</b> · </>}{count}/{turnLimit} · {t('learner replies')}</span><button className="outline-button" disabled={busy||!consent||(count<2&&!expired)} onClick={review}>{t(reviewPending?'Creating your review…':'Finish and get review')}</button></div>
     <details><summary>{t('Your communication goals')}</summary><ul>{current.goals.map(g=><li key={g}>{t(g)}</li>)}</ul></details>
     <p className="reference-hint">{t('Voice transcripts can contain recognition errors. Review the transcript before interpreting AI feedback.')}</p>
    </>}
   </section>
   {session.review&&<>{session.review.communicationScore==null&&!consent&&consentBox}<ConversationReview session={session} locale={locale} busy={busy} onRefresh={consent?()=>review(true):undefined}/><button className="primary" onClick={toList}>{t('Practise another conversation')}<RotateCcw size={17}/></button></>}
  </>}
 </div>;
}
