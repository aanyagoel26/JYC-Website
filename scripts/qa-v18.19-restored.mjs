import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const main=read('src/main.jsx');
const css=read('src/v18.19-jyc-restored.css');
const sw=read('public/sw.js');
const checks=[
 ['version is 18.20.0',pkg.version==='18.20.0'],
 ['V17/V15 home structure restored',/JYCPulse data=\{data\}/.test(main)&&/ImpactStats data=\{data\}/.test(main)&&/EcosystemSection data=\{data\}/.test(main)&&/MomentsSection data=\{data\}/.test(main)],
 ['home uses compact hero hierarchy',/className="home"/.test(main)&&/READY TO SOAR/.test(main)],
 ['clubs page uses compact V15/V17 structure',/Find your space\./.test(main)&&/discover-panel-compact/.test(main)],
 ['JYC Planner route exists',/clean==='\/calendar'\|\|clean==='\/planner'/.test(main)&&/JYC Planner/.test(main)],
 ['JYC Planner is discoverable from More',/\['\/planner','JYC Planner'/.test(main)],
 ['Phoenix orbit motion is restored',/jyc19-orbit-a/.test(css)&&/jyc19-orbit-b/.test(css)&&/phoenix-calm-stage::before/.test(css)],
 ['Phoenix bird has restrained motion',/jyc19-bird-breathe/.test(css)],
 ['ecosystem orbit is restored',/ecosystem-orbit:before/.test(css)&&/jyc19-ecosystem-spin/.test(css)],
 ['night sky remains subtle',/site-star/.test(css)&&/data-theme="dark"/.test(css)],
 ['light mode atmosphere is restrained',/data-theme="light"/.test(css)],
 ['mobile-first compact headings',/max-width:760px/.test(css)&&/max-width:420px/.test(css)&&/font-size:clamp\(48px,14vw,68px\)/.test(css)],
 ['reduced-motion is supported',/prefers-reduced-motion:reduce/.test(css)],
 ['cursor-star rAF loop was not reintroduced',!/requestAnimationFrame\(step\)/.test(main)],
 ['service worker cache bumped for V18.20',sw.includes('jyc-cache-v18-20-0-compact')],
 ['V18.18 motion layer is not imported',!/v18\.18-motion\.css/.test(main)&&!/v18\.18-motion\.jsx/.test(main)],
];
let failed=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`); if(!ok) failed++;}
if(failed){console.error(`V18.20 RESTORED QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log(`V18.20 RESTORED QA PASS (${checks.length} checks)`);
