import assert from "node:assert/strict";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { build, preview } from "vite";
import { chromium, webkit } from "playwright";
import { continuumWorldCopy } from "../continuum-world-copy.mjs";
const directory = new URL("../.media-build/continuum-world/", import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(
  new URL("entry.jsx", directory),
  `
import React,{useState,useEffect} from 'react';import {createRoot} from 'react-dom/client';
import PracticeStudio from '../../PracticeStudio.jsx';
import {JourneyLayoutContext} from '../../JourneyLayout.jsx';
import {setInterfaceLanguage} from '../../interface-runtime.mjs';
import '../../styles.css';import '../../features.css';import '../../journey.css';import '../../approved-illustrated.css';import '../../continuum-ui.css';
const params=new URLSearchParams(location.search),layout=params.get('layout')||'illustrated';
setInterfaceLanguage(params.get('locale')||'en');
const user={id:params.get('user')||'world-qa',role:params.get('role')||'learner'};
function Harness(){const [enabled,setEnabled]=useState(params.get('flag')!=='off');useEffect(()=>{const disable=()=>setEnabled(false);window.addEventListener('qa-world-disable',disable);return()=>window.removeEventListener('qa-world-disable',disable)},[]);return <JourneyLayoutContext.Provider value={{layout}}><div className={"app journey-app learner-journey continuum-ui"+(layout==="illustrated"?" illustrated-world approved-illustrated ui-illustrated":" ui-photo")}><aside><button>Outside world navigation</button></aside><main><div className="content" style={{transform:"translateZ(0)"}}><PracticeStudio user={user} language={params.get('language')||'ja'} features={{continuumWorldTokyoBeta:enabled?undefined:false}}/></div></main></div></JourneyLayoutContext.Provider>;}
createRoot(document.getElementById('root')).render(<Harness/>);
`,
);
await writeFile(
  new URL("entry.html", directory),
  '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="./entry.jsx"></script></body></html>',
);
await build({
  configFile: false,
  define: {
    "import.meta.env.VITE_CONTINUUM_WORLD_TOKYO_BETA": JSON.stringify("true"),
  },
  build: {
    outDir: ".media-build/continuum-world/dist",
    rollupOptions: { input: new URL("entry.html", directory).pathname },
  },
});
let companionUnavailable = false;
const apiFixture = {
  name: "world-same-origin-qa-api",
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url.startsWith("/api/")) return next();
      res.statusCode =
        companionUnavailable && req.url.includes("/api/adventure") ? 503 : 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store");
      res.end(
        JSON.stringify(
          req.url.includes("/billing")
            ? { membership: { premium: false } }
            : { companion: "capybara" },
        ),
      );
    });
  },
};
const server = await preview({
  plugins: [apiFixture],
  configFile: false,
  build: { outDir: ".media-build/continuum-world/dist" },
  preview: { host: "127.0.0.1", port: 0 },
});
let browser;
let activePage;
const results = [];
try {
  const base =
    "http://127.0.0.1:" +
    server.httpServer.address().port +
    "/.media-build/continuum-world/entry.html";
  for (const name of (process.env.QA_BROWSERS || "chromium,webkit").split(
    ",",
  )) {
    const engine = { chromium, webkit }[name];
    browser = await engine.launch({
      headless: true,
      ...(name === "chromium"
        ? {
            executablePath: process.env.QA_BROWSER_EXECUTABLE,
            args: [
              "--no-sandbox",
              "--use-angle=swiftshader",
              "--enable-unsafe-swiftshader",
            ],
          }
        : {}),
    });
    for (const width of [1280, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 850 },
        hasTouch: width === 390,
      });
      companionUnavailable = false;
      const page = await context.newPage();
      activePage = page;
      const capture = async (options) => {
        await page.evaluate(() => window.dispatchEvent(new Event("blur")));
        try {
          await page.screenshot(options);
        } finally {
          await page.evaluate(() => window.dispatchEvent(new Event("focus")));
        }
      };
      page.setDefaultTimeout(20000);
      page.setDefaultNavigationTimeout(30000);
      const errors = [],
        requests = [],
        writes = [];
      page.on("pageerror", (error) => {
        errors.push(error.message);
        console.error("World page error:", error.message);
      });
      page.on("request", (request) => {
        requests.push(request.url());
        if (request.method() !== "GET") writes.push(request.url());
      });
      const go = async (url) => {
        await page.waitForLoadState("networkidle");
        await page.goto(url);
        await page.waitForLoadState("networkidle");
      };
      for (const query of [
        "flag=off",
        "layout=photo",
        "language=en",
        "role=teacher",
      ]) {
        await go(base + "?" + query);
        await page.locator(".studio-menu").waitFor();
        assert.equal(
          await page
            .getByRole("button", { name: "Continuum World", exact: true })
            .count(),
          0,
          query,
        );
      }
      assert.ok(
        !requests.some((url) =>
          /continuum-world-engine|companions-3d/.test(url),
        ),
        "off-mode must not load 3D",
      );
      await go(base);
      const openedAt = performance.now();
      await page
        .getByRole("button", { name: "Continuum World", exact: true })
        .click();
      const checkHud = async () => {
        const measured = await page.evaluate(() => {
          const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
          const selectors = [".cw-world", ".cw-header", ".cw-stick", ".cw-action-panel", ".cw-interact", ".cw-navigation", ".cw-view-actions"];
          const boxes = selectors.map((selector) => ({selector, ...rect(selector).toJSON()}));
          const actions = rect(".cw-actions"), footer = rect(".cw-footer"), stick = rect(".cw-stick"), panel = rect(".cw-action-panel"), header = rect(".cw-header"), nav = rect(".cw-navigation");
          return {boxes, width: innerWidth, height: innerHeight, headerClear: nav.top >= header.bottom, controlGap: stick.right <= panel.left, footerClear: !footer.height || actions.bottom <= footer.top, portal: document.querySelector(".cw-world").parentElement === document.body};
        });
        assert.ok(measured.portal, "world escapes transformed app cards");
        for (const box of measured.boxes) {
          assert.ok(box.x >= -1 && box.y >= -1 && box.right <= measured.width + 1 && box.bottom <= measured.height + 1, "HUD remains within visible viewport: " + JSON.stringify(box));
        }
        assert.ok(measured.headerClear, "navigation stays below translated header");
        assert.ok(measured.controlGap, "joystick and action buttons do not overlap");
        assert.ok(measured.footerClear, "footer does not cover controls");
        for (const selector of [".cw-navigation label", ".cw-action-panel button"]) {
          assert.ok(await page.locator(selector).evaluateAll(elements => elements.every(e => e.scrollWidth <= e.clientWidth + 1)), selector + " text stays inside its control");
        }
        if (await page.locator(".cw-leave").count()) {
          assert.ok(await page.locator(".cw-leave").evaluate(element => {
            const range = document.createRange();
            range.selectNodeContents(element.lastChild);
            return range.getBoundingClientRect().height <= parseFloat(getComputedStyle(element).lineHeight) + 2;
          }), "Leave label stays readable on one line, including large text");
        }
        for (const selector of [".cw-stick", ".cw-interact", ".cw-leave"]) {
          if (!(await page.locator(selector).count())) continue;
          const hittable = await page.locator(selector).evaluate((element) => {
            const b = element.getBoundingClientRect();
            return element.contains(document.elementFromPoint(b.x+b.width/2, b.y+b.height/2));
          });
          assert.ok(hittable, selector + " is reachable without scrolling");
        }
      };
      const host = page.locator(".cw-renderer");
      await host.waitFor();
      assert.equal(
        await page.locator(".app>aside").evaluate((element) => !!element.closest("[inert]")),
        true,
        "background navigation is excluded from focus while exploring",
      );
      await page.waitForFunction(
        () =>
          document.querySelector(".cw-renderer")?.dataset.worldFrames ||
          document.querySelector(".cw-failure"),
      );
      const webgl =
        (await page.locator(".cw-canvas").count()) > 0 &&
        !(await page.locator(".cw-failure").count());
      if (name === "chromium")
        assert.ok(webgl, "Chromium must exercise the real 3D renderer");
      if (webgl) {
        await page.waitForFunction(
          () => {
            const data = document.querySelector(".cw-renderer")?.dataset;
            return (
              Number(data?.peopleLoaded) > 0 &&
              data.peopleLoaded === data.peopleTotal
            );
          },
          null,
          { timeout: 90000 },
        );
        await page.waitForFunction(
          () =>
            document.querySelector(".cw-renderer")?.dataset.companion ===
            "capybara",
        );
        await checkHud();
        const loadMs = performance.now() - openedAt;
        console.log("WebGL ready", name, width);
        await page
          .getByRole("button", { name: "World settings", exact: true })
          .click();
        // Exercise control/collision timing on the real Low renderer. The
        // separate art suite verifies Auto/Medium PBR rendering without timing
        // movement against a software GPU's shader/antialias throughput.
        await page.getByLabel("Graphics", {exact:true}).selectOption("low");
        await page
          .getByLabel("Time of day", { exact: true })
          .selectOption("day");
        await page.getByRole("button", { name: "Close", exact: true }).click();
        await page.waitForFunction(() => {
          const d=document.querySelector(".cw-renderer")?.dataset;
          return Number(d?.peopleLoaded)>0 && d.peopleLoaded===d.peopleTotal;
        }, null, {timeout:90000});
        // New skin/eye textures compile on their first real frame. Start the
        // timed input check after those frames, rather than timing shader setup.
        await page.waitForFunction(
          () =>
            Number(
              document.querySelector(".cw-renderer")?.dataset.worldFrames,
            ) >= 12,
          null,
          { timeout: 90000 },
        );
        await page.waitForTimeout(350);
        await capture({
          path: new URL(name + "-" + width + "-outdoors.png", directory)
            .pathname,
        });
        await host.focus();
        const before = JSON.parse(await host.getAttribute("data-position"));
        if (width === 390 && name === "chromium") {
          const session = await context.newCDPSession(page),
            stick = await page.locator(".cw-stick").boundingBox();
          const point = {
            x: stick.x + stick.width / 2,
            y: stick.y + stick.height / 2,
            id: 1,
          };
          await session.send("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [point],
          });
          await session.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ ...point, y: point.y - 32 }],
          });
          await page.evaluate(() => window.dispatchEvent(new Event("focus")));
          await page.waitForTimeout(600);
          await session.send("Input.dispatchTouchEvent", {
            type: "touchEnd",
            touchPoints: [],
          });
          await page.waitForTimeout(200);
          assert.ok(
            JSON.parse(await host.getAttribute("data-position")).z <
              before.z - 0.2,
            "real touch stick moves the player",
          );
          await session.detach();
          await host.focus();
        }
        await page.keyboard.down("KeyW");
        await page.evaluate(() => window.dispatchEvent(new Event("focus")));
        await page.waitForTimeout(900);
        await page.keyboard.up("KeyW");
        assert.equal(
          await host.getAttribute("data-held-keys"),
          "0",
          "key release is applied before the next rendered frame",
        );
        await page.waitForTimeout(220);
        const moved = JSON.parse(await host.getAttribute("data-position"));
        assert.ok(moved.z < before.z - 0.3);
        await page.waitForTimeout(250);
        assert.deepEqual(
          JSON.parse(await host.getAttribute("data-position")),
          moved,
          "key release stops movement",
        );
        const yaw = Number(await host.getAttribute("data-yaw")),
          box = await host.boundingBox();
        await page.mouse.move(
          box.x + box.width * 0.55,
          box.y + box.height * 0.5,
        );
        await page.mouse.down();
        await page.mouse.move(
          box.x + box.width * 0.55 + 70,
          box.y + box.height * 0.5 + 15,
          { steps: 5 },
        );
        await page.mouse.up();
        await page.waitForTimeout(220);
        assert.notEqual(Number(await host.getAttribute("data-yaw")), yaw);
        await page
          .getByRole("button", { name: "Safe return", exact: true })
          .click();
        await page.waitForFunction(
          () =>
            document.querySelector(".cw-renderer")?.dataset.active === "true",
        );
        const walkUntil = async (key, coordinate, value) => {
          await host.focus();
          await page.keyboard.down(key);
          try {
            await page.waitForFunction(
              ({ coordinate, value }) =>
                JSON.parse(
                  document.querySelector(".cw-renderer").dataset.position,
                )[coordinate] <= value,
              { coordinate, value },
              { timeout: 45000 },
            );
          } catch (error) {
            console.error(
              "Movement diagnostics",
              await host.evaluate((element) => ({ ...element.dataset })),
            );
            await capture({
              path: new URL(name + "-" + width + "-failure.png", directory)
                .pathname,
            });
            throw error;
          } finally {
            await page.keyboard.up(key);
          }
          await page.waitForTimeout(200);
        };
        // Walking/touch and key release were checked above. Run for the long traversal.
        await page.getByRole("button", {name:"Run", exact:true}).click();
        await walkUntil("KeyW", "z", -4.3);
        await walkUntil("KeyA", "x", -16.8);
        await host.focus();
        await page.keyboard.down("KeyW");
        await page.waitForTimeout(1600);
        await page.keyboard.up("KeyW");
        await page.waitForTimeout(200);
        assert.ok(
          JSON.parse(await host.getAttribute("data-position")).z >= -6.11,
          "building collision stops walking through its facade",
        );
        // A real keyboard traversal reaches the café entrance from the outdoor spawn.
        await page.getByRole("button", { name: "Enter", exact: true }).click();
        await page.waitForFunction(
          () =>
            document.querySelector(".cw-world")?.dataset.scene === "tokyo_cafe",
        );
        await page.waitForFunction(
          () =>
            document.querySelector(".cw-renderer")?.dataset.active === "true",
        );
        await walkUntil("KeyW", "z", -2);
        await page.getByRole("button", { name: "Talk", exact: true }).click();
        await page.getByRole("dialog").waitFor();
        assert.ok(
          (await page.locator(".cw-dialogue").innerText()).includes(
            "いらっしゃいませ",
          ),
        );
        const paused = await host.getAttribute("data-world-frames");
        await page.waitForTimeout(250);
        assert.equal(await host.getAttribute("data-world-frames"), paused);
        await page
          .getByRole("button", { name: "Continue exploring", exact: true })
          .click();
        const indoorBox = await host.boundingBox();
        await page.mouse.move(
          indoorBox.x + indoorBox.width * 0.5,
          indoorBox.y + indoorBox.height * 0.3,
        );
        await page.mouse.down();
        await page.mouse.move(
          indoorBox.x + indoorBox.width * 0.5,
          indoorBox.y + indoorBox.height * 0.75,
          { steps: 4 },
        );
        await page.mouse.up();
        await page.waitForFunction(
          () =>
            Number(document.querySelector(".cw-renderer")?.dataset.pitch) > 0.8,
        );
        assert.ok(
          Number(await host.getAttribute("data-camera-y")) < 3.5,
          "maximum camera tilt stays below the interior ceiling",
        );
        await page
          .getByRole("button", { name: "World settings", exact: true })
          .click();
        await page.getByLabel("Graphics", { exact: true }).selectOption("low");
        await page
          .getByLabel("Time of day", { exact: true })
          .selectOption("night");
        await page.getByLabel("Reduce motion", { exact: true }).check();
        await page.getByLabel("Ambient sound", { exact: true }).check();
        await page.getByLabel("Volume", { exact: true }).focus();
        await page.keyboard.press("Home");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");
        await page.getByRole("button", { name: "Close", exact: true }).click();
        await page.waitForTimeout(800);
        await capture({
          path: new URL(name + "-" + width + "-cafe.png", directory).pathname,
        });
        await page.evaluate(() => {
          document.documentElement.classList.add("native-inactive");
          window.dispatchEvent(new Event("continuum-native-visibility"));
        });
        const frames = await host.getAttribute("data-world-frames");
        await page.waitForTimeout(350);
        assert.equal(await host.getAttribute("data-world-frames"), frames);
        await page.evaluate(() => {
          document.documentElement.classList.remove("native-inactive");
          window.dispatchEvent(new Event("continuum-native-visibility"));
        });
        await page.waitForTimeout(350);
        assert.notEqual(await host.getAttribute("data-world-frames"), frames);
        await page.setViewportSize({
          width: width === 390 ? 844 : 1100,
          height: width === 390 ? 390 : 800,
        });
        await page.waitForTimeout(250);
        await checkHud();
        if (width === 390) {
          for (const viewport of [{width:390,height:640},{width:320,height:568}]) {
            await page.setViewportSize(viewport);
            await page.waitForTimeout(150);
            await checkHud();
          }
          await page.setViewportSize({width:390,height:844});
          await page.evaluate(() => document.documentElement.style.fontSize = "200%");
          await page.waitForTimeout(150);
          await checkHud();
          await capture({path: new URL(name + "-large-text-controls.png", directory).pathname});
          await page.evaluate(() => document.documentElement.style.fontSize = "");
        }
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await page.setViewportSize({
          width,
          height: width === 390 ? 844 : 850,
        });
        await page.waitForTimeout(1400);
        const metrics = await page.evaluate(() => {
          const data = document.querySelector(".cw-renderer").dataset;
          return {
            frames: Number(data.worldFrames),
            fps: Number(data.fps),
            renderMs: Number(data.renderMs),
            triangles: Number(data.triangles),
            heap: performance.memory?.usedJSHeapSize ?? null,
            agent: navigator.userAgent,
          };
        });
        results.push({ engine: name, width, webgl: true, loadMs, ...metrics });
        // Leave must work from the counter, without first walking to the door.
        await checkHud();
        await page.getByRole("button", { name: "Leave", exact: true }).click();
        await page.waitForFunction(
          () =>
            document.querySelector(".cw-world")?.dataset.scene === "outdoors",
        );
        await page.waitForFunction(
          () =>
            document.querySelector(".cw-renderer")?.dataset.active === "true",
        );
        await page.getByRole("button", {name:"List view",exact:true}).click();
        await page.locator(".cw-place-list article").filter({has:page.getByRole("heading",{name:"Hoshi Market",exact:true})}).getByRole("button",{name:"Enter",exact:true}).click();
        await page.getByRole("button", {name:"3D view",exact:true}).click();
        await page.waitForFunction(() => document.querySelector(".cw-renderer")?.dataset.active === "true");
        await walkUntil("KeyW", "z", -2);
        await checkHud();
        await page.getByRole("button",{name:"Talk",exact:true}).click();
        assert.ok((await page.locator(".cw-dialogue").innerText()).includes("お弁当"));
        await page.getByRole("button",{name:"Close",exact:true}).click();
        await page.getByRole("button",{name:"Leave",exact:true}).click();
        await page.waitForFunction(() => document.querySelector(".cw-world")?.dataset.scene === "outdoors" && document.querySelector(".cw-renderer")?.dataset.active === "true");
        await page.evaluate(() =>
          document
            .querySelector(".cw-canvas")
            .getContext("webgl2")
            .getExtension("WEBGL_lose_context")
            .loseContext(),
        );
        await page.locator(".cw-failure").waitFor();
        await page
          .getByRole("button", { name: "Retry 3D", exact: true })
          .click();
        await page.waitForFunction(
          () =>
            document.querySelector(".cw-renderer")?.dataset.active === "true",
        );
      } else results.push({ engine: name, width, webgl: false });
      await page
        .getByRole("button", { name: "List view", exact: true })
        .last()
        .click();
      for (const title of ["Komorebi Café", "Hoshi Market"]) {
        const place = page.locator(".cw-place-list article").filter({
          has: page.getByRole("heading", { name: title, exact: true }),
        });
        await place.getByRole("button", { name: "Enter", exact: true }).click();
        await place.getByRole("button", { name: /Talk/ }).click();
        await page.getByRole("dialog").waitFor();
        await page.getByRole("button", { name: "Close", exact: true }).click();
        await page.getByRole("button", { name: "Leave", exact: true }).click();
      }
      for (const title of ["Station information", "Sakura pocket park"]) {
        const place = page.locator(".cw-place-list article").filter({has: page.getByRole("heading", {name:title,exact:true})});
        await place.getByRole("button", {name:"Talk",exact:true}).click();
        await page.getByRole("dialog").waitFor();
        await page.getByRole("button", {name:"Close",exact:true}).click();
      }
      await capture({
        path: new URL(name + "-" + width + "-places.png", directory).pathname,
      });
      await page
        .getByRole("button", { name: "Back to Practice Studio", exact: true })
        .click();
      assert.equal(await page.locator(".cw-canvas").count(), 0);
      await page
        .getByRole("button", { name: "Continuum World", exact: true })
        .click();
      await page
        .getByRole("button", { name: "World settings", exact: true })
        .click();
      if (webgl) {
        assert.equal(
          await page.getByLabel("Graphics", { exact: true }).inputValue(),
          "low",
        );
        assert.equal(
          await page.getByLabel("Time of day", { exact: true }).inputValue(),
          "night",
        );
      }
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page
        .getByRole("button", { name: "Back to Practice Studio", exact: true })
        .click();
      for (const locale of ["ja", "ar"]) {
        await go(base + "?locale=" + locale);
        await page
          .getByRole("button", { name: "Continuum World", exact: true })
          .click();
        if (locale === "ar")
          assert.ok(
            (await page.locator(".cw-stick").boundingBox()).x < width / 2,
            "RTL interface must preserve the physical left movement stick",
          );
        await page
          .getByRole("button", {
            name: continuumWorldCopy["List view"][locale],
            exact: true,
          })
          .last()
          .click();
        await page
          .getByRole("heading", {
            name: continuumWorldCopy["Places"][locale],
            exact: true,
          })
          .waitFor();
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          locale + " overflow",
        );
        await capture({
          path: new URL(
            name + "-" + width + "-" + locale + "-places.png",
            directory,
          ).pathname,
        });
      }
      await go(base + "?user=another-world-learner");
      await page
        .getByRole("button", { name: "Continuum World", exact: true })
        .click();
      await page
        .getByRole("button", { name: "World settings", exact: true })
        .click();
      assert.equal(
        await page.getByLabel("Graphics", { exact: true }).inputValue(),
        "auto",
        "device saves must be isolated by account",
      );
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page.evaluate(() =>
        window.dispatchEvent(new Event("qa-world-disable")),
      );
      await page.locator(".studio-menu").waitFor();
      assert.equal(
        await page.locator(".app>aside").evaluate((element) => element.inert),
        false,
        "leaving the world restores existing navigation",
      );
      assert.equal(
        await page.locator(".cw-canvas").count(),
        0,
        "flag OFF disposes an open world",
      );
      assert.equal(
        await page
          .getByRole("button", { name: "Continuum World", exact: true })
          .count(),
        0,
      );
      companionUnavailable = true;
      await go(base + "?user=fallback-learner");
      await page
        .getByRole("button", { name: "Continuum World", exact: true })
        .click();
      if (webgl)
        await page.waitForFunction(
          () =>
            document.querySelector(".cw-renderer")?.dataset.companion ===
            "bird",
        );
      assert.ok(
        !writes.some((url) =>
          /\/api\/(world|speaking|speech|learning)(?:\/|$)/.test(url),
        ),
        "exploration must not invoke paid conversation or learning writes",
      );
      assert.deepEqual(errors, []);
      await context.close();
      console.log(
        "PASS",
        name,
        width,
        "world flag isolation, exploration, facilities, lifecycle and restoration",
      );
    }
    await browser.close();
    browser = null;
  }
  await writeFile(
    new URL("results.json", directory),
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} catch (error) {
  if (activePage && !activePage.isClosed()) {
    await activePage
      .screenshot({ path: new URL("last-failure.png", directory).pathname })
      .catch(() => {});
    console.error(
      "World failure state",
      await activePage
        .evaluate(() => ({
          renderer: { ...document.querySelector(".cw-renderer")?.dataset },
          viewport: [innerWidth, innerHeight],
          header: document
            .querySelector(".cw-header")
            ?.getBoundingClientRect()
            .toJSON(),
          inert: document.querySelector(".cw-header")?.closest("[inert]")
            ?.className,
        }))
        .catch(() => null),
    );
  }
  console.error(error);
  throw error;
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
  await rm(new URL("entry.jsx", directory), { force: true });
  await rm(new URL("entry.html", directory), { force: true });
}
