import React from 'react';import {createRoot} from 'react-dom/client';
import SentenceAudio from '../SentenceAudio.jsx';import {LanguageContext} from '../LanguageContext.jsx';
const root=createRoot(document.getElementById('root'));let version=0;
window.__audioRender=(props={})=>{const key=++version;root.render(<div data-audio-version={key}><LanguageContext.Provider value="pt"><SentenceAudio key={key} text="avô" lang="pt-BR" {...props} onPlayed={()=>window.__played=(window.__played||0)+1}/></LanguageContext.Provider></div>);return key;};
window.__audioRender();
