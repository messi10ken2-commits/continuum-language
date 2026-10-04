import {internationalUnits} from './international-content.mjs';
import {expansionPacks} from './curriculum-expansion.mjs';
import {languageInfo,courseBands} from './languages.mjs';
export const internationalChapters=[],internationalLessons=[],internationalTransfer={};
for(const u of internationalUnits){
 const lang=languageInfo(u.language),chapter=`${u.language}-${u.level.toLowerCase()}-core`;
 internationalChapters.push({id:chapter,level:u.level,language:u.language,title:u.title,goal:`Build ${lang.name} grammar and useful expressions in context.`});
 const base={language:u.language,locale:lang.locale,level:u.level,chapter,minutes:10};
 internationalLessons.push({...base,id:chapter+'-grammar',title:u.title,skill:'Grammar',explanation:u.rule,example:u.example,questions:u.practice,breakdown:{steps:u.rule.split(/(?<=[.!?])\s+(?=[A-Z])/),tables:[{caption:'Forms in context',headers:['Pattern','Form'],rows:u.forms}],pitfall:'Choose the form from its meaning and grammatical role. Do not translate word for word.',examples:[[u.example,u.translation]]}});
 const vocabulary=u.phrases.map(([term,meaning,example])=>({term,meaning,phrase:term,example,translation:''}));
 const q=u.phrases.map(([term,meaning,example],i)=>({prompt:`Which expression means “${meaning}”?`,options:[term,...u.phrases.filter((_,j)=>i!==j).map(p=>p[0])],answer:0,note:`${term}: ${meaning}. Example: ${example}`,optionsLang:lang.locale,promptLang:'en-US'}));
 const deepVocabularyQuestions=u.phrases.map(([term,meaning,example],i)=>({prompt:`Complete the sentence: ${example}`,options:[term,...u.phrases.filter((_,j)=>i!==j).map(p=>p[0])],answer:0,note:`Use “${term}” here because it means ${meaning}.`,optionsLang:lang.locale,promptLang:'en-US'}));
 internationalLessons.push({...base,id:chapter+'-expressions',title:'Vocabulary & expressions in context',skill:'Expressions',explanation:'Learn each phrase as a unit. Listen to the example, notice the situation, then create a sentence of your own.',example:u.phrases[0][2],vocabulary,questions:q});
 internationalTransfer[chapter]=[...u.transfer,...u.phrases.map(([term,meaning,example],i)=>({prompt:`Choose the meaning in this context: ${example}`,options:[meaning,...u.phrases.filter((_,j)=>i!==j).map(p=>p[1])],answer:0,note:`In this context, ${term} means: ${meaning}.`,optionsLang:'en-US'}))];
 // Every unit gets the same depth of practice as the Spanish pathway: a second
 // explanation pass, vocabulary retrieval, listening, communication and review.
 const deepBase={...base,minutes:8};
 internationalLessons.push({...deepBase,id:chapter+'-grammar-deep',title:`${u.title} · grammar in context`,skill:'Grammar',explanation:`Return to the rule and compare it with a new situation. ${u.rule}`,example:u.example,questions:[...u.practice,...u.transfer.slice(0,2)],breakdown:{steps:[u.rule,'Compare the form with the meaning of the whole sentence.','Use the pattern in a new situation before moving on.'],tables:[{caption:'Forms in context',headers:['Pattern','Form'],rows:u.forms}],pitfall:'Choose the form from its meaning and grammatical role.',examples:[[u.example,u.translation]]}});
 internationalLessons.push({...deepBase,id:chapter+'-vocabulary-deep',title:`${u.title} · vocabulary retrieval`,skill:'Vocabulary',explanation:'Retrieve the phrase from a new sentence, then say the complete example aloud.',example:u.phrases[0][2],vocabulary,questions:deepVocabularyQuestions});
 internationalLessons.push({...deepBase,id:chapter+'-listening',title:`${u.title} · listening for meaning`,skill:'Listening',explanation:'Listen for the key words, identify the situation, and choose the meaning that fits.',example:u.scene,exampleLang:lang.locale,questions:u.reading.map((x,i)=>({...x,audio:u.scene,audioSpeech:u.scene,prompt:`Listen and answer: ${x.prompt}`,promptLang:'en-US',optionsLang:lang.locale,id:`${chapter}-listening-${i}`}))});
 internationalLessons.push({...deepBase,id:chapter+'-communication',title:`${u.title} · communication practice`,skill:'Speaking',speak:'Respond to the situation in your own words, then compare your recording with the model.',pronunciationTarget:u.example,explanation:'Speak your answer aloud in a complete sentence. The recording and optional pronunciation check are available before the written review.',example:u.example,questions:u.transfer.slice(2,6).concat(u.practice.slice(0,2))});
 internationalLessons.push({...deepBase,id:chapter+'-review',title:`${u.title} · mixed review`,skill:'Review',explanation:'Mix grammar, vocabulary and meaning so you retrieve the pattern without relying on chapter order.',example:'Choose the response that best fits the situation.',questions:[...u.practice.slice(0,3),...u.transfer.slice(0,3),...q.slice(0,2)]});
 // The checkpoint closes the unit. It uses the reading situation as a fresh
 // context, so it does not repeat the question immediately above it.
 const checkpointQuestions=u.reading.map((x,i)=>({...x,prompt:`Checkpoint: ${x.prompt}`,id:`${chapter}-checkpoint-${i}`}));
 internationalTransfer[chapter]=checkpointQuestions;
 internationalLessons.push({...base,id:chapter+'-checkpoint',title:'Chapter checkpoint',skill:'Checkpoint',checkpoint:true,explanation:'Apply the chapter in a fresh situation. This checkpoint comes after the learning and skill practice.',example:'Read or listen to the new situation, then choose the response that fits.',exampleLang:'en-US',questions:checkpointQuestions.slice(0,4)});
}
// Add authored deep-dive packs when available. These are intentionally separate
// from the generated unit reviews so they can grow without changing old IDs.
for(const p of expansionPacks){
 const lang=languageInfo(p.language),chapter=`${p.language}-${p.level.toLowerCase()}-${p.slug}`;
 internationalChapters.push({id:chapter,language:p.language,level:p.level,title:p.title,goal:`Build ${lang.name} grammar and useful expressions in context.`});
 const base={language:p.language,locale:lang.locale,level:p.level,chapter,minutes:10};
 const vocabulary=p.words.map(([term,meaning,example,translation])=>({term,meaning,phrase:term,example,translation}));
 const questions=p.practice.map(x=>({prompt:x[0],options:x.slice(1,4),answer:0,note:x[4],optionsLang:lang.locale,promptLang:'en-US'}));
 const transfer=p.transfer.map(x=>({prompt:x[0],options:x.slice(1,4),answer:0,note:x[4],optionsLang:lang.locale,promptLang:'en-US'}));
 internationalTransfer[chapter]=transfer;
 internationalLessons.push({...base,id:chapter+'-grammar',title:p.title,skill:'Grammar',explanation:p.steps.join(' '),example:p.examples[0][0],questions,breakdown:{steps:p.steps,tables:[{caption:'Forms in context',headers:['Pattern','Form'],rows:p.forms}],pitfall:p.pitfall,examples:p.examples}});
 const vocabQuestions=p.words.map(([term,meaning,example],i)=>({prompt:`Which expression means “${meaning}”?`,options:[term,...p.words.filter((_,j)=>j!==i).slice(0,2).map(x=>x[0])],answer:0,note:`${term}: ${meaning}. Example: ${example}`,optionsLang:lang.locale,promptLang:'en-US'}));
 internationalLessons.push({...base,id:chapter+'-vocabulary',title:`${p.title} · vocabulary`,skill:'Vocabulary',explanation:'Learn each item as a phrase, hear it in context, and create a new sentence.',example:p.words[0][2],vocabulary,questions:vocabQuestions});
 internationalLessons.push({...base,id:chapter+'-checkpoint',title:`${p.title} · checkpoint`,skill:'Checkpoint',checkpoint:true,explanation:'Apply the grammar and expressions in new situations. Score 80% to master it.',example:'Choose the response that best fits the situation.',questions:transfer.slice(0,4)});
}
// Mirror the Spanish course unit shape exactly: every chapter contains two
// distinct learning lessons followed by its own chapter checkpoint. The
// international content is rotated through these same chapter roles.
const spanishStructure={
 A1:['Meet your world','Your everyday Spanish','Grammar lab · Present tense','Vocabulary lab · Everyday essentials','Expression lab · Small conversations','Expression lab · Everyday combinations'],
 A2:['Stories & plans','Listen, stress, connect','Grammar lab · Two views of the past','Vocabulary lab · Travel and work','Expression lab · Plans and practical requests','Expression lab · Everyday stories'],
 B1:['Purpose & uncertainty','Make your point','Grammar lab · Perfect tenses','Grammar lab · Future and conditional','Expression lab · Keep the conversation moving','Expression lab · Beyond literal meaning'],
 B2:['Listen beyond the textbook','Possibility & argument','Grammar lab · Subjunctive forms','Expression lab · Decisions and collaboration','Expression lab · Idioms in real situations'],
 C1:['Choose your voice','Build a precise argument','Grammar lab · Perfect subjunctive','Expression lab · Precise arguments','Expression lab · Subtext and register']
};
for(const language of ['ja','pt','en'])for(const level of courseBands){
 const all=internationalLessons.filter(l=>l.language===language&&l.level===level);
 const formalCheckpoint=all.find(l=>l.checkpoint&&l.chapter.endsWith('-core'))||all.find(l=>l.checkpoint);
 const legacyCheckpoint=formalCheckpoint?{...formalCheckpoint}:null;
 const pool=all.filter(l=>l!==formalCheckpoint&&!l.summaryTest);
 for(const l of pool)if(l.checkpoint){l.checkpoint=false;l.skill='Application';l.title=l.title.replace(/· checkpoint$/,'· application practice');}
 const templates=spanishStructure[level],needed=templates.length*2,seedUnit=internationalUnits.find(u=>u.language===language&&u.level===level);
 const makeQuestions=(source,index)=>source?.questions?.map((q,i)=>({...q,id:`${source.id}-variant-${index}-${i}`,prompt:`New context ${index+1}: ${q.prompt}`,note:q.note?`${q.note} (retrieval variant ${index+1})`:undefined}))||[];
 while(pool.length<needed&&seedUnit){
   const i=pool.length,base=pool[i%Math.max(1,pool.length)]||all[0];
   const qset=(seedUnit.reading||seedUnit.transfer||[]).map((q,j)=>({...q,id:`${language}-${level.toLowerCase()}-extra-${i}-${j}`,prompt:`New situation: ${q.prompt}`}));
   pool.push({...base,id:`${language}-${level.toLowerCase()}-extra-${i}`,chapter:'',title:`${seedUnit.title} · application ${i+1}`,skill:base?.skill||'Application',questions:qset.length?qset:makeQuestions(base,i),checkpoint:false,summaryTest:false,explanation:`A fresh retrieval pass for ${seedUnit.title}. Apply the target in a different situation.`});
 }
 const selected=pool.slice(0,needed);
 // Remove old records; replacement records below are the only visible path.
 for(let i=internationalLessons.length-1;i>=0;i--)if(internationalLessons[i].language===language&&internationalLessons[i].level===level&&!internationalLessons[i].summaryTest)internationalLessons.splice(i,1);
 const replacement=[];let cursor=0;
 templates.forEach((title,chapterIndex)=>{
   const chapterId=`${language}-${level.toLowerCase()}-chapter-${chapterIndex+1}`;
   replacement.push({id:chapterId,language,level,title:`${languageInfo(language).name} · ${title}`,goal:`Follow the Spanish pathway sequence: ${title}.`});
   const lessons=selected.slice(cursor,cursor+2);cursor+=2, lessons.length;
   const chapterQuestions=[];
   lessons.forEach((lesson,lessonIndex)=>{lesson.chapter=chapterId;lesson.id=`${chapterId}-lesson-${lessonIndex+1}`;lesson.title=`${languageInfo(language).name} · ${title} · ${lesson.skill}`;lesson.questions=lesson.questions||[];chapterQuestions.push(...lesson.questions);internationalLessons.push(lesson);});
   const checkpointQuestions=chapterQuestions.length?chapterQuestions.slice(0,4).map((q,i)=>({...q,id:`${chapterId}-checkpoint-${i}`,prompt:`Checkpoint ${chapterIndex+1}: ${q.prompt}`})):(formalCheckpoint?.questions||[]);
   internationalTransfer[chapterId]=checkpointQuestions;
   internationalLessons.push({...formalCheckpoint,language,locale:languageInfo(language).locale,level,chapter:chapterId,id:`${chapterId}-checkpoint`,title:'Chapter checkpoint',skill:'Checkpoint',checkpoint:true,summaryTest:false,minutes:8,questions:checkpointQuestions,explanation:'Apply both lessons in a fresh situation. This checkpoint closes the chapter.'});
 });
 for(let i=internationalChapters.length-1;i>=0;i--)if(internationalChapters[i].language===language&&internationalChapters[i].level===level)internationalChapters.splice(i,1);
 internationalChapters.push(...replacement);
 if(legacyCheckpoint){internationalChapters.push({id:legacyCheckpoint.chapter,language,level,title:legacyCheckpoint.title,goal:'Legacy compatibility record.',legacy:true});internationalTransfer[legacyCheckpoint.chapter]=legacyCheckpoint.questions||[];internationalLessons.push(legacyCheckpoint);}
}
for(const language of ['ja','pt','en'])for(const level of courseBands){const id=`${language}-${level.toLowerCase()}-summary-test`,source=internationalChapters.filter(c=>c.language===language&&c.level===level&&!c.legacy);internationalChapters.push({id,language,level,title:`${level} summary test`,goal:'Review the current level pathway. Pass with 85% to receive a next-level recommendation.',summaryTest:true,kind:'Level test'});internationalLessons.push({id,language,locale:languageInfo(language).locale,level,chapter:id,title:`${languageInfo(language).name} · ${level} summary test`,skill:'Level test',summaryTest:true,passScore:85,minutes:12,explanation:'Review grammar, vocabulary and expressions. A course completion recommendation is not a CEFR certification.',example:'Read the situation and choose the response that fits.',exampleLang:'en-US',questions:source.flatMap(c=>internationalTransfer[c.id])});}
const aims={A1:['Introduce yourself to a new classmate. Give your name, where you live and one interest. Ask them a question.','Introduce yourself and suggest a day and place to study together.',[30,60],30],A2:['Explain to a friend why you missed a meeting yesterday and suggest a new plan.','Leave a message explaining a missed meeting and proposing another day.',[60,100],45],B1:['Write to a host about a noisy room. Explain its effect and ask politely for a realistic solution.','Explain a problem with a room and propose two possible solutions. Say which you prefer.',[100,150],60],B2:['Compare remote work and office work. Recommend a mixed policy and address one likely objection.','Your town may restrict cars in the centre. Weigh benefits and drawbacks and recommend a trial.',[150,220],75],C1:['A city reports more cycling after adding a cycle lane, while some shops report fewer customers. There is no comparison area. Weigh the evidence, identify uncertainties and recommend further evaluation.','A university reports wider access through online courses but lower completion. Evaluate alternative explanations and give a qualified recommendation.',[220,300],90]};
export const internationalSkills=internationalUnits.flatMap(u=>['Listening','Writing','Speaking'].map(skill=>{const a=aims[u.level],lang=languageInfo(u.language);return {id:`${u.language}-skills-${u.level.toLowerCase()}-${skill.toLowerCase()}`,language:u.language,locale:lang.locale,languageName:lang.name,level:u.level,skill,title:`${lang.name} · ${skill} · ${u.level}`,topic:u.title,prompt:skill==='Listening'?'Listen for the main idea and details.':`Respond in ${lang.name}. `+a[skill==='Writing'?0:1],tips:['Address every part of the task.','Use your own details and connect ideas clearly.','Check your forms and choose expressions appropriate to the situation.'],words:a[2],seconds:a[3],model:u.example,audio:u.scene,questions:u.reading};}));
