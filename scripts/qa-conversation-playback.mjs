// Real media playback of optional locally captured, public curriculum recordings.
// No credentials, production accounts, or provider calls are used by this script.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'vite';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const vite=await createServer({server:{host:'127.0.0.1',port:0,watch:null}});await vite.listen();
const origin='http://127.0.0.1:'+vite.httpServer.address().port;
try{for(const name of (process.env.QA_BROWSERS||'chromium').split(',')){
 const browser=await ({chromium,webkit}[name]).launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
 try{
  const page=await browser.newPage();
  await page.route('**/qa-live/*.wav',async route=>{const lang=new URL(route.request().url()).pathname.split('/').at(-1);let bytes=await readFile(resolve(process.env.QA_AUDIO_DIR||'.media-build/live-audio',lang==='en-long.wav'?'en.wav':lang));if(lang==='en-long.wav'){const pcm=Buffer.concat(Array.from({length:3},()=>bytes.subarray(44)));bytes=Buffer.concat([Buffer.from(bytes.subarray(0,44)),pcm]);bytes.writeUInt32LE(bytes.length-8,4);bytes.writeUInt32LE(pcm.length,40);}await route.fulfill({contentType:'audio/wav',body:bytes})});
  await page.goto(origin);
  for(const language of ['en','es','pt','ja','en-long']){
   await page.evaluate(language=>{
    document.body.innerHTML='<button id="qa-play">Play</button>';window.__playback=null;
    document.getElementById('qa-play').onclick=async()=>{
     try{const {ConversationVoiceLoop}=await import('/conversation-voice.mjs');
      const states=[],loop=new ConversationVoiceLoop({onState:s=>states.push(s)});loop.active=true;loop.epoch=1;loop.context=new (window.AudioContext||window.webkitAudioContext)();await loop.context.resume();loop.player=new Audio();
      const started=performance.now();let duration=0,endedAt=0;const original=loop.playMedia.bind(loop);loop.playMedia=async(bytes,epoch,expected)=>{duration=expected;await original(bytes,epoch,expected);endedAt=performance.now();};
      await loop.speak('/qa-live/'+language+'.wav',1);loop.stop();window.__playback={states,duration,elapsed:(endedAt-started)/1000};
     }catch(e){window.__playback={error:e.message}}
    };
   },language);
   await page.locator('#qa-play').click();await page.waitForFunction(()=>window.__playback,{timeout:45000});
   const result=await page.evaluate(()=>window.__playback);assert.ok(!result.error,JSON.stringify(result));assert.ok(result.states.includes('speaking'));assert.ok(result.duration>1);assert.ok(result.elapsed>=result.duration-.3,JSON.stringify(result));
   console.log(`PASS ${name} ${language}: decoded ${result.duration.toFixed(2)}s; media ended after ${result.elapsed.toFixed(2)}s; no premature completion`);
  }
 }finally{await browser.close()}
}}finally{await vite.close()}
