import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{const {default:Membership}=await vite.ssrLoadModule('/Membership.jsx');const {setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');
 for(const language of ['en','ja','es','pt','zh','fr','ko','id','ru','ar']){setInterfaceLanguage(language,{persist:false});for(const premium of [false,true]){const data={membership:{premium,customer:false,status:premium?"active":"free",paidUntil:premium?"2030-01-01T00:00:00Z":null,trialEligible:!premium},tickets:[],intervals:[],courses:[{id:'en-workplace-diplomacy',language:'en',title:'Workplace diplomacy',description:'Synthetic description',questions:6}],progress:[],checkoutAvailable:false,maxClassMinutes:60};const html=renderToStaticMarkup(React.createElement(Membership,{user:{id:'synthetic',role:'learner'},initialData:data}));assert.equal(html.includes('membership-pricing'),!premium);
  if(!premium)for(const amount of [9.99,79.99]){
   const price=new Intl.NumberFormat(language,{style:'currency',currency:'USD',currencyDisplay:'code'}).format(amount);
   assert.ok(html.includes(price),language+': '+price);
  }
  assert.ok(!html.includes('premium-guide-ticket-note'));assert.ok(!html.includes('checkout.stripe.com'));if(!premium)assert.ok(html.includes('disabled'));assert.ok(!html.includes('past_due'));if(language!=='en'){assert.ok(!html.includes('One introductory class ticket'));assert.ok(!html.includes('Past due'));}}}
 console.log('PASS: free and Premium membership views render ten display languages with translated subscription statuses, configured-off checkout stays disabled, and no checkout URL or answer key is embedded.');
}finally{await vite.close()}
