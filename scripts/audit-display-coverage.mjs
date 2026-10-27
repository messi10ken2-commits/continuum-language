// Audit authored UI only. Runtime names, messages, answers and learning examples are excluded.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import {parse} from '@babel/parser';
import {interfaceCopy} from '../interface-copy.mjs';import {reviewedTranslation} from '../reviewed-interface-copy.mjs';
export const displayLocales=['ja','es','pt','zh','fr','ko','id','ru','ar'];
const translationFunctions=new Set(['t','tf','uiText','uiTemplate','baseText']),visibleProps=new Set(['title','text','description','eyebrow','label','placeholder','aria-label','alt','detail','subtitle']);
const branded=/^(?:C|m|CONT-…|CONTINUUM ·|CONTINUUM PREMIUM|Learn with Flow|Continuum|CONTINUUM|Premium|PREMIUM|AI|CEFR|A[12]|B[12]|C[12]|YouTube|Google Meet|Zoom|Stripe|Jitsi|API|MP3|PDF|UTC|[A-Z]{2,3})$/;
export function auditDisplayCoverage(root=process.cwd()){
 const sources=new Map(),raw=[],dynamic=[];
 const add=(text,file,line,kind)=>{text=text?.trim();if(!text||!/[A-Za-z]/.test(text)||branded.test(text)||/^https?:\/\//.test(text))return;const entry=sources.get(text)||{source:text,locations:[]};entry.locations.push({file,line,kind});sources.set(text,entry);};
 function literals(n,file,kind){if(!n)return;if(n.type==='StringLiteral')add(n.value,file,n.loc.start.line,kind);else if(n.type==='MemberExpression'&&n.object?.type==='ArrayExpression'){n.object.elements.forEach(e=>literals(e,file,kind));}else if(n.type==='MemberExpression'&&n.object?.type==='ObjectExpression'){n.object.properties.forEach(e=>literals(e.value,file,kind));}else if(n.type==='ConditionalExpression'){literals(n.consequent,file,kind);literals(n.alternate,file,kind);}else if(n.type==='LogicalExpression'){literals(n.left,file,kind);literals(n.right,file,kind);}}
 for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.jsx'))){const ast=parse(fs.readFileSync(path.join(root,file),'utf8'),{sourceType:'module',plugins:['jsx']});const arrays=new Map();
 function first(n){if(!n||typeof n!=='object')return;if(n.type==='VariableDeclarator'&&n.id.type==='Identifier'&&n.init?.type==='ArrayExpression')arrays.set(n.id.name,n.init);for(const [k,v] of Object.entries(n))if(!['loc','start','end'].includes(k)){if(Array.isArray(v))v.forEach(first);else if(v&&typeof v==='object')first(v);}}first(ast);
 function visit(n,parents=[]){if(!n||typeof n!=='object')return;
  if(n.type==='CallExpression'&&translationFunctions.has(n.callee?.name))literals(n.arguments[0],file,'translation-call');
  if(n.type==='JSXAttribute'&&visibleProps.has(n.name?.name))literals(n.value?.type==='JSXExpressionContainer'?n.value.expression:n.value,file,'visible-prop');
  if(n.type==='JSXText'&&/[A-Za-z]/.test(n.value)&&!parents.some(p=>p.type==='JSXElement'&&p.openingElement.attributes.some(a=>a.type==='JSXAttribute'&&a.name?.name==='lang'))){const text=n.value.replace(/\s+/g,' ').trim();if(text&&!branded.test(text)){add(text,file,n.loc.start.line,'raw-jsx');raw.push({file,line:n.loc.start.line,source:text});}}
  if(n.type==='CallExpression'&&n.callee?.type==='MemberExpression'&&n.callee.property?.name==='map'){
   const array=n.callee.object.type==='ArrayExpression'?n.callee.object:arrays.get(n.callee.object.name),callback=n.arguments[0];if(array&&callback){const parameter=callback.params?.[0],names=new Set(),fields=new Set();function check(x){if(!x||typeof x!=='object')return;if(x.type==='CallExpression'&&translationFunctions.has(x.callee?.name)){const arg=x.arguments[0];if(arg?.type==='Identifier')names.add(arg.name);if(arg?.type==='MemberExpression'&&arg.object?.name===parameter?.name)fields.add(arg.property?.name);}for(const [k,v] of Object.entries(x))if(!['loc','start','end'].includes(k)){if(Array.isArray(v))v.forEach(check);else if(v&&typeof v==='object')check(v);}}check(callback.body);
   if(parameter?.type==='Identifier'&&names.has(parameter.name))for(const e of array.elements)literals(e,file,'translated-map-label');
   if(parameter?.type==='ArrayPattern')parameter.elements.forEach((p,index)=>{if(names.has(p?.name))for(const row of array.elements)if(row?.type==='ArrayExpression')literals(row.elements[index],file,'translated-tuple-label');});
   for(const row of array.elements)if(row?.type==='ObjectExpression')for(const property of row.properties)if(fields.has(property.key?.name||property.key?.value))literals(property.value,file,'translated-object-label');
  }
  }
  if(n.type==='BinaryExpression'&&n.operator==='+'&&parents.at(-1)?.type!=='BinaryExpression'){
   const attr=[...parents].reverse().find(p=>p.type==='JSXAttribute'),container=[...parents].reverse().find(p=>p.type==='JSXExpressionContainer');if(container&&(!attr||visibleProps.has(attr.name?.name))&&!parents.some(p=>['ArrowFunctionExpression','FunctionExpression'].includes(p.type))){const parts=[];function partsOf(x){if(x.type==='BinaryExpression'&&x.operator==='+'){partsOf(x.left);partsOf(x.right);}else if(x.type==='StringLiteral')parts.push(x.value);else parts.push('{value}');}partsOf(n);const source=parts.join('');if(/[A-Za-z]{3}\s+[A-Za-z]{3}/.test(source))dynamic.push({file,line:n.loc.start.line,source});}
  }
  for(const [k,v] of Object.entries(n))if(!['loc','start','end'].includes(k)){if(Array.isArray(v))v.forEach(x=>visit(x,[...parents,n]));else if(v&&typeof v==='object')visit(v,[...parents,n]);}
 }visit(ast);}
 const entries=[...sources.values()].sort((a,b)=>a.source.localeCompare(b.source));return {sources:entries,missing:entries.map(e=>({...e,locales:displayLocales.filter(l=>!(reviewedTranslation(e.source,l)||interfaceCopy[e.source]?.[l])?.trim())})).filter(e=>e.locales.length),raw,dynamic};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const report=auditDisplayCoverage();console.log(JSON.stringify(report,null,2));if(report.missing.length)process.exitCode=1;}
