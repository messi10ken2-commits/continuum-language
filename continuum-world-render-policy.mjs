// Explicit upper bounds keep city detail independent from screen density.
export function worldRenderProfile(quality = "auto", width = 390, dpr = 1) {
  const mobile = width < 700,
    low = quality === "low",
    high = quality === "high";
  return {
    id: low
      ? "low"
      : high
        ? "high"
        : quality === "medium"
          ? "medium"
          : mobile
            ? "auto-mobile"
            : "auto-desktop",
    pixelRatio: low
      ? 0.75
      : high
        ? Math.min(Math.max(1, dpr), 1.75)
        : quality === "medium"
          ? Math.min(Math.max(1, dpr), 1.25)
          : Math.min(Math.max(1, dpr), mobile ? 1 : 1.25),
    shadowSize: low ? 0 : high ? 2048 : quality === "medium" ? 1024 : 0,
  };
}

export function reducedWorldPixelRatio(current, fps) {
  return Number.isFinite(fps) && fps > 0 && fps < 22
    ? Math.max(0.6, Math.round((current - 0.15) * 100) / 100)
    : current;
}
