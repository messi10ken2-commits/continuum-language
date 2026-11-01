import test from 'node:test';import assert from 'node:assert/strict';
import {speakingRequest} from './speaking-request.mjs';
test('review timeout releases the request with a recoverable error instead of an endless busy state',async()=>{
 await assert.rejects(speakingRequest('/saved/review',{refreshScores:true},undefined,{timeoutMs:10,fetchImpl:async(url,options)=>new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true}))}),e=>e.status===504&&/conversation is saved/.test(e.message));
});
test('caller cancellation is preserved and a successful request does not time out later',async()=>{
 const abort=new AbortController();abort.abort();await assert.rejects(speakingRequest('/saved',null,abort.signal,{fetchImpl:async(url,options)=>{assert.equal(options.signal.aborted,true);throw new DOMException('Aborted','AbortError')}}),e=>e.name==='AbortError');
 const result=await speakingRequest('/saved/review',{refreshScores:true},undefined,{timeoutMs:20,fetchImpl:async()=>Response.json({session:{review:{communicationScore:75}}})});assert.equal(result.session.review.communicationScore,75);
});
