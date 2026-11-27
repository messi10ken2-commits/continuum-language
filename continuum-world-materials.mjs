import * as THREE from "three";
import { worldPbrAssets } from "./continuum-world-pbr-assets.mjs";

// CPU-only source canvases are bounded to authored surface names. Each scene
// receives its own copy; GPU disposal cannot shrink a future scene's source.
const surfaceCanvases=new Map();
const authoredSurfaces=new Set(['paving','asphalt','concrete','wood','tile','bark','fabric','fur','grass','metal','leaves']);
// Original deterministic fallbacks plus bundled, unmodified CC0 surface scans.
export function worldRandom(seed = 39) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
export function makeWorldSurfaces(register, updated = () => {}) {
  const cache = new Map(),
    pending = new Set(),
    loaded = new Set();
  let live = true;
  const photos = {
    paving: "/world-tokyo/materials/pavement_04.jpg",
    asphalt: "/world-tokyo/materials/asphalt_02.jpg",
    wood: "/world-tokyo/materials/wood_planks.jpg",
    concrete: worldPbrAssets.concrete.color,
  };
  function request(t, name, url) {
    if (!url || typeof Image === "undefined") return;
    const image = new Image();
    pending.add(image);
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => {
      pending.delete(image);
      if (live) {
        loaded.add(name);
        t.dispose();
        t.image = image;
        t.needsUpdate = true;
        updated(t);
      }
    };
    image.onerror = () => pending.delete(image);
    image.src = url;
  }
  function detail(name, channel) {
    const url = worldPbrAssets[name]?.[channel];
    if (!url) return null;
    const key = name + ":" + channel;
    if (cache.has(key)) return cache.get(key);
    // Neutral one-texel data stays valid while offline or after a failed fetch.
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d");
    context.fillStyle = channel === "normal" ? "rgb(128,128,255)" : "#ffffff";
    context.fillRect(0, 0, 1, 1);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.NoColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = 2;
    t.needsUpdate = true;
    register(t);
    cache.set(key, t);
    request(t, name, url);
    return t;
  }
  function texture(name) {
    if (cache.has(name)) return cache.get(name);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const c = canvas.getContext("2d"),
      random = worldRandom(810 + name.length);
    const base =
      {
        paving: "#6d7478",
        asphalt: "#41484d",
        concrete: "#b7b7ae",
        wood: "#79604a",
        tile: "#d4d3ca",
        bark: "#5b5950",
        fabric: "#778087",
        fur: "#eee5d9",
        grass: "#606950",
        metal: "#92999c",
      }[name] || "#888888";
    c.fillStyle = base;
    c.fillRect(0, 0, 512, 512);
    if(surfaceCanvases.has(name)){
      if(name==='leaves')c.clearRect(0,0,512,512);
      c.drawImage(surfaceCanvases.get(name),0,0);
    }else{
    for (let i = 0; i < 6500; i++) {
      const v = random() > 0.5 ? 255 : 0;
      c.fillStyle = `rgba(${v},${v},${v},${random() * 0.09})`;
      c.fillRect(
        random() * 512,
        random() * 512,
        1 + random() * 2,
        1 + random() * 2,
      );
    }
    if (name === "paving" || name === "tile") {
      const w = name === "paving" ? 128 : 256,
        h = name === "paving" ? 64 : 256;
      for (let y = -1; y < 512 / h + 1; y++)
        for (let x = -1; x < 512 / w + 1; x++) {
          const px = x * w + ((y % 2) * w) / 2,
            py = y * h;
          const b =
            Math.floor(105 + random() * 45) + (name === "tile" ? 65 : 0);
          c.fillStyle = `rgba(${b},${b + 4},${b + 5},.65)`;
          c.fillRect(px + 2, py + 2, w - 4, h - 4);
          c.strokeStyle = "#ffffff23";
          c.strokeRect(px + 3, py + 3, w - 6, h - 6);
          c.fillStyle = "#20292a65";
          c.fillRect(px, py, w, 2);
          c.fillRect(px, py, 2, h);
        }
    }
    if (name === "concrete") {
      c.strokeStyle = "#65676455";
      c.lineWidth = 2;
      for (let n = 0; n < 512; n += 128) {
        c.beginPath();
        c.moveTo(n, 0);
        c.lineTo(n, 512);
        c.stroke();
        c.beginPath();
        c.moveTo(0, n);
        c.lineTo(512, n);
        c.stroke();
      }
      for (let y = 32; y < 512; y += 128)
        for (let x = 32; x < 512; x += 128) {
          c.fillStyle = "#60615b66";
          c.beginPath();
          c.arc(x, y, 2, 0, Math.PI * 2);
          c.fill();
        }
    }
    if (["wood", "bark", "fur", "fabric", "grass", "metal"].includes(name)) {
      for (let i = 0; i < 650; i++) {
        const x = random() * 512,
          y = random() * 512;
        c.strokeStyle = random() > 0.5 ? "#fff2d01a" : "#10151930";
        c.lineWidth = 0.5 + random() * 2;
        c.beginPath();
        c.moveTo(x, y);
        c.bezierCurveTo(
          x + random() * 8,
          y + 16,
          x - 4,
          y + 35,
          x + 3,
          y + (name === "wood" || name === "bark" ? 100 : 12),
        );
        c.stroke();
      }
    }
    if (name === "leaves") {
      c.clearRect(0, 0, 512, 512);
      // Compound sprigs: small, pointed leaves follow visible stems rather than
      // isolated dots on a mostly empty card. Each tree varies card angle/scale.
      for (let branch = 0; branch < 5; branch++) {
        c.save();
        c.translate(90 + random() * 330, 90 + random() * 330);
        c.rotate(random() * Math.PI * 2);
        c.strokeStyle = "#4c5b37";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(-85, 0);
        c.quadraticCurveTo(0, -16, 85, 0);
        c.stroke();
        for (let j = 0; j < 9; j++)
          for (const side of [-1, 1]) {
            const x = -72 + j * 18,
              y = side * (15 + random() * 9);
            c.save();
            c.translate(x, y);
            c.rotate(side * 0.7);
            c.fillStyle = ["#526f3e", "#6e8750", "#395735", "#839666"][
              (j + branch) % 4
            ];
            c.beginPath();
            c.moveTo(-24, 0);
            c.quadraticCurveTo(0, -15, 25, 0);
            c.quadraticCurveTo(0, 14, -24, 0);
            c.fill();
            c.strokeStyle = "#b0bb7c88";
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(-20, 0);
            c.lineTo(20, 0);
            c.stroke();
            c.restore();
          }
        c.restore();
      }
    }
    if(authoredSurfaces.has(name)){
      const source=document.createElement('canvas');source.width=source.height=512;
      source.getContext('2d').drawImage(canvas,0,0);surfaceCanvases.set(name,source);
    }
    }
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    register(t);
    cache.set(name, t);
    request(t, name, photos[name]);
    return t;
  }
  return {
    texture,
    detail,
    get pending() {
      return pending.size;
    },
    get loaded() {
      return loaded.size;
    },
    dispose() {
      live = false;
      for (const image of pending) {
        image.onload = image.onerror = null;
        image.src = "";
      }
      pending.clear();
      cache.clear();
      loaded.clear();
    },
  };
}

export function makeWorldSky() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const c = canvas.getContext("2d"),
    g = c.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#527d9e");
  g.addColorStop(0.42, "#b9d1df");
  g.addColorStop(0.52, "#d9ddd8");
  g.addColorStop(0.55, "#8b9192");
  g.addColorStop(1, "#77746d");
  c.fillStyle = g;
  c.fillRect(0, 0, 1024, 512);
  c.fillStyle = "#ffffff";
  c.beginPath();
  c.arc(760, 120, 24, 0, Math.PI * 2);
  c.fill();
  const random = worldRandom(81);
  for (let x = 0; x < 1024; x += 22) {
    const h = 10 + random() * 75;
    c.fillStyle = "#68747b";
    c.fillRect(x, 270 - h, 18, h);
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.mapping = THREE.EquirectangularReflectionMapping;
  return map;
}
