import fs from 'node:fs';
import assert from 'node:assert/strict';

const css = fs.readFileSync('src/jyc-innovation-motion.css', 'utf8');
const atmosphere = fs.readFileSync('src/styles/jyc-atmosphere.css', 'utf8');
const motion = fs.readFileSync('src/jyc-innovation-motion.jsx', 'utf8');
const home = fs.readFileSync('src/styles/jyc-editorial-motion-system.css', 'utf8');
const grain = fs.readFileSync('public/assets/jyc-grain.svg', 'utf8');
const checks = [
  ['ambient canvas stays fixed, non-interactive and viewport-sized', /position:fixed;inset:0;z-index:-1/.test(css) && /pointer-events:none/.test(css) && /width:100vw;height:100vh/.test(css)],
  ['daylight background remains visible through the homepage shell', /html\[data-theme="light"\] \.public-app \.jyc-editorial-home\.jyc-home\s*\{[\s\S]*?background:[\s\S]*?transparent !important/.test(css)],
  ['night sky keeps six explicit static background positions, including grain, while atmosphere motion stays compositor-friendly', css.includes('background-position: 0 0, 0% 0%, 100% 0%, 50% 100%, 45% 40%, 0 0;') && !css.includes('animation: jyc-atmosphere-drift') && atmosphere.includes('animation: jyc-atmosphere-drift') && atmosphere.includes('transform: translate3d(-1.5%, -1%, 0) scale(1)')],
  ['dark and light palettes remain explicitly separated', /html\[data-theme="dark"\] \.app-frame/.test(css) && /html\[data-theme="light"\] \.app-frame/.test(css)],
  ['mobile atmosphere motion is slower and ambient particle opacity is reduced', atmosphere.includes('--jyc-atmosphere-speed: 48s') && css.includes('.jyc-ambient-canvas { opacity: .24; }') && css.includes('html[data-theme="dark"] .jyc-ambient-canvas { opacity: .28; }')],
  ['reduced-motion disables both CSS atmosphere drift and canvas animation', css.includes('.app-frame { animation: none !important; }') && atmosphere.includes('body::before, body::after { animation: none !important; }') && css.includes('.jyc-ambient-canvas { display: none !important; }') && motion.includes("'(prefers-reduced-motion: reduce)'")],
  ['low-power devices retain the static CSS atmosphere', motion.includes('if (lowPower) { canvas.style.display = \'none\'; return; }')],
  ['animation pauses when the tab is hidden and resumes when visible', motion.includes("document.addEventListener('visibilitychange', onVisibilityChange)") && motion.includes('if (!isHidden && !reducedMotion && !userPaused && !animId) animId = requestAnimationFrame(loop)')],
  ['animation frame and all listeners are cleaned up on unmount', motion.includes('cancelAnimationFrame(animId)') && motion.includes("window.removeEventListener('resize', resize)") && motion.includes("window.removeEventListener('mousemove', onMouseMove)") && motion.includes("document.removeEventListener('visibilitychange', onVisibilityChange)")],
  ['particle rendering is frame-limited and pointer tracking is disabled on touch', motion.includes('const targetFrameMs = isCoarsePointer ? 80 : 1000 / 20') && motion.includes('if (!isCoarsePointer) window.addEventListener(\'mousemove\', onMouseMove')],
  ['homepage retains its theme-aware editorial color system', home.includes('var(--jh-bg,var(--jyc-paper))') && home.includes('var(--jh-ink,var(--jyc-ink))')],
  ['long document shell never animates background-position', !css.includes('animation: jyc-atmosphere-drift') && !css.includes('@keyframes jyc-atmosphere-drift')],
  ['paper and night surfaces use a small reusable static grain texture with theme-specific blending', grain.includes('feTurbulence') && css.includes("url('/assets/jyc-grain.svg')") && css.includes('background-blend-mode: soft-light') && css.includes('background-blend-mode: multiply')],
  ['mobile dark atmosphere retains the complete layered background sizing', css.includes('html[data-theme="dark"] .app-frame {') && css.includes('128px 128px, 180% 180%, 170% 170%, 180% 180%, 160% 160%, 100% 100%')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log((ok ? 'PASS' : 'FAIL') + ': ' + name);
  if (!ok) failed++;
}
assert.equal(failed, 0, 'Atmospheric background QA failed ' + failed + ' of ' + checks.length + ' checks');
console.log('Atmospheric background QA passed (' + checks.length + ' checks)');
