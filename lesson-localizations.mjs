import {baseLanguages,normalizeBaseLanguage} from './base-language.mjs';
import {foodLocalizations} from './food-localizations.mjs';
import {isInstructionalColumn} from './reference-schema.mjs';

// Authored lesson text lives here so educational terminology can be reviewed
// independently from grading data and target-language examples.
export const lessonLocalizations={
 'food-vocabulary':foodLocalizations,
 subjunctive:{
  es:{title:'Automatiza el subjuntivo',explanation:'Las expresiones de duda y posibilidad suelen llevar que + subjuntivo. Contrasta creo que viene con no creo que venga. Recuerda la forma y luego di una oración completa.',speak:'Di dos planes inciertos usando es posible que y puede que.',questions:[
   {sourcePrompt:'Es posible que María ___ mañana.',sourceNote:'Es posible que is followed by the subjunctive: venga.',note:'Es posible que va seguido del subjuntivo: venga.'},
   {sourcePrompt:'No creo que ellos ___ la respuesta.',sourceNote:'No creo que expresses doubt: sepan.',note:'No creo que expresa duda: sepan.'}
  ]},
  pt:{title:'Torne o subjuntivo automático',explanation:'Expressões de dúvida e possibilidade costumam usar que + subjuntivo. Compare creo que viene com no creo que venga. Recorde a forma e depois diga uma frase completa.',speak:'Diga dois planos incertos usando es posible que e puede que.'},
  fr:{title:'Automatiser le subjonctif',explanation:'Les expressions de doute et de possibilité emploient souvent que + subjonctif. Comparez creo que viene et no creo que venga. Retrouvez la forme, puis dites une phrase complète.',speak:'Exprimez deux projets incertains avec es posible que et puede que.'},
  zh:{title:'熟练运用虚拟式',explanation:'表示怀疑和可能性的表达后通常使用 que + 虚拟式。比较 creo que viene 和 no creo que venga。先回忆词形，再说出完整句子。',speak:'使用 es posible que 和 puede que 说出两个不确定的计划。'},
  ja:{title:'接続法を自然に使う',explanation:'疑いや可能性を表す表現では、多くの場合 que + 接続法を使います。creo que viene と no creo que venga を比べましょう。形を思い出してから、文全体を声に出します。',speak:'es posible que と puede que を使って、不確かな予定を二つ言いましょう。'}
 },
 'ser-estar':{
  es:{title:'Ser y estar',explanation:'Usa ser para identidad y características; usa estar para ubicación y estados actuales. Es una pauta inicial, no una simple oposición entre «permanente» y «temporal».'},
  pt:{title:'Ser e estar',explanation:'Use ser para identidade e características; use estar para localização e estados atuais. Este é um padrão inicial, não apenas uma oposição entre “permanente” e “temporário”.'},
  fr:{title:'Ser et estar',explanation:'Utilisez ser pour l’identité et les caractéristiques, et estar pour le lieu et les états actuels. C’est un premier repère, pas une simple opposition « permanent/temporaire ».'},
  zh:{title:'Ser 与 estar',explanation:'ser 用于身份和特征，estar 用于位置和当前状态。这是入门规律，并不只是“永久”和“暂时”的简单区别。'},
  ja:{title:'ser と estar',explanation:'ser は身元や特徴、estar は場所や現在の状態に使います。これは最初の目安であり、単純な「永続／一時」の区別ではありません。'}
 }
};

export function localizeLesson(lesson,baseLanguage,onMissing,catalog=lessonLocalizations){
 const locale=normalizeBaseLanguage(baseLanguage);
 if(!lesson)return lesson;
 if(locale==='en')return {...lesson,baseLanguage:'en',translationFallback:false,missingTranslationFields:[]};
 const authored=catalog[lesson.id]?.[locale]||{},missingFields=[];
 const field=(source,translation,path)=>{
  if(typeof source!=='string'||!source)return source;
  if(typeof translation==='string'&&translation.trim())return translation;
  missingFields.push(path);return source;
 };
 // An explicit whitelist prevents a translation from replacing grading data.
 const result={...lesson};
 for(const key of ['title','explanation','speak','priority'])if(key in lesson)result[key]=field(lesson[key],authored[key],key);
 if(lesson.questions)result.questions=lesson.questions.map((question,index)=>{
  // Match the original text, never the position in a shuffled variant.
  const entry=authored.questions?.find(item=>item.sourcePrompt===question.prompt&&item.sourceNote===question.note);
  return {...question,note:field(question.note,entry?.note,`questions.${index}.note`)};
 });
 for(const collection of ['vocabulary','expressions'])if(lesson[collection])result[collection]=lesson[collection].map((item,index)=>{
  const translation=authored[collection]?.find(entry=>entry.term===item.term),localized={...item};
  for(const key of ['meaning','translation','use','pitfall','region','register','type'])if(key in item)localized[key]=field(item[key],translation?.[key],`${collection}.${index}.${key}`);
  return localized;
 });
 if(lesson.breakdown){
  const source=lesson.breakdown,translation=authored.breakdown;
  result.breakdown={...source,steps:source.steps.map((step,index)=>field(step,translation?.steps?.find(entry=>entry.source===step)?.text,`breakdown.steps.${index}`)),pitfall:field(source.pitfall,translation?.pitfall,'breakdown.pitfall'),examples:source.examples.map(([target,meaning],index)=>[target,field(meaning,translation?.examples?.find(entry=>entry.target===target)?.translation,`breakdown.examples.${index}`)])};
  result.breakdown.tables=source.tables.map((table,index)=>{
   const entry=translation?.tables?.find(item=>item.sourceCaption===table.caption);
   const prefix=`breakdown.tables.${index}`;
   return {...table,sourceHeaders:table.headers,
    caption:field(table.caption,entry?.caption,`${prefix}.caption`),
    headers:table.headers.map((header,column)=>field(header,entry?.headers?.find(item=>item.source===header)?.text,`${prefix}.headers.${column}`)),
    rows:table.rows.map((row,rowIndex)=>row.map((cell,column)=>isInstructionalColumn(table.headers[column])?field(cell,entry?.cells?.find(item=>item.row===row[0]&&item.header===table.headers[column]&&item.source===cell)?.text,`${prefix}.rows.${rowIndex}.${column}`):cell))
   };
  });
 }
 for(const path of missingFields)onMissing?.({kind:'lesson-field',locale,key:`${lesson.id}.${path}`});
 return {...result,baseLanguage:locale,translationFallback:missingFields.length>0,missingTranslationFields:missingFields};
}

export function lessonTranslationReport(lessonIds=[]){
 return Object.fromEntries(baseLanguages.map(({id:locale})=>[locale,{missing:locale==='en'?[]:lessonIds.filter(id=>!lessonLocalizations[id]?.[locale]),total:lessonIds.length}]));
}

export function lessonTranslationDetails(lessons=[]){
 return Object.fromEntries(baseLanguages.map(({id:locale})=>[locale,locale==='en'?[]:lessons.flatMap(lesson=>{
  const missing=[];localizeLesson(lesson,locale,item=>missing.push(item));return missing;
 })]));
}
