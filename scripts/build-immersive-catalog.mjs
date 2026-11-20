import {writeFile} from 'node:fs/promises';
import {immersiveTopics} from '../immersive/topics.mjs';
import {compactImmersiveUnit} from '../immersive/catalog-model.mjs';
import {validateImmersiveUnits} from '../immersive/validate.mjs';
import {units as english} from '../immersive/en.mjs';
const languages=['en','es','pt','ja','zh','ko','fr','de','ar','it'],catalog={};
for(const language of languages){
 const {units}=await import('../immersive/'+language+'.mjs');
 const errors=validateImmersiveUnits(language,units,{english});if(errors.length)throw Error(errors.join('\n'));
 catalog[language]={};
 for(const {key} of immersiveTopics){
  const u=units[key];if(!u)throw Error('Missing unit '+language+'/'+key);
  catalog[language][key]=compactImmersiveUnit(u);
 }
}
await writeFile(new URL('../immersive/catalog.json',import.meta.url),JSON.stringify(catalog,null,1)+'\n');
console.log('Built 90 authored immersion chapters in 10 languages.');
