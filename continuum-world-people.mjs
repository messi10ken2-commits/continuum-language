import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

import { makeGroundedGait } from "./continuum-world-gait.mjs";
import { worldPeopleAssets } from "./continuum-world-people-assets.mjs";
export { worldPeopleAssets };

// Only immutable public model bytes are retained (two known URLs, <4.1 MB).
// Skeletons, decoded images and GPU resources still belong to each World.
const publicModelBytes=new Map();
// Pool ownership is deliberately local to one World, never the account or app.
export function createWorldPeoplePool({fetchAsset=fetch,parseAsset=(bytes)=>new GLTFLoader().parseAsync(bytes,'')}={}) {
 const cache=new Map(),loaded=new Set(),controller=new AbortController();let disposed=false,decodes=0;
 const release=scene=>{
  const resources=new Set(),rigs=new Set(),images=new Set();
  scene.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.skeleton)rigs.add(o.skeleton);for(const m of [o.material].flat().filter(Boolean)){resources.add(m);for(const v of Object.values(m))if(v?.isTexture)resources.add(v);}});
  rigs.forEach(r=>r.dispose());resources.forEach(r=>{if(r.isTexture&&r.source?.data&&!images.has(r.source.data)){images.add(r.source.data);r.source.data.close?.();}r.dispose();});
 };
 const load=variant=>{
  if(disposed)return Promise.reject(new Error('World people pool is closed'));
  if(!Object.hasOwn(worldPeopleAssets,variant))return Promise.reject(new Error('Unknown World person'));
  if(!cache.has(variant)){
   const pending=(async()=>{
    const url=worldPeopleAssets[variant];let bytes=fetchAsset===fetch?publicModelBytes.get(url):null;
    if(!bytes){const response=await fetchAsset(url,{signal:controller.signal,credentials:'omit'});if(!response.ok)throw Error('World model unavailable');bytes=await response.arrayBuffer();if(fetchAsset===fetch&&!controller.signal.aborted&&bytes.byteLength<2_050_000)publicModelBytes.set(url,bytes);}
    if(disposed)throw Error('World people pool is closed');
    const gltf=await parseAsset(bytes);decodes++;
    if(disposed){release(gltf.scene);throw Error('World people pool is closed');}
    gltf.scene.traverse(o=>{if(o.isMesh&&(/shirt|trousers|shoes/.test(o.material?.name)||!o.geometry.attributes.normal))o.geometry.computeVertexNormals();});
    loaded.add(variant);return gltf;
   })();cache.set(variant,pending);pending.catch(()=>{if(cache.get(variant)===pending)cache.delete(variant);});
  }
  return cache.get(variant);
 };
 return {load,get decodes(){return decodes;},get warmReady(){return loaded.size===2;},warm:()=>Promise.all(['traveller','resident'].map(load)).then(()=>true,()=>false),dispose(){if(disposed)return;disposed=true;controller.abort();loaded.clear();for(const promise of cache.values())void promise.then(g=>release(g.scene),()=>{});cache.clear();}};
}
export function upgradeWorldPeople(
  actors,
  {
    signal,
    physical = false,
    fabric = null,
    pool = null,
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
  const track = (scene, owned = resources, rigs = skeletons, assets = true) =>
    scene.traverse((o) => {
      if (assets && o.geometry) owned.add(o.geometry);
      for (const m of [o.material].flat().filter(Boolean)) {
        owned.add(m);
        for (const value of Object.values(m))
          if (assets && value?.isTexture) owned.add(value);
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
        let gltf;
        if(pool)gltf=await pool.load(variant);
        else {
        let bytes=fetchAsset===fetch?publicModelBytes.get(url):null;
        if(!bytes){
          const response=await fetchAsset(url,{signal:controller.signal,credentials:'omit'});
          if(!response.ok)throw new Error('World model unavailable');
          bytes=await response.arrayBuffer();
          if(fetchAsset===fetch && !controller.signal.aborted && bytes.byteLength<2_050_000)publicModelBytes.set(url,bytes);
        }
        if (disposed || controller.signal.aborted) return;
        gltf = await parseAsset(bytes);
        }
        if (disposed || controller.signal.aborted) {
          // parseAsync itself cannot be aborted; release a late result immediately.
          const late = new Set(),
            rigs = new Set();
          if(!pool){track(gltf.scene, late, rigs);release(late, rigs);}
          return;
        }
        // Cloth normals are identical for every clone: calculate once per decode.
        if(!pool)gltf.scene.traverse(o=>{if(o.isMesh && (/shirt|trousers|shoes/.test(o.material?.name)||!o.geometry.attributes.normal))o.geometry.computeVertexNormals();});
        if(!pool)track(gltf.scene);
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
            const Material = physical
              ? THREE.MeshStandardMaterial
              : THREE.MeshLambertMaterial;
            const material = new Material({
              color:
                old.name === "World shirt"
                  ? actor.color || 0xdedbd2
                  : old.color,
              map: old.map || null,
              side: THREE.FrontSide,
              ...(physical
                ? { roughness: old.roughness ?? 0.85, metalness: 0,
                    ...(/shirt|trousers|backpack/.test(old.name) && o.geometry.attributes.uv && fabric?.map ? {bumpMap:fabric.map,bumpScale:.002}: {}) }
                : {}),
            });
            material.name = old.name;
            o.material = material;
            resources.add(material);

          });
          track(body,resources,skeletons,!pool);
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
  return makeGroundedGait(body, bones);
}
