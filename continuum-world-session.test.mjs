import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorldSession} from './continuum-world-session.mjs';
import {neonEnvelope,updateTokyoNeon} from './continuum-world-tokyo-atmosphere.mjs';
import {restoreWorldState} from './continuum-world-model.mjs';

test('scene changes share one renderer; quality changes replace it and closing releases it once',()=>{
 let created=0,disposed=0,lost=0,contextLost=false;const options=[];
 const session=createWorldSession({makeRenderer:config=>{created++;options.push(config);return {getContext:()=>({isContextLost:()=>contextLost}),dispose(){disposed++;},forceContextLoss(){lost++;},domElement:{parentElement:null,remove(){this.parentElement=null;}}};}});
 const a={append(c){c.parentElement=this;}},b={append(c){c.parentElement=this;}};
 const renderer=session.renderer(a,'auto');assert.equal(session.renderer(b,'auto'),renderer);assert.equal(created,1);assert.equal(renderer.domElement.parentElement,b);
 let retired=0;session.retire({dispose(){retired++;}});assert.equal(retired,0);
 session.renderer(b,'low');assert.equal(retired,1);assert.equal(created,2);assert.equal(disposed,1);assert.equal(lost,1);assert.equal(options[1].antialias,false);
 contextLost=true;session.renderer(b,'low');contextLost=false;assert.equal(created,3);
 session.dispose();session.dispose();assert.equal(disposed,3);assert.equal(lost,3);assert.throws(()=>session.renderer(a,'auto'),/closed/);
});
test('neon accents fluctuate gently at night while daylight, windows and reduced motion remain steady',()=>{
 const accent={emissiveIntensity:0,userData:{tokyoNight:{day:.1,night:2.6},tokyoFlicker:2.7}};
 const window={emissiveIntensity:1.05,userData:{tokyoNight:{day:0,night:1.05}}};
 let previous=neonEnvelope(0),variation=0;
 for(let i=1;i<19*120;i++){const v=neonEnvelope(i/120);assert.ok(v>.73&&v<1.03);assert.ok(Math.abs(v-previous)<.025);variation=Math.max(variation,Math.abs(v-1));previous=v;}
 assert.ok(variation>.20);
 updateTokyoNeon([accent,window],12.4,true);assert.notEqual(accent.emissiveIntensity,2.6);assert.equal(window.emissiveIntensity,1.05);
 updateTokyoNeon([accent],12.4,true,true);assert.equal(accent.emissiveIntensity,2.6);
 updateTokyoNeon([accent],12.4,false);assert.equal(accent.emissiveIntensity,.1);
});
test('background music defaults on while saved music mute and zero volume are retained',()=>{
 assert.equal(restoreWorldState().music,true);assert.equal(restoreWorldState({music:false}).music,false);assert.equal(restoreWorldState({volume:0}).volume,0);
});
