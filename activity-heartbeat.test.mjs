import test from 'node:test';
import assert from 'node:assert/strict';
import {createConversationPulse,createStudyPulseGate} from './activity-heartbeat.mjs';
import {conversationPracticeActive} from './conversation-activity.mjs';

test('voice transitions preserve active time without restarting timers or sending duplicate stop/start writes',async()=>{
 const requests=[],timers=[];let cancelled=0;
 const pulse=createConversationPulse({send:async active=>{requests.push(active);return {budget:{}};},every:fn=>{timers.push(fn);return 1;},cancel:()=>cancelled++});
 const states=['idle','connecting','preparing','speaking','listening','thinking','preparing','speaking','listening','paused'];
 for(const voiceState of states)await pulse.update(conversationPracticeActive({visible:true,busy:false,error:'',mode:'voice',voiceState}));
 await pulse.stop();
 assert.deepEqual(requests,[false,true,false,true,false]);
 assert.equal(timers.length,1);assert.equal(cancelled,1);
 console.log('MEASURED voice-state trace: 20 previous writes -> '+requests.length+' writes; one timer per session');
});
test('active practice retains ten-second ticks; idle and hidden periods stop recurring writes',async()=>{
 let tick;const requests=[];
 const pulse=createConversationPulse({send:async active=>{requests.push(active);},every:fn=>{tick=fn;},cancel:()=>{}});
 await pulse.update(true);tick();await pulse.update(true);tick();await pulse.update(true);
 assert.deepEqual(requests,[true,true,true]);
 await pulse.update(false);for(let i=0;i<60;i++)tick();await pulse.update(false);
 assert.deepEqual(requests,[true,true,true,false]);await pulse.stop();
});
test('slow requests stay ordered and final stop cannot be overwritten by a late active write',async()=>{
 const requests=[],budgets=[];let release;
 const pulse=createConversationPulse({send:(active,final)=>{requests.push({active,final});return active?new Promise(r=>release=r):Promise.resolve({budget:{usedSeconds:10}});},onBudget:d=>budgets.push(d),every:()=>1,cancel:()=>{}});
 const first=pulse.update(true);await Promise.resolve();await Promise.resolve();
 const stop=pulse.stop();assert.equal(requests.length,1,'stop queues behind the existing request');
 release({budget:{usedSeconds:9}});await first;await stop;
 assert.deepEqual(requests,[{active:true,final:false},{active:false,final:true}]);
 assert.deepEqual(budgets,[],'closed sessions ignore pending budget callbacks');
});
test('failed presence writes retry on the next active tick without a retry loop',async()=>{
 let tick,calls=0;const pulse=createConversationPulse({send:async()=>{if(++calls===1)throw Error('offline');},every:fn=>{tick=fn;},cancel:()=>{}});
 await pulse.update(true);assert.equal(calls,1);tick();await pulse.update(true);assert.equal(calls,2);await pulse.stop();
});
test('study presence retains daily attendance, all active ticks, final pause and failure recovery',()=>{
 const gate=createStudyPulseGate();let idleWrites=0;
 for(let i=0;i<61;i++)idleWrites+=Number(gate.shouldSend(false,'day-1'));
 assert.equal(idleWrites,1);
 assert.equal(gate.shouldSend(false,'day-2'),true);
 for(let i=0;i<61;i++)assert.equal(gate.shouldSend(true,'day-2'),true);
 assert.equal(gate.shouldSend(false,'day-2'),true);assert.equal(gate.shouldSend(false,'day-2'),false);
 gate.retry();assert.equal(gate.shouldSend(false,'day-2'),true);
 console.log('MEASURED ten idle minutes: 61 previous study writes -> '+idleWrites+' write; active ticks unchanged');
});
