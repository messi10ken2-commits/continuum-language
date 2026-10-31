import {lessonList} from './course.mjs';
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
 assert.equal(speechRecipe('pão','pt-BR').input,'pão. pão.');assert.match(speechRecipe('pão','pt-BR').instructions,/brasileiro/);
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
 assert.equal(request.input,'pão. pão.');assert.equal(request.voice,'marin');assert.equal(request.response_format,'pcm');assert.match(request.instructions,/nasalização/);assert.equal(result.audio.toString('ascii',0,4),'RIFF');
});
test('provider errors fall back to explicitly generated audio, never a device voice',async()=>{
 let n=0;const result=await synthesizeSpeech('へ','ja-JP',{env:{OPENAI_API_KEY:'test',GEMINI_API_KEY:'test'},fetchImpl:async()=>++n===1?new Response('',{status:429}):Response.json({steps:[{type:'model_output',content:[{type:'audio',data:pcm.toString('base64')}]}]})});assert.equal(result.provider,'gemini');assert.equal(n,2);
 await assert.rejects(()=>synthesizeSpeech('へ','ja-JP',{env:{}}),e=>e.status===503);
});
test('speech endpoint persists, reuses and shares in-flight clips; rejects unapproved text',async()=>{
 const db=new PGlite();const pool={query:async(sql,args)=>!args&&sql.includes('CREATE TABLE')?db.exec(sql):db.query(sql,args)};
 try{await migrateSpeech(pool);let generations=0;
 const call=async(text=lessonList[0].explanation)=>{let status,headers,body;await handleSpeech({route:'/api/speech',req:{method:'POST'},res:{writeHead:(s,h)=>{status=s;headers=h;},end:b=>body=b},pool,json:async()=>({text,locale:'en-US'}),limited(){},fail:(status,message)=>{throw Object.assign(Error(message),{status});},synthesize:async()=>{generations++;await new Promise(r=>setTimeout(r,10));return {audio:pcmWav(pcm),provider:'test',model:'test'};}});return {status,headers,body};};
 const first=await Promise.all([call(),call()]);assert.equal(generations,1);assert.equal(first[0].status,200);const cached=await call();assert.equal(generations,1);assert.equal(cached.headers['X-Audio-Cache'],'hit');assert.deepEqual(cached.body,first[0].body);
 await assert.rejects(()=>call('not a public lesson text 999'),e=>e.status===400);
 }finally{await db.close();}
});
test('generation limits produce a clear retry hint rather than pretending device audio is studio audio',async()=>{
 await assert.rejects(()=>synthesizeSpeech('を','ja-JP',{env:{GEMINI_API_KEY:'test'},fetchImpl:async()=>Response.json({error:{details:[{retryDelay:'42s'}]}},{status:429})}),e=>e.status===503&&e.retryAfter===42&&/provider/.test(e.message));
});

test('all taught kana use bundled human recordings without database or provider calls',async()=>{
 const {lessonList}=await import('./course.mjs');
 const {nativeKanaKey,nativeKanaMap}=await import('./native-kana-map.mjs');
 const {default:clips}=await import('./native-kana.json',{with:{type:'json'}});
 assert.equal(Object.keys(clips).length,104);assert.equal(Object.keys(nativeKanaMap).length,208);
 for(const lesson of lessonList)for(const character of lesson.characters||[]){
  if(character.meaning)continue;
  const key=nativeKanaKey(character.glyph,'ja-JP');assert.ok(key,character.glyph);assert.ok(clips[key]);
 }
 for(const text of ['あ','へ','る','ん','を','ちゃ','ちょ','ぎゃ','じゃ','チャ']){
  let status,headers,body;
  await handleSpeech({route:'/api/speech',req:{method:'POST'},res:{writeHead:(s,h)=>{status=s;headers=h;},end:b=>body=b},json:async()=>({text,locale:'ja-JP'}),pool:{query(){assert.fail('Native recordings must not use database');}},synthesize(){assert.fail('Native recordings must not use AI');},limited(){assert.fail('Native recordings must not spend generation budget');},fail:(s,m)=>{throw Error(m);}});
  assert.equal(status,200);assert.equal(headers['X-Audio-Source'],'Human recording');assert.equal(headers['Content-Type'],'audio/mpeg');assert.ok(body.length>5000);
 }
 assert.equal(nativeKanaKey('あ','en-US'),undefined);assert.equal(nativeKanaKey('こうこう','ja-JP'),undefined);
});

test('target pronunciation recordings bypass provider limits and preserve accent distinctions',async()=>{
 const {nativeWordEntry,nativeWordRecordings}=await import('./native-word-map.mjs');
 const {default:clips}=await import('./native-words.json',{with:{type:'json'}});
 for(const [text,locale] of [['avó','pt-BR'],['avô','pt-BR'],['lá','pt-BR'],['lã','pt-BR'],['mau','pt-BR'],['pau','pt-BR'],['pó','pt-BR'],['pôr','pt-BR'],['caro','pt-BR'],['bom dia','pt-BR'],['pão','pt-BR'],['mão','pt-BR'],['pero','es-ES'],['perro','es-ES'],['rojo','es-ES'],['papa','es-ES'],['papá','es-ES']])assert.ok(nativeWordEntry(text,locale),text);
 assert.notEqual(nativeWordEntry('papa','es-ES').key,nativeWordEntry('papá','es-ES').key);
 assert.equal(nativeWordEntry('pao','pt-BR'),undefined);
 assert.equal(nativeWordEntry('pão','es-ES'),undefined);
 assert.equal(nativeWordEntry('pa\u0303o','pt-BR').text,'pão');
 for(const entry of nativeWordRecordings){
  let status,headers,body;
  await handleSpeech({route:'/api/speech',req:{method:'POST'},res:{writeHead:(s,h)=>{status=s;headers=h;},end:b=>body=b},json:async()=>({text:entry.text,locale:entry.locale}),pool:{query(){assert.fail('Human recording must not query AI cache');}},synthesize(){assert.fail('Human recording must not call provider');},limited(){assert.fail('No generation budget for human recording');},fail:(s,m)=>{throw Error(m);}});
  assert.equal(status,200);assert.equal(headers['X-Audio-Source'],'Human recording');assert.equal(headers['Content-Type'],'audio/mpeg');assert.deepEqual(body,Buffer.from(clips[entry.key],'base64'));assert.ok(body.length>5000);
  const {createHash}=await import('node:crypto');assert.equal(createHash('sha256').update(body).digest('hex'),entry.audioSha256);
 }
});
test('Portuguese foi/fui have distinct text and cache entries with contrast guidance',()=>{
 for(const word of ['foi','fui']){const recipe=speechRecipe(word,'pt-BR');assert.equal(recipe.input,`${word}. ${word}.`);assert.match(recipe.instructions,/foi \/foj\/ de fui \/fuj\//);}
 assert.notEqual(speechKey('foi','pt-BR'),speechKey('fui','pt-BR'));
});
test('new practical sentence models can use studio audio',()=>{
 assert.ok(allowedSpeech('Minha reserva está para uma noite. Pode mudar para duas?','pt-BR'));
 assert.ok(!allowedSpeech('unpublished private learner text 938234','pt-BR'));
});

test('conversation partner voices vary and cannot reuse another persona audio cache',async()=>{
 const text='Hello, how can I help?',locale='en-US',keys=new Set(),voices=new Set(),geminiVoices=new Set();
 for(const voiceProfile of ['mira','hana','rafael','lucia','theo']){
  keys.add(speechKey(text,locale,voiceProfile));
  await synthesizeSpeech(text,locale,{voiceProfile,env:{OPENAI_API_KEY:'synthetic'},fetchImpl:async(url,options)=>{const body=JSON.parse(options.body);voices.add(body.voice);assert.match(body.instructions,/conversational delivery/);return new Response(pcm);}});
  await synthesizeSpeech(text,locale,{voiceProfile,env:{GEMINI_API_KEY:'synthetic'},fetchImpl:async(url,options)=>{geminiVoices.add(JSON.parse(options.body).generation_config.speech_config[0].voice);return Response.json({steps:[{content:[{type:'audio',data:pcm.toString('base64')}]}]});}});
 }
 assert.equal(keys.size,5);assert.equal(voices.size,5);assert.equal(geminiVoices.size,5);assert.ok(!keys.has(speechKey(text,locale)));assert.throws(()=>speechKey(text,locale,'arbitrary-client-voice'));
});

test('regional synthesis requests explicit styles, keeps locales apart and rejects unknown locales',()=>{
 for(const [locale,pattern] of [['en-AU',/Australian/],['en-GB',/British/],['es-AR',/rioplatense/],['es-MX',/mexicano/],['pt-PT',/europeu/],['ja-JP-kansai',/関西/]]){
  assert.match(speechRecipe('Sample',locale).instructions,pattern);
  assert.notEqual(speechKey('Sample',locale),speechKey('Sample','en-US'));
 }
 assert.throws(()=>speechRecipe('Sample','unknown'),/Unsupported/);
});


test('provider backoff prevents repeated failed generation and a corrected key can recover immediately',async()=>{
 const {SpeechProviderBackoff}=await import('./speech-provider-backoff.mjs');let calls=0;const backoff=new SpeechProviderBackoff(()=>0),env={OPENAI_API_KEY:'invalid',GEMINI_API_KEY:'limited'};
 const fetchImpl=async url=>{calls++;return new Response('{}',{status:url.includes('openai')?401:429});};
 await assert.rejects(synthesizeSpeech('avó','pt-BR',{env,fetchImpl,backoff}),e=>e.status===503);assert.equal(calls,2);
 await assert.rejects(synthesizeSpeech('avó','pt-BR',{env,fetchImpl,backoff}),e=>e.status===503&&!!e.retryAfter);assert.equal(calls,2);
 const result=await synthesizeSpeech('avó','pt-BR',{env:{...env,OPENAI_API_KEY:'corrected'},backoff,fetchImpl:async()=>{calls++;return new Response(pcm)}});assert.equal(result.provider,'openai');assert.equal(calls,3);
});
