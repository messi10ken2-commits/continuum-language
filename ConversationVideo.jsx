import React,{useRef,useState} from 'react';
export default function ConversationVideo({lesson,practice=false}){
 const video=useRef(null),[failed,setFailed]=useState(false),[speed,setSpeed]=useState('1');
 const c=lesson.conversation;if(!c)return null;
 return <section className="conversation-video" aria-label="Conversation with human voices">
  <div className="visual-section-title"><div><span className="eyebrow">REAL PEOPLE · ORIGINAL SPOKEN AUDIO</span><h2>{practice?'Watch and listen again':'Watch the conversation'}</h2></div></div>
  <video ref={video} controls playsInline preload="none" poster={c.poster} src={c.src} aria-label={`Conversation video: ${lesson.title}`} onError={()=>setFailed(true)}/>
  <div className="conversation-tools"><label>Playback speed <select aria-label="Conversation playback speed" value={speed} onChange={e=>{setSpeed(e.target.value);if(video.current)video.current.playbackRate=Number(e.target.value);}}><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option></select></label><button type="button" onClick={()=>{if(video.current)video.current.currentTime=Math.max(0,video.current.currentTime-10);}}>Back 10 seconds</button></div>
  <p className="conversation-hint">Listen for the situation first, then replay for details. This five-minute teaching video includes repetition and on-screen captions.</p>
  {failed&&<p role="status">The video could not load here. Open the original lesson below to watch, or use the dialogue transcript.</p>}
  <details><summary>Read the dialogue transcript</summary><p>The main conversation; teaching repetitions are omitted.</p>{c.transcript.map(([speaker,line],i)=><p key={i} lang="en-US"><b>{speaker}: </b>{line}</p>)}</details>
  <p className="conversation-credit">Video and dialogue: <a href={c.source} target="_blank" rel="noreferrer">{c.credit} · Open original lesson</a>. Questions by Continuum.</p>
 </section>;
}
