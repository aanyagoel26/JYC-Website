import fs from 'node:fs';
import assert from 'node:assert/strict';

const atmosphere = fs.readFileSync('src/styles/jyc-atmosphere.css', 'utf8');
const motion = fs.readFileSync('src/jyc-innovation-motion.jsx', 'utf8');
const webgl = fs.readFileSync('src/components/JYCWebGLField.jsx', 'utf8');
const home = fs.readFileSync('src/styles/jyc-editorial-motion-system.css', 'utf8');
const grain = fs.readFileSync('public/assets/jyc-grain.svg', 'utf8');
const checks = [
  ['sitewide atmosphere is CSS-based, fixed, decorative and non-interactive', atmosphere.includes('body::before') && atmosphere.includes('body::after') && atmosphere.includes('pointer-events: none') && atmosphere.includes('position: fixed')],
  ['night mode keeps layered stars, nebula and Milky Way dust-rift depth', atmosphere.includes('html[data-theme="dark"] body::after') && atmosphere.includes('jyc-star-drift') && atmosphere.includes('linear-gradient(153deg') && atmosphere.includes('rgba(2,5,17,.72)')],
  ['day mode uses separate champagne, parchment and lavender atmosphere layers', atmosphere.includes('html[data-theme="light"] body::after') && atmosphere.includes('rgba(239,205,144,.22)') && atmosphere.includes('rgba(171,151,207,.13)')],
  ['both themes retain separate palette tokens and glass surfaces', atmosphere.includes('html[data-theme="dark"]') && atmosphere.includes('html[data-theme="light"]') && atmosphere.includes('backdrop-filter: blur(22px)')],
  ['background motion uses transform-only drift and respects reduced motion', atmosphere.includes('transform: translate3d(-1.5%, -1%, 0) scale(1)') && atmosphere.includes('@media (prefers-reduced-motion: reduce)') && atmosphere.includes('body::before, body::after { animation: none !important; }')],
  ['duplicate full-screen 2D ambient canvas has been removed in favour of CSS atmosphere', !motion.includes('useAtmosphericCanvas') && !motion.includes('<canvas') && motion.includes('return null;') && motion.includes('setupReveal')],
  ['homepage keeps one progressive-enhancement OGL field for the 3D hero', webgl.includes("from 'ogl'") && webgl.includes('new Renderer') && webgl.includes('new Program') && webgl.includes('new Mesh')],
  ['OGL field pauses offscreen and falls back on low-power or constrained devices', webgl.includes('IntersectionObserver') && webgl.includes('if (lowPower || coarse)') && webgl.includes("dataset.performance === 'lite'") && webgl.includes('webglcontextlost')],
  ['OGL rendering is frame-limited with capped device pixel ratio', webgl.includes('reducedQuality ? 1000 / 20 : 1000 / 24') && webgl.includes('reducedQuality || coarse ? 1.0 : 1.2')],
  ['reduced motion keeps the hero field static and CSS content readable', webgl.includes("'(prefers-reduced-motion: reduce)'") && webgl.includes('if (reduced) stop()') && atmosphere.includes('@media (prefers-reduced-motion: reduce)')],
  ['reveal observer remains available without a second animated canvas', motion.includes('function setupReveal()') && motion.includes('IntersectionObserver') && motion.includes('MutationObserver')],
  ['paper and night surfaces retain a reusable static grain texture', grain.includes('feTurbulence') && atmosphere.includes('background-image')],
  ['homepage retains canonical theme-aware editorial color variables', home.includes('var(--jh-bg,var(--jyc-paper))') && home.includes('var(--jh-ink,var(--jyc-ink))')]
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log((ok ? 'PASS' : 'FAIL') + ': ' + name);
  if (!ok) failed++;
}
assert.equal(failed, 0, 'Atmospheric background QA failed ' + failed + ' of ' + checks.length + ' checks');
console.log('Atmospheric background QA passed (' + checks.length + ' checks)');
