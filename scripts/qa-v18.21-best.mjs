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
 ['V15/V17 homepage sections remain',/JYCPulse data=\{data\}/.test(main)&&/ImpactStats data=\{data\}/.test(main)&&/EcosystemSection data=\{data\}/.test(main)&&/MomentsSection data=\{data\}/.test(main)],
 ['Home is first in desktop navigation',/const links=\[\['Home','\/'\]/.test(main)],
 ['Contact replaces Calendar in desktop navigation',/\['Contact','\/contact'\]\]/.test(main)&&!/const links=.*Calendar/.test(main)],
 ['Planner remains discoverable',/\['\/planner','JYC Planner'/.test(main)],
 ['Phoenix has three orbits and four orbs',/phoenix-orbit-a/.test(phoenix)&&/phoenix-orb-d/.test(phoenix)],
 ['Phoenix orbit is centered by final CSS',/phoenix-orbital-system\{inset:50% auto auto 50%/.test(css)],
 ['Ecosystem bird is explicitly centered',/ecosystem-brand-lockup\{position:absolute/.test(css)&&/ecosystem-brand-lockup img\{display:block/.test(css)],
 ['Ecosystem nodes are balanced on four corners',/ecosystem-node-0\{left:7%/.test(css)&&/ecosystem-node-3\{left:7%/.test(css)],
 ['Headings are compact',/page h1,.unified-public-page h1,.compact-page-head h1\{font-size:clamp\(34px/.test(css)&&/hero h1\{font-size:clamp\(43px/.test(css)],
 ['Night sky remains layered and reduced-motion safe',/site-atmosphere:before/.test(css)&&/prefers-reduced-motion:reduce/.test(css)],
 ['Contact no longer claims simulated receipt',!/received \(simulated\)/i.test(main)&&/jyc_contact_submissions/.test(main)],
 ['Map keeps OpenStreetMap and themed UI',/openstreetmap.org\/export\/embed/.test(map)&&/map-theme-vignette/.test(map)&&/map-source-chip/.test(map)],
 ['Map is compact and mobile responsive',/campus-map-layout\{grid-template-columns:minmax/.test(css)&&/campus-map-layout\{grid-template-columns:1fr/.test(css)],
 ['No cursor-star requestAnimationFrame loop',!/requestAnimationFrame\(step\)/.test(main)],
 ['V18.18 motion layer not imported',!/v18\.18-motion\.css/.test(main)],
 ['Service worker cache bumped',sw.includes('jyc-cache-v18-22-0-best-jyc')],
 ['GitHub CI and security configuration exists',fs.existsSync(path.join(root,'.github/workflows/ci.yml'))&&fs.existsSync(path.join(root,'.github/workflows/codeql.yml'))&&fs.existsSync(path.join(root,'.github/dependabot.yml'))],
 ['Secrets remain ignored',/\.env\.local/.test(read('.gitignore'))&&/\.vercel\//.test(read('.gitignore'))],
 ['Official-content guard remains in README',/No surprise publishing/.test(read('README.md'))&&/Official JYC/.test(read('README.md'))],
];
let failed=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(!ok)failed++;}
if(failed){console.error(`V18.22 HUMAN JYC QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log(`V18.22 HUMAN JYC QA PASS (${checks.length} checks)`);
