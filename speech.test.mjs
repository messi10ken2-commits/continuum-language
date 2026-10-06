import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {speechRecipe,pcmWav,synthesizeSpeech,speechKey} from './speech-service.mjs';
import {allowedSpeech,migrateSpeech,handleSpeech} from './speech-api.mjs';
const pcm=Buffer.alloc(4800);for(let i=0;i<pcm.length;i+=2)pcm.writeInt16LE(Math.round(2000*Math.sin(i/15)),i);
test('isolated kana are repeated without stretching or changing morae; context readings are explicit',()=>{
 for(const kana of ['あ','へ','る','ん','を','ちゃ','ちょ','ぎゃ','じゃ','チャ']){const r=speechRecipe(kana,'ja-JP');assert.equal(r.input,`${kana}。 ${kana}。`);assert.ok(r.character);assert.match(r.instructions,/0.7/);}
 assert.match(speechRecipe('へ','ja-JP').instructions,/助詞のエではなく、ヘ/);
 assert.match(speechRecipe('を','ja-JP').instructions,/オと/);
 assert.match(speechRecipe('ん','ja-JP').instructions,/母音を足/);
 assert.equal(speechRecipe('こうこう','ja-JP').input,'こうこう');
 assert.equal(speechRecipe('pão','pt-BR').input,'pão');assert.match(speechRecipe('pão','pt-BR').instructions,/brasileiro/);
 assert.match(speechRecipe('perro','es-ES').instructions,/vibrante múltiple/);
 assert.notEqual(speechKey('pão','pt-BR'),speechKey('pao','pt-BR'));
});
test('public catalog allows all reported samples and rejects arbitrary/private text',()=>{
 for(const text of ['あ','へ','る','ん','を','ちゃ','ちょ','ぎゃ','じゃ'])assert.ok(allowedSpeech(text,'ja-JP'));
 for(const text of ['pão','mão','avó','avô'])assert.ok(allowedSpeech(text,'pt-BR'));
 for(const text of ['perro','caro','carro','papá'])assert.ok(allowedSpeech(text,'es-ES'));
 assert.equal(allowedSpeech('Private note: arbitrary learner text 93848','en-US'),false);assert.equal(allowedSpeech('pão','xx'),false);
});
test('PCM retains every sample and has safe leading/trailing silence',()=>{
 const wav=pcmWav(pcm);assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.readUInt32LE(24),24000);assert.deepEqual(wav.subarray(44+8640,44+8640+pcm.length),pcm);assert.equal(wav.length,44+pcm.length+24000);
 assert.throws(()=>pcmWav(Buffer.alloc(5)));
});
test('provider request fixes locale-specific instruction and produces playable WAV',async()=>{
 let request;const result=await synthesizeSpeech('pão','pt-BR',{env:{OPENAI_API_KEY:'test-only'},fetchImpl:async(url,opts)=>{request=JSON.parse(opts.body);return new Response(pcm,{status:200});}});
 assert.equal(request.input,'pão');assert.equal(request.voice,'marin');assert.equal(request.response_format,'pcm');assert.match(request.instructions,/nasalização/);assert.equal(result.audio.toString('ascii',0,4),'RIFF');
});
test('provider errors fall back to explicitly generated audio, never a device voice',async()=>{
 let n=0;const result=await synthesizeSpeech('へ','ja-JP',{env:{OPENAI_API_KEY:'test',GEMINI_API_KEY:'test'},fetchImpl:async()=>++n===1?new Response('',{status:429}):Response.json({output_audio:{data:pcm.toString('base64')}})});assert.equal(result.provider,'gemini');assert.equal(n,2);
 await assert.rejects(()=>synthesizeSpeech('へ','ja-JP',{env:{}}),e=>e.status===503);
});
test('speech endpoint persists, reuses and shares in-flight clips; rejects unapproved text',async()=>{
 const db=new PGlite();const pool={query:async(sql,args)=>!args&&sql.includes('CREATE TABLE')?db.exec(sql):db.query(sql,args)};
 try{await migrateSpeech(pool);let generations=0;
 const call=async(text='あ')=>{let status,headers,body;await handleSpeech({route:'/api/speech',req:{method:'POST'},res:{writeHead:(s,h)=>{status=s;headers=h;},end:b=>body=b},pool,json:async()=>({text,locale:'ja-JP'}),limited(){},fail:(status,message)=>{throw Object.assign(Error(message),{status});},synthesize:async()=>{generations++;await new Promise(r=>setTimeout(r,10));return {audio:pcmWav(pcm),provider:'test',model:'test'};}});return {status,headers,body};};
 const first=await Promise.all([call(),call()]);assert.equal(generations,1);assert.equal(first[0].status,200);const cached=await call();assert.equal(generations,1);assert.equal(cached.headers['X-Audio-Cache'],'hit');assert.deepEqual(cached.body,first[0].body);
 await assert.rejects(()=>call('not a public lesson text 999'),e=>e.status===400);
 }finally{await db.close();}
});
