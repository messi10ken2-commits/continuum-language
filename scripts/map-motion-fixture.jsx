// Development-only browser fixture. Not a production entry point.
import React from 'react';import {createRoot} from 'react-dom/client';import LivingMap from '../LivingMap.jsx';
const query=new URLSearchParams(location.search),language=query.get('language')||'en';
createRoot(document.getElementById('root')).render(<LivingMap language={language} width={1920} height={896} chapters={Array.from({length:4},()=>({lessons:[1],completed:1}))}/>);
