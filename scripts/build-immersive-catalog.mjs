import {writeFile} from 'node:fs/promises';
import {immersiveTopics} from '../immersive/topics.mjs';
const languages=['en','es','pt','ja','zh','ko','fr','de','ar','it'],catalog={};
for(const language of languages){
 const {units}=await import('../immersive/'+language+'.mjs');catalog[language]={};
 for(const {key} of immersiveTopics){
  const u=units[key];if(!u)throw Error('Missing unit '+language+'/'+key);
  const {title,goal,role,goals,opening,questions}=u;
  catalog[language][key]={title,goal,role,goals,opening,questions,evidence:[...u.reading.map(p=>p.point),...u.listening.map(p=>p.point)]};
 }
}
await writeFile(new URL('../immersive/catalog.json',import.meta.url),JSON.stringify(catalog,null,1)+'\n');
console.log('Built 90 authored immersion chapters in 10 languages.');
