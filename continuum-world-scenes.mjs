import * as THREE from "three";
import { worldLocations } from "./continuum-world-model.mjs";

// Original procedural architecture and signs, using shared geometry/materials.
export function worldMeshes() {
  const geometries = new Map(),
    materials = new Map(),
    textures = new Set();
  const material = (color, glow = false) => {
    const key = color + ":" + glow;
    if (!materials.has(key))
      materials.set(
        key,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.88,
          ...(glow ? { emissive: color, emissiveIntensity: 0.32 } : {}),
        }),
      );
    return materials.get(key);
  };
  const shape = (parent, type, color, position, size, glow = false) => {
    if (!geometries.has(type))
      geometries.set(
        type,
        type === "box"
          ? new THREE.BoxGeometry(1, 1, 1)
          : type === "sphere"
            ? new THREE.SphereGeometry(1, 12, 8)
            : new THREE.CylinderGeometry(1, 1, 1, 12),
      );
    const mesh = new THREE.Mesh(geometries.get(type), material(color, glow));
    mesh.position.set(...position);
    mesh.scale.set(...size);
    parent.add(mesh);
    return mesh;
  };
  const sign = (
    parent,
    text,
    position,
    width = 5,
    background = "#233d3b",
    foreground = "#fff3d3",
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    context.fillStyle = background;
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = foreground;
    context.font = "bold 62px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 67, 485);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture);
    const geometry = new THREE.PlaneGeometry(width, width / 4),
      mat = new THREE.MeshBasicMaterial({ map: texture });
    geometries.set(canvas, geometry);
    materials.set(canvas, mat);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  };
  return {
    shape,
    sign,
    material,
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
export function makeWorldPerson(
  meshes,
  { color = 0xd8ad73, npc = false } = {},
) {
  const root = new THREE.Group(),
    body = new THREE.Group();
  root.add(body);
  meshes.shape(body, "cylinder", color, [0, 1.03, 0], [0.29, 0.68, 0.23]);
  meshes.shape(body, "sphere", 0xe8bd99, [0, 1.62, 0], [0.25, 0.29, 0.24]);
  meshes.shape(body, "sphere", 0x383736, [0, 1.79, -0.035], [0.26, 0.17, 0.25]);
  meshes.shape(body, "box", 0x333c46, [0, 1.69, 0.21], [0.27, 0.035, 0.025]);
  const legs = [-1, 1].map((side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.14, 0.77, 0);
    body.add(pivot);
    meshes.shape(pivot, "box", 0x354457, [0, -0.32, 0], [0.19, 0.64, 0.2]);
    meshes.shape(pivot, "box", 0xe6dfd0, [0, -0.67, 0.055], [0.22, 0.13, 0.32]);
    return pivot;
  });
  const arms = [-1, 1].map((side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.35, 1.3, 0);
    body.add(pivot);
    meshes.shape(pivot, "cylinder", color, [0, -0.24, 0], [0.1, 0.5, 0.1]);
    meshes.shape(pivot, "sphere", 0xe8bd99, [0, -0.52, 0], [0.1, 0.12, 0.1]);
    return pivot;
  });
  if (!npc) {
    meshes.shape(body, "box", 0xaf7253, [0, 1.15, -0.27], [0.42, 0.49, 0.18]);
    meshes.shape(body, "sphere", 0xf0ce81, [0, 1.92, 0], [0.34, 0.08, 0.32]);
  }
  let gait = 0,
    previousTime = 0;
  return {
    root,
    animate(time, speed, reduced) {
      const seconds = Math.min(0.1, Math.max(0, time - previousTime));
      previousTime = time;
      gait += (speed - gait) * (1 - Math.exp(-seconds / 0.12));
      legs.forEach(
        (leg, i) =>
          (leg.rotation.x = reduced
            ? 0
            : Math.sin(time * 9 + i * Math.PI) * Math.min(0.6, gait * 0.16)),
      );
      arms.forEach(
        (arm, i) =>
          (arm.rotation.x = reduced
            ? 0
            : Math.sin(time * 9 + i * Math.PI) * Math.min(0.4, gait * 0.12)),
      );
    },
  };
}
export function makeOutdoorWorld(meshes) {
  const root = new THREE.Group(),
    { shape, sign } = meshes;
  shape(root, "box", 0xe2d4bc, [0, -0.23, -3], [75, 0.4, 78]);
  shape(root, "box", 0x657172, [0, 0.005, -3], [8, 0.08, 76]);
  shape(root, "box", 0x657172, [0, 0.015, 0], [72, 0.08, 8]);
  for (const side of [-1, 1]) {
    shape(root, "box", 0xf8ecd5, [side * 4.4, 0.05, -3], [0.35, 0.12, 76]);
    shape(root, "box", 0xf8ecd5, [0, 0.05, side * 4.4], [72, 0.12, 0.35]);
    for (let i = 0; i < 7; i++)
      shape(root, "box", 0xf4efda, [side * 6.4, 0.07, -3 + i], [3, 0.02, 0.5]);
    for (let i = 0; i < 7; i++)
      shape(root, "box", 0xf4efda, [-3 + i, 0.07, side * 6.4], [0.5, 0.02, 3]);
  }
  for (const location of worldLocations.filter((l) => l.id !== "tokyo_park")) {
    const { x, z, width, depth, height, color } = location;
    shape(root, "box", color, [x, height / 2, z], [width, height, depth]);
    shape(
      root,
      "box",
      0xf2ddbb,
      [x, 0.2, z + depth / 2 + 0.2],
      [width + 0.5, 0.3, 0.8],
    );
    shape(
      root,
      "box",
      0x304b50,
      [x, 1.7, z + depth / 2 + 0.025],
      [2.2, 3.2, 0.09],
      true,
    );
    shape(
      root,
      "box",
      0xe9c583,
      [x + 0.72, 1.6, z + depth / 2 + 0.11],
      [0.06, 0.55, 0.07],
      true,
    );
    for (const dx of [-4.7, 4.7]) {
      shape(
        root,
        "box",
        0x385d62,
        [x + dx, 2.3, z + depth / 2 + 0.04],
        [3.5, 2.5, 0.12],
        true,
      );
      shape(
        root,
        "box",
        0xe4bc87,
        [x + dx, 2.3, z + depth / 2 + 0.12],
        [0.08, 2.5, 0.06],
      );
    }
    sign(
      root,
      location.sign,
      [x, 4.7, z + depth / 2 + 0.13],
      width - 1,
      location.id === "tokyo_konbini" ? "#2e6861" : "#614a3f",
    );
    if (height > 8)
      for (const dx of [-4.5, 0, 4.5])
        shape(
          root,
          "box",
          0x658481,
          [x + dx, 7, z + depth / 2 + 0.05],
          [2, 1.7, 0.1],
          true,
        );
    shape(
      root,
      "box",
      0x485255,
      [x, height + 0.2, z],
      [width + 0.7, 0.4, depth + 0.7],
    );
    for (const dx of [-width / 2 + 0.9, width / 2 - 0.9]) {
      shape(
        root,
        "cylinder",
        0xa67d61,
        [x + dx, 0.42, z + depth / 2 + 1],
        [0.45, 0.8, 0.45],
      );
      shape(
        root,
        "sphere",
        0x648866,
        [x + dx, 1.05, z + depth / 2 + 1],
        [0.65, 0.65, 0.65],
      );
    }
  }
  // Familiar Tokyo streetscape details are authored here, without external game assets.
  for (const [x, z, width, depth, height, color] of [
    [-27, 15, 12, 18, 14, 0xa7b2b0],
    [-30, -31, 8, 12, 18, 0xc7b0a0],
    [29, -31, 10, 12, 16, 0x9aa6a9],
  ]) {
    shape(root, "box", color, [x, height / 2, z], [width, height, depth]);
    for (let floor = 3; floor < height; floor += 3)
      for (let dx = -width / 2 + 1.5; dx < width / 2; dx += 2.4)
        shape(
          root,
          "box",
          0x49656b,
          [x + dx, floor, z + depth / 2 + 0.02],
          [1.5, 1.7, 0.06],
          true,
        );
  }
  shape(root, "box", 0x91a380, [19, 0.03, 16], [19, 0.13, 17]);
  shape(root, "box", 0xccbda4, [17, 0.12, 16], [3, 0.06, 17]);
  sign(root, "さくら公園", [23, 2.5, 8], 5, "#46634c");
  for (const [x, z] of [
    [12, 21],
    [25, 20],
    [25, 11],
    [-7, -19],
    [-8, 10],
    [8, 27],
    [-16, 28],
  ]) {
    shape(root, "cylinder", 0x78614e, [x, 1.5, z], [0.22, 3, 0.22]);
    shape(root, "sphere", 0x8bac85, [x, 4, z], [2, 2.4, 1.9]);
    shape(root, "sphere", 0xbac8a2, [x - 0.7, 4.8, z], [1.5, 1.3, 1.5]);
  }
  for (const z of [13, 22]) {
    shape(root, "box", 0x836747, [24, 0.75, z], [3, 0.18, 0.8]);
    shape(root, "box", 0x836747, [24, 1.25, z + 0.35], [3, 0.75, 0.12]);
    for (const x of [23, 25])
      shape(root, "box", 0x394a48, [x, 0.35, z], [0.12, 0.7, 0.65]);
  }
  for (const x of [-7, 7])
    for (const z of [-22, 9, 27]) {
      shape(root, "cylinder", 0x435858, [x, 2.7, z], [0.08, 5.4, 0.08]);
      shape(root, "sphere", 0xffe0a3, [x, 5.45, z], [0.35, 0.45, 0.35], true);
    }
  for (const side of [-1, 1]) {
    shape(root, "box", 0xbf755b, [side * 27, 1.9, 3.9], [1.1, 3.6, 1]);
    sign(root, "飲料", [side * 27, 2.2, 4.45], 0.85, "#b95047");
  }
  return root;
}
