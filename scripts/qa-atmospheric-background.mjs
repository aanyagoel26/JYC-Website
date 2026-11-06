import fs from 'node:fs';
import assert from 'node:assert/strict';

const css = fs.readFileSync('src/jyc-innovation-motion.css', 'utf8');
const motion = fs.readFileSync('src/jyc-innovation-motion.jsx', 'utf8');
const home = fs.readFileSync('src/styles/jyc-editorial-motion-system.css', 'utf8');
const checks = [
  ['ambient canvas stays fixed, non-interactive and viewport-sized', /position:fixed;inset:0;z-index:-1/.test(css) && /pointer-events:none/.test(css) && /width:100vw;height:100vh/.test(css)],
  ['daylight background remains visible through the homepage shell', /html\[data-theme="light"\] \.public-app \.jyc-editorial-home\.jyc-home\s*\{[\s\S]*?background:[\s\S]*?transparent !important/.test(css)],
  ['night sky keeps five explicit animated background positions', /0% \{ background-position:[^}]*45% 40%, 0 0; \}/.test(css) && /100% \{ background-position:[^}]*55% 60%, 0 0; \}/.test(css)],
  ['dark and light palettes remain explicitly separated', /html\[data-theme="dark"\] \.app-frame/.test(css) && /html\[data-theme="light"\] \.app-frame/.test(css)],
  ['mobile background animation is slower and particle opacity is reduced', /@media \(max-width: 760px\)[\s\S]*?animation-duration: 48s/.test(css) && /html\[data-theme="dark"\] \.jyc-ambient-canvas \{ opacity: \.28; \}/.test(css)],
  ['reduced-motion disables both CSS drift and canvas animation', /prefers-reduced-motion: reduce[\s\S]*?\.app-frame \{ animation: none !important; \}/.test(css) && /prefers-reduced-motion:reduce[\s\S]*?\.jyc-ambient-canvas\{display:none!important\}/.test(css) && motion.includes("'(prefers-reduced-motion: reduce)'")],
  ['low-power devices retain the static CSS atmosphere', motion.includes('if (lowPower) { canvas.style.display = \'none\'; return; }')],
  ['animation pauses when the tab is hidden and resumes when visible', motion.includes("document.addEventListener('visibilitychange', onVisibilityChange)") && motion.includes('if (!isHidden && !reducedMotion && !animId) animId = requestAnimationFrame(loop)')],
  ['animation frame and all listeners are cleaned up on unmount', motion.includes('cancelAnimationFrame(animId)') && motion.includes("window.removeEventListener('resize', resize)") && motion.includes("window.removeEventListener('mousemove', onMouseMove)") && motion.includes("document.removeEventListener('visibilitychange', onVisibilityChange)")],
  ['particle rendering is frame-limited and pointer tracking is disabled on touch', motion.includes('const targetFrameMs = isCoarsePointer ? 50 : 1000 / 30') && motion.includes('if (!isCoarsePointer) window.addEventListener(\'mousemove\', onMouseMove')],
  ['homepage retains its theme-aware editorial color system', home.includes('var(--jh-bg,var(--jyc-paper))') && home.includes('var(--jh-ink,var(--jyc-ink))')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log((ok ? 'PASS' : 'FAIL') + ': ' + name);
  if (!ok) failed++;
}
assert.equal(failed, 0, 'Atmospheric background QA failed ' + failed + ' of ' + checks.length + ' checks');
console.log('Atmospheric background QA passed (' + checks.length + ' checks)');
