import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {illustratedContexts,illustratedLanguages,illustratedLessonArt,illustratedHero} from './illustrated-art.mjs';
import {approvedDesignCopy} from './approved-design-copy.mjs';
import {translationSource} from './localization-corpus.mjs';
import {lessonList} from './course.mjs';
test('all 48 contextual illustrations are local verified assets, with source provenance and bounded download size',async()=>{
 const manifest=JSON.parse(await readFile(new URL('./public/illustrated-lessons/manifest.json',import.meta.url)));let bytes=0;
 for(const entry of manifest.assets){const b=await readFile(new URL('./public/illustrated-lessons/'+entry.file,import.meta.url));assert.equal(createHash('sha256').update(b).digest('hex'),entry.sha256);assert.equal(b.length,entry.bytes);assert.equal(b.toString('ascii',8,12),'WEBP');assert.ok(entry.sourceSha256);bytes+=b.length;}
 for(const lang of illustratedLanguages)for(const context of illustratedContexts)assert.ok(manifest.assets.some(a=>a.file===lang+'-'+context+'.webp'));
 assert.ok(bytes<4000000,'lazy images remain under 4MB total');
 for(const section of ['Learning memory','Practice Studio','My classes','Level test','Skill report'])assert.ok(manifest.assets.some(a=>illustratedHero('ja',section).endsWith('/'+a.file)));
});
test('lesson artwork never reads answers, options, scores or learner text; all lesson mappings resolve',()=>{
 for(const lesson of lessonList){const a=illustratedLessonArt(lesson),b=illustratedLessonArt({...lesson,questions:[{answer:'airport',options:['hospital']}],score:0,response:'cafe'});assert.deepEqual(a,b);assert.match(a.src,/^\/illustrated-lessons\/(en|es|pt|ja)-(station|cafe|market|home|work|study|nature|city|health|travel|food|culture)\.webp$/);}
 assert.equal(illustratedLessonArt({language:'en',title:'Workplace training'}).context,'work');assert.equal(illustratedLessonArt({language:'ja',title:'Finding your train platform'}).context,'station');assert.equal(illustratedLessonArt({language:'../../bad'}).language,'es');
});
test('new approved UI copy is registered and translated offline in all five non-English display languages',()=>{
 const keys=Object.keys(approvedDesignCopy.ja);for(const locale of ['ja','es','pt','zh','fr'])for(const key of keys){assert.ok(approvedDesignCopy[locale][key]);assert.ok(translationSource(key));assert.deepEqual(approvedDesignCopy[locale][key].match(/\{\d+\}/g)||[],key.match(/\{\d+\}/g)||[]);}
});
test('illustrated report keeps actual scores, absent pronunciation and basic membership boundaries',async()=>{
 const React=await import('react'),{renderToStaticMarkup}=await import('react-dom/server'),{createServer}=await import('vite'),vite=await createServer({server:{middlewareMode:true},appType:'custom'});
 try{const {default:Report}=await vite.ssrLoadModule('/IllustratedAssessment.jsx'),{JourneyLayoutContext}=await vite.ssrLoadModule('/JourneyLayout.jsx');
 const result={level:'B1',courseLevel:'B1',skills:[{name:'Listening',correct:9,total:15,level:'A2'},{name:'Reading',correct:12,total:15,level:'B1'},{name:'Language use',correct:13,total:15,level:'B2'}]};
 const render=r=>renderToStaticMarkup(React.createElement(JourneyLayoutContext.Provider,{value:{layout:'illustrated'}},React.createElement(Report,{language:'ja',data:{history:[{result:r}]},renderReport:()=>React.createElement('div',{'data-original-report':true},'Saved report'),onCourse(){}})));
 const detailed=render(result);assert.match(detailed,/value="60"/);assert.match(detailed,/value="80"/);assert.match(detailed,/Not assessed/);assert.match(detailed,/Responses saved for feedback/);assert.doesNotMatch(detailed,/Speaking scores[^<]*B1/);
 const basic=render({...result,reviewTier:'basic'});assert.match(basic,/data-original-report/);assert.doesNotMatch(basic,/illustrated-skill-row/);
 }finally{await vite.close()}
});
