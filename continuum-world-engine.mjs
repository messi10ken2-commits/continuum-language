export {createWorldSession} from './continuum-world-session.mjs';
import {makeTokyoPedestrian} from './continuum-world-crowd.mjs';
import {tokyoLightingMaterials,setTokyoNight,updateTokyoNeon} from './continuum-world-tokyo-atmosphere.mjs';
import * as THREE from "three";
import { upgradeWorldPeople } from "./continuum-world-people.mjs";
import { makeWorldSky } from "./continuum-world-materials.mjs";
import {
  worldRenderProfile,
  reducedWorldPixelRatio,
} from "./continuum-world-render-policy.mjs";
import {
  clearWorldSegment,
  clearWorldCameraSegment,
  isWorldWalkable,
  moveWorldActor,
  movementVector,
  worldFloorHeight,
  worldVelocity,
  worldInteraction,
  worldDestinationPoint,
  worldLocations,
  worldPath,
  worldCompanionSpawn,
} from "./continuum-world-model.mjs";
import {
  worldMeshes,
  makeOutdoorWorld,
  makeWorldPerson,
  makeWorldCompanion,
} from "./continuum-world-scenes.mjs";

let interiorModule;
export function preloadWorldInterior(){
 if(!interiorModule){const pending=import('./continuum-world-interiors.mjs').catch(error=>{if(interiorModule===pending)interiorModule=null;throw error;});interiorModule=pending;}
 return interiorModule;
}

export async function createWorldEngine(
  host,
  {
    initial,
    kind = "bird",
    input,
    options,
    onSnapshot,
    onFailure,
    signal,
    capture = false,
    session = null,
  },
) {
  const mountStarted=performance.now();
  const meshes = worldMeshes({ quality: options().quality }),
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(55, 1, 0.08, 220);
  let renderer;
  try {
    renderer = session ? session.renderer(host,options().quality,capture) : new THREE.WebGLRenderer({
      antialias: options().quality !== "low",
      powerPreference: "low-power",
      // Standalone art QA pauses before a screenshot. Keep that buffer only
      // when explicitly requested; normal app rendering keeps the default off.
      preserveDrawingBuffer: capture,
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
  const convenienceStore = initial.scene === "tokyo_konbini";
  let environment;
  try {
    environment = indoor
      ? (await preloadWorldInterior()).makeWorldInterior(
          initial.scene,
          meshes,
        )
      : makeOutdoorWorld(meshes);
  } catch (error) {
    if(!session){renderer.dispose();canvas.remove();}
    meshes.dispose();
    throw error;
  }
  if (signal.aborted) {
    if(!session){renderer.dispose();canvas.remove();}
    meshes.dispose();
    return null;
  }
  scene.add(environment);
  const player = makeWorldPerson(meshes),
    animal = makeWorldCompanion(meshes, kind),
    companion = animal.root;
  host.dataset.companion = animal.kind;
  host.dataset.companionLod = "full-body";
  scene.add(player.root, companion);
  player.root.rotation.y = companion.rotation.y = initial.yaw + Math.PI;
  const npcs = (
    indoor
      ? worldLocations.filter((l) => l.id === initial.scene)
      : worldLocations.filter((l) => !l.interior)
  ).map((location) => {
    const actor = makeWorldPerson(meshes, {
      color: location.id === "tokyo_station" ? 0x597b89 : 0xa9997b,
      npc: true,
    });
    actor.color = location.id === "tokyo_station" ? 0x597b89 : 0xa9997b;
    actor.root.position.set(location.npc.x, worldFloorHeight(initial.scene, location.npc), location.npc.z);
    scene.add(actor.root);
    return actor;
  });
  npcs.forEach((actor, i) => {
    actor.variant = i % 2 === 0 ? "resident" : "traveller";
  });
  const pedestrians=indoor?[]:Array.from({length:meshes.physical?4:2},(_,i)=>{
    const actor=makeWorldPerson(meshes,{npc:true,color:[0x6b7280,0xc1b2a0,0x426065,0x907275][i]});
    actor.color=[0x6b7280,0xc1b2a0,0x426065,0x907275][i];actor.variant=i%2?'traveller':'resident';
    scene.add(actor.root);return makeTokyoPedestrian(actor,i);
  });
  const people = upgradeWorldPeople([player, ...npcs,...pedestrians.map(p=>p.actor)], {
    signal,
    physical: meshes.physical,
    fabric: meshes.surface("fabric",3),
    pool: session?.people,
    onStatus: (loaded, total) => {
      host.dataset.peopleLoaded = String(loaded);
      host.dataset.peopleTotal = String(total);
    },
  });
  host.dataset.peopleLoaded = "0";
  host.dataset.peopleTotal = String(1 + npcs.length+pedestrians.length);
  const marker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.04, 24),
    new THREE.MeshBasicMaterial({ color: 0xf6c66b }),
  );
  const beacon = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.7, 12),
    new THREE.MeshBasicMaterial({ color: 0xf6c66b }),
  );
  scene.add(marker, beacon);
  scene.background = new THREE.Color(0xc6d7e0);
  scene.fog = new THREE.Fog(0xc6d7e0, indoor ? 22 : 60, indoor ? 48 : 150);
  const hemisphere = new THREE.HemisphereLight(0xc9e3f1, 0x686151, 1.5),
    sun = new THREE.DirectionalLight(0xffefce, 3.1);
  sun.position.set(-25, 36, 18);
  sun.shadow.camera.left = sun.shadow.camera.bottom = -42;
  sun.shadow.camera.right = sun.shadow.camera.top = 42;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 100;
  sun.shadow.normalBias = 0.035;
  sun.shadow.bias = -0.0003;
  sun.shadow.autoUpdate = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  scene.add(hemisphere, sun);
  const fill = new THREE.PointLight(0xffe7cb, indoor ? 18 : 0, 22, 1.5);
  fill.position.set(0, 4, 0);
  fill.visible = indoor;
  if (convenienceStore) { fill.color.set(0xf3f8ff); fill.intensity=22; }
  scene.add(fill);
  const physical = meshes.physical;
  const skyTexture = physical&&!session ? makeWorldSky() : null;
  let reflection = null;
  if(physical&&session)scene.environment=session.environment(makeWorldSky);
  else if (physical) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    reflection = pmrem.fromEquirectangular(skyTexture);
    scene.environment = reflection.texture;
    pmrem.dispose();
  }
  const lamps = [],
    dayShadows = [],
    slidingDoors = [];
  environment.traverse((object) => {
    if (object.userData.worldLamp) {
      object.userData.worldLampPosition = object.getWorldPosition(new THREE.Vector3());
      lamps.push(object);
    }
    if (object.userData.hoshiDoorSide) {
      slidingDoors.push(object);
      if(Math.hypot(initial.position.x,6-initial.position.z)<3.8)object.position.x=object.userData.hoshiDoorSide*1.86;
    }
    if (object.userData.worldDayShade) dayShadows.push(object);
  });
  const nightMaterials=tokyoLightingMaterials(environment);
  let lightingKey = "",
    slowSamples = 0;
  let position = { ...initial.position },
    yaw = initial.yaw,
    pitch = 0.2,
    cameraYaw = initial.yaw, cameraPitch = .2, followSpeed = 0, joyWeight = 0,
    companionPosition = worldCompanionSpawn(initial.scene, position);
  if (!isWorldWalkable(initial.scene, companionPosition))
    companionPosition = { ...position };
  let disposed = false,
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
  let velocity = {x:0,z:0};
  const keys = new Set(),
    cameraTarget = new THREE.Vector3(),
    desiredCamera = new THREE.Vector3();
  const publish = () => {
    host.dataset.worldFrames = String(draws);
    host.dataset.rendererCreates=String(session?.rendererCreates||1);
    host.dataset.peopleDecodes=String(session?.people.decodes||0);
    host.dataset.scene = initial.scene;
    host.dataset.active = String(active);
    host.dataset.position = JSON.stringify(position);
    host.dataset.yaw = String(yaw);
    host.dataset.heldKeys = String(keys.size);
    host.dataset.pitch = String(pitch);
    host.dataset.cameraY = String(camera.position.y);
    host.dataset.cameraDistance = String(camera.position.distanceTo(cameraTarget));
    host.dataset.fps = String(fps);
    host.dataset.renderMs = String(renderMs);
    host.dataset.triangles = String(triangles);
    host.dataset.pixelRatio = String(renderer.getPixelRatio());
    host.dataset.drawCalls = String(renderer.info.render.calls);
    host.dataset.materialsPending = String(meshes.pendingTextures);
    host.dataset.photoSurfaces = String(meshes.photoSurfaces);
    const companionScreen = new THREE.Vector3(
      companionPosition.x,
      0.4,
      companionPosition.z,
    ).project(camera);
    host.dataset.companionScreen = JSON.stringify({
      x: companionScreen.x,
      y: companionScreen.y,
    });
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
    const profile = worldRenderProfile(quality, box.width, devicePixelRatio);
    const ratio = profile.pixelRatio;
    slowSamples = 0;
    host.dataset.visualProfile = profile.id;
    host.dataset.shadowSize = String(profile.shadowSize);
    if (
      sun.shadow.mapSize.x !== profile.shadowSize ||
      sun.castShadow !== !!profile.shadowSize
    ) {
      sun.castShadow = !!profile.shadowSize;
      sun.shadow.mapSize.set(
        profile.shadowSize || 512,
        profile.shadowSize || 512,
      );
      sun.shadow.map?.dispose();
      sun.shadow.map = null;
      sun.shadow.needsUpdate = true;
    }
    renderer.setPixelRatio(ratio);
    renderer.setSize(Math.max(1, box.width), Math.max(1, box.height), false);
    camera.aspect = box.width / Math.max(1, box.height);
    camera.fov = indoor ? (box.width < 700 ? 69 : 60) : (box.width < 700 ? 63 : 55);
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
  const keyup = (event) => {
      if (keys.delete(event.code)) publish();
    },
    clear = () => { keys.clear(); velocity = {x:0,z:0}; };
  host.addEventListener("keydown", keydown);
  host.addEventListener("keyup", keyup);
  host.addEventListener("blur", clear, true);
  let dragging = null;
  const pointerdown = (event) => {
    if (event.button !== 0 || options().talking) return;
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
    session?.invalidateEnvironment();
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
  const update = (dt, now, paint = true) => {
    const settings = options(),
      reduced =
        settings.reduced ||
        matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = settings.talking?{x:0,z:0,run:false}:input(),
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
    const requested = movementVector(
        settings.talking?{x:0,z:0}:vector,
        cameraYaw,
        1 / 10,
        controls.run || keys.has("ShiftLeft") || keys.has("ShiftRight"),
      ),
      before = position;
    if(settings.talking)velocity={x:0,z:0};
    velocity = worldVelocity(velocity, {x:requested.x*10,z:requested.z*10}, dt);
    const delta = {x:velocity.x*dt,z:velocity.z*dt};
    position = moveWorldActor(initial.scene, position, delta);
    const speed =
      Math.hypot(position.x - before.x, position.z - before.z) /
      Math.max(0.001, dt);
    walkTime += dt;
    player.root.position.set(position.x, worldFloorHeight(initial.scene, position), position.z);
    if (speed > 0.05) {
      const target = Math.atan2(position.x - before.x, position.z - before.z),
        difference = Math.atan2(
          Math.sin(target - player.root.rotation.y),
          Math.cos(target - player.root.rotation.y),
        );
      player.root.rotation.y += difference * (1-Math.exp(-dt/.085));
    }
    player.animate(walkTime, speed, reduced);
    const openStoreDoor=Math.hypot(position.x,6-position.z)<3.8;
    for(const door of slidingDoors) {
      const target=door.userData.hoshiDoorSide*(openStoreDoor?1.86:.62);
      door.position.x+=(target-door.position.x)*(reduced?1:1-Math.exp(-dt*8));
    }
    const distance = Math.hypot(
      position.x - companionPosition.x,
      position.z - companionPosition.z,
    );
    const desiredFollow=Math.min(distance>4?5.5:3.7,Math.max(0,(distance-1.15)*2.6));
    followSpeed+=(desiredFollow-followSpeed)*(1-Math.exp(-dt/.18));
    if (distance > 1.15) {
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
          step = Math.min(length, Math.max(0,distance-1.1), dt * followSpeed);
        companionPosition = moveWorldActor(initial.scene, companionPosition, {
          x: (dx / Math.max(0.001, length)) * step,
          z: (dz / Math.max(0.001, length)) * step,
        });
        if (length < 0.3) path.shift();
        const targetAngle = Math.atan2(dx, dz),
          turn = Math.atan2(
            Math.sin(targetAngle - companion.rotation.y),
            Math.cos(targetAngle - companion.rotation.y),
          );
        companion.rotation.y += turn * (1-Math.exp(-dt/.13));
      }
    }
    companion.position.set(
      companionPosition.x,
      worldFloorHeight(initial.scene, companionPosition),
      companionPosition.z,
    );
    const previousCompanion =
      animal.root.userData.previousPosition || companionPosition;
    const companionSpeed =
      Math.hypot(
        companionPosition.x - previousCompanion.x,
        companionPosition.z - previousCompanion.z,
      ) / Math.max(0.001, dt);
    animal.root.userData.previousPosition = { ...companionPosition };
    const celebrating=!reduced&&(settings.celebrateUntil||0)>Date.now();
    joyWeight+=((celebrating?1:0)-joyWeight)*(1-Math.exp(-dt/.16));
    if(reduced)joyWeight=0;
    companion.position.y+=Math.sin(walkTime*7)**2*.1*joyWeight;
    companion.rotation.z=Math.sin(walkTime*7)*.04*joyWeight;
    animal.animate(
      walkTime,
      companionSpeed,
      reduced,
      Math.atan2(
        position.x - companionPosition.x,
        position.z - companionPosition.z,
      ) - companion.rotation.y,
    );
    for(const pedestrian of pedestrians)pedestrian.update(dt,walkTime,reduced,[position,companionPosition]);
    for (const [npcIndex,npc] of npcs.entries()) {
      if(settings.talking&&Math.hypot(npc.root.position.x-settings.talking.x,npc.root.position.z-settings.talking.z)<.1){
        const target=Math.atan2(position.x-npc.root.position.x,position.z-npc.root.position.z);
        const delta=Math.atan2(Math.sin(target-npc.root.rotation.y),Math.cos(target-npc.root.rotation.y));
        npc.root.rotation.y+=delta*(reduced?1:1-Math.exp(-dt*8));
      }
      npc.animate(walkTime+npcIndex*2.3,0,reduced);
    }
    const turn=Math.atan2(Math.sin(yaw-cameraYaw),Math.cos(yaw-cameraYaw));
    cameraYaw+=turn*(reduced?1:1-Math.exp(-dt/.07));
    cameraPitch+=(pitch-cameraPitch)*(reduced?1:1-Math.exp(-dt/.07));
    const hour =
        settings.time === "night"
          ? 22
          : settings.time === "day"
            ? 15
            : new Date().getHours(),
      night = hour < 6 || hour >= 19;
    const sky = indoor ? 0xb4b4ab : night ? 0x172638 : 0xc6d7e0;
    scene.background.set(sky);
    scene.fog.color.set(sky);
    scene.environmentIntensity = night && !indoor ? 0.15 : indoor ? (convenienceStore ? .65 : .4) : .7;
    hemisphere.intensity = night && !indoor ? 0.95 : indoor ? (convenienceStore ? 1.9 : 1.35) : 1.55;
    sun.intensity = night && !indoor ? 0.25 : indoor ? (convenienceStore ? 1.1 : 1.6) : 3.1;
    sun.color.set(night && !indoor ? 0xb9cfff : 0xffefce);
    renderer.toneMappingExposure =
      night && !indoor ? 1.2 : indoor ? 1.05 : 0.94;
    if (lightingKey !== String(night)) {
      lightingKey = String(night);
      setTokyoNight(nightMaterials,night);
      sun.shadow.needsUpdate = true;
      lamps.forEach((lamp) => {
        lamp.intensity = night ? (lamp.userData.worldLampIntensity ?? 65) : 0;
        lamp.distance = lamp.userData.worldLampDistance ?? 19;
      });
      dayShadows.forEach((shadow) => (shadow.visible = !night));
    }
    updateTokyoNeon(nightMaterials,walkTime,night,reduced);
    const nearestLamps = night
      ? [...lamps]
          .sort(
            (a, b) =>
              Math.hypot(a.userData.worldLampPosition.x - position.x, a.userData.worldLampPosition.z - position.z) -
              Math.hypot(b.userData.worldLampPosition.x - position.x, b.userData.worldLampPosition.z - position.z),
          )
          .slice(0, 3)
      : [];
    lamps.forEach((lamp) => (lamp.visible = nearestLamps.includes(lamp)));
    const destination = worldDestinationPoint(settings.destination);
    marker.visible = beacon.visible = !indoor && !!destination;
    if (destination) {
      marker.position.set(destination.x, 0.11, destination.z);
      beacon.position.set(
        destination.x,
        2.8 + (reduced ? 0 : Math.sin(walkTime * 2) * 0.12),
        destination.z,
      );
    }
    cameraTarget.set(position.x, 1.25, position.z);
    const distanceCamera = indoor ? 5.8 : 4.6;
    desiredCamera.set(
      position.x + Math.sin(cameraYaw) * distanceCamera,
      1.25 + Math.sin(cameraPitch) * distanceCamera,
      position.z + Math.cos(cameraYaw) * distanceCamera,
    );
    // Detailed rooms have a ceiling. Keep the boom inside even at maximum tilt.
    if (indoor) desiredCamera.y = Math.min(3.35, desiredCamera.y);
    // Shorten the camera boom before it crosses a wall, then keep it in the walkable volume.
    const ground = { x: desiredCamera.x, z: desiredCamera.z };
    for (let fraction = 1; fraction >= 0; fraction -= 0.08) {
      ground.x = position.x + (desiredCamera.x - position.x) * fraction;
      ground.z = position.z + (desiredCamera.z - position.z) * fraction;
      if (clearWorldCameraSegment(initial.scene, position, ground, 0.18)) {
        desiredCamera.x = ground.x;
        desiredCamera.z = ground.z;
        break;
      }
    }
    const talking=settings.talking;
    if(talking){
      const npcPoint={x:talking.x,z:talking.z};
      const dx=position.x-npcPoint.x,dz=position.z-npcPoint.z,length=Math.max(.01,Math.hypot(dx,dz));
      cameraTarget.set(npcPoint.x,worldFloorHeight(initial.scene,npcPoint)+(camera.aspect>1.5?1.85:1.3),npcPoint.z);
      // Stay on the learner's side of the counter and inside the room.
      const candidate={x:position.x+dx/length*.35,z:position.z+dz/length*.35};
      const safe=clearWorldCameraSegment(initial.scene,position,candidate,.18)?candidate:position;
      desiredCamera.set(safe.x,worldFloorHeight(initial.scene,position)+1.65,safe.z);
      player.root.visible=false;marker.visible=beacon.visible=false;
    }else player.root.visible=true;
    host.dataset.conversationCamera=String(!!talking);
    if(!reduced&&draws>0){
      const candidate=camera.position.clone().lerp(desiredCamera,1-Math.exp(-dt/(talking ? .1 : .055)));
      // Damping must never drag the boom through a wall after a sharp turn.
      if(clearWorldCameraSegment(initial.scene,position,candidate,.18))camera.position.copy(candidate);
      else camera.position.copy(desiredCamera);
    }else camera.position.copy(desiredCamera);
    camera.lookAt(cameraTarget);
    if(!paint)return;
    const started = performance.now();
    renderer.render(scene, camera);
    renderMs = performance.now() - started;
    triangles = renderer.info.render.triangles;
    draws++;
    frameCount++;
    if (now - frameStart >= 1000) {
      fps = (frameCount * 1000) / (now - frameStart);
      slowSamples = fps < 22 ? slowSamples + 1 : 0;
      if (settings.quality === "auto" && slowSamples >= 2) {
        const nextRatio = reducedWorldPixelRatio(renderer.getPixelRatio(), fps);
        if (nextRatio !== renderer.getPixelRatio()) {
          renderer.setPixelRatio(nextRatio);
          renderer.setSize(
            Math.max(1, host.clientWidth),
            Math.max(1, host.clientHeight),
            false,
          );
        }
        slowSamples = 0;
      }
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
    const interval = options().quality === "low" ? 1000 / 30 : 1000 / 60;
    if (now - lastPaint >= interval-.4) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const elapsed=now-lastPaint;
      lastPaint = elapsed<interval?now:now-(elapsed%interval);
      update(dt, now);
    }
    frame = requestAnimationFrame(tick);
  };
  const instance = {
    setActive(value) {
      if (disposed || contextLost || active === value) return;
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
    captureFrame(){
      if(disposed||contextLost)return null;
      try{
        renderer.render(scene,camera);
        const preview=document.createElement('canvas'),scale=Math.min(1,1600/canvas.width,1000/canvas.height);
        preview.width=Math.max(1,Math.round(canvas.width*scale));preview.height=Math.max(1,Math.round(canvas.height*scale));
        preview.className='cw-transition-frame';preview.setAttribute('aria-hidden','true');
        const context=preview.getContext('2d');if(!context)return null;
        context.drawImage(canvas,0,0,preview.width,preview.height);return preview;
      }catch{return null;}
    },
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
      reflection?.dispose();
      skyTexture?.dispose();
      sun.shadow.dispose();
      people.dispose();
      meshes.dispose();
      scene.clear();
      marker.geometry.dispose();
      marker.material.dispose();
      beacon.geometry.dispose();
      beacon.material.dispose();
      if(!session){renderer.dispose();renderer.forceContextLoss();canvas.remove();}
      host.dataset.active = "false";
    },
  };
  try {
    if(session&&(indoor||session.people.warmReady)&&!signal.aborted){
      // Cached rigs normally resolve immediately; offline art never holds a door.
      let timer;await Promise.race([people.ready,new Promise(resolve=>{timer=setTimeout(resolve,700);})]);clearTimeout(timer);
    }
    if(signal.aborted){instance.dispose();return null;}
    update(0,performance.now(),false);
    // Three compiles hidden meshes too. Exclude hidden fallback bodies from
    // preparation without removing their recoverable geometry or changing the
    // material registry. Restore synchronously before any async work can run.
    const hidden=[];
    scene.traverse(object=>{
      if(!object.isMesh||!object.material)return;
      let visible=true;for(let parent=object;parent;parent=parent.parent)if(!parent.visible){visible=false;break;}
      if(!visible){hidden.push([object,object.material]);object.material=null;}
    });
    let prepared;
    try{prepared=renderer.compileAsync(scene,camera);}finally{for(const [object,material]of hidden)object.material=material;}
    await prepared;
    if(signal.aborted){instance.dispose();return null;}
    update(0,performance.now());host.dataset.mountMs=String(performance.now()-mountStarted);
    return instance;
  } catch(error){instance.dispose();throw error;}
}
