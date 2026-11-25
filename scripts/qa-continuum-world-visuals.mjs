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
controller?.abort();engine?.dispose();controller=new AbortController();
const settings={...restoreWorldState(),scene,quality,time,reduced:false,sound:false};
engine=await createWorldEngine(document.getElementById('world'),{initial:{...settings,position:position||worldScenes[scene].spawn,yaw},kind,input:()=>window.worldInput,options:()=>settings,signal:controller.signal,onSnapshot:s=>window.worldSnapshot=s,onFailure:r=>window.worldFailure=r});
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
  for (const width of [1280, 390]) {
    const page = await browser.newPage({
        viewport: { width, height: width === 390 ? 844 : 800 },
      }),
      errors = [];
    page.on("pageerror", (e) => {
      errors.push(e.message);
      console.error(e.message);
    });
    console.log("Opening", width);
    await page.goto(base);
    await page.waitForFunction(() => window.mountWorld);
    for (const [shot, settings] of [
      ["street-day", { position: { x: -8, z: 19 }, time: "day" }],
      ...(width === 1280
        ? [["street-materials", { quality: "medium", time: "day" }]]
        : []),
      ["street-night", { position: { x: -8, z: 19 }, time: "night" }],
      ["cafe", { scene: "tokyo_cafe", position: { x: 0, z: 2 }, time: "day" }],
      ["market", { scene: "tokyo_konbini", time: "day" }],
    ]) {
      const started = performance.now();
      console.log("Mounting", shot);
      await page.evaluate((settings) => window.mountWorld(settings), {
        quality: width === 390 ? "low" : "auto",
        ...settings,
      });
      await page.waitForFunction(() => window.worldSnapshot?.draws > 10, null, {
        timeout: 90000,
      });
      assert.ok(!(await page.evaluate(() => window.worldFailure)));
      await page.screenshot({
        path: new URL(width + "-" + shot + ".png", dir).pathname,
      });
      const data = await page
        .locator("#world")
        .evaluate((e) => ({ ...e.dataset }));
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
