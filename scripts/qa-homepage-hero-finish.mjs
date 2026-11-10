import fs from 'node:fs';
import assert from 'node:assert/strict';

const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/main.jsx', 'utf8');
const spotlight = fs.readFileSync('src/jyc-spotlight.jsx', 'utf8');
const explorer = fs.readFileSync('src/components/JYC3DInteractiveExplorer.jsx', 'utf8');
const spotlightCss = fs.readFileSync('src/styles/jyc-home-spotlight.css', 'utf8');
const hero = fs.readFileSync('src/styles/jyc-home-hero-finish.css', 'utf8');
const heroDirection = fs.readFileSync('src/styles/jyc-home-hero-art-direction.css', 'utf8');
const webglField = fs.readFileSync('src/components/JYCWebGLField.jsx', 'utf8');
const emblem = fs.readFileSync('src/components/JYCHeroWebGLEmblem.jsx', 'utf8');
const audio = fs.readFileSync('src/lib/jyc-audio.js', 'utf8');

const checks = [
  ['homepage loads the original finish layer and the new cinematic art direction last', home.indexOf("import './styles/jyc-home-hero-finish.css';") > home.indexOf("import './styles/jyc-editorial-motion-system.css';") && home.indexOf("import './styles/jyc-home-hero-art-direction.css';") > home.indexOf("import './styles/jyc-home-hero-finish.css';")],
  ['single OGL sky layer is idle-loaded with reduced-motion and coarse-pointer fallbacks', home.includes('heroFieldReady') && home.includes('requestIdleCallback') && home.includes('setTimeout') && home.includes('}, 3200)') && home.includes('prefers-reduced-motion: reduce') && !home.includes('LazyDitherVeil') && !home.includes('jh-hero-dither-layer')],
  ['responsive crest LCP candidate is preloaded with matching srcset and sizes', index.includes('href="/assets/jyc-logo.avif"') && index.includes('imagesrcset="/assets/jyc-logo-270.avif 270w, /assets/jyc-logo-320.avif 320w, /assets/jyc-logo.avif 480w"') && index.includes('imagesizes="(max-width: 680px) 250px, (max-width: 1024px) 340px, 430px"') && emblem.includes('sizes="(max-width: 680px) 250px, (max-width: 1024px) 340px, 430px"')],
  ['hero retains the source-backed student benefit and all three primary destinations', /Find your people\.[\s\S]*?Make your mark\./.test(home) && home.includes("nav('/events')") && home.includes("nav('/clubs')") && home.includes("nav('/join-jyc')")],
  ['hero keeps the official crest and shader field without secondary controls', home.includes('<LazyJYCWebGLField />') && home.includes('const LazyJYCWebGLField = lazy(') && home.includes('<JYCHeroWebGLEmblem />') && emblem.includes('role="group"') && emblem.includes('aria-label="JIIT Youth Club identity"') && emblem.includes('jyc-hero-identity-rail') && emblem.includes('jyc-hero-emblem-caption') && !emblem.includes('jyc-emblem-controls-bar') && !emblem.includes('jyc-emblem-canvas') && !emblem.includes('model-viewer') && !emblem.includes('COSMIC SOUND')],
  ['below-fold Spotlight and explorer are lazy-loaded and viewport-deferred', home.includes('LazyJYCSpotlight') && home.includes('LazyJYC3DInteractiveExplorer') && home.includes('function DeferredMount') && home.includes('rootMargin = \'720px 0px\'')],
  ['deferred home sections retain visible state and reserve responsive space', !spotlight.includes('jyc-living-spotlight reveal') && !explorer.includes('jyc-community-explorer reveal') && hero.includes('jh-deferred-mount>section') && hero.includes('jh-deferred-spotlight-placeholder')],
  ['live Spotlight uses published records, responsive photo fallback and keyboard-safe card motion', spotlight.includes("import './styles/jyc-home-spotlight.css';") && spotlight.includes("import {ResponsivePhoto}") && spotlight.includes("published!==false") && spotlight.includes("<ResponsivePhoto") && !spotlight.includes("<img src={spotlight") && spotlightCss.includes('.jyc-living-spotlight-grid') && spotlightCss.includes('@media(max-width:620px)') && spotlightCss.includes(':focus-visible') && spotlightCss.includes('prefers-reduced-motion:reduce') && spotlightCss.includes('jycSpotlightBeam')],
  ['non-home directory pages are split into route-level chunks', ['LazyJYC57Events','LazyJYC57Clubs','LazyJYC57Gallery','LazyJYCBestOf'].every(name=>app.includes(name))],

  ['desktop and tablet/mobile layouts have explicit responsive rules', hero.includes('@media(max-width:1024px)') && hero.includes('@media(max-width:680px)') && hero.includes('@media(max-width:380px)') && hero.includes('width:100%;') && hero.includes('aspect-ratio:1;') && hero.includes('grid-template-columns:minmax(0,1fr)!important')],
  ['hero controls keep touch-sized targets and visible focus behavior is inherited from shared system', hero.includes('min-height:52px') && hero.includes('min-height:44px') && hero.includes('min-height:48px') && hero.includes('color:var(--jh-bg,var(--jyc-canvas))!important') && home.includes('jh-btn-primary')],
  ['entrance motion is limited to opacity/transform and reduced-motion disables it', hero.includes('@keyframes jycHeroRise') && hero.includes('translate3d') && hero.includes('@media(prefers-reduced-motion:reduce)') && hero.includes('animation:none!important') && hero.includes('transition:none!important;') && home.includes('prefers-reduced-motion: reduce')],
  ['hero emblem has no floating telemetry labels or decorative control bar', !emblem.includes('jyc-emblem-badge') && !emblem.includes('jyc-emblem-controls-bar') && !emblem.includes('COSMIC SOUND')],
  ['no unverified homepage reach or event counters are introduced', !/5,000\s*\+|50\s*\+|15\s*\+/.test(home)],
  ['light hero has a distinct champagne-gold badge, warm glow and brass accent hierarchy', hero.includes('html[data-theme="light"]') && hero.includes('linear-gradient(115deg,#f5e6c7') && hero.includes('0 0 34px rgba(205,163,91,.24)') && hero.includes('color:#986b32!important')],
  ['dark hero has a separate midnight palette and layered astrophotography-inspired sky', hero.includes('html[data-theme="dark"]') && hero.includes('radial-gradient(ellipse at 58% 44%,rgba(113,83,176,.28)') && hero.includes('linear-gradient(153deg,transparent 35%,rgba(3,7,20,.74)') && hero.includes('jycHeroNebulaBreathe')],
  ['both hero themes retain reduced-motion-safe visual treatment', hero.includes('@media(prefers-reduced-motion:no-preference)') && hero.includes('@media(prefers-reduced-motion:reduce)') && hero.includes('animation:none!important')],
  ['cinematic hero stylesheet overrides the boxed legacy treatment with an open crest stage', heroDirection.includes('.jh-hero-visual{') && heroDirection.includes('background:transparent!important') && heroDirection.includes('border:0!important') && heroDirection.includes('.jyc-hero-emblem-stage') && heroDirection.includes('.jh-hero-visual::before')],
  ['dark cosmic and light champagne themes have independent hero art direction', heroDirection.includes('html[data-theme="dark"]') && heroDirection.includes('html[data-theme="light"]') && heroDirection.includes('rgba(113,91,190') && heroDirection.includes('#f7f1e6') && heroDirection.includes('#9a7138')],
  ['hero primary actions maintain high contrast in both themes', heroDirection.includes('html[data-theme="dark"] .public-app .jyc-editorial-home.jyc-home .jh-hero-copy>.jh-hero-actions .jh-btn-primary{color:#17142a!important') && heroDirection.includes('html[data-theme="light"] .public-app .jyc-editorial-home.jyc-home .jh-hero-copy>.jh-hero-actions .jh-btn-primary{color:#fffaf3!important')],
  ['mobile hero keeps identity, headline, crest and actions in an intentional reading order', heroDirection.includes('grid-template-areas:"badge" "overline" "title" "lead" "visual" "actions"') && heroDirection.includes('grid-area:visual!important') && heroDirection.includes('grid-area:actions!important')],
  ['compact mobile hero reserves clear space for the crest and actions', heroDirection.includes('padding-block:20px 18px!important') && heroDirection.includes('font-size:clamp(36px,10vw,54px)!important') && heroDirection.includes('height:clamp(230px,72vw,310px)!important') && heroDirection.includes('grid-area:visual!important')],
  ['320–390px hero keeps its compact type, stage and dock clearance', heroDirection.includes('padding-block:14px 12px!important') && heroDirection.includes('font-size:clamp(34px,10.2vw,40px)!important;margin:8px 0 8px!important') && heroDirection.includes('height:clamp(220px,69vw,270px)!important') && heroDirection.includes('width:min(74%,280px)!important')],
  ['the hero emblem contains no audio, model-viewer or secondary mode controls', !emblem.includes('model-viewer') && !emblem.includes('COSMIC SOUND') && !emblem.includes('emblem-control-pill') && !emblem.includes('jycAudio')],
  ['public audio is disabled without retaining Web Audio or synthesized effects', !audio.includes('AudioContext') && !audio.includes('createOscillator') && audio.includes('toggle() { return false; }')],
  ['hero metadata is separated from the official crest and legacy sound/mesh controls are absent', emblem.includes('jyc-hero-identity-location') && emblem.includes('jyc-hero-identity-founded') && emblem.includes('jyc-hero-emblem-caption') && !emblem.includes('jyc-emblem-controls-bar')],
  ['OGL shader uses a capability-aware quality tier rather than disabling on ordinary 8-core laptops', webglField.includes('cores <= 4') && webglField.includes('memory < 4') && webglField.includes('const reducedQuality') && webglField.includes('reducedQuality ? 1000 / 20 : 1000 / 24') && webglField.includes('reducedQuality || coarse ? 1.0 : 1.2')],

];

let failures = 0;
for (const [label, pass] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${label}`);
  if (!pass) failures += 1;
}
assert.equal(failures, 0, `JYC homepage hero QA failed ${failures}/${checks.length} checks`);
console.log(`JYC homepage hero QA passed (${checks.length} checks)`);
