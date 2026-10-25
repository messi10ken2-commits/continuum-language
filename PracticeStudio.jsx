import {lessonList} from './course.mjs';
import {useJourneyLayout,illustratedScene} from './JourneyLayout.jsx';
import {LessonImage} from './LessonMedia.jsx';
import {FeaturePaused} from './PlatformAccess.jsx';
import React,{useState,useLayoutEffect,useRef} from 'react';
import {revealPracticeSection} from './lesson-scroll.mjs';
import {MessageCircle,RotateCcw,Sparkles,Headphones,Mic,Users} from 'lucide-react';
import {t} from './interface-runtime.mjs';
import PremiumLessons from './PremiumLessons.jsx';
import SkillsWorkshop from './SkillsWorkshop.jsx';
import ReviewPool from './ReviewPool.jsx';
import PremiumGuide from './PremiumGuide.jsx';
export default function PracticeStudio({user,language,onSpeaking,onAccount,features={},onSupport,onPractice,onClasses}){
 const {layout}=useJourneyLayout();
 const screen=useRef(null),opened=useRef(false);

 const [view,setView]=useState('home'),[level,setLevel]=useState(()=>{try{return localStorage.getItem('continuumCourseLevel'+(language==='es'?'':':'+language))||'A1'}catch{return 'A1'}});
 useLayoutEffect(()=>{if(opened.current){revealPracticeSection(screen.current)}opened.current=true},[view]);
 const blocked=id=>features[{conversation:'aiConversation',review:'review',courses:'exclusiveCourses',focus:'focusedPractice',pronunciation:'selfStudy'}[id]]===false;
 const choices=[['conversation','AI conversation','Keep a natural conversation going and review your performance.',MessageCircle],['review','Vocabulary review','Revisit the words and expressions you missed.',RotateCcw],['courses','Exclusive courses','Explore practical situations with richer language and mixed exercises.',Sparkles],['focus','Focused practice','Train listening, writing or speaking for a specific situation.',Headphones]];
 const menu=layout==='illustrated'?[choices[0],['pronunciation','Pronunciation','Listen, record and compare.',Mic],choices[1],choices[3],['classes','From your classes','Assignments and teacher-guided practice.',Users],choices[2]]:choices;
 const open=id=>{if(blocked(id)){setView(id);return}if(id==='conversation')return onSpeaking();if(id==='classes')return onClasses?.();if(id==='pronunciation'){const lessons=lessonList.filter(l=>(l.language||'es')===language&&l.skill==='Pronunciation');const lesson=lessons.find(l=>l.level===level)||lessons[0];if(lesson)return onPractice?.(lesson.id);return}setView(id)};
 return <div className="practice-studio" data-view={view} ref={screen} tabIndex={-1}>{view==='home'&&<><span className="eyebrow">CONTINUUM</span><h1>{t('Practice Studio')}</h1><p>{t('Choose how to put your language into practice. Your main course stays in Learn.')}</p><div className="studio-menu">{menu.map(([id,title,description,Icon])=><button key={id} aria-pressed={view===id} onClick={()=>open(id)}>{layout==='illustrated'?<img className="studio-card-photo" src={illustratedScene(language,id)} alt="" width={640} height={360} loading="lazy"/>:<LessonImage lesson={{language,id:'studio-'+id,title:({conversation:'Café conversation',review:'Book review',courses:'Academic library',focus:'Work and study'})[id]}} className="studio-card-photo"/>}<Icon size={24}/><strong>{t(title)}</strong><span>{t(description)}</span>{layout==='illustrated'&&<span className="illustrated-card-action">{t('Explore')} →</span>}</button>)}</div></>}{view!=='home'&&blocked(view)?<><button className="back" onClick={()=>setView('home')}>{t('Back to Practice Studio')}</button><FeaturePaused onSupport={onSupport}/></>:view==='home'?<PremiumGuide user={user} onAccount={onAccount}/>:<><button className="back" onClick={()=>setView('home')}>{t('Back to Practice Studio')}</button>{view==='review'?<ReviewPool user={user} language={language} onBack={()=>setView('home')}/>:view==='courses'?<PremiumLessons user={user} language={language} showLocked onAccount={onAccount}/>:<><label className="studio-level">{t('Practice level')}<select aria-label={t('Practice level')} value={level} onChange={e=>setLevel(e.target.value)}>{['A1','A2','B1','B2','C1'].map(l=><option key={l}>{l}</option>)}</select></label><SkillsWorkshop level={level} language={language} user={user}/></>}</>}</div>;
}
