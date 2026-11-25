import * as THREE from "three";
import { callCompanionKind } from "./companion-call-models.mjs";

export function makeWorldPerson(
  meshes,
  { color = 0xa9b4ad, npc = false } = {},
) {
  const { shape, surface, contact } = meshes,
    root = new THREE.Group(),
    body = new THREE.Group();
  root.name = npc ? "Tokyo resident" : "Tokyo traveller";
  root.add(body);
  const cloth = surface("fabric", 2, color),
    denim = surface("fabric", 2, 0x6c7c87),
    skin = meshes.material(0xc6a38b),
    hair = meshes.material(0x252722),
    shoe = meshes.material(0x303534);
  shape(body, "sphere", cloth, [0, 1.21, 0], [0.205, 0.295, 0.125]);
  shape(body, "taper", cloth, [0, 1.15, 0], [0.19, 0.39, 0.12]);
  shape(body, "sphere", denim, [0, 0.96, 0], [0.175, 0.13, 0.115]);
  shape(body, "cylinder", skin, [0, 1.49, 0], [0.052, 0.12, 0.05]);
  shape(body, "sphere", skin, [0, 1.636, 0.005], [0.102, 0.133, 0.097]);
  shape(body, "sphere", hair, [0, 1.72, -0.018], [0.107, 0.065, 0.101]);
  shape(body, "sphere", hair, [0, 1.64, -0.065], [0.104, 0.085, 0.047]);
  for (const side of [-1, 1]) {
    shape(body, "sphere", skin, [side * 0.105, 1.64, 0], [0.018, 0.032, 0.017]);
    shape(
      body,
      "box",
      hair,
      [side * 0.047, 1.681, 0.086],
      [0.049, 0.009, 0.013],
    );
    shape(
      body,
      "sphere",
      0x343c39,
      [side * 0.041, 1.66, 0.093],
      [0.013, 0.007, 0.006],
    );
    const tuft = shape(
      body,
      "sphere",
      hair,
      [side * 0.07, 1.721, 0.053],
      [0.06, 0.04, 0.065],
    );
    tuft.rotation.z = side * 0.25;
  }
  shape(body, "sphere", skin, [0, 1.625, 0.101], [0.018, 0.027, 0.022]);
  shape(body, "box", 0x936d61, [0, 1.59, 0.092], [0.036, 0.004, 0.006]);
  shape(body, "box", 0xadb9b4, [0, 1.2, 0.123], [0.008, 0.32, 0.006]);
  for (const side of [-1, 1]) {
    shape(
      body,
      "box",
      0x263d42,
      [side * 0.105, 1.28, 0.111],
      [0.063, 0.07, 0.009],
    );
    shape(
      body,
      "box",
      0x29383d,
      [side * 0.105, 1.31, 0.119],
      [0.065, 0.008, 0.009],
    );
  }
  const legs = [-1, 1].map((side) => {
    const hip = new THREE.Group(),
      knee = new THREE.Group();
    hip.position.set(side * 0.094, 0.94, 0);
    body.add(hip);
    shape(hip, "sphere", denim, [0, -0.205, 0], [0.082, 0.25, 0.085]);
    knee.position.y = -0.43;
    hip.add(knee);
    shape(knee, "sphere", denim, [0, -0.2, 0], [0.064, 0.23, 0.067]);
    shape(knee, "sphere", shoe, [0, -0.427, 0.052], [0.075, 0.065, 0.145]);
    shape(knee, "box", 0xc6c9c0, [0, -0.468, 0.052], [0.15, 0.024, 0.26]);
    for (let i = 0; i < 3; i++)
      shape(
        knee,
        "box",
        0x9caaa6,
        [0, -0.381, 0.08 + i * 0.022],
        [0.08, 0.006, 0.006],
      );
    return { hip, knee };
  });
  const arms = [-1, 1].map((side) => {
    const shoulder = new THREE.Group(),
      elbow = new THREE.Group();
    shoulder.position.set(side * 0.218, 1.4, 0);
    shoulder.rotation.z = side * 0.06;
    body.add(shoulder);
    shape(shoulder, "sphere", cloth, [0, -0.127, 0], [0.067, 0.172, 0.067]);
    elbow.position.y = -0.285;
    shoulder.add(elbow);
    shape(elbow, "sphere", cloth, [0, -0.105, 0], [0.049, 0.14, 0.052]);
    shape(elbow, "sphere", skin, [0, -0.26, 0.012], [0.039, 0.067, 0.032]);
    shape(
      elbow,
      "sphere",
      skin,
      [-side * 0.03, -0.245, 0.03],
      [0.014, 0.035, 0.018],
    );
    return { shoulder, elbow };
  });
  if (!npc) {
    const pack = surface("fabric", 2, 0xa99e85);
    shape(body, "sphere", pack, [0, 1.19, -0.17], [0.152, 0.205, 0.08]);
    shape(body, "box", 0x4a5146, [0, 1.17, -0.239], [0.18, 0.09, 0.018]);
    for (const side of [-1, 1]) {
      const strap = shape(
        body,
        "box",
        0x555a4d,
        [side * 0.125, 1.27, 0.105],
        [0.029, 0.31, 0.016],
      );
      strap.rotation.z = side * 0.08;
      shape(
        body,
        "box",
        0x919d95,
        [side * 0.125, 1.16, 0.117],
        [0.032, 0.025, 0.006],
      );
    }
  } else if (color === 0x597b89) {
    shape(body, "box", 0xc7c6aa, [0.09, 1.34, 0.125], [0.06, 0.035, 0.008]);
  }
  contact(root, 0, 0, 1.15, 0.85);
  const groups = [];
  root.traverse((object) => {
    if (object.isGroup) groups.push(object);
    if (object.isMesh) object.castShadow = false;
  });
  groups.forEach((group) => meshes.batch(group, false));
  let gait = 0,
    previousTime = 0,
    phase = 0;
  return {
    root,
    animate(time, speed, reduced) {
      const dt = Math.min(0.1, Math.max(0, time - previousTime));
      previousTime = time;
      gait += (speed - gait) * (1 - Math.exp(-dt / 0.14));
      phase += dt * (gait > 4 ? 11 : 8);
      const amplitude = reduced ? 0 : Math.min(0.6, gait * 0.115);
      legs.forEach(({ hip, knee }, i) => {
        const swing = Math.sin(phase + i * Math.PI);
        hip.rotation.x = swing * amplitude;
        knee.rotation.x = Math.max(0, -swing) * amplitude * 0.95;
      });
      arms.forEach(({ shoulder, elbow }, i) => {
        shoulder.rotation.x = -Math.sin(phase + i * Math.PI) * amplitude * 0.65;
        elbow.rotation.x =
          -0.12 - Math.max(0, Math.sin(phase + i * Math.PI)) * 0.1 * amplitude;
      });
      body.position.y = reduced
        ? 0
        : Math.abs(Math.sin(phase)) * Math.min(0.025, gait * 0.006);
      body.rotation.z = reduced
        ? 0
        : Math.sin(phase) * Math.min(0.015, gait * 0.004);
    },
  };
}

const animalStyles = {
  capybara: { fur: 0xb49b7d, size: 0.78, head: 0.8, tail: 0, ears: 0.055 },
  fox: { fur: 0xaf6943, size: 0.87, head: 0.72, tail: 0.6, ears: 0.15 },
  cat: { fur: 0x82776d, size: 0.65, head: 0.65, tail: 0.55, ears: 0.13 },
  dog: { fur: 0xa79172, size: 0.9, head: 0.72, tail: 0.4, ears: 0.13 },
  "guinea-pig": { fur: 0x9a8164, size: 0.49, head: 0.75, tail: 0, ears: 0.06 },
  quokka: { fur: 0x93816d, size: 0.68, head: 0.8, tail: 0.32, ears: 0.07 },
  panda: { fur: 0xd6d4c9, size: 1.02, head: 0.86, tail: 0.08, ears: 0.075 },
};
export function makeWorldCompanion(meshes, requested = "bird") {
  const kind = callCompanionKind(requested),
    root = new THREE.Group(),
    body = new THREE.Group(),
    { shape, surface, contact } = meshes;
  root.name = "World full-body " + kind;
  root.add(body);
  const legs = [],
    wings = [];
  let head;
  if (kind === "bird") {
    const feathers = surface("fur", 2, 0x87755c),
      breast = surface("fur", 2, 0xc2b49c);
    shape(body, "sphere", feathers, [0, 0.29, 0], [0.14, 0.17, 0.21]);
    shape(body, "sphere", breast, [0, 0.29, 0.105], [0.12, 0.13, 0.13]);
    head = new THREE.Group();
    head.position.set(0, 0.47, 0.15);
    body.add(head);
    shape(head, "sphere", feathers, [0, 0, 0], [0.105, 0.1, 0.1]);
    for (const side of [-1, 1]) {
      shape(
        head,
        "sphere",
        0x171b19,
        [side * 0.086, 0.014, 0.04],
        [0.012, 0.012, 0.012],
      );
      const wing = new THREE.Group();
      wing.position.set(side * 0.12, 0.35, -0.02);
      body.add(wing);
      shape(
        wing,
        "sphere",
        0x4e524c,
        [side * 0.015, -0.025, -0.04],
        [0.035, 0.1, 0.17],
      );
      wings.push(wing);
      for (let i = 0; i < 3; i++)
        shape(
          wing,
          "box",
          0x9a9983,
          [side * 0.04, -0.03 - i * 0.025, -0.12],
          [0.008, 0.012, 0.1],
        );
      const leg = new THREE.Group();
      leg.position.set(side * 0.05, 0.14, 0.015);
      body.add(leg);
      shape(leg, "cylinder", 0x7b6852, [0, -0.06, 0], [0.01, 0.12, 0.01]);
      for (let i = -1; i <= 1; i++) {
        const toe = shape(
          leg,
          "box",
          0x7b6852,
          [i * 0.018, -0.115, 0.035],
          [0.008, 0.012, 0.07],
        );
        toe.rotation.y = i * 0.3;
      }
      legs.push(leg);
    }
    const beak = shape(
      head,
      "cone",
      0x8c7954,
      [0, -0.005, 0.114],
      [0.027, 0.07, 0.026],
    );
    beak.rotation.x = Math.PI / 2;
    const tail = shape(
      body,
      "sphere",
      0x4f5852,
      [0, 0.33, -0.23],
      [0.075, 0.035, 0.16],
    );
    tail.rotation.x = 0.2;
    contact(root, 0, 0, 0.65, 0.75);
  } else {
    const style = animalStyles[kind],
      fur = surface("fur", 3, style.fur),
      dark = meshes.material(0x282d2a),
      panda = kind === "panda",
      pig = kind === "guinea-pig",
      capy = kind === "capybara";
    body.scale.setScalar(style.size);
    shape(
      body,
      "sphere",
      fur,
      [0, 0.48, -0.03],
      [capy ? 0.23 : 0.25, capy ? 0.23 : 0.27, capy ? 0.48 : 0.43],
    );
    shape(
      body,
      "sphere",
      panda ? dark : fur,
      [0, 0.49, 0.22],
      [0.22, 0.24, 0.22],
    );
    head = new THREE.Group();
    head.position.set(0, 0.69, 0.36);
    body.add(head);
    shape(
      head,
      "sphere",
      fur,
      [0, 0, 0],
      [0.19 * style.head, 0.19 * style.head, 0.19],
    );
    const muzzle = shape(
      head,
      "sphere",
      capy ? fur : panda ? 0xe0d9c9 : 0xb6a389,
      [0, -0.075, capy ? 0.19 : 0.145],
      [capy ? 0.145 : 0.105, 0.095, capy ? 0.19 : 0.12],
    );
    shape(
      head,
      "sphere",
      dark,
      [0, -0.055, capy ? 0.36 : 0.25],
      [capy ? 0.065 : 0.039, 0.028, 0.022],
    );
    for (const side of [-1, 1]) {
      const ear = shape(
        head,
        kind === "fox" || kind === "cat" ? "cone" : "sphere",
        panda ? dark : fur,
        [side * 0.13, 0.115, -0.01],
        [style.ears * 0.75, style.ears * 1.5, style.ears * 0.55],
      );
      ear.rotation.z = -side * 0.2;
      if (panda)
        shape(
          head,
          "sphere",
          dark,
          [side * 0.105, 0.005, 0.143],
          [0.053, 0.06, 0.02],
        );
      shape(
        head,
        "sphere",
        0x161e1d,
        [side * 0.12, 0.02, 0.14],
        [0.018, 0.017, 0.013],
      );
      shape(
        head,
        "sphere",
        0xe4e4d6,
        [side * 0.121, 0.026, 0.15],
        [0.004, 0.004, 0.003],
      );
      for (const z of [-0.29, 0.25]) {
        const limb = new THREE.Group();
        limb.position.set(side * 0.18, 0.44, z);
        body.add(limb);
        shape(
          limb,
          "sphere",
          panda ? dark : fur,
          [0, -0.12, 0],
          [0.078, 0.17, 0.083],
        );
        shape(
          limb,
          "sphere",
          panda ? dark : fur,
          [0, -0.28, 0.04],
          [0.07, 0.13, 0.08],
        );
        shape(
          limb,
          "sphere",
          panda ? dark : fur,
          [0, -0.375, 0.07],
          [0.07, 0.035, 0.085],
        );
        for (let i = 0; i < 3; i++)
          shape(
            limb,
            "sphere",
            0x5c5549,
            [(i - 1) * 0.03, -0.383, 0.15],
            [0.008, 0.012, 0.02],
          );
        legs.push(limb);
      }
    }
    if (style.tail) {
      const tail = shape(
        body,
        "sphere",
        fur,
        [0, 0.43, -0.43 - style.tail * 0.5],
        [kind === "fox" ? 0.13 : 0.045, 0.06, style.tail],
      );
      tail.rotation.x = -0.3;
      if (kind === "fox")
        shape(body, "sphere", 0xd6cbb2, [0, 0.58, -1], [0.09, 0.055, 0.16]);
    }
    if (pig)
      shape(body, "sphere", 0xd2c8b6, [-0.09, 0.53, -0.13], [0.17, 0.21, 0.23]);
    contact(root, 0, 0, 1.15 * style.size, 1.5 * style.size);
  }
  const groups = [];
  root.traverse((object) => {
    if (object.isGroup) groups.push(object);
    if (object.isMesh) object.castShadow = false;
  });
  groups.forEach((group) => meshes.batch(group, false));
  let phase = 0;
  return {
    root,
    kind,
    animate(time, speed, reduced, looking = 0) {
      phase = time * (kind === "bird" ? 13 : 9);
      body.position.y = reduced
        ? 0
        : Math.abs(Math.sin(phase)) *
          Math.min(kind === "bird" ? 0.06 : 0.018, speed * 0.009);
      legs.forEach((leg, i) => {
        leg.rotation.x = reduced
          ? 0
          : Math.sin(phase + (i === 0 || i === 3 ? 0 : Math.PI)) *
            Math.min(0.35, speed * 0.075);
      });
      wings.forEach((wing, i) => {
        wing.rotation.z = reduced
          ? 0
          : Math.sin(phase) * Math.min(0.16, speed * 0.03) * (i ? 1 : -1);
      });
      if (head) {
        head.rotation.y = reduced
          ? 0
          : Math.max(-0.28, Math.min(0.28, looking));
        head.rotation.x = reduced ? 0 : Math.sin(time * 1.7) * 0.025;
      }
    },
  };
}
