// Build-time only: translate public authored UI copy, never accounts or learner data.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {interfaceCopy} from '../interface-copy.mjs';
import {reviewedInterfaceCopy} from '../reviewed-interface-copy.mjs';
import {displayLanguageSeed} from '../display-language-seed.mjs';
import {translationSource,protectSource} from '../localization-corpus.mjs';
import {translateBatch} from '../localization-api.mjs';
import {keepsLocalizedInstructions} from '../learning-text-protection.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),locales=['ko','id','ru','ar'];
export async function displayTranslationSources(){
 const keys=new Set([...Object.keys(interfaceCopy),...Object.values(reviewedInterfaceCopy).flatMap(Object.keys),...Object.keys(displayLanguageSeed)]);
 for(const file of (await fs.readdir(root)).filter(n=>n.endsWith('-copy.mjs'))){
  const module=await import(path.join(root,file));
  for(const [name,value] of Object.entries(module)){
   if(Array.isArray(value)&&name.endsWith('Sources'))for(const text of value)if(typeof text==='string')keys.add(text);
   if(value&&typeof value==='object'&&!Array.isArray(value))for(const [key,entry] of Object.entries(value)){
    if(['ja','es','pt','zh','fr'].includes(key)&&entry&&typeof entry==='object')for(const source of Object.keys(entry))keys.add(source);
    else if(entry&&typeof entry==='object'&&['ja','es','pt','zh','fr'].some(l=>typeof entry[l]==='string'))keys.add(key);
   }
  }
 }
 return [...keys].filter(text=>text.trim()&&/[A-Za-z]/.test(text)).sort();
}
async function build(locale){
 if(!locales.includes(locale))throw Error('Choose ko, id, ru or ar');
 if(!process.env.OPENAI_API_KEY&&!process.env.GEMINI_API_KEY)throw Error('Translation provider is not configured');
 const sources=await displayTranslationSources(),result={};
 const tasks=[];let batch=[],size=0;
 for(const text of sources){if(displayLanguageSeed[text]?.[locale]){result[text]=displayLanguageSeed[text][locale];continue;}if(batch.length>=30||size+text.length>4000){tasks.push(batch);batch=[];size=0;}batch.push(text);size+=text.length;}if(batch.length)tasks.push(batch);
 const filename=path.join(root,'display-copy-'+locale+'.json');let cursor=0,done=0;
 async function translate(texts,attempt=0){
  const items=texts.map(text=>translationSource(text)||{text,language:'',context:'Public educational interface',protectedValues:[]});
  try{const values=await translateBatch(items,locale);for(let i=0;i<texts.length;i++){const protection=protectSource(items[i]);if(!values[i]?.trim()||!keepsLocalizedInstructions({text:texts[i],protection},values[i]))throw Error('Invalid protected copy');result[texts[i]]=values[i];}}
  catch(e){if(attempt<4){await new Promise(r=>setTimeout(r,1000*2**attempt));return translate(texts,attempt+1);}if(texts.length>1){const middle=Math.ceil(texts.length/2);await translate(texts.slice(0,middle));await translate(texts.slice(middle));}else throw Error('Could not translate one public source: '+texts[0].slice(0,100),{cause:e});}
 }
 await Promise.all(Array.from({length:3},async()=>{while(cursor<tasks.length){const task=tasks[cursor++];await translate(task);done++;await fs.writeFile(filename,JSON.stringify(result,null,2)+'\n');console.log(locale+': '+done+'/'+tasks.length+' batches, '+Object.keys(result).length+'/'+sources.length+' phrases');}}));
 if(sources.some(s=>!result[s]))throw Error('Incomplete display-language catalog');
 console.log('COMPLETE '+locale+': '+sources.length+' public phrases');
}
if(process.argv[1]===fileURLToPath(import.meta.url))await build(process.argv[2]);
