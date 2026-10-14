import test from 'node:test';
import assert from 'node:assert/strict';
import {translationKey} from './localization-corpus.mjs';

test('late translation failure cannot poison a new account translation queue',async()=>{
 const previousFetch=globalThis.fetch,previousStorage=globalThis.localStorage;
 let rejectOld,resolveNew;const requests=[];
 globalThis.localStorage={getItem:()=>null,setItem(){}};
 globalThis.fetch=async(path,options)=>{
  if(path==='/api/interface-language')return Response.json({language:'ja'});
  const body=JSON.parse(options.body);requests.push(body);
  if(requests.length===1)return new Promise((resolve,reject)=>{rejectOld=reject;});
  return new Promise(resolve=>{resolveNew=resolve;});
 };
 const wait=async condition=>{for(let i=0;i<100;i++){if(condition())return;await new Promise(r=>setTimeout(r,5));}throw Error('translation request not made');};
 try{
  const runtime=await import('./interface-runtime.mjs?qa-session-race');
  await runtime.bindInterfaceAccount({id:'account-a'});
  runtime.t('Read the complete video transcript');await wait(()=>rejectOld);
  await runtime.bindInterfaceAccount(null);
  await runtime.bindInterfaceAccount({id:'account-b'});
  const source='This device has no speech playback.';
  runtime.t(source);
  rejectOld(Error('old account request failed'));
  await wait(()=>resolveNew);
  assert.equal(runtime.interfaceStatus().failed,false);
  resolveNew(Response.json({translations:[{id:translationKey(source),text:'この端末では音声を再生できません。'}]}));
  await wait(()=>!runtime.interfaceStatus().running);
  assert.equal(runtime.t(source),'この端末では音声を再生できません。');
  assert.equal(runtime.interfaceStatus().failed,false);
 }finally{globalThis.fetch=previousFetch;if(previousStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=previousStorage;}
});
