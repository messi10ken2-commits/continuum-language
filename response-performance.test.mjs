import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {handleLocalization} from './localization-api.mjs';
import {audioLookahead} from './audio-lookahead.mjs';

test('translation batches cache reads/writes and preserves duplicate request entries',async()=>{
 const db=new PGlite();
 try{
  await db.exec('CREATE TABLE interface_translations(cache_key text PRIMARY KEY,translated text NOT NULL,created_at timestamptz DEFAULT now())');
  let queries=[],generations=0,output;
  const options={route:'/api/localization',req:{method:'POST'},res:{},
   pool:{query(sql,args){queries.push(sql);return db.query(sql,args);}},
   required:async()=>({id:'test'}),json:async()=>({locale:'ja',items:Array.from({length:16},()=>({text:'Read the complete video transcript'}))}),
   send:(res,status,body)=>{assert.equal(status,200);output=body;},
   fail:(status,message)=>{throw Error(status+': '+message);},limited(){},
   translate:async sources=>{generations++;return sources.map(()=>'動画の全文スクリプトを読む');}};
  await handleLocalization(options);
  assert.equal(queries.length,2,'one read and one atomic write regardless of batch size');
  assert.equal(generations,1);assert.equal(output.translations.length,16);
  queries=[];await handleLocalization(options);
  assert.equal(queries.length,1,'warm batch needs one database round trip');
  assert.equal(generations,1);assert.equal(output.translations.length,16);
  assert.ok(output.translations.every(x=>x.text==='動画の全文スクリプトを読む'));
 }finally{await db.close();}
});

test('audio prepares one segment ahead while preserving order and avoiding duplicate loads',async()=>{
 const calls=[],controller=new AbortController();
 const next=audioLookahead(['first','second','third'],async part=>{calls.push(part);return part;},controller.signal);
 assert.deepEqual(calls,[],'no speculative generation before playback');
 assert.equal(await next(0),'first');
 await Promise.resolve();assert.deepEqual(calls,['first','second']);
 assert.equal(await next(1),'second');
 await Promise.resolve();assert.deepEqual(calls,['first','second','third']);
 assert.equal(await next(2),'third');
 assert.equal(calls.length,3);
});

test('cancelled audio does not start another segment; prefetch errors surface only when consumed',async()=>{
 const controller=new AbortController();let calls=0;
 const next=audioLookahead([1,2,3],async part=>{calls++;if(part===2)throw Error('provider unavailable');return part;},controller.signal);
 assert.equal(await next(0),1);
 await assert.rejects(next(1),/provider unavailable/);
 assert.equal(calls,2);
 controller.abort();await assert.rejects(next(2),{name:'AbortError'});assert.equal(calls,2);
});
