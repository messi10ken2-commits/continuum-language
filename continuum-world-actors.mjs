import * as THREE from "three";

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
  shape(body, "torso", cloth, [0, 1.21, 0], [0.215, 0.52, 0.13]);
  shape(body, "sphere", denim, [0, 0.96, 0], [0.175, 0.13, 0.115]);
  shape(body, "cylinder", skin, [0, 1.49, 0], [0.052, 0.12, 0.05]);
  shape(body, "sphere", skin, [0, 1.636, 0.005], [0.102, 0.133, 0.097]);
  shape(body, "hair", hair, [0, 1.636, -0.008], [0.106, 0.141, 0.101]);
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
      [side * 0.045, 1.72, 0.053],
      [0.04, 0.033, 0.05],
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
    shape(hip, "sleeve", denim, [0, -0.215, 0], [0.08, 0.43, 0.082]);
    knee.position.y = -0.43;
    hip.add(knee);
    shape(knee, "sleeve", denim, [0, -0.2, 0], [0.064, 0.4, 0.067]);
    shape(knee, "rounded", shoe, [0, -0.427, 0.052], [0.15, 0.1, 0.27]);
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
    shoulder.position.set(side * 0.207, 1.4, 0);
    shoulder.rotation.z = side * 0.06;
    body.add(shoulder);
    shape(shoulder, "sleeve", cloth, [0, -0.13, 0], [0.057, 0.26, 0.057]);
    elbow.position.y = -0.285;
    shoulder.add(elbow);
    shape(elbow, "sleeve", cloth, [0, -0.12, 0], [0.046, 0.24, 0.05]);
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
    shape(body, "rounded", pack, [0, 1.19, -0.17], [0.28, 0.38, 0.14]);
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

export {makeWorldCompanion} from './continuum-world-companions.mjs';
