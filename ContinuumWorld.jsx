import React, { useCallback, useEffect, useRef, useState } from "react";
import { t } from "./interface-runtime.mjs";
import { isAppHidden } from "./native-platform.mjs";
import {
  restoreWorldState,
  worldScenes,
  worldLocations,
  worldStorageKey,
  worldInteraction,
} from "./continuum-world-model.mjs";
import { createWorldAmbience } from "./continuum-world-audio.mjs";
import "./continuum-world.css";

function WorldStick({ input, onFocus }) {
  const [offset, setOffset] = useState({ x: 0, z: 0 }),
    pointer = useRef(null);
  const update = (event) => {
    const box = event.currentTarget.getBoundingClientRect(),
      x = (event.clientX - box.left - box.width / 2) / 36,
      z = (event.clientY - box.top - box.height / 2) / 36,
      length = Math.max(1, Math.hypot(x, z));
    const value = { x: x / length, z: z / length };
    input.current = { ...input.current, ...value };
    setOffset(value);
  };
  const stop = () => {
    pointer.current = null;
    input.current = { ...input.current, x: 0, z: 0 };
    setOffset({ x: 0, z: 0 });
  };
  return (
    <div
      className="cw-stick"
      role="group"
      aria-label={t("Move")}
      onPointerDown={(event) => {
        event.preventDefault();
        pointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        onFocus();
        update(event);
      }}
      onPointerMove={(event) => {
        if (pointer.current === event.pointerId) update(event);
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
    >
      <span
        style={{
          transform: `translate(${offset.x * 32}px, ${offset.z * 32}px)`,
        }}
      />
    </div>
  );
}
function WorldMinimap({ snapshot }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!snapshot || !ref.current) return;
    const ctx = ref.current.getContext("2d"),
      bounds = worldScenes[snapshot.scene].bounds,
      w = 144,
      h = 144;
    const px = (x) => ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * w,
      pz = (z) => ((z - bounds.minZ) / (bounds.maxZ - bounds.minZ)) * h;
    ctx.fillStyle = "#ede1ca";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#7f9691";
    for (const o of worldScenes[snapshot.scene].obstacles)
      ctx.fillRect(
        px(o.x - o.width / 2),
        pz(o.z - o.depth / 2),
        (o.width / (bounds.maxX - bounds.minX)) * w,
        (o.depth / (bounds.maxZ - bounds.minZ)) * h,
      );
    if (snapshot.scene === "outdoors")
      for (const location of worldLocations) {
        ctx.fillStyle =
          location.id === snapshot.destination ? "#bd5b39" : "#36675b";
        ctx.beginPath();
        ctx.arc(px(location.door.x), pz(location.door.z), 4, 0, Math.PI * 2);
        ctx.fill();
      }
    ctx.fillStyle = "#c26c28";
    ctx.beginPath();
    ctx.arc(
      px(snapshot.position.x),
      pz(snapshot.position.z),
      5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  }, [snapshot]);
  return (
    <canvas
      ref={ref}
      width={144}
      height={144}
      className="cw-minimap"
      role="img"
      aria-label={t("World minimap")}
    />
  );
}
export default function ContinuumWorld({ user, onBack }) {
  const storageKey = worldStorageKey(user.id),
    initial = useRef(null);
  if (!initial.current) {
    try {
      initial.current = restoreWorldState(
        JSON.parse(localStorage.getItem(storageKey)),
      );
    } catch {
      initial.current = restoreWorldState();
    }
  }
  const [settings, setSettings] = useState(initial.current),
    [snapshot, setSnapshot] = useState(initial.current),
    [panel, setPanel] = useState(""),
    [list, setList] = useState(false),
    [retry, setRetry] = useState(0),
    [ready, setReady] = useState(false),
    [failure, setFailure] = useState(""),
    [storageFailed, setStorageFailed] = useState(false),
    [dialogue, setDialogue] = useState(null),
    [kind, setKind] = useState("capybara"),
    [destination, setDestination] = useState("tokyo_cafe"),
    [running, setRunning] = useState(false);
  const host = useRef(null),
    engine = useRef(null),
    last = useRef(initial.current),
    pendingTransition = useRef(null),
    input = useRef({ x: 0, z: 0, run: false }),
    options = useRef(settings),
    ambience = useRef(null),
    focused = useRef(document.hasFocus()),
    panelRef = useRef(null),
    returnFocus = useRef(null);
  options.current = { ...settings, destination, talking: !!dialogue };
  input.current.run = running;
  const save = useCallback(() => {
    const current =
      pendingTransition.current || engine.current?.getState() || last.current;
    last.current = current;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(restoreWorldState({ ...options.current, ...current })),
      );
      return true;
    } catch {
      return false;
    }
  }, [storageKey]);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/adventure?language=ja", {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((value) => {
        if (value?.companion) setKind(value.companion);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [user.id]);
  useEffect(() => {
    ambience.current = createWorldAmbience();
    return () => {
      ambience.current?.dispose();
      ambience.current = null;
    };
  }, []);
  const paused = !!panel || !!dialogue || list;
  useEffect(() => {
    const sync = () => {
      const active = !isAppHidden() && !paused && focused.current;
      input.current = { x: 0, z: 0, run: false };
      engine.current?.setActive(active);
      ambience.current?.setActive(active);
      if (isAppHidden() && !save()) setStorageFailed(true);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("continuum-native-visibility", sync);
    const blur = () => {
      focused.current = false;
      input.current = { x: 0, z: 0, run: false };
      engine.current?.setActive(false);
      ambience.current?.setActive(false);
      if (!save()) setStorageFailed(true);
    };
    const focus = () => {
      focused.current = true;
      sync();
    };
    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);
    return () => {
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("continuum-native-visibility", sync);
    };
  }, [paused, ready, save]);
  useEffect(() => {
    let live = true;
    const controller = new AbortController();
    setReady(false);
    setFailure("");
    if (list) return () => controller.abort();
    const element = host.current,
      start = pendingTransition.current || last.current;
    pendingTransition.current = null;
    import("./continuum-world-engine.mjs")
      .then(async (module) => {
        if (!live) return;
        const instance = await module.createWorldEngine(element, {
          initial: restoreWorldState({ ...options.current, ...start }),
          kind,
          input: () => input.current,
          options: () => options.current,
          signal: controller.signal,
          onSnapshot: (value) => {
            if (live) {
              last.current = value;
              setSnapshot(value);
            }
          },
          onFailure: (reason) => {
            if (live) {
              if (reason === "restore") setRetry((n) => n + 1);
              else setFailure(reason);
            }
          },
        });
        if (!live) {
          instance?.dispose();
          return;
        }
        engine.current = instance;
        setReady(true);
        instance?.setActive(!isAppHidden() && !paused && focused.current);
      })
      .catch(() => {
        if (live) setFailure("renderer");
      });
    return () => {
      live = false;
      controller.abort();
      save();
      engine.current?.dispose();
      engine.current = null;
    };
  }, [settings.scene, retry, kind, list, save]);
  useEffect(() => {
    engine.current?.refresh();
    ambience.current?.setEnabled(settings.sound, settings.volume);
    if (!save()) setStorageFailed(true);
  }, [settings, save]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAppHidden() && !save()) setStorageFailed(true);
    }, 5000);
    return () => clearInterval(timer);
  }, [save]);
  useEffect(() => {
    if (!panel && !dialogue) {
      returnFocus.current?.focus({ preventScroll: true });
      return;
    }
    returnFocus.current = document.activeElement;
    panelRef.current?.querySelector("button,input,select")?.focus();
  }, [panel, dialogue]);
  const transition = (scene, position) => {
    save();
    pendingTransition.current = { scene, position: { ...position }, yaw: 0 };
    last.current = pendingTransition.current;
    setSnapshot({ ...last.current });
    setSettings((previous) => ({ ...previous, scene, position, yaw: 0 }));
    setRetry((value) => value + 1);
    setDialogue(null);
    setPanel("");
  };
  const interaction = worldInteraction(snapshot.scene, snapshot.position);
  const act = () => {
    if (!interaction) return;
    if (interaction.type === "enter")
      transition(interaction.location.id, {
        ...worldScenes[interaction.location.id].spawn,
      });
    else if (interaction.type === "exit")
      transition("outdoors", {
        ...worldLocations.find((location) => location.id === snapshot.scene)
          .door,
        z: -3.6,
      });
    else setDialogue(interaction.location.npc);
  };
  const update = (key, value) =>
    setSettings((previous) => ({ ...previous, [key]: value }));
  const label =
    snapshot.scene === "outdoors"
      ? "Outdoors"
      : worldLocations.find((location) => location.id === snapshot.scene)
          ?.title;
  const close = () => {
    setPanel("");
    setDialogue(null);
  };
  const keyboard = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (panel || dialogue) close();
      else setPanel("settings");
    }
    if (
      event.key.toLowerCase() === "e" &&
      !paused &&
      event.target === host.current
    ) {
      event.preventDefault();
      act();
    }
    if (event.key === "Tab" && (panel || dialogue)) {
      const controls = [
          ...panelRef.current.querySelectorAll("button,input,select"),
        ].filter((element) => !element.disabled),
        first = controls[0],
        end = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        end.focus();
      } else if (!event.shiftKey && document.activeElement === end) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  return (
    <section
      className="cw-world"
      aria-label={t("Continuum World")}
      onKeyDown={keyboard}
      data-scene={snapshot.scene}
      data-list={list}
    >
      <header className="cw-header">
        <button
          type="button"
          onClick={() => {
            save();
            onBack();
          }}
        >
          {t("Back to Practice Studio")}
        </button>
        <div>
          <h1>{t("Continuum World")}</h1>
          <span>
            {t("Tokyo exploration beta")} · {t(label)}
          </span>
        </div>
        <button type="button" onClick={() => setPanel("settings")}>
          {t("World settings")}
        </button>
      </header>
      <div className="cw-stage">
        {!list && (
          <div
            ref={host}
            className="cw-renderer"
            tabIndex={0}
            role="application"
            aria-label={t("Tokyo 3D exploration")}
            aria-describedby="cw-controls"
          />
        )}
        {!list && !ready && !failure && (
          <p className="cw-loading" role="status">
            {t("Loading Tokyo…")}
          </p>
        )}
        {failure && (
          <div className="cw-failure" role="status">
            <p>
              {t(
                failure === "companion"
                  ? "Your companion could not load. Retry 3D to bring them back."
                  : "3D is unavailable. Explore using the places list.",
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                save();
                setRetry((n) => n + 1);
              }}
            >
              {t("Retry 3D")}
            </button>
            <button
              type="button"
              onClick={() => {
                save();
                setList(true);
              }}
            >
              {t("List view")}
            </button>
          </div>
        )}
        {list ? (
          <div className="cw-place-list">
            <h2>{t("Places")}</h2>
            {worldLocations.map((location) => (
              <article key={location.id}>
                <h3>{t(location.title)}</h3>
                <span lang="ja">{location.sign}</span>
                <button
                  type="button"
                  onClick={() =>
                    transition(
                      location.interior ? location.id : "outdoors",
                      location.interior
                        ? worldScenes[location.id].spawn
                        : { x: location.npc.x, z: location.npc.z + 1.5 },
                    )
                  }
                >
                  {t(location.interior ? "Enter" : "Talk")}
                </button>
                {snapshot.scene ===
                  (location.interior ? location.id : "outdoors") && (
                  <button
                    type="button"
                    onClick={() => setDialogue(location.npc)}
                  >
                    {t("Talk")} · <span lang="ja">{location.npc.name}</span>
                  </button>
                )}
              </article>
            ))}
            {snapshot.scene !== "outdoors" && (
              <button
                type="button"
                onClick={() =>
                  transition("outdoors", worldScenes.outdoors.spawn)
                }
              >
                {t("Leave")}
              </button>
            )}
          </div>
        ) : (
          <>
            <aside className="cw-navigation">
              <WorldMinimap snapshot={{ ...snapshot, destination }} />
              <label>
                {t("Destination")}
                <select
                  aria-label={t("Destination")}
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                >
                  {worldLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {t(location.title)}
                    </option>
                  ))}
                </select>
              </label>
            </aside>
            <div className="cw-actions">
              <WorldStick
                input={input}
                onFocus={() => host.current?.focus({ preventScroll: true })}
              />
              <div>
                <button
                  type="button"
                  aria-pressed={running}
                  onClick={() => setRunning((value) => !value)}
                >
                  {t(running ? "Run" : "Walk")}
                </button>
                <button
                  type="button"
                  className="cw-interact"
                  disabled={!interaction || !ready || paused}
                  onClick={act}
                >
                  {t(
                    interaction?.type === "enter"
                      ? "Enter"
                      : interaction?.type === "exit"
                        ? "Leave"
                        : "Talk",
                  )}
                </button>
              </div>
            </div>
          </>
        )}
        <div className="cw-view-actions">
          <button
            type="button"
            onClick={() => {
              save();
              setList((value) => !value);
            }}
          >
            {t(list ? "3D view" : "List view")}
          </button>
          <button
            type="button"
            onClick={() =>
              transition(snapshot.scene, worldScenes[snapshot.scene].spawn)
            }
          >
            {t("Safe return")}
          </button>
        </div>
      </div>
      <footer className="cw-footer">
        <p id="cw-controls">
          {t(
            matchMedia("(pointer: coarse)").matches
              ? "Use the stick to move. Drag the scene to look around."
              : "Use WASD or arrow keys to move. Hold Shift to run. Drag to look.",
          )}
        </p>
        <span role="status">
          {t(
            storageFailed
              ? "Device storage is unavailable. Your position may reset."
              : "Exploration is saved on this device.",
          )}
        </span>
      </footer>
      {(panel || dialogue) && (
        <div className="cw-dialog-backdrop">
          <section
            ref={panelRef}
            className="cw-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={dialogue ? dialogue.name : t("World settings")}
          >
            <button type="button" className="cw-close" onClick={close}>
              {t("Close")}
            </button>
            {dialogue ? (
              <>
                <h2 lang="ja">
                  {dialogue.name} · {dialogue.role}
                </h2>
                <p className="cw-dialogue" lang="ja">
                  {dialogue.line}
                </p>
                <p>
                  {t(
                    "Prototype dialogue. Free conversation and NPC memory arrive in Phase 2.",
                  )}
                </p>
                <button type="button" onClick={close}>
                  {t("Continue exploring")}
                </button>
              </>
            ) : (
              <>
                <h2>{t("World settings")}</h2>
                <label>
                  {t("Graphics")}
                  <select
                    aria-label={t("Graphics")}
                    value={settings.quality}
                    onChange={(event) => update("quality", event.target.value)}
                  >
                    {[
                      ["auto", "Auto"],
                      ["low", "Low"],
                      ["medium", "Medium"],
                      ["high", "High"],
                    ].map(([value, title]) => (
                      <option key={value} value={value}>
                        {t(title)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t("Time of day")}
                  <select
                    aria-label={t("Time of day")}
                    value={settings.time}
                    onChange={(event) => update("time", event.target.value)}
                  >
                    {[
                      ["auto", "Auto"],
                      ["day", "Day"],
                      ["night", "Night"],
                    ].map(([value, title]) => (
                      <option key={value} value={value}>
                        {t(title)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.sound}
                    onChange={(event) => {
                      const value = event.target.checked;
                      ambience.current?.setEnabled(value, settings.volume);
                      update("sound", value);
                    }}
                  />
                  {t("Ambient sound")}
                </label>
                <label>
                  {t("Volume")}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    value={settings.volume}
                    onChange={(event) =>
                      update("volume", Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.reduced}
                    onChange={(event) =>
                      update("reduced", event.target.checked)
                    }
                  />
                  {t("Reduce motion")}
                </label>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
