import test from 'node:test';import assert from 'node:assert/strict';
import {SpeechProviderBackoff} from './speech-provider-backoff.mjs';
test('authentication and quota failures back off; corrected credentials and model changes recover immediately',()=>{
 let now=0;const gate=new SpeechProviderBackoff(()=>now);
 gate.fail('openai','old-key','model',401);assert.equal(gate.remaining('openai','old-key','model'),600);assert.equal(gate.remaining('openai','new-key','model'),0);
 gate.fail('gemini','key','tts',429,42);assert.equal(gate.remaining('gemini','key','tts'),42);assert.equal(gate.remaining('gemini','key','other-model'),0);
 now=42000;assert.equal(gate.remaining('gemini','key','tts'),0);now=600000;assert.equal(gate.remaining('openai','old-key','model'),0);
 gate.fail('openai','key','model',500);assert.equal(gate.remaining('openai','key','model'),0);
});
