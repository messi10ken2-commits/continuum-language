import test from "node:test";
import assert from "node:assert/strict";
import { createWorldAmbience, prepareWorldAudio } from "./continuum-world-audio.mjs";

function audioFixture() {
  const contexts = [];
  class Context {
    constructor() {
      contexts.push(this);
      this.state = "suspended";
      this.sampleRate = 8;
      this.currentTime = 0;
      this.destination = {};
      this.stops = 0;
      this.gains=[];
      this.closed = 0;
    }
    createGain() {
      const node={
        gain: {
          value: 0,
          setTargetAtTime: (value) => {
            node.level = value;
          },
        },
        connect() {},
        disconnect() {},
      };this.gains.push(node);return node;
    }
    createBuffer(_, length) {
      return { getChannelData: () => new Float32Array(length) };
    }
    createBiquadFilter() {
      return { frequency: { value: 0 }, connect() {}, disconnect() {} };
    }
    createBufferSource() {
      return {
        connect() {},
        disconnect() {},
        start() {},
        stop: () => {
          this.stops++;
        },
      };
    }
    async resume() {
      this.state = "running";
    }
    async suspend() {
      this.state = "suspended";
    }
    async close() {
      this.state = "closed";
      this.closed++;
    }
  }
  return { Context, contexts };
}
async function withAudio(Audio, run) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "AudioContext"),
    webkit = Object.getOwnPropertyDescriptor(globalThis, "webkitAudioContext");
  Object.defineProperty(globalThis, "AudioContext", {
    value: Audio,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "webkitAudioContext", {
    value: undefined,
    configurable: true,
    writable: true,
  });
  try {
    await run();
  } finally {
    if (previous) Object.defineProperty(globalThis, "AudioContext", previous);
    else delete globalThis.AudioContext;
    if (webkit) Object.defineProperty(globalThis, "webkitAudioContext", webkit);
    else delete globalThis.webkitAudioContext;
  }
}
test("ambient sound is opt-in, honours volume and suspends while hidden or disabled", async () => {
  const { Context, contexts } = audioFixture();
  await withAudio(Context, async () => {
    const sound = createWorldAmbience();
    sound.setEnabled(false);
    assert.equal(contexts.length, 0);
    sound.setEnabled(true, 0.5);
    await Promise.resolve();
    assert.equal(contexts.length, 1);
    assert.equal(contexts[0].state, "running");
    assert.equal(contexts[0].gains[0].level, 0.04);
    sound.setActive(false);
    await Promise.resolve();
    assert.equal(contexts[0].state, "suspended");
    assert.equal(contexts[0].gains[0].level, 0);
    sound.setActive(true);
    await Promise.resolve();
    assert.equal(contexts[0].state, "running");
    sound.setEnabled(false);
    await new Promise(r=>setTimeout(r,300));
    assert.equal(contexts[0].state, "suspended");
    sound.dispose();
  });
});
test("disposing during a pending resume stops the source once and cannot restart audio", async () => {
  const { Context, contexts } = audioFixture();
  await withAudio(Context, async () => {
    const sound = createWorldAmbience();
    sound.setEnabled(true);
    sound.dispose();
    sound.dispose();
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(contexts[0].state, "closed");
    assert.equal(contexts[0].stops, 1);
    assert.equal(contexts[0].closed, 1);
    assert.equal(sound.setEnabled(true), false);
    sound.setActive(true);
    assert.equal(contexts.length, 1);
  });
});
test("unsupported audio does not allocate resources or prevent exploration", async () => {
  await withAudio(undefined, async () => {
    const sound = createWorldAmbience();
    assert.equal(sound.setEnabled(true), false);
    sound.setActive(false);
    sound.dispose();
  });
});

test('music is quiet, ducks for NPC interaction, pauses when hidden and resumes without duplicate players',async()=>{
 const {Context,contexts}=audioFixture();let starts=0,disposed=0;const activities=[];
 await withAudio(Context,async()=>{
  const sound=createWorldAmbience({musicFactory:()=>{starts++;return {setActive:v=>activities.push(v),dispose:()=>disposed++};}});
  sound.setMusicEnabled(true,.2);await Promise.resolve();assert.equal(contexts.length,1);assert.equal(starts,1);
  assert.equal(contexts[0].gains[1].level,.1);
  sound.setDucked(true);assert.ok(Math.abs(contexts[0].gains[1].level-.01)<.000001);
  sound.setActive(false);await Promise.resolve();assert.equal(contexts[0].state,'suspended');assert.equal(activities.at(-1),false);
  sound.setActive(true);sound.setDucked(false);await Promise.resolve();assert.equal(contexts[0].state,'running');assert.equal(starts,1);
  sound.setMusicEnabled(true,.5);assert.equal(contexts[0].gains[1].level,.25);assert.equal(starts,1);
  sound.setMusicEnabled(false);await new Promise(r=>setTimeout(r,300));assert.equal(contexts[0].state,'suspended');
  sound.dispose();sound.dispose();assert.equal(disposed,1);assert.equal(contexts[0].closed,1);
 });
});
test('the trusted World opening gesture primes one reusable context and respects a saved music mute',async()=>{
 const {Context,contexts}=audioFixture(),old=globalThis.localStorage;
 try{await withAudio(Context,async()=>{
  globalThis.localStorage={getItem:()=>JSON.stringify({music:false,sound:false})};assert.equal(prepareWorldAudio('world'),false);assert.equal(contexts.length,0);
  globalThis.localStorage={getItem:()=>null};assert.equal(prepareWorldAudio('world'),true);assert.equal(contexts.length,1);
  const sound=createWorldAmbience({musicFactory:()=>({setActive(){},dispose(){}})});sound.setMusicEnabled(true);assert.equal(contexts.length,1);
  sound.dispose();assert.equal(contexts[0].closed,1);
 });}finally{globalThis.localStorage=old;}
});
