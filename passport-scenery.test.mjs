import test from 'node:test';import assert from 'node:assert/strict';
import destinations from './public/passport-scenery/destinations.json' with {type:'json'};
import art from './public/passport-stamps/manifest.json' with {type:'json'};
import {passportScenery} from './passport-scenery.mjs';
test('53 distinct worldwide destinations map every chapter without altering special achievements',()=>{
 assert.equal(destinations.length,53);assert.equal(new Set(destinations.map(d=>d.place)).size,53);
 const used=new Set();for(const key of Object.keys(art)){const i=key.indexOf(':'),language=key.slice(0,i),id=key.slice(i+1),scene=passportScenery(language,id);if(id.startsWith('chapter:')){assert.ok(scene);used.add(scene.place);assert.match(scene.src,/^\/passport-scenery\/[a-z]+\.webp$/);assert.match(scene.position,/^(0|50|100)% (0|50|100)%$/)}else assert.equal(scene,null)}
 assert.equal(used.size,53);assert.equal(passportScenery('zz','unknown'),null);
});
