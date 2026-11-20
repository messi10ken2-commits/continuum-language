import test from 'node:test';import assert from 'node:assert/strict';import {livingMapState,livingMapTheme,livingMapGeometry} from './living-map-model.mjs';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';import art from './public/living-map-panorama/manifest.json' with {type:'json'};
test('restoration uses completed nonempty chapters and caps at the approved evening scene',()=>{assert.deepEqual(livingMapState(),{completed:0,phase:0});const done={lessons:[1,2,3],completed:3},partial={lessons:[1,2,3],completed:2};for(let n=0;n<7;n++)assert.deepEqual(livingMapState([...Array(n).fill(done),partial,{lessons:[],completed:0}]),{completed:n,phase:Math.min(n,4)});});
test('all registered painted backgrounds have verified immutable bytes and equal dimensions',async()=>{const sizes=new Set();for(const theme of Object.values(art))for(const state of ['quiet','day','evening','restorationDay']){const entry=theme[state];const bytes=await readFile(new URL('./public'+entry.src.split('?')[0],import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);assert.ok(entry.src.includes(entry.sha256.slice(0,12)));assert.ok(entry.width/entry.height>2,'wide panorama, not portrait tile');sizes.add(entry.width+'x'+entry.height)}assert.equal(sizes.size,1)});

test('learning languages select distinct regional themes with a safe English fallback',()=>{assert.deepEqual(Object.keys(art).sort(),['ar','de','en','es','fr','it','ja','ko','pt','zh']);const sources=new Set();for(const language of ['en','es','pt','ja']){assert.equal(livingMapTheme(language),art[language]);sources.add(livingMapTheme(language).evening.sha256)}assert.equal(sources.size,4);assert.match(art.pt.region,/Brazil/);assert.match(art.ja.region,/Japan/);assert.equal(art.ja.locomotiveSteam,false);assert.equal(art.pt.locomotiveSteam,false);assert.equal(livingMapTheme('unknown'),art.en)});

test('continuous panorama geometry keeps chapter order and fills all three views without repeating panels',()=>{for(const width of [266,332,774])for(let count=8;count<=25;count++){const chapters=Array.from({length:count},(_,i)=>({id:'chapter-'+i}));const g=livingMapGeometry(chapters,width);assert.ok(g.width>=width*3);assert.equal(g.points.length,count);assert.ok(g.points.every(p=>Number.isFinite(p.x)&&p.x>=60&&p.x<=g.width-60&&p.y>0&&p.y<g.height));assert.ok(g.points[0].x<width);assert.ok(g.points.at(-1).x>g.width-width);const columns=g.points.map(p=>Math.floor(p.x/width));assert.deepEqual(columns,[...columns].sort((a,b)=>a-b));}});

test('A1 and A2 nodes use the full panel height and clear the canvas edges in every language',async()=>{
 const {journeyChapters}=await import('./journey-model.mjs');
 for(const language of ['en','es','pt','ja'])for(const level of ['A1','A2'])for(const width of [240,264,320,334,774]){
  const chapters=journeyChapters(language,level),g=livingMapGeometry(chapters,width);
  assert.equal(g.points.length,chapters.length);
  for(const p of g.points){assert.ok(p.x>=60&&p.x<=g.width-60);assert.ok(p.y>=72&&p.y<=g.height-164);}
  const panels=Map.groupBy(g.points,p=>Math.floor(p.x/width));
  for(const points of panels.values())if(points.length>1){assert.ok(points.at(-1).y+60>g.height*.65,'nodes must extend below the upper half');for(let i=1;i<points.length;i++)assert.ok(points[i].y>points[i-1].y);}
  for(let i=0;i<g.points.length;i++)for(let j=i+1;j<g.points.length;j++){
   const a=g.points[i],b=g.points[j];assert.ok(Math.abs(a.x-b.x)>=120||Math.abs(a.y-b.y)>=120,'120px node envelopes should not overlap');
  }
 }
});
