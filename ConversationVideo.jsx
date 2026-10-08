import React,{useRef,useState} from 'react';
export default function ConversationVideo({lesson,practice=false}){
 const video=useRef(null),[failed,setFailed]=useState(false),[speed,setSpeed]=useState('1');
 const c=lesson.conversation;if(!c)return null;
 const embedded=c.provider==='youtube'&&/^[A-Za-z0-9_-]{11}$/.test(c.youtubeId||'');
 return <section className="conversation-video" aria-label="Conversation with human voices">
  <div className="visual-section-title"><div><span className="eyebrow">REAL PEOPLE · ORIGINAL SPOKEN AUDIO</span><h2>{practice?'Watch and listen again':'Watch the conversation'}</h2></div></div>
  {embedded?<iframe className="conversation-embed" title={`Conversation video: ${lesson.title}`} src={`https://www.youtube.com/embed/${c.youtubeId}?playsinline=1&rel=0`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen/>:<video ref={video} controls playsInline preload="none" poster={c.poster} src={c.src} aria-label={`Conversation video: ${lesson.title}`} onError={()=>setFailed(true)}/>}
  {!embedded&&<div className="conversation-tools"><label>Playback speed <select aria-label="Conversation playback speed" value={speed} onChange={e=>{setSpeed(e.target.value);if(video.current)video.current.playbackRate=Number(e.target.value);}}><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option></select></label><button type="button" onClick={()=>{if(video.current)video.current.currentTime=Math.max(0,video.current.currentTime-10);}}>Back 10 seconds</button></div>}
  {c.sourceTitle&&<p className="conversation-source-title">{c.sourceTitle}</p>}
  {c.watchTasks&&<div className="conversation-guide"><h3>{practice?'Replay with a purpose':'Your listening guide'}</h3><ol>{c.watchTasks.map((task,i)=><li key={i}>{task}</li>)}</ol></div>}
  {c.levelNote&&<p className="conversation-hint">{c.levelNote}</p>}
  <p className="conversation-hint">{c.hint||'Listen for the situation first, then replay for details. This five-minute teaching video includes repetition and on-screen captions.'}</p>
  {failed&&<p role="status">The video could not load here. Open the original lesson below to watch, or use the dialogue transcript.</p>}
  {c.transcript&&<details><summary>Read the dialogue transcript</summary><p>The main conversation; teaching repetitions are omitted.</p>{c.transcript.map(([speaker,line],i)=><p key={i} lang={lesson.locale}><b>{speaker}: </b>{line}</p>)}</details>}
  {c.phrases&&<details><summary>Practice phrases — not a transcript</summary><p>Related examples by Continuum. These are not quotations from the video.</p>{c.phrases.map(([line,meaning],i)=><p key={i}><b lang={lesson.locale}>{line}</b><br/>{meaning}</p>)}</details>}
  {embedded&&<p className="conversation-hint">If playback is unavailable here, use “Open original video” below. YouTube may show ads or restrict playback in some regions.</p>}
  <p className="conversation-credit">Video: <a href={c.source} target="_blank" rel="noreferrer">{c.credit} · Open original video</a>. Questions by Continuum.</p>
 </section>;
}
