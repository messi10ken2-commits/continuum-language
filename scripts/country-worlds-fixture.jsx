import React from 'react';
import {createRoot} from 'react-dom/client';
import LivingMap from '../LivingMap.jsx';
import JourneyVisual from '../JourneyVisual.jsx';
import {JourneyLayoutContext} from '../JourneyLayout.jsx';
const query=new URLSearchParams(location.search),language=query.get('language')||'zh',phase=Math.min(4,Math.max(0,Number(query.get('phase')??4))),section=query.get('section')||'Practice Studio';
function Fixture(){const [completed,setCompleted]=React.useState(phase),controls=React.useRef(null);return <JourneyLayoutContext.Provider value={{layout:'illustrated'}}><button id="advance" onClick={()=>setCompleted(c=>Math.min(4,c+1))}>Advance</button><div style={{position:'relative',width:1080,height:504}}><div ref={controls}><LivingMap controlsTarget={controls} identity={language+':'+phase} language={language} chapters={Array.from({length:completed},()=>({lessons:[1],completed:1}))} width={1080} height={504}/></div></div><JourneyVisual language={language} section={section} title={section}/></JourneyLayoutContext.Provider>}
createRoot(document.getElementById('root')).render(<Fixture/>);
