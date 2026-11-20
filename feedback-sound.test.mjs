import assert from 'node:assert/strict';
import test from 'node:test';
import {playCorrectSound,playRewardSound,prepareFeedbackSound,saveFeedbackSound} from './feedback-sound.mjs';

test('tap unlocks a suspended audio context before a result and reward cue',async()=>{
 const notes=[];
 let context,resumes=0,preference;
 const param={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};
 globalThis.localStorage={getItem:()=>preference,setItem:(_key,value)=>{preference=value}};
 globalThis.webkitAudioContext=class {
  state='suspended';
  currentTime=4;
  constructor(){context=this}
  async resume(){resumes++;this.state='running'}
  createOscillator(){return {frequency:param,connect(){},disconnect(){},start(at){notes.push(at)},stop(){}}}
  createGain(){return {gain:param,connect(){},disconnect(){}}}
 };
 try{
  prepareFeedbackSound({retry:true});
  assert.equal(resumes,1);
  await playCorrectSound();
  assert.equal(notes.length,4);
  assert.ok(notes.every(at=>at>context.currentTime));
  context.state='interrupted';
  prepareFeedbackSound({retry:true});
  await playRewardSound();
  assert.equal(resumes,2);
  assert.equal(notes.length,11);
  saveFeedbackSound(false);
  await playCorrectSound();
  await playRewardSound();
  assert.equal(notes.length,11);
 }finally{
  delete globalThis.localStorage;
  delete globalThis.webkitAudioContext;
 }
});
