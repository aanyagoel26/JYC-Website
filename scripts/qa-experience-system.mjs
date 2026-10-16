import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = path => fs.readFileSync(path, 'utf8');
const main = read('src/main.jsx');
const css = read('src/styles/jyc-experience-system.css');
const motionCss = read('src/styles/jyc-editorial-motion-system.css');
const allCss = css + motionCss;
const home = read('src/jyc-editorial-home.jsx');
const extra = read('src/extra-features.jsx');

const checks = [
  ['sitewide experience stylesheet is imported after the canonical public entry', main.indexOf("import './styles/jyc-experience-system.css';") > main.indexOf("import './styles/public-entry.css';")],
  ['design tokens cover paper, ink, oxblood and champagne', ['--jyc-ex-paper:', '--jyc-ex-ink:', '--jyc-ex-oxblood:', '--jyc-ex-champagne:'].every(token => css.includes(token))],
  ['shared page typography and spacing rules exist', allCss.includes('text-wrap: balance') && allCss.includes('--page-gutter') && allCss.includes('letter-spacing: -.045em')],
  ['public interactive controls have visible focus styling', allCss.includes(':focus-visible') && allCss.includes('outline-offset: 3px')],
  ['cards use a shared surface language and fine-pointer motion', allCss.includes('.event-card') && allCss.includes('.club-card') && allCss.includes('pointer:fine') && allCss.includes('var(--jyc-ex-shadow-hover)')],
  ['mobile-specific page gutters and typography are defined, including narrow phones', allCss.includes('@media (max-width: 760px)') && allCss.includes('@media (max-width: 390px)') && allCss.includes('@media(max-width:380px)')],
  ['reduced-motion users receive non-animated card states', allCss.includes('prefers-reduced-motion: reduce') && allCss.includes('transition-duration: .01ms')],
  ['homepage keeps the React Bits Dither Veil hero implementation', home.includes("DitherVeil.jsx") && home.includes('LazyDitherVeil')],
  ['gallery retains interactive image experience and keyboard lightbox', extra.includes('export function GalleryItems') && extra.includes("e.key==='ArrowRight'") && extra.includes("e.key==='Escape'")],
  ['team page retains the flip-card interaction implementation', main.includes('LazyFlipCard') && main.includes('FlipCard.jsx')],
];

let failures = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`);
  if (!ok) failures += 1;
}
assert.equal(failures, 0, `JYC experience-system QA failed ${failures} of ${checks.length} checks`);
console.log(`JYC experience-system QA passed (${checks.length} checks)`);
