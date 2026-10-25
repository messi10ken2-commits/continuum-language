// Read-only source audit. Never registers private text or sends it to a provider.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import {parse} from '@babel/parser';
import {translationSource} from '../localization-corpus.mjs';
const functions=new Set(['t','tf','uiText','uiTemplate']);
export function auditInterfaceTemplates(root=process.cwd()){
 const issues=[],files=fs.readdirSync(root).filter(f=>f.endsWith('.jsx'));let templates=0;
 for(const file of files){const ast=parse(fs.readFileSync(path.join(root,file),'utf8'),{sourceType:'module',plugins:['jsx']});
 function visit(n,parents=[]){if(!n||typeof n!=='object')return;
  if(n.type==='CallExpression'&&functions.has(n.callee?.name)&&n.arguments[0]?.type==='StringLiteral'){
   const source=n.arguments[0].value.trim();if(/[A-Za-z]{3}\s+[A-Za-z]{3}/.test(source)){templates++;if(!translationSource(source))issues.push({file,line:n.loc.start.line,kind:'unregistered-interface-source',source});}
  }
  if(n.type==='TemplateLiteral'&&parents.some(p=>p.type==='JSXExpressionContainer')){
   const attribute=[...parents].reverse().find(p=>p.type==='JSXAttribute'),visible=!attribute||['title','aria-label','alt','label'].includes(attribute.name?.name);
   const source=n.quasis.map(q=>q.value.cooked).join('{value}');if(visible&&/[A-Za-z]{3}\s+[A-Za-z]{3}/.test(source))issues.push({file,line:n.loc.start.line,kind:'untranslated-visible-template',source});
  }
  for(const [key,value] of Object.entries(n)){if(['loc','start','end'].includes(key))continue;if(Array.isArray(value))value.forEach(v=>visit(v,[...parents,n]));else if(value&&typeof value==='object')visit(value,[...parents,n]);}
 }visit(ast);}
 return {files:files.length,interfaceCalls:templates,issues};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=auditInterfaceTemplates();console.log(JSON.stringify(result,null,2));if(result.issues.length)process.exitCode=1;}
