import React,{useEffect,useRef,useState} from 'react';
import {Mic2,MessageCircle,ArrowRight,CheckCircle2,Settings2,Pause} from 'lucide-react';
import {t} from './interface-runtime.mjs';
import AIAllowance from './AIAllowance.jsx';
import ConversationCompanion from './ConversationCompanion.jsx';
import {currentConversationCaption} from './conversation-caption.mjs';
import {useLightMotion} from './light-motion.mjs';
import {townArt} from './light-town-art.mjs';
import ConversationAvatar from './ConversationAvatar.jsx';
import SentenceAudio from './SentenceAudio.jsx';
import './immersive-conversation.css';

// Presentation only: requests, consent, budgets and voice lifecycle stay in AISpeaking.
export default function ImmersiveConversationRoom({containerRef,session,current,language,level,locale,user,companion,partner,mode,onMode,busy,consentBox,consent,available,onStart,errorBox,voiceNotice,voiceState,voiceLevel,voiceActive,onVoice,deviceVoice,onDeviceVoice,longPause,onLongPause,text,onText,onSend,onFinish,reviewPending,expired,count,turnLimit}){
 const [settings,setSettings]=useState(false),[history,setHistory]=useState(false),menuButton=useRef(null),controls=useRef(null),motion=useLightMotion();
 const incoming=currentConversationCaption(session),[caption,setCaption]=useState(incoming),[phase,setPhase]=useState('in');
 const [replayActive,setReplayActive]=useState(false),[replayLevel,setReplayLevel]=useState(0);
 useEffect(()=>{
  if(incoming?.key===caption?.key)return;
  if(!incoming||!caption){setCaption(incoming);setPhase('in');return}
  setPhase('out');const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timer=setTimeout(()=>{setCaption(incoming);setPhase('in')},reduced?0:150);
  return()=>clearTimeout(timer);
 },[incoming?.key,caption?.key]);
 useEffect(()=>{
  const root=containerRef.current,dialog=root?.closest('dialog'),viewport=window.visualViewport;
  const resize=()=>{const height=viewport?.height||window.innerHeight;root?.style.setProperty('--conversation-vh',height+'px');dialog?.style.setProperty('--conversation-vh',height+'px')};
  const fitControls=()=>root?.style.setProperty('--call-controls-height',(controls.current?.getBoundingClientRect().height||80)+'px');
  const observer=new ResizeObserver(fitControls);if(controls.current)observer.observe(controls.current);
  resize();fitControls();viewport?.addEventListener('resize',resize);window.addEventListener('resize',resize);
  return()=>{observer.disconnect();viewport?.removeEventListener('resize',resize);window.removeEventListener('resize',resize);dialog?.style.removeProperty('--conversation-vh')};
 },[]);
 const status=reviewPending?'Creating your review…':busy?'Your partner is thinking…':voiceState==='speaking'?'Your partner is speaking':voiceState==='listening'?'Listening to you…':voiceState==='thinking'?'Your partner is thinking…':voiceState==='preparing'||voiceState==='connecting'?'Preparing…':voiceState==='paused'?'Conversation paused':'Ready when you are';
 return <main ref={containerRef} className="immersive-conversation-room" data-mode={mode} data-voice-state={voiceState} style={{'--conversation-world':`url('${townArt(language).stages.at(-1)}')`}} onKeyDown={e=>{if(e.key==='Escape'&&settings){e.preventDefault();e.stopPropagation();setSettings(false);menuButton.current?.focus()}}}>
  <h1 className="sr-only">{level} · {t(current.title)}</h1>
  <header className="immersive-room-header">
   <button ref={menuButton} type="button" className="room-icon-button" aria-label={t('Conversation settings')} aria-expanded={settings} aria-controls="immersive-room-settings" onClick={()=>setSettings(v=>!v)}><Settings2 size={21}/></button>
   <span className="room-voice-status" role="status">{session?t(status):level}</span>
  </header>
  {settings&&<aside id="immersive-room-settings" className="immersive-room-settings" aria-label={t('Conversation settings')}>
   <h2>{t('Conversation settings')}</h2>
   <p>{level} · {t(current.title)}</p>
   <div className="voice-preferences"><label>{t('Voice')}<select value={deviceVoice?'device':'studio'} disabled={voiceActive||busy} onChange={e=>onDeviceVoice(e.target.value==='device')}><option value="studio">{t('Natural AI voice')}</option><option value="device">{t('Device voice · quality varies')}</option></select></label><label>{t('Thinking time')}<select value={longPause?'relaxed':'natural'} disabled={voiceActive||busy} onChange={e=>onLongPause(e.target.value==='relaxed')}><option value="relaxed">{t('A little longer')}</option><option value="natural">{t('Short pause')}</option></select></label></div>
   {session?.budget&&<p>{Math.max(0,Math.ceil((session.budget.limitSeconds-session.budget.usedSeconds)/60))} {t('minutes remaining')} · {count}/{turnLimit} {t('learner replies')}</p>}
   <details><summary>{t('Your communication goals')}</summary><ul>{current.goals.map(g=><li key={g}>{t(g)}</li>)}</ul></details>
   <AIAllowance bucket="conversation" user={user}/>
   {session&&<details onToggle={e=>setHistory(e.currentTarget.open)}><summary>{t('Conversation transcript')}</summary>{history&&<ol className="room-history">{session.messages.map((m,i)=><li key={i}><b>{m.role==='assistant'?t('AI conversation partner'):t(m.mode==='voice'?'You · voice transcript':'You · typed reply')}</b><p lang={locale} dir="auto">{m.text}</p></li>)}</ol>}</details>}
   <p className="room-disclosure">{t('AI-generated portrait with a synthetic voice. Not a live video. Your camera is not used.')}</p>
   <p className="room-disclosure">{t('Voice transcripts can contain recognition errors. Review the transcript before interpreting AI feedback.')}</p>
  </aside>}
  <section ref={motion} className="immersive-room-actor" aria-label={t('AI conversation partner')} onClick={()=>{if(settings)setSettings(false)}}>
   {companion?<ConversationCompanion kind={companion} state={replayActive?'speaking':busy&&!voiceActive?'thinking':voiceState} level={replayActive?replayLevel:voiceState==='speaking'?voiceLevel:0} utterance={session?.messages.filter(m=>m.role==='assistant').at(-1)?.text||''}/>:<ConversationAvatar state={replayActive?'speaking':voiceState} level={replayActive?replayLevel:voiceLevel} partner={partner}/>}
  </section>
  <section className="immersive-room-chat" aria-label={t('Conversation transcript')}>
   <div className="room-current-turn" aria-label={t('Conversation transcript')}>
    {!session&&<div className="room-setup"><p className="room-opening">{t(current.title)}</p>{consentBox}{available===false&&<p role="status">{t('AI conversation is temporarily unavailable. Please try again later.')}</p>}</div>}
    {session&&caption&&<article className={'conversation-message '+caption.role+' caption-'+phase} key={caption.key} data-message-index={caption.index} role="status" aria-live="polite" aria-atomic="true"><span className="sr-only">{caption.role==='assistant'?t('AI conversation partner'):t(caption.mode==='voice'?'You · voice transcript':'You · typed reply')}</span><p lang={locale} dir="auto" tabIndex={0}>{caption.text}</p>{caption.role==='assistant'&&!voiceActive&&<SentenceAudio text={caption.text} lang={locale} compact audioEndpoint={'/api/speaking/'+session.id+'/audio/'+caption.index} onPlaybackChange={setReplayActive} onPlaybackLevel={setReplayLevel}/>}</article>}
    {voiceNotice&&<p className="room-notice" role="status">{t(voiceNotice)}</p>}
    {errorBox}
    {expired&&<p className="room-notice" role="status">{t('Your conversation time is complete. Finish and get your review.')}</p>}
   </div>
  </section>
  <footer ref={controls} className="immersive-room-controls">
   {session?<>
    <div className="room-reply-method" role="group" aria-label={t('Reply method')}>
     <button type="button" className="room-icon-button" aria-label={t(mode==='voice'?'Text chat':'Voice conversation')} title={t(mode==='voice'?'Text chat':'Voice conversation')} disabled={busy} onClick={()=>onMode(mode==='voice'?'text':'voice')}>{mode==='voice'?<MessageCircle size={21}/>:<Mic2 size={21}/>}</button>
    </div>
    {mode==='voice'?<button type="button" className={'room-voice-button '+(voiceActive?'live':'')} disabled={!consent||(!voiceActive&&busy)||count>=turnLimit||expired} onClick={onVoice}>{voiceActive?<Pause size={22}/>:<Mic2 size={22}/>}<span>{t(voiceActive?'Pause conversation':voiceState==='idle'?'Start voice conversation':'Resume conversation')}</span></button>:<form className="conversation-composer" onSubmit={e=>{e.preventDefault();if(consent&&!busy&&text.trim())onSend()}}><label className="sr-only" htmlFor="immersive-reply">{t('Your reply')}</label><textarea id="immersive-reply" value={text} onChange={e=>onText(e.target.value)} lang={locale} dir="auto" rows={1} maxLength={2000} disabled={busy||expired||count>=turnLimit} placeholder={t('Type a message…')} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();if(consent&&!busy&&text.trim()&&!expired&&count<turnLimit)onSend()}}}/><button type="submit" className="room-icon-button" disabled={!consent||busy||!text.trim()||expired||count>=turnLimit} aria-label={t('Send reply')}><ArrowRight size={21}/></button></form>}
    <button type="button" className="room-icon-button room-finish" title={t('Finish and get review')} aria-label={t('Finish and get review')} disabled={busy||!consent||(count<2&&!expired)} onClick={onFinish}><CheckCircle2 size={23}/></button>
   </>:<button type="button" className="room-start-button" disabled={!consent||busy||available!==true} onClick={onStart}>{t(busy?'Preparing…':'Start a conversation')}<Mic2 size={21}/></button>}
  </footer>
 </main>;
}
