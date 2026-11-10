/**
 * JYC audio compatibility shim.
 * The public experience is intentionally silent: no ambient drone, hover chime,
 * theme-switch whoosh, AudioContext or user-facing audio toggle.
 * Keep no-op methods for legacy imports while old bundles are retired.
 */
export const jycAudio = Object.freeze({
  isMuted: true,
  init() {},
  startAmbient() {},
  stopAmbient() {},
  toggle() { return false; },
  playNodeHover() {},
  playThemeWhoosh() {}
});
