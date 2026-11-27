import {makeOsakaWorld} from './continuum-world-osaka.mjs';
import {expansionLocations} from './continuum-world-districts.mjs';
import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { makeWorldSurfaces } from "./continuum-world-materials.mjs";
import {
  worldMeshes,
  shopBuilding,
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
    const outdoor = makeOutdoorWorld(meshes);
    const storefrontLights = [];
    outdoor.traverse(object => { if (object.name === "Tokyo storefront spill") storefrontLights.push(object); });
    assert.equal(storefrontLights.length, 2);
    const positions = storefrontLights.map(light => light.getWorldPosition(new THREE.Vector3())).sort((a,b) => a.x-b.x);
    assert.equal(positions[0].x, -17); assert.equal(positions[1].x, 17);
    assert.ok(positions.every(p => Math.abs(p.z + 5.7) < .001));
    assert.ok(budget(outdoor).draws < 170, JSON.stringify(budget(outdoor)));
    assert.ok(budget(outdoor).triangles < 68000, JSON.stringify(budget(outdoor)));
    // The engine creates a fresh factory per scene, including its 64-slot sign
    // atlas; separate interiors never accumulate signs in an outdoor factory.
    for (const id of ["tokyo_cafe","tokyo_konbini"]) {
      const roomMeshes=worldMeshes();
      try {
        const room=makeWorldInterior(id,roomMeshes);
        if(id==='tokyo_konbini') {
          const doors=[];room.traverse(o=>{if(o.userData.hoshiDoorSide)doors.push(o);});
          assert.equal(doors.length,2);
          assert.ok(doors.every(d=>d.children.length===2 && d.children.every(m=>m.userData.worldBatch===false && !m.castShadow)), 'sliding doors retain separate movable geometry without cached shadows');
          assert.ok(room.userData.stockedProducts>1000,'readable stocked aisles, not a few anonymous boxes');
          const maps=new Set();room.traverse(o=>{if(o.material)for(const v of Object.values(o.material))if(v?.isTexture)maps.add(v);});
          assert.ok([...maps].some(m=>m.image?.width===1024),'original packaging/floor atlases are present');
          let released=0;maps.forEach(m=>m.addEventListener('dispose',()=>released++));
          roomMeshes.dispose();assert.equal(released,maps.size,'store atlas and floor maps are released once');
          roomMeshes.dispose();assert.equal(released,maps.size);
        }
        assert.ok(budget(room).draws < 55,JSON.stringify(budget(room)));
        assert.ok(budget(room).triangles < (id==='tokyo_cafe'?10000:55000),JSON.stringify(budget(room)));
      } finally { roomMeshes.dispose(); }
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
    assert.equal(
      images[0].crossOrigin,
      "anonymous",
      "native remote media must remain usable as WebGL textures",
    );
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
    const photo = images.findLast(image => image.src === "/world-tokyo/materials/pavement_04.jpg");
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

test("scanned PBR maps have pinned contents and quality-specific bounded downloads", async () => {
  const root = new URL("./public/world-tokyo/pbr/", import.meta.url);
  const manifest = JSON.parse(await readFile(new URL("manifest.json", root), "utf8"));
  assert.equal(manifest.license, "CC0-1.0");
  assert.equal(manifest.resolution, 1024);
  assert.equal(manifest.files.length, 9);
  let full = 0, automatic = 0;
  for (const file of manifest.files) {
    const bytes = await readFile(new URL(file.filename, root));
    assert.equal(bytes.length, file.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256);
    assert.equal(bytes[0], 255); assert.equal(bytes[1], 216);
    full += bytes.length;
    if (file.channel === "color" || (file.channel === "normal" && ["pavement_04", "concrete_wall_001"].includes(file.asset))) automatic += bytes.length;
  }
  assert.ok(full < 4_100_000);
  assert.ok(automatic < 900_000);
});

test("linear PBR maps share GPU sources, keep neutral fallbacks and are optional on Low", () => {
  const oldDocument = globalThis.document, oldImage = globalThis.Image, images = [];
  globalThis.document = canvasDocument();
  globalThis.Image = class { constructor() { images.push(this); } };
  const owned = [], surfaces = makeWorldSurfaces(t => owned.push(t));
  let automatic, low;
  try {
    const normal = surfaces.detail("paving", "normal"), neutral = normal.image;
    assert.equal(normal.colorSpace, THREE.NoColorSpace);
    assert.equal(neutral.width, 1);
    assert.equal(surfaces.detail("paving", "normal"), normal);
    images.at(-1).onerror();
    assert.equal(normal.image, neutral);
    assert.equal(surfaces.pending, 0);
    automatic = worldMeshes({quality:"auto"});
    const material = automatic.surface("paving", [3, 7]);
    assert.ok(material.isMeshStandardMaterial);
    assert.equal(material.normalMap.colorSpace, THREE.NoColorSpace);
    assert.deepEqual(material.normalMap.repeat.toArray(), [3,7]);
    let resets = 0;
    material.normalMap.addEventListener("dispose", () => resets++);
    const image = images.findLast(i => i.src.includes("pavement_04_normal"));
    image.onload();
    assert.equal(resets, 1);
    assert.equal(material.normalMap.image, image);
    const before = images.length;
    low = worldMeshes({quality:"low"});
    const simple = low.surface("paving", 3);
    assert.ok(simple.isMeshLambertMaterial);
    assert.ok(!simple.normalMap);
    assert.ok(images.slice(before).every(i => !i.src.includes("/pbr/")));
  } finally {
    surfaces.dispose(); automatic?.dispose(); low?.dispose(); owned.forEach(t => t.dispose());
    globalThis.document = oldDocument; globalThis.Image = oldImage;
  }
});

test('re-entering reuses CPU surface painting while keeping scene canvases disposable',()=>{
  const previous=globalThis.document;let fills=0,copies=0;
  const context=new Proxy({},{get:(_,k)=>k==='fillRect'?()=>fills++:k==='drawImage'?()=>copies++:k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{},set:()=>true});
  globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>context})};
  try{
    const first=makeWorldSurfaces(()=>{});const a=first.texture('fabric');first.dispose();
    // Mirrors scene disposal: the previously owned canvas may be shrunk.
    a.image.width=a.image.height=1;
    fills=0;copies=0;
    const second=makeWorldSurfaces(()=>{});const b=second.texture('fabric');
    assert.notEqual(a.image,b.image);assert.equal(b.image.width,512);
    assert.ok(fills<10,'warm scene avoids thousands of per-speckle paint calls');
    assert.equal(copies,1,'copy retained CPU source into a scene-owned canvas');second.dispose();
  }finally{globalThis.document=previous;}
});

test('new districts and interiors fit independent fixed geometry budgets and release their GPU resources',()=>{
 const previous=globalThis.document;globalThis.document=canvasDocument();
 try{
  for(const quality of ['low','auto'])for(const id of ['osaka',...expansionLocations.map(l=>l.id)]){
   const meshes=worldMeshes({quality});try{
    const root=id==='osaka'?makeOsakaWorld(meshes):makeWorldInterior(id,meshes),b=budget(root);
    assert.ok(b.draws<(id==='osaka'?100:50),id+' '+JSON.stringify(b));
    assert.ok(b.triangles<(id==='osaka'?50000:12000),id+' '+JSON.stringify(b));
    const geometries=new Set(),materials=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});
    let released=0;materials.forEach(m=>m.addEventListener('dispose',()=>released++));meshes.dispose();assert.equal(released,materials.size);meshes.dispose();assert.equal(released,materials.size);
   }finally{meshes.dispose();}
  }
 }finally{globalThis.document=previous;}
});

test('side-wall rays resolve the facade and recessed slab at separate depths near the reported flicker seam',()=>{
 const previous=globalThis.document;globalThis.document=canvasDocument();
 try{for(const [width,depth,height]of [[15,13,9],[15,13,7],[18,22,18],[8,12,25],[10,12,22]]){
  const meshes=worldMeshes({quality:'low'}),root=new THREE.Group();try{
   shopBuilding(meshes,root,{id:'tokyo_cafe',x:0,z:0,width,depth,height,sign:'検証用',color:0xbfcbbf});root.updateMatrixWorld(true);
   const ray=new THREE.Raycaster(new THREE.Vector3(width/2+2,3.61,.21),new THREE.Vector3(-1,0,0));
   const hits=ray.intersectObject(root,true).filter(h=>h.face.normal.x>.9);
   assert.ok(hits.length>=2);assert.ok(hits[1].distance-hits[0].distance>.02,'opaque slab must not share the exterior wall depth');
  }finally{meshes.dispose();}
 }}finally{globalThis.document=previous;}
});
