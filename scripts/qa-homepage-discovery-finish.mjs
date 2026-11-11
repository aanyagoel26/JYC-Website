import fs from 'node:fs';
import assert from 'node:assert/strict';

const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const css = fs.readFileSync('src/styles/jyc-home-discovery-finish.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert.match(home, /<nav className="jh-start-here jh-container" aria-label="Start exploring JYC">/, 'homepage must expose a labelled quick-discovery navigation');
assert.equal((home.match(/className="jh-start-link"/g) || []).length, 4, 'quick discovery must expose four destinations');
assert.ok(home.includes("nav('/clubs')") && home.includes("nav('/events')") && home.includes("nav('/gallery')") && home.includes("nav('/team')"), 'quick discovery destinations must route correctly');
assert.ok(css.includes('jh-start-here-grid'), 'quick discovery styling must be included');
assert.match(home, /const featured = upcoming\[0\] \|\| null;/, 'homepage must never label a past event as next up');
assert.match(home, /const upcoming = events\.filter\(e => \{ const t = dateMs\(e\); return Number\.isFinite\(t\) && t >= today; \}\)\.slice\(0, 4\);/, 'upcoming events must be published, date-valid and not in the past');
assert.match(home, /<section className="jh-container jh-events" aria-labelledby="jh-events-title">/, 'event section must have an accessible heading relationship');
assert.match(home, /<h2 id="jh-events-title">Next up at/, 'event heading must provide the referenced accessible name');
assert.match(home, /className="jh-events-empty" role="status"/, 'no-upcoming-events state must be announced to assistive technology');
assert.match(home, /Nothing announced just yet\./, 'empty state must explain the current event availability');
assert.match(home, /Browse all events[\s\S]*?nav\('\/events'\)/, 'empty state must offer a route to the event directory');
assert.match(home, /Explore communities[\s\S]*?nav\('\/clubs'\)/, 'empty state must offer an alternative discovery route');
assert.ok(css.includes('var(--jyc-surface)') && css.includes('var(--jyc-text-strong)') && css.includes('var(--jyc-muted)'), 'empty state must use shared theme tokens');
assert.ok(css.includes('@media (max-width: 620px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'empty state must support mobile and reduced-motion preferences');
assert.equal(pkg.scripts['qa:homepage-discovery'], 'node scripts/qa-homepage-discovery-finish.mjs', 'homepage discovery QA must be runnable from npm');

console.log('JYC homepage discovery finish: PASS (15 checks)');
