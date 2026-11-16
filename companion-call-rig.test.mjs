import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
test('exported model loads in the actual Three.js loader with controllable bones and facial targets',async()=>{
 const b=await readFile(new URL('./public/companions-3d/capybara-pop-v3.glb',import.meta.url));const g=await new Promise((ok,no)=>new GLTFLoader().parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'',ok,no));const bones={},morphs=[];
 g.scene.traverse(o=>{if(o.isBone)bones[o.userData.name||o.name]=o;if(o.isMesh&&o.morphTargetDictionary)morphs.push(o)});
 for(const name of ['head','neck','jaw','eye.-1','eye.1'])assert.ok(bones[name],name+' remains addressable after loader name sanitization');
 for(const name of ['MouthOpen','Blink','TongueVisible'])assert.ok(morphs.some(m=>name in m.morphTargetDictionary));
 const jawMesh=g.scene.getObjectByName('Soft_lower_jaw_lip');assert.ok(jawMesh?.isSkinnedMesh);g.scene.updateMatrixWorld(true);
 jawMesh.skeleton.update();const rest=bones.jaw.quaternion.clone(),v0=jawMesh.getVertexPosition(100,new THREE.Vector3());
 bones.jaw.quaternion.copy(rest).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(.20,0,0)));g.scene.updateMatrixWorld(true);jawMesh.skeleton.update();
 const v1=jawMesh.getVertexPosition(100,new THREE.Vector3());assert.ok(v0.distanceTo(v1)>.03,'jaw bone changes actual skinned geometry');
 const head=morphs.find(m=>'MouthOpen' in m.morphTargetDictionary),pos=head.geometry.attributes.position,morph=head.geometry.morphAttributes.position[0];
 let movement=0;for(let i=0;i<pos.count;i++){const v=new THREE.Vector3().fromBufferAttribute(morph,i);movement=Math.max(movement,v.length())}assert.ok(movement>.05,'mouth target moves actual vertices');
 assert.equal(morphs.filter(m=>'Blink' in m.morphTargetDictionary).length,4,'all four lids have real blink targets');
});


test('production binder applies the shared motion and closes the jaw on silence',async()=>{
 const {bindFaceRig}=await import('./companion-call-rig.mjs'),{FaceMotion}=await import('./companion-face-motion.mjs');
 const b=await readFile(new URL('./public/companions-3d/capybara-pop-v3.glb',import.meta.url));const g=await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');const apply=bindFaceRig(g.scene),motion=new FaceMotion();
 let mouth;g.scene.traverse(o=>{if(o.morphTargetDictionary?.MouthOpen!==undefined)mouth=o});
 apply(motion.update({dt:.1,state:'speaking',level:1,audible:true}));assert.ok(mouth.morphTargetInfluences[mouth.morphTargetDictionary.MouthOpen]>.5);
 apply(motion.update({dt:.04,state:'listening',level:0,audible:false}));assert.equal(mouth.morphTargetInfluences[mouth.morphTargetDictionary.MouthOpen],0);
 const jaw=[];g.scene.traverse(o=>{if(o.isBone&&(o.userData.name||o.name)==='jaw')jaw.push(o)});assert.equal(jaw.length,1);
});
