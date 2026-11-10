import fs from 'node:fs';
import assert from 'node:assert/strict';

const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const css = fs.readFileSync('src/jyc-editorial-home.css', 'utf8');
const cohesive = fs.readFileSync('src/styles/jyc-cohesive-experience.css', 'utf8');

assert.match(home, /Find your people\.[\s\S]*?Make your mark\./i, 'homepage headline must have a clear student benefit');
assert.match(home, /Find a club to build with, an event to show up for, and a community that makes JIIT feel like yours/i, 'homepage lead must explain JYC in plain language');
assert.doesNotMatch(home, /new Date\(['"]2026-11-15T09:00:00/, 'homepage must not hard-code an unverified countdown date');
assert.doesNotMatch(home, /jh-flagship-countdown-strip|jh-countdown-timer/, 'homepage must not present an unverified flagship countdown');
assert.doesNotMatch(home, /5,000<i>\+<\/i>|50<i>\+<\/i>|15<i>\+<\/i>/, 'homepage must not publish unverified reach, event or legacy counters');
assert.doesNotMatch(home, /jh-ambient-backdrop|jh-ambient-orb/, 'homepage must not use generic ambient cyber decoration');
assert.ok(home.includes('<LazyDitherVeil') && home.includes('rimColor="#b99b70"') && home.includes('inkColor="#4b3e69"') && home.includes('paperColor="#f6f2e9"'), 'Dither Veil must use the JYC champagne and editorial paper palette');
assert.ok(home.includes('wander={false}'), 'Dither Veil retains pointer-driven reveal; its internal renderer also hard-disables wander when reduced motion is requested');
assert.ok(fs.readFileSync('src/react-bits/DitherVeil.jsx','utf8').includes("!reducedMotion"), 'Dither Veil disables autonomous motion for reduced-motion users');
assert.match(css, /--jh-bg:\s*#F5F1E6/i, 'homepage background token must use the editorial paper palette');
assert.ok(cohesive.includes('--jh-accent: #c8bcff') && cohesive.includes('--jh-gold:') && cohesive.includes('--jh-bg: #080d1c'), 'homepage night theme must use midnight, lavender and gold');
assert.ok(cohesive.includes('--jh-accent: #625889') && cohesive.includes('--jh-bg: #f5f1e8'), 'homepage day theme must use warm paper and indigo accents');
assert.ok(cohesive.includes('@media (max-width: 360px)') && cohesive.includes('grid-template-columns:1fr !important'), 'homepage phone layout must have a narrow-phone single-column fallback');
assert.match(css, /prefers-reduced-motion:\s*reduce/, 'homepage motion must respect reduced-motion preferences');

console.log('JYC homepage editorial-truth contract: PASS');
