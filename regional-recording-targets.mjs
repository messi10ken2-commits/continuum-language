// Finite regional practice models whose recording style can be supplied honestly.
import {premiumCourses} from './premium-courses.mjs';
import {premiumGalleryFrames} from './premium-session.mjs';
import {regionalAudioPairs,regionalPlaybackLocale} from './regional-audio-pairs.mjs';
export const supportedRegionalLocales=new Set(['en-US','en-GB','en-AU','es-ES','pt-BR','ja-JP','zh-CN','ko-KR','fr-FR','de-DE','ar-SA','it-IT']);
export function regionalRecordingTargets(){
 const rows=new Map();const add=(text,locale,course)=>{if(!text||!locale)return;const key=JSON.stringify([locale,text]),row=rows.get(key)||{text,locale,scopes:['regional'],lessons:[]};if(!row.lessons.includes(course))row.lessons.push(course);rows.set(key,row);};
 for(const c of premiumCourses.filter(c=>c.scene==='varieties')){
  for(const f of premiumGalleryFrames(c))add(f.text,f.audioLocale,c.id);
  for(const q of c.questions)if(q.audio)add(q.audio,q.audioLocale,c.id);
  for(const pair of regionalAudioPairs[c.language]||[])for(const v of pair.variants)add(v.text,regionalPlaybackLocale(v.locale),c.id);
 }return [...rows.values()];
}
