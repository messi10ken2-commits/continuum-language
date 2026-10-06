import test from 'node:test';
import assert from 'node:assert/strict';
import {beginStroke,moveStroke,endStroke} from './drawing-pad.mjs';
function fixture(){let captured=false;return {pointerId:1,pointerType:'touch',isPrimary:true,clientX:160,clientY:170,preventDefault(){},currentTarget:{getBoundingClientRect:()=>({left:10,top:20,width:300,height:300}),setPointerCapture(){captured=true;},hasPointerCapture:()=>captured,releasePointerCapture(){captured=false;}}};}
test('queued React updates survive cleared events on first and subsequent strokes',()=>{
 let strokes=[];const queued=[];const set=update=>queued.push(update);
 for(let n=0;n<3;n++){
  const event=fixture();beginStroke(event,set);event.clientX=200;moveStroke(event,set);endStroke(event);event.currentTarget=null;
  while(queued.length)strokes=queued.shift()(strokes);
 }
 assert.deepEqual(strokes,Array.from({length:3},()=>['150,150','190,150']));
});
test('touch cancellation, capture failure and secondary touches cannot crash drawing',()=>{
 let count=0;const event=fixture();event.currentTarget.setPointerCapture=()=>{throw Error('inactive pointer');};beginStroke(event,()=>count++);assert.equal(count,0);
 event.isPrimary=false;beginStroke(event,()=>count++);assert.equal(count,0);
 event.currentTarget=null;endStroke(event);moveStroke(event,()=>count++);assert.equal(count,0);
});
