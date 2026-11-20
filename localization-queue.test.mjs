import test from 'node:test';
import assert from 'node:assert/strict';
import {appliedScenarios} from './applied-scenarios.mjs';
import {translationKey} from './localization-corpus.mjs';
test('a rejected translation batch splits once and does not discard unrelated pending text',async()=>{
 const oldFetch=globalThis.fetch,oldStorage=globalThis.localStorage;const requests=[];
 globalThis.localStorage={getItem:()=>null,setItem(){}};
 globalThis.fetch=async(url,init)=>{
  if(url==='/api/interface-language')return {ok:true,json:async()=>({language:'ja'})};
  const {items}=JSON.parse(init.body);requests.push(items);
  if(requests.length===1)return {ok:false,status:503,json:async()=>({error:'Temporarily unavailable'})};
  return {ok:true,status:200,json:async()=>({translations:items.map(item=>({id:translationKey(item.text,item.language),text:'訳文：'+item.text}))})};
 };
 try{
  const runtime=await import('./interface-runtime.mjs?queue-isolation');await runtime.bindInterfaceAccount({id:'test'});
  const rows=Object.values(appliedScenarios).flat().slice(0,10);
  for(const q of rows)runtime.t(q.prompt,q.sourceLesson.startsWith('pt-')?'pt':q.sourceLesson.startsWith('ja-')?'ja':q.sourceLesson.startsWith('en-')?'en':'es');
  for(let i=0;i<50&&runtime.interfaceStatus().running;i++)await new Promise(r=>setTimeout(r,2));
  assert.equal(requests[0].length,10);assert.ok(requests.slice(1).every(items=>items.length<=4));assert.equal(requests.length,4);assert.equal(runtime.interfaceStatus().failed,false);
  for(const q of rows)assert.ok(runtime.t(q.prompt,q.sourceLesson.startsWith('pt-')?'pt':q.sourceLesson.startsWith('ja-')?'ja':q.sourceLesson.startsWith('en-')?'en':'es').startsWith('訳文：'));
 }finally{globalThis.fetch=oldFetch;if(oldStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=oldStorage;}
});
