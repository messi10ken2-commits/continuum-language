import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export const worldPeopleAssets = {
  traveller: "/world-tokyo/people/traveller.glb",
  resident: "/world-tokyo/people/resident.glb",
};

// Every World owns its downloads, clones and GPU resources. No cross-account cache.
export function upgradeWorldPeople(
  actors,
  {
    signal,
    physical = false,
    onStatus = () => {},
    fetchAsset = fetch,
    parseAsset = (bytes) => new GLTFLoader().parseAsync(bytes, ""),
  } = {},
) {
  const resources = new Set(),
    originals = [],
    skeletons = new Set(),
    controller = new AbortController();
  let disposed = false;
  const track = (scene, owned = resources, rigs = skeletons) =>
    scene.traverse((o) => {
      if (o.geometry) owned.add(o.geometry);
      for (const m of [o.material].flat().filter(Boolean)) {
        owned.add(m);
        for (const value of Object.values(m))
          if (value?.isTexture) owned.add(value);
      }
      if (o.skeleton) rigs.add(o.skeleton);
    });
  const release = (owned, rigs) => {
    const images = new Set();
    rigs.forEach((s) => s.dispose());
    owned.forEach((r) => {
      if (r.isTexture && r.source?.data && !images.has(r.source.data)) {
        images.add(r.source.data);
        r.source.data.close?.();
      }
      r.dispose();
    });
    owned.clear();
    rigs.clear();
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    signal?.removeEventListener("abort", dispose);
    originals.forEach((o) => o.removeFromParent());
    release(resources, skeletons);
    originals.length = 0;
  };
  signal?.addEventListener("abort", dispose, { once: true });
  if (signal?.aborted) dispose();
  let upgraded = 0;
  const deadline = setTimeout(() => controller.abort(), 30000);
  const ready = Promise.all(
    Object.entries(worldPeopleAssets).map(async ([variant, url]) => {
      const selected = actors.filter(
        (a) => (a.variant || "traveller") === variant,
      );
      if (!selected.length || disposed) return;
      try {
        const response = await fetchAsset(url, {
          signal: controller.signal,
          credentials: "omit",
        });
        if (!response.ok) throw new Error("World model unavailable");
        const bytes = await response.arrayBuffer();
        if (disposed || controller.signal.aborted) return;
        const gltf = await parseAsset(bytes);
        if (disposed || controller.signal.aborted) {
          // parseAsync itself cannot be aborted; release a late result immediately.
          const late = new Set(),
            rigs = new Set();
          track(gltf.scene, late, rigs);
          release(late, rigs);
          return;
        }
        track(gltf.scene);
        for (const actor of selected) {
          const body = clone(gltf.scene);
          body.name = "Tokyo clothed skinned " + variant;
          originals.push(body);
          body.traverse((o) => {
            if (!o.isMesh) return;
            o.castShadow = false;
            o.receiveShadow = true;
            // Conservative skinned bounds avoid disappearing arms/feet during a turn.
            o.frustumCulled = false;
            const old = o.material;
            const cloth = /shirt|trousers|shoes/.test(old.name);
            const Material = physical
              ? THREE.MeshStandardMaterial
              : THREE.MeshLambertMaterial;
            const material = new Material({
              color:
                old.name === "World shirt"
                  ? actor.color || 0x637d79
                  : old.color,
              map: old.map || null,
              side: THREE.FrontSide,
              ...(physical
                ? { roughness: old.roughness ?? 0.85, metalness: 0 }
                : {}),
            });
            material.name = old.name;
            o.material = material;
            resources.add(material);
            if (cloth || !o.geometry.attributes.normal) {
              o.geometry = o.geometry.clone();
              o.geometry.computeVertexNormals();
              resources.add(o.geometry);
            }
          });
          track(body);
          const animate = worldPersonPose(body);
          // Existing root/contact shadow and location remain unchanged on arrival.
          actor.root.children[0].visible = false;
          actor.root.add(body);
          actor.animate = animate;
          actor.root.userData.worldPerson = "skinned";
          upgraded++;
        }
        onStatus(upgraded, actors.length);
      } catch (error) {
        if (!disposed) onStatus(upgraded, actors.length);
        // A failed optional art asset never removes the current playable person.
      }
    }),
  ).finally(() => clearTimeout(deadline));
  return { ready, dispose };
}

export function worldPersonPose(body) {
  const bones = new Map();
  body.traverse((o) => {
    if (o.isBone) bones.set(o.name, o);
  });
  body.updateMatrixWorld(true);
  for (const [name, bone] of bones) {
    if (/^(index|middle|ring|pinky)_0[123]_[lr]$/.test(name)) {
      const curl = name.includes("_01_") ? 0.08 : 0.24;
      bone.quaternion.multiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          curl,
        ),
      );
    }
  }
  const worldAxis = new THREE.Vector3(0, 0, 1);
  // The CC0 source is in a T pose. Lower both arms in world space before gait.
  for (const [name, angle] of [
    ["upperarm_l", -1.36],
    ["upperarm_r", 1.36],
  ]) {
    const bone = bones.get(name);
    if (!bone) continue;
    const parent = bone.parent
      .getWorldQuaternion(new THREE.Quaternion())
      .invert();
    bone.quaternion.premultiply(
      new THREE.Quaternion().setFromAxisAngle(
        worldAxis.clone().applyQuaternion(parent),
        angle,
      ),
    );
    body.updateMatrixWorld(true);
  }
  const rest = new Map();
  for (const [name, bone] of bones) {
    rest.set(name, {
      q: bone.quaternion.clone(),
      axis: new THREE.Vector3(1, 0, 0).applyQuaternion(
        bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert(),
      ),
    });
  }
  const rotate = (name, angle) => {
    const bone = bones.get(name),
      r = rest.get(name);
    if (bone)
      bone.quaternion
        .copy(r.q)
        .premultiply(new THREE.Quaternion().setFromAxisAngle(r.axis, angle));
  };
  let previous = 0,
    phase = 0,
    gait = 0;
  return (time, speed, reduced) => {
    const dt = Math.min(0.1, Math.max(0, time - previous));
    previous = time;
    gait += (speed - gait) * (1 - Math.exp(-dt / 0.14));
    phase += dt * (gait > 4 ? 11 : 8);
    const a = reduced ? 0 : Math.min(0.48, gait * 0.1);
    for (const [i, side] of ["l", "r"].entries()) {
      const step = Math.sin(phase + i * Math.PI);
      rotate("thigh_" + side, step * a);
      rotate("calf_" + side, -Math.max(0, -step) * a * 1.15);
      rotate("upperarm_" + side, -step * a * 0.7);
      rotate("lowerarm_" + side, -0.1 - Math.max(0, step) * a * 0.18);
    }
    body.position.y = reduced
      ? 0
      : Math.abs(Math.sin(phase)) * Math.min(0.018, gait * 0.004);
  };
}
