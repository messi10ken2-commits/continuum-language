import Adventure,{useAdventure} from './Adventure.jsx';
import React,{useContext,useEffect,useState} from 'react';
import {CalendarDays,Clock3,Flag,BookOpen,Award,ArrowRight,ChevronLeft,ChevronRight} from 'lucide-react';
import {ActivityContext,ActivityBars} from './LearningActivity.jsx';
import {journeyMilestones} from './journey-model.mjs';
import {languages} from './languages.mjs';
import {t,interfaceLanguage} from './interface-runtime.mjs';
import JourneyVisual from './JourneyVisual.jsx';
import IllustratedMap from './IllustratedMap.jsx';
import {LearningShortcuts} from './LearnerNavigation.jsx';
import {getLesson,lessonList} from './course.mjs';
import {illustratedLessonArt} from './illustrated-art.mjs';
const teacherPictures=new Map();
export function IllustratedTeacherPhoto({id,name}){
 const [photo,setPhoto]=useState('');
 useEffect(()=>{let live=true;setPhoto('');if(!id)return;if(!teacherPictures.has(id))teacherPictures.set(id,fetch('/api/teachers/'+encodeURIComponent(id),{credentials:'same-origin'}).then(r=>r.ok?r.json():null).then(d=>d?.teacher?.photo||'').catch(()=>''));teacherPictures.get(id).then(p=>{if(live)setPhoto(p)});return()=>{live=false}},[id]);
 return photo?<img className="approved-teacher-photo" src={photo} alt={name} width={88} height={88}/>:<span className="approved-teacher-photo initials" aria-hidden="true">{name?.split(/\s+/).map(s=>s[0]).slice(0,2).join('')}</span>;
}

export function IllustratedHeader({user,language,onLanguage,onAccount}){
 return <header className="illustrated-header"><div className="illustrated-brand"><span aria-hidden="true">C</span><b>Continuum</b></div><div className="illustrated-header-actions"><label><span className="sr-only">{t('Learning language')}</span><select aria-label={t('Learning language')} value={language} onChange={e=>onLanguage(e.target.value)}>{languages.map(l=><option key={l.id} value={l.id}>{({en:'🇬🇧',es:'🇪🇸',pt:'🇧🇷',ja:'🇯🇵'})[l.id]} {t(l.name)}</option>)}</select></label><button className="illustrated-avatar" aria-label={t('Your account')} onClick={onAccount}>{user.name?.split(/\s+/).map(s=>s[0]).slice(0,2).join('')}</button></div></header>;
}
function weekDays(data){if(!data?.today)return [];const end=Date.parse(data.today+'T12:00:00Z');return (data.days||[]).filter(d=>{const at=Date.parse(d.day+'T12:00:00Z');return at<=end&&at>end-7*86400000})}
export function IllustratedMetrics({attempts=[],dailyGoal=10,memory=false}){
 const {data}=useContext(ActivityContext)||{},days=weekDays(data),active=days.filter(d=>d.studyMs>=60000).length,minutes=Math.floor(Number(data?.todayMs||0)/60000),weekMinutes=Math.floor(days.reduce((n,d)=>n+Number(d.studyMs||0),0)/60000),earned=journeyMilestones(attempts,data||{}).filter(m=>m.earned).length;
 return <section className={'illustrated-metrics'+(memory?' memory-metrics':'')} aria-label={t('Your learning rhythm')}><div><span className="metric-icon green"><CalendarDays/></span><span><b>{data?active:'—'}</b><small>{t('study days this week')}</small></span></div><div><span className="metric-icon violet"><Clock3/></span><span><b>{data?memory?weekMinutes:minutes:'—'}{memory?' '+t('min'):' / '+dailyGoal+' '+t('min')}</b><small>{t(memory?'studied this week':'Today')}</small>{!memory&&<progress aria-label={t('Daily study goal')} max={dailyGoal} value={Math.min(minutes,dailyGoal)}/>}</span></div><div><span className="metric-icon gold"><Flag/></span><span><b>{earned}</b><small>{t('milestones earned')}</small></span></div></section>;
}
export function IllustratedActivity({onNavigate}){
 const {data,error}=useContext(ActivityContext)||{},[period,setPeriod]=useState('Week');
 const days=period==='Week'?weekDays(data):period==='Month'?(data?.days||[]).filter(d=>d.day>=(data?.today?new Date(Date.parse(data.today+'T12:00:00Z')-29*86400000).toISOString().slice(0,10):'')):data?.days||[];
 const ms=period==='All time'?Number(data?.studyMs||0):days.reduce((n,d)=>n+Number(d.studyMs||0),0),active=period==='All time'?data?.studyDays||0:days.filter(d=>d.studyMs>=60000).length;
 return <section className="panel illustrated-activity"><div className="illustrated-section-heading"><div><h2>{t('Your activity')}</h2><p>{t('Every step, in one place.')}</p></div><CalendarDays size={22}/></div><div className="illustrated-periods" role="group" aria-label={t('Activity period')}>{['Week','Month','All time'].map(p=><button key={p} aria-pressed={period===p} onClick={()=>setPeriod(p)}>{t(p)}</button>)}</div>{error&&<p role="status">{t(error)}</p>}<div className="illustrated-activity-totals"><span><b>{data?Math.floor(ms/60000):'—'} {t('min')}</b><small>{t(period==='Week'?'this week':period==='Month'?'this month':'Total tracked study time')}</small></span><span><b>{data?active:'—'}</b><small>{t('active days')}</small></span></div>{data&&period==='Week'&&<ActivityBars data={data}/>}<button className="text-button" onClick={()=>onNavigate('Learning memory')}>{t('Daily learning record')} <ArrowRight size={16}/></button></section>;
}
export function IllustratedOverview({user,language,attempts,dailyGoal,onLanguage,onNavigate,onStart}){
 const adventure=useAdventure(user,language);
 return <div className="illustrated-overview"><JourneyVisual language={language} section="Overview" title="Your next chapter awaits" description="Explore, practise and make real progress."/><IllustratedMetrics attempts={attempts} dailyGoal={dailyGoal}/><Adventure state={adventure} onStart={onStart} onNavigate={onNavigate}/><section className="panel approved-map-panel"><div className="illustrated-section-heading"><div><h2>{t('Your learning map')}</h2><p>{t('Choose a topic and follow your curiosity.')}</p></div></div><IllustratedMap adventure={adventure.data} language={language} attempts={attempts} onStart={onStart}/></section><LearningShortcuts onNavigate={onNavigate}/><IllustratedActivity onNavigate={onNavigate}/></div>;
}
export function IllustratedStudioResume({user,language,attempts=[],onPractice}){
 const [draft,setDraft]=useState(null);
 useEffect(()=>{let live=true;if(user)fetch('/api/learning',{credentials:'same-origin'}).then(r=>r.ok?r.json():null).then(d=>{if(live)setDraft((d?.drafts||[]).find(x=>(getLesson(x.lesson)?.language||'es')===language))}).catch(()=>{});return()=>{live=false}},[user?.id,language]);
 const latest=attempts.find(a=>(getLesson(a.lesson)?.language||'es')===language),lesson=getLesson(draft?.lesson||latest?.lesson)||lessonList.find(l=>(l.language||'es')===language&&!l.checkpoint&&!l.summaryTest);
 if(!lesson)return null;
 return <section className="illustrated-studio-resume"><img src={illustratedLessonArt(lesson).src} alt="" width={180} height={100}/><div><h2>{t(draft?'Continue your practice':latest?'Revisit your practice':'Your next practice')}</h2><p>{t(lesson.title,language)}</p></div><button className="primary" onClick={()=>onPractice(lesson.id)}>{t(draft?'Resume':latest?'Review':'Start')} <ArrowRight size={16}/></button></section>;
}
export function IllustratedClassWeek({bookings=[],zone,onOpen}){
 const [offset,setOffset]=useState(0),locale=interfaceLanguage();
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()),value=k=>parts.find(p=>p.type===k).value;
 const today=new Date(Date.UTC(+value('year'),+value('month')-1,+value('day'))),monday=new Date(+today-((today.getUTCDay()+6)%7)*86400000+offset*7*86400000),days=Array.from({length:7},(_,i)=>new Date(+monday+i*86400000));
 const key=at=>{const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(at)).map(v=>[v.type,v.value]));return [p.year,p.month,p.day].join('-')};
 return <section className="panel illustrated-class-week"><div><h2>{t('This week')}</h2><span><button type="button" aria-label={t('Previous week')} onClick={()=>setOffset(n=>n-1)}><ChevronLeft/></button><button type="button" aria-label={t('Next week')} onClick={()=>setOffset(n=>n+1)}><ChevronRight/></button></span></div><div className="illustrated-week-days">{days.map(day=>{const date=day.toISOString().slice(0,10),booking=bookings.find(b=>key(b.startsAt)===date);return <button key={date} type="button" className={+day===+today?'today':''} onClick={()=>booking&&onOpen(booking.id)} aria-label={day.toLocaleDateString(locale,{dateStyle:'full',timeZone:'UTC'})+(booking?' · '+booking.topic:'')}><small>{day.toLocaleDateString(locale,{weekday:'short',timeZone:'UTC'})}</small><b>{day.getUTCDate()}</b><i className={booking?'has-class':''}/></button>})}</div></section>;
}
