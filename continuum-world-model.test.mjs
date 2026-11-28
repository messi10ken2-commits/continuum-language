import test from "node:test";
import assert from "node:assert/strict";
import {
  worldAvailable,
  isOutdoorScene,
  outdoorForLocation,
  worldLocations,
  worldScenes,
  isWorldWalkable,
  moveWorldActor,
  movementVector,
  worldPath,
  worldInteraction,
  worldDestinationPoint,
  worldCompanionSpawn,
  restoreWorldState,
  worldStorageKey,
} from "./continuum-world-model.mjs";
import { continuumWorldCopy } from "./continuum-world-copy.mjs";
import { CALL_MODELS } from "./companion-call-models.mjs";

test("companion entry placement stays walkable and moves ahead of an indoor doorway camera", () => {
  for (const [id, scene] of Object.entries(worldScenes)) {
    const companion = worldCompanionSpawn(id, scene.spawn);
    assert.ok(isWorldWalkable(id, companion));
    assert.ok(
      Math.hypot(companion.x - scene.spawn.x, companion.z - scene.spawn.z) >
        0.5,
    );
    if (!isOutdoorScene(id)) assert.ok(companion.z < scene.spawn.z);
  }
  for (const p of [
    { x: 0, z: -2.4 },
    { x: 6.3, z: 5.4 },
  ]) {
    const companion = worldCompanionSpawn("tokyo_cafe", p);
    assert.ok(isWorldWalkable("tokyo_cafe", companion));
    assert.notDeepEqual(
      companion,
      p,
      "blocked preferred offset selects a free alternative",
    );
  }
});

test("Tokyo is opt-in, Japanese learner-only and illustrated-only", () => {
  const eligible = {
    user: { id: "one", role: "learner" },
    language: "ja",
    layout: "illustrated",
    enabled: true,
  };
  assert.equal(worldAvailable(eligible), true);
  for (const override of [
    { enabled: false },
    { enabled: "false" },
    { enabled: undefined },
    { language: "en" },
    { layout: "photo" },
    { layout: "light" },
    { user: { role: "teacher" } },
    { user: null },
  ])
    assert.equal(worldAvailable({ ...eligible, ...override }), false);
});
test("both districts have safe doors, distinct NPCs and enterable interiors", () => {
  assert.equal(worldLocations.length, 11);
  assert.equal(worldLocations.filter((l) => l.interior).length, 9);
  assert.equal(new Set(worldLocations.map((l) => l.npc.id)).size, 11);
  for (const location of worldLocations) {
    assert.ok(isWorldWalkable(outdoorForLocation(location), location.door));
    assert.ok(
      worldPath(outdoorForLocation(location), worldScenes[outdoorForLocation(location)].spawn, location.door).length,
    );
    if (location.interior)
      assert.equal(worldInteraction(outdoorForLocation(location), location.door)?.type, "enter");
  }
});
test("collision stops tunneling, slides along walls and bounds every scene", () => {
  for (const scene of Object.keys(worldScenes)) {
    const start = worldScenes[scene].spawn;
    for (const delta of [
      { x: 300, z: 0 },
      { x: -300, z: 0 },
      { x: 0, z: 300 },
      { x: 0, z: -300 },
    ])
      assert.ok(isWorldWalkable(scene, moveWorldActor(scene, start, delta)));
    assert.equal(isWorldWalkable(scene, { x: NaN, z: 0 }), false);
  }
  const stopped = moveWorldActor(
    "outdoors",
    { x: -17, z: -5 },
    { x: 0, z: -30 },
  );
  assert.ok(stopped.z >= -6.11);
  assert.ok(stopped.z <= -5);
  const sliding = moveWorldActor(
    "outdoors",
    { x: -17, z: -5 },
    { x: 3, z: -3 },
  );
  assert.ok(sliding.x > -16);
  assert.ok(sliding.z >= -6.11);
});
test("movement clamps resumed-frame deltas and normalises diagonal controls", () => {
  const forward = movementVector({ x: 0, z: -1 }, 0, 0.05),
    diagonal = movementVector({ x: 1, z: -1 }, 0, 0.05);
  assert.ok(
    Math.abs(
      Math.hypot(forward.x, forward.z) - Math.hypot(diagonal.x, diagonal.z),
    ) < 1e-8,
  );
  assert.deepEqual(
    movementVector({ x: 0, z: -1 }, 0, 50),
    movementVector({ x: 0, z: -1 }, 0, 0.1),
  );
  assert.ok(
    Math.hypot(
      ...Object.values(movementVector({ x: 0, z: -1 }, 0, 0.05, true)),
    ) > Math.hypot(forward.x, forward.z),
  );
  assert.deepEqual(movementVector({ x: 0, z: 0 }, 0, 0.05), { x: 0, z: 0 });
});
test("companion routing goes around buildings and each step stays walkable", () => {
  assert.ok(
    worldPath("outdoors", { x: 35.55, z: -13 }, { x: -17, z: -25 }).length,
    "a rounded grid coordinate outside the boundary must not strand the companion",
  );
  const route = worldPath("outdoors", { x: -17, z: 0 }, { x: -17, z: -25 });
  assert.ok(route.length > 3);
  for (const point of route) assert.ok(isWorldWalkable("outdoors", point));
  for (const scene of ["tokyo_cafe", "tokyo_konbini"]) {
    assert.ok(
      worldPath(scene, worldScenes[scene].spawn, { x: 0, z: -1 }).length,
    );
    assert.equal(worldInteraction(scene, { x: 0, z: 5 }).type, "exit");
    assert.equal(worldInteraction(scene, { x: 0, z: -2 }).type, "talk");
  }
  assert.equal(worldInteraction("outdoors", worldScenes.outdoors.spawn), null);
});
test("restoration rejects hostile, outdated and non-finite coordinates without touching course progress", () => {
  const restored = restoreWorldState({
    scene: "__proto__",
    position: { x: Infinity, z: 0 },
    yaw: NaN,
    quality: "ultra",
    volume: -10,
    courseProgress: 100,
    npcMemories: ["private"],
  });
  assert.equal(restored.scene, "outdoors");
  assert.ok(isWorldWalkable(restored.scene, restored.position));
  assert.equal(restored.quality, "auto");
  assert.equal(restored.volume, 0);
  assert.equal(restored.sound, false);
  assert.equal(restored.npcMemories, undefined);
  assert.equal(restored.courseProgress, undefined);
  assert.notEqual(worldStorageKey("one"), worldStorageKey("two"));
  const indoor = restoreWorldState({
    scene: "tokyo_cafe",
    position: { x: 0, z: -3.6 },
  });
  assert.deepEqual(indoor.position, worldScenes.tokyo_cafe.spawn);
  assert.ok(Object.hasOwn(CALL_MODELS, "capybara"));
});
test("every world interface source has offline copy in every existing display language", () => {
  for (const [source, translations] of Object.entries(continuumWorldCopy))
    for (const locale of ["ja", "es", "pt", "zh", "fr", "ko", "id", "ru", "ar"])
      assert.ok(translations[locale]?.trim(), source + " " + locale);
});

test("destination markers lead within interaction range of the correct door or NPC", () => {
  for (const location of worldLocations) {
    const point = worldDestinationPoint(location.id);
    assert.ok(isWorldWalkable(outdoorForLocation(location), point));
    const action = worldInteraction(outdoorForLocation(location), point);
    assert.equal(action?.location.id, location.id);
    assert.equal(action?.type, location.interior ? "enter" : "talk");
    assert.ok(worldPath(outdoorForLocation(location), worldScenes[outdoorForLocation(location)].spawn, point).length);
  }
  assert.equal(worldDestinationPoint("missing"), null);
});

test('station forecourt routes around the island, railway and shelters without losing its information point',()=>{
  const island={x:0,z:-20.5};
  assert.equal(isWorldWalkable('outdoors',island),false);
  assert.equal(isWorldWalkable('outdoors',{x:12,z:-38}),false);
  assert.equal(isWorldWalkable('outdoors',{x:-10.7,z:-24}),false);
  const destination=worldDestinationPoint('tokyo_station');
  const path=worldPath('outdoors',worldScenes.outdoors.spawn,destination);
  assert.ok(path.length>0);
  assert.ok(path.every(p=>isWorldWalkable('outdoors',p)));
  assert.equal(worldInteraction('outdoors',destination)?.type,'talk');
  assert.equal(worldInteraction('outdoors',{x:.5,z:-26.5})?.location.id,'tokyo_station_hall');
  assert.equal(worldInteraction('outdoors',{x:2.6,z:-26.5})?.location.id,'tokyo_station');
  assert.ok(moveWorldActor('outdoors',{x:0,z:-16},{x:0,z:-10}).z>-18.2);
});

test('walking has metre-scale speed, smooth acceleration, bounded stops and surface grounding',async()=>{
  const {worldVelocity,worldFloorHeight}=await import('./continuum-world-model.mjs');
  assert.ok(Math.abs(movementVector({x:0,z:1},0,.1).z-.155)<1e-9);
  assert.ok(movementVector({x:0,z:1},0,.1,true).z>.4);
  let v=worldVelocity({x:0,z:0},{x:0,z:4.2},1/60);
  assert.ok(v.z>0 && v.z<.18);
  for(let i=0;i<12;i++)v=worldVelocity(v,{x:0,z:0},1/60);
  assert.equal(v.z,0);
  assert.equal(worldFloorHeight('outdoors',{x:3,z:-26.5}),.063);
  assert.equal(worldFloorHeight('tokyo_cafe',{x:0,z:0}),0);
});

test('stocked Hoshi aisles keep entry, checkout, side aisles and exit accessible',()=>{
  const id='tokyo_konbini',start=worldScenes[id].spawn;
  for(const target of [{x:0,z:-2},{x:3,z:0},{x:-3,z:0},{x:5.7,z:0},{x:-5.7,z:0},{x:0,z:5}]) {
    assert.ok(isWorldWalkable(id,target));
    const route=worldPath(id,start,target);
    assert.ok(route.length>0,'route to '+JSON.stringify(target));
    assert.ok(route.every(p=>isWorldWalkable(id,p)));
  }
  for(const target of [{x:1.85,z:1.25},{x:-1.85,z:1.25},{x:4.8,z:4.65},{x:6.65,z:0},{x:5.75,z:-5.35}])assert.equal(isWorldWalkable(id,target),false,'solid shop fixture blocks the player');
  const counter=moveWorldActor(id,start,{x:0,z:-20});
  assert.equal(worldInteraction(id,counter)?.type,'talk');
  const saved=restoreWorldState({...restoreWorldState(),scene:id,position:{x:1.85,z:1.25}});
  assert.deepEqual(saved.position,start,'old saves inside new shelving return to the safe entry');
});

test('Hoshi entrance camera has a clear apron view while the player stays inside',async()=>{
  const {clearWorldCameraSegment}=await import('./continuum-world-model.mjs');
  assert.equal(clearWorldCameraSegment('tokyo_konbini',{x:0,z:4},{x:0,z:7.8}),true);
  assert.equal(clearWorldCameraSegment('tokyo_konbini',{x:0,z:4},{x:3,z:8}),false,'camera cannot cross the side glazing/walls');
  assert.equal(clearWorldCameraSegment('tokyo_konbini',{x:0,z:4},{x:0,z:10.5}),false);
  assert.equal(clearWorldCameraSegment('tokyo_cafe',{x:0,z:4},{x:0,z:7.8}),true,'café also has an entrance apron');
  assert.equal(isWorldWalkable('tokyo_konbini',{x:0,z:7.8}),false,'camera space is not new player movement space');
});


test('coffee bar seating leaves central route and both service points accessible',()=>{
  const id='tokyo_cafe',start=worldScenes[id].spawn;
  for(const target of [{x:0,z:-2},{x:2.3,z:1},{x:-2.3,z:1},{x:0,z:5}]){
    assert.ok(worldPath(id,start,target).length>0);
  }
  for(const x of [-4.65,4.65])for(const z of [-.9,1.55])assert.equal(isWorldWalkable(id,{x,z}),false);
  assert.equal(worldInteraction(id,moveWorldActor(id,start,{x:0,z:-20}))?.type,'talk');
});
