import fs from 'node:fs';
import assert from 'node:assert/strict';

const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/main.jsx', 'utf8');
const spotlight = fs.readFileSync('src/jyc-spotlight.jsx', 'utf8');
const explorer = fs.readFileSync('src/components/JYC3DInteractiveExplorer.jsx', 'utf8');
const spotlightCss = fs.readFileSync('src/styles/jyc-home-spotlight.css', 'utf8');
const hero = fs.readFileSync('src/styles/jyc-home-hero-finish.css', 'utf8');
const emblem = fs.readFileSync('src/components/JYCHeroWebGLEmblem.jsx', 'utf8');

const checks = [
  ['homepage loads the final hero art-direction layer after the shared motion system', home.indexOf("import './styles/jyc-home-hero-finish.css';") > home.indexOf("import './styles/jyc-editorial-motion-system.css';")],
  ['hero paints its responsive static fallback before idle-loading the WebGL Dither layer', home.includes('jh-hero-dither-static') && home.includes('requestIdleCallback') && home.includes('setTimeout') && home.includes('}, 3200)') && home.includes('prefers-reduced-motion: reduce')],
  ['responsive crest LCP candidate is preloaded with matching srcset and sizes', index.includes('href="/assets/jyc-logo-320.avif"') && index.includes('imagesrcset="/assets/jyc-logo-270.avif 270w, /assets/jyc-logo-320.avif 320w, /assets/jyc-logo.avif 480w"') && index.includes('imagesizes="(max-width: 680px) 80px, 320px"')],
  ['hero retains the source-backed student benefit and all three primary destinations', /Find your people\.[\s\S]*?Make your mark\./.test(home) && home.includes("nav('/events')") && home.includes("nav('/clubs')") && home.includes("nav('/join-jyc')")],
  ['hero keeps the official crest, shader field and emblem controls', home.includes('<LazyJYCWebGLField />') && home.includes('const LazyJYCWebGLField = lazy(') && home.includes('<JYCHeroWebGLEmblem />') && emblem.includes('jyc-emblem-controls-bar') && emblem.includes('role="group"')],
  ['below-fold Spotlight and explorer are lazy-loaded and viewport-deferred', home.includes('LazyJYCSpotlight') && home.includes('LazyJYC3DInteractiveExplorer') && home.includes('function DeferredMount') && home.includes('rootMargin = \'720px 0px\'')],
  ['deferred home sections retain visible state and reserve responsive space', !spotlight.includes('jyc-living-spotlight reveal') && !explorer.includes('jyc-community-explorer reveal') && hero.includes('jh-deferred-mount>section') && hero.includes('jh-deferred-spotlight-placeholder')],
  ['live Spotlight uses published records, responsive photo fallback and keyboard-safe card motion', spotlight.includes("import './styles/jyc-home-spotlight.css';") && spotlight.includes("import {ResponsivePhoto}") && spotlight.includes("published!==false") && spotlight.includes("<ResponsivePhoto") && !spotlight.includes("<img src={spotlight") && spotlightCss.includes('.jyc-living-spotlight-grid') && spotlightCss.includes('@media(max-width:620px)') && spotlightCss.includes(':focus-visible') && spotlightCss.includes('prefers-reduced-motion:reduce') && spotlightCss.includes('jycSpotlightBeam')],
  ['non-home directory pages are split into route-level chunks', ['LazyJYC57Events','LazyJYC57Clubs','LazyJYC57Gallery','LazyJYCBestOf'].every(name=>app.includes(name))],
  ['search trigger accessible name comes from its visible Search text; keyboard hint stays decorative', app.includes('className=\"search-label\">Search</span>') && app.includes('<kbd aria-hidden=\"true\">Ctrl K</kbd>') && !app.includes('aria-label=\"Search Ctrl K\"')],
  ['hero crest and Dither fallback offer a 320px responsive image candidate', emblem.includes('jyc-logo-320.avif 320w') && home.includes('jyc-logo-320.avif 320w') && emblem.includes('import.meta.env.PROD ?') && home.split('srcSet={import.meta.env.PROD ?').length === 3],
  ['dither reveal is enabled and uses the JYC paper, violet and champagne palette', home.includes('wander={false}') && home.includes('globalPointer') && home.includes('inkColor="#4b3e69"') && home.includes('paperColor="#f6f2e9"') && home.includes('rimColor="#b99b70"')],
  ['hero art direction uses responsive editorial typography, layered orbit and a framed crest stage', home.includes('<section className="jh-hero"') && hero.includes('html[data-theme] .public-app .jyc-editorial-home.jyc-home .jh-hero{') && hero.includes('.jh-hero h1') && hero.includes('.jh-hero-stage-label') && home.includes('jh-hero-stage-caption') && home.includes('jh-hero-frame') && hero.includes('.jh-hero-copy{') && hero.includes('z-index:3;') && hero.includes('.jh-hero-frame{') && hero.includes('font-style:normal!important') && hero.includes('Space Grotesk') && hero.includes('radial-gradient') && hero.includes('jh-hero-actions .jh-btn:focus-visible') && home.includes('jh-hero-dither-static')],
  ['mobile hero keeps the campus identity line visible instead of hiding the location context', hero.includes('.jh-overline{display:block!important') && hero.includes('@media(max-width:680px)')],
  ['mobile hero gives the JYC crest a larger square stage and keeps all three actions discoverable', hero.includes('width:min(100%,340px)') && hero.includes('jyc-hero-emblem-stage{width:90%;max-width:280px') && hero.includes('.jh-btn:nth-child(3){min-height:42px!important')],
  ['mobile emblem controls retain a true 48px touch target without scaling the hit area down', hero.includes('.jyc-emblem-controls-bar{bottom:8px;gap:6px;transform:translateX(-50%)}') && hero.includes('.emblem-control-pill{box-sizing:border-box;min-height:48px;height:48px') && !hero.includes('transform:translateX(-50%) scale(.88)')],
  ['crest stage adds a restrained orbital rim and highlight without covering the semantic crest', hero.includes('.jh-hero-visual::before{content:""') && hero.includes('border-radius:50%') && hero.includes('.jh-hero-visual::after{content:""') && hero.includes('pointer-events:none')],
  ['desktop and tablet/mobile layouts have explicit responsive rules', hero.includes('@media(max-width:1024px)') && hero.includes('@media(max-width:680px)') && hero.includes('@media(max-width:380px)') && hero.includes('width:100%;') && hero.includes('aspect-ratio:1;') && hero.includes('grid-template-columns:minmax(0,1fr)!important')],
  ['hero controls keep touch-sized targets and visible focus behavior is inherited from shared system', hero.includes('min-height:52px') && hero.includes('min-height:44px') && hero.includes('min-height:48px') && hero.includes('color:var(--jh-bg,var(--jyc-canvas))!important') && home.includes('jh-btn-primary')],
  ['entrance motion is limited to opacity/transform and reduced-motion disables it', hero.includes('@keyframes jycHeroRise') && hero.includes('translate3d') && hero.includes('@media(prefers-reduced-motion:reduce)') && hero.includes('animation:none!important') && hero.includes('transition:none!important;') && home.includes('prefers-reduced-motion: reduce')],
  ['mobile emblem labels are simplified to avoid visual crowding', hero.includes('.jyc-emblem-badge{display:none}') && hero.includes('.jyc-emblem-controls-bar')],
  ['no unverified homepage reach or event counters are introduced', !/5,000\s*\+|50\s*\+|15\s*\+/.test(home)],
  ['light hero has a distinct champagne-gold badge, warm glow and brass accent hierarchy', hero.includes('html[data-theme="light"]') && hero.includes('linear-gradient(115deg,#f5e6c7') && hero.includes('0 0 34px rgba(205,163,91,.24)') && hero.includes('color:#986b32!important')],
  ['dark hero has a separate midnight palette and layered astrophotography-inspired sky', hero.includes('html[data-theme="dark"]') && hero.includes('radial-gradient(ellipse at 58% 44%,rgba(113,83,176,.28)') && hero.includes('linear-gradient(153deg,transparent 35%,rgba(3,7,20,.74)') && hero.includes('jycHeroNebulaBreathe')],
  ['both hero themes retain reduced-motion-safe visual treatment', hero.includes('@media(prefers-reduced-motion:no-preference)') && hero.includes('@media(prefers-reduced-motion:reduce)') && hero.includes('animation:none!important')],

];

let failures = 0;
for (const [label, pass] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${label}`);
  if (!pass) failures += 1;
}
assert.equal(failures, 0, `JYC homepage hero QA failed ${failures}/${checks.length} checks`);
console.log(`JYC homepage hero QA passed (${checks.length} checks)`);
