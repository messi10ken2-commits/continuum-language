import React,{useRef,useState} from 'react';
import JourneyVisual from './JourneyVisual.jsx';
import {IllustratedMetrics} from './IllustratedDesign.jsx';
import LearningLog from './LearningLog.jsx';
import {savedTimelineEvents} from './saved-timeline.mjs';
import {getLesson,lessonTitle} from './course.mjs';
import {LessonImage} from './LessonMedia.jsx';
import RecurringPatterns from './RecurringPatterns.jsx';
import {SkillRecord} from './SkillsWorkshop.jsx';
import {LearningConsistency} from './LearningActivity.jsx';
import {t} from './interface-runtime.mjs';
export default function IllustratedMemory({user,language,attempts=[],notes=[],allAttempts=attempts,dailyGoal,onPractice,onNavigate}){
 const events=savedTimelineEvents(attempts,notes,lessonTitle),[selected,setSelected]=useState(''),detail=useRef(null),history=attempts.filter(a=>a.lesson===selected).sort((a,b)=>new Date(b.at)-new Date(a.at));
 const view=id=>{setSelected(id);requestAnimationFrame(()=>detail.current?.scrollIntoView({behavior:'smooth',block:'start'}))};
 return <div className="approved-memory"><JourneyVisual language={language} section="Learning memory" title="Your learning memory" description="Every step becomes part of your story."/><IllustratedMetrics attempts={allAttempts} dailyGoal={dailyGoal} memory/><div className="approved-memory-grid"><LearningLog title="Your learning timeline" events={events} initiallyOpen openFirst renderPractice={event=><div className="approved-memory-example"><LessonImage lesson={getLesson(event.lesson)||{language,title:event.title}}/><div><b>{t('Practice result')}: {event.score}%</b><p>{event.total} {t('questions')} · {event.at?new Date(event.at).toLocaleDateString():t('Previous practice')}</p><button className="primary" onClick={()=>onPractice(event.lesson)}>{t('Practise again')}</button><button className="text-button" onClick={()=>view(event.lesson)}>{t('View attempts')}</button></div></div>}/><RecurringPatterns language={language} user={user} onPractice={onPractice} onNavigate={onNavigate}/></div>{selected&&<section className="panel approved-attempt-history" ref={detail} tabIndex={-1}><h2>{t(lessonTitle(selected),language)}</h2><h3>{t('Score history')}</h3>{history.map((a,i)=><div key={a.id||i}><time>{new Date(a.at).toLocaleString()}</time><b>{a.score}%</b><span>{a.total} {t('questions')}</span></div>)}</section>}<details className="panel approved-record-disclosure"><summary>{t('Your activity')}</summary><LearningConsistency user={user} compact/></details><details className="panel approved-record-disclosure"><summary>{t('Your skill submissions')}</summary><SkillRecord language={language} user={user}/></details><p className="record-privacy">{t('Teacher visibility follows “Share self-study activity” in Account.')}</p></div>;
}
