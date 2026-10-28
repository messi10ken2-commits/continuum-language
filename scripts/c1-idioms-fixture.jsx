// Development-only visual QA fixture; never imported by the production entry.
import React from 'react';import {createRoot} from 'react-dom/client';
import {LessonPlayer} from '../SelfStudy.jsx';import {getLesson,getLessonVariant} from '../course.mjs';
import {premiumIdiomCourses} from '../premium-idioms.mjs';import {ExclusiveCoursePlayer} from '../PremiumLessons.jsx';
import IllustratedMap from '../IllustratedMap.jsx';import JourneyMap from '../JourneyMap.jsx';import {JourneyLayoutContext} from '../JourneyLayout.jsx';
import '../styles.css';import '../approved-illustrated.css';import '../journey.css';
const query=new URLSearchParams(location.search),language=query.get('language')||'en',mode=query.get('mode')||'core',part=query.get('part')||'1';
localStorage.setItem('continuumInterfaceLanguage','en');localStorage.setItem('continuumCourseLevel'+(language==='es'?'':':'+language),'C1');
const id=(language==='es'?'':language+'-')+'c1-everyday-idioms-'+part,lesson=getLesson(id);
const course=premiumIdiomCourses.find(c=>c.id===language+'-c1-exclusive-idioms-'+part),visible={...course,questions:course.questions.map(({answer,note,...q})=>q)};
const layout=mode==='illustrated-map'?'illustrated':'photo';
const render=mode==='illustrated-map'?<IllustratedMap language={language} attempts={[]} onStart={id=>window.__started=id}/>:mode==='photo-map'?<JourneyMap language={language} initialLevel="C1" onStart={id=>window.__started=id}/>:mode==='exclusive'?<ExclusiveCoursePlayer course={visible} user={{id:'synthetic-idiom-user'}} onExit={()=>{}}/>:<LessonPlayer lesson={lesson} language={language} onExit={()=>{}} onDraft={(answers,seed)=>{window.__idiomQA={answers,seed,lesson:getLessonVariant(id,seed)};}}/>;
createRoot(document.getElementById('root')).render(<JourneyLayoutContext.Provider value={{layout,setLayout(){}}}>{render}</JourneyLayoutContext.Provider>);
