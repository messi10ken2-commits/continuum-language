import test from "node:test";
import assert from "node:assert/strict";
import { createWorldAmbience } from "./continuum-world-audio.mjs";

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
      this.closed = 0;
    }
    createGain() {
      return {
        gain: {
          value: 0,
          setTargetAtTime: (value) => {
            this.level = value;
          },
        },
        connect() {},
        disconnect() {},
      };
    }
    createBuffer(_, length) {
      return { getChannelData: () => new Float32Array(length) };
    }
    createBiquadFilter() {
      return { frequency: { value: 0 }, connect() {} };
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
    assert.equal(contexts[0].level, 0.04);
    sound.setActive(false);
    await Promise.resolve();
    assert.equal(contexts[0].state, "suspended");
    assert.equal(contexts[0].level, 0);
    sound.setActive(true);
    await Promise.resolve();
    assert.equal(contexts[0].state, "running");
    sound.setEnabled(false);
    await Promise.resolve();
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
