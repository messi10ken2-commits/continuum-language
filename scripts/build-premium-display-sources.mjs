import fs from 'node:fs';
import {premiumCourses} from '../premium-courses.mjs';
const texts=new Set();
for(const c of premiumCourses){for(const k of ['title','description','exampleNote'])if(c[k])texts.add(c[k]);for(const v of c.vocabulary||[])if(v.meaning)texts.add(v.meaning);for(const q of c.questions){texts.add(q.prompt);texts.add(q.note);if(['video','listening','interpretation'].includes(q.type))q.options.forEach(o=>texts.add(o));}}
fs.writeFileSync(new URL('../premium-display-sources.json',import.meta.url),JSON.stringify([...texts],null,2)+'\n');
