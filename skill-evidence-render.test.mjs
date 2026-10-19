import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';
import {createServer} from 'vite';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Profile}=await vite.ssrLoadModule('/LevelProfile.jsx');
 const {default:Evidence,PronunciationEvidence}=await vite.ssrLoadModule('/SkillEvidence.jsx');
 const {setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');
 for(const display of ['en','ja','es','pt','zh','fr']){
  setInterfaceLanguage(display,{persist:false});
  const old={status:'ai-reviewed',score:50,method:'openai-writing-rubric-v2'};
  const current={...old,evaluationVersion:'skill-evidence-v3',cefr:{level:'B1',confidence:'low',limitations:'Sample only',evidence:[{quote:'I went home',reason:'Connected account'}]}};
  const profile=result=>render(React.createElement(Profile,{assessment:{at:'2026-10-19',result:{level:'C1',correct:40,total:45,productions:[{task:'en-skills-c1-writing',result}]}}}));
  assert.equal((profile(old).match(/<strong>C1<\/strong>/g)||[]).length,1);
  assert.ok(profile(current).includes('<strong>B1</strong>'));
  const html=render(React.createElement(Evidence,{result:current}));assert.ok(html.includes('B1'));assert.ok(html.includes('I went home'));
  const none=render(React.createElement(PronunciationEvidence,{value:null}));assert.ok(!none.includes('%'));
  if(display!=='en')assert.ok(!html.includes('Independent skill estimate'));
 }
 console.log('PASS: six display languages preserve independent skill bands, target-language quotes and unassessed audio; legacy task C1 never becomes a skill band.');
}finally{await vite.close()}
