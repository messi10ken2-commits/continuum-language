import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';import ffmpeg from 'ffmpeg-static';
import {bundledRecordings,bundledRecording} from './bundled-audio.mjs';
import {publicHumanRecordings,publicHumanRecording} from './bundled-human-public.mjs';
import {premiumCourses} from './premium-courses.mjs';import {premiumGalleryFrames} from './premium-session.mjs';import {languageInfo} from './languages.mjs';
import {serveStudioSpeech} from './speech-api.mjs';import {pcmHasSpeechSignal} from './speech-audio-quality.mjs';
test('every bundled human/studio clip has intact bytes, audible decodable speech and truthful provenance',()=>{
 assert.ok(bundledRecordings.filter(r=>r.kind==='human').length>=300);assert.equal(bundledRecordings.filter(r=>r.kind==='studio').length,396);
 for(const r of bundledRecordings){const clip=bundledRecording(r.text,r.locale);assert.equal(createHash('sha256').update(clip.audio).digest('hex'),r.audioSha256,r.key);const pcm=execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-i','pipe:0','-f','s16le','-ac','1','-ar','24000','pipe:1'],{input:clip.audio,timeout:10000,maxBuffer:4_000_000});assert.ok(pcmHasSpeechSignal(pcm),r.key);assert.ok(pcm.length/48000>.25&&pcm.length/48000<45,r.key);
  if(r.kind==='human'){assert.ok(r.author&&r.source&&r.originalSha256&&r.licenseUrl);assert.match(r.license,/^CC /);assert.ok(!/NC|ND/.test(r.license));}else{assert.equal(r.engine,'MiniMax Speech 02 HD via Artlist');assert.ok(r.generationId&&r.sourceEnd>r.sourceStart);}
 }
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
