import { hoshiInteriorFixtures } from "./continuum-world-konbini-layout.mjs";
import { stationLayout } from "./continuum-world-station-layout.mjs";

// World coordinates are metres. This prototype stores exploration only, never course progress.
export const WORLD_ID = "tokyo";
export const WORLD_VERSION = 1;
export const PLAYER_RADIUS = 0.4;
export const worldLocations = [
  {
    id: "tokyo_cafe",
    title: "Komorebi Café",
    sign: "こもれび珈琲",
    x: -17,
    z: -13,
    width: 15,
    depth: 13,
    height: 9,
    door: { x: -17, z: -5 },
    interior: true,
    color: 0xc89579,
    npc: {
      id: "aoi",
      name: "葵",
      role: "カフェ店員",
      personality: "穏やかで好奇心がある",
      speech: "親しみやすい丁寧語",
      goal: "飲み物を注文する",
      x: 0,
      z: -4.8,
      line: "いらっしゃいませ。窓際の席へどうぞ。",
    },
  },
  {
    id: "tokyo_konbini",
    title: "Hoshi Market",
    sign: "ほしマート",
    x: 17,
    z: -13,
    width: 15,
    depth: 13,
    height: 7,
    door: { x: 17, z: -5 },
    interior: true,
    color: 0xbfcbbf,
    npc: {
      id: "ren",
      name: "蓮",
      role: "コンビニ店員",
      personality: "気さくで手際がよい",
      speech: "簡潔な丁寧語",
      goal: "買い物をする",
      x: 0,
      z: -4.8,
      line: "こんにちは。お弁当は奥の棚にありますよ。",
    },
  },
  {
    id: "tokyo_station",
    title: "Station information",
    sign: "あさひ駅",
    x: 0,
    z: -32,
    width: 15,
    depth: 8,
    height: 5.2,
    door: { x: 0, z: -26.5 },
    color: 0xc9c7b9,
    npc: {
      id: "yui",
      name: "結衣",
      role: "駅の案内係",
      personality: "丁寧で頼りになる",
      speech: "明瞭な丁寧語",
      goal: "道順を尋ねる",
      x: 3,
      z: -26.5,
      line: "こんにちは。駅の入口はこちらです。",
    },
  },
  {
    id: "tokyo_park",
    title: "Sakura pocket park",
    sign: "さくら公園",
    x: 19,
    z: 16,
    width: 19,
    depth: 17,
    door: { x: 12, z: 14 },
    color: 0x7eaa7d,
    npc: {
      id: "haru",
      name: "春",
      role: "近所の住民",
      personality: "朗らかで散歩が好き",
      speech: "やさしい日常の丁寧語",
      goal: "自己紹介する",
      x: 18,
      z: 15,
      line: "こんにちは。今日は散歩にぴったりですね。",
    },
  },
];
const outdoorBuildings = worldLocations
  .filter((l) => l.id !== "tokyo_park")
  .map((l) => ({ x: l.x, z: l.z, width: l.width, depth: l.depth }));
export const worldScenes = {
  outdoors: {
    bounds: { minX: -36, maxX: 36, minZ: -40, maxZ: 34 },
    spawn: { x: -8, z: 19 },
    obstacles: [
      ...outdoorBuildings,
      {...stationLayout.island, type:"ellipse"},
      {...stationLayout.railSite},
      ...stationLayout.shelters,
      ...stationLayout.streetTrees.map(p => ({...p,type:"ellipse",rx:.28,rz:.28})),
      { x: -24, z: 15, width: 22, depth: 18 },
      { x: -30, z: -31, width: 8, depth: 12 },
      { x: 29, z: -31, width: 10, depth: 12 },
    ],
  },
  tokyo_cafe: {
    bounds: { minX: -7, maxX: 7, minZ: -6, maxZ: 6 },
    spawn: { x: 0, z: 4 },
    obstacles: [
      { x: 0, z: -3.6, width: 8, depth: 1.4 },
      { x: -4.7, z: 0, width: 2, depth: 2 },
      { x: 4.7, z: 0, width: 2, depth: 2 },
    ],
  },
  tokyo_konbini: {
    bounds: { minX: -7, maxX: 7, minZ: -6, maxZ: 6 },
    spawn: { x: 0, z: 4 },
    obstacles: [
      ...hoshiInteriorFixtures,
      { x: 0, z: -3.6, width: 8, depth: 1.4 },
      { x: -4.4, z: -0.2, width: 1.5, depth: 5 },
      { x: 4.4, z: -0.2, width: 1.5, depth: 5 },
    ],
  },
};
export function worldAvailable({
  user,
  language,
  layout,
  enabled = import.meta.env?.VITE_CONTINUUM_WORLD_TOKYO_BETA,
}) {
  return (
    (enabled === true || enabled === "true") &&
    typeof user?.id === "string" &&
    user.id.length > 0 &&
    user?.role === "learner" &&
    language === "ja" &&
    layout === "illustrated"
  );
}
export function worldCompanionSpawn(scene, position) {
  const offsets =
    scene === "outdoors"
      ? [
          [0.7, 0.7],
          [-0.7, 0.7],
          [0.7, -0.7],
          [-0.7, -0.7],
        ]
      : [
          [0.4, -0.6],
          [-0.4, -0.6],
          [0.6, 0.6],
          [-0.6, 0.6],
        ];
  return (
    offsets
      .map(([x, z]) => ({ x: position.x + x, z: position.z + z }))
      .find((p) => isWorldWalkable(scene, p)) || { ...position }
  );
}
export function isWorldWalkable(scene, position, radius = PLAYER_RADIUS) {
  const definition = worldScenes[scene];
  if (
    !definition ||
    !Number.isFinite(position?.x) ||
    !Number.isFinite(position?.z)
  )
    return false;
  const b = definition.bounds;
  return (
    position.x >= b.minX + radius &&
    position.x <= b.maxX - radius &&
    position.z >= b.minZ + radius &&
    position.z <= b.maxZ - radius &&
    !definition.obstacles.some(
      (o) => o.type === "ellipse"
        ? ((position.x-o.x)/(o.rx+radius))**2 + ((position.z-o.z)/(o.rz+radius))**2 < 1
        : position.x > o.x - o.width / 2 - radius &&
        position.x < o.x + o.width / 2 + radius &&
        position.z > o.z - o.depth / 2 - radius &&
        position.z < o.z + o.depth / 2 + radius,
    )
  );
}
export function moveWorldActor(scene, position, delta, radius = PLAYER_RADIUS) {
  const next = { ...position },
    steps = Math.max(1, Math.ceil(Math.hypot(delta.x, delta.z) / 0.18));
  for (let i = 0; i < Math.min(steps, 1000); i++) {
    const x = next.x + delta.x / steps,
      z = next.z + delta.z / steps;
    if (isWorldWalkable(scene, { x, z: next.z }, radius)) next.x = x;
    if (isWorldWalkable(scene, { x: next.x, z }, radius)) next.z = z;
  }
  return next;
}
export function movementVector(input, yaw, seconds, running = false) {
  const length = Math.hypot(input.x, input.z),
    scale =
      (Math.min(1, length) / Math.max(1, length)) *
      (running ? 4.2 : 1.55) *
      Math.min(0.1, Math.max(0, seconds));
  return {
    x: (input.x * Math.cos(yaw) + input.z * Math.sin(yaw)) * scale,
    z: (-input.x * Math.sin(yaw) + input.z * Math.cos(yaw)) * scale,
  };
}
export function clearWorldSegment(scene, from, to, radius = PLAYER_RADIUS) {
  const steps = Math.max(
    1,
    Math.ceil(Math.hypot(to.x - from.x, to.z - from.z) / 0.25),
  );
  for (let i = 0; i <= steps; i++)
    if (
      !isWorldWalkable(
        scene,
        {
          x: from.x + ((to.x - from.x) * i) / steps,
          z: from.z + ((to.z - from.z) * i) / steps,
        },
        radius,
      )
    )
      return false;
  return true;
}
// Bounded grid search is used only when the companion's direct path is obstructed.
export function worldPath(scene, from, to) {
  if (!isWorldWalkable(scene, from) || !isWorldWalkable(scene, to)) return [];
  if (clearWorldSegment(scene, from, to)) return [to];
  // Quarter-metre cells resolve narrow retail aisles without increasing the
  // outdoor search cost. Search remains bounded to the small room.
  const step=scene==="tokyo_konbini"?.25:1;
  const gridPoint = (position) => {
    const candidates = [];
    for (
      let x = Math.round(position.x/step) - 1;
      x <= Math.round(position.x/step) + 1;
      x++
    )
      for (
        let z = Math.round(position.z/step) - 1;
        z <= Math.round(position.z/step) + 1;
        z++
      )
        if (clearWorldSegment(scene, position, { x:x*step, z:z*step }))
          candidates.push({ x:x*step, z:z*step });
    return candidates.sort(
      (a, b) =>
        Math.hypot(a.x - position.x, a.z - position.z) -
        Math.hypot(b.x - position.x, b.z - position.z),
    )[0];
  };
  const start = gridPoint(from),
    goal = gridPoint(to);
  if (!start || !goal) return [];
  const key = (p) => p.x + "," + p.z,
    queue = [start],
    parents = new Map([[key(start), null]]);
  for (let i = 0; i < queue.length && i < 6500; i++) {
    const point = queue[i];
    if (point.x === goal.x && point.z === goal.z) {
      const result = [to];
      let cursor = point;
      while (cursor) {
        result.unshift(cursor);
        cursor = parents.get(key(cursor));
      }
      if(step===1)return result;
      const sparse=[];let anchor=from,index=0;
      while(index<result.length) {
        let end=result.length-1;
        while(end>index && !clearWorldSegment(scene,anchor,result[end]))end--;
        sparse.push(result[end]);anchor=result[end];index=end+1;
      }
      return sparse;
    }
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const next = { x: point.x + dx*step, z: point.z + dz*step };
      if (!parents.has(key(next)) && clearWorldSegment(scene, point, next)) {
        parents.set(key(next), point);
        queue.push(next);
      }
    }
  }
  return [];
}
export function worldInteraction(scene, position) {
  const distance = (p) => Math.hypot(p.x - position.x, p.z - position.z);
  if (scene !== "outdoors") {
    if (distance({ x: 0, z: 5 }) < 2.1) return { type: "exit" };
    const location = worldLocations.find((l) => l.id === scene);
    return location && distance(location.npc) < 3
      ? { type: "talk", location }
      : null;
  }
  for (const location of worldLocations) {
    if (location.interior && distance(location.door) < 2.7)
      return { type: "enter", location };
    if (!location.interior && distance(location.npc) < 3)
      return { type: "talk", location };
  }
  return null;
}
// Outdoor information points lead to the person; enterable shops lead to a door.
export function worldDestinationPoint(id) {
  const location = worldLocations.find((location) => location.id === id);
  if (!location) return null;
  const point = location.interior ? location.door : location.npc;
  return { x: point.x, z: point.z };
}
export const worldStorageKey = (userId) => "continuumWorld:tokyo:v1:" + userId;
export function restoreWorldState(value) {
  const state = value && typeof value === "object" ? value : {},
    scene = Object.hasOwn(worldScenes, state.scene) ? state.scene : "outdoors";
  return {
    version: WORLD_VERSION,
    scene,
    position: isWorldWalkable(scene, state.position)
      ? { x: state.position.x, z: state.position.z }
      : { ...worldScenes[scene].spawn },
    yaw: Number.isFinite(state.yaw) ? state.yaw % (Math.PI * 2) : 0,
    quality: ["auto", "low", "medium", "high"].includes(state.quality)
      ? state.quality
      : "auto",
    time: ["auto", "day", "night"].includes(state.time) ? state.time : "auto",
    sound: state.sound === true,
    volume: Number.isFinite(state.volume)
      ? Math.min(1, Math.max(0, state.volume))
      : 0.2,
    reduced: state.reduced === true,
  };
}

// Visible walkable surfaces use metre heights; actors and contact shadows follow.
export function worldFloorHeight(scene, {x,z}) {
  if(scene !== 'outdoors') return 0;
  if(Math.abs(x)<=11 && z>=-28 && z<=-13) return .063;
  if((x>=-29 && x<=-7 || x>=7 && x<=29) && Math.abs(z)<=4) return .055;
  if(x>=15.5 && x<=18.5 && z>=7.5 && z<=24.5) return .07;
  if(x>=9.5 && x<=28.5 && z>=7.5 && z<=24.5) return .03;
  if(Math.abs(z)<=4) return .032;
  if(Math.abs(x)<=4) return .025;
  return -.03;
}

// Bounded acceleration keeps start/stop and walk/run changes continuous.
export function worldVelocity(previous, target, seconds) {
  const dx=target.x-previous.x, dz=target.z-previous.z, length=Math.hypot(dx,dz);
  const stopping=Math.hypot(target.x,target.z)<Math.hypot(previous.x,previous.z);
  const amount=Math.min(1,(stopping?22:10)*Math.min(.1,Math.max(0,seconds))/Math.max(length,.000001));
  return {x:previous.x+dx*amount,z:previous.z+dz*amount};
}
