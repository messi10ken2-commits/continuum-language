import assert from 'node:assert/strict';
import {test} from 'node:test';
import {makeImmersiveLoader} from './immersive/loader-cache.mjs';
import {units} from './immersive/en.mjs';
test('concurrent native requests share one module load and retain the full pack',async()=>{
 let count=0;const loader=makeImmersiveLoader({en:async()=>{count++;return {units}}});
 const [a,b]=await Promise.all([loader.loadUnit('en','market'),loader.loadUnit('en','library')]);
 assert.equal(a,units.market);assert.equal(b,units.library);assert.equal(count,1);
 await assert.rejects(loader.loadUnit('__proto__','market'),/Unknown/);
 await assert.rejects(loader.loadUnit('en','toString'),/Unknown/);
});
test('explicit browser retry recovers a cached failed import through canonical JSON, then reuses it for other chapters',async()=>{
 let imports=0,requests=0;
 const loader=makeImmersiveLoader({en:async()=>{imports++;throw Error('cached module fetch failure')}},{browser:true,fetchImpl:async(url,options)=>{requests++;assert.equal(url,'/api/immersive/content/en');assert.equal(options.credentials,'omit');return Response.json({units})}});
 await assert.rejects(loader.loadUnit('en','market'),/cached module/);assert.equal(requests,0,'failure alone must not initiate background retries');
 const [a,b]=await Promise.all([loader.loadUnit('en','market',{retry:true}),loader.loadUnit('en','library',{retry:true})]);
 assert.deepEqual(a,units.market);assert.deepEqual(b,units.library);assert.equal(requests,1);assert.equal(imports,1);
 await loader.loadUnit('en','heat');assert.equal(requests,1);
});
test('failed content recovery can be retried without caching an error or accepting incomplete material',async()=>{
 let requests=0;const loader=makeImmersiveLoader({en:async()=>{throw Error('offline import')}},{browser:true,fetchImpl:async()=>{requests++;return requests===1?new Response('{}',{status:503}):requests===2?Response.json({units:{market:units.market}}):Response.json({units})}});
 await assert.rejects(loader.loadUnit('en','market'));
 await assert.rejects(loader.loadUnit('en','market',{retry:true}),/unavailable/);
 await assert.rejects(loader.loadUnit('en','market',{retry:true}),/Incomplete/);
 assert.deepEqual(await loader.loadUnit('en','market',{retry:true}),units.market);assert.equal(requests,3);
});
test('server source loading never falls back to HTTP, including on retry',async()=>{
 let loads=0;const loader=makeImmersiveLoader({en:async()=>{if(++loads===1)throw Error('temporary import error');return {units}}},{fetchImpl:()=>assert.fail('Server must not fetch its own public endpoint')});
 await assert.rejects(loader.loadPack('en'));assert.equal(await loader.loadUnit('en','market',{retry:true}),units.market);
});
