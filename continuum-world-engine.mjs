import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CALL_MODELS } from "./companion-call-models.mjs";
import { bindFaceRig } from "./companion-call-rig.mjs";
import { FaceMotion } from "./companion-face-motion.mjs";
import {
  clearWorldSegment,
  isWorldWalkable,
  moveWorldActor,
  movementVector,
  worldInteraction,
  worldLocations,
  worldPath,
} from "./continuum-world-model.mjs";
import {
  worldMeshes,
  makeOutdoorWorld,
  makeWorldPerson,
} from "./continuum-world-scenes.mjs";

export async function createWorldEngine(
  host,
  { initial, kind = "capybara", input, options, onSnapshot, onFailure, signal },
) {
  const meshes = worldMeshes(),
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(53, 1, 0.1, 100);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: options().quality === "high",
      powerPreference: "low-power",
    });
  } catch (error) {
    meshes.dispose();
    throw error;
  }
  const canvas = renderer.domElement;
  canvas.className = "cw-canvas";
  host.append(canvas);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const indoor = initial.scene !== "outdoors";
  let environment;
  try {
    environment = indoor
      ? (await import("./continuum-world-interiors.mjs")).makeWorldInterior(
          initial.scene,
          meshes,
        )
      : makeOutdoorWorld(meshes);
  } catch (error) {
    renderer.dispose();
    canvas.remove();
    meshes.dispose();
    throw error;
  }
  if (signal.aborted) {
    renderer.dispose();
    canvas.remove();
    meshes.dispose();
    return null;
  }
  scene.add(environment);
  const player = makeWorldPerson(meshes),
    companion = new THREE.Group();
  scene.add(player.root, companion);
  const npcs = (
    indoor
      ? worldLocations.filter((l) => l.id === initial.scene)
      : worldLocations.filter((l) => !l.interior)
  ).map((location) => {
    const actor = makeWorldPerson(meshes, {
      color: location.id === "tokyo_station" ? 0x597b89 : 0xa9997b,
      npc: true,
    });
    actor.root.position.set(location.npc.x, 0, location.npc.z);
    scene.add(actor.root);
    return actor;
  });
  const marker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.04, 24),
    new THREE.MeshBasicMaterial({ color: 0xf6c66b }),
  );
  const beacon = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.7, 12),
    new THREE.MeshBasicMaterial({ color: 0xf6c66b }),
  );
  scene.add(marker, beacon);
  scene.background = new THREE.Color(0xe8d5b8);
  scene.fog = new THREE.Fog(0xe8d5b8, indoor ? 18 : 42, indoor ? 36 : 87);
  const hemisphere = new THREE.HemisphereLight(0xffeacf, 0x6c7c82, 2.4),
    sun = new THREE.DirectionalLight(0xffd7ad, 3);
  sun.position.set(-12, 26, 8);
  scene.add(hemisphere, sun);
  const fill = new THREE.PointLight(0xffd09c, indoor ? 20 : 0, 22, 1.5);
  fill.position.set(0, 4, 0);
  scene.add(fill);
  let position = { ...initial.position },
    yaw = initial.yaw,
    pitch = 0.44,
    companionPosition = { x: position.x + 1.1, z: position.z + 1.2 };
  if (!isWorldWalkable(initial.scene, companionPosition))
    companionPosition = { ...position };
  let companionModel = null,
    applyFace = null,
    disposed = false,
    active = false,
    contextLost = false,
    frame = 0,
    last = 0,
    lastPaint = 0,
    lastPublish = 0,
    lastPath = 0,
    path = [],
    walkTime = 0,
    draws = 0,
    frameCount = 0,
    frameStart = performance.now(),
    fps = 0,
    renderMs = 0,
    triangles = 0;
  const faceMotion = new FaceMotion(),
    keys = new Set(),
    cameraTarget = new THREE.Vector3(),
    desiredCamera = new THREE.Vector3();
  const companionKind = Object.hasOwn(CALL_MODELS, kind) ? kind : "capybara";
  // Retain the original companion model and face motion. No external model provider.
  fetch(CALL_MODELS[companionKind], { signal })
    .then(async (response) => {
      if (!response.ok) throw Error("Companion unavailable");
      const gltf = await new GLTFLoader().parseAsync(
        await response.arrayBuffer(),
        "",
      );
      if (disposed || signal.aborted) {
        disposeObject(gltf.scene);
        return;
      }
      companionModel = gltf.scene;
      applyFace = bindFaceRig(companionModel);
      const bounds = new THREE.Box3().setFromObject(companionModel),
        height = bounds.max.y - bounds.min.y,
        scale = 1.25 / height;
      companionModel.scale.setScalar(scale);
      companionModel.position.y = -bounds.min.y * scale;
      companion.add(companionModel);
      host.dataset.companion = companionKind;
    })
    .catch((error) => {
      if (!disposed && error.name !== "AbortError") {
        host.dataset.companion = "unavailable";
        onFailure("companion");
      }
    });
  function disposeObject(object) {
    const geometries = new Set(),
      materials = new Set(),
      textures = new Set();
    object.traverse((child) => {
      if (child.geometry) geometries.add(child.geometry);
      if (child.material)
        for (const material of [child.material].flat()) {
          materials.add(material);
          for (const value of Object.values(material))
            if (value?.isTexture) textures.add(value);
        }
      if (child.isSkinnedMesh) child.skeleton.dispose();
    });
    textures.forEach((t) => t.dispose());
    materials.forEach((m) => m.dispose());
    geometries.forEach((g) => g.dispose());
  }
  const publish = () => {
    host.dataset.worldFrames = String(draws);
    host.dataset.scene = initial.scene;
    host.dataset.active = String(active);
    host.dataset.position = JSON.stringify(position);
    host.dataset.yaw = String(yaw);
    host.dataset.fps = String(fps);
    host.dataset.renderMs = String(renderMs);
    host.dataset.triangles = String(triangles);
    onSnapshot({
      scene: initial.scene,
      position: { ...position },
      yaw,
      interaction: worldInteraction(initial.scene, position),
      fps,
      renderMs,
      triangles,
      draws,
      companion: { ...companionPosition },
    });
  };
  const resize = () => {
    if (disposed || contextLost) return;
    const box = host.getBoundingClientRect(),
      quality = options().quality;
    const ratio =
      quality === "high"
        ? Math.min(devicePixelRatio, 1.75)
        : quality === "medium"
          ? 1.25
          : quality === "low"
            ? 0.75
            : Math.min(devicePixelRatio, box.width < 700 ? 1 : 1.25);
    renderer.setPixelRatio(ratio);
    renderer.setSize(Math.max(1, box.width), Math.max(1, box.height), false);
    camera.aspect = box.width / Math.max(1, box.height);
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  const keydown = (event) => {
    if (
      [
        "KeyW",
        "KeyA",
        "KeyS",
        "KeyD",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ShiftLeft",
        "ShiftRight",
      ].includes(event.code)
    ) {
      event.preventDefault();
      keys.add(event.code);
    }
  };
  const keyup = (event) => keys.delete(event.code),
    clear = () => keys.clear();
  host.addEventListener("keydown", keydown);
  host.addEventListener("keyup", keyup);
  host.addEventListener("blur", clear, true);
  let dragging = null;
  const pointerdown = (event) => {
    if (event.button !== 0) return;
    host.focus({ preventScroll: true });
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  };
  const pointermove = (event) => {
    if (!dragging || dragging.id !== event.pointerId) return;
    yaw -= (event.clientX - dragging.x) * 0.006;
    pitch = Math.max(
      0.2,
      Math.min(0.85, pitch + (event.clientY - dragging.y) * 0.004),
    );
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const pointerup = () => {
    dragging = null;
  };
  canvas.addEventListener("pointerdown", pointerdown);
  canvas.addEventListener("pointermove", pointermove);
  canvas.addEventListener("pointerup", pointerup);
  canvas.addEventListener("pointercancel", pointerup);
  canvas.addEventListener("lostpointercapture", pointerup);
  const lost = (event) => {
    event.preventDefault();
    contextLost = true;
    active = false;
    clear();
    cancelAnimationFrame(frame);
    publish();
    onFailure("context");
  };
  const restored = () => {
    if (!disposed) onFailure("restore");
  };
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  const update = (dt, now) => {
    const settings = options(),
      reduced =
        settings.reduced ||
        matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = input(),
      vector = {
        x:
          controls.x +
          Number(keys.has("KeyD") || keys.has("ArrowRight")) -
          Number(keys.has("KeyA") || keys.has("ArrowLeft")),
        z:
          controls.z +
          Number(keys.has("KeyS") || keys.has("ArrowDown")) -
          Number(keys.has("KeyW") || keys.has("ArrowUp")),
      };
    const delta = movementVector(
        vector,
        yaw,
        dt,
        controls.run || keys.has("ShiftLeft") || keys.has("ShiftRight"),
      ),
      before = position;
    position = moveWorldActor(initial.scene, position, delta);
    const speed =
      Math.hypot(position.x - before.x, position.z - before.z) /
      Math.max(0.001, dt);
    walkTime += dt;
    player.root.position.set(position.x, 0, position.z);
    if (speed > 0.05) {
      const target = Math.atan2(delta.x, delta.z),
        difference = Math.atan2(
          Math.sin(target - player.root.rotation.y),
          Math.cos(target - player.root.rotation.y),
        );
      player.root.rotation.y += difference * Math.min(1, dt * 12);
    }
    player.animate(walkTime, speed, reduced);
    const distance = Math.hypot(
      position.x - companionPosition.x,
      position.z - companionPosition.z,
    );
    if (distance > 1.8) {
      const target = { x: position.x, z: position.z };
      if (now - lastPath > 650) {
        path = worldPath(initial.scene, companionPosition, target);
        lastPath = now;
      }
      const next = clearWorldSegment(initial.scene, companionPosition, target)
        ? target
        : path[0];
      if (next) {
        const dx = next.x - companionPosition.x,
          dz = next.z - companionPosition.z,
          length = Math.hypot(dx, dz),
          step = Math.min(length, dt * (distance > 4 ? 5.5 : 3.7));
        companionPosition = moveWorldActor(initial.scene, companionPosition, {
          x: (dx / Math.max(0.001, length)) * step,
          z: (dz / Math.max(0.001, length)) * step,
        });
        if (length < 0.3) path.shift();
        companion.rotation.y = Math.atan2(dx, dz);
      }
    }
    companion.position.set(
      companionPosition.x,
      reduced
        ? 0
        : distance > 1.8
          ? Math.abs(Math.sin(walkTime * 8)) * 0.035
          : 0,
      companionPosition.z,
    );
    if (applyFace)
      applyFace(
        faceMotion.update({
          dt,
          state: settings.talking
            ? "listening"
            : distance > 1.8
              ? "thinking"
              : "listening",
          reduced,
        }),
      );
    for (const npc of npcs) npc.animate(walkTime, 0, reduced);
    const hour =
        settings.time === "night"
          ? 22
          : settings.time === "day"
            ? 15
            : new Date().getHours(),
      night = hour < 6 || hour >= 19;
    const sky = indoor ? 0xc7b798 : night ? 0x172f46 : 0xe8d5b8;
    scene.background.set(sky);
    scene.fog.color.set(sky);
    hemisphere.intensity = night && !indoor ? 0.8 : 2.4;
    sun.intensity = night && !indoor ? 0.35 : 3;
    renderer.toneMappingExposure = night && !indoor ? 1.15 : 1;
    const destination = worldLocations.find(
      (l) => l.id === settings.destination,
    )?.door;
    marker.visible = beacon.visible = !indoor && !!destination;
    if (destination) {
      marker.position.set(destination.x, 0.11, destination.z);
      beacon.position.set(
        destination.x,
        2.8 + (reduced ? 0 : Math.sin(walkTime * 2) * 0.12),
        destination.z,
      );
    }
    cameraTarget.set(position.x, 1.3, position.z);
    const distanceCamera = indoor ? 5.4 : 7.5;
    desiredCamera.set(
      position.x + Math.sin(yaw) * distanceCamera,
      1.3 + Math.sin(pitch) * distanceCamera,
      position.z + Math.cos(yaw) * distanceCamera,
    );
    // Shorten the camera boom before it crosses a wall, then keep it in the walkable volume.
    const ground = { x: desiredCamera.x, z: desiredCamera.z };
    for (let fraction = 1; fraction >= 0; fraction -= 0.08) {
      ground.x = position.x + (desiredCamera.x - position.x) * fraction;
      ground.z = position.z + (desiredCamera.z - position.z) * fraction;
      if (clearWorldSegment(initial.scene, position, ground, 0.18)) {
        desiredCamera.x = ground.x;
        desiredCamera.z = ground.z;
        break;
      }
    }
    camera.position.copy(desiredCamera);
    camera.lookAt(cameraTarget);
    const started = performance.now();
    renderer.render(scene, camera);
    renderMs = performance.now() - started;
    triangles = renderer.info.render.triangles;
    draws++;
    frameCount++;
    if (now - frameStart >= 1000) {
      fps = (frameCount * 1000) / (now - frameStart);
      frameCount = 0;
      frameStart = now;
    }
    if (now - lastPublish > 140) {
      lastPublish = now;
      publish();
    }
  };
  const tick = (now) => {
    frame = 0;
    if (disposed || !active || contextLost) return;
    const interval = options().quality === "high" ? 1000 / 60 : 1000 / 30;
    if (now - lastPaint >= interval) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      lastPaint = now;
      update(dt, now);
    }
    frame = requestAnimationFrame(tick);
  };
  update(0, performance.now());
  return {
    setActive(value) {
      if (disposed || contextLost) return;
      active = value;
      clear();
      dragging = null;
      cancelAnimationFrame(frame);
      frame = 0;
      last = performance.now();
      lastPaint = 0;
      frameStart = last;
      frameCount = 0;
      publish();
      if (active) frame = requestAnimationFrame(tick);
    },
    refresh: resize,
    getState: () => ({ scene: initial.scene, position: { ...position }, yaw }),
    dispose() {
      if (disposed) return;
      disposed = true;
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      clear();
      host.removeEventListener("keydown", keydown);
      host.removeEventListener("keyup", keyup);
      host.removeEventListener("blur", clear, true);
      canvas.removeEventListener("pointerdown", pointerdown);
      canvas.removeEventListener("pointermove", pointermove);
      canvas.removeEventListener("pointerup", pointerup);
      canvas.removeEventListener("pointercancel", pointerup);
      canvas.removeEventListener("lostpointercapture", pointerup);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      if (companionModel) disposeObject(companionModel);
      meshes.dispose();
      marker.geometry.dispose();
      marker.material.dispose();
      beacon.geometry.dispose();
      beacon.material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      host.dataset.active = "false";
    },
  };
}
