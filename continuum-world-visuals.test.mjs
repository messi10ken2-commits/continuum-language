import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { makeWorldSurfaces } from "./continuum-world-materials.mjs";
import {
  worldMeshes,
  makeOutdoorWorld,
  makeWorldPerson,
  makeWorldCompanion,
} from "./continuum-world-scenes.mjs";
import { makeWorldInterior } from "./continuum-world-interiors.mjs";
import {
  worldRenderProfile,
  reducedWorldPixelRatio,
} from "./continuum-world-render-policy.mjs";
import {
  isWorldWalkable,
  worldScenes,
  worldPath,
} from "./continuum-world-model.mjs";

// Geometry/material tests need no GPU; browser QA verifies actual textures and light.
function canvasDocument() {
  const context = new Proxy(
    {},
    {
      get: (o, k) =>
        o[k] ||
        (k === "createRadialGradient" || k === "createLinearGradient"
          ? () => ({ addColorStop() {} })
          : () => {}),
      set: (o, k, v) => ((o[k] = v), true),
    },
  );
  return {
    createElement: () => ({ width: 0, height: 0, getContext: () => context }),
  };
}
function budget(root) {
  let draws = 0,
    triangles = 0;
  root.traverse((o) => {
    if (o.isMesh) {
      draws++;
      triangles +=
        ((o.geometry.index?.count || o.geometry.attributes.position.count) /
          3) *
        (o.count || 1);
    }
  });
  return { draws, triangles };
}

test("mobile density and shadow cost stay bounded at every quality", () => {
  for (const width of [320, 390, 844, 1280])
    for (const dpr of [1, 2, 3, 4]) {
      const auto = worldRenderProfile("auto", width, dpr);
      assert.ok(auto.pixelRatio <= 1.25);
      assert.ok(auto.shadowSize <= 512);
      if (width < 700) assert.equal(auto.shadowSize, 0);
      assert.equal(worldRenderProfile("low", width, dpr).shadowSize, 0);
      assert.ok(worldRenderProfile("high", width, dpr).pixelRatio <= 1.75);
    }
  let ratio = 1.25;
  for (let i = 0; i < 15; i++) ratio = reducedWorldPixelRatio(ratio, 10);
  assert.equal(ratio, 0.6);
  assert.equal(reducedWorldPixelRatio(1, 30), 1);
  assert.equal(reducedWorldPixelRatio(1, NaN), 1);
});

test("detailed architecture keeps the traversal corridor and matches the west facade collider", () => {
  assert.equal(isWorldWalkable("outdoors", { x: -14, z: 15 }), false);
  assert.equal(isWorldWalkable("outdoors", { x: -8, z: 15 }), true);
  const path = worldPath("outdoors", worldScenes.outdoors.spawn, {
    x: -17,
    z: -5,
  });
  assert.ok(path.length > 0);
  assert.ok(path.every((p) => isWorldWalkable("outdoors", p)));
});

test("authored scenes and full-body companions fit fixed geometry budgets and dispose GPU resources", () => {
  const previous = globalThis.document;
  globalThis.document = canvasDocument();
  const meshes = worldMeshes();
  try {
    const outdoor = makeOutdoorWorld(meshes),
      cafe = makeWorldInterior("tokyo_cafe", meshes),
      market = makeWorldInterior("tokyo_konbini", meshes);
    assert.ok(budget(outdoor).draws < 110);
    assert.ok(budget(outdoor).triangles < 40000);
    for (const room of [cafe, market]) {
      assert.ok(budget(room).draws < 50);
      assert.ok(budget(room).triangles < 10000);
    }
    const person = makeWorldPerson(meshes),
      size = new THREE.Box3()
        .setFromObject(person.root)
        .getSize(new THREE.Vector3());
    assert.ok(
      size.y > 1.7 && size.y < 1.85,
      "traveller has adult metre-scale proportions",
    );
    person.animate(0.1, 3, false);
    person.animate(0.2, 3, false);
    assert.ok(
      person.root.children[0].position.y > 0,
      "gait produces a small grounded step",
    );
    person.animate(0.3, 0, true);
    assert.equal(person.root.children[0].position.y, 0);
    person.root.traverse((o) => {
      if (o.isMesh)
        assert.equal(
          o.castShadow,
          false,
          "moving actors must not be frozen into cached architecture shadows",
        );
    });
    for (const kind of [
      "bird",
      "capybara",
      "fox",
      "cat",
      "dog",
      "guinea-pig",
      "quokka",
      "panda",
    ]) {
      const actor = makeWorldCompanion(meshes, kind);
      assert.equal(actor.kind, kind);
      assert.ok(
        budget(actor.root).triangles < 7500,
        kind + " full body stays in budget",
      );
      actor.animate(0.2, 3, false);
      actor.animate(0.3, 0, true);
      assert.equal(actor.root.children[0].position.y, 0);
      assert.ok(
        new THREE.Box3().setFromObject(actor.root).getSize(new THREE.Vector3())
          .y < 1.05,
      );
    }
    assert.equal(makeWorldCompanion(meshes, "invalid").kind, "bird");
    let geometryDisposed = 0,
      materialDisposed = 0,
      instanceDisposed = 0;
    const geometry = new Set(),
      material = new Set();
    outdoor.traverse((o) => {
      if (o.geometry && !geometry.has(o.geometry)) {
        geometry.add(o.geometry);
        o.geometry.addEventListener("dispose", () => geometryDisposed++);
      }
      if (o.material && !material.has(o.material)) {
        material.add(o.material);
        o.material.addEventListener("dispose", () => materialDisposed++);
      }
      if (o.isInstancedMesh)
        o.addEventListener("dispose", () => instanceDisposed++);
    });
    meshes.dispose();
    assert.equal(geometryDisposed, geometry.size);
    assert.equal(materialDisposed, material.size);
    assert.ok(instanceDisposed > 0);
    meshes.dispose();
    assert.equal(geometryDisposed, geometry.size);
    assert.equal(materialDisposed, material.size);
  } finally {
    globalThis.document = previous;
  }
});

test("bundled CC0 photographs match the recorded files and stay inside a bounded download budget", async () => {
  const root = new URL("./public/world-tokyo/materials/", import.meta.url),
    manifest = JSON.parse(
      await readFile(new URL("manifest.json", root), "utf8"),
    );
  assert.equal(manifest.license, "CC0-1.0");
  let total = 0;
  for (const file of manifest.files) {
    assert.match(file.asset, /^(pavement_04|asphalt_02|wood_planks)$/);
    const bytes = await readFile(new URL(file.asset + ".jpg", root));
    assert.equal(bytes.length, file.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256);
    total += bytes.length;
  }
  assert.equal(manifest.files.length, 3);
  assert.ok(total < 3_000_000);
});

test("photo loading preserves the fallback, updates shared sources and ignores completion after disposal", () => {
  const previousDocument = globalThis.document,
    previousImage = globalThis.Image,
    images = [];
  globalThis.document = canvasDocument();
  globalThis.Image = class {
    constructor() {
      images.push(this);
    }
  };
  const textures = [],
    updates = [],
    surfaces = makeWorldSurfaces(
      (t) => textures.push(t),
      (t) => updates.push(t),
    );
  let sharedMeshes;
  try {
    const paving = surfaces.texture("paving"),
      fallback = paving.image;
    assert.ok(fallback.getContext);
    assert.equal(surfaces.pending, 1);
    let storageReset = 0;
    paving.addEventListener("dispose", () => storageReset++);
    images[0].onload();
    assert.equal(
      storageReset,
      1,
      "resize releases immutable GPU storage before the larger image",
    );
    assert.equal(paving.image, images[0]);
    assert.equal(surfaces.loaded, 1);
    assert.deepEqual(updates, [paving]);
    const asphalt = surfaces.texture("asphalt"),
      old = asphalt.image,
      late = images[1].onload;
    surfaces.dispose();
    assert.equal(surfaces.pending, 0);
    assert.equal(images[1].onload, null);
    late();
    assert.equal(asphalt.image, old);
    assert.equal(updates.length, 1);
    sharedMeshes = worldMeshes();
    const clonedMap = sharedMeshes.surface("paving", 29).map;
    let cloneReset = 0;
    clonedMap.addEventListener("dispose", () => cloneReset++);
    const photo = images.at(-1);
    photo.onload();
    assert.equal(
      cloneReset,
      1,
      "repeated maps also release their old GPU storage",
    );
    assert.equal(clonedMap.image, photo);
  } finally {
    sharedMeshes?.dispose();
    surfaces.dispose();
    textures.forEach((t) => t.dispose());
    globalThis.document = previousDocument;
    globalThis.Image = previousImage;
  }
});
