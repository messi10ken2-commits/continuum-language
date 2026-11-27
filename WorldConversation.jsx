import AIAllowance,{notifyAIAllowance} from './AIAllowance.jsx';
import React,{useState,useEffect,useRef} from 'react';
import {t,interfaceLanguage} from './interface-runtime.mjs';
import {worldRequest} from './continuum-world-request.mjs';
import {worldMission,memorySummary} from './continuum-world-missions.mjs';
import {speakingRequest} from './speaking-request.mjs';
import {ConversationVoiceLoop} from './conversation-voice.mjs';
import {ConversationReview} from './AISpeaking.jsx';
import SentenceAudio,{stopSentenceAudio} from './SentenceAudio.jsx';
import {useStudyActivity} from './LearningActivity.jsx';
import {createConversationPulse} from './activity-heartbeat.mjs';
import {isAppHidden} from './native-platform.mjs';
export default function WorldConversation({user,location,profile,onProfile,initialMission,scene,position,accessible=false,onClose,onSettings}){
 const choices=profile.missions.filter(m=>m.location===location.id&&!m.locked),mission=choices.find(m=>m.id===initialMission)?.id||choices.find(m=>!m.completed)?.id||choices[0]?.id;
 const preferences=profile.settings||{},level=preferences.level&&preferences.level!=='auto'?preferences.level:profile.level;
 const [session,setSession]=useState(null),[text,setText]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[voiceState,setVoiceState]=useState('idle'),[sheet,setSheet]=useState(''),[typing,setTyping]=useState(false),[saved,setSaved]=useState(false),[translation,setTranslation]=useState('');
 const closeButton=useRef(null),sheetPanel=useRef(null),toolFocus=useRef(null),previousSheet=useRef('');
 useEffect(()=>{closeButton.current?.focus({preventScroll:true});},[]);
 useEffect(()=>{if(sheet){if(!previousSheet.current&&!toolFocus.current)toolFocus.current=document.activeElement;sheetPanel.current?.querySelector('button')?.focus({preventScroll:true});}else{toolFocus.current?.focus({preventScroll:true});toolFocus.current=null;}previousSheet.current=sheet;},[sheet]);
 const controller=useRef(null),live=useRef(true),pending=useRef(false),voice=useRef(null),current=useRef(null),startKey=useRef(crypto.randomUUID()),turnKey=useRef(crypto.randomUUID()),pulse=useRef(null);current.current=session;
 const active=!!session&&!session.review&&!busy&&!error&&!sheet&&(typing||voiceState!=='paused')&&(!voice.current?.active||['speaking','listening'].includes(voiceState));useStudyActivity(active);
 const accept=s=>{if(live.current){current.current=s;setSession(s);setTranslation('');}};
 const pause=()=>{voice.current?.stop();if(voice.current)voice.current.retryClip=null;stopSentenceAudio();if(live.current)setVoiceState(s=>s==='idle'?'idle':'paused');};
 useEffect(()=>{const hide=()=>{if(isAppHidden())pause();},blur=()=>pause();document.addEventListener('visibilitychange',hide);window.addEventListener('continuum-native-visibility',hide);window.addEventListener('blur',blur);return()=>{document.removeEventListener('visibilitychange',hide);window.removeEventListener('continuum-native-visibility',hide);window.removeEventListener('blur',blur);};},[]);
 useEffect(()=>{if(!session?.id||session.review)return;const id=session.id,p=createConversationPulse({send:(active,final)=>final?fetch('/api/speaking/'+id+'/activity',{method:'POST',credentials:'same-origin',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({active})}):speakingRequest('/'+id+'/activity',{active}),onBudget:d=>{if(live.current&&current.current?.id===id){current.current={...current.current,budget:d.budget};setSession(current.current);}}});pulse.current=p;return()=>{pulse.current=null;void p.stop();};},[session?.id,!!session?.review]);
 useEffect(()=>{void pulse.current?.update(active&&!isAppHidden());},[active]);
 const run=async fn=>{if(pending.current)return;pending.current=true;setBusy(true);setError('');try{return await fn();}catch(e){if(live.current&&e.name!=='AbortError')setError(e.message);}finally{pending.current=false;if(live.current){setBusy(false);notifyAIAllowance('conversation');}}};
 const refresh=async()=>{const p=await worldRequest('/profile',null,'GET',controller.current.signal);if(live.current)onProfile(p);return p;};
 const start=async(signal)=>{
  if(!preferences.aiConsent||!mission||profile.available===false)return;
  // Resume only with exactly the class-note choice and difficulty the learner saved.
  const previous=await speakingRequest('?language=ja&world=true',undefined,signal);
  const resume=previous.sessions?.find(s=>s.scenario==='world-'+mission&&!s.review&&s.worldClassContext===preferences.classContext&&s.level===level);
  if(resume){if(!signal.aborted)accept(resume);return;}
  const v=await worldRequest('/visits',{startKey:startKey.current,missionId:mission,level,classContext:preferences.classContext===true,scene,position,accessible},'POST',signal);
  const d=await speakingRequest('',{...v,language:'ja',level,displayLanguage:interfaceLanguage(),aiConsent:true},signal);if(!signal.aborted)accept(d.session);
 };
 useEffect(()=>{live.current=true;const c=new AbortController();controller.current=c;pending.current=true;setBusy(true);void start(c.signal).catch(e=>{if(!c.signal.aborted&&live.current)setError(e.message);}).finally(()=>{if(controller.current===c&&live.current){pending.current=false;setBusy(false);notifyAIAllowance('conversation');}});return()=>{live.current=false;c.abort();voice.current?.stop();stopSentenceAudio();};},[]);
 const send=async(payload)=>{const s=current.current,d=await speakingRequest('/'+s.id+'/turn',{revision:s.revision,turnKey:turnKey.current,aiConsent:true,...payload},controller.current.signal);accept(d.session);turnKey.current=crypto.randomUUID();return d.session;};
 const sendText=event=>{event.preventDefault();pause();void run(async()=>{await send({text:text.trim()});if(live.current)setText('');});};
 const audioURL=s=>'/api/speaking/'+s.id+'/audio/'+(s.messages.length-1);
 const startVoice=()=>{
  stopSentenceAudio();setSheet('');setTyping(false);
  if(!voice.current)voice.current=new ConversationVoiceLoop({locale:'ja-JP',deviceVoice:false,rate:level==='A1'?.85:1,onState:s=>{if(live.current)setVoiceState(s);},onError:e=>{if(live.current){setError(e.message);setTyping(true);}},canContinue:()=>{const s=current.current;return !s?.review&&s.messages.filter(m=>m.role==='user').length<(s.budget?.maxTurns||12)&&(!s.budget||s.budget.usedSeconds<s.budget.limitSeconds);},onTurn:async audio=>{if(pending.current)throw Error('A reply is still being prepared. Please wait.');pending.current=true;if(live.current)setBusy(true);try{const s=await send({audio,prefetchAudio:true});return {url:audioURL(s),text:s.messages.at(-1).text,locale:'ja-JP'};}finally{pending.current=false;if(live.current){setBusy(false);notifyAIAllowance('conversation');}}}});
  setError('');void voice.current.start(audioURL(current.current),{text:current.current.messages.at(-1).text,locale:'ja-JP'});
 };
 const finish=()=>{pause();setSheet('');setTyping(false);void run(async()=>{const s=current.current,d=await speakingRequest('/'+s.id+'/review',{revision:s.revision,aiConsent:true},controller.current.signal);accept(d.session);await refresh();});};
 const openSheet=name=>{if(!sheet)toolFocus.current=document.activeElement;pause();setSheet(s=>s===name?'':name);};
 const translate=()=>{pause();setSheet('translation');if(translation)return;void run(async()=>{const d=await worldRequest('/translation',{sessionId:session.id,index:session.messages.length-1,locale:interfaceLanguage(),aiConsent:true},'POST',controller.current.signal);if(live.current)setTranslation(d.translation);});};
 const record=profile.records?.find(r=>r.sessionId===session?.id),suggestion=record?memorySummary(worldMission(record.missionId),record.evidence.achieved):null;
 const status=voiceState==='listening'?'Listening…':voiceState==='speaking'?'Speaking…':busy||voiceState==='thinking'?'Thinking…':['connecting','preparing'].includes(voiceState)?'Preparing…':voiceState==='ready'?'Finish conversation':voiceState==='paused'?'Voice paused. You can type instead.':'Speak with microphone';
 return <div className="cw-conversation" data-npc={location.npc.id} onKeyDown={e=>{if(e.key==='Escape'&&sheet){e.preventDefault();e.stopPropagation();setSheet('');}}}>
  <header className="cw-conversation-header" inert={!!sheet}><span lang="ja">{location.npc.name} · {location.npc.role}</span><button type="button" className="cw-close" aria-label={t('Continue exploring')} ref={closeButton} onClick={()=>{pause();onClose();}}><span aria-hidden="true">×</span></button></header>
  {error&&<div className="cw-conversation-error" role="alert">{t(error)} <button type="button" onClick={()=>setError('')}>{t('Close')}</button>{!session&&<button type="button" disabled={busy} onClick={()=>void run(()=>start(controller.current.signal))}>{t('Retry')}</button>}</div>}
  {!session?<div className="cw-speech-bubble"><p lang="ja">{location.npc.line}</p><p role="status">{t(profile.available===false?'AI conversation is temporarily unavailable. Please try again later.':busy?'Preparing…':!preferences.aiConsent?'Set up conversations in World settings.':'Start conversation')}</p>{!preferences.aiConsent&&<button onClick={onSettings}>{t('World settings')}</button>}</div>:
  session.review?<div className="cw-conversation-ended" inert={!!sheet}><p>{t('Saved to Learning Memory. Course progress is unchanged.')}</p><button type="button" onClick={()=>openSheet('review')}>{t('Review conversation')}</button><button type="button" onClick={onClose}>{t('Continue exploring')}</button></div>:
  <><div className="cw-speech-bubble" inert={!!sheet} key={session.messages.length}><p className="cw-dialogue" lang="ja" aria-live="polite">{session.messages.at(-1).text}</p><SentenceAudio compact text={session.messages.at(-1).text} lang="ja-JP" audioEndpoint={audioURL(session)} allowDeviceFallback={false}/></div>
  <div className="cw-conversation-dock" inert={!!sheet}><p className="cw-mic-state" data-state={voiceState} role="status">{voiceState!=='idle'&&t(status)}</p><div className="cw-conversation-actions"><button type="button" disabled={busy} onClick={voice.current?.active?pause:startVoice}>{t(voice.current?.active?'Pause voice':'Speak with microphone')}</button>{voiceState==='listening'&&<><button type="button" onClick={()=>voice.current?.sendRecording()}>{t('Send recording')}</button><button type="button" onClick={pause}>{t('Cancel recording')}</button></>}<button type="button" aria-expanded={typing} onClick={()=>{pause();setTyping(v=>!v);}}>{t('Type your reply')}</button><button type="button" className="cw-tools-toggle" aria-label={t('Conversation tools')} aria-expanded={sheet==='tools'} onClick={()=>openSheet('tools')}><span aria-hidden="true">⋯</span></button></div>
  {typing&&<form onSubmit={sendText}><label>{t('Type your reply')}<textarea autoFocus value={text} maxLength={2000} onFocus={pause} onChange={e=>setText(e.target.value)} disabled={busy} rows={2}/></label><button disabled={busy||!text.trim()}>{t(busy?'Preparing…':'Send reply')}</button></form>}
  {session.messages.filter(m=>m.role==='user').length>=2&&<button type="button" className="cw-finish" disabled={busy} onClick={finish}>{t('Finish conversation')}</button>}</div></>}
  {sheet&&<aside ref={sheetPanel} className="cw-conversation-sheet" aria-label={t(sheet==='hints'?'Expression hints':sheet==='translation'?'Translate':sheet==='history'?'Conversation history':sheet==='review'?'Review conversation':sheet==='tools'?'Conversation tools':'Daily AI usage')}><button type="button" onClick={()=>setSheet('')}>{t('Close')}</button>
   {sheet==='tools'&&<div className="cw-conversation-tools"><button type="button" aria-expanded={sheet==='hints'} onClick={()=>openSheet('hints')}>{t('Expression hints')}</button><button type="button" disabled={busy} aria-expanded={sheet==='translation'} onClick={translate}>{t('Translate')}</button><button type="button" aria-expanded={sheet==='history'} onClick={()=>openSheet('history')}>{t('Conversation history')}</button><button type="button" aria-expanded={sheet==='usage'} onClick={()=>openSheet('usage')}>{t('Daily AI usage')}</button></div>}
   {sheet==='hints'&&<p lang="ja">{location.id==='tokyo_cafe'?'窓際の席を使ってもいいですか。おすすめは何ですか。':location.id==='tokyo_konbini'?'袋は要りません。カードで払えますか。':location.id==='tokyo_station'?'駅まではどう行けばいいですか。乗り換えは必要ですか。':'こんにちは。今日はいい天気ですね。この辺りのおすすめはありますか。'}</p>}
   {sheet==='translation'&&<p lang={interfaceLanguage()}>{translation||t(busy?'Preparing…':'Translation is temporarily unavailable. Original text is still available.')}</p>}
   {sheet==='history'&&session.messages.map((m,i)=><p key={i} lang="ja"><b>{m.role==='user'?t('You'):location.npc.name}</b>：{m.text}</p>)}
   {sheet==='usage'&&<AIAllowance bucket="conversation" user={user}/>}
   {sheet==='review'&&<><ConversationReview session={session} locale="ja-JP"/>{suggestion&&profile.consent.enabled&&<div className="cw-memory-preview"><h3>{t('Review this NPC memory')}</h3><p lang="ja">{suggestion}</p><p>{t('Only this summary is saved. No contact details or recordings are remembered.')}</p><button type="button" disabled={busy||saved} onClick={()=>void run(async()=>{await worldRequest('/npc-memories',{sessionId:session.id,version:profile.consent.version,confirm:true},'POST',controller.current.signal);setSaved(true);await refresh();})}>{t(saved?'Memory saved':'Confirm and remember')}</button></div>}</>}
  </aside>}
 </div>;
}
