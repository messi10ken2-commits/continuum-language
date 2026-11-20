import {regionalRecordingTargets} from '../regional-recording-targets.mjs';
import {premiumPracticeAudioTargets} from '../practice-audio-targets.mjs';
// A saved-recording coverage audit: this script never requests live synthesis.
import fs from 'node:fs';import {createHash} from 'node:crypto';
import {ordinaryLessonAudioTargets} from '../lesson-audio-targets.mjs';
import {premiumCourses,premiumCourseById,archivedPremiumCourseSummary} from '../premium-courses.mjs';
import {premiumGalleryFrames} from '../premium-session.mjs';
import {languageInfo} from '../languages.mjs';
import {bundledRecordingInfo,bundledRecordings} from '../bundled-audio.mjs';
import {nativeWordEntry} from '../native-word-map.mjs';import {nativeKanaKey} from '../native-kana-map.mjs';
import {allowedSpeech} from '../speech-api.mjs';
const byLocale={},missing=[],publicRows=ordinaryLessonAudioTargets();let exclusiveTargets=0;
function check(text,locale,{privateAudio=false,scope}={}){
 const row=byLocale[locale]||={ordinary:0,exclusive:0,missing:0};row[privateAudio?'exclusive':'ordinary']++;
 const available=nativeWordEntry(text,locale)||nativeKanaKey(text,locale)||bundledRecordingInfo(text,locale);
 if(!available||(!privateAudio&&!allowedSpeech(text,locale))){row.missing++;missing.push({locale,scope,identity:createHash('sha256').update(JSON.stringify([locale,text])).digest('hex')});}
}
for(const row of publicRows)check(row.text,row.locale,{scope:row.scopes.join(',')});
for(const c of [...premiumCourses,...archivedPremiumCourseSummary.map(c=>premiumCourseById(c.id))]){
 if(c.scene==='varieties')continue;
 const locale=languageInfo(c.language).locale;
 for(const row of [...premiumGalleryFrames(c).map(f=>({text:f.text,locale:f.audioLocale||locale})),...c.questions.filter(q=>q.audio).map(q=>({text:q.audio,locale:q.audioLocale||locale}))]){check(row.text,row.locale,{privateAudio:true,scope:c.id});exclusiveTargets++;}
}
for(const row of premiumPracticeAudioTargets()){check(row.text,row.locale,{privateAudio:true,scope:row.scopes.join(',')});exclusiveTargets++;}
for(const row of regionalRecordingTargets()){check(row.text,row.locale,{privateAudio:true,scope:'regional'});exclusiveTargets++;}
const report={ordinaryTargets:publicRows.length,exclusiveTargets,missing:missing.length,byLocale,bundledFiles:bundledRecordings.length,humanFiles:bundledRecordings.filter(r=>r.kind==='human').length,scope:'Authored current/resumable ordinary lessons and free workshops: galleries, full examples, tables, characters, sounds, all supported question pools and feedback; current and archived standard-language exclusive references, listening and Premium Practice Studio audio/models/instructions. Includes regional wording with clearly labelled standard voices and selected English studio accents. Dynamic AI conversation and reference-only unverified regional pronunciations are excluded.'};
if(process.argv.includes('--write')&&!missing.length)fs.writeFileSync('docs/lesson-audio-coverage.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,...(missing.length?{missingIdentities:missing}:{})},null,2));if(missing.length)process.exitCode=1;
