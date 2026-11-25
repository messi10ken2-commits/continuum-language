import * as THREE from "three";
import { worldLocations } from "./continuum-world-model.mjs";

// Metre-scale furniture, actual window recesses and original shop dressing.
export function makeWorldInterior(id, meshes) {
  const root = new THREE.Group(),
    { shape, sign, surface, special } = meshes,
    location = worldLocations.find((l) => l.id === id),
    cafe = id === "tokyo_cafe";
  root.name = cafe ? "Komorebi detailed interior" : "Hoshi detailed interior";
  const wood = surface("wood", 3, 0xc0a184),
    plaster = surface("concrete", 2, 0xe7e1d3),
    steel = surface("metal", 2, 0x979e9c),
    dark = meshes.material(0x293333);
  shape(
    root,
    "box",
    surface(cafe ? "wood" : "tile", cafe ? 5 : 7, cafe ? 0xd5c3ac : 0xffffff),
    [0, -0.1, 0],
    [14, 0.2, 12],
  );
  shape(root, "box", plaster, [0, 1.9, -6], [14, 3.8, 0.18]);
  shape(root, "box", cafe ? 0xd4c6af : 0xd1d9d5, [0, 3.78, 0], [14, 0.15, 12]);
  const glass = special("interior-glass", {
    color: 0x9ebec9,
    roughness: 0.12,
    metalness: 0.25,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  for (const side of [-1, 1]) {
    // Window bays have views and mullions instead of painted blue wall panels.
    shape(root, "box", plaster, [side * 7, 0.44, 0], [0.2, 0.88, 12]);
    shape(root, "box", plaster, [side * 7, 3.4, 0], [0.2, 0.75, 12]);
    for (const z of [-5.8, -2, 2, 5.8])
      shape(root, "box", dark, [side * 6.95, 1.97, z], [0.14, 2.2, 0.08]);
    shape(root, "box", glass, [side * 6.98, 1.98, 0], [0.03, 2.1, 11.6]);
    // The city beyond the glazing is geometric, with depth, not a static photo.
    shape(root, "box", 0x93a6ac, [side * 10, 2.3, -1], [2, 6, 14]);
    for (const z of [-5, -2, 1, 4])
      shape(root, "box", 0x526c77, [side * 8.97, 2.1, z], [0.035, 1.9, 1.5]);
    for (const x of [side * 4])
      shape(root, "box", 0xa39783, [x, 3.6, 0], [0.12, 0.2, 12]);
  }
  for (const x of [-4, 4])
    shape(root, "box", plaster, [x, 1.9, 6], [6, 3.8, 0.18]);
  for (const x of [-1.05, 1.05])
    shape(root, "box", dark, [x, 1.55, 5.96], [0.06, 3.1, 0.08]);
  shape(root, "box", glass, [0, 1.55, 6], [2.02, 3, 0.035]);
  shape(root, "box", dark, [0, 3.1, 6], [2.15, 0.07, 0.1]);
  const exit = sign(root, "出口 EXIT", [0, 3.33, 5.84], 1.1, "#27604f");
  exit.rotation.y = Math.PI;
  // Shared counter keeps the established interaction and collision coordinates.
  shape(root, "box", wood, [0, 0.5, -3.6], [8, 1, 1.4]);
  shape(
    root,
    "box",
    surface("concrete", 2, 0x545a57),
    [0, 1.06, -3.6],
    [8.12, 0.09, 1.5],
  );
  for (let x = -3.8; x < 4; x += 0.18)
    shape(root, "box", 0x604b38, [x, 0.52, -2.885], [0.035, 0.85, 0.015]);
  sign(root, location.sign, [0, 2.93, -5.86], 4, cafe ? "#34463e" : "#2d695d");
  for (const x of [-3.2, 0, 3.2]) {
    const pendant = new THREE.Group();
    pendant.position.set(x, 0, -2.1);
    root.add(pendant);
    shape(pendant, "cylinder", 0x283331, [0, 3.25, 0], [0.009, 1, 0.009]);
    shape(
      pendant,
      "cone",
      cafe ? 0x687368 : 0xe1e5dc,
      [0, 2.8, 0],
      [0.23, 0.28, 0.23],
    );
    shape(pendant, "cylinder", 0xffe5b7, [0, 2.65, 0], [0.2, 0.015, 0.2], true);
    if (meshes.physical) {
      const lamp = new THREE.PointLight(
        cafe ? 0xffd5a2 : 0xe9f4ed,
        cafe ? 8 : 11,
        6,
        2,
      );
      lamp.position.set(x, 2.5, -2.1);
      root.add(lamp);
    }
  }
  shape(root, "box", steel, [2.7, 1.28, -3.5], [0.42, 0.36, 0.24]);
  shape(root, "box", 0x1e3038, [2.7, 1.35, -3.35], [0.35, 0.21, 0.03]);
  if (cafe) {
    // Espresso machine, portafilter, grinder and stacked ceramics.
    shape(root, "box", steel, [-2.3, 1.35, -3.7], [1.1, 0.55, 0.55]);
    shape(root, "box", 0x293634, [-2.3, 1.18, -3.37], [0.9, 0.08, 0.2]);
    for (const x of [-2.55, -2.1]) {
      shape(root, "cylinder", steel, [x, 1.41, -3.39], [0.045, 0.12, 0.045]);
      shape(root, "cylinder", 0xe5dfcc, [x, 1.24, -3.29], [0.065, 0.1, 0.065]);
    }
    shape(root, "cylinder", 0x323b36, [-3.3, 1.29, -3.65], [0.13, 0.36, 0.13]);
    shape(root, "cylinder", glass, [-3.3, 1.6, -3.65], [0.13, 0.28, 0.13]);
    for (let i = 0; i < 6; i++)
      shape(
        root,
        "cylinder",
        0xe2d9c5,
        [-1.5 + i * 0.18, 1.15, -3.62],
        [0.064, 0.12, 0.064],
      );
    sign(
      root,
      "COFFEE   450   /   TEA   400",
      [-2.9, 2.1, -5.84],
      3.2,
      "#223c34",
    );
    sign(
      root,
      "ケーキ   500   /   季節のおすすめ",
      [2.9, 2.1, -5.84],
      3.2,
      "#223c34",
    );
    for (const side of [-1, 1]) {
      const x = side * 4.7;
      shape(root, "cylinder", wood, [x, 0.76, 0], [0.86, 0.065, 0.86]);
      shape(root, "cylinder", dark, [x, 0.38, 0], [0.045, 0.74, 0.045]);
      shape(root, "cylinder", dark, [x, 0.035, 0], [0.35, 0.04, 0.35]);
      for (const z of [-1.7, 1.7]) {
        shape(
          root,
          "sphere",
          surface("fabric", 2, 0x6b7f6a),
          [x, 0.47, z],
          [0.36, 0.065, 0.33],
        );
        shape(
          root,
          "box",
          wood,
          [x, 0.77, z + Math.sign(z) * 0.29],
          [0.65, 0.48, 0.055],
        );
        for (const dx of [-0.25, 0.25])
          for (const dz of [-0.23, 0.23])
            shape(
              root,
              "cylinder",
              wood,
              [x + dx, 0.23, z + dz],
              [0.018, 0.45, 0.018],
            );
      }
      shape(root, "cylinder", 0xe3decf, [x, 0.86, 0.05], [0.08, 0.13, 0.08]);
      shape(
        root,
        "cylinder",
        0x5f3e2a,
        [x, 0.928, 0.05],
        [0.067, 0.006, 0.067],
      );
      shape(root, "cylinder", 0xe3decf, [x, 0.8, 0.05], [0.13, 0.015, 0.13]);
      shape(root, "box", 0xd5c9ad, [x + 0.3, 0.8, -0.1], [0.24, 0.008, 0.32]);
      shape(root, "box", 0x394b43, [side * 6.4, 0.35, 3], [0.55, 0.7, 0.55]);
      for (let i = 0; i < 9; i++) {
        const leaf = shape(
          root,
          "plane",
          meshes.foliage(),
          [
            side * 6.4 + Math.sin(i) * 0.16,
            1 + i * 0.035,
            3 + Math.cos(i) * 0.16,
          ],
          [0.6, 0.6, 1],
        );
        leaf.rotation.y = i;
        leaf.rotation.x = -0.4;
      }
    }
    // Glass pastry case with individual baked goods, rather than anonymous blocks.
    shape(root, "box", glass, [0.8, 1.32, -3.6], [1.15, 0.48, 0.55]);
    for (let i = 0; i < 4; i++)
      shape(
        root,
        "sphere",
        0xbf9561,
        [0.4 + i * 0.25, 1.18, -3.6],
        [0.09, 0.045, 0.065],
      );
  } else {
    for (const side of [-1, 1]) {
      for (const y of [0.28, 0.91, 1.54, 2.17]) {
        shape(root, "box", 0xd1d7d1, [side * 4.4, y, -0.2], [1.5, 0.045, 5]);
        for (let z = -2.2; z <= 2; z += 0.34) {
          const color = [0x80998b, 0xc9b77a, 0xb9795c, 0xd0d0b5][
            Math.abs(Math.round(z * 10)) % 4
          ];
          shape(
            root,
            "box",
            color,
            [side * 4.4, y + 0.21, z],
            [0.65, 0.37, 0.26],
          );
          shape(
            root,
            "box",
            0xf0e9d6,
            [side * 4.4, y + 0.24, z + 0.135],
            [0.4, 0.1, 0.008],
          );
          shape(
            root,
            "box",
            0x333c3c,
            [side * 4.4, y + 0.245, z + 0.141],
            [0.2, 0.02, 0.008],
          );
        }
        // Shelf-edge labels face the centre aisle on either side.
        const label = sign(
          root,
          "おすすめ  ¥180",
          [side * 3.63, y + 0.01, 0],
          0.8,
          "#f5eedc",
          "#48544d",
        );
        label.rotation.y = (-side * Math.PI) / 2;
      }
      shape(root, "box", steel, [side * 6.4, 1.4, -4.7], [0.7, 2.8, 1.8]);
      shape(root, "box", glass, [side * 6, 1.5, -4.7], [0.03, 2.3, 1.5]);
      for (let y = 0.6; y < 2.7; y += 0.48)
        for (let z = -5.2; z < -4; z += 0.23)
          shape(
            root,
            "cylinder",
            0xb2c7b1,
            [side * 6.1, y, z],
            [0.06, 0.27, 0.06],
          );
    }
    for (const x of [-4, 4])
      sign(
        root,
        "お弁当 ・ おにぎり ・ 飲み物",
        [x, 3.15, -5.83],
        3.2,
        "#e4ebdf",
        "#2e6050",
      );
  }
  return meshes.batch(root);
}
