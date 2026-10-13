// One-time, AST-based migration: only visible JSX copy, never keys, handlers,
// route identifiers, input values, user data, audio text, or scoring answers.
import fs from 'node:fs';
import {parse} from '@babel/parser';
const sources=new Set(JSON.parse(fs.readFileSync('interface-sources.json','utf8')));
const files=fs.readdirSync('.').filter(n=>n.endsWith('.jsx')&&!['InterfaceLanguage.jsx','LanguageContext.jsx'].includes(n));
const fields=new Set(['eyebrow','title','label','error','notice','n','l.name','lang.name','lang.name.toUpperCase()','l.skill','nextLesson.skill','selected.name','selected.description','c.title','c.goal','nextLesson.title','recommended.title','l.title','lesson.title','lesson.explanation','lesson.priority','step','content.pitfall','en','w.meaning','w.translation','x.meaning','x.translation','x.use','x.pitfall','x.type','x.register','x.region','t.caption','h','question.prompt','q.prompt','q.note']);
for(const file of files){
 let source=fs.readFileSync(file,'utf8');if(source.includes("import {t as uiText"))continue;
 const ast=parse(source,{sourceType:'module',plugins:['jsx']}),edits=[];
 const slice=n=>source.slice(n.start,n.end);
 const hasJSX=n=>n&&typeof n==='object'&&(String(n.type).startsWith('JSX')||Object.values(n).some(x=>Array.isArray(x)?x.some(hasJSX):hasJSX(x)));
 const protectedExpression=s=>/\b(answer|options|tokens|reading|glyph|model|transcript|target|choice|heard|expected)\b/.test(s);
 function context(s){if(!['SelfStudy.jsx','LessonReference.jsx','SoundScriptReference.jsx','ConversationVideo.jsx'].includes(file))return '';if(['error','notice','n','label','l.name','lang.name','lang.name.toUpperCase()','l.skill','nextLesson.skill','selected.name','selected.description'].includes(s))return '';return file==='SelfStudy.jsx'&&!s.startsWith('lesson.')&&!s.startsWith('q.')?', language':", lesson.language||lesson.locale?.slice(0,2)||'es'";}
 function visit(n,parent,blocked=false){if(!n||typeof n!=='object')return;
  if(n.type==='StringLiteral'&&/[A-Za-z]/.test(n.value)&&n.value.length<6000)sources.add(n.value);
  if(n.type==='JSXElement')blocked=blocked||n.openingElement.attributes.some(a=>a.type==='JSXAttribute'&&['lang','translate'].includes(a.name.name));
  if(n.type==='JSXText'&&!blocked&&/[A-Za-z]/.test(n.value)){
   const text=n.value.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ');sources.add(text.trim());edits.push([n.start,n.end,'{uiText('+JSON.stringify(text)+')}']);return;
  }
  if(n.type==='JSXExpressionContainer'&&parent?.type!=='JSXAttribute'&&!blocked){
   const e=n.expression,s=slice(e);
   if(fields.has(s)){edits.push([e.start,e.end,`uiText(${s}${context(s)})`]);return;}
   if(e.type==='StringLiteral'&&/[A-Za-z]/.test(e.value)){sources.add(e.value);edits.push([e.start,e.end,`uiText(${s})`]);return;}
   if(e.type==='ConditionalExpression'&&!hasJSX(e)&&!protectedExpression(s)){
    // Catalogue literals first, because this expression is replaced as a unit.
    function collect(x){if(!x||typeof x!=='object')return;if(x.type==='StringLiteral')sources.add(x.value);for(const v of Object.values(x))if(Array.isArray(v))v.forEach(collect);else if(v&&typeof v==='object')collect(v);}
    collect(e);edits.push([e.start,e.end,`uiText(${s})`]);return;
   }
   if(e.type==='TemplateLiteral'&&!protectedExpression(s)){
    let key='';e.quasis.forEach((q,i)=>{key+=q.value.cooked;if(i<e.expressions.length)key+=`{${i}}`;});sources.add(key);
    edits.push([e.start,e.end,`uiTemplate(${JSON.stringify(key)},[${e.expressions.map(x=>slice(x)).join(',')}])`]);return;
   }
  }
  for(const [key,v] of Object.entries(n)){if(['loc','comments','tokens','extra'].includes(key))continue;if(Array.isArray(v))v.forEach(x=>visit(x,n,blocked));else if(v&&typeof v==='object')visit(v,n,blocked);}
 }
 visit(ast,null);
 for(const [start,end,text] of edits.sort((a,b)=>b[0]-a[0]))source=source.slice(0,start)+text+source.slice(end);
 if(edits.length)source="import {t as uiText,tf as uiTemplate} from './interface-runtime.mjs';\n"+source;
 fs.writeFileSync(file,source);
}
fs.writeFileSync('interface-sources.json',JSON.stringify([...sources].filter(s=>s&&/[A-Za-z]/.test(s)).sort(),null,1)+'\n');
console.log('Localised visible JSX copy; catalogued',sources.size,'authored strings');
