import React from 'react';
import {createRoot} from 'react-dom/client';
import AISpeaking from '../AISpeaking.jsx';
import {setInterfaceLanguage} from '../interface-runtime.mjs';
setInterfaceLanguage('en',{persist:false});
createRoot(document.getElementById('root')).render(<AISpeaking language="en" user={{id:'synthetic-review-owner'}} onBack={()=>{}}/>);
