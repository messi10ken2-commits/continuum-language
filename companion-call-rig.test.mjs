import test from 'node:test';import assert from 'node:assert/strict';import {readFile,stat} from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {CALL_MODELS,callCompanionKind} from './companion-call-models.mjs';
import {companions} from './adventure-model.mjs';
import {bindFaceRig} from './companion-call-rig.mjs';
import {FaceMotion} from './companion-face-motion.mjs';

test('the bundled model allowlist covers every selectable companion and rejects arbitrary paths',()=>{
 assert.deepEqual(Object.keys(CALL_MODELS).sort(),[...companions].sort());
 for(const invalid of ['../cat','constructor','__proto__','https://example.com/model.glb',null,undefined])assert.equal(callCompanionKind(invalid),'bird');
});
for(const [kind,path]of Object.entries(CALL_MODELS))test(kind+': actual portable rig deforms, blinks and closes its mouth on silence',async()=>{
 const file=new URL('./public'+path,import.meta.url),b=await readFile(file);
 assert.ok((await stat(file)).size<9_000_000,'bounded mobile download');
 const g=await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');const bones={},morphs=[];
 g.scene.traverse(o=>{if(o.isBone)bones[o.userData.name||o.name]=o;if(o.isMesh&&o.morphTargetDictionary)morphs.push(o)});
 for(const name of ['head','neck','jaw','eye.-1','eye.1'])assert.ok(bones[name],name+' survives loader sanitization');
 for(const name of ['MouthOpen','Blink','TongueVisible'])assert.ok(morphs.some(m=>name in m.morphTargetDictionary),name);
 const jawMesh=g.scene.getObjectByName('Soft_lower_jaw_lip');assert.ok(jawMesh?.isSkinnedMesh);g.scene.updateMatrixWorld(true);
 jawMesh.skeleton.update();const rest=bones.jaw.quaternion.clone(),v0=jawMesh.getVertexPosition(100,new THREE.Vector3());
 bones.jaw.quaternion.copy(rest).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(.20,0,0)));g.scene.updateMatrixWorld(true);jawMesh.skeleton.update();
 const v1=jawMesh.getVertexPosition(100,new THREE.Vector3());assert.ok(v0.distanceTo(v1)>.03,'jaw bone moves actual skinned geometry');bones.jaw.quaternion.copy(rest);
 const mouthMeshes=morphs.filter(m=>'MouthOpen' in m.morphTargetDictionary),head=mouthMeshes[0];
 let movement=0;for(const mesh of mouthMeshes){const target=mesh.geometry.morphAttributes.position[mesh.morphTargetDictionary.MouthOpen];for(let i=0;i<target.count;i++)movement=Math.max(movement,new THREE.Vector3().fromBufferAttribute(target,i).length())}
 assert.ok(movement>.05,'mouth target moves actual vertices across material-split meshes');
 assert.equal(morphs.filter(m=>'Blink' in m.morphTargetDictionary).length,4,'four real eyelid morphs');
 const apply=bindFaceRig(g.scene),motion=new FaceMotion(),index=head.morphTargetDictionary.MouthOpen;
 apply(motion.update({dt:.1,state:'speaking',level:1,audible:true}));assert.ok(head.morphTargetInfluences[index]>.5);
 apply(motion.update({dt:.04,state:'listening',level:0,audible:false}));assert.equal(head.morphTargetInfluences[index],0);assert.ok(bones.jaw.quaternion.angleTo(rest)<1e-6);
 apply(motion.update({dt:.1,state:'speaking',level:1,audible:true,reduced:true}));assert.equal(head.morphTargetInfluences[index],0);
 if(kind!=='capybara')assert.equal(g.animations.length,0,'runtime motion needs no duplicate demonstration clips');
});
