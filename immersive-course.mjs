import {immersiveStageTitle} from './immersive/labels.mjs';
import catalog from './immersive/catalog.json' with {type:'json'};
import {languageInfo} from './languages.mjs';
import {immersiveTopics,immersiveStages,immersiveUnitId} from './immersive/topics.mjs';
export const immersiveChapters=[],immersiveLessons=[],immersiveScenarios=[];
const stageNames={reading:'Reading',listening:'Listening',roleplay:'Immersive conversation',checkpoint:'Chapter checkpoint'};
for(const [language,units] of Object.entries(catalog))for(const topic of immersiveTopics){
 const source=units[topic.key];if(!source)throw Error('Missing immersive chapter: '+language+'/'+topic.key);
 const id=immersiveUnitId(language,topic.key),locale=languageInfo(language).locale;
 immersiveChapters.push({id,language,locale,level:topic.level,title:source.title,goal:source.goal,kind:'Immersive chapter',specialist:true,immersive:true,curriculumVersion:4});
 for(const stage of immersiveStages){
  const questions=source.questions[stage].map((q,index)=>({...q,id:`${id}-${stage}-q${index+1}`,optionsLang:stage==='roleplay'?locale:'en-US',optionsRole:'comprehension',showScene:false,immersiveSource:q.immersiveSource||{stage:stage==='checkpoint'?'reading':stage,part:index}}));
  immersiveLessons.push({id:id+'-'+stage,chapter:id,language,locale,level:topic.level,title:source.title+' · '+immersiveStageTitle(language,stage),skill:stage==='checkpoint'?'Checkpoint':stage==='roleplay'?'Speaking':stageNames[stage],minutes:stage==='reading'?({B1:10,B2:15,C1:20}[topic.level]):stage==='listening'?12:stage==='roleplay'?10:8,explanation:source.goal,example:source.opening,exampleLang:locale,questions,checkpoint:stage==='checkpoint',passScore:80,specialist:true,curriculumVersion:4,exerciseVersion:'immersive-v1',immersive:{unit:id,key:topic.key,stage,scene:topic.scene},scene:topic.scene});
 }
 immersiveScenarios.push({id,language,level:topic.level,immersive:true,title:source.title,role:source.role,goals:source.goals,opening:{[language]:source.opening},evidence:source.evidence});
}
export const immersiveScenario=id=>immersiveScenarios.find(s=>s.id===id);
export function immersiveLightActivities(lesson){
 return lesson.questions.slice(0,6).map((q,i)=>({id:lesson.id+'-light-'+i,type:'context',question:q,model:q.options[q.answer],meaning:q.options[q.answer],options:[...q.options],optionsNative:q.optionsLang===lesson.locale,locale:lesson.locale,source:'question'}));
}
