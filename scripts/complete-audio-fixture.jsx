// Development-only entry used by qa-complete-lesson-audio.mjs.
import React from 'react';
import {createRoot} from 'react-dom/client';
import LessonReference from '../LessonReference.jsx';
import {LanguageContext} from '../LanguageContext.jsx';
const language=new URLSearchParams(location.search).get('language');
const lesson=await fetch('/__complete-audio-lesson?language='+language).then(r=>r.json());
createRoot(document.getElementById('root')).render(<LanguageContext.Provider value={language}><LessonReference lesson={lesson}/></LanguageContext.Provider>);
