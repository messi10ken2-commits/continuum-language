// Development-only fixture for the shared illustrated map, with no account writes.
import React from 'react';import {createRoot} from 'react-dom/client';
import IllustratedMap from '../IllustratedMap.jsx';import {JourneyLayoutContext} from '../JourneyLayout.jsx';
import '../styles.css';import '../approved-illustrated.css';import '../illustrated-world.css';import '../journey.css';
const query=new URLSearchParams(location.search),language=query.get('language')||'en',level=query.get('level')||'A1';
localStorage.setItem('continuumCourseLevel'+(language==='es'?'':':'+language),level);
createRoot(document.getElementById('root')).render(<JourneyLayoutContext.Provider value={{layout:'illustrated',setLayout(){}}}><IllustratedMap language={language} attempts={[]} onStart={id=>window.__started=id} adventure={{account:'synthetic-map-layout',companion:'capybara'}}/></JourneyLayoutContext.Provider>);
