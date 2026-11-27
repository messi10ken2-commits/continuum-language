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

// Inspect animated foot joints and geometry rather than internal gait phases.
import {worldMeshes,makeWorldCompanion} from './continuum-world-scenes.mjs';
test('companion stance feet cancel root travel and reduced motion restores the pose',()=>{
 const old=globalThis.document;
 globalThis.document={createElement(){return {width:512,height:512,getContext(){return new Proxy({},{get:(_,key)=>key==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});}};}};
 const meshes=worldMeshes();
 try{
  const actor=makeWorldCompanion(meshes,'capybara'),feet=[];actor.root.traverse(o=>{if(o.name==='Companion planted foot')feet.push(o);});assert.equal(feet.length,2);
  let planted=0,previous=[];
  for(let i=1;i<=240;i++){
   const time=i/120;actor.root.position.z=time;actor.animate(time,1,false);actor.root.updateMatrixWorld(true);
   const positions=feet.map(f=>f.getWorldPosition(new THREE.Vector3()));
   for(const foot of feet)assert.ok(new THREE.Box3().setFromObject(foot).min.y>=-.002,'toes/soles do not penetrate the pavement');
   positions.forEach((p,j)=>{if(i>120&&previous[j]&&Math.abs(p.y-.05)<.001&&Math.abs(previous[j].y-.05)<.001){assert.ok(Math.abs(p.z-previous[j].z)<.006);planted++;}});
   previous=positions;
  }
  assert.ok(planted>100);
  actor.animate(3,0,true);actor.root.updateMatrixWorld(true);
  for(const f of feet)assert.ok(Math.abs(f.getWorldPosition(new THREE.Vector3()).y-.05)<.00001);
 }finally{meshes.dispose();globalThis.document=old;}
});
