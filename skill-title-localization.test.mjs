import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {skillTasks} from './skills-content.mjs';
import {premiumSkillTasks} from './premium-skills.mjs';
import {t,setInterfaceLanguage} from './interface-runtime.mjs';

 test('saved core, lesson, assessment and premium skill headings translate offline in all display languages',()=>{
 const tasks=[...skillTasks,...premiumSkillTasks];
 for(const locale of ['ja','es','pt','zh','fr']){
  setInterfaceLanguage(locale,{persist:false});
  for(const task of tasks){const title=t(task.title,task.language||'es');assert.notEqual(title,task.title,locale+' '+task.id);for(const band of task.title.match(/\b(?:A1|A2|B1|B2|C1)\b/g)||[])assert.ok(title.includes(band));}
  assert.notEqual(t('AI conversation'),'AI conversation');assert.notEqual(t('Vocabulary review'),'Vocabulary review');
 }
 setInterfaceLanguage('ja',{persist:false});assert.equal(t('AI conversation'),'AI会話');assert.equal(t('Vocabulary review'),'語彙の復習');
 setInterfaceLanguage('en',{persist:false});for(const task of tasks)assert.equal(t(task.title,task.language||'es'),task.title);
});

test('skill history and expanded record translate authored headings and react to display-language changes',()=>{
 const source=readFileSync(new URL('./SkillsWorkshop.jsx',import.meta.url),'utf8');
 assert.match(source,/export function SkillRecord[^]*?useInterfaceLanguage\(\)/);
 assert.ok(source.includes("uiText(skillSubmissionTask(s)?.title,skillSubmissionTask(s)?.language||'es')"));
 assert.ok(source.includes("uiText(skillSubmissionTask(selected)?.title,skillSubmissionTask(selected)?.language||'es')"));
 // Learner responses and saved feedback remain original evidence.
 assert.ok(source.includes('{selected.response}'));assert.ok(source.includes('{selected.result.feedback}'));
});

test('Practice Studio renders Japanese menu headings in photography and illustrated layouts',async()=>{
 const React=await import('react'),{renderToStaticMarkup}=await import('react-dom/server'),{createServer}=await import('vite');
 const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
 try{
  const {default:Studio}=await vite.ssrLoadModule('/PracticeStudio.jsx');
  const {JourneyLayoutContext}=await vite.ssrLoadModule('/JourneyLayout.jsx');
  const runtime=await vite.ssrLoadModule('/interface-runtime.mjs');runtime.setInterfaceLanguage('ja',{persist:false});
  for(const layout of ['photo','illustrated']){
   const html=renderToStaticMarkup(React.createElement(JourneyLayoutContext.Provider,{value:{layout,setLayout:()=>{}}},React.createElement(Studio,{language:'ja',user:null})));
   assert.ok(html.includes('<strong>AI会話</strong>'));assert.ok(html.includes(layout==='illustrated'?'<strong>語彙と表現</strong>':'<strong>語彙の復習</strong>'));
   assert.ok(!html.includes('<strong>AI conversation</strong>'));assert.ok(!html.includes('<strong>Vocabulary review</strong>'));
  }
 }finally{await vite.close();}
});
