import{writeFile}from'node:fs/promises';import{units}from'../immersive/en.mjs';
const out=Object.fromEntries(Object.entries(units).map(([key,u])=>[key,{title:u.title,goal:u.goal,role:u.role,goals:u.goals,opening:u.opening,questions:u.questions,readingPoints:u.reading.map(p=>p.point),listeningPoints:u.listening.map(p=>p.point)}]));
await writeFile(new URL('../immersive/canonical.json',import.meta.url),JSON.stringify(out,null,1)+'\n');
