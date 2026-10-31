import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList} from './course.mjs';
import {languages} from './languages.mjs';
import {visualFrames} from './lesson-media.mjs';
import {speechParts} from './sentence-audio.mjs';
import {allowedSpeech,serveStudioSpeech} from './speech-api.mjs';
import {premiumCourses} from './premium-courses.mjs';
import {premiumGalleryFrames,premiumReferenceAudioEndpoint} from './premium-session.mjs';
import {bundledRecordings,bundledRecording} from './bundled-audio.mjs';

test('ordinary gallery, vocabulary, expression and reference buttons submit authorised speech parts in every language',()=>{
 let count=0;
 for(const language of languages)for(const l of lessonList.filter(l=>(l.language||'es')===language.id)){
  const locale=l.locale||language.locale;
  const targets=[...visualFrames(l,{all:true}).map(f=>[f.audio||f.text,f.lang||locale]),...[l.example,...(l.vocabulary||[]).flatMap(w=>[w.term,w.phrase,w.example]),...(l.expressions||[]).flatMap(w=>[w.term,w.example]),...(l.breakdown?.examples||[]).map(e=>e[0]),...l.questions.map(q=>q.audio)].filter(Boolean).map(text=>[text,locale])];
  for(const [text,lang] of targets)for(const part of speechParts(text,lang,locale)){assert.ok(allowedSpeech(part.text,part.lang),l.id+': '+part.text);count++;}
 }
 assert.ok(count>5000);
});

test('exclusive context examples resolve to their own protected gallery in all languages; unavailable regional models have no substitute',()=>{
 let count=0;
 for(const c of premiumCourses)for(const [text] of c.breakdown?.examples||[]){
  const frames=premiumGalleryFrames(c),i=frames.findIndex(f=>f.text===text),endpoint=premiumReferenceAudioEndpoint(c,text);
  if(c.scene==='varieties'&&!frames[i]?.audioLocale){assert.equal(endpoint,null);continue;}
  assert.equal(endpoint,'/api/billing/courses/'+c.id+'/audio?gallery='+i);assert.ok(i>=0);count++;
 }
 assert.ok(count>=200);
 const italian=premiumCourses.find(c=>c.language==='it'&&c.examples?.includes('È una sorpresa, quindi acqua in bocca !'));
 assert.ok(italian);for(const text of italian.examples)assert.ok(premiumReferenceAudioEndpoint(italian,text));
 assert.equal(premiumReferenceAudioEndpoint(italian,'arbitrary user text'),null);
});

test('new ordinary recordings including às vezes bypass failed providers and daily quotas',async()=>{
 const rows=bundledRecordings.filter(r=>r.collection==='ordinary-lessons-v1');
 assert.ok(rows.length>=1000);assert.equal(new Set(rows.map(r=>r.locale)).size,10);
 assert.equal(bundledRecording('às vezes','pt-BR')?.record.collection,'ordinary-lessons-v1');
 for(const r of rows){let body,headers;await serveStudioSpeech({req:{},res:{writeHead:(status,h)=>{assert.equal(status,200);headers=h;},end:b=>body=b},text:r.text,locale:r.locale,pool:{query(){assert.fail('bundled speech must not access provider cache');}},limited(){assert.fail('bundled speech must not spend a generation quota');},synthesize(){assert.fail('bundled speech must not call a provider');},fail:(status,message)=>{throw Error(status+': '+message);}});assert.equal(headers['X-Audio-Delivery'],'bundled');assert.equal(headers['X-Audio-Source'],'AI-generated studio voice');assert.deepEqual(body,bundledRecording(r.text,r.locale).audio);}
});
