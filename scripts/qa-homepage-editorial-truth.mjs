import fs from 'node:fs';
import assert from 'node:assert/strict';

const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const css = fs.readFileSync('src/jyc-editorial-home.css', 'utf8');
const system = fs.readFileSync('src/styles/nsoc-inspired-visual-refresh.css', 'utf8');
const emblem = fs.readFileSync('src/components/JYCHeroWebGLEmblem.jsx', 'utf8');
const emblemCss = fs.readFileSync('src/components/JYCHeroWebGLEmblem.css', 'utf8');

assert.match(home, /Find your people\.[\s\S]*?Make your mark\.[\s\S]*?At JIIT 128\./i,
  'homepage headline must clearly communicate its student benefit and campus identity');
assert.match(home, /THE JIIT 128 STUDENT ECOSYSTEM/i,
  'homepage must identify the JYC student ecosystem');
assert.match(home, /data\?\.events|data\?\.gallery|data\?\.team/,
  'homepage must derive events, gallery and team from published site data');
assert.doesNotMatch(home, /new Date\(['"]2026-11-15T09:00:00/,
  'homepage must not hard-code an unverified countdown date');
assert.doesNotMatch(home, /jh-flagship-countdown-strip|jh-countdown-timer/,
  'homepage must not present an unverified flagship countdown');
assert.doesNotMatch(home, /5,000<i>\+<\/i>|50<i>\+<\/i>|15<i>\+<\/i>/,
  'homepage must not publish unverified reach, event or legacy counters');
assert.doesNotMatch(home, /jh-ambient-backdrop|jh-ambient-orb/,
  'homepage must not use generic ambient cyber decoration');

assert.match(css, /--jh-bg:\s*#f5f1e6/i,
  'homepage light theme must retain its warm editorial background');
assert.match(css, /--jh-accent:\s*#8f2429/i,
  'homepage light theme must use the refreshed oxblood accent');
assert.match(css, /prefers-reduced-motion:\s*reduce/i,
  'homepage motion must respect reduced-motion preferences');
assert.match(system, /jyc-section-arrive|jyc-reveal/,
  'shared design system must include progressive section motion');
assert.match(system, /prefers-reduced-motion:\s*reduce/i,
  'shared motion system must include a reduced-motion fallback');
assert.match(emblem, /#c9b8f2/i,
  'dark emblem accents must use moonlit lavender');
assert.match(emblem, /#e6d4a8/i,
  'dark emblem highlights must use muted gold');
assert.match(emblemCss, /prefers-reduced-motion:\s*reduce/i,
  'emblem animation must respect reduced-motion preferences');

console.log('JYC homepage editorial-truth contract: PASS');
