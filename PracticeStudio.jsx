import React,{useState} from 'react';
import {MessageCircle,RotateCcw,Sparkles,Headphones} from 'lucide-react';
import {t} from './interface-runtime.mjs';
import PremiumLessons from './PremiumLessons.jsx';
import SkillsWorkshop from './SkillsWorkshop.jsx';
import ReviewPool from './ReviewPool.jsx';
import PremiumGuide from './PremiumGuide.jsx';
export default function PracticeStudio({user,language,onSpeaking,onAccount}){
 const [view,setView]=useState('home'),[level,setLevel]=useState(()=>{try{return localStorage.getItem('continuumCourseLevel'+(language==='es'?'':':'+language))||'A1'}catch{return 'A1'}});
 const choices=[['conversation','AI conversation','Keep a natural conversation going and review your performance.',MessageCircle],['review','Vocabulary review','Revisit the words and expressions you missed.',RotateCcw],['courses','Exclusive courses','Explore practical situations with richer language and mixed exercises.',Sparkles],['focus','Focused practice','Train listening, writing or speaking for a specific situation.',Headphones]];
 return <div className="practice-studio"><span className="eyebrow">CONTINUUM</span><h1>{t('Practice Studio')}</h1><p>{t('Choose how to put your language into practice. Your main course stays in Learn.')}</p><div className="studio-menu">{choices.map(([id,title,description,Icon])=><button key={id} aria-pressed={view===id} onClick={()=>id==='conversation'?onSpeaking():setView(id)}><Icon size={24}/><strong>{t(title)}</strong><span>{t(description)}</span></button>)}</div>{view==='home'?<PremiumGuide user={user} onAccount={onAccount}/>:<><button className="back" onClick={()=>setView('home')}>{t('Back to Practice Studio')}</button>{view==='review'?<ReviewPool user={user} language={language} onBack={()=>setView('home')}/>:view==='courses'?<PremiumLessons user={user} language={language} showLocked onAccount={onAccount}/>:<><label className="studio-level">{t('Practice level')}<select value={level} onChange={e=>setLevel(e.target.value)}>{['A1','A2','B1','B2','C1'].map(l=><option key={l}>{l}</option>)}</select></label><SkillsWorkshop level={level} language={language} user={user}/></>}</>}</div>;
}
