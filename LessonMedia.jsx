import ConversationVideo from './ConversationVideo.jsx';
import React,{useEffect,useRef,useState} from 'react';
import {ArrowRight,Check,Maximize2,Play,RotateCcw,X} from 'lucide-react';
import SentenceAudio from './SentenceAudio.jsx';
import {lessonList} from './course.mjs';
import {hasLessonMedia,mediaThemes,photoFor,themeFor,videoFor,visualFrames} from './lesson-media.mjs';
import './lesson-media.css';
export function LessonImage({lesson,className='',eager=false}){
 const [failed,setFailed]=useState(false);const theme=themeFor(lesson);
 useEffect(()=>setFailed(false),[photoFor(lesson)]);
 return failed?<div className={`media-image-fallback ${className}`} role="img" aria-label={mediaThemes[theme].name}><span>{mediaThemes[theme].name}</span></div>:<img className={className} src={photoFor(lesson)} alt={lesson.conversation?.alt||mediaThemes[theme].alt} loading={eager?'eager':'lazy'} decoding="async" onError={()=>setFailed(true)}/>;
}
export function VisualDiscovery({language='es',level,onStart}){
 const stories=lessonList.filter(l=>(l.language||'es')===language&&(l.visualStory||l.conversation)&&(!level||l.level===level));
 const extras=level?lessonList.filter(l=>(l.language||'es')===language&&l.level===level&&hasLessonMedia(l)&&!l.visualStory).filter((l,i,a)=>a.findIndex(x=>x.skill===l.skill)===i).slice(0,3):[];
 return <section className="visual-discovery"><div className="visual-section-title"><div><span className="eyebrow">SEE IT. UNDERSTAND IT. USE IT.</span><h2>Explore your world</h2></div><span>{level||'A1–C1'} · Visual learning</span></div><div className="visual-discovery-grid">{[...stories,...extras].map(l=><button key={l.id} className="discovery-card" onClick={()=>onStart(l.id)}><div className="discovery-photo"><LessonImage lesson={l}/><span className="discovery-level">{l.level}</span><span className="discovery-play"><Play size={16}/></span></div><div className="discovery-copy"><small>{l.conversation?'REAL CONVERSATION · WITH AUDIO':l.visualStory?'SCENE & COMPREHENSION':l.skill.toUpperCase()}</small><h3>{l.title}</h3><span>Explore lesson <ArrowRight size={15}/></span></div></button>)}</div></section>;
}
export default function LessonMedia({lesson}){
 const [mode,setMode]=useState('explore'),[index,setIndex]=useState(0),[revealed,setRevealed]=useState(false),[videoError,setVideoError]=useState(false);
 const dialog=useRef(null),video=useRef(null);const frames=visualFrames(lesson),theme=mediaThemes[themeFor(lesson)],locale=lesson.locale||'es-ES';
 useEffect(()=>()=>video.current?.pause(),[]);
 if(lesson.conversation)return <ConversationVideo lesson={lesson}/>;
 if(!hasLessonMedia(lesson))return <PageScene lesson={lesson}/>;
 const f=frames[index%frames.length];
 return <section className="lesson-media" aria-label="Visual lesson"><div className="lesson-media-top"><span className="eyebrow">{lesson.visualStory?'A SCENE TO UNDERSTAND':'YOUR VISUAL RECAP'}</span><div className="media-tabs" role="group" aria-label="Visual learning format"><button aria-pressed={mode==='explore'} onClick={()=>{video.current?.pause();setMode('explore');}}>Explore</button><button aria-pressed={mode==='watch'} onClick={()=>setMode('watch')}><Play size={14}/>Watch</button></div></div>
 {mode==='explore'?<><div className="visual-stage"><button className="visual-photo-button" onClick={()=>dialog.current?.showModal()} aria-label="Enlarge lesson image"><LessonImage lesson={lesson} eager/><span><Maximize2 size={17}/>Enlarge</span></button><div className="visual-focus" style={{'--scene-color':theme.color}}><span className="visual-step-label">{String(index+1).padStart(2,'0')} / {String(frames.length).padStart(2,'0')} · {f.label}</span><p className="visual-target" lang={locale}>{f.text}</p><SentenceAudio key={f.text} text={f.text} lang={f.lang||(lesson.characters?'ja-JP':locale)}/><button className="visual-reveal" aria-expanded={revealed} onClick={()=>setRevealed(!revealed)}>{revealed?'Hide meaning':'Think first · reveal meaning'}</button>{revealed&&<div className="visual-meaning"><b>{f.meaning}</b><p>{f.note}</p></div>}</div></div><div className="visual-steps" role="group" aria-label="Explore lesson examples">{frames.map((frame,i)=><button key={i} aria-pressed={index===i} onClick={()=>{setIndex(i);setRevealed(false);}}><span>{i+1}</span>{frame.label}<ArrowRight size={14}/></button>)}</div></>:<div className="visual-video"><video ref={video} controls playsInline preload="none" poster={photoFor(lesson)} src={videoFor(lesson)} aria-label={`Captioned visual recap: ${lesson.title}`} onError={()=>setVideoError(true)}/><p><Play size={14}/>Captioned visual recap · no spoken soundtrack · pause to read</p>{videoError&&<p role="status">The video could not load. You can still use every example in Explore or read the transcript below.</p>}<details><summary>Read the complete video transcript</summary>{frames.map((frame,i)=><div key={i}><b>{i+1}. {frame.label}</b><p lang={locale}>{frame.text}</p><p>{frame.meaning}</p><p>{frame.note}</p></div>)}</details></div>}
 <p className="media-caption">{theme.name} · Illustrative photo from <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash</a>. Examples and recap by Continuum.</p>
 <dialog className="lesson-image-dialog" ref={dialog}><button className="dialog-close" aria-label="Close enlarged image" onClick={()=>dialog.current?.close()}><X/></button><LessonImage lesson={lesson}/><p>{theme.alt}</p></dialog>
 </section>;
}

export function PageScene({lesson,caption='A visual setting for this lesson. Use the question and audio to choose your answer.'}){
 const dialog=useRef(null);
 return <figure className="page-scene"><button type="button" className="page-scene-button" aria-label="Enlarge page image" onClick={()=>dialog.current?.showModal()}><LessonImage lesson={lesson} className="visual-practice-photo"/><span><Maximize2 size={15}/> Enlarge</span></button><figcaption>{caption}</figcaption><dialog className="lesson-image-dialog" ref={dialog}><button type="button" className="dialog-close" aria-label="Close enlarged page image" onClick={()=>dialog.current?.close()}><X/></button><LessonImage lesson={lesson}/></dialog></figure>;
}
