import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {handleLocalization} from './localization-api.mjs';
import {translationSource,protectSource,translationKey} from './localization-corpus.mjs';
import {reviewedTranslation} from './reviewed-interface-copy.mjs';
import {interfaceCopy} from './interface-copy.mjs';
import uiSources from './interface-sources.json' with {type:'json'};
test('overlapping reordered batches share provider work per public translation',async()=>{
 const db=new PGlite();let calls=0,release,started;
 const gate=new Promise(resolve=>{release=resolve;}),ready=new Promise(resolve=>{started=resolve;});
 const texts=uiSources.filter(text=>{const s=translationSource(text);return s&&!protectSource(s).values.length&&!reviewedTranslation(text,'ja')&&!interfaceCopy[text]?.ja;}).slice(0,2);assert.equal(texts.length,2);
 try{
  await db.exec('CREATE TABLE interface_translations(cache_key text PRIMARY KEY,translated text NOT NULL,created_at timestamptz DEFAULT now())');
  const call=async entries=>{let output;await handleLocalization({route:'/api/localization',req:{method:'POST'},res:{},pool:{query:(sql,args)=>db.query(sql,args)},required:async()=>({id:'test'}),json:async()=>({locale:'ja',items:entries.map(text=>({text}))}),send:(res,status,data)=>{assert.equal(status,200);output=data;},fail:(status,message)=>{throw Error(status+': '+message);},limited(){},translate:async sources=>{calls++;started();await gate;return sources.map(s=>'確認訳 '+s.text);}});return output;};
  const first=call(texts);await ready;
  const second=call([...texts].reverse());await new Promise(r=>setTimeout(r,40));
  release();const responses=await Promise.all([first,second]);assert.equal(calls,1,'same entries must not invoke another provider batch merely because order differs');
  for(const response of responses){const byId=new Map(response.translations.map(x=>[x.id,x.text]));for(const text of texts)assert.equal(byId.get(translationKey(text)),'確認訳 '+text);}
 }finally{release();await db.close();}
});
