import test from 'node:test';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {pcmHasSpeechSignal,wavHasSpeechSignal} from './speech-audio-quality.mjs';
import {pcmWav,speechRecipe,speechKey,synthesizeSpeech} from './speech-service.mjs';
import {migrateSpeech,serveStudioSpeech} from './speech-api.mjs';
const tone=Buffer.alloc(9600);for(let i=0;i<tone.length/2;i++)tone.writeInt16LE(Math.round(2000*Math.sin(i/12)),i*2);
test('silence, DC, empty and malformed clips fail signal checks; quiet speech-like PCM stays intact',()=>{
 assert.ok(pcmHasSpeechSignal(tone));assert.ok(wavHasSpeechSignal(pcmWav(tone)));assert.equal(pcmHasSpeechSignal(Buffer.alloc(9600)),false);assert.equal(pcmHasSpeechSignal(Buffer.alloc(9600,12)),false);assert.equal(wavHasSpeechSignal(Buffer.from('bad')),false);assert.equal(wavHasSpeechSignal(pcmWav(tone).subarray(0,100)),false);
});
test('reported isolated words retain their locale and receive a fresh repeated-word recipe',()=>{
 for(const [text,locale] of [['thongs','en-AU'],['trem','pt-BR'],['vení','es-AR']]){assert.equal(speechRecipe(text,locale).input,`${text}. ${text}.`);const old=crypto.createHash('sha256').update(JSON.stringify(['studio-voice-v1',locale,text])).digest('hex');assert.notEqual(speechKey(text,locale),old);}
 assert.equal(speechRecipe('Let’s meet this arvo.','en-AU').input,'Let’s meet this arvo.');assert.equal(speechRecipe('Yes','en-US',{repeatWord:false}).input,'Yes');
});
test('silent generation retries once, falls back and never returns silent success',async()=>{
 let calls=0;const result=await synthesizeSpeech('trem','pt-BR',{env:{OPENAI_API_KEY:'test'},fetchImpl:async()=>new Response(++calls===1?Buffer.alloc(9600):tone)});assert.equal(calls,2);assert.ok(wavHasSpeechSignal(result.audio));
 calls=0;const fallback=await synthesizeSpeech('thongs','en-AU',{env:{OPENAI_API_KEY:'test',GEMINI_API_KEY:'test'},fetchImpl:async url=>{calls++;return url.includes('openai')?new Response(Buffer.alloc(9600)):Response.json({output_audio:{data:tone.toString('base64')}})}});assert.equal(calls,3);assert.equal(fallback.provider,'gemini');
 calls=0;await assert.rejects(()=>synthesizeSpeech('trem','pt-BR',{env:{GEMINI_API_KEY:'test'},fetchImpl:async()=>{calls++;return Response.json({output_audio:{data:Buffer.alloc(9600).toString('base64')}})}}),e=>e.status===503);assert.equal(calls,2);
});
test('regional cache rejects silent hits, coalesces regeneration, replaces the entry and reuses audible bytes',async()=>{
 const db=new PGlite(),pool={query:(sql,args)=>!args&&sql.includes('CREATE TABLE')?db.exec(sql):db.query(sql,args)};try{await migrateSpeech(pool);const key=speechKey('trem','pt-BR');await db.query('INSERT INTO speech_cache(cache_key,audio,provider,model) VALUES($1,$2,\'old\',\'old\')',[key,pcmWav(Buffer.alloc(9600))]);let calls=0;
 const run=async()=>{let code,headers,bytes;await serveStudioSpeech({req:{},res:{writeHead:(s,h)=>{code=s;headers=h},end:b=>bytes=b},pool,text:'trem',locale:'pt-BR',privateAudio:true,validateAudio:true,limited(){},fail:(status,message)=>{throw Object.assign(Error(message),{status})},send(){assert.fail('Expected audible response')},synthesize:async()=>{calls++;await new Promise(r=>setTimeout(r,20));return {audio:pcmWav(tone),provider:'test',model:'audible'}}});assert.equal(code,200);assert.equal(headers['Cache-Control'],'private, no-store');assert.ok(wavHasSpeechSignal(bytes));return headers;};
 await Promise.all([run(),run()]);assert.equal(calls,1);assert.equal((await run())['X-Audio-Cache'],'hit');assert.equal(calls,1);
 }finally{await db.close()}
});
