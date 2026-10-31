import {freePracticeAudioTargets} from './practice-audio-targets.mjs';
import {everydayQuestions} from './everyday-expressions.mjs';
import {legacyInternationalLessons} from './international-course.mjs';
import {archivedExpandedVideoLessons} from './expanded-video-course.mjs';
import {expandedExerciseBank} from './expanded-language-catalog.mjs';
import {idiomExercises} from './c1-idioms.mjs';
import {qualityQuestions} from './question-quality.mjs';
import {appliedScenarios,appliedListening,appliedCommunication} from './applied-exercises.mjs';
import exerciseBank from './lesson-exercises.json' with {type:'json'};
import practicalBank from './practical-exercises.json' with {type:'json'};
import {lessonList,getLessonVariant,hasExpandedExercises,authoredTransferQuestions} from './course.mjs';
import {languageInfo} from './languages.mjs';
import {visualFrames} from './lesson-media.mjs';
import {speechParts} from './sentence-audio.mjs';
import {displayLanguageOptions,canPlayAnswerAudio} from './answer-language.mjs';
export function ordinaryLessonAudioTargets(){
const rows=new Map(),description=h=>/^(Type|Purpose|Function|Meaning|Focus|Interpretation|Time order|Reason|Difference|Time|Strength|Appropriate interpretation|Reference|Use|Usage|English|Translation|Ending sound)$/i.test(h);
function add(text,locale,scope,lesson,fallback=locale){if(typeof text!=='string'||!text.trim())return;for(const part of speechParts(text,locale,fallback)){const t=part.text.normalize('NFC').trim();if(!t)continue;const key=JSON.stringify([part.lang,t]);const row=rows.get(key)||{text:t,locale:part.lang,scopes:[],lessons:[]};if(!row.scopes.includes(scope))row.scopes.push(scope);if(!row.lessons.includes(lesson))row.lessons.push(lesson);rows.set(key,row);}}
function questions(l,qs){const locale=l.locale||languageInfo(l.language||'es').locale,lang=l.language||'es';for(const q of qs){if(q.audio)add(q.audioSpeech||q.audio,q.audioLocale||locale,'listening',l.id);if(!displayLanguageOptions(q,l)){if(!q.optionsLang||q.optionsLang.split('-')[0]===lang)for(const o of q.options||[])add(o,q.optionsLang||locale,'option',l.id);const correct=q.type==='text'?q.answer:q.options?.[q.answer];canPlayAnswerAudio(q,l)&&add(q.answerAudio||correct,q.answerLocale||q.optionsLang||locale,'feedback',l.id);}}}
const seen=new Set();
const reachable=[...lessonList,...legacyInternationalLessons,...archivedExpandedVideoLessons].filter(l=>{if(seen.has(l.id))return false;seen.add(l.id);return true;});
for(const l of reachable){const locale=l.locale||languageInfo(l.language||'es').locale;
 for(const f of visualFrames(l,{all:true}))add(f.audio||f.text,f.lang||locale,'gallery',l.id);
 add(l.example,l.exampleLang||l.locale||'auto','example',l.id,locale);
 for(const w of l.vocabulary||[])for(const k of ['term','phrase','example'])add(w[k],locale,'vocabulary-'+k,l.id);
 for(const e of l.expressions||[])for(const k of ['term','example'])add(e[k],locale,'expression-'+k,l.id);
 for(const [text] of l.breakdown?.examples||[])add(text,locale,'reference-example',l.id);
 for(const t of l.breakdown?.tables||[])for(const row of t.rows)row.forEach((cell,i)=>{if(!t.descriptionColumns?.includes(i)&&!description(t.headers[i])&&!cell.includes('+')&&cell!=='—')add(cell,locale,'table',l.id);});
 for(const [a,b] of l.soundGuide?.pairs||[]){add(a,locale,'sound',l.id);if(!/[A-Z /:]/.test(b))add(b,locale,'sound',l.id);}
 for(const c of l.characters||[])add(c.audio||(c.meaning?c.reading:c.glyph),locale,'character',l.id);
 questions(l,l.questions);
 for(const bank of [exerciseBank,practicalBank,expandedExerciseBank,idiomExercises])if(bank[l.id]){questions(l,bank[l.id]);questions(l,qualityQuestions(l,bank[l.id]));}
 for(const bank of [appliedScenarios,appliedListening,appliedCommunication])if(bank[l.id])questions(l,bank[l.id]);
 if(l.checkpoint||l.summaryTest){
  questions(l,authoredTransferQuestions(l.id));
  try{const variant=getLessonVariant(l.id,'v1-audio-complete-123456789');add(variant.example,variant.exampleLang||variant.locale||'auto','example',l.id,locale);}catch{/* Fixed historical checkpoints have no sampled variant. */}
 }
 if(hasExpandedExercises(l.id)){
  // v2/v3/v4 retain their entire source pool. Quality changes are applied to
  // that full pool before later versions draw subsets; every draw is covered.
  for(const version of [2,3,4]){const variant=getLessonVariant(l.id,`v${version}-audio-complete-123456789`);questions(l,variant.questions);questions(l,qualityQuestions(l,variant.questions));}
 }
 questions(l,everydayQuestions(l));

}
for(const row of freePracticeAudioTargets())for(const scope of row.scopes)for(const id of row.lessons)add(row.text,row.locale,scope,id);
return [...rows.values()];
}
