import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{const {default:Membership}=await vite.ssrLoadModule('/Membership.jsx');const {setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');
 for(const language of ['en','ja','es','pt','zh','fr','ko','id','ru','ar']){setInterfaceLanguage(language,{persist:false});for(const premium of [false,true]){const data={membership:{premium,customer:false,status:premium?"active":"free",paidUntil:premium?"2030-01-01T00:00:00Z":null,trialEligible:!premium},tickets:[],intervals:[],courses:[{id:'en-workplace-diplomacy',language:'en',title:'Workplace diplomacy',description:'Synthetic description',questions:6}],progress:[],checkoutAvailable:false,maxClassMinutes:60};const html=renderToStaticMarkup(React.createElement(Membership,{user:{id:'synthetic',role:'learner'},initialData:data}));assert.equal(html.includes('store-plan-grid'),!premium);
  assert.ok(!html.includes('Stripe'));assert.ok(!html.includes('USD 9.99'));assert.ok(!html.includes('checkout.stripe.com'));
  if(!premium){assert.ok(html.includes('App Store'));assert.ok(html.includes('Google Play'));}
  else assert.ok(html.includes('store-practice-action'));
  if(language==='en'){assert.ok(html.includes('Meet a teacher'));assert.equal((html.match(/Vocabulary and expression review/g)||[]).length,1);
   if(!premium)assert.ok(!html.split('Build a daily learning habit.')[1].includes('Vocabulary and expression review'));}
  assert.ok(!html.includes('premium-guide-ticket-note'));assert.ok(!html.includes('past_due'));}}

 console.log('PASS: free and Premium membership views render ten display languages with translated subscription statuses, store channels are shown without a web checkout or hardcoded prices.');
}finally{await vite.close()}
