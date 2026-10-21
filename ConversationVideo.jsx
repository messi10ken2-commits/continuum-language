import {t as uiText,tf as uiTemplate} from './interface-runtime.mjs';
import {formatVideoTime,reviewedVideoCue} from './conversation-cues.mjs';
import React,{useRef,useState} from 'react';
export default function ConversationVideo({lesson,practice=false,cue=null,autoPlay=false}){
 const video=useRef(null),[failed,setFailed]=useState(false),[speed,setSpeed]=useState('1'),[replay,setReplay]=useState(0),[whole,setWhole]=useState(false);
 const clip=whole?null:cue;
 const c=lesson.conversation;if(!c)return null;
 const embedded=c.provider==='youtube'&&/^[A-Za-z0-9_-]{11}$/.test(c.youtubeId||'');
 if(c.provider==='publisher')return <section className="conversation-video"><span className="eyebrow">{uiText('REAL PEOPLE · ORIGINAL SPOKEN AUDIO')}</span><h2>{uiText(c.sourceTitle||lesson.title)}</h2><p>{uiText('Watch this video on the publisher’s site, then return here to answer.')}</p><a className="outline-button" href={c.source} target="_blank" rel="noopener noreferrer">{uiText('Open original video')} ↗</a><p>{c.credit}</p></section>;
 return <section className="conversation-video" aria-label={uiText("Conversation with human voices")}>
  <div className="visual-section-title"><div><span className="eyebrow">{uiText("REAL PEOPLE · ORIGINAL SPOKEN AUDIO")}</span><h2>{uiText(practice?'Watch and listen again':'Watch the conversation')}</h2></div></div>
  {embedded?<iframe className="conversation-embed" title={`Conversation video: ${lesson.title}`} src={`https://www.youtube.com/embed/${c.youtubeId}?playsinline=1&rel=0${clip?`&start=${clip.start}&end=${clip.end}`:''}${replay||(autoPlay&&clip)?'&autoplay=1':''}`} key={`${whole}-${replay}-${clip?.start}-${clip?.end}`} loading={autoPlay&&clip?"eager":"lazy"} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen; autoplay" allowFullScreen/>:<video ref={video} controls playsInline preload="none" poster={c.poster} src={c.src} aria-label={`Conversation video: ${lesson.title}`} onError={()=>setFailed(true)} onLoadedMetadata={()=>{if(clip&&video.current)video.current.currentTime=clip.start;}} onTimeUpdate={()=>{if(clip&&video.current?.currentTime>=clip.end)video.current.pause();}}/>}
  {cue&&<div className="conversation-tools"><button type="button" onClick={()=>{setWhole(false);if(embedded)setReplay(n=>n+1);else if(video.current){video.current.currentTime=cue.start;video.current.play().catch(()=>setFailed(true));}}}>{uiText("Replay this section · ")}{formatVideoTime(cue.start)}–{formatVideoTime(cue.end)}</button>{!whole&&<button type="button" onClick={()=>setWhole(true)}>{uiText("Watch full video (optional)")}</button>}</div>}
  {!embedded&&<div className="conversation-tools"><label>{uiText("Playback speed ")}<select aria-label={uiText("Conversation playback speed")} value={speed} onChange={e=>{setSpeed(e.target.value);if(video.current)video.current.playbackRate=Number(e.target.value);}}><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option></select></label><button type="button" onClick={()=>{if(video.current)video.current.currentTime=Math.max(0,video.current.currentTime-10);}}>{uiText("Back 10 seconds")}</button></div>}
  {c.sourceTitle&&<p className="conversation-source-title">{c.sourceTitle}</p>}
  {!practice&&c.watchTasks&&<div className="conversation-guide"><h3>{uiText(practice?'Replay with a purpose':'Your listening guide')}</h3><ol>{c.watchTasks.map((task,i)=><li key={i}>{uiText(task,lesson.language||lesson.locale?.slice(0,2)||'es')}</li>)}</ol></div>}
  {!practice&&c.levelNote&&<p className="conversation-hint">{uiText(c.levelNote,lesson.language||lesson.locale?.slice(0,2)||'es')}</p>}
  {!practice&&<p className="conversation-hint">{uiText(c.hint||'Listen for the situation first, then replay for details. This five-minute teaching video includes repetition and on-screen captions.',lesson.language||lesson.locale?.slice(0,2)||'es')}</p>}
  {failed&&<p role="status">{uiText("The video could not load here. Open the original lesson below to watch, or use the dialogue transcript.")}</p>}
  {c.transcript&&<details><summary>{uiText("Read the dialogue transcript")}</summary><p>{uiText("The main conversation; teaching repetitions are omitted.")}</p>{c.transcript.map(([speaker,line],i)=><p key={i} lang={lesson.locale}><b>{speaker}: </b>{line}</p>)}</details>}
  {embedded&&<p className="conversation-hint">{uiText("If playback is unavailable here, use “Open original video” below. YouTube may show ads or restrict playback in some regions.")}</p>}
  <p className="conversation-credit">{uiText("Video: ")}<a href={clip&&embedded?`${c.source}&t=${clip.start}s`:c.source} target="_blank" rel="noreferrer">{c.credit}{uiText(" · Open original video")}</a>{uiText(". Questions by Continuum.")}</p>
 </section>;
}

export function ConversationQuestion({lesson,question}){
 const cue=reviewedVideoCue(question);
 return <div className="conversation-question">
  <h1>{uiText(question.prompt, lesson.language||lesson.locale?.slice(0,2)||'es')}</h1>
  {cue?<p className="question-video-reference"><b>{uiText("Listen at ")}{formatVideoTime(cue.start)}–{formatVideoTime(cue.end)}</b> · {cue.label}<br/>{uiText("Answer from this section. The question paraphrases the video; the window includes context around the relevant statement.")}</p>:question.sourceReference?<p className="question-video-reference"><b>{uiText("Episode section: ")}{question.sourceReference.label}</b><br/>{uiText("Exact YouTube timing is not yet verified. Find this discussion in the ")}<a href={question.sourceReference.url} target="_blank" rel="noreferrer">{uiText("official episode transcript")}</a>{uiText(". Its playback times may differ from this video.")}</p>:<p className="question-video-reference">{uiText("Use the dialogue transcript below for this question. A precise video time has not yet been verified.")}</p>}
  <ConversationVideo lesson={lesson} practice cue={cue}/>
 </div>;
}
