import test from 'node:test';
import assert from 'node:assert/strict';
import {lightMaterials,lightRoundEvidence} from './light-town.mjs';

test('Light counts first attempts, resets streak on a miss and keeps legacy rewards',()=>{
 const clean={missed:false,hint:false},missed={missed:true,hint:true};
 assert.equal(lightMaterials([]),20);
 assert.equal(lightMaterials(Array(3).fill(clean)),28);
 assert.equal(lightMaterials(Array(5).fill(clean)),40);
 assert.equal(lightMaterials([{hint:false}]),20);
 assert.deepEqual(lightRoundEvidence([clean,clean,clean,missed,clean]),{combo:1,best:3,firstCorrect:4,hints:1});
});
