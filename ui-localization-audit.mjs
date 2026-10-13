import fs from 'node:fs/promises';
import {parseAst} from 'rolldown/parseAst';

// Candidates need editorial triage: target-language examples and proper names
// must remain in their original language. This is not a translation percentage.
export async function auditUiSources(root=new URL('.',import.meta.url)){
 const candidates=[];
 for(const file of (await fs.readdir(root)).filter(name=>name.endsWith('.jsx')).sort()){
  const source=await fs.readFile(new URL(file,root),'utf8');
  const ast=parseAst(source,{lang:'jsx'},file);
  function record(node,text,kind){
   text=text.replace(/\s+/g,' ').trim();
   if(/[A-Za-z]{2}/.test(text))candidates.push({file,line:source.slice(0,node.start).split('\n').length,kind,text});
  }
  function visit(node){
   if(!node||typeof node!=='object')return;
   if(node.type==='JSXText')record(node,node.value,'text');
   if(node.type==='JSXAttribute'&&['placeholder','title','aria-label','alt'].includes(node.name?.name)&&typeof node.value?.value==='string')record(node,node.value.value,'attribute');
   if(node.type==='JSXExpressionContainer'&&node.expression?.type==='Literal'&&typeof node.expression.value==='string')record(node,node.expression.value,'expression');
   for(const value of Object.values(node)){
    if(Array.isArray(value))value.forEach(visit);
    else if(value&&typeof value==='object')visit(value);
   }
  }
  visit(ast);
 }
 return candidates;
}
