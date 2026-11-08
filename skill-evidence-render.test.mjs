import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';
import {createServer} from 'vite';
import {languages} from './languages.mjs';
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
 setInterfaceLanguage('en',{persist:false});
 const {AIFeedback,RecordingError,microphoneError}=await vite.ssrLoadModule('/SkillsWorkshop.jsx');
 const {PatternPermissions}=await vite.ssrLoadModule('/PrivacySettings.jsx');
 const rejected=render(React.createElement(RecordingError,{error:microphoneError({name:'NotAllowedError'},'Fallback')}));
 assert.ok(rejected.includes('Microphone access is blocked.'));
 assert.ok(rejected.includes('/help?q=microphone'));
 const permissionRows=render(React.createElement(PatternPermissions,{patterns:languages.map(language=>({language:language.id,enabled:language.id==='it'}))}));
 for(const language of languages)assert.ok(permissionRows.includes(language.name+' · '),language.id);
 assert.ok(permissionRows.includes('Italian · Enabled'));
 const assessment=render(React.createElement(AIFeedback,{submission:{result:{aiAssessment:{evaluationVersion:'skill-evidence-v3',score:null,retryAssessment:true}}}}));
 assert.ok(assessment.indexOf('Update skill assessment')>0);
 assert.ok(assessment.indexOf('Update skill assessment')<assessment.indexOf('Not enough evidence to score'));
 console.log('PASS: six display languages preserve independent skill bands, target-language quotes and unassessed audio; legacy task C1 never becomes a skill band.');
}finally{await vite.close()}
