import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {makeTokyoPedestrian,tokyoPedestrianRoutes} from './continuum-world-crowd.mjs';
import {isWorldWalkable,clearWorldSegment} from './continuum-world-model.mjs';
import {setTokyoNight,tokyoLightingMaterials} from './continuum-world-tokyo-atmosphere.mjs';

test('night/day light changes survive batching and do not allocate new materials',()=>{
 const root=new THREE.Group(),material=new THREE.MeshStandardMaterial({emissive:0xff2288});
 material.userData.tokyoNight={day:.1,night:2.6};
 const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(),material,3);root.add(mesh);
 const selected=tokyoLightingMaterials(root);assert.deepEqual(selected,[material]);
 setTokyoNight(selected,true);assert.equal(material.emissiveIntensity,2.6);
 setTokyoNight(selected,false);assert.equal(material.emissiveIntensity,.1);
 mesh.dispose();mesh.geometry.dispose();material.dispose();
});
test('pedestrians walk at real speed, turn at endpoints, stay on verified sidewalks and yield',()=>{
 for(let index=0;index<tokyoPedestrianRoutes.length;index++) {
  const route=tokyoPedestrianRoutes[index];assert.ok(clearWorldSegment('outdoors',...route,.35));
  const actor={root:new THREE.Group(),animate(){}};
  const pedestrian=makeTokyoPedestrian(actor,index);let travelled=0,previous=actor.root.position.clone(),turned=false;const initialYaw=actor.root.rotation.y;
  for(let i=0;i<4200;i++){
   pedestrian.update(1/60,i/60,false);
   assert.ok(isWorldWalkable('outdoors',{x:actor.root.position.x,z:actor.root.position.z},.35));
   const distance=previous.distanceTo(actor.root.position);assert.ok(distance<1.3/60+.0001);travelled+=distance;
   if(Math.cos(actor.root.rotation.y-initialYaw)<-.8)turned=true;
   previous.copy(actor.root.position);
  }
  assert.ok(travelled>35);assert.ok(turned);
  const stopped=actor.root.position.clone();pedestrian.update(.1,71,false,[{x:stopped.x,z:stopped.z}]);assert.equal(stopped.distanceTo(actor.root.position),0);
  pedestrian.update(.1,72,true);assert.equal(stopped.distanceTo(actor.root.position),0);
 }
});
