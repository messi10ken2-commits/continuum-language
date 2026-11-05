import React,{useEffect,useMemo,useState} from 'react';
import {Star,LockKeyhole,Check,ArrowRight,Flame,Trophy,RotateCcw} from 'lucide-react';
import {t,tf} from './interface-runtime.mjs';
import LessonText from './LessonText.jsx';
import {levels} from './course.mjs';
import {lightRoute,lightRouteStats,lightRoundKey} from './light-route.mjs';
import {lightProgress,LessonModeControl} from './LightLesson.jsx';
import {TownScene,useLightCompanion} from './LightTown.jsx';
import {materialsPerRound} from './light-town.mjs';
import {lightActivities} from './light-learning-model.mjs';
import {languageInfo} from './languages.mjs';
export default function LightPath({language,user,onStart,onMode,level,setLevel}){
 const [completed,setCompleted]=useState([]),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[reload,setReload]=useState(0);
 useEffect(()=>{let live=true;setReady(false);setFailed(false);lightProgress(user).then(rows=>{if(live){setCompleted(rows);setReady(true)}}).catch(()=>{if(live)setFailed(true)});return()=>{live=false}},[user?.id,language,reload]);
 const kind=useLightCompanion(user,language),[selected,setSelected]=useState(null);
 const languageRoute=useMemo(()=>lightRoute(language),[language]);
 const route=languageRoute.filter(row=>row.chapter.level===level),stats=lightRouteStats(route,completed),allStats=lightRouteStats(languageRoute,completed);
 const pending=route.flatMap(row=>Array.from({length:row.rounds},(_,round)=>({lesson:row.lesson.id,round}))).find(r=>!stats.keys.has(lightRoundKey(r.lesson,r.round)));
 const chapters=[...new Set(route.map(r=>r.chapter))];let previous=true;
 const chapter=chapters.find(c=>c.id===selected)||route.find(r=>r.lesson.id===pending?.lesson)?.chapter||chapters[0];
 const chapterRows=route.filter(r=>r.chapter.id===chapter?.id);
 const chapterStats=lightRouteStats(chapterRows,completed);
 const mission=chapterRows.find(r=>r.lesson.id===pending?.lesson);
 const languageLessons=new Set(languageRoute.map(r=>r.lesson.id));
 const materials=completed.reduce((n,r)=>n+(languageLessons.has(r.lesson)?r.materials??materialsPerRound:0),0);
 const places=chapterRows.slice(Math.max(0,chapterRows.indexOf(mission)-1),Math.max(0,chapterRows.indexOf(mission)-1)+4).map(r=>{
  const round=Array.from({length:r.rounds},(_,i)=>i).find(i=>!stats.keys.has(lightRoundKey(r.lesson.id,i)));
  const status=round===undefined?'done':r===mission?'current':'locked';
  return {id:r.lesson.id,title:<LessonText text={r.lesson.title} language={language} interactive={false}/>,status,
   onOpen:status==='locked'?undefined:()=>onStart(r.lesson.id,round??0)};
 });
 return <div className="light-path light-town"><div className="light-path-heading"><span className="eyebrow">CONTINUUM · {t('Light')}</span><h1>{t('Word Town')}</h1><p>{t('A little play. Real progress.')}</p></div><LessonModeControl mode="light" onChange={onMode}/><div className="light-path-score"><span><Flame size={21}/><b>{allStats.xp} XP</b></span><span><Star size={20}/>{tf('{0} rounds complete',[allStats.done])}</span></div><nav className="light-levels" aria-label={t('Level')}>{levels.map(l=><button key={l.id} aria-pressed={level===l.id} onClick={()=>setLevel(l.id)}>{l.id}</button>)}</nav>
 {!ready?<section className="panel"><p role="status">{t(failed?'Could not load light practice. Try again.':'Loading your light practice…')}</p>{failed&&<button className="primary" onClick={()=>setReload(n=>n+1)}>{t('Try again')}</button>}</section>:<><div className="light-path-summary"><b>{languageInfo(language).native} · {level}</b><span>{stats.done}/{stats.total}</span><progress value={stats.done} max={Math.max(1,stats.total)} aria-label={t('Light progress')}/></div>{stats.done===stats.total&&stats.total>0&&<div className="light-level-complete"><Trophy/><h2>{t('Light level complete!')}</h2><p>{t('Keep exploring or replay a favourite round.')}</p></div>}{chapter&&<section className="town-paper town-hub">
 <label className="town-chapter">{t('Chapter')}<select value={chapter.id} onChange={e=>setSelected(e.target.value)}>{chapters.map(c=><option key={c.id} value={c.id}>{t(c.title)}</option>)}</select></label>
 <div className="town-metrics"><span>{chapterStats.done}/{chapterStats.total} · {t('Light progress')}</span><span>◆ {t('Materials')} <b>{materials}</b></span></div>
 <TownScene language={language} kind={kind} places={places} decoration={chapterStats.done}/>
 {mission&&<><h2><LessonText text={mission.lesson.title} language={language}/></h2><p><LessonText text={chapter.goal} language={language}/></p>
 <p>{tf('{0} questions · about 2 min',[lightActivities(mission.lesson,pending.round).length])}</p>
 <button className="primary wide town-cta" onClick={()=>onStart(pending.lesson,pending.round)}>{t('Continue Light')}<ArrowRight size={19}/></button></>}
 {chapterStats.done<3&&<p>{t('Next decoration')} · {t(['Terrace','Flower bed','Street lamp'][chapterStats.done])}</p>}
 </section>}
 {chapters.map(chapter=>{const rows=route.filter(r=>r.chapter.id===chapter.id),chapterDone=rows.every(row=>Array.from({length:row.rounds},(_,i)=>stats.keys.has(lightRoundKey(row.lesson.id,i))).every(Boolean));return <section className="light-unit" key={chapter.id}><div className="light-unit-heading"><span>{chapterDone?<Trophy size={22}/>:<Star size={22}/>}</span><div><h2><LessonText text={chapter.title} language={language}/></h2><p>{chapterDone?t('Light chapter complete'):<LessonText text={chapter.goal} language={language}/>}</p></div></div><div className="light-node-list">{rows.map((row,index)=>{const count=Array.from({length:row.rounds},(_,i)=>stats.keys.has(lightRoundKey(row.lesson.id,i))).filter(Boolean).length,done=count===row.rounds,available=previous||done,round=Array.from({length:row.rounds},(_,i)=>i).find(i=>!stats.keys.has(lightRoundKey(row.lesson.id,i)))??0;previous=done;return <div key={row.lesson.id} className={'light-path-node '+(done?'done ':available?'current ':'locked ')} style={{'--node-offset':`${[0,36,0,-36][index%4]}px`}} data-lesson-id={row.lesson.id}><button disabled={!available} aria-label={tf('Open Light: {0}',[t(row.lesson.title)])} onClick={()=>onStart(row.lesson.id,round)}>{done?<Check size={30}/>:available?<Star size={29} fill="currentColor"/>:<LockKeyhole size={24}/>}</button><b><LessonText text={row.lesson.title} language={language}/></b><span>{tf('Round {0} of {1}',[Math.min(count+1,row.rounds),row.rounds])}</span>{done&&<small>{t('Complete')}</small>}</div>})}</div></section>})}<p className="light-path-footnote">{t('Light has its own progress. Standard stays available whenever you choose.')}</p></>}
 </div>;
}
