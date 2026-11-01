import React from 'react';
import {createRoot} from 'react-dom/client';
import LivingMap from '../LivingMap.jsx';
import JourneyVisual from '../JourneyVisual.jsx';
import {JourneyLayoutContext} from '../JourneyLayout.jsx';
const language=new URLSearchParams(location.search).get('language')||'zh';
createRoot(document.getElementById('root')).render(<JourneyLayoutContext.Provider value={{layout:'illustrated'}}><div style={{position:'relative',width:1080,height:504}}><LivingMap language={language} chapters={Array.from({length:4},()=>({lessons:[1],completed:1}))} width={1080} height={504}/></div><JourneyVisual language={language} section="Practice Studio" title="Practice Studio"/></JourneyLayoutContext.Provider>);
