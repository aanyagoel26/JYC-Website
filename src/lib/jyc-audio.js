// Audio is intentionally disabled across JYC. Keep this inert compatibility export
// so any older lazy chunk or downstream integration cannot create sound effects.
class SilentJYCAudio {
  constructor() { this.isMuted = true; }
  init() {}
  startAmbient() {}
  stopAmbient() {}
  toggle() { return false; }
  playNodeHover() {}
  playThemeWhoosh() {}
}
export const jycAudio = new SilentJYCAudio();
