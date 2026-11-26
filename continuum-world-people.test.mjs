import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import * as THREE from "three";
import { upgradeWorldPeople } from "./continuum-world-people.mjs";

test("shipped people are bounded, clothed, self-contained CC0 derivatives with real skeletons", async () => {
  const root = new URL("./public/world-tokyo/people/", import.meta.url),
    manifest = JSON.parse(
      await readFile(new URL("manifest.json", root), "utf8"),
    );
  assert.equal(manifest.license, "CC0-1.0");
  let bytes = 0;
  for (const file of manifest.files) {
    const data = await readFile(new URL(file.name + ".glb", root));
    assert.equal(data.readUInt32LE(0), 0x46546c67);
    assert.equal(data.readUInt32LE(8), data.length);
    assert.equal(data.length, file.bytes);
    assert.equal(createHash("sha256").update(data).digest("hex"), file.sha256);
    const g = JSON.parse(
      data.subarray(20, 20 + data.readUInt32LE(12)).toString(),
    );
    assert.equal(g.asset.extras.clothed, true);
    assert.equal(
      g.asset.extras.sourceArchiveSha256,
      manifest.sourceArchiveSha256,
    );
    assert.ok(g.skins[0].joints.length > 50);
    assert.ok(g.images.every((i) => i.bufferView !== undefined && !i.uri));
    assert.ok(g.buffers.every((b) => !b.uri));
    const binaryStart = 20 + data.readUInt32LE(12) + 8;
    const component = (index, vertex, lane) => {
      const a = g.accessors[index],
        view = g.bufferViews[a.bufferView],
        size = a.componentType === 5121 ? 1 : a.componentType === 5123 ? 2 : 4,
        offset =
          binaryStart +
          (view.byteOffset || 0) +
          (a.byteOffset || 0) +
          vertex * (view.byteStride || size * 4) +
          lane * size;
      return a.componentType === 5121
        ? data.readUInt8(offset)
        : a.componentType === 5123
          ? data.readUInt16LE(offset)
          : data.readFloatLE(offset);
    };
    for (const m of g.meshes)
      for (const p of m.primitives) {
        const joints = p.attributes.JOINTS_0,
          weights = p.attributes.WEIGHTS_0;
        for (let i = 0; i < g.accessors[joints].count; i++) {
          let total = 0;
          for (let lane = 0; lane < 4; lane++) {
            assert.ok(
              component(joints, i, lane) < g.skins[0].joints.length,
              "every packed joint index addresses a real bone",
            );
            const weight = component(weights, i, lane);
            assert.ok(Number.isFinite(weight) && weight >= 0 && weight <= 1);
            total += weight;
          }
          assert.ok(
            Math.abs(total - 1) < 0.001,
            "skin weights remain normalized after export",
          );
        }
      }
    const used = new Set(
      g.meshes.flatMap((m) =>
        m.primitives.map((p) => g.materials[p.material].name),
      ),
    );
    for (const garment of ["World shirt", "World trousers", "World shoes"])
      assert.ok(used.has(garment));
    assert.ok(g.meshes.reduce((n, m) => n + m.primitives.length, 0) <= 8);
    assert.ok(file.triangles < 14000);
    bytes += data.length;
  }
  assert.equal(manifest.files.length, 2);
  assert.ok(bytes < 4_100_000);
});

function actor(variant = "traveller") {
  const root = new THREE.Group(),
    fallback = new THREE.Group();
  root.position.set(3, 0, -2);
  root.add(fallback);
  return { root, variant, animate() {} };
}
function source() {
  const scene = new THREE.Group(),
    bone = new THREE.Bone(),
    knee = new THREE.Bone();
  bone.name = "thigh_l";
  knee.name = "calf_l";
  bone.add(knee);
  scene.add(bone);
  const geometry = new THREE.BoxGeometry(0.2, 1, 0.2);
  const count = geometry.attributes.position.count;
  geometry.setAttribute(
    "skinIndex",
    new THREE.Uint16BufferAttribute(new Uint16Array(count * 4), 4),
  );
  const weights = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) weights[i * 4] = 1;
  geometry.setAttribute(
    "skinWeight",
    new THREE.Float32BufferAttribute(weights, 4),
  );
  const material = new THREE.MeshStandardMaterial();
  material.name = "World shirt";
  const mesh = new THREE.SkinnedMesh(geometry, material);
  scene.add(mesh);
  mesh.bind(new THREE.Skeleton([bone, knee]));
  return { scene, mesh };
}

test("one decode is reused with independent skeletons, preserving location and reduced motion", async () => {
  const people = [actor(), actor()],
    original = source();
  let fetches = 0,
    status;
  const manager = upgradeWorldPeople(people, {
    fetchAsset: async () => {
      fetches++;
      return { ok: true, arrayBuffer: async () => new ArrayBuffer(1) };
    },
    parseAsset: async () => original,
    onStatus: (loaded, total) => {
      status = [loaded, total];
    },
  });
  await manager.ready;
  assert.equal(fetches, 1);
  assert.deepEqual(status, [2, 2]);
  assert.deepEqual(people[0].root.position.toArray(), [3, 0, -2]);
  assert.equal(people[0].root.children[0].visible, false);
  const rigs = people.map((a) => {
    let rig;
    a.root.traverse((o) => {
      if (o.isSkinnedMesh) rig = o.skeleton;
    });
    return rig;
  });
  assert.notEqual(rigs[0], rigs[1]);
  people[0].animate(0.1, 3, false);
  people[0].animate(0.2, 3, false);
  assert.notEqual(rigs[0].bones[0].quaternion.x, rigs[1].bones[0].quaternion.x);
  people[0].animate(0.3, 0, true);
  assert.equal(people[0].root.children[1].position.y, 0);
  manager.dispose();
  manager.dispose();
  assert.equal(people[0].root.children.length, 1);
});

test("art failures and scene abort retain the playable fallback without reporting success", async () => {
  const person = actor(),
    controller = new AbortController();
  const manager = upgradeWorldPeople([person], {
    signal: controller.signal,
    fetchAsset: async () => {
      throw new Error("offline");
    },
  });
  await manager.ready;
  assert.equal(person.root.children[0].visible, true);
  assert.equal(person.root.userData.worldPerson, undefined);
  controller.abort();
  manager.dispose();
  let fetched = false;
  const stopped = upgradeWorldPeople([person], {
    signal: controller.signal,
    fetchAsset: async () => {
      fetched = true;
    },
  });
  await stopped.ready;
  assert.equal(fetched, false);
});

test("a model decoded after exit is released once and never attached", async () => {
  let finish, started;
  const parsing = new Promise((r) => {
      started = r;
    }),
    person = actor(),
    original = source();
  let disposed = 0,
    closed = 0;
  original.mesh.geometry.addEventListener("dispose", () => disposed++);
  original.mesh.material.map = new THREE.Texture({
    close() {
      closed++;
    },
  });
  const duplicate = new THREE.Mesh(
    original.mesh.geometry,
    original.mesh.material,
  );
  original.scene.add(duplicate);
  const manager = upgradeWorldPeople([person], {
    fetchAsset: async () => ({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(1),
    }),
    parseAsset: () => {
      started();
      return new Promise((r) => {
        finish = r;
      });
    },
  });
  await parsing;
  manager.dispose();
  finish(original);
  await manager.ready;
  assert.equal(disposed, 1);
  assert.equal(closed, 1);
  assert.equal(person.root.children.length, 1);
  assert.equal(person.root.children[0].visible, true);
});
