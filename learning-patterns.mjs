import {getLesson,lessonList,isCorrect,getLessonVariant} from './course.mjs';
import {getSkillTask,rubricFor} from './skills-content.mjs';
import {languageOf} from './languages.mjs';
import {assessmentItems} from './assessment-bank.mjs';
const time=x=>new Date(x||0).getTime()||0;
export function questionEvidence(id,answers,seed){
 const lesson=getLessonVariant(id,seed),byTopic=new Map();
 lesson.questions.forEach((q,i)=>{const topic=getLesson(q.sourceLesson)?q.sourceLesson:id;const row=byTopic.get(topic)||{lesson:topic,correct:0,total:0,items:[]};row.total++;const correct=isCorrect(q,answers[i]);if(correct)row.correct++;row.items.push({prompt:q.prompt,correct,response:q.type==='text'?answers[i]:q.options[answers[i]],expected:q.type==='text'?q.answer:q.options[q.answer],explanation:q.note||''});byTopic.set(topic,row);});
 return [...byTopic.values()];
}
export function buildPatternEvidence({language='es',attempts=[],notes=[],submissions=[],assessments=[],pronunciation=[]}){
 const topics=new Map(),coverage={lessons:0,classes:0,skills:0,assessments:0,pronunciation:0};
 const add=(id,title,kind,lessonId,event)=>{const row=topics.get(id)||{id,title,kind,lessonId:lessonId||null,events:[]};row.events.push(event);topics.set(id,row);};
 for(const a of attempts){if(languageOf(a.lesson)!==language)continue;coverage.lessons++;
  const evidence=Array.isArray(a.evidence)&&a.evidence.length?a.evidence:[{lesson:a.lesson||'subjunctive',correct:a.score/100*a.total,total:a.total}];
  for(const e of evidence){const l=getLesson(e.lesson);if(!l||languageOf(e.lesson)!==language||!e.total)continue;
   add('lesson:'+l.id,l.title,'Lesson accuracy',lessonList.some(x=>x.id===l.id)?l.id:null,{id:'practice:'+a.id+':'+l.id,at:a.at,score:Math.round(e.correct/e.total*100),correct:e.correct,total:e.total,text:`${e.correct}/${e.total} correct${a.source==='imported'?' (imported score)':''}. ${Array.isArray(a.evidence)&&a.evidence.length?'Recorded question outcomes.':'Only the overall activity score was stored; specific errors are unknown.'}${e.items?.some(x=>!x.correct)?' Missed items: '+e.items.filter(x=>!x.correct).map(x=>JSON.stringify({prompt:x.prompt,response:x.response,expected:x.expected,explanation:x.explanation})).join(' ').slice(0,3500):''}`});
  }
 }
 for(const s of submissions){const task=getSkillTask(s.task);if(!task||(task.language||'es')!==language)continue;coverage.skills++;
  const r=s.result?.aiAssessment||s.result||{},criteria=r.criteria||rubricFor(task.skill);
  if(Array.isArray(r.ratings)&&r.ratings.length===4){r.ratings.forEach((rating,i)=>{if(!Number.isFinite(rating))return;add(`skill:${task.level}:${task.skill}:${i}`,`${task.level} ${task.skill} · ${criteria[i]}`,'Rubric evidence',task.lessonId,{id:`skill:${s.id}:${i}`,at:r.assessedAt||s.at,score:rating*25,correct:rating,total:4,text:[r.evidence?.[i],r.feedback,r.nextStep].filter(Boolean).join(' ').slice(0,2200)});});}
  else if(Number.isFinite(r.score))add('task:'+task.id,task.title,'Task accuracy',task.lessonId,{id:'skill:'+s.id,at:s.at,score:r.score,correct:r.score,total:100,text:r.feedback||'Saved task score.'});
 }
 for(const p of pronunciation){if(languageOf(p.lesson)!==language)continue;coverage.pronunciation++;const l=getLesson(p.lesson);if(!l)continue;add('pronunciation:'+p.lesson,l.title+' · pronunciation','Speech-match score',lessonList.some(x=>x.id===l.id)?l.id:null,{id:'pronunciation:'+p.id,at:p.at,score:p.score,correct:p.score,total:100,text:'Saved browser speech-match result. This checks recognized words, not a professional pronunciation rating.'});}
 for(const n of notes){if((n.language||'es')!==language)continue;coverage.classes++;add('note:'+n.focus.trim().toLowerCase(),n.focus,'Class observation',null,{id:'note:'+n.id,at:n.at,score:null,text:n.note});}
 for(const a of assessments){if((a.language||'es')!==language)continue;coverage.assessments++;let items;try{items=assessmentItems(a.form,a.version)}catch{continue;}
  const groups=new Map();items.forEach((q,i)=>{if(i>=(a.answers?.length||0))return;const kind=q.skill||'Knowledge';const r=groups.get(kind)||{correct:0,total:0};r.total++;if(a.answers[i]===q.answer)r.correct++;groups.set(kind,r);});
  for(const [kind,r] of groups)add('test:'+kind,`Level test · ${kind}`,'Assessment accuracy',null,{id:`test:${a.id}:${kind}`,at:a.at,score:Math.round(r.correct/r.total*100),...r,text:`${r.correct}/${r.total} correct on completed level-test items. This is task accuracy, not a CEFR diagnosis.`});
 }
 const result=[...topics.values()].map(t=>{
  t.events.sort((a,b)=>time(a.at)-time(b.at)||a.id.localeCompare(b.id));
  const scored=t.events.filter(e=>Number.isFinite(e.score)),recent=scored.slice(-5),allTotal=scored.reduce((s,e)=>s+e.total,0);
  const average=xs=>xs.length?Math.round(xs.reduce((s,e)=>s+e.correct,0)/xs.reduce((s,e)=>s+e.total,0)*100):null;
  const score=average(recent),previous=average(scored.slice(Math.max(0,scored.length-10),Math.max(0,scored.length-5))),low=recent.filter(e=>e.score<80).length;
  return {...t,count:t.events.length,scoredCount:scored.length,score,previous,allTimeScore:allTotal?average(scored):null,lowCount:low,recurring:low>=2,status:score===null?'Class observation':score>=80?'On track':low>=2?'Recurring difficulty':'Review suggested',priority:score===null?35:100-score+(low>=2?15:0),evidence:t.events.slice(-5).reverse()};
 }).sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id));
 return {language,coverage,topics:result.map(({events,...row})=>row)};
}
export function validatePatternAnalysis(value,topics,language){
 if(!value||!Array.isArray(value.items)||value.items.length>6)throw Error('AI returned incomplete pattern analysis.');
 const seen=new Set();return value.items.map(item=>{
  const topic=topics.find(t=>t.id===item.topicId),lesson=item.lessonId?lessonList.find(l=>l.id===item.lessonId):null;
  if(!topic||seen.has(item.topicId)||typeof item.summary!=='string'||!item.summary.trim()||item.summary.length>1200||typeof item.nextStep!=='string'||!item.nextStep.trim()||item.nextStep.length>1000||!Array.isArray(item.evidenceIds)||!item.evidenceIds.length||item.evidenceIds.some(id=>!topic.evidence.some(e=>e.id===id))||item.lessonId&&(!lesson||(lesson.language||'es')!==language||lesson.checkpoint||lesson.summaryTest))throw Error('AI returned an unsupported recommendation. Please try again.');
  seen.add(item.topicId);return {topicId:item.topicId,summary:item.summary,nextStep:item.nextStep,evidenceIds:[...new Set(item.evidenceIds)],lessonId:lesson?.id||topic.lessonId};
 });
}
