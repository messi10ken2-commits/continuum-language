import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {worldLocations,worldScenes,worldPath,isWorldWalkable,worldInteraction,outdoorForLocation,clearWorldCameraSegment,restoreWorldState} from './continuum-world-model.mjs';
import {worldDistricts,expansionLocations} from './continuum-world-districts.mjs';
import {worldMissions,availableWorldMissions,worldScenario} from './continuum-world-missions.mjs';
import {worldStory,allowedWorldChoice,storyConversation,storyOpening} from './continuum-world-story.mjs';
import {worldPhase3Copy} from './continuum-world-phase3-copy.mjs';
import {makeTokyoPedestrian} from './continuum-world-crowd.mjs';

test('all six existing Tokyo buildings have reachable entry and an activity; Osaka is a separate registry world',()=>{
 const interiors=worldLocations.filter(l=>l.interior&&(l.district||'tokyo')==='tokyo');
 assert.deepEqual(interiors.map(l=>l.id).sort(),['tokyo_cafe','tokyo_konbini','tokyo_station_hall','tokyo_bookshop','tokyo_music','tokyo_asahi'].sort());
 assert.equal(worldDistricts.length,2);assert.notDeepEqual(worldScenes.osaka.bounds,worldScenes.outdoors.bounds);
 for(const l of worldLocations){
  const outdoor=outdoorForLocation(l);assert.ok(worldPath(outdoor,worldScenes[outdoor].spawn,l.door).length,l.id);
  if(!l.interior)continue;
  const s=worldScenes[l.id];assert.ok(worldPath(l.id,s.spawn,{x:0,z:-2.4}).length,l.id);
  assert.equal(worldInteraction(l.id,{x:0,z:-2.4})?.location.id,l.id);
  assert.ok(clearWorldCameraSegment(l.id,{x:0,z:4},{x:0,z:9.5}));
  assert.ok(worldMissions.some(m=>m.location===l.id));
  assert.equal(worldScenario('world-'+worldMissions.find(m=>m.location===l.id).id).worldLocation,l.id);
 }
});
test('unlock chain is award based and independent of memory, XP grinding, UI state or other daily awards',()=>{
 let awards=[];const chain=['cafe-order','shop-buy','station-route','park-meet','book-find','music-rehearse','asahi-plan','station-journey','osaka-order','osaka-culture'];
 for(const id of chain){
  assert.equal(availableWorldMissions(awards).find(m=>m.id===id).locked,false,id);
  const without=worldStory(awards,{},false),withMemory=worldStory(awards,{},true);
  assert.deepEqual(without.places,withMemory.places);assert.deepEqual(without.districts,withMemory.districts);
  const next=chain[chain.indexOf(id)+1];if(next)assert.equal(availableWorldMissions(awards).find(m=>m.id===next).locked,true,next);
  awards.push({mission_id:id,day:'once'});
 }
 assert.equal(worldStory(awards).districts.find(d=>d.id==='osaka').unlocked,true);
 assert.ok(worldStory(awards).places.every(p=>p.unlocked));
 assert.equal(worldStory([{mission_id:'daily-cafe',xp:999999}]).districts.find(d=>d.id==='osaka').unlocked,false);
});
test('fictional story choices are allowlisted, locked until earned and do not claim personal familiarity',()=>{
 assert.equal(allowedWorldChoice('reading','travel',[]),false);
 assert.equal(allowedWorldChoice('reading','travel',[{mission_id:'book-find'}]),true);
 assert.equal(allowedWorldChoice('__proto__','travel',[{mission_id:'book-find'}]),false);
 assert.equal(allowedWorldChoice('reading','private secret',[{mission_id:'book-find'}]),false);
 const place=worldLocations.find(l=>l.id==='tokyo_bookshop'),mission=worldMissions.find(m=>m.id==='book-find');
 const a=storyConversation(place,mission,'A1',{reading:'travel'},9),b=storyConversation(place,mission,'C1',{reading:'music'},21);
 assert.notEqual(a.period,b.period);assert.notDeepEqual(a.playerChoices,b.playerChoices);assert.equal(b.level,'C1');
 assert.ok(a.instruction.includes('without confirmed NPC memories'));
 assert.ok(!storyOpening(place,mission,'A1').includes('前回'));assert.ok(storyOpening(place,mission,'A1').length<50);
 assert.equal(worldStory([{mission_id:'book-find'}],{},false).relationships.length,0);
 assert.equal(worldStory([{mission_id:'book-find'}],{},true).relationships.find(r=>r.npcId==='shiori').activities,1);
});
test('Osaka canals, bridge and pedestrian routes obey the shared collision model',()=>{
 assert.equal(isWorldWalkable('osaka',{x:0,z:10}),false);assert.equal(isWorldWalkable('osaka',{x:0,z:0}),true);
 const bridge=worldPath('osaka',{x:-9,z:10},{x:9,z:10});assert.ok(bridge.length>0);assert.ok(bridge.every(p=>isWorldWalkable('osaka',p)));
 for(let i=0;i<4;i++){
  const actor={root:new THREE.Group(),animate(){}};const pedestrian=makeTokyoPedestrian(actor,i,'osaka');
  for(let frame=0;frame<1800;frame++){pedestrian.update(1/60,frame/60,false);assert.ok(isWorldWalkable('osaka',{x:actor.root.position.x,z:actor.root.position.z},.35));}
 }
});
test('expansion UI copy covers all display languages and NPC roles are distinct',()=>{
 assert.equal(new Set(expansionLocations.map(l=>l.npc.id)).size,7);
 for(const [source,copy]of Object.entries(worldPhase3Copy))for(const locale of ['ja','es','pt','zh','fr','ko','id','ru','ar'])assert.ok(copy[locale]?.trim(),source+' '+locale);
});

test('both stations have an unbroken gate-platform-carriage route and boarding is confined to the open door',()=>{
 for(const scene of ['tokyo_station_hall','osaka_station_hall']){
 const waypoints=[worldScenes[scene].spawn,{x:4.8,z:-4.8},{x:4.8,z:-11.5},{x:8,z:-12},{x:8,z:-15.8}];
 for(let i=1;i<waypoints.length;i++)assert.ok(worldPath(scene,waypoints[i-1],waypoints[i]).length,JSON.stringify(waypoints[i]));
 assert.equal(worldInteraction(scene,waypoints.at(-1))?.type,'board');
 assert.equal(worldInteraction(scene,{x:0,z:-2.4})?.type,'talk');
 assert.equal(isWorldWalkable(scene,{x:4,z:-14}),false);
 assert.equal(isWorldWalkable(scene,{x:8,z:-18.4}),false);
}
});

test('Osaka station is available immediately on arrival, with no return-mission lock',()=>{
 const arrival=[{mission_id:'station-journey'}],story=worldStory(arrival);
 assert.equal(story.places.find(p=>p.id==='osaka_station_hall').unlocked,true);
 assert.equal(story.districts.find(d=>d.id==='osaka').station,'osaka_station_hall');
 assert.ok(worldPath('osaka',worldScenes.osaka.spawn,worldLocations.find(l=>l.id==='osaka_station_hall').door).length);
 assert.equal(worldInteraction('osaka_station_hall',{x:8,z:-15.8}).district,'tokyo');
 assert.equal(worldInteraction('tokyo_station_hall',{x:8,z:-15.8}).district,'osaka');
 assert.equal(restoreWorldState({scene:'osaka_station_hall',position:{x:8,z:-15.8}}).scene,'osaka_station_hall');
});
