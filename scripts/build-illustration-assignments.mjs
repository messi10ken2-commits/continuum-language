// Rebuild after changing the authored course order or illustration catalogue.
// --missing-only preserves every approved existing assignment.
import fs from 'node:fs/promises';
import {lessonList} from '../course.mjs';
import {journeyChapters,journeyLevels} from '../journey-model.mjs';
import {illustratedLanguages,illustratedContext,illustratedLessonCandidates} from '../illustrated-art.mjs';
const file=new URL('../illustrated-lesson-assignments.json',import.meta.url);
const assigned=process.argv.includes('--missing-only')?JSON.parse(await fs.readFile(file,'utf8')):{};
for(const language of illustratedLanguages)for(const level of journeyLevels){
 const lessons=journeyChapters(language,level).flatMap(c=>c.lessons),recent=[],uses=new Map();
 for(const [index,lesson]of lessons.entries()){
  const context=illustratedContext(lesson),related=illustratedLessonCandidates(language,context);
  const candidates=lesson.immersive?[...new Set([...related,...['study','work','city','culture','cafe','nature','market','food','travel'].map(scene=>`/illustrated-lessons/${language}-${scene}.webp`)])]:related;
  const next=lessons.slice(index+1,index+3).map(l=>assigned[l.id]?.src).filter(Boolean);
  const eligible=candidates.filter(src=>!recent.slice(-2).includes(src)&&!next.includes(src));
  const pool=eligible.length?eligible:candidates.filter(src=>src!==recent.at(-1));
  const src=assigned[lesson.id]?.src||[...pool].sort((a,b)=>(uses.get(a)||0)-(uses.get(b)||0)||candidates.indexOf(a)-candidates.indexOf(b))[0];
  assigned[lesson.id]??={language,context,src};recent.push(src);uses.set(src,(uses.get(src)||0)+1);
 }
}
for(const l of lessonList)if(!assigned[l.id])throw Error('Unassigned lesson '+l.id);
await fs.writeFile(file,JSON.stringify(assigned,null,1)+'\n');
console.log('Assigned '+Object.keys(assigned).length+' lessons across '+illustratedLanguages.length+' languages.');
