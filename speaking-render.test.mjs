import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
globalThis.localStorage={getItem:()=>null,setItem(){}};
try{
 const {default:AISpeaking,ConversationReview,SpeakingEntry}=await vite.ssrLoadModule('/AISpeaking.jsx');
 const {setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');
 for(const display of ['en','ja','es','pt','zh','fr']){
  setInterfaceLanguage(display,{persist:false});
  for(const language of ['en','ja','es','pt']){
   const html=renderToStaticMarkup(React.createElement(AISpeaking,{language,user:{id:'synthetic-user'},onBack(){}}));
   assert.equal((html.match(/aria-pressed="(?:true|false)"/g)||[]).length,6);
   assert.ok(html.includes('speaking-consent'));
   if(display!=='en')assert.ok(!html.includes('Order at a café'));
  }
  const html=renderToStaticMarkup(React.createElement(ConversationReview,{locale:'pt-BR',session:{review:{summary:'Feedback text',strengths:['Clear request'],corrections:[{original:'Eu quero café',improved:'Eu gostaria de um café',explanation:'A polite option'}],goals:[{goal:'Order a drink and something to eat.',achieved:true,evidence:'Eu quero café'}],nextStep:'Try again'}}}));
  assert.ok(html.includes('Eu gostaria de um café'));assert.ok(html.includes('lang="pt-BR"'));assert.ok(html.includes('A polite option'));
  assert.ok(renderToStaticMarkup(React.createElement(SpeakingEntry,{onOpen(){}})).includes('speaking-entry'));
 }
 console.log('PASS: speaking setup renders all 24 learning/display language combinations; review examples retain target language; no scenario title translation gaps.');
}finally{delete globalThis.localStorage;await vite.close()}
