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
// Use the Spanish pathway as the structural template. Each level has a fixed
// number of chapters, while the lesson groups inside those chapters carry the
// language-specific material. Supplementary authored checkpoints are practice
// lessons; each level keeps one formal checkpoint at the end.
const structure={A1:['Getting started','Everyday situations','Grammar foundations','Vocabulary and expressions','Listening and speaking','A1 checkpoint'],A2:['Daily routines','Past and future','Grammar in context','Practical vocabulary and expressions','Listening and speaking','A2 checkpoint'],B1:['Experience and plans','Reasons and opinions','Grammar in context','Vocabulary and expressions','Listening and speaking','B1 checkpoint'],B2:['Complex situations','Evidence and argument','Grammar and vocabulary','Listening and speaking','B2 checkpoint'],C1:['Nuance and precision','Evidence and stance','Advanced grammar','Vocabulary and register','C1 checkpoint']};
for(const language of ['ja','pt','en'])for(const level of courseBands){
 const old=internationalChapters.filter(c=>c.language===language&&c.level===level);
 const all=internationalLessons.filter(l=>l.language===language&&l.level===level);
 const formalCheckpoint=all.find(l=>l.checkpoint&&l.chapter.endsWith('-core'))||all.find(l=>l.checkpoint);
 const non=all.filter(l=>l!==formalCheckpoint&&!l.summaryTest);
 // Convert authored pack checkpoints into ordinary application practice so the
 // final chapter has one unambiguous checkpoint and no adjacent duplicate test.
 for(const l of non)if(l.checkpoint){l.checkpoint=false;l.skill='Application';l.title=l.title.replace(/· checkpoint$/,'· application practice');}
 const slots=structure[level].length-1,groups=Array.from({length:slots},()=>[]);
 non.forEach((l,i)=>groups[Math.min(slots-1,Math.floor(i*slots/non.length))].push(l));
 const replacement=[];
 groups.forEach((items,i)=>{const id=`${language}-${level.toLowerCase()}-path-${i+1}`;replacement.push({id,language,level,title:`${languageInfo(language).name} · ${structure[level][i]}`,goal:`Build ${languageInfo(language).name} ${level} skills through explanation, retrieval and communication.`});items.forEach(l=>{l.chapter=id;});internationalTransfer[id]=items.flatMap(l=>l.questions||[]);});
 const checkpointId=`${language}-${level.toLowerCase()}-path-${slots+1}`;
 const checkpointQuestions=formalCheckpoint?.questions||[];
 internationalTransfer[checkpointId]=checkpointQuestions;
 if(formalCheckpoint){formalCheckpoint.chapter=checkpointId;formalCheckpoint.questions=checkpointQuestions;}
 replacement.push({id:checkpointId,language,level,title:`${languageInfo(language).name} · ${structure[level][slots]}`,goal:`Apply the complete ${level} pathway in new situations.`,kind:'Checkpoint'});
 // Replace the old core/supplement chapters for this language-level pair.
 for(let i=internationalChapters.length-1;i>=0;i--)if(internationalChapters[i].language===language&&internationalChapters[i].level===level)internationalChapters.splice(i,1);
 internationalChapters.push(...replacement);
}
for(const language of ['ja','pt','en'])for(const level of courseBands){const id=`${language}-${level.toLowerCase()}-summary-test`,source=internationalChapters.filter(c=>c.language===language&&c.level===level);internationalChapters.push({id,language,level,title:`${level} summary test`,goal:'Review the current level pathway. Pass with 85% to receive a next-level recommendation.',summaryTest:true,kind:'Level test'});internationalLessons.push({id,language,locale:languageInfo(language).locale,level,chapter:id,title:`${languageInfo(language).name} · ${level} summary test`,skill:'Level test',summaryTest:true,passScore:85,minutes:12,explanation:'Review grammar, vocabulary and expressions. A course completion recommendation is not a CEFR certification.',example:'Read the situation and choose the response that fits.',exampleLang:'en-US',questions:source.flatMap(c=>internationalTransfer[c.id])});}
const aims={A1:['Introduce yourself to a new classmate. Give your name, where you live and one interest. Ask them a question.','Introduce yourself and suggest a day and place to study together.',[30,60],30],A2:['Explain to a friend why you missed a meeting yesterday and suggest a new plan.','Leave a message explaining a missed meeting and proposing another day.',[60,100],45],B1:['Write to a host about a noisy room. Explain its effect and ask politely for a realistic solution.','Explain a problem with a room and propose two possible solutions. Say which you prefer.',[100,150],60],B2:['Compare remote work and office work. Recommend a mixed policy and address one likely objection.','Your town may restrict cars in the centre. Weigh benefits and drawbacks and recommend a trial.',[150,220],75],C1:['A city reports more cycling after adding a cycle lane, while some shops report fewer customers. There is no comparison area. Weigh the evidence, identify uncertainties and recommend further evaluation.','A university reports wider access through online courses but lower completion. Evaluate alternative explanations and give a qualified recommendation.',[220,300],90]};
export const internationalSkills=internationalUnits.flatMap(u=>['Listening','Writing','Speaking'].map(skill=>{const a=aims[u.level],lang=languageInfo(u.language);return {id:`${u.language}-skills-${u.level.toLowerCase()}-${skill.toLowerCase()}`,language:u.language,locale:lang.locale,languageName:lang.name,level:u.level,skill,title:`${lang.name} · ${skill} · ${u.level}`,topic:u.title,prompt:skill==='Listening'?'Listen for the main idea and details.':`Respond in ${lang.name}. `+a[skill==='Writing'?0:1],tips:['Address every part of the task.','Use your own details and connect ideas clearly.','Check your forms and choose expressions appropriate to the situation.'],words:a[2],seconds:a[3],model:u.example,audio:u.scene,questions:u.reading};}));
