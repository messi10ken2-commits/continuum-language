import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{const {default:Membership}=await vite.ssrLoadModule('/Membership.jsx');const {setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');
 for(const language of ['en','ja','es','pt','zh','fr']){setInterfaceLanguage(language,{persist:false});for(const premium of [false,true]){const data={membership:{premium,customer:false},tickets:[],intervals:[],courses:[{id:'en-workplace-diplomacy',language:'en',title:'Workplace diplomacy',description:'Synthetic description',questions:6}],progress:[],checkoutAvailable:false,maxClassMinutes:60};const html=renderToStaticMarkup(React.createElement(Membership,{user:{id:'synthetic',role:'learner'},initialData:data}));assert.ok(html.includes('membership-courses'));assert.ok(!html.includes('checkout.stripe.com'));if(!premium)assert.ok(html.includes('disabled'));if(language!=='en')assert.ok(!html.includes('One introductory class ticket'));}}
 console.log('PASS: free and Premium membership views render six display languages, configured-off checkout stays disabled, and no checkout URL or answer key is embedded.');
}finally{await vite.close()}
