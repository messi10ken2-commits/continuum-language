import {lessonList,getLesson} from './course.mjs';

// Local, evidence-based planning rules. These do not assess CEFR or infer mastery.
const topics={
 'subjunctive':{terms:['subjunctive','subjuntivo','doubt','uncertainty','venga'],prompt:'You are planning a trip but nothing is confirmed. Give three possibilities using es posible que and no creo que.',check:'Listen for the subjunctive after each doubt expression; ask for one self-correction before giving the form.'},
 'porpara':{terms:['por para','por vs para','por vs. para','por or para','purpose','destination'],prompt:'Explain who a gift is for, why you bought it, and when it must arrive. Use por and para and explain each choice.',check:'Check meaning: recipient, cause and deadline. Ask for a new example, not just the rule.'},
 'connectors':{terms:['conjunction','conjunctions','connector','connectors','connect your ideas','porque','por eso','sin embargo'],prompt:'Should the city limit cars? Give a reason with porque, a result with por eso, and a contrasting point with sin embargo.',check:'Check that each connector expresses the intended relationship, then ask the learner to paraphrase the argument.'},
 'speaker-stance':{terms:['si bien','aunque','aun asi','speaker stance','concession'],prompt:'Discuss working from home. Begin one view with Si bien es cierto que… and another with Aunque…, then make your final position clear.',check:'Ask the listener to identify the concession and the final position. Check whether the learner preserves both meanings.'},
 'pronunciation':{terms:['pronunciation','pronunciacion','rhythm','stress','pronunciar'],prompt:'Say Tengo el teléfono en casa. Mark the stressed syllables, repeat in short chunks, then use teléfono in a new sentence.',check:'Compare clarity, word stress and rhythm by listening. A speech-recognition score alone is not a pronunciation assessment.'},
 'airport':{terms:['airport','gate','flight','aeropuerto','vuelo'],prompt:'Role-play a gate change: the flight moves from B12 to B16 and leaves 20 minutes later. The passenger repeats the new details and asks a follow-up question.',check:'Check the final gate and revised time without showing the transcript. Replay only after the learner gives an answer.'},
 'hypotheticals':{terms:['hypothetical','conditional','si tuviera','condicional'],prompt:'If you had a month free, what would you do? Use Si tuviera… and a conditional, then respond to an unexpected change of plan.',check:'Listen for imperfect subjunctive in the si clause and conditional in the result; request a second original example.'},
 'formal-register':{terms:['register','formal','politeness','formalidad'],prompt:'Ask a friend, then a hotel manager, to change a booking. Adapt the greeting, request and closing to each relationship.',check:'Compare tone and precision across the two messages. Ask the learner to explain which phrases they changed and why.'},
 'past-events':{terms:['past tense','preterite','preterito','yesterday'],prompt:'Tell a short story about yesterday. Add three completed events and answer a follow-up about who did each action.',check:'Check past forms and time sequence; ask for a self-correction without interrupting the first telling.'},
 'ser-estar':{terms:['ser estar','ser and estar','ser vs estar'],prompt:'Describe a friend’s profession, current mood and location. Then describe how their mood changes after some good news.',check:'Check identity, state and location separately; ask why ser or estar fits each sentence.'}
};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const contains=(text,phrase)=>(' '+text+' ').includes(' '+norm(phrase)+' ');
const time=x=>Number.isFinite(Date.parse(x.at))?Date.parse(x.at):0;
const newest=list=>[...list].sort((a,b)=>time(b)-time(a));
const valid=a=>Number.isFinite(a.score)&&a.score>=0&&a.score<=100;

export function buildLessonSuggestion({notes=[],attempts=[],sharing,now=Date.now()}={}){
 const saved=newest(notes.filter(n=>String(n.note||'').trim()))[0]||null;
 const privateProgress=sharing?.selfLearning===false;
 const visible=privateProgress?[]:newest(attempts.filter(valid));
 const body=norm(saved?.note),focus=norm(saved?.focus);
 const candidates=lessonList.filter(l=>!l.checkpoint).map(l=>{
  const terms=[...(topics[l.id]?.terms||[]),l.title];
  const relevance=terms.reduce((best,t)=>Math.max(best,(contains(body,t)?4:0)+(contains(focus,t)?3:0)),0);
  return {lesson:l,relevance};
 }).sort((a,b)=>b.relevance-a.relevance);
 let lesson=candidates[0]?.relevance?candidates[0].lesson:null;
 let source=lesson?'note':'none';
 // Do not replace an unrecognised saved observation with an unrelated score.
 if(!saved&&!lesson){
  const unique=new Map();
  for(const a of visible){const l=getLesson(a.lesson||'subjunctive');if(l&&!l.checkpoint&&!unique.has(l.id))unique.set(l.id,{lesson:l,attempt:a});}
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
 const title=lesson?`${mode==='rebuild'?'Rebuild':mode==='guided'?'Practise':mode==='transfer'?'Use independently':'Check the starting point for'}: ${lesson.title}`:saved?`Explore the saved observation: ${saved.focus||'Class focus'}`:'Start with a short learning check';
 const steps=[];
 steps.push({title:'2 min · Retrieve without hints',text:saved?'Ask the learner to revisit the situation described in the saved note below. Collect two fresh examples before correcting.':lesson?'Ask for one original example connected to this lesson before showing the model.':'Ask what the learner wants to do in Spanish. Invite a short example and record what helps or blocks communication.'});
 if(lesson){
  steps.push({title:mode==='rebuild'?'4 min · Rebuild with a model':mode==='transfer'?'3 min · Contrast and explain':'4 min · Guided practice',text:mode==='rebuild'?`${lesson.explanation} Model “${lesson.example}”, then change one detail at a time together.`:mode==='transfer'?`Explain why “${lesson.example}” works, then create a contrasting example. A high exercise score still needs a live-use check.`:`Use “${lesson.example}” as a model. ${lesson.explanation} Ask the learner to create two new examples and explain their choices.`});
  steps.push({title:mode==='transfer'?'5 min · Unrehearsed transfer':'4 min · Apply in context',text:topic?.prompt||`Create a new situation for “${lesson.title}”. ${lesson.speak||'Have the learner produce an original example, then change the audience or circumstances and try again.'}`});
 }else{
  steps.push({title:'4 min · Identify the teaching target',text:'Use the exact saved observation if available: ask what the learner intended, compare their wording with a clearer model, and agree on one specific feature to practise. No confident course match is available yet.'});
  steps.push({title:'4 min · Try a new situation',text:'Change one detail of the original situation. Have the learner try again without the model, then explain what they changed.'});
 }
 const check=topic?.check||'Ask for a new example without hints. Note accuracy, clarity and how much help was needed; do not assign a CEFR level from this short check.';
 let progress=privateProgress?'Self-study is private. This plan uses saved class notes only.':latest?`${latest.score}% on ${latest.total} questions in ${lesson.title}${time(latest)?' · '+new Date(latest.at).toISOString().slice(0,10):''}.${stale?' This evidence is old or undated; check the starting point again.':''}${latest.source==='imported'?' Imported result; confirm it in class.':''}`:lesson?'No shared result for this lesson. Begin with the short check; do not assume a weakness.':'No relevant shared lesson result used.';
 const previous=relevant[1];
 if(reliable&&previous&&previous.source!=='imported'&&time(previous)&&now-time(previous)<=30*86400000)progress+=` Previous attempt: ${previous.score}% → latest: ${latest.score}%. These are exercise scores, not a proficiency rating.`;
 const reason=source==='note'?'The saved observation mentions this topic. The practice format adapts to the latest relevant shared result.':source==='progress'?'With no saved observation yet, this targets the lowest latest score among lessons practised in the past 30 days. Confirm the need in class.':saved?'The observation does not confidently match a course lesson. Use this exploratory plan rather than guessing a topic.':'Save a specific class observation to personalise this plan.';
 const homework=lesson?`Suggested follow-up: ${lesson.title} (${lesson.level} course difficulty). ${mode==='transfer'?'Create two original examples after reviewing the lesson.':'Review the explanation and retry the lesson after class.'} Not assigned automatically.`:'Save the specific topic and an example after the check to make the next recommendation more targeted.';
 return {title,lessonId:lesson?.id||null,focus:lesson?.title||saved?.focus||'Learning check',source,mode,saved,reason,progress,steps,check,homework};
}

export function suggestionDraft(plan){return `Class plan (proposed, not a completed observation)\n${plan.steps.map(s=>s.title+'\n'+s.text).join('\n\n')}\n\nCheck: ${plan.check}\n\n${plan.homework}`;}
