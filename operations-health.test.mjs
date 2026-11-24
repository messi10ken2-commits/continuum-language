import test from 'node:test';import assert from 'node:assert/strict';import {createOperationsHealth} from './operations-health.mjs';
const env={ERASURE_JOURNAL_ENABLED:'true',ERASURE_JOURNAL_TOKEN:'a'.repeat(64)},time=Date.parse('2026-11-24T12:00:00Z');
test('safe public summary validates freshness and caches only redacted results',async()=>{
 let calls=0;const check=createOperationsHealth({env,now:()=>time,fetchImpl:async(url,o)=>{calls++;assert.equal(url,'http://continuum-operations.railway.internal:8080/status');assert.equal(o.redirect,'error');return {ok:true,json:async()=>({ok:true,checkedAt:new Date(time).toISOString(),secret:'never public'})}}});
 assert.deepEqual(await check(),{ok:true,checkedAt:new Date(time).toISOString()});await check();assert.equal(calls,1);
 for(const ago of [46*60000,-6*60000])assert.deepEqual(await createOperationsHealth({env,now:()=>time,fetchImpl:async()=>({ok:true,json:async()=>({ok:true,checkedAt:new Date(time-ago).toISOString()})})})(),{ok:false,checkedAt:null});
});
test('unconfigured, failed and unreachable collector report unavailable without exceptions',async()=>{
 assert.deepEqual(await createOperationsHealth({env:{}})(),{ok:false,checkedAt:null});
 assert.deepEqual(await createOperationsHealth({env,fetchImpl:async()=>{throw Error('secret')}})(),{ok:false,checkedAt:null});
 assert.deepEqual(await createOperationsHealth({env,fetchImpl:async()=>({ok:false})})(),{ok:false,checkedAt:null});
});
