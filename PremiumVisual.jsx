import React,{useEffect,useRef,useState} from 'react';
import {LessonImage} from './LessonMedia.jsx';
import {t} from './interface-runtime.mjs';
import {Maximize2,X} from 'lucide-react';
export default function PremiumVisual({course,index=0,compact=false}){
 const [open,setOpen]=useState(false),button=useRef(null);
 useEffect(()=>{if(!open)return;const close=e=>{if(e.key==='Escape'){setOpen(false);button.current?.focus()}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[open]);
 const theme=course.scene==='academic'?'study':course.scene==='varieties'?({en:'city',es:'cafe',pt:'travel',ja:'japan'})[course.language]:course.scene==='housing'?'home':course.scene==='travel'?'travel':/workplace|interview/.test(course.title.toLowerCase())?'work':course.language==='ja'?'japan':'cafe';
 const lesson={...course,id:course.id+'-visual-'+index,visualStory:{theme},...(course.scene==='academic'?{conversation:{poster:['/lesson-media/library-v2.jpg','/lesson-media/study-garden-v2.jpg','/lesson-media/study.jpg'][index%3],alt:'An illustrative study or library scene'}}:{})};
 return <figure className={'premium-scene '+(compact?'compact':'')}><LessonImage lesson={lesson}/>{!compact&&<><button type="button" className="premium-enlarge" ref={button} onClick={()=>setOpen(true)}><Maximize2 size={16}/>{t('Enlarge')}</button><figcaption>{t('Illustrative scene · use the task and its context to answer.')}</figcaption></>}{open&&<div className="premium-image-dialog" role="dialog" aria-modal="true" aria-label={t('Enlarged lesson image')} onKeyDown={e=>{if(e.key==='Tab')e.preventDefault()}} onClick={()=>{setOpen(false);button.current?.focus()}}><button autoFocus type="button" aria-label={t('Close image')} onClick={()=>{setOpen(false);button.current?.focus()}}><X/></button><LessonImage lesson={lesson}/></div>}</figure>;
}
