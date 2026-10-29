import {expandedExclusiveCourses} from '../expanded-exclusive-courses.mjs';
// Publish translation sources only, never an assessment passage, answer key or
// private task catalog. Run after editing authored placement/focused practice.
import fs from 'node:fs';
import {assessmentItems,publicAssessment} from '../assessment-bank.mjs';
import {expandedPlacementLanguages} from '../expanded-placement.mjs';
import {expandedFocusedSkillTasks} from '../expanded-focused-skills.mjs';
const sources=new Map(),add=(text,language='')=>{if(typeof text==='string'&&text.trim())sources.set(JSON.stringify([language,text]),{text,language,protectedValues:[]});};
for(const language of expandedPlacementLanguages)for(let form=0;form<4;form++){
 const version=language+'-diagnostic-4',items=assessmentItems(form,version);
 for(const q of items){add(q.prompt,language);if(q.optionsLang==='en-US')for(const option of q.options)add(option);}
 for(const index of [items.length,items.length+1])add(publicAssessment({id:'translation-corpus',version,form,answers:[...items.map(q=>q.answer),null].slice(0,index)}).question.prompt,language);
}
fs.writeFileSync(new URL('../expanded-assessment-display-sources.json',import.meta.url),JSON.stringify([...sources.values()],null,2)+'\n');
sources.clear();
for(const task of expandedFocusedSkillTasks){for(const key of ['title','topic','prompt'])add(task[key],task.language);for(const tip of task.tips)add(tip,task.language);for(const q of task.questions){add(q.prompt,task.language);add(q.note,task.language);for(const option of q.options)add(option);}}
fs.writeFileSync(new URL('../expanded-focused-display-sources.json',import.meta.url),JSON.stringify([...sources.values()],null,2)+'\n');

sources.clear();
for(const course of expandedExclusiveCourses){
 const addCourse=text=>add(text,course.language);
 for(const key of ['title','description','explanation','exampleNote'])addCourse(course[key]);
 for(const value of course.vocabulary) addCourse(value.meaning);
 for(const step of course.breakdown.steps)addCourse(step);
 addCourse(course.breakdown.pitfall);
 for(const q of course.questions){addCourse(q.prompt);addCourse(q.note);if(['interpretation','listening'].includes(q.type))for(const option of q.options)add(option);}
}
fs.writeFileSync(new URL('../expanded-exclusive-display-sources.json',import.meta.url),JSON.stringify([...sources.values()],null,2)+'\n');
