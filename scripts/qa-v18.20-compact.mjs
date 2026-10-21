import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const main=read('src/main.jsx');
const css=read('src/v18.20-compact-theme.css');
const phoenix=read('src/v14-platform.jsx');
const map=read('src/v14-platform-plus.jsx');
const sw=read('public/sw.js');
const checks=[
 ['version is 18.20.0',pkg.version==='18.20.0'],
 ['V17/V15 home structure remains present',/JYCPulse data=\{data\}/.test(main)&&/ImpactStats data=\{data\}/.test(main)&&/EcosystemSection data=\{data\}/.test(main)&&/MomentsSection data=\{data\}/.test(main)],
 ['desktop navigation starts with Home',/const links=\[\['Home','\/'\]/.test(main)],
 ['desktop navigation uses Contact instead of Calendar',/\['Contact','\/contact'\]\]\;/.test(main)&&!(/const links=.*Calendar/.test(main))],
 ['JYC Planner remains discoverable from More',/\['\/planner','JYC Planner'/.test(main)],
 ['Phoenix orbital system exists',/phoenix-orbital-system/.test(phoenix)&&/phoenix-orbit-a/.test(css)&&/phoenix-orb-a/.test(css)],
 ['Phoenix artwork remains centered and compact',/phoenix-3d-core/.test(css)&&/phoenix-artwork img/.test(css)],
 ['ecosystem Phoenix alignment is corrected',/ecosystem-brand-lockup img/.test(css)&&/width:112px/.test(css)&&/height:96px/.test(css)],
 ['night sky uses layered stars',/length:72/.test(main)&&/site-star-field:before/.test(css)&&/site-star-field:after/.test(css)],
 ['light mode remains restrained',/data-theme=light/.test(css)],
 ['compact page headings and spacing are enforced',/section\.page/.test(css)&&/font-size:clamp\(38px,5vw,66px\)/.test(css)],
 ['contact form has live-data fallback behavior',/jyc_contact_submissions/.test(main)&&/submitError/.test(main)],
 ['map has a themed overlay and source badge',/map-theme-vignette/.test(map)&&/map-source-chip/.test(map)],
 ['map gets dark/light treatment',/campus-map-frame iframe/.test(css)&&/data-theme=dark/.test(css)&&/data-theme=light/.test(css)],
 ['mobile map collapses to one column',/campus-map-layout\{grid-template-columns:1fr/.test(css)],
 ['reduced motion disables continuous Phoenix/star motion',/prefers-reduced-motion:reduce/.test(css)],
 ['cursor-star RAF loop remains absent',!/requestAnimationFrame\(step\)/.test(main)],
 ['service worker cache bumped for V18.20',sw.includes('jyc-cache-v18-20-0-compact')],
 ['V18.18 motion layer is not imported',!/v18\.18-motion\.css/.test(main)&&!/v18\.18-motion\.jsx/.test(main)],
];
let failed=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`); if(!ok) failed++;}
if(failed){console.error(`V18.20 COMPACT QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log(`V18.20 COMPACT QA PASS (${checks.length} checks)`);
