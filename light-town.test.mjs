import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {companions} from './adventure-model.mjs';
import {lightMaterials,lightRoundEvidence,townCollection,townPlacedRewards,townRewardAt} from './light-town.mjs';

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
