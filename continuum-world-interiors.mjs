import * as THREE from "three";
import { worldLocations } from "./continuum-world-model.mjs";

// Loaded only when an interior is entered.
export function makeWorldInterior(id, meshes) {
  const root = new THREE.Group(),
    { shape, sign } = meshes,
    location = worldLocations.find((l) => l.id === id),
    cafe = id === "tokyo_cafe";
  shape(root, "box", cafe ? 0xccb294 : 0xd3d4bf, [0, -0.15, 0], [14, 0.25, 12]);
  for (const x of [-7, 7])
    shape(root, "box", 0xdccdb3, [x, 2.5, 0], [0.22, 5, 12]);
  shape(root, "box", 0xdccdb3, [0, 2.5, -6], [14, 5, 0.2]);
  for (const x of [-4, 4])
    shape(root, "box", 0xdccdb3, [x, 2.5, 6], [6, 5, 0.2]);
  shape(root, "box", 0x805f49, [0, 0.55, -3.6], [8, 1.1, 1.4]);
  shape(root, "box", 0xefe1bf, [0, 1.16, -3.6], [8.2, 0.15, 1.6]);
  sign(root, location.sign, [0, 3.5, -5.8], 7, cafe ? "#675541" : "#316b63");
  sign(root, "出口", [0, 3.3, 5.85], 1.6, "#276d55");
  root.children.at(-1).rotation.y = Math.PI;
  for (const side of [-1, 1]) {
    if (cafe) {
      shape(root, "cylinder", 0xb58a62, [side * 4.7, 0.9, 0], [1, 0.15, 1]);
      shape(
        root,
        "cylinder",
        0x4e5552,
        [side * 4.7, 0.45, 0],
        [0.08, 0.9, 0.08],
      );
      for (const z of [-1.8, 1.8]) {
        shape(root, "box", 0x738f7c, [side * 4.7, 0.6, z], [0.9, 0.16, 0.85]);
        shape(
          root,
          "box",
          0x738f7c,
          [side * 4.7, 1, z + Math.sign(z) * 0.35],
          [0.9, 0.8, 0.15],
        );
      }
      shape(root, "box", 0x75a3a3, [side * 6.85, 2.8, 0], [0.08, 2.8, 6], true);
      shape(
        root,
        "cylinder",
        0xf1e6ce,
        [side * 4.7, 1.07, 0.2],
        [0.12, 0.2, 0.12],
      );
    } else {
      for (const y of [0.3, 1, 1.7, 2.4]) {
        shape(root, "box", 0xe6eadc, [side * 4.4, y, -0.2], [1.5, 0.12, 5]);
        for (let z = -2; z <= 2; z += 0.7)
          shape(
            root,
            "box",
            [0xc9b166, 0x8faca2, 0xc58068][Math.abs(Math.round(z * 10)) % 3],
            [side * 4.4, y + 0.25, z],
            [0.8, 0.4, 0.4],
          );
      }
      shape(root, "box", 0xa3bcbc, [side * 6.8, 1.5, -4.5], [0.15, 3, 2], true);
    }
  }
  for (const x of [-3, 3])
    shape(root, "sphere", 0xffe1ad, [x, 4.5, -1], [0.45, 0.15, 0.45], true);
  shape(root, "box", 0x394c4a, [1.9, 1.45, -3.65], [0.7, 0.45, 0.3]);
  return root;
}
