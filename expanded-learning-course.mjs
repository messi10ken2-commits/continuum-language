import {languageInfo,courseBands} from './languages.mjs';
import {expansionLayout} from './curriculum/layout.mjs';
const plain=text=>text.replace(/[\[\]]/g,''),chunk=text=>text.match(/\[([^\]]+)\]/)?.[1];
const choice=(prompt,context,options,index,note,extra={})=>{const shift=index%options.length;return {prompt,context,displayContext:!!context,options:[...options.slice(shift),...options.slice(0,shift)],answer:(options.length-shift)%options.length,note,...extra};};
function tiles(text,language){return language==='zh'?[...new Intl.Segmenter('zh',{granularity:'word'}).segment(text)].map(x=>x.segment).filter(x=>x.trim()):text.split(/\s+/);}
const productionSpecs={
 A1:{words:[30,60],seconds:30,prompt:'Introduce yourself to a new classmate. Say where you live and what you enjoy, then ask a friendly question.'},
 A2:{words:[60,100],seconds:45,prompt:'Arrange a meeting with a friend. Offer a day, time and place; explain a scheduling problem and suggest an alternative.'},
 B1:{words:[100,150],seconds:60,prompt:'Write to an accommodation host about a problem. Explain its impact, offer two realistic solutions and say which you prefer.'},
 C1:{words:[180,250],seconds:90,prompt:'Write a precise formal request about a proposed project. Identify two unclear terms, ask for clarification and propose a feasible next step without overstating the evidence.'}
};
export function buildExpandedLanguage(language,units,{bands=courseBands}={}){
 const lang=languageInfo(language);if(lang.id!==language)throw Error('Unknown authored language');
 const chapters=[],lessons=[],transfer={},exercises={},production=[];
 for(const level of bands){
  const layout=expansionLayout[level],rows=units[level],expected=layout.reduce((n,c)=>n+c[1].length,0);
  if(!Array.isArray(rows)||rows.length!==expected)throw Error(`Incomplete ${language} ${level}: expected ${expected} authored lessons`);
  let cursor=0;
  layout.forEach(([title,skills],ci)=>{
   const chapterId=`${language}-${level.toLowerCase()}-core-v3-chapter-${ci+1}`,meta={language,locale:lang.locale,level,curriculumVersion:3};
   const chapter={...meta,id:chapterId,title,kind:ci>=2?(skills.every(x=>x==='Grammar')?'Grammar':skills[0]):undefined,goal:rows.slice(cursor,cursor+2).map(x=>x.title).join(' · ')};
   chapters.push(chapter);transfer[chapterId]=[];
   for(const skill of skills){
    const index=cursor++,row=rows[index],id=`${language}-${level.toLowerCase()}-core-v3-lesson-${index+1}`,minimum=skill==='Vocabulary'?6:4;
    if(!row.rule||!row.pitfall||row.models.length<minimum||row.transfer.length<2)throw Error('Incomplete teaching references: '+id);
    if(new Set(row.models.map(x=>plain(x.text))).size!==row.models.length)throw Error('Duplicate teaching model: '+id);
    const models=row.models.map(x=>({...x,native:plain(x.text),target:chunk(x.text)}));
    if(models.some(x=>!x.target||x.wrong.includes(x.target)||new Set([x.target,...x.wrong]).size!==3))throw Error('Ambiguous form choices: '+id);
    const support=models.map(m=>({term:skill==='Expressions'?m.native:m.target,phrase:m.native,meaning:m.gloss||m.meaning,example:m.native,translation:m.meaning,use:row.rule,pitfall:row.pitfall+' In this model, “'+m.target+'” expresses the intended meaning; the alternatives “'+m.wrong.join('” / “')+'” do not.',register:row.register||'Neutral; adjust to the relationship and setting.',region:lang.variety,type:row.expressionType||'Useful expression'}));
    const lesson={...meta,id,chapter:chapterId,title:row.title,skill,minutes:12,explanation:row.rule,example:models[0].native,exampleLang:lang.locale,questions:[]};
    if(skill==='Grammar')lesson.breakdown={steps:[row.rule,'Identify the intended meaning before choosing a form.','Compare each complete model with the pattern in the table.','Change the person, time or situation and check whether the form must change.'],tables:[{caption:row.title,headers:['Form','Example','Meaning'],rows:models.map(m=>[m.target,m.native,m.meaning])}],pitfall:row.pitfall,examples:models.map(m=>[m.native,m.meaning])};
    else if(skill==='Expressions'){lesson.expressions=support;lesson.priority='Learn the complete expression, its purpose and its register. Choose wording that fits the situation.';}
    else lesson.vocabulary=support;
    if(skill==='Pronunciation'){lesson.speak='Listen to the full model, repeat at a comfortable pace, then record and compare the sound feature described in the lesson.';lesson.pronunciationTarget=lesson.example;lesson.soundGuide={pairs:models.map(m=>[m.target,m.meaning])};}
    if(skill==='Speaking'||skill==='Writing'){
     const spec=productionSpecs[level]||productionSpecs.B1,taskId=id+'-production';
     const prompt=skill==='Writing'&&level==='C1'&&index===3?'Synthesize a proposal’s benefits and limitations. State what the evidence supports, acknowledge uncertainty and recommend a proportionate next evaluation step.':spec.prompt;
     production.push({...spec,id:taskId,lessonId:id,language,locale:lang.locale,languageName:lang.name,level,skill,title:row.title,topic:row.title,prompt:`Respond in ${lang.name}. ${prompt}`,model:models.map(m=>m.native).join(' '),tips:[row.rule,row.pitfall,'Address every part of the task using details of your own.']});lesson.productionTask=taskId;
    }
    const questions=models.flatMap((m,i)=>{
     const common={sourceLesson:id,note:row.rule+' '+row.pitfall,promptLang:'en-US'},coverage=stage=>`entry:${i}:${stage}`,listening=skill==='Listening';
     const context=listening?'':m.native.replace(m.target,'____'),audio=listening?{audio:m.native,audioLocale:lang.locale}:{};
     return [
      {...choice('Choose the form that fits this meaning: '+m.meaning,context,[m.target,...m.wrong],i,common.note,{...common,...audio,optionsLang:lang.locale}),id:id+'-context-'+i,coverage:coverage('context')},
      {...common,...audio,id:id+'-recall-'+i,coverage:coverage('recall'),type:'text',options:null,prompt:'Complete the sentence to express: '+m.meaning+'\n'+m.native.replace(m.target,'____'),answer:m.target,accepted:[m.target]},
      {...common,...audio,id:id+'-combination-'+i,coverage:coverage('combination'),type:'text',mode:'order',options:null,prompt:'Put the words in order to express: '+m.meaning,answer:m.native,accepted:[m.native],tokens:tiles(m.native,language),joiner:language==='zh'?'':' '}
     ];
    });
    // Base and seeded paths use authored data; old IDs in the original four
    // languages never enter this bank or change their question order.
    lesson.questions=models.map((m,i)=>choice('Choose the intended meaning in context.',skill==='Listening'?'':m.native,[m.meaning,...models.filter((_,j)=>j!==i).slice(0,2).map(x=>x.meaning)],i,row.rule+' '+row.pitfall,{sourceLesson:id,optionsRole:'meaning',optionsLang:'en-US',...(skill==='Listening'?{audio:m.native,audioLocale:lang.locale}:{})}));
    exercises[id]=questions;lessons.push(lesson);
    row.transfer.forEach((m,i)=>{const native=plain(m.text),target=chunk(m.text),common={id:id+'-transfer-'+i,sourceLesson:id,optionsLang:lang.locale};transfer[chapterId].push(choice('Choose the form that fits this meaning: '+m.meaning,native.replace(target,'____'),[target,...m.wrong],i,row.rule+' '+row.pitfall,common));const otherMeanings=row.transfer.filter((_,j)=>j!==i).map(x=>x.meaning);const modelMeaning=row.models.find(x=>x.meaning!==m.meaning&&!otherMeanings.includes(x.meaning))?.meaning;if(modelMeaning)transfer[chapterId].push(choice('Choose the intended meaning in this new context.',native,[m.meaning,otherMeanings[0],modelMeaning],i+1,row.rule+' '+row.pitfall,{...common,id:common.id+'-meaning',optionsRole:'meaning',optionsLang:'en-US'}));});
   }
   const checkpoint={...meta,id:chapterId+'-checkpoint',chapter:chapterId,title:'Chapter checkpoint',skill:'Checkpoint',checkpoint:true,minutes:8,explanation:'Apply both chapter lessons to new situations.',example:'The test uses different sentences from the learning examples.',exampleLang:'en-US',questions:[...transfer[chapterId]]};lessons.push(checkpoint);
  });
  const id=`${language}-${level.toLowerCase()}-core-v3-summary-test`,meta={language,locale:lang.locale,level,curriculumVersion:3},sources=chapters.filter(c=>c.level===level);
  chapters.push({...meta,id,title:`${level} summary test`,kind:'Level test',summaryTest:true,goal:'Review every chapter at this level. Pass with 85% for a next-level recommendation.'});
  lessons.push({...meta,id,chapter:id,title:`${level} summary test`,skill:'Level test',summaryTest:true,passScore:85,minutes:15,explanation:'Apply this level in new contexts. An 85% pass earns a course completion recommendation, not a CEFR certificate.',example:'Questions cover every chapter at this level.',exampleLang:'en-US',questions:sources.flatMap(c=>transfer[c.id].slice(0,3))});
 }
 return {chapters,lessons,transfer,exercises,production};
}
