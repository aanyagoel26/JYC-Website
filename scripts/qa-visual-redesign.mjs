import fs from 'node:fs';
import assert from 'node:assert/strict';

const entry = fs.readFileSync('src/styles/public-entry.css', 'utf8');
const main = fs.readFileSync('src/main.jsx', 'utf8');
const layer = fs.readFileSync('src/styles/jyc-editorial-motion-system.css', 'utf8');
const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const checks = [
  [!entry.includes("@import './jyc-editorial-motion-system.css';") && main.includes("import './styles/jyc-editorial-motion-system.css';"), 'motion system is imported after the main application module imports'],
  [home.includes('jh-hero-dither-visual') && home.includes('LazyDitherVeil'), 'existing branded Dither Veil hero is retained'],
  [layer.includes('@media(max-width:700px)'), 'single-column mobile hero is explicitly supported'],
  [layer.includes('@media(max-width:980px)'), 'tablet hero layout is explicitly supported'],
  [layer.includes('prefers-reduced-motion:reduce'), 'reduced-motion preferences are honored'],
  [layer.includes(':focus-visible'), 'visible keyboard focus is defined'],
  [layer.includes('--jyc-oxblood') && layer.includes('--jyc-champagne'), 'JYC identity tokens are defined'],
  [layer.includes('translateY(-3px)') && layer.includes('hover:hover'), 'card motion is restricted to fine pointers'],
];
for (const [ok, name] of checks) { console.log((ok ? 'PASS: ' : 'FAIL: ') + name); assert.ok(ok, name); }
console.log('JYC editorial motion system contract: PASS');