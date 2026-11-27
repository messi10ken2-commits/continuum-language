import test from 'node:test';import assert from'node:assert/strict';
import{worldMissions,worldScenario,availableWorldMissions,worldGoalEvidence,worldDay}from'./continuum-world-missions.mjs';
import{worldImmersiveCopy}from'./continuum-world-immersive-copy.mjs';
import{worldPhase2Copy}from'./continuum-world-phase2-copy.mjs';import{requestConversation}from'./conversation-provider.mjs';
test('Tokyo has authored main/side/daily goals and progressive missions without locking free exploration',()=>{
 assert.equal(worldMissions.filter(m=>m.type==='main').length,10);assert.equal(worldMissions.filter(m=>m.type==='side').length,14);assert.equal(worldMissions.filter(m=>m.type==='daily').length,10);assert.equal(new Set(worldMissions.map(m=>m.id)).size,34);
 for(const m of worldMissions){const s=worldScenario('world-'+m.id);assert.equal(s.goals.length,3);assert.equal(s.worldLocation,m.location);assert.ok(s.opening.ja);}
 const a=availableWorldMissions([], '2026-11-27');assert.ok(a.find(m=>m.id==='shop-buy').locked);assert.equal(availableWorldMissions([{mission_id:'cafe-order',day:'once'}]).find(m=>m.id==='shop-buy').locked,false);
 assert.notDeepEqual(a.filter(m=>m.type==='daily').map(m=>m.id),availableWorldMissions([],'2026-11-28').filter(m=>m.type==='daily').map(m=>m.id));
 assert.equal(worldDay(Date.parse('2026-11-27T16:00:00Z')),'2026-11-28');
});
test('mission evidence rejects invented quotes, unassessed claims and assistant words',()=>{
 const messages=[{role:'user',text:'ここに座ってもいいですか。'},{role:'assistant',text:'いいですよ。'}];
 const goals=worldGoalEvidence({goals:[{achieved:true,evidence:'ここに座ってもいいですか。'},{achieved:true,evidence:'いいですよ。'},{achieved:true,assessed:false,evidence:'ここに座ってもいいですか。'}]},messages);
 assert.deepEqual(goals.map(g=>g.achieved),[true,false,false]);
});
test('World consent, deletion and conversation controls have offline display-language copy',()=>{
 for(const [source,copy]of Object.entries({...worldPhase2Copy,...worldImmersiveCopy}))for(const l of ['ja','es','pt','zh','fr','ko','id','ru','ar'])assert.ok(copy[l]?.trim(),source+' '+l);
});
test('cancelled World conversation does not fall through to another paid provider',async()=>{
 const c=new AbortController();let calls=0;
 await assert.rejects(requestConversation('fixture','fixture',{env:{OPENAI_API_KEY:'synthetic-a',GEMINI_API_KEY:'synthetic-b'},signal:c.signal,fetchImpl:async(_,o)=>{calls++;c.abort(new DOMException('Closed','AbortError'));o.signal.throwIfAborted();}}),{name:'AbortError'});assert.equal(calls,1);
});
