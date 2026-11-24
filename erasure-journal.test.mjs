import test from 'node:test';import assert from 'node:assert/strict';
import {recordErasureJournal} from './erasure-journal.mjs';
test('journal fails closed when enabled and authenticates only the fixed internal collector',async()=>{
 assert.deepEqual(await recordErasureJournal({}, {env:{}}),{state:'disabled'});
 await assert.rejects(recordErasureJournal({}, {env:{ERASURE_JOURNAL_ENABLED:'true'}}),e=>e.status===503);
 const env={ERASURE_JOURNAL_ENABLED:'true',ERASURE_JOURNAL_TOKEN:'a'.repeat(64)};
 await assert.rejects(recordErasureJournal({}, {env,fetchImpl:async()=>({ok:false})}),e=>e.status===503);
 await assert.rejects(recordErasureJournal({}, {env,fetchImpl:async()=>{throw Error('private provider response')}}),e=>e.status===503&&!e.message.includes('private'));
 let observed;await recordErasureJournal({phase:'prepared'},{env,fetchImpl:async(url,options)=>{observed={url,options};return {ok:true}}});
 assert.equal(observed.url,'http://continuum-operations.railway.internal:8080/journal');assert.equal(observed.options.redirect,'error');assert.equal(observed.options.headers.Authorization,'Bearer '+env.ERASURE_JOURNAL_TOKEN);
});
