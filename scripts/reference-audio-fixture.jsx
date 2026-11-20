// Development-only entry used by qa-reference-audio.mjs; never imported by app.
import React from 'react';
import {createRoot} from 'react-dom/client';
import {ExclusiveCoursePlayer} from '../PremiumLessons.jsx';
import {LanguageContext} from '../LanguageContext.jsx';
const course=await fetch('/__reference-course').then(r=>r.json());
createRoot(document.getElementById('root')).render(<LanguageContext.Provider value="it"><ExclusiveCoursePlayer course={course} user={{id:'synthetic-reference-browser'}} onExit={()=>{}}/></LanguageContext.Provider>);
