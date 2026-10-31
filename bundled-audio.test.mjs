import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';import ffmpeg from 'ffmpeg-static';
import {bundledRecordings,bundledRecording} from './bundled-audio.mjs';
import {publicHumanRecordings,publicHumanRecording} from './bundled-human-public.mjs';
import {premiumCourses} from './premium-courses.mjs';import {premiumGalleryFrames} from './premium-session.mjs';import {languageInfo} from './languages.mjs';
import {serveStudioSpeech} from './speech-api.mjs';import {pcmHasSpeechSignal} from './speech-audio-quality.mjs';
test('every bundled human/studio clip has intact bytes, audible decodable speech and truthful provenance',()=>{
 assert.ok(bundledRecordings.filter(r=>r.kind==='human').length>=300);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'continuum-audio-integrity-'));
 const ordered=[...bundledRecordings].sort((a,b)=>(a.pack||a.locale.split('-')[0]).localeCompare(b.pack||b.locale.split('-')[0]));
 try{for(let offset=0;offset<ordered.length;offset+=32){
  const group=ordered.slice(offset,offset+32),args=['-nostdin','-hide_banner','-loglevel','error','-xerror'];
  for(const [i,r] of group.entries()){
   const clip=bundledRecording(r.text,r.locale);assert.equal(createHash('sha256').update(clip.audio).digest('hex'),r.audioSha256,r.key);
   fs.writeFileSync(path.join(temp,i+'.mp3'),clip.audio);args.push('-threads','1','-i',path.join(temp,i+'.mp3'));
   if(r.kind==='human'){assert.ok(r.author&&r.source&&r.originalSha256&&r.licenseUrl);assert.match(r.license,/^CC /);assert.ok(!/NC|ND/.test(r.license));}
   else if(r.engine==='MiniMax Speech 02 HD via Artlist'){assert.ok(r.generationId&&r.sourceEnd>r.sourceStart);}
   else{assert.equal(r.engine,'Supertonic 3');assert.equal(r.steps,8);assert.equal(r.voice,'F3');assert.ok(Number.isInteger(r.seed));assert.equal(r.source,'https://huggingface.co/Supertone/supertonic-3');}
  }
  for(const [i] of group.entries())args.push('-map',i+':a:0','-threads','1','-f','s16le','-ac','1','-ar','24000','-y',path.join(temp,i+'.pcm'));
  execFileSync(ffmpeg,args,{timeout:60000,maxBuffer:2_000_000});
  for(const [i,r] of group.entries()){const pcm=fs.readFileSync(path.join(temp,i+'.pcm'));assert.ok(pcmHasSpeechSignal(pcm),r.key);assert.ok(pcm.length/48000>.25&&pcm.length/48000<180,r.key);fs.unlinkSync(path.join(temp,i+'.mp3'));fs.unlinkSync(path.join(temp,i+'.pcm'));}
 }}finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('all six additional-language exclusive listening/gallery targets play without a database, quota or generation provider',async()=>{
 let count=0;for(const c of premiumCourses.filter(c=>['zh','ko','fr','de','ar','it'].includes(c.language))){const locale=languageInfo(c.language).locale;const targets=[...premiumGalleryFrames(c).filter(f=>c.scene!=='varieties'||f.audioLocale).map(f=>[f.text,f.audioLocale||locale]),...c.questions.filter(q=>q.audio).map(q=>[q.audio,q.audioLocale||locale])];
  for(const [text,voiceLocale] of targets){let headers,body;await serveStudioSpeech({req:{},res:{writeHead:(status,h)=>{assert.equal(status,200);headers=h},end:b=>body=b},pool:{query(){assert.fail('Bundled course audio must not query AI cache')}},text,locale:voiceLocale,privateAudio:true,limited(){assert.fail('No generation quota for bundled audio')},synthesize(){assert.fail('No provider call for bundled audio')},fail:(status,message)=>{throw Error(status+': '+message)}});assert.equal(headers['Cache-Control'],'private, no-store');assert.equal(headers['X-Audio-Delivery'],'bundled');assert.equal(headers['X-Audio-Locale'],voiceLocale);assert.deepEqual(body,bundledRecording(text,voiceLocale).audio);count++;}
 }assert.ok(count>=500);
});
test('public human metadata excludes studio recordings and matching preserves accents, language and punctuation',()=>{
 assert.ok(publicHumanRecordings.length>=200);assert.ok(publicHumanRecordings.every(r=>bundledRecording(r.text,r.locale).record.kind==='human'));
 assert.equal(publicHumanRecording('ship','en-US')?.text,'ship');assert.equal(bundledRecording('지금 뭐 해?','ko-KR').record.kind,'studio');assert.equal(bundledRecording('지금 뭐 해?','ja-JP'),null);assert.equal(bundledRecording('지금 뭐 해','ko-KR'),null);
 for(const r of publicHumanRecordings)assert.equal(publicHumanRecording(r.text.normalize('NFD'),r.locale),r);
});
