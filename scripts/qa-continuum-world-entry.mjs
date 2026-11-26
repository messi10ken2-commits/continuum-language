// Full application entry, real API and a disposable database. Build with the beta ON first.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
process.env.NODE_ENV = "development";
delete process.env.OPENAI_API_KEY;
delete process.env.GEMINI_API_KEY;
const { testServer, db } = await import("../test-server.mjs");
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const origin = "http://127.0.0.1:" + testServer.address().port;
async function api(path, method, body, cookie) {
  const response = await fetch(origin + "/api" + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  assert.ok(
    response.ok,
    JSON.stringify({ path, status: response.status, data }),
  );
  return { data, cookie: response.headers.get("set-cookie")?.split(";")[0] };
}
let browser;
try {
  await mkdir(".media-build/continuum-world", { recursive: true });
  const registered = await api("/auth/register", "POST", {
    name: "World Entry QA",
    email: "world-entry@example.test",
    password: "synthetic-world-entry-password",
    role: "learner",
    adult: true,
  });
  const user = registered.data.user;
  for (const path of [
    ...["pavement_04", "asphalt_02", "wood_planks"].map(
      (name) => "/world-tokyo/materials/" + name + ".jpg",
    ),
    "/world-tokyo/people/traveller.glb",
    "/world-tokyo/people/resident.glb",
  ]) {
    const native = await fetch(origin + path, {
      method: "HEAD",
      headers: { Origin: "capacitor://localhost" },
    });
    assert.equal(native.status, 200);
    assert.equal(
      native.headers.get("access-control-allow-origin"),
      "capacitor://localhost",
    );
    assert.equal(native.headers.get("access-control-allow-credentials"), null);
    assert.match(native.headers.get("vary"), /Origin/);
    const foreign = await fetch(origin + path, {
      method: "HEAD",
      headers: { Origin: "https://untrusted.example" },
    });
    assert.equal(foreign.headers.get("access-control-allow-origin"), null);
  }
  const manifest = await fetch(
    origin + "/world-tokyo/materials/manifest.json",
    { method: "HEAD", headers: { Origin: "capacitor://localhost" } },
  );
  assert.equal(
    manifest.headers.get("access-control-allow-origin"),
    null,
    "native CORS exception is limited to the five named public art files",
  );
  await api(
    "/profile",
    "PUT",
    {
      profile: {
        name: user.name,
        languages: ["ja", "en"],
        primaryLanguage: "ja",
        level: "A1",
        startMode: "manual",
        goal: "Synthetic world entry QA",
      },
    },
    registered.cookie,
  );
  const before = (
    await db.query(
      "SELECT count(*)::int AS count FROM practice_attempts WHERE user_id=$1",
      [user.id],
    )
  ).rows[0].count;
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.QA_BROWSER_EXECUTABLE,
    args: [
      "--no-sandbox",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 },
  });
  await context.addCookies([
    {
      name: "continuum_session",
      value: registered.cookie.split("=")[1],
      url: origin,
    },
  ]);
  await context.addInitScript((id) => {
    localStorage.setItem("continuumInterfaceLanguage", "en");
    localStorage.setItem("continuumLanguage", "ja");
    localStorage.setItem("continuumJourneyLayout:" + id, "illustrated");
  }, user.id);
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(origin);
  await page.locator(".app>aside nav").waitFor();
  await page
    .locator(".app>aside nav button")
    .filter({ hasText: /^Practice Studio$/ })
    .click();
  await page
    .getByRole("button", { name: "Continuum World", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelector(".cw-renderer")?.dataset.active === "true",
  );
  const box = await page.locator(".cw-world").boundingBox();
  assert.ok(
    Math.abs(box.x) < 1 &&
      Math.abs(box.y) < 1 &&
      Math.abs(box.width - 1280) < 1 &&
      Math.abs(box.height - 850) < 1,
    "full app wrappers must not clip the World",
  );
  assert.equal(
    await page.locator(".app>aside").evaluate((element) => !!element.closest("[inert]")),
    true,
  );
  await page.waitForFunction(
    () => document.querySelector(".cw-renderer")?.dataset.companion === "bird",
  );
  await page.waitForFunction(
    () => {
      const d = document.querySelector(".cw-renderer")?.dataset;
      return Number(d?.peopleLoaded) > 0 && d.peopleLoaded === d.peopleTotal;
    },
    null,
    { timeout: 90000 },
  );
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await page.screenshot({
    path: ".media-build/continuum-world/full-app-entry.png",
  });
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await page
    .locator(".cw-place-list article")
    .filter({
      has: page.getByRole("heading", { name: "Hoshi Market", exact: true }),
    })
    .getByRole("button", { name: "Enter", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Back to Practice Studio", exact: true })
    .click();
  await page.locator(".studio-menu").waitFor();
  assert.equal(
    await page.locator(".app>aside").evaluate((element) => !!element.closest("[inert]")),
    false,
  );
  await page
    .getByRole("combobox", { name: "World style", exact: true })
    .first()
    .selectOption("photo");
  assert.equal(
    await page
      .getByRole("button", { name: "Continuum World", exact: true })
      .count(),
    0,
  );
  const after = (
    await db.query(
      "SELECT count(*)::int AS count FROM practice_attempts WHERE user_id=$1",
      [user.id],
    )
  ).rows[0].count;
  assert.equal(
    after,
    before,
    "exploration must not fabricate lesson completions",
  );
  assert.deepEqual(errors, []);
  await context.close();
  console.log(
    "PASS full app: real learner/profile, free access, normal Practice entry, selected companion, fullscreen bounds, facilities, exit, Photo restoration and unchanged course attempts",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => testServer.close(resolve));
  await db.close();
}

