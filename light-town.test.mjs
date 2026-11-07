import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {lightRoute,lightRouteStats} from './light-route.mjs';
import {companions} from './adventure-model.mjs';
import {lightMaterials,lightRoundEvidence,townCollection,townCourseKey,townCoursePlacements,townPlacedRewards,townRewardAt} from './light-town.mjs';

test('Light counts first attempts, resets streak on a miss and keeps legacy rewards',()=>{
 const clean={missed:false,hint:false},missed={missed:true,hint:true};
 assert.equal(lightMaterials([]),20);
 assert.equal(lightMaterials(Array(3).fill(clean)),28);
 assert.equal(lightMaterials(Array(5).fill(clean)),40);
 assert.equal(lightMaterials([{hint:false}]),20);
 assert.deepEqual(lightRoundEvidence([clean,clean,clean,missed,clean]),{combo:1,best:3,firstCorrect:4,hints:1});
});

test('every first clear earns the next prop, including after the catalogue cycles',()=>{
 const chapter=[{lesson:{id:'lesson'},rounds:37}];
 const completed=Array.from({length:12},(_,round)=>({
  lesson:'lesson',round,id:'clear-'+round,completedAt:new Date(1000*(round+1)).toISOString()
 }));
 const replay={...completed[0],id:'replay'};
 const other={...completed[0],lesson:'other'};
 const collection=townCollection(chapter,[...completed.toReversed(),replay,other]);
 assert.equal(collection.length,12);
 assert.deepEqual(collection.slice(0,4).map(item=>item.art),['terrace','flower-bed','street-lamp','bench']);
 assert.equal(collection[0].clearId,'clear-0');
 assert.equal(collection[9].edition,2);
 assert.equal(townPlacedRewards(collection).find(item=>item.slot===0).index,9);
 assert.equal(townRewardAt(collection.length).art,'bench');
});

test('all selectable companions and the first reward set have production art',async()=>{
 const rewards=Array.from({length:9},(_,index)=>townRewardAt(index).art);
 await Promise.all([...companions,...rewards].map(name=>access(new URL('public/light-town/'+name+'.webp',import.meta.url))));
});

test('an earned color selection takes precedence over future unlocks in its slot',()=>{
 const collection=Array.from({length:20},(_,index)=>townRewardAt(index));
 const placed=townPlacedRewards(collection,[{slot:0,rewardIndex:0},{slot:1,rewardIndex:10},{slot:2,rewardIndex:98}]);
 assert.equal(placed.find(item=>item.slot===0).index,0);
 assert.equal(placed.find(item=>item.slot===1).index,10);
 assert.equal(placed.find(item=>item.slot===2).index,11);
});

test('Spanish B1 keeps earned town decorations when the next chapter has zero clears',()=>{
 const spanish=lightRoute('es');
 const previous=spanish.filter(row=>row.chapter.level==='B1').slice(0,6);
 const future=spanish.filter(row=>row.chapter.id==='b1-future-lab');
 const clears=previous.flatMap(row=>Array.from({length:row.rounds},(_,round)=>({lesson:row.lesson.id,round})));
 const [english]=lightRoute('en');
 const saved=[...clears,{lesson:english.lesson.id,round:0}].map((row,index)=>({
  ...row,id:'clear-'+index,completedAt:new Date(1000*(index+1)).toISOString()
 }));
 assert.equal(lightRouteStats(future,saved).done,0);
 assert.equal(lightRouteStats(future,saved).total,6);
 const collection=townCollection(spanish,saved);
 assert.equal(collection.length,15);
 assert.equal(townPlacedRewards(collection).length,9);
 assert.equal(collection[0].art,'terrace');
 assert.equal(townRewardAt(collection.length).art,'rose-arch');
 assert.equal(townRewardAt(collection.length).edition,2);
 assert.equal(townCollection(lightRoute('en'),saved).length,1);
 const legacy={chapter:previous[0].chapter.id,slot:0,rewardIndex:0};
 const later={chapter:previous.at(-1).chapter.id,slot:0,rewardIndex:0};
 const current={chapter:townCourseKey('es'),slot:0,rewardIndex:9};
 const other={chapter:townCourseKey('en'),slot:0,rewardIndex:0};
 assert.deepEqual(townCoursePlacements('es',spanish,[later,legacy,other]),[later]);
 const selected=townCoursePlacements('es',spanish,[later,current,legacy,other]);
 assert.deepEqual(selected,[current]);
 assert.equal(townPlacedRewards(collection,selected).find(item=>item.slot===0).edition,2);
});
