// Explicit frozen v3 snapshot: never modify the v2 bank used by saved attempts.
import {writeFileSync} from 'node:fs';
import original from './lesson-exercises.json' with {type:'json'};
import scenarios from './practical-scenarios.json' with {type:'json'};
const bank={};
for(const [id,applications] of Object.entries(scenarios)){
 if(!original[id])throw Error('Unknown lesson '+id);
 // Keep one contextual recall task for every entry, not three passes over it.
 const context=original[id].filter(q=>/^entry:\d+:context$/.test(q.coverage));
 if(!context.length)throw Error('Missing reference coverage '+id);
 bank[id]=[...context,...applications].map((q,i)=>({...q,id:`${id}-exercise-v3-${i+1}`,sourceLesson:id}));
}
writeFileSync('practical-exercises.json',JSON.stringify(bank,null,2)+'\n');
console.log(Object.keys(bank).length+' practical lesson revisions');
