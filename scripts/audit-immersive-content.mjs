import {validateImmersiveUnits} from '../immersive/validate.mjs';
import {units as english} from '../immersive/en.mjs';
const option=process.argv.find(v=>v.startsWith('--languages='));
const languages=option?option.slice(12).split(','):['en','es','pt','ja','zh','ko','fr','de','ar','it'];
let errors=[];
for(const language of languages){
 if(!/^(en|es|pt|ja|zh|ko|fr|de|ar|it)$/.test(language))throw Error('Invalid learning language');
 try{const {units}=await import('../immersive/'+language+'.mjs');const found=validateImmersiveUnits(language,units,{english});errors.push(...found);console.log(`${language}: ${Object.keys(units).length} chapters, ${found.length} structural issues`)}
 catch(e){errors.push(language+': '+e.message)}
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log(`PASS: ${languages.length*9} chapters / ${languages.length*36} lessons / ${languages.length*216} questions. Structural checks only; pronunciation and linguistic naturalness require contextual review.`);
