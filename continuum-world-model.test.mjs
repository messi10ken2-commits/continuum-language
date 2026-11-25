import test from "node:test";
import assert from "node:assert/strict";
import {
  worldAvailable,
  worldLocations,
  worldScenes,
  isWorldWalkable,
  moveWorldActor,
  movementVector,
  worldPath,
  worldInteraction,
  restoreWorldState,
  worldStorageKey,
} from "./continuum-world-model.mjs";
import { continuumWorldCopy } from "./continuum-world-copy.mjs";
import { CALL_MODELS } from "./companion-call-models.mjs";

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
test("four authored places have safe doors, four distinct NPCs and two enterable interiors", () => {
  assert.equal(worldLocations.length, 4);
  assert.equal(worldLocations.filter((l) => l.interior).length, 2);
  assert.equal(new Set(worldLocations.map((l) => l.npc.id)).size, 4);
  for (const location of worldLocations) {
    assert.ok(isWorldWalkable("outdoors", location.door));
    assert.ok(
      worldPath("outdoors", worldScenes.outdoors.spawn, location.door).length,
    );
    if (location.interior)
      assert.equal(worldInteraction("outdoors", location.door)?.type, "enter");
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
  assert.deepEqual(movementVector({ x: 0, z: -1 }, 0, 50), movementVector({ x: 0, z: -1 }, 0, .1));
  assert.ok(
    Math.hypot(
      ...Object.values(movementVector({ x: 0, z: -1 }, 0, 0.05, true)),
    ) > Math.hypot(forward.x, forward.z),
  );
  assert.deepEqual(movementVector({ x: 0, z: 0 }, 0, 0.05), { x: 0, z: 0 });
});
test("companion routing goes around buildings and each step stays walkable", () => {
  const route = worldPath("outdoors", { x: -17, z: 0 }, { x: -17, z: -25 });
  assert.ok(route.length > 3);
  for (const point of route) assert.ok(isWorldWalkable("outdoors", point));
  for (const scene of ["tokyo_cafe", "tokyo_konbini"]) {
    assert.ok(
      worldPath(scene, worldScenes[scene].spawn, { x: 0, z: -1 }).length,
    );
    assert.equal(worldInteraction(scene, { x: 0, z: 5 }).type, "exit");
    assert.equal(worldInteraction(scene, { x: 0, z: -1 }).type, "talk");
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
