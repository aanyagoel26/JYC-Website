import fs from 'node:fs';
import assert from 'node:assert/strict';

const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const css = fs.readFileSync('src/jyc-editorial-home.css', 'utf8');
const cohesive = fs.readFileSync('src/styles/jyc-cohesive-experience.css', 'utf8');

assert.match(home, /Find your people\.[\s\S]*?Make your mark\./i, 'homepage headline must have a clear student benefit');
assert.match(home, /Clubs, events and student communities to help you find your place at JIIT/i, 'homepage lead must explain JYC in plain language');
assert.doesNotMatch(home, /new Date\(['"]2026-11-15T09:00:00/, 'homepage must not hard-code an unverified countdown date');
assert.doesNotMatch(home, /jh-flagship-countdown-strip|jh-countdown-timer/, 'homepage must not present an unverified flagship countdown');
assert.doesNotMatch(home, /5,000<i>\+<\/i>|50<i>\+<\/i>|15<i>\+<\/i>/, 'homepage must not publish unverified reach, event or legacy counters');
assert.doesNotMatch(home, /jh-ambient-backdrop|jh-ambient-orb/, 'homepage must not use generic ambient cyber decoration');
assert.ok(home.includes('<JYCHeroWebGLEmblem />') && home.includes('heroFieldReady') && home.includes('LazyJYCWebGLField'), 'homepage must use one official crest with a separately lazy-loaded OGL sky');
assert.ok(!home.includes('LazyDitherVeil') && !home.includes('jh-hero-dither-layer') && !home.includes('jh-hero-dither-static'), 'homepage must not stack a duplicate Dither crest over the official emblem');
const emblem = fs.readFileSync('src/components/JYCHeroWebGLEmblem.jsx','utf8');
assert.ok(emblem.includes('role="img"') && emblem.includes('aria-label="JIIT Youth Club crest"') && emblem.includes('LOGO_FALLBACK') && emblem.includes('LOGO_ORIGINAL'), 'official crest must have semantic image labeling and optimized fallbacks');
assert.ok(!emblem.includes('requestAnimationFrame') && !emblem.includes('jycAudio') && !emblem.includes('model-viewer'), 'hero crest must not run a duplicate orbital canvas, autoplay audio or external model viewer');
assert.match(css, /--jh-bg:\s*#F5F1E6/i, 'homepage background token must use the editorial paper palette');
assert.ok(cohesive.includes('--jh-accent: #c8bcff') && cohesive.includes('--jh-gold:') && cohesive.includes('--jh-bg: #080d1c'), 'homepage night theme must use midnight, lavender and gold');
assert.ok(cohesive.includes('--jh-accent: #625889') && cohesive.includes('--jh-bg: #f5f1e8'), 'homepage day theme must use warm paper and indigo accents');
assert.ok(cohesive.includes('@media (max-width: 360px)') && cohesive.includes('grid-template-columns:1fr !important'), 'homepage phone layout must have a narrow-phone single-column fallback');
assert.match(css, /prefers-reduced-motion:\s*reduce/, 'homepage motion must respect reduced-motion preferences');

console.log('JYC homepage editorial-truth contract: PASS');
