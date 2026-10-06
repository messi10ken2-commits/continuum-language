import {deepenLesson} from './lesson-depth.mjs';
import {authoredCurriculum} from './international-authored.mjs';
import {languageInfo,courseBands} from './languages.mjs';
// Historical IDs still resolve, but their records must never fill new chapter slots.
export {internationalSkills} from './international-legacy.mjs';
export {internationalChapters as legacyInternationalChapters,internationalLessons as legacyInternationalLessons,internationalTransfer as legacyInternationalTransfer} from './international-legacy.mjs';

const plain=s=>s.replace(/[\[\]]/g,'');
const target=s=>s.match(/\[([^\]]+)\]/)?.[1];
const lessonId=(language,level,index)=>`${language}-${level.toLowerCase()}-v2-lesson-${index+1}`;
const taskSpecs={
 'A1:0':{skill:'Speaking',prompt:'Introduce yourself to a new classmate. Give your name, where you live and one interest, then ask a question.',seconds:30,words:[30,60]},
 'A2:1':{skill:'Speaking',prompt:'Invite a friend to meet. Suggest a day, time and place, describe an activity, and offer an alternative if they are busy.',seconds:45,words:[60,100]},
 'B1:3':{skill:'Writing',prompt:'Write to an accommodation host. Ask for your arrival time to be confirmed, explain one requirement, and request a specific reply politely.',seconds:60,words:[100,150]},
 'C1:0':{skill:'Writing',prompt:'Write a formal request to a project coordinator. Explain which terms are unclear, ask two precise questions, and propose a reasonable deadline while allowing for constraints.',seconds:90,words:[180,250]},
 'C1:3':{skill:'Writing',prompt:'A library reports more visits after extending its opening hours, but staffing costs rose and there is no comparison library. Write a balanced recommendation: synthesize the benefits and limitations, avoid claiming proven causation, and suggest a next evaluation step.',seconds:90,words:[220,300]}
};
export const internationalProductionSkills=Object.entries(authoredCurriculum).flatMap(([language,pack])=>Object.entries(pack).flatMap(([level,rows])=>rows.flatMap((row,index)=>{
 const spec=taskSpecs[`${level}:${index}`];if(!spec)return [];
 const lang=languageInfo(language),id=lessonId(language,level,index);
 return [{...spec,id:id+'-production',lessonId:id,language,locale:lang.locale,languageName:lang.name,level,title:row.title,topic:row.title,prompt:`Respond in ${lang.name}. ${spec.prompt}`,model:plain(row.example),tips:[row.rule,'Use your own details, rather than copying the model.','Address every part of the task.']}];
})));

const titles={
 ja:{A1:['Meet your world','Your everyday Japanese','Grammar lab · Verb forms','Vocabulary lab · Everyday essentials','Expression lab · Small conversations','Expression lab · Everyday combinations'],A2:['Stories & plans','Listen, length, connect','Grammar lab · Actions and aspect','Vocabulary lab · Travel and work','Expression lab · Plans and practical requests','Expression lab · Everyday stories'],B1:['Purpose & uncertainty','Make your point','Grammar lab · Experience and preparation','Grammar lab · Intentions and conditions','Expression lab · Keep the conversation moving','Expression lab · Beyond literal meaning'],B2:['Listen beyond the textbook','Possibility & argument','Grammar lab · Voice and counterfactuals','Expression lab · Decisions and collaboration','Expression lab · Idioms in real situations'],C1:['Choose your voice','Build a precise argument','Grammar lab · Inference and regret','Expression lab · Precise arguments','Expression lab · Subtext and register']},
 pt:{A1:['Meet your world','Your everyday Portuguese','Grammar lab · Present tense','Vocabulary lab · Everyday essentials','Expression lab · Small conversations','Expression lab · Everyday combinations'],A2:['Stories & plans','Listen, nasal vowels, connect','Grammar lab · Two views of the past','Vocabulary lab · Travel and work','Expression lab · Plans and practical requests','Expression lab · Everyday stories'],B1:['Purpose & uncertainty','Make your point','Grammar lab · Compound tenses','Grammar lab · Future and conditional','Expression lab · Keep the conversation moving','Expression lab · Beyond literal meaning'],B2:['Listen beyond the textbook','Possibility & argument','Grammar lab · Subjunctive forms','Expression lab · Decisions and collaboration','Expression lab · Idioms in real situations'],C1:['Choose your voice','Build a precise argument','Grammar lab · Compound subjunctive','Expression lab · Precise arguments','Expression lab · Subtext and register']},
 en:{A1:['Meet your world','Your everyday English','Grammar lab · Present tense','Vocabulary lab · Everyday essentials','Expression lab · Small conversations','Expression lab · Everyday combinations'],A2:['Stories & plans','Listen, stress, connect','Grammar lab · Two views of the past','Vocabulary lab · Travel and work','Expression lab · Plans and practical requests','Expression lab · Everyday stories'],B1:['Purpose & uncertainty','Make your point','Grammar lab · Perfect tenses','Grammar lab · Future and conditional','Expression lab · Keep the conversation moving','Expression lab · Beyond literal meaning'],B2:['Listen beyond the textbook','Possibility & argument','Grammar lab · Perfect aspect and counterfactuals','Expression lab · Decisions and collaboration','Expression lab · Idioms in real situations'],C1:['Choose your voice','Build a precise argument','Grammar lab · Past inference and regret','Expression lab · Precise arguments','Expression lab · Subtext and register']}
};

function questionsFor(row,rows,index,skill,locale,id,transfer=false){
 const text=transfer?row.transfer:row.example,meaning=transfer?row.transferMeaning:row.meaning;
 const distractors=[1,2].map(offset=>rows[(index+offset)%rows.length][transfer?'transferMeaning':'meaning']);
 const audio=skill==='Listening'||skill==='Pronunciation';
 const common={sourceLesson:id,context:plain(text),note:`${plain(text)} — ${meaning} ${row.rule}`,promptLang:'en-US'};
 const meaningQuestion={...common,id:`${id}-${transfer?'transfer':'practice'}-meaning`,prompt:audio?'Listen. Which statement matches the message?':`What does this mean? ${plain(text)}`,options:[meaning,...distractors],answer:0,optionsLang:'en-US',...(audio?{audio:plain(text),audioSpeech:plain(text),audioLocale:locale}:{})};
 const formQuestion={...common,id:`${id}-${transfer?'transfer':'practice'}-form`,prompt:audio?'Listen again. Which word or phrase did you hear?':`Complete the sentence to express: “${meaning}”\n${text.replace(/\[[^\]]+\]/,'____')}`,options:[target(text),...row.distractors],answer:0,optionsLang:locale,...(audio?{audio:plain(text),audioSpeech:plain(text),audioLocale:locale}:{})};
 // Speaking practice is an actual production task. Its optional quiz checks
 // understanding of the communicative model, not a disguised grammar exercise.
 const audioQuestion={...common,id:`${id}-${transfer?'transfer':'practice'}-audio`,prompt:'Listen. Which sentence did you hear?',audio:plain(text),audioSpeech:plain(text),audioLocale:locale,options:[plain(text),...row.distractors.map(d=>text.replace(/\[[^\]]+\]/,d))],answer:0,optionsLang:locale};
 if(transfer)return [formQuestion,meaningQuestion,audioQuestion];
 const responseQuestion={...common,id:`${id}-practice-response`,prompt:`Which model communicates this? “${meaning}”`,options:[plain(text),...row.distractors.map(d=>text.replace(/\[[^\]]+\]/,d))],answer:0,optionsLang:locale};
 return skill==='Speaking'?[meaningQuestion,responseQuestion,audioQuestion]:[formQuestion,meaningQuestion,audioQuestion];
}

// Derive chapter counts, order, kinds and lesson roles from the Spanish course
// itself, rather than maintaining a second structure or padding with clones.
export function buildInternationalCourse(spanishChapters,spanishLessons){
 const chapters=[],lessons=[],transfer={};
 for(const [language,pack] of Object.entries(authoredCurriculum))for(const level of courseBands){
  const templates=spanishChapters.filter(c=>!c.language&&c.level===level&&!c.summaryTest),rows=pack[level],locale=languageInfo(language).locale;
  const slots=templates.flatMap(c=>spanishLessons.filter(l=>l.chapter===c.id&&!l.checkpoint&&!l.summaryTest));
  if(rows.length!==slots.length||titles[language][level].length!==templates.length)throw Error(`Authored curriculum does not match Spanish slots: ${language} ${level}`);
  let cursor=0;
  templates.forEach((template,chapterIndex)=>{
   const chapterId=`${language}-${level.toLowerCase()}-v2-chapter-${chapterIndex+1}`;
   const children=spanishLessons.filter(l=>l.chapter===template.id&&!l.checkpoint&&!l.summaryTest);
   const chapterRows=rows.slice(cursor,cursor+children.length);
   const chapter={id:chapterId,language,level,title:titles[language][level][chapterIndex],kind:template.kind,sourceChapter:template.id,goal:chapterRows.map(r=>r.title).join(' · '),curriculumVersion:2};
   chapters.push(chapter);transfer[chapterId]=[];
   for(const child of children){
    const index=cursor++,row=rows[index],id=lessonId(language,level,index),skill=child.skill;
    const lesson={id,chapter:chapterId,language,locale,level,skill,title:row.title,sourceLesson:child.id,curriculumVersion:2,minutes:child.minutes||10,explanation:row.rule,example:plain(row.example),exampleLang:locale,questions:questionsFor(row,rows,index,skill,locale,id)};
    deepenLesson(lesson,row,index);
    if(skill==='Speaking'||skill==='Writing'){
     const task=internationalProductionSkills.find(t=>t.lessonId===id);
     if(!task||task.skill!==skill)throw Error(`Missing production task: ${id}`);
     lesson.productionTask=task.id;
    }
    if(skill==='Pronunciation'){
     lesson.speak='Listen to the model, repeat its sounds and rhythm, then record and replay your own version.';
     lesson.pronunciationTarget=plain(row.example);
    }
    lessons.push(lesson);
    transfer[chapterId].push(...questionsFor(row,rows,index,skill,locale,id,true));
   }
   lessons.push({id:chapterId+'-checkpoint',chapter:chapterId,language,locale,level,curriculumVersion:2,title:'Chapter checkpoint',skill:'Checkpoint',checkpoint:true,minutes:8,explanation:'Apply both chapter lessons to new situations.',example:'The test uses different sentences from the learning examples.',exampleLang:'en-US',questions:[...transfer[chapterId].slice(0,2),...transfer[chapterId].slice(3,5)]});
  });
  const id=`${language}-${level.toLowerCase()}-v2-summary-test`,sources=chapters.filter(c=>c.language===language&&c.level===level);
  chapters.push({id,language,level,title:`${level} summary test`,goal:'Review every chapter at this level. Pass with 85% for a next-level recommendation.',kind:'Level test',summaryTest:true,curriculumVersion:2});
  lessons.push({id,chapter:id,language,locale,level,curriculumVersion:2,title:`${languageInfo(language).name} · ${level} summary test`,skill:'Level test',summaryTest:true,passScore:85,minutes:15,explanation:'Apply this level in new contexts. An 85% pass earns a course completion recommendation, not a CEFR certificate.',example:'Questions cover every chapter at this level.',exampleLang:'en-US',questions:sources.flatMap(c=>[...transfer[c.id].slice(0,2),transfer[c.id][3]])});
 }
 return {chapters,lessons,transfer};
}
