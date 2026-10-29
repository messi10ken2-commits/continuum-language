// Development-only fixture: real components, no private catalogs or accounts.
import React from 'react';import {createRoot} from 'react-dom/client';
import SelfStudy,{LessonPlayer} from '../SelfStudy.jsx';
import IllustratedMap from '../IllustratedMap.jsx';
import {JourneyLayoutContext} from '../JourneyLayout.jsx';
import {getLesson,getLessonVariant,hasExpandedExercises} from '../course.mjs';
import {setInterfaceLanguage} from '../interface-runtime.mjs';
import '../styles.css';import '../features.css';import '../journey.css';import '../illustrated-world.css';import '../rpg-world.css';import '../reference-layout.css';import '../quest-continuity.css';import '../approved-illustrated.css';
const q=new URLSearchParams(location.search),language=q.get('language')||'zh',layout=q.get('layout')||'photo',view=q.get('view')||'map',level=q.get('level')||'A1',lesson=getLesson(q.get('lesson')||`${language}-a1-core-v3-lesson-7`),seed=hasExpandedExercises(lesson.id)?'v8-expansion-browser-123456789':undefined;
setInterfaceLanguage(q.get('display')||'en',{persist:false});
localStorage.setItem('continuumCourseLevel:'+language,level);
window.__qaQuestions=getLessonVariant(lesson.id,seed).questions;
createRoot(document.getElementById('root')).render(<JourneyLayoutContext.Provider value={{layout,setLayout(){}}}><div className={'app journey-app learner-journey '+(layout==='illustrated'?'illustrated-world approved-illustrated'+(view!=='map'?' focused-lesson':''):'')}><main><div className="content">{view==='map'?layout==='illustrated'?<IllustratedMap language={language} attempts={[]} adventure={{account:'expansion-fixture',companion:'bird'}} onStart={id=>window.__started=id}/>:<SelfStudy language={language} attempts={[]} onStart={id=>window.__started=id} onExit={()=>{}} onComplete={()=>{}}/>:<LessonPlayer lesson={lesson} language={language} initialSeed={seed} initialAnswers={view==='exercise'?[]:undefined} onDraft={()=>{}} onComplete={value=>window.__completed=value} onExit={()=>{}}/>}</div></main></div></JourneyLayoutContext.Provider>);
