import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
test('chapter conversation renders each utterance once and keeps settings out of the main scene for all companions',async()=>{
 const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
 try{
  const {default:Room}=await vite.ssrLoadModule('/ImmersiveConversationRoom.jsx');
  const {setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');setInterfaceLanguage('en',{persist:false});
  const utterance='Which proposal would you support?';
  for(const companion of ['bird','fox','cat','dog','capybara','guinea-pig','quokka','panda']){
   const html=renderToStaticMarkup(React.createElement(Room,{containerRef:{current:null},session:{id:'test',messages:[{role:'assistant',text:utterance}]},current:{title:'A local proposal',goals:[]},language:'en',level:'B2',locale:'en-US',companion,mode:'voice',consent:true,count:0,turnLimit:30,voiceState:'idle'}));
   assert.equal(html.split(utterance).length-1,1);assert.ok(html.includes('/light-town/'+companion+'.webp'));
   assert.ok(!html.includes('immersive-live-caption'));assert.ok(!html.includes('voice-preferences'));
   assert.ok(!html.includes('<canvas'));assert.ok(html.includes('aria-label="Conversation settings"'));
  }
 }finally{await vite.close()}
});
