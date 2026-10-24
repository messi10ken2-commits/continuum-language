import React,{useEffect,useRef,useState} from 'react';
import {LessonImage} from './LessonMedia.jsx';
import SentenceAudio from './SentenceAudio.jsx';
import ConversationVideo from './ConversationVideo.jsx';
import {languageInfo} from './languages.mjs';
import {premiumGalleryFrames} from './premium-session.mjs';
import {t} from './interface-runtime.mjs';
import {Maximize2,X} from 'lucide-react';
export default function PremiumVisual({course,index=0,compact=false,context}){
 const [open,setOpen]=useState(false),button=useRef(null);
 useEffect(()=>{if(!open)return;const close=e=>{if(e.key==='Escape'){setOpen(false);button.current?.focus()}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[open]);
 const theme=course.scene==='academic'?'study':course.scene==='varieties'?({en:'city',es:'cafe',pt:'travel',ja:'japan'})[course.language]:course.scene==='housing'?'home':course.scene==='travel'?'travel':/workplace|interview/.test(course.title.toLowerCase())?'work':course.language==='ja'?'japan':'cafe';
 const lesson={...course,id:course.id+'-visual-'+index,sceneText:context||course.title,sceneKey:course.id+':visual:'+index,visualStory:{theme},...(course.scene==='academic'?{conversation:{poster:['/lesson-media/library-v2.jpg','/lesson-media/study-garden-v2.jpg','/lesson-media/study.jpg'][index%3],alt:'An illustrative study or library scene'}}:{})};
 return <figure className={'premium-scene '+(compact?'compact':'')}><LessonImage lesson={lesson}/>{!compact&&<><button type="button" className="premium-enlarge" ref={button} onClick={()=>setOpen(true)}><Maximize2 size={16}/>{t('Enlarge')}</button><figcaption>{t('Illustrative scene · use the task and its context to answer.')}</figcaption></>}{open&&<div className="premium-image-dialog" role="dialog" aria-modal="true" aria-label={t('Enlarged lesson image')} onKeyDown={e=>{if(e.key==='Tab')e.preventDefault()}} onClick={()=>{setOpen(false);button.current?.focus()}}><button autoFocus type="button" aria-label={t('Close image')} onClick={()=>{setOpen(false);button.current?.focus()}}><X/></button><LessonImage lesson={lesson}/></div>}</figure>;
}

export function PremiumGallery({course}){
 const [index,setIndex]=useState(0),[revealed,setRevealed]=useState(false),frames=premiumGalleryFrames(course),locale=languageInfo(course.language).locale;
 if(!frames.length)return course.conversation?<ConversationVideo lesson={{...course,locale}} practice/>:<PremiumVisual course={course}/>;
 const frame=frames[index%frames.length];
 return <section className="lesson-media premium-gallery" aria-label={t('Visual lesson')}>
 <div className="visual-stage"><PremiumVisual course={course} index={index} context={frame.text}/><div className="visual-focus">
 <span className="visual-step-label">{index+1} / {frames.length} · {t(frame.label)}</span><p className="visual-target" lang={locale}>{frame.text}</p>
 {(course.scene!=='varieties'||frame.audioLocale)&&<SentenceAudio allowDeviceFallback={course.scene!=='varieties'} key={index} text={frame.text} lang={frame.audioLocale||locale} audioEndpoint={'/api/billing/courses/'+course.id+'/audio?gallery='+index}/>}
 {frame.meaning&&<><button className="visual-reveal" aria-expanded={revealed} onClick={()=>setRevealed(!revealed)}>{t(revealed?'Hide meaning':'Think first · reveal meaning')}</button>{revealed&&<p className="visual-meaning">{t(frame.meaning,course.language)}</p>}</>}
 </div></div><progress className="visual-example-progress" value={index+1} max={frames.length} aria-label={t('Explore lesson examples')}/>
 <div className="visual-steps" role="group" aria-label={t('Explore lesson examples')}>{frames.map((f,i)=><button type="button" key={i} aria-pressed={index===i} onClick={()=>{setIndex(i);setRevealed(false)}}>{i+1} · {t(f.label)}</button>)}</div>
 </section>;
}
