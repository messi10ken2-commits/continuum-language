import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Studio}=await vite.ssrLoadModule('/PracticeStudio.jsx'),{default:Guide}=await vite.ssrLoadModule('/PremiumGuide.jsx'),{setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');
 for(const display of ['en','ja','es','pt','zh','fr']){setInterfaceLanguage(display,{persist:false});const html=renderToStaticMarkup(React.createElement(Studio,{user:{id:'fixture'},language:'pt',onSpeaking(){},onAccount(){}}));assert.equal((html.match(/aria-pressed=/g)||[]).length,6);assert.ok(html.includes('/membership/premium-flow-v1.webp'));if(display!=='en'){assert.ok(!html.includes('Turn your next real-life moment into progress.'));assert.ok(!html.includes('Choose how to put your language into practice.'));}const guide=renderToStaticMarkup(React.createElement(Guide,{user:{id:'fixture'},premium:true}));assert.equal((guide.match(/<article\b/g)||[]).length,7);assert.ok(!guide.includes('checkout.stripe.com'));}
 const {default:Membership}=await vite.ssrLoadModule('/Membership.jsx');
 const {premiumCourseSummary}=await import('./premium-courses.mjs');
 setInterfaceLanguage('en',{persist:false});
 const courses=premiumCourseSummary.filter(course=>course.language==='pt');
 const initialData={membership:{premium:false},intervals:[],tickets:[],courses};
 const account=renderToStaticMarkup(React.createElement(Membership,{user:{id:'fixture',role:'learner'},language:'pt',initialData}));
 assert.match(account,/Regular lessons and Learning Memory/);
 assert.match(account,/Exclusive courses/);
 assert.match(account,/No Continuum ads\. YouTube may still show its own ads\./);
 assert.match(account,/One introductory class ticket/);
 assert.match(account,/Store purchases are in preparation/);
 assert.match(account,/App Store/);
 assert.match(account,/Google Play/);
 assert.doesNotMatch(account,/membership-courses|Everyday negotiation in Portuguese|data-checkout/);
 console.log('PASS: Studio navigation and visual Premium guide render in all six display languages without fake checkout or untranslated headings.');
}finally{await vite.close()}
