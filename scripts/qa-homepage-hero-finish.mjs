import fs from 'node:fs';
import assert from 'node:assert/strict';

const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const hero = fs.readFileSync('src/styles/jyc-home-hero-finish.css', 'utf8');
const emblem = fs.readFileSync('src/components/JYCHeroWebGLEmblem.jsx', 'utf8');

const checks = [
  ['homepage loads the final hero art-direction layer after the shared motion system', home.indexOf("import './styles/jyc-home-hero-finish.css';") > home.indexOf("import './styles/jyc-editorial-motion-system.css';")],
  ['hero retains the source-backed student benefit and all three primary destinations', /Find your people\.[\s\S]*?Make your mark\./.test(home) && home.includes("nav('/events')") && home.includes("nav('/clubs')") && home.includes("nav('/join-jyc')")],
  ['hero keeps the official crest, shader field and emblem controls', home.includes('<JYCWebGLField />') && home.includes('<JYCHeroWebGLEmblem />') && emblem.includes('jyc-emblem-controls-bar')],
  ['dither reveal is enabled and uses the JYC paper, violet and champagne palette', home.includes('wander={true}') && home.includes('inkColor="#4b3e69"') && home.includes('paperColor="#f6f2e9"') && home.includes('rimColor="#b99b70"')],
  ['hero art direction uses responsive editorial typography and layered surfaces', hero.includes('.jh-hero h1') && hero.includes('Space Grotesk') && hero.includes('.jh-hero-visual::before') && hero.includes('radial-gradient')],
  ['desktop and tablet/mobile layouts have explicit responsive rules', hero.includes('@media(max-width:1024px)') && hero.includes('@media(max-width:680px)') && hero.includes('@media(max-width:380px)')],
  ['hero controls keep touch-sized targets and visible focus behavior is inherited from shared system', hero.includes('min-height:50px') && home.includes('jh-btn-primary')],
  ['entrance motion is limited to opacity/transform and reduced-motion disables it', hero.includes('@keyframes jycHeroRise') && hero.includes('translate3d') && hero.includes('@media(prefers-reduced-motion:reduce)') && hero.includes('animation:none!important')],
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
