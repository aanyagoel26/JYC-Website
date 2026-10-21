import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const main=read('src/main.jsx');
const css=read('src/v18.22-human-polish.css');
const phoenix=read('src/v14-platform.jsx');
const map=read('src/v14-platform-plus.jsx');
const sw=read('public/sw.js');
const checks=[
 ['version is 18.22.0',pkg.version==='18.22.0'],
 ['V18.22 polish stylesheet imported',main.includes("./v18.22-human-polish.css")],
 ['V15/V17 homepage sections remain',main.includes('<JYCPulse data={data}/>')&&main.includes('<ImpactStats data={data}/>')&&main.includes('<EcosystemSection data={data}/>')&&main.includes('<MomentsSection data={data}/>')],
 ['Home is first in desktop navigation',main.includes("const links=[['Home','/']")],
 ['Contact remains a clear desktop destination',main.includes("['Contact','/contact']")],
 ['Planner remains discoverable',main.includes("['/planner','JYC Planner'")],
 ['Assistant has keyboard navigation',main.includes('ArrowDown')&&main.includes('ArrowUp')&&main.includes("e.key==='Enter'" )],
 ['Assistant routes directly to Planner',main.includes("nav('/planner')")&&main.includes('JYC Planner')],
 ['Assistant supports full-search handoff',main.includes("/?q=")],
 ['Phoenix has three orbits and four orbs',phoenix.includes('phoenix-orbit-a')&&phoenix.includes('phoenix-orb-d')],
 ['Phoenix bird motion is present',css.includes('jyc22-phoenix-flight')&&css.includes('.home .phoenix-artwork img')],
 ['Header phoenix is contained',css.includes('.nav-inner .brand-mark')&&css.includes('overflow: hidden')&&css.includes('.nav-inner .brand-mark img')],
 ['Ecosystem is compact and centred',css.includes('.home .ecosystem-section')&&css.includes('.home .ecosystem-head')&&css.includes('.home .ecosystem-orbit')],
 ['Ecosystem nodes are balanced',css.includes('.ecosystem-node-0')&&css.includes('.ecosystem-node-1')&&css.includes('.ecosystem-node-2')&&css.includes('.ecosystem-node-3')],
 ['Map grid prevents overlap',css.includes('.campus-map-layout')&&css.includes('min-width: 0')&&css.includes('grid-template-columns: minmax(0, 1.7fr)')],
 ['Map keeps OpenStreetMap and themed UI',map.includes('openstreetmap.org/export/embed')&&map.includes('map-theme-vignette')&&map.includes('map-source-chip')],
 ['Map has responsive single-column mobile layout',css.includes('.campus-map-layout {')&&css.includes('grid-template-columns:1fr')],
 ['Other page heroes are compact',css.includes('.page .feature-hero')&&css.includes('.page .team-hero-panel')&&css.includes('.page .guide-hero')],
 ['Light mode receives warm paper treatment',css.includes('data-theme="light"')&&css.includes('#f5f1e6')],
 ['Bird motion respects reduced motion',css.includes('jyc22-bird-breathe')&&css.includes('@media (prefers-reduced-motion: reduce)')],
 ['No cursor-star requestAnimationFrame loop',!main.includes('requestAnimationFrame(step)')],
 ['V18.18 motion layer not imported',!main.includes('v18.18-motion.css')],
 ['Service worker cache bumped',sw.includes('jyc-cache-v18-22-0-best-jyc')],
 ['Secrets remain ignored',read('.gitignore').includes('.env.local')&&read('.gitignore').includes('.vercel/')]
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(!ok)failed++;}
if(failed){console.error(`V18.22 HUMAN JYC QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log(`V18.22 HUMAN JYC QA PASS (${checks.length} checks)`);
