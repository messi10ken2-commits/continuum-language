// Authored build inventory only: no account, learner or conversation data.
import {ordinaryLessonAudioTargets} from '../lesson-audio-targets.mjs';
import {premiumPracticeAudioTargets} from '../practice-audio-targets.mjs';
import {regionalRecordingTargets} from '../regional-recording-targets.mjs';
import {premiumCourses,premiumCourseById,archivedPremiumCourseSummary} from '../premium-courses.mjs';
import {premiumGalleryFrames} from '../premium-session.mjs';
import {languageInfo} from '../languages.mjs';
const rows=new Map();
function add(row){const text=row.text.normalize('NFC').trim(),key=JSON.stringify([row.locale,text]),existing=rows.get(key)||{text,locale:row.locale,scopes:[],lessons:[]};for(const scope of row.scopes||[])if(!existing.scopes.includes(scope))existing.scopes.push(scope);for(const id of row.lessons||[])if(!existing.lessons.includes(id))existing.lessons.push(id);rows.set(key,existing);}
for(const row of [...ordinaryLessonAudioTargets(),...premiumPracticeAudioTargets(),...regionalRecordingTargets()])add(row);
for(const course of [...premiumCourses,...archivedPremiumCourseSummary.map(c=>premiumCourseById(c.id))]){
 if(course.scene==='varieties')continue;
 const locale=languageInfo(course.language).locale;
 for(const frame of premiumGalleryFrames(course))add({text:frame.text,locale:frame.audioLocale||locale,scopes:['premium-gallery'],lessons:[course.id]});
 for(const question of course.questions.filter(q=>q.audio))add({text:question.audio,locale:question.audioLocale||locale,scopes:['premium-listening'],lessons:[course.id]});
}
console.log(JSON.stringify([...rows.values()]));
