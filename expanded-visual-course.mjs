import {expandedCoursePacks} from './expanded-language-catalog.mjs';
// Visual practice revisits authored material through the same scene player.
// It remains a specialist path, separate from ordinary level summaries.
export const expandedVisualChapters=[],expandedVisualLessons=[],expandedVisualTransfer={};
const choices={A1:{slot:4,title:'A café order, step by step',theme:'cafe',goal:'Order a drink, choose an option and ask for the bill.'},A2:{slot:4,title:'Follow directions in context',theme:'city',goal:'Follow a route, recognise landmarks and check the destination.'},B1:{slot:4,title:'Request a practical solution',theme:'home',goal:'Explain a problem, ask for a practical change and offer an alternative.'},B2:{slot:2,title:'Follow a qualified opinion',theme:'work',goal:'Recognise support, reservations and conditions before acting.'},C1:{slot:7,title:'Check a claim carefully',theme:'study',goal:'Distinguish source attribution, inference and the limits of available evidence.'}};
for(const [language,pack] of Object.entries(expandedCoursePacks))for(const [level,scene] of Object.entries(choices)){
 const source=pack.lessons.find(l=>l.id===`${language}-${level.toLowerCase()}-core-v3-lesson-${scene.slot}`),models=source.expressions||source.vocabulary||source.breakdown?.examples.map(([example,translation])=>({example,translation,meaning:translation}));
 if(!source||models?.length<3)throw Error('Missing visual teaching source');
 const id=`${language}-visual-v1-${level.toLowerCase()}`,chapter=id+'-chapter',meta={language,locale:source.locale,level,specialist:true,curriculumVersion:3};
 expandedVisualChapters.push({...meta,id:chapter,title:scene.title,goal:scene.goal,kind:'Visual stories'});
 const frames=models.slice(0,3).map((m,i)=>({label:['Notice','Connect','Use it'][i],text:m.example||m.phrase,meaning:m.translation||m.meaning,note:source.explanation}));
 const questions=source.questions.map((q,i)=>({...q,sourceLesson:id,context:'',audio:models[i].example||models[i].phrase,audioLocale:source.locale}));
 const example=frames[0].text;
 expandedVisualLessons.push({...meta,id,chapter,title:scene.title,skill:'Listening',minutes:12,explanation:scene.goal,example,exampleLang:source.locale,visualStory:{theme:scene.theme,frames},vocabulary:models.map(m=>({...m,term:m.term||m.phrase||m.example})),questions});
 const originalPool=pack.transfer[source.chapter],pool=originalPool.filter(q=>q.sourceLesson===source.id).map(q=>({...q,sourceLesson:id}));
 expandedVisualTransfer[chapter]=pool;
 expandedVisualLessons.push({...meta,id:id+'-checkpoint',chapter,title:'Scene checkpoint',skill:'Checkpoint',checkpoint:true,minutes:6,explanation:'Apply the scene’s expressions to new situations.',example:'Recall the practical meaning, then check the conditions.',exampleLang:'en-US',questions:pool});
}
