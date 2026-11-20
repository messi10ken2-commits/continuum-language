import {matchClassLesson,topics} from './class-practice.mjs';
import {lessonList,getLesson} from './course.mjs';

// Local, evidence-based planning rules. These do not assess CEFR or infer mastery.

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const contains=(text,phrase)=>(' '+text+' ').includes(' '+norm(phrase)+' ');
const time=x=>Number.isFinite(Date.parse(x.at))?Date.parse(x.at):0;
const newest=list=>[...list].sort((a,b)=>time(b)-time(a));
const valid=a=>Number.isFinite(a.score)&&a.score>=0&&a.score<=100;

export function buildLessonSuggestion({notes=[],attempts=[],sharing,language,now=Date.now(),text=value=>value,format=(source,values)=>source.replace(/\{(\d+)\}/g,(_,i)=>values[i])}={}){
 const saved=newest(notes.filter(n=>String(n.note||'').trim()&&(!language||(n.language||'es')===language)))[0]||null;
 const privateProgress=sharing?.selfLearning===false;
 const visible=privateProgress?[]:newest(attempts.filter(valid));
 let lesson=matchClassLesson(saved,language||saved?.language||'es',topics);
 let source=lesson?'note':'none';
 // Do not replace an unrecognised saved observation with an unrelated score.
 if(!saved&&!lesson){
  const unique=new Map();
  for(const a of visible){const l=getLesson(a.lesson||'subjunctive');if(l&&!l.checkpoint&&(!language||(l.language||'es')===language)&&!unique.has(l.id))unique.set(l.id,{lesson:l,attempt:a});}
  const recent=[...unique.values()].filter(x=>x.attempt.source!=='imported'&&time(x.attempt)>0&&now-time(x.attempt)<=30*86400000);
  const target=recent.sort((a,b)=>a.attempt.score-b.attempt.score)[0];
  if(target){lesson=target.lesson;source='progress';}
 }
 const relevant=lesson?visible.filter(a=>(a.lesson||'subjunctive')===lesson.id):[];
 const latest=relevant[0]||null;
 const stale=latest&&(!time(latest)||now-time(latest)>30*86400000);
 const reliable=latest&&!stale&&latest.source!=='imported';
 const mode=reliable?(latest.score<60?'rebuild':latest.score<80?'guided':'transfer'):'check';
 const topic=topics[lesson?.id];
 const title=lesson?format('{0}: {1}',[text(mode==='rebuild'?'Rebuild':mode==='guided'?'Practise':mode==='transfer'?'Use independently':'Check the starting point for'),text(lesson.title,language)]):saved?format('Explore the saved observation: {0}',[saved.focus||text('Class focus')]):text('Start with a short learning check');
 const steps=[];
 steps.push({title:text('2 min · Retrieve without hints'),text:saved?text('Ask the learner to revisit the situation described in the saved note below. Collect two fresh examples before correcting.'):lesson?text('Ask for one original example connected to this lesson before showing the model.'):text('Ask what the learner wants to do in the shared lesson language. Invite a short example and record what helps or blocks communication.')});
 if(lesson){
  steps.push({title:mode==='rebuild'?text('4 min · Rebuild with a model'):mode==='transfer'?text('3 min · Contrast and explain'):text('4 min · Guided practice'),text:mode==='rebuild'?format('{0} Model “{1}”, then change one detail at a time together.',[text(lesson.explanation,language),lesson.example]):mode==='transfer'?format('Explain why “{0}” works, then create a contrasting example. A high exercise score still needs a live-use check.',[lesson.example]):format('Use “{0}” as a model. {1} Ask the learner to create two new examples and explain their choices.',[lesson.example,text(lesson.explanation,language)])});
  steps.push({title:mode==='transfer'?text('5 min · Unrehearsed transfer'):text('4 min · Apply in context'),text:text(topic?.prompt,language)||format('Create a new situation for “{0}”. {1}',[text(lesson.title,language),text(lesson.speak||'Have the learner produce an original example, then change the audience or circumstances and try again.',language)])});
 }else{
  steps.push({title:text('4 min · Identify the teaching target'),text:text('Use the exact saved observation if available: ask what the learner intended, compare their wording with a clearer model, and agree on one specific feature to practise. No confident course match is available yet.')});
  steps.push({title:text('4 min · Try a new situation'),text:text('Change one detail of the original situation. Have the learner try again without the model, then explain what they changed.')});
 }
 const check=text(topic?.check,language)||text('Ask for a new example without hints. Note accuracy, clarity and how much help was needed; do not assign a CEFR level from this short check.');
 let progress=privateProgress?text('Self-study is private. This plan uses saved class notes only.'):latest?format('{0}% on {1} questions in {2}{3}.',[latest.score,latest.total,text(lesson.title,language),time(latest)?' · '+new Date(latest.at).toISOString().slice(0,10):''])+`${stale?text(' This evidence is old or undated; check the starting point again.'):''}${latest.source==='imported'?text(' Imported result; confirm it in class.'):''}`:lesson?text('No shared result for this lesson. Begin with the short check; do not assume a weakness.'):text('No relevant shared lesson result used.');
 const previous=relevant[1];
 if(reliable&&previous&&previous.source!=='imported'&&time(previous)&&now-time(previous)<=30*86400000)progress+=format(' Previous attempt: {0}% → latest: {1}%. These are exercise scores, not a proficiency rating.',[previous.score,latest.score]);
 const reason=source==='note'?text('The saved observation mentions this topic. The practice format adapts to the latest relevant shared result.'):source==='progress'?text('With no saved observation yet, this targets the lowest latest score among lessons practised in the past 30 days. Confirm the need in class.'):saved?text('The observation does not confidently match a course lesson. Use this exploratory plan rather than guessing a topic.'):text('Save a specific class observation to personalise this plan.');
 const homework=lesson?format('Suggested follow-up: {0} ({1} course difficulty). {2} Not assigned automatically.',[text(lesson.title,language),lesson.level,text(mode==='transfer'?'Create two original examples after reviewing the lesson.':'Review the explanation and retry the lesson after class.')]):text('Save the specific topic and an example after the check to make the next recommendation more targeted.');
 return {title,lessonId:lesson?.id||null,focus:lesson?.title||saved?.focus||'Learning check',source,mode,saved,reason,progress,steps,check,homework};
}

export function suggestionDraft(plan,{text=value=>value,format=(source,values)=>source.replace(/\{(\d+)\}/g,(_,i)=>values[i])}={}){return `${text('Class plan (proposed, not a completed observation)')}\n${plan.steps.map(s=>s.title+'\n'+s.text).join('\n\n')}\n\n${format('Check: {0}',[plan.check])}\n\n${plan.homework}`;}
