import {dressCafeExterior} from './continuum-world-cafe.mjs';
import * as THREE from "three";
import { dressHoshiExterior } from "./continuum-world-konbini.mjs";
import { makeStationDistrict } from "./continuum-world-station.mjs";
import { stationLayout } from "./continuum-world-station-layout.mjs";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  makeStreetTree,
  dressShopfront,
} from "./continuum-world-street-art.mjs";
import { dressTokyoBlock, makeTokyoRoadMarkings } from "./continuum-world-tokyo-block.mjs";
import { worldLocations } from "./continuum-world-model.mjs";
import {
  makeWorldSurfaces,
  worldRandom,
} from "./continuum-world-materials.mjs";
export {
  makeWorldPerson,
  makeWorldCompanion,
} from "./continuum-world-actors.mjs";

export function worldMeshes({ quality = "auto" } = {}) {
  const geometries = new Map(),
    materials = new Map(),
    textures = new Set(),
    batches = new Set();
  const surfaces = makeWorldSurfaces(
    (t) => textures.add(t),
    (source) => {
      for (const t of textures)
        if (t.source === source.source) {
          t.dispose();
          t.needsUpdate = true;
        }
    },
  );
  let disposed = false;
  const physical = quality !== "low";
  const fullPbr = quality === "high" || quality === "medium";
  let signAtlas, signContext, signTexture;
  const signSlots = new Map();
  const detailMaps = (mat, name, repeat = 1) => {
    if (!physical) return;
    const tile = Array.isArray(repeat) ? repeat : [repeat, repeat];
    const cloned = (channel) => {
      const source = surfaces.detail(name, channel);
      if (!source) return null;
      const map = source.clone();
      map.repeat.set(...tile);
      textures.add(map);
      return map;
    };
    if (fullPbr || name === "paving" || name === "concrete") {
      mat.normalMap = cloned("normal");
      if (mat.normalMap) {
        mat.normalScale.set(0.6, 0.6);
        mat.bumpMap = null;
      }
    }
    if (fullPbr) {
      mat.roughnessMap = cloned("roughness");
      if (mat.roughnessMap) mat.roughness = 1;
    }
  };
  const material = (color, glow = false) => {
    if (color?.isMaterial) return color;
    const key = color + ":" + glow;
    if (!materials.has(key)) {
      const surface =
        typeof color === "string" && !color.startsWith("#") ? color : null;
      const Type = physical
        ? THREE.MeshStandardMaterial
        : THREE.MeshLambertMaterial;
      const mat = new Type({
        color: surface ? 0xffffff : color,
        ...(physical
          ? {
              roughness: surface === "metal" ? 0.36 : 0.82,
              metalness: surface === "metal" ? 0.7 : 0,
            }
          : {}),
        ...(glow ? { emissive: color, emissiveIntensity: 0.6 } : {}),
      });
      if (surface) {
        mat.map = surfaces.texture(surface);
        if (physical) {
          mat.bumpMap = mat.map;
          mat.bumpScale = ["paving", "bark"].includes(surface) ? 0.055 : 0.018;
        }
      }
      if (surface) detailMaps(mat, surface);
      materials.set(key, mat);
    }
    return materials.get(key);
  };
  const surface = (name, repeat = 1, tint = 0xffffff) => {
    const key = `surface:${name}:${repeat}:${tint}`;
    if (!materials.has(key)) {
      const mat = material(name).clone(),
        map = surfaces.texture(name).clone();
      map.repeat.set(...(Array.isArray(repeat) ? repeat : [repeat, repeat]));
      textures.add(map);
      mat.map = map;
      if (mat.bumpMap) mat.bumpMap = map;
      detailMaps(mat, name, repeat);
      mat.color.set(tint);
      materials.set(key, mat);
    }
    return materials.get(key);
  };
  const special = (name, parameters) => {
    if (!materials.has(name)) {
      if (physical)
        materials.set(name, new THREE.MeshStandardMaterial(parameters));
      else {
        const { roughness, metalness, envMapIntensity, ...diffuse } =
          parameters;
        materials.set(name, new THREE.MeshLambertMaterial(diffuse));
      }
    }
    return materials.get(name);
  };
  const shape = (parent, type, color, position, size, glow = false) => {
    if (type === "sphere" && Math.max(...size) < 0.075) type = "detail";
    if (!geometries.has(type)) {
      const geometry =
        type === "box"
          ? new THREE.BoxGeometry(1, 1, 1)
          : type === "sphere"
            ? new THREE.SphereGeometry(
                1,
                quality === "high" ? 20 : 12,
                quality === "high" ? 14 : 8,
              )
            : type === "detail"
              ? new THREE.SphereGeometry(1, 8, 6)
              : type === "rounded"
                ? new RoundedBoxGeometry(1, 1, 1, 2, 0.12)
                : type === "torso"
                  ? new THREE.LatheGeometry(
                      [
                        [0.72, -0.5],
                        [0.78, -0.32],
                        [0.95, 0.05],
                        [1, 0.3],
                        [0.82, 0.4],
                        [0.4, 0.47],
                        [0.27, 0.5],
                      ].map(([x, y]) => new THREE.Vector2(x, y)),
                      16,
                    )
                  : type === "hair"
                    ? new THREE.SphereGeometry(
                        1,
                        16,
                        10,
                        0,
                        Math.PI * 2,
                        0,
                        Math.PI * 0.56,
                      )
                    : type === "sleeve"
                      ? new THREE.CylinderGeometry(1, 0.72, 1, 12, 2)
                      : type === "plane"
                        ? new THREE.PlaneGeometry(1, 1)
                        : type === "branch"
                          ? new THREE.CylinderGeometry(0.72, 1, 1, 6)
                          : type === "taper"
                            ? new THREE.CylinderGeometry(0.78, 1, 1, 12)
                            : type === "cone"
                              ? new THREE.ConeGeometry(1, 1, 12)
                              : new THREE.CylinderGeometry(1, 1, 1, 12);
      geometries.set(type, geometry);
    }
    const mesh = new THREE.Mesh(geometries.get(type), material(color, glow));
    mesh.position.set(...position);
    mesh.scale.set(...size);
    mesh.castShadow = type !== "plane";
    mesh.receiveShadow = true;
    mesh.userData.worldBatch = true;
    parent.add(mesh);
    return mesh;
  };
  const sign = (
    parent,
    text,
    position,
    width = 5,
    background = "#283a38",
    foreground = "#faf4e5",
  ) => {
    const key = `sign:${text}:${background}:${foreground}`;
    if (!signAtlas) {
      signAtlas = document.createElement("canvas");
      signAtlas.width = signAtlas.height = 2048;
      signContext = signAtlas.getContext("2d");
      signTexture = new THREE.CanvasTexture(signAtlas);
      signTexture.colorSpace = THREE.SRGBColorSpace;
      textures.add(signTexture);
      materials.set(
        "sign-atlas",
        new THREE.MeshLambertMaterial({
          map: signTexture,
          emissiveMap: signTexture,
          emissive: 0xffffff,
          emissiveIntensity: 0.22,
          alphaTest: 0.15,
        }),
      );
    }
    if (!signSlots.has(key)) {
      if (signSlots.size >= 64)
        throw new Error("World sign atlas budget exceeded");
      const slot = signSlots.size,
        x = (slot % 4) * 512,
        y = Math.floor(slot / 4) * 128,
        c = signContext;
      c.save();
      c.translate(x, y);
      c.fillStyle = background;
      c.fillRect(0, 0, 512, 128);
      c.strokeStyle = foreground + "55";
      c.lineWidth = 1;
      if (background !== "#00000000") c.strokeRect(7, 7, 498, 114);
      c.fillStyle = foreground;
      c.font = `500 ${text.length === 1 ? 100 : 52}px sans-serif`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(text, 256, 66, 470);
      c.restore();
      signTexture.needsUpdate = true;
      const geometry = new THREE.PlaneGeometry(1, 1),
        uv = geometry.attributes.uv;
      for (let i = 0; i < uv.count; i++)
        uv.setXY(
          i,
          (x + 1 + uv.getX(i) * 510) / 2048,
          1 - (y + 1 + (1 - uv.getY(i)) * 126) / 2048,
        );
      geometries.set(key, geometry);
      signSlots.set(key, slot);
    }
    const mesh = new THREE.Mesh(
      geometries.get(key),
      materials.get("sign-atlas"),
    );
    mesh.position.set(...position);
    mesh.scale.set(width, width / 4, 1);
    mesh.userData.worldBatch = mesh.userData.worldSign = true;
    parent.add(mesh);
    return mesh;
  };
  const contact = (parent, x, z, width = 1, depth = 1, opacity = 0.3) => {
    if (!materials.has("contact")) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 128;
      const c = canvas.getContext("2d");
      const g = c.createRadialGradient(64, 64, 5, 64, 64, 64);
      g.addColorStop(0, "rgba(9,16,20,.6)");
      g.addColorStop(0.45, "rgba(9,16,20,.28)");
      g.addColorStop(1, "rgba(9,16,20,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, 128, 128);
      const t = new THREE.CanvasTexture(canvas);
      textures.add(t);
      materials.set(
        "contact",
        new THREE.MeshBasicMaterial({
          map: t,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -2,
        }),
      );
    }
    const m = shape(
      parent,
      "plane",
      materials.get("contact"),
      [x, 0.08, z],
      [width, depth, 1],
    );
    m.rotation.x = -Math.PI / 2;
    m.castShadow = false;
    m.receiveShadow = false;
    m.userData.worldBatch = false;
    return m;
  };
  const batch = (root, recursive = true) => {
    root.updateMatrixWorld(true);
    const inverse = root.matrixWorld.clone().invert(),
      groups = new Map();
    const collect = (mesh) => {
      if (!mesh.isMesh || !mesh.userData.worldBatch) return;
      const key =
        // Joint-local actor batches retain their original geometry grouping.
        (recursive ? "" : mesh.geometry.uuid) +
        mesh.material.uuid +
        mesh.castShadow +
        mesh.receiveShadow +
        !!mesh.userData.worldDayShade;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(mesh);
    };
    if (recursive) root.traverse(collect);
    else root.children.forEach(collect);
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      if (group[0].userData.worldSign || new Set(group.map(mesh => mesh.geometry)).size > 1) {
        const pieces = group.map((mesh) =>
            mesh.geometry
              .clone()
              .applyMatrix4(
                new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld),
              ),
          ),
          geometry = mergeGeometries(pieces),
          merged = new THREE.Mesh(geometry, group[0].material);
        pieces.forEach((g) => g.dispose());
        geometries.set(geometry.uuid, geometry);
        group.forEach((mesh) => mesh.removeFromParent());
        merged.name = "Merged static Tokyo surfaces";
        merged.castShadow = group[0].castShadow;
        merged.receiveShadow = group[0].receiveShadow;
        if (group[0].userData.worldDayShade) merged.userData.worldDayShade = true;
        root.add(merged);
        continue;
      }
      const first = group[0],
        instances = new THREE.InstancedMesh(
          first.geometry,
          first.material,
          group.length,
        );
      instances.castShadow = first.castShadow;
      instances.receiveShadow = first.receiveShadow;
      if (first.userData.worldDayShade) instances.userData.worldDayShade = true;
      group.forEach((mesh, i) => {
        instances.setMatrixAt(
          i,
          new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld),
        );
        mesh.removeFromParent();
      });
      instances.computeBoundingSphere();
      root.add(instances);
      batches.add(instances);
    }
    return root;
  };
  const foliage = () => {
    if (!materials.has("foliage"))
      materials.set(
        "foliage",
        new THREE.MeshLambertMaterial({
          map: surfaces.texture("leaves"),
          alphaTest: 0.4,
          side: THREE.DoubleSide,
        }),
      );
    return materials.get("foliage");
  };
  const buildingShade = (parent, x, z, width, depth, height) => {
    if (quality === "high" || quality === "medium") return;
    const points = [];
    for (const dx of [-width / 2, width / 2])
      for (const dz of [-depth / 2, depth / 2])
        for (const top of [0, 1])
          points.push({
            x: x + dx + (top * height * 25) / 36,
            z: z + dz - (top * height * 18) / 36,
          });
    points.sort((a, b) => a.x - b.x || a.z - b.z);
    const cross = (a, b, c) =>
      (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
    const half = (items) => {
      const result = [];
      for (const p of items) {
        while (result.length > 1 && cross(result.at(-2), result.at(-1), p) <= 0)
          result.pop();
        result.push(p);
      }
      return result;
    };
    const hull = [
        ...half(points).slice(0, -1),
        ...half([...points].reverse()).slice(0, -1),
      ],
      outline = new THREE.Shape(hull.map((p) => new THREE.Vector2(p.x, -p.z))),
      geometry = new THREE.ShapeGeometry(outline);
    geometries.set(geometry, geometry);
    if (!materials.has("building-shade"))
      materials.set(
        "building-shade",
        new THREE.MeshBasicMaterial({
          color: 0x182a38,
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1,
        }),
      );
    const shadow = new THREE.Mesh(geometry, materials.get("building-shade"));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.058;
    shadow.userData.worldDayShade = true;
    parent.add(shadow);
  };
  return {
    get pendingTextures() {
      return surfaces.pending;
    },
    get photoSurfaces() {
      return surfaces.loaded;
    },
    physical,
    bakedShadows: !fullPbr,
    canvasMaterial(name, paint, parameters = {}) {
      if (!materials.has(name)) {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1024;
        paint(canvas.getContext("2d"), canvas.width);
        const map = new THREE.CanvasTexture(canvas);
        map.colorSpace = THREE.SRGBColorSpace;
        map.anisotropy = 4;
        textures.add(map);
        special(name, {map, roughness: .6, ...parameters});
      }
      materials.get(name).name=name;
      return materials.get(name);
    },
    custom(parent, geometry, color) {
      geometries.set(geometry.uuid, geometry);
      const mesh = new THREE.Mesh(geometry, material(color));
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.userData.worldBatch = true;
      parent.add(mesh);
      return mesh;
    },
    shape,
    sign,
    material,
    surface,
    special,
    contact,
    batch,
    foliage,
    buildingShade,
    dispose() {
      if (disposed) return;
      disposed = true;
      surfaces.dispose();
      batches.forEach((b) => b.dispose());
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => {
        const image = t.image;
        if (image && typeof image.getContext === "function") {
          image.width = image.height = 1;
        }
        t.dispose();
        t.image = null;
      });
      batches.clear();
      geometries.clear();
      materials.clear();
      textures.clear();
    },
  };
}

function shopBuilding(
  meshes,
  parent,
  { x, z, width, depth, height, sign: text, id, color, rotation = 0 },
) {
  const { shape, sign, surface, special, contact } = meshes,
    group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotation;
  parent.add(group);
  const detailed = id === "tokyo_cafe" || id === "tokyo_konbini";
  const face = depth / 2,
    skin = surface("concrete", [width / 1.5, (height - 3.6) / 1.5], color || 0xc6c5be),
    frame = surface("metal", 1, 0x536068);
  // Real recesses, columns, glazing and floor slabs replace a single solid block.
  shape(
    group,
    "box",
    skin,
    [0, (height + 3.6) / 2, 0],
    [width, height - 3.6, depth],
  );
  shape(group, "box", skin, [0, 1.8, -depth / 2 + 0.3], [width, 3.6, 0.6]);
  for (const dx of [-width / 2 + 0.2, width / 2 - 0.2])
    shape(group, "box", skin, [dx, 1.8, 0], [0.4, 3.6, depth]);
  shape(group, "box", surface("tile", 4), [0, 0.025, 0], [width, 0.08, depth]);
  shape(group, "box", 0xbbb9af, [0, 3.55, 0], [width, 0.16, depth]);
  const glass = special("glass", {
    color: 0x6f929f,
    metalness: 0.32,
    roughness: 0.12,
    transparent: true,
    opacity: 0.34,
    envMapIntensity: 1.1,
    depthWrite: false,
  });
  for (const side of [-1, 1])
    for (let edge = 1.12; edge < width / 2 - 0.3; edge += 2.4) {
      const bay = Math.min(2.4, width / 2 - 0.25 - edge),
        center = side * (edge + bay / 2);
      shape(group, "box", frame, [side * edge, 1.8, face], [0.055, 3.4, 0.12]);
      shape(
        group,
        "box",
        glass,
        [center, 1.8, face - 0.03],
        [bay - 0.06, 2.9, 0.035],
      );
      if (!detailed) {
      shape(
        group,
        "box",
        0x2e3535,
        [center, 0.55, face - 1.2],
        [bay - 0.15, 0.65, 0.5],
      );
      shape(
        group,
        "box",
        id === "tokyo_cafe" ? 0x947455 : 0x869c89,
        [center, 1.05, face - 1.1],
        [bay - 0.12, 0.06, 0.6],
      );
      if (text.includes("書店")) {
        for (let j = 0; j < 9; j++)
          shape(
            group,
            "box",
            [0xb8a67e, 0x759088, 0xa87c66, 0x9b9d8d][j % 4],
            [center - bay / 2 + 0.13 + (j * (bay - 0.2)) / 9, 1.27, face - 1.1],
            [0.11, 0.35 + (j % 3) * 0.035, 0.22],
          );
      } else
        for (let j = 0; j < 4; j++)
          shape(
            group,
            "cylinder",
            [0xaab5a8, 0xd8c89c, 0x765749, 0xe1dad0][j],
            [center - 0.4 + j * 0.25, 1.22, face - 1.1],
            [0.07, 0.27, 0.07],
          );
    }
    }
  for (const dx of [-1, 1])
    shape(group, "box", frame, [dx, 1.6, face + 0.02], [0.07, 3.15, 0.1]);
  shape(group, "box", frame, [0, 3.14, face], [2.1, 0.07, 0.12]);
  shape(group, "box", glass, [0, 1.6, face], [1.94, 3.05, 0.035]);
  shape(group, "box", 0xd7d5bc, [0.7, 1.5, face + 0.1], [0.035, 0.42, 0.08]);
  shape(group, "box", 0x252c2c, [0, 0.11, face + 0.02], [2, 0.12, 0.55]);
  const fascia =
    id === "tokyo_konbini"
      ? "#19574f"
      : id === "tokyo_station"
        ? "#293b4b"
        : "#353d37";
  shape(
    group,
    "box",
    0x242d2c,
    [0, 3.86, face + 0.12],
    [width + 0.1, 0.65, 0.28],
  );
  if (!detailed) sign(group, text, [0, 3.86, face + 0.275], Math.min(width - 1, 7), fascia);
  for (let y = 5.6; y < height - 1; y += 3) {
    shape(group, "box", frame, [0, y - 1.05, face + 0.1], [width, 0.12, 0.2]);
    if (!detailed) for (let dx = -width / 2 + 1.3; dx < width / 2 - 0.5; dx += 2.4) {
      shape(group, "box", 0x26343e, [dx, y, face + 0.025], [1.85, 1.8, 0.08]);
      shape(group, "box", glass, [dx, y, face + 0.08], [1.8, 1.73, 0.05]);
      shape(group, "box", frame, [dx, y, face + 0.12], [0.045, 1.8, 0.05]);
      shape(group, "box", 0xc9c8ba, [dx, y - 1, face + 0.18], [2, 0.12, 0.4]);
    }
  }
  shape(
    group,
    "box",
    0x6e7778,
    [0, height + 0.12, 0],
    [width + 0.2, 0.24, depth + 0.2],
  );
  for (const dx of [-width / 2 + 0.3, width / 2 - 0.3])
    shape(group, "box", 0xa3aaa8, [dx, height + 0.55, 0], [0.12, 0.8, depth]);
  for (const dx of [-width * 0.25, width * 0.25]) {
    shape(group, "box", 0xa2aaa8, [dx, height + 0.7, -1], [1.3, 1, 1.3]);
    for (let i = 0; i < 5; i++)
      shape(
        group,
        "box",
        0x5a6569,
        [dx, height + 0.43 + i * 0.11, -0.33],
        [1.05, 0.035, 0.04],
      );
  }
  // Detailed shopfronts provide their own correctly spaced upright lettering.
  if (!detailed) {
  const board = sign(
    group,
    id === "tokyo_station"
      ? "駅案内 / TICKETS"
      : id === "tokyo_konbini"
        ? "食品 / DAILY GOODS"
        : text.includes("書店")
          ? "本 / STATIONERY"
          : id === "tokyo_cafe"
            ? "珈琲 / COFFEE"
            : "店舗案内 / SHOPS",
    [width / 2 - 0.25, Math.min(height - 1, 6.5), face + 0.4],
    3.6,
    "#eff0df",
    "#344647",
  );
  board.rotation.z = Math.PI / 2;
  for (let i = 0; i < 2; i++) {
    const a = sign(
      group,
      (id === "tokyo_station"
        ? ["乗換案内", "きっぷ"]
        : id === "tokyo_konbini"
          ? ["日用品", "お弁当"]
          : text.includes("書店")
            ? ["新刊・文具", "文庫"]
            : ["喫茶・軽食", "自家焙煎"])[i],
      [-width / 2 + 0.8 + i * 2.1, Math.min(height - 1, 6.5), face + 0.18],
      1.8,
      i ? "#374e67" : "#a1473a",
    );
    a.scale.y = 1.8;
  }
  }
  if (id === "tokyo_konbini") dressHoshiExterior(meshes,group,{width,depth});
  else if(id === "tokyo_cafe") dressCafeExterior(meshes,group,{width,depth});
  else dressShopfront(meshes, group, { width, depth, id, sign: text });
  if (detailed) dressTokyoBlock(meshes, group, {width, depth, height, id});
  contact(group, 0, face + 0.2, width, 3, 0.3);
}

export function makeOutdoorWorld(meshes) {
  const root = new THREE.Group(),
    { shape, sign, surface, contact } = meshes;
  root.name = "Tokyo authored streetscape";
  shape(root, "box", surface("paving", [45, 50]), [0, -0.18, -3], [90, 0.3, 100]);
  shape(root, "box", surface("asphalt", [8 / 3, 86 / 3]), [0, -0.005, -3], [8, 0.06, 86]);
  shape(root, "box", surface("asphalt", [86 / 3, 8 / 3]), [0, 0.002, 0], [86, 0.06, 8]);
  for (const side of [-1, 1]) {
    for (const x of [side * 4.12, side * 4.35])
      shape(root, "box", 0xbdbbb1, [x, 0.045, 11.5], [0.12, 0.1, 49]);
    for (const z of [side * 4.12, side * 4.35])
      shape(root, "box", 0xbdbbb1, [0, 0.045, z], [78, 0.1, 0.12]);
    // Tactile strips and small kerb drain slots.
    shape(
      root,
      "box",
      surface("tile", 18, 0xd2ba65),
      [side * 5.3, 0.055, 11.5],
      [0.4, 0.035, 49],
    );
    for (let z = -10; z < 34; z += 5) {
      shape(root, "box", 0xe8e4d6, [side * 3.7, 0.045, z], [0.08, 0.015, 2.6]);
      shape(root, "box", 0x2d383b, [side * 4.2, 0.12, z], [0.25, 0.02, 0.6]);
      for (let i = 0; i < 5; i++)
        shape(
          root,
          "box",
          0x818b8a,
          [side * 4.2, 0.135, z - 0.23 + i * 0.11],
          [0.21, 0.015, 0.025],
        );
    }
    for (let i = 0; i < 7; i++) {
      shape(
        root,
        "box",
        0xe1dfd2,
        [-3 + i, 0.043, side * 6.6],
        [0.5, 0.015, 3],
      );
    }
  }
  for (const location of worldLocations.filter((l) => l.id !== "tokyo_park" && l.id !== "tokyo_station"))
    shopBuilding(meshes, root, location);
  shopBuilding(meshes, root, {
    x: -24,
    z: 15,
    width: 18,
    depth: 22,
    height: 18,
    sign: "青葉書店",
    color: 0xb4b7b4,
    rotation: Math.PI / 2,
  });
  shopBuilding(meshes, root, {
    x: -30,
    z: -31,
    width: 8,
    depth: 12,
    height: 25,
    sign: "路地の音楽室",
    color: 0xc5c0b7,
  });
  shopBuilding(meshes, root, {
    x: 29,
    z: -31,
    width: 10,
    depth: 12,
    height: 22,
    sign: "朝日ビル",
    color: 0x929c9f,
  });
  for (const location of worldLocations.filter((l) => l.id !== "tokyo_park"))
    meshes.buildingShade(
      root,
      location.x,
      location.z,
      location.width,
      location.depth,
      location.height,
    );
  meshes.buildingShade(root, -24, 15, 22, 18, 18);
  // Non-walkable distant city sits beyond the movement boundary, with real skyline parallax.
  const random = worldRandom(712);
  for (let i = 0; i < 23; i++) {
    const side = i % 2 ? -1 : 1,
      x = side * (42 + random() * 20),
      z = -62 + random() * 116,
      w = 7 + random() * 8,
      h = 17 + random() * 34;
    shape(
      root,
      "box",
      surface("concrete", 3, [0xa6b0b3, 0xb7b8b4, 0x8e9a9f][i % 3]),
      [x, h / 2, z],
      [w, h, 8],
    );
    for (let y = 3; y < h - 1; y += 3.2)
      shape(root, "box", 0x526b7a, [x, y, z + 4.025], [w - 0.7, 1.5, 0.04]);
  }
  for (let i = 0; i < 9; i++) {
    const x = -36 + i * 9,
      h = 18 + random() * 37;
    shape(
      root,
      "box",
      surface("concrete", 3, 0xa7b0b5),
      [x, h / 2, -53],
      [7, h, 9],
    );
    for (let y = 3; y < h - 1; y += 3.2)
      for (let dx = -2; dx <= 2; dx += 2)
        shape(root, "box", 0x647d8b, [x + dx, y, -48.45], [1.3, 1.7, 0.08]);
  }
  shape(root, "box", surface("grass", 10), [19, 0.005, 16], [19, 0.05, 17]);
  shape(
    root,
    "box",
    surface("paving", 8, 0xd1c6b4),
    [17, 0.04, 16],
    [3, 0.06, 17],
  );
  sign(root, "さくら公園", [23, 1.55, 8], 2.6, "#374840");
  for (const [i, [x, z]] of [
    [12, 21],
    [25, 20],
    [25, 11],
    [-7, -19],
    [-9, 10],
    [-9, 25],
    [8, 27],
    [-16, 28],
    [8, 7],
  ].entries())
    makeStreetTree(meshes, root, x, z, i);
  for (const z of [13, 22]) {
    for (let i = 0; i < 5; i++)
      shape(
        root,
        "box",
        "wood",
        [24, 0.48, z - 0.3 + i * 0.14],
        [2, 0.055, 0.1],
      );
    for (let i = 0; i < 3; i++)
      shape(
        root,
        "box",
        "wood",
        [24, 0.85 + i * 0.12, z + 0.36],
        [2, 0.08, 0.055],
      );
    for (const x of [23.25, 24.75]) {
      shape(root, "box", 0x374044, [x, 0.23, z], [0.055, 0.46, 0.6]);
      shape(root, "box", 0x374044, [x, 0.7, z + 0.4], [0.055, 0.9, 0.055]);
    }
  }
  for (const x of [-6.4, 6.4])
    for (const z of [-22, 9, 27]) {
      shape(root, "cylinder", "metal", [x, 2.9, z], [0.045, 5.8, 0.045]);
      shape(root, "box", 0x3c494f, [x + 0.35, 5.8, z], [0.8, 0.1, 0.19]);
      shape(
        root,
        "box",
        0xffedc2,
        [x + 0.35, 5.74, z],
        [0.55, 0.015, 0.14],
        true,
      );
      const lamp = new THREE.PointLight(0xffd19c, 0, 9, 2);
      lamp.position.set(x + 0.35, 5.6, z);
      lamp.userData.worldLamp = true;
      root.add(lamp);
    }
  for (const x of [-8, 8]) {
    shape(root, "cylinder", 0x414f53, [x, 3.1, 4.3], [0.06, 6.2, 0.06]);
    shape(root, "box", 0x263538, [x, 3.7, 4.3], [0.48, 0.25, 0.22]);
    for (let i = 0; i < 3; i++)
      shape(
        root,
        "sphere",
        [0x5f7163, 0x6d7468, 0xbf473b][i],
        [x - 0.15 + i * 0.15, 3.7, 4.44],
        [0.05, 0.05, 0.03],
        i === 2,
      );
  }
  for (const x of [-27, 27]) {
    shape(root, "box", 0x9e3f35, [x, 1.04, 3.6], [0.9, 2.05, 0.65]);
    shape(root, "box", 0x7f9aa6, [x, 1.3, 3.94], [0.69, 1.13, 0.025]);
    sign(root, "DRINKS", [x, 1.9, 3.96], 0.7, "#cddad8", "#2b4655");
    for (let y = 0.95; y < 1.8; y += 0.25)
      for (let dx = -0.24; dx < 0.3; dx += 0.16)
        shape(
          root,
          "cylinder",
          [0xd9d4bd, 0x8bbaae, 0xd2a370][Math.round(y * 10) % 3],
          [x + dx, y, 3.98],
          [0.04, 0.15, 0.04],
        );
    shape(root, "box", 0x232e33, [x, 0.36, 3.96], [0.5, 0.12, 0.025]);
  }
  // Low street clutter belongs beside the facades, away from the movement corridor.
  for (const x of [-22, -12, 12, 22]) {
    const board = sign(root, "本日のおすすめ", [x, 1, -5.7], 0.72, "#253d38");
    board.rotation.x = -0.12;
    for (const dx of [-0.38, 0.38]) {
      const leg = shape(
        root,
        "box",
        0x816b50,
        [x + dx, 0.57, -5.8],
        [0.035, 1.14, 0.06],
      );
      leg.rotation.x = -0.12;
    }
  }
  makeStationDistrict(meshes, root);
  stationLayout.streetTrees.forEach((point, index) => makeStreetTree(meshes, root, point.x, point.z, index + 44));
  makeTokyoRoadMarkings(meshes, root);
  return meshes.batch(root);
}
