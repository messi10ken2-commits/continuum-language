import * as THREE from "three";
import { worldRandom } from "./continuum-world-materials.mjs";

function limb(meshes, parent, start, end, radius, material) {
  const a = new THREE.Vector3(...start),
    b = new THREE.Vector3(...end),
    direction = b.clone().sub(a),
    middle = a.clone().add(b).multiplyScalar(0.5);
  const part = meshes.shape(parent, "branch", material, middle.toArray(), [
    radius,
    direction.length(),
    radius,
  ]);
  part.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize(),
  );
  return part;
}

export function makeStreetTree(meshes, parent, x, z, seed = 0) {
  const { shape, surface, contact } = meshes,
    random = worldRandom(seed + 91),
    tree = new THREE.Group(),
    bark = surface("bark", 2),
    foliage = meshes.foliage();
  tree.name = "Branched street tree";
  tree.position.set(x, 0, z);
  parent.add(tree);
  const lean = (random() - 0.5) * 0.23;
  const trunk = [
    [0, 0.08, 0],
    [lean, 1.8, -0.04],
    [lean * 0.6, 3.3, 0.07],
    [lean + 0.1, 4.6, 0.03],
  ];
  for (let i = 1; i < trunk.length; i++)
    limb(meshes, tree, trunk[i - 1], trunk[i], 0.21 - i * 0.035, bark);
  for (let i = 0; i < 5; i++) {
    const angle = i * 2.4 + random() * 0.4,
      reach = 1.15 + random() * 0.7,
      start = [lean, 3.2 + i * 0.14, 0.02],
      fork = [
        Math.sin(angle) * reach * 0.65,
        4.4 + random() * 0.5,
        Math.cos(angle) * reach * 0.65,
      ],
      end = [
        Math.sin(angle) * reach,
        4.9 + random() * 1.1,
        Math.cos(angle) * reach,
      ];
    limb(meshes, tree, start, fork, 0.07, bark);
    limb(meshes, tree, fork, end, 0.043, bark);
    for (const side of [-1, 1])
      limb(
        meshes,
        tree,
        fork,
        [
          end[0] + Math.cos(angle) * side * 0.55,
          end[1] - 0.2,
          end[2] - Math.sin(angle) * side * 0.55,
        ],
        0.026,
        bark,
      );
    // Ellipsoidal clusters follow the branch ends; no spherical solid canopy.
    for (let j = 0; j < 25; j++) {
      const a = random() * Math.PI * 2,
        r = Math.sqrt(random()) * 0.95,
        leaf = shape(
          tree,
          "plane",
          foliage,
          [
            end[0] + Math.sin(a) * r,
            end[1] + (random() - 0.5) * 1.3,
            end[2] + Math.cos(a) * r,
          ],
          [0.95 + random() * 0.45, 0.85 + random() * 0.4, 1],
        );
      leaf.rotation.set((random() - 0.5) * 2.4, a, (random() - 0.5) * 0.8);
      leaf.castShadow = true;
    }
  }
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5;
    limb(
      meshes,
      tree,
      [0, 0.26, 0],
      [Math.sin(a) * 0.5, 0.065, Math.cos(a) * 0.5],
      0.065,
      bark,
    );
  }
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3,
      dx = Math.sin(a) * 0.48,
      dz = Math.cos(a) * 0.48;
    shape(tree, "cylinder", 0x7b6951, [dx, 1.1, dz], [0.035, 2.2, 0.035]);
    limb(meshes, tree, [dx, 1.8, dz], [lean, 1.9, 0], 0.022, 0x4f5548);
  }
  shape(
    tree,
    "cylinder",
    0x303b3e,
    [0, 0.04, 0],
    [0.78, 0.025, 0.78],
  ).castShadow = false;
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5,
      bar = shape(
        tree,
        "box",
        0x6d7778,
        [Math.sin(a) * 0.43, 0.06, Math.cos(a) * 0.43],
        [0.025, 0.015, 0.65],
      );
    bar.rotation.y = a;
  }
  contact(parent, x, z, 6.2, 6.2);
  if (meshes.bakedShadows) {
    const shadow = shape(
      parent,
      "plane",
      meshes.special("canopy-dapple", {
        map: foliage.map,
        color: 0x101a20,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
      [x + 2.6, 0.063, z - 1.9],
      [5.2, 4.7, 1],
    );
    shadow.rotation.set(-Math.PI / 2, 0, seed * 0.6);
    shadow.castShadow = shadow.receiveShadow = false;
    shadow.userData.worldDayShade = true;
  }
}

export function dressShopfront(
  meshes,
  group,
  { width, depth, id, sign: name },
) {
  const { shape, surface, sign } = meshes,
    face = depth / 2,
    cafe = id === "tokyo_cafe",
    market = id === "tokyo_konbini",
    books = name.includes("書店"),
    trim = surface("metal", 1, 0x536068),
    timber = surface("wood", 3, 0x9f8a6a),
    canvas = surface(
      "fabric",
      2,
      cafe ? 0x466457 : books ? 0x815d46 : 0x71867c,
    );
  group.userData.frontageDressed = true;
  if (cafe || market || books) {
    const warm = meshes.special("shop-warm-wall", {
      color: 0xbcb19a,
      emissive: 0x483a28,
      emissiveIntensity: 0.12,
      roughness: 0.94,
    });
    shape(group, "box", warm, [0, 1.7, face - 2.7], [width - 0.8, 3.2, 0.12]);
    for (const side of [-1, 1])
      for (const dx of [0.24, 0.38])
        shape(
          group,
          "box",
          0xffedc2,
          [side * width * dx, 3.2, face - 1.6],
          [0.5, 0.045, 0.18],
          true,
        );
  }
  // Bay-scaled awnings and their supports cast depth without blocking the door.
  for (const side of [-1, 1]) {
    const center = side * (width / 4 + 0.5),
      bay = width / 2 - 1.35;
    const awning = shape(
      group,
      "box",
      canvas,
      [center, 3.08, face + 0.43],
      [bay, 0.075, 1.05],
    );
    awning.rotation.x = 0.12;
    shape(
      group,
      "box",
      canvas,
      [center, 2.98, face + 0.95],
      [bay, 0.22, 0.045],
    );
    for (const dx of [-bay / 2 + 0.14, bay / 2 - 0.14])
      limb(
        meshes,
        group,
        [center + dx, 2.65, face - 0.03],
        [center + dx, 3.08, face + 0.88],
        0.012,
        trim,
      );
    // Everything at ground level stays in the existing building footprint.
    const edge = side * (width / 2 - 0.7),
      rackZ = face - 0.32;
    if (cafe) {
      shape(
        group,
        "box",
        timber,
        [center, 0.74, rackZ],
        [bay - 0.35, 0.1, 0.48],
      );
      for (let i = 0; i < 4; i++) {
        const dx = center - bay / 2 + 0.5 + (i * (bay - 1)) / 3;
        shape(
          group,
          "cylinder",
          0xe3decf,
          [dx, 0.84, rackZ],
          [0.075, 0.12, 0.075],
        );
        shape(
          group,
          "cylinder",
          0xe3decf,
          [dx, 0.8, rackZ],
          [0.12, 0.012, 0.12],
        );
      }
    } else if (market || books) {
      for (const y of [0.35, 0.8, 1.25]) {
        shape(
          group,
          "box",
          timber,
          [center, y, rackZ],
          [bay - 0.3, 0.05, 0.55],
        );
        for (let j = 0; j < 12; j++) {
          const dx = center - bay / 2 + 0.25 + (j * (bay - 0.55)) / 12,
            color = [0xb8a67e, 0x759088, 0xa87c66, 0x9b9d8d][j % 4];
          shape(
            group,
            books ? "box" : "cylinder",
            color,
            [dx, y + 0.16, rackZ],
            books ? [0.09, 0.28 + (j % 3) * 0.025, 0.22] : [0.055, 0.25, 0.055],
          );
        }
        shape(
          group,
          "box",
          0xe3decf,
          [center, y - 0.02, face - 0.025],
          [bay - 0.3, 0.06, 0.012],
        );
      }
    }
    // Slender planted containers, with individual stems and overlapping leaves.
    shape(
      group,
      "taper",
      0x394b43,
      [edge, 0.28, face - 0.45],
      [0.22, 0.52, 0.22],
    );
    for (let j = 0; j < 6; j++) {
      const a = j * 2.4,
        end = [
          edge + Math.sin(a) * 0.23,
          0.9 + (j % 3) * 0.13,
          face - 0.45 + Math.cos(a) * 0.2,
        ];
      limb(meshes, group, [edge, 0.5, face - 0.45], end, 0.008, 0x435d3e);
      const leaf = shape(
        group,
        "plane",
        meshes.foliage(),
        end,
        [0.45, 0.48, 1],
      );
      leaf.rotation.set(-0.4, a, 0.2);
    }
  }
  // A dense secondary rail is behind the glazing, so the shop reads as a room.
  for (const side of [-1, 1]) {
    const cx = (side * width) / 3;
    for (const y of [0.45, 1.1, 1.75]) {
      shape(
        group,
        "box",
        timber,
        [cx, y, face - 2.05],
        [width / 4, 0.055, 0.35],
      );
      for (let j = 0; j < 7; j++)
        shape(
          group,
          "box",
          [0xb8a67e, 0x759088, 0xa87c66][j % 3],
          [
            cx - width / 8 + 0.2 + (j * (width / 4 - 0.4)) / 7,
            y + 0.15,
            face - 2.05,
          ],
          [0.12, 0.27, 0.18],
        );
    }
  }
  if (cafe || market || books) {
    const poster = sign(
      group,
      cafe
        ? "珈琲 450  /  焼き菓子"
        : market
          ? "季節のおすすめ  /  お弁当"
          : "新刊  /  文庫  /  街の本棚",
      [-width / 2 + 0.42, 1.78, face + 0.04],
      1.12,
      "#efe9d6",
      "#344647",
    );
    poster.scale.y = 2.6;
  }
  // Subtle mullion reflections and a small utility conduit break perfect facades.
  shape(
    group,
    "cylinder",
    trim,
    [width / 2 - 0.13, 2.3, face + 0.07],
    [0.022, 4.4, 0.022],
  );
  for (let y = 0.55; y < 4.5; y += 1.2)
    shape(
      group,
      "box",
      trim,
      [width / 2 - 0.13, y, face + 0.07],
      [0.11, 0.025, 0.07],
    );
}
