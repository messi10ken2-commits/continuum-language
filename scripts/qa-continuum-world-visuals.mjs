import { build, preview } from "vite";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import assert from "node:assert/strict";
const dir = new URL("../.media-build/continuum-world-art/", import.meta.url);
await mkdir(dir, { recursive: true });
await writeFile(
  new URL("index.html", dir),
  '<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body,#world{margin:0;width:100%;height:100%;overflow:hidden}canvas{display:block;width:100%;height:100%}</style><div id="world" tabindex="0"></div><script type="module" src="./entry.mjs"></script></html>',
);
await writeFile(
  new URL("entry.mjs", dir),
  `
import {createWorldEngine} from '../../continuum-world-engine.mjs';
import {restoreWorldState,worldScenes} from '../../continuum-world-model.mjs';
let engine,controller;window.worldInput={x:0,z:0,run:false};
window.mountWorld=async({scene='outdoors',kind='capybara',quality='auto',time='day',position,yaw=0}={})=>{
controller?.abort();engine?.dispose();controller=new AbortController();window.worldInput={x:0,z:0,run:false};
const settings={...restoreWorldState(),scene,quality,time,reduced:false,sound:false};
engine=await createWorldEngine(document.getElementById('world'),{capture:true,initial:{...settings,position:position||worldScenes[scene].spawn,yaw},kind,input:()=>window.worldInput,options:()=>settings,signal:controller.signal,onSnapshot:s=>window.worldSnapshot=s,onFailure:r=>window.worldFailure=r});
engine.setActive(true);window.worldEngine=engine;return true;};
`,
);
await build({
  configFile: false,
  build: {
    outDir: ".media-build/continuum-world-art/dist",
    rollupOptions: { input: new URL("index.html", dir).pathname },
  },
});
const server = await preview({
  configFile: false,
  build: { outDir: ".media-build/continuum-world-art/dist" },
  preview: { host: "127.0.0.1", port: 0 },
});
let browser;
const results = [];
try {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.QA_BROWSER_EXECUTABLE,
    args: [
      "--no-sandbox",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const base =
    "http://127.0.0.1:" +
    server.httpServer.address().port +
    "/.media-build/continuum-world-art/index.html";
  const widths = (process.env.QA_WORLD_VISUAL_WIDTHS || "1280,390")
    .split(",")
    .map(Number);
  const onlyShots = (process.env.QA_WORLD_VISUAL_SHOTS || "")
    .split(",")
    .filter(Boolean);
  for (const width of widths) {
    const page = await browser.newPage({
        viewport: { width, height: width === 390 ? 844 : 800 },
      }),
      errors = [];
    page.on("pageerror", (e) => {
      errors.push(e.message);
      console.error(e.message);
    });
    page.on("console", (message) => {
      if (
        /WebGL.*INVALID|texSubImage.*(?:error|invalid)|GL_INVALID|OUT_OF_MEMORY|THREE.WebGLProgram/i.test(
          message.text(),
        )
      )
        errors.push(message.text());
    });
    console.log("Opening", width);
    await page.goto(base);
    await page.waitForFunction(() => window.mountWorld);
    for (const [shot, settings] of [
      ["street-day", { position: { x: -8, z: 19 }, time: "day" }],
      ...(width === 1280
        ? [["street-materials", { quality: "medium", time: "day", position: {x:-16,z:0}, yaw:.18 }]]
        : []),
      ...(width === 1280 ? [
        ["walking",{position:{x:-8,z:19},time:"day",motion:"walk"}],
        ["running",{position:{x:-8,z:19},time:"day",motion:"run"}],
      ] : []),
      ["station-day", {position:{x:0,z:-10},yaw:0,time:"day"}],
      ["station-platform", {position:{x:17,z:-33},yaw:1.1,time:"day"}],
      ["station-night", {position:{x:6,z:-15},yaw:.08,time:"night"}],
      ["street-night", { position: { x: -8, z: 19 }, time: "night" }],
      ["block-day", {quality:"auto", position:{x:-16,z:0}, yaw:.18, time:"day"}],
      ["block-night", {quality:"auto", position:{x:17,z:0}, yaw:-.15, time:"night"}],
      ["cafe", { scene: "tokyo_cafe", position: { x: 0, z: 2 }, time: "day" }],
      ["market", { scene: "tokyo_konbini", time: "day" }],
    ]) {
      if (onlyShots.length && !onlyShots.includes(shot)) continue;
      const started = performance.now();
      console.log("Mounting", shot);
      await page.evaluate((settings) => window.mountWorld(settings), {
        quality: width === 390 ? "low" : "auto",
        ...settings,
      });
      await page.waitForFunction(() => window.worldSnapshot?.draws > 10, null, {
        timeout: 90000,
      });
      await page.waitForFunction(
        () => document.getElementById("world").dataset.materialsPending === "0",
      );
      assert.ok(
        Number(
          await page.locator("#world").getAttribute("data-photo-surfaces"),
        ) >= (settings.scene ? 1 : 3),
        "bundled photo textures load",
      );
      await page.waitForFunction(
        () =>
          Number(document.getElementById("world").dataset.peopleLoaded) ===
          Number(document.getElementById("world").dataset.peopleTotal),
        null,
        { timeout: 90000 },
      );
      const readyFrame = await page
        .locator("#world")
        .getAttribute("data-world-frames");
      await page.waitForFunction(
        (n) =>
          Number(document.getElementById("world").dataset.worldFrames) >=
          Number(n) + 3,
        readyFrame,
        { timeout: 90000 },
      );
      if(settings.motion) {
        await page.evaluate(run=>{window.worldInput={x:0,z:-1,run};},settings.motion==='run');
        await page.waitForFunction(z=>JSON.parse(document.getElementById('world').dataset.position).z<z-1.3,settings.position.z,{timeout:30000});
      }
      assert.ok(!(await page.evaluate(() => window.worldFailure)));
      const data = await page
        .locator("#world")
        .evaluate((e) => ({ ...e.dataset }));
      const companionScreen = JSON.parse(data.companionScreen);
      assert.ok(
        Math.abs(companionScreen.x) < 0.85 && companionScreen.y > -0.95,
        "full-body companion remains inside the initial portrait/landscape composition",
      );
      await page.evaluate(() => window.worldEngine.setActive(false));
      const png = Buffer.from(
        (
          await page.locator("canvas").evaluate((c) => c.toDataURL("image/png"))
        ).split(",")[1],
        "base64",
      );
      await writeFile(new URL(width + "-" + shot + ".png", dir), png);
      const visiblePixels = await page.evaluate(async (base64) => {
        const img = new Image();
        img.src = "data:image/png;base64," + base64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = c.height = 32;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, 32, 32);
        const data = ctx.getImageData(0, 0, 32, 32).data,
          colors = new Set();
        for (let i = 0; i < data.length; i += 4)
          colors.add(data[i] + ":" + data[i + 1] + ":" + data[i + 2]);
        return colors.size;
      }, png.toString("base64"));
      assert.ok(
        visiblePixels > 32,
        "captured scene must contain rendered detail, not a blank buffer",
      );
      results.push({
        width,
        shot,
        loadMs: performance.now() - started,
        ...data,
      });
      console.log("PASS", width, shot, JSON.stringify(data));
      await page.evaluate(() => {
        window.worldEngine.setActive(false);
        window.worldSnapshot = null;
      });
    }
    await page.route("**/world-tokyo/people/*.glb*", (route) =>
      route.fulfill({ status: 503, body: "Synthetic model outage" }),
    );
    await page.evaluate(() => window.mountWorld({ quality: "low" }));
    await page.waitForFunction(
      () => Number(document.getElementById("world").dataset.worldFrames) > 3,
    );
    assert.equal(
      await page.locator("#world").getAttribute("data-people-loaded"),
      "0",
    );
    assert.equal(
      await page.locator("#world").getAttribute("data-active"),
      "true",
    );
    console.log("PASS model outage retains playable fallback", width);
    assert.deepEqual(errors, []);
    await page.close();
  }
  await writeFile(
    new URL("results.json", dir),
    JSON.stringify(results, null, 2),
  );
} finally {
  await browser?.close();
  await new Promise((r) => server.httpServer.close(r));
}
