import fs from 'node:fs';
import assert from 'node:assert/strict';

const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const app = fs.readFileSync('src/main.jsx', 'utf8');
const spotlight = fs.readFileSync('src/jyc-spotlight.jsx', 'utf8');
const explorer = fs.readFileSync('src/components/JYC3DInteractiveExplorer.jsx', 'utf8');
const spotlightCss = fs.readFileSync('src/styles/jyc-home-spotlight.css', 'utf8');
const hero = fs.readFileSync('src/styles/jyc-home-hero-finish.css', 'utf8');
const emblem = fs.readFileSync('src/components/JYCHeroWebGLEmblem.jsx', 'utf8');

const checks = [
  ['homepage loads the final hero art-direction layer after the shared motion system', home.indexOf("import './styles/jyc-home-hero-finish.css';") > home.indexOf("import './styles/jyc-editorial-motion-system.css';")],
  ['hero paints its responsive static fallback before idle-loading the WebGL Dither layer', home.includes('jh-hero-dither-static') && home.includes('requestIdleCallback') && home.includes('prefers-reduced-motion: reduce')],
  ['hero retains the source-backed student benefit and all three primary destinations', /Find your people\.[\s\S]*?Make your mark\./.test(home) && home.includes("nav('/events')") && home.includes("nav('/clubs')") && home.includes("nav('/join-jyc')")],
  ['hero keeps the official crest, shader field and emblem controls', home.includes('<JYCWebGLField />') && home.includes('<JYCHeroWebGLEmblem />') && emblem.includes('jyc-emblem-controls-bar') && emblem.includes('role="group"')],
  ['below-fold Spotlight and explorer are lazy-loaded and viewport-deferred', home.includes('LazyJYCSpotlight') && home.includes('LazyJYC3DInteractiveExplorer') && home.includes('function DeferredMount') && home.includes('rootMargin = \'720px 0px\'')],
  ['deferred home sections retain visible state and reserve responsive space', !spotlight.includes('jyc-living-spotlight reveal') && !explorer.includes('jyc-community-explorer reveal') && hero.includes('jh-deferred-mount>section') && hero.includes('jh-deferred-spotlight-placeholder')],
  ['live Spotlight has a responsive three-card system and keyboard focus treatment', spotlight.includes("import './styles/jyc-home-spotlight.css';") && spotlightCss.includes('.jyc-living-spotlight-grid') && spotlightCss.includes('@media(max-width:620px)') && spotlightCss.includes(':focus-visible')],
  ['non-home directory pages are split into route-level chunks', ['LazyJYC57Events','LazyJYC57Clubs','LazyJYC57Gallery','LazyJYCBestOf'].every(name=>app.includes(name))],
  ['search trigger accessible name matches its visible Search label', app.includes('aria-label=\"Search\"') && !app.includes('aria-label=\"Search Ctrl K\"')],
  ['hero crest and Dither fallback offer a 320px responsive image candidate', emblem.includes('jyc-logo-320.avif 320w') && home.includes('jyc-logo-320.avif 320w') && emblem.includes('import.meta.env.PROD ?') && home.split('srcSet={import.meta.env.PROD ?').length === 3],
  ['dither reveal is enabled and uses the JYC paper, violet and champagne palette', home.includes('wander={false}') && home.includes('globalPointer') && home.includes('inkColor="#4b3e69"') && home.includes('paperColor="#f6f2e9"') && home.includes('rimColor="#b99b70"')],
  ['hero art direction uses responsive editorial typography, stacked stage layers and theme-safe surfaces', home.includes('<section className="jh-hero"') && hero.includes('html[data-theme] .public-app .jyc-editorial-home.jyc-home .jh-hero{') && hero.includes('.jh-hero h1') && hero.includes('.jh-hero-stage-label') && home.includes('jh-hero-stage-caption') && hero.includes('.jh-hero-copy{position:relative;z-index:3;max-width:760px;padding-block:12px}') && hero.includes('.jh-hero h1 .jh-title-gradient') && hero.includes('color:var(--jh-accent,var(--jyc-accent))') && hero.includes('border:1px solid color-mix(in srgb,var(--jh-line-accent,var(--jyc-line)) 62%,transparent)') && hero.includes('jh-hero-actions .jh-btn:focus-visible') && hero.includes('Space Grotesk') && hero.includes('radial-gradient')],
  ['desktop and tablet/mobile layouts have explicit responsive rules', hero.includes('@media(max-width:1024px)') && hero.includes('@media(max-width:680px)') && hero.includes('@media(max-width:380px)') && hero.includes('width:100%!important') && hero.includes('aspect-ratio:1!important') && hero.includes('display:grid!important')],
  ['hero controls keep touch-sized targets and visible focus behavior is inherited from shared system', hero.includes('min-height:50px') && hero.includes('color:var(--jh-bg,var(--jyc-canvas))!important') && home.includes('jh-btn-primary')],
  ['entrance motion is limited to opacity/transform and reduced-motion disables it', hero.includes('@keyframes jycHeroRise') && hero.includes('translate3d') && hero.includes('@media(prefers-reduced-motion:reduce)') && hero.includes('animation:none!important') && hero.includes('jh-hero-visual{transition:none!important}')],
  ['mobile emblem labels are simplified to avoid visual crowding', hero.includes('.jyc-emblem-badge{display:none}') && hero.includes('.jyc-emblem-controls-bar')],
  ['no unverified homepage reach or event counters are introduced', !/5,000\s*\+|50\s*\+|15\s*\+/.test(home)]
];

let failures = 0;
for (const [label, pass] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${label}`);
  if (!pass) failures += 1;
}
assert.equal(failures, 0, `JYC homepage hero QA failed ${failures}/${checks.length} checks`);
console.log(`JYC homepage hero QA passed (${checks.length} checks)`);
