// Original generated ambience. No microphone, recordings, tracking or media requests.
export function createWorldAmbience() {
  let context = null,
    gain = null,
    source = null,
    disposed = false,
    enabled = false,
    active = true,
    volume = 0.2;
  function sync() {
    if (!context) return;
    const current = context;
    gain.gain.setTargetAtTime(
      enabled && active ? volume * 0.08 : 0,
      context.currentTime,
      0.15,
    );
    if (enabled && active)
      context
        .resume()
        .then(() => {
          if (context === current && (!active || !enabled))
            void current.suspend().catch(() => {});
        })
        .catch(() => {});
    else void context.suspend().catch(() => {});
  }
  return {
    setEnabled(value, level = 0.2) {
      if (disposed) return false;
      enabled = value;
      volume = level;
      if (value && !context) {
        const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Audio) return false;
        context = new Audio();
        gain = context.createGain();
        gain.gain.value = 0;
        const buffer = context.createBuffer(
            1,
            context.sampleRate * 3,
            context.sampleRate,
          ),
          samples = buffer.getChannelData(0);
        let seed = 197;
        for (let i = 0; i < samples.length; i++) {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
          samples[i] = (seed / 4294967296 - 0.5) * 0.4;
        }
        const filter = context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 450;
        source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(context.destination);
        source.start();
      }
      sync();
      return true;
    },
    setActive(value) {
      if (disposed) return;
      active = value;
      sync();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      source?.stop();
      source?.disconnect();
      gain?.disconnect();
      if (context) void context.close().catch(() => {});
      context = null;
      source = null;
      gain = null;
    },
  };
}
