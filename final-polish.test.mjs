import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {createServer} from 'vite';
import {auditDisplayCoverage} from './scripts/audit-display-coverage.mjs';import {translationSource} from './localization-corpus.mjs';
import planningSources from './planning-interface-sources.json' with {type:'json'};import {planningCopy} from './planning-copy.mjs';
import {t,tf,setInterfaceLanguage} from './interface-runtime.mjs';import {buildLessonSuggestion,suggestionDraft} from './lesson-suggestions.mjs';
test('audit detects raw conditional/optional labels while preserving examples and excluded Admin copy',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'continuum-conditional-'));
 try{fs.writeFileSync(path.join(dir,'Fixture.jsx'),`function View(){return <><button>{busy?'Saving…':'Save answer & continue'}</button><p>{ready&&'Response saved'}</p><p lang="en">{flag?'Keep this model':'Native answer'}</p></>} function ReviewItem(){return <p>{value||'None'}</p>}`);const a=auditDisplayCoverage(dir);assert.deepEqual(new Set(a.raw.map(x=>x.source)),new Set(['Saving…','Save answer & continue','Response saved']));}finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test('all planning templates are registered and translated labels preserve private values locally',()=>{
 for(const source of planningSources)assert.ok(translationSource(source),source);
 for(const locale of ['ja','es','pt','zh','fr','ko','id','ru','ar']){setInterfaceLanguage(locale,{persist:false});for(const source of ['Rebuild','Use independently','2 min · Retrieve without hints','4 min · Guided practice','Start with a short learning check'])assert.notEqual(t(source),source,locale+source);const marker='PRIVATE_FOCUS_123';const title=tf('Explore the saved observation: {0}',[marker]);assert.ok(title.includes(marker));assert.ok(!title.includes('Explore the saved observation'));}
 setInterfaceLanguage('en',{persist:false});
 const privateNote='PRIVATE_CLASS_NOTE_123',privateFocus='PRIVATE_TOPIC_123',calls=[];
 const plan=buildLessonSuggestion({language:'es',notes:[{focus:privateFocus,note:privateNote,language:'es',at:'2026-11-02T10:00:00Z'}],text:(v)=>{if(v)calls.push(v);return v},format:(s,v)=>s.replace(/\{(\d+)\}/g,(_,i)=>v[i])});assert.equal(plan.saved.note,privateNote);assert.ok(!calls.includes(privateNote)&&!calls.includes(privateFocus));assert.ok(suggestionDraft(plan).startsWith('Class plan (proposed'));
});
test('all display languages render localized proficiency labels and preserve actual assessed values',async()=>{
 const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{const {default:Profile}=await vite.ssrLoadModule('/LevelProfile.jsx');const runtime=await vite.ssrLoadModule('/interface-runtime.mjs');const render=()=>renderToStaticMarkup(React.createElement(Profile,{assessment:{at:'2026-11-02',result:{language:'es',level:'B1',correct:31,total:45,skills:[{name:'Reading',level:'B1',correct:5,total:9}],bands:[]}}}));
 for(const locale of ['ja','es','pt','zh','fr','ko','id','ru','ar']){runtime.setInterfaceLanguage(locale,{persist:false});const html=render();assert.ok(!html.includes('>Reading<'),locale);assert.ok(!html.includes('>Diagnostic questions<'),locale);assert.ok(!html.includes('Understand written {0}'),locale);assert.ok(!html.includes('Understand written Spanish'),locale);assert.ok(html.includes('31/45')&&html.includes('B1'),locale);assert.ok(!html.includes('aria-label="Reading evidence"'),locale);}
 runtime.setInterfaceLanguage('en',{persist:false});
 }finally{await vite.close()}
});
