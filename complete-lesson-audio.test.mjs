import {bundledRecordingInfo} from './bundled-audio.mjs';
import {regionalRecordingTargets} from './regional-recording-targets.mjs';
import {premiumPracticeAudioTargets} from './practice-audio-targets.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {ordinaryLessonAudioTargets} from './lesson-audio-targets.mjs';
import {allowedSpeech,handleSpeech,serveStudioSpeech} from './speech-api.mjs';
import {premiumCourses,premiumCourseById,archivedPremiumCourseSummary} from './premium-courses.mjs';
import {premiumGalleryFrames} from './premium-session.mjs';
import {languageInfo} from './languages.mjs';
import {speechParts} from './sentence-audio.mjs';

const sortRows=rows=>rows.sort((a,b)=>(bundledRecordingInfo(a.text,a.locale)?.pack||a.locale).localeCompare(bundledRecordingInfo(b.text,b.locale)?.pack||b.locale));
const rows=sortRows(ordinaryLessonAudioTargets());
const forbidden=()=>assert.fail('Static lesson audio must not depend on database cache, provider credentials, rate limits or generation quotas');
async function renderedResponse(text,locale,{privateAudio=false}={}){
 let response;
 const res={writeHead:(status,headers)=>{response={status,headers};},end:body=>{response.body=body;}};
 const options={req:{method:'POST'},res,pool:{query:forbidden},json:async()=>({text,locale}),limited:forbidden,synthesize:forbidden,send:()=>assert.fail('Expected a bundled audio response'),fail:(status,message)=>{throw Error(status+': '+message);}};
 if(privateAudio)await serveStudioSpeech({...options,text,locale,privateAudio:true});else await handleSpeech({...options,route:'/api/speech'});
 assert.equal(response?.status,200,text);assert.equal(response.headers['X-Audio-Delivery'],'bundled',text);assert.ok(Buffer.isBuffer(response.body)&&response.body.length>100,text);
 if(privateAudio)assert.equal(response.headers['Cache-Control'],'private, no-store');
 return response;
}

test('all authored ordinary lesson audio and supported exercise versions have provider-independent recordings',async()=>{
 assert.ok(rows.length>12000,'The coverage gate must include complete example sentences, table forms, choices and feedback rather than a small selection');
 const locales=new Set(),surfaces=new Set();
 for(const row of rows){assert.ok(allowedSpeech(row.text,row.locale),row.locale+': '+row.text);await renderedResponse(row.text,row.locale);locales.add(row.locale);for(const s of row.scopes)surfaces.add(s);}
 assert.equal(locales.size,10);
 for(const s of ['gallery','example','vocabulary-example','expression-example','reference-example','table','character','sound','listening','option','feedback'])assert.ok(surfaces.has(s),s);
});

test('the exact reported full Spanish and Portuguese examples work with both generation providers unavailable',async()=>{
 for(const [text,locale] of [['De vez en cuando cocino con mis amigos.','es-ES'],['Às vezes trabalho em casa.','pt-BR']]){assert.ok(rows.some(r=>r.text===text&&r.locale===locale));await renderedResponse(text,locale);}
});

test('all standard-language exclusive and Practice Studio models have provider-independent audio',async()=>{
 let count=0;
 for(const c of [...premiumCourses,...archivedPremiumCourseSummary.map(c=>premiumCourseById(c.id))]){
  if(c.scene==='varieties')continue; // Unverified regional accents are never replaced by generic models.
  const locale=languageInfo(c.language).locale;
  for(const row of [...premiumGalleryFrames(c).map(f=>({text:f.text,locale:f.audioLocale||locale})),...c.questions.filter(q=>q.audio).map(q=>({text:q.audio,locale:q.audioLocale||locale}))]){await renderedResponse(row.text,row.locale,{privateAudio:true});count++;}
 }
 for(const row of premiumPracticeAudioTargets()){await renderedResponse(row.text,row.locale,{privateAudio:true});count++;}
 for(const row of regionalRecordingTargets()){await renderedResponse(row.text,row.locale,{privateAudio:true});count++;}
 assert.ok(count>1400);
});
