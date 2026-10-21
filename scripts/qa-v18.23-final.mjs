import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx');
const css=read('src/v18.23-human-final.css');
const platform=read('src/v14-platform-plus.jsx');
const ecosystem=read('src/v14-platform.jsx');
const pkg=JSON.parse(read('package.json'));
const sw=read('public/sw.js');
const checks=[
  ['version is 18.23.0',pkg.version==='18.23.0'],
  ['final CSS is imported last',main.includes("import './v18.23-human-final.css';") && main.lastIndexOf("import './v18.23-human-final.css';")>main.lastIndexOf("import './v18.22-human-polish.css';")],
  ['assistant no undefined results variable',!main.includes('const filteredType=q.trim()?results') && !main.slice(main.indexOf('function JYCAssistant'),main.indexOf('function Card',main.indexOf('function JYCAssistant'))).includes('results.length===0')],
  ['assistant uses ranked local results',main.includes('rankSearchResults(rawAssistantResults,term)')],
  ['assistant keyboard navigation remains',main.includes("e.key==='ArrowDown'") && main.includes("e.key==='ArrowUp'") && main.includes("e.key==='Enter'")],
  ['assistant includes planner',main.includes("JYC Planner") && main.includes("'/planner'")],
  ['constellation layer exists',main.includes('constellation-field') && main.includes('<polyline')],
  ['compact hero heading',css.includes('.home .hero h1') && css.includes('max-width:620px')],
  ['no giant public page headings',css.includes('.page h1,.compact-page-head h1,.unified-public-page h1')],
  ['compact ecosystem restored',css.includes('.home .ecosystem-section') && css.includes('height:245px')],
  ['phoenix orbital motion exists',css.includes('jyc23-orbit-a') && css.includes('jyc23-orbit-b')],
  ['phoenix bird motion exists',css.includes('jyc23-phoenix-breathe')],
  ['reduced motion supported',css.includes('prefers-reduced-motion:reduce')],
  ['mobile-first breakpoint exists',css.includes('@media (max-width:600px)')],
  ['map is two-column desktop',css.includes('.campus-map-layout') && css.includes('grid-template-columns:minmax(0,1.55fr)')],
  ['map collapses mobile',css.includes('.campus-map-layout{grid-template-columns:1fr!important}')],
  ['map iframe fills frame',css.includes('.campus-map-frame iframe{display:block!important;width:100%!important;height:100%!important')],
  ['night sky constellations',css.includes('.constellation-field') && css.includes('.constellation-field path')],
  ['light mode paper treatment',css.includes(':root[data-theme="light"] body')],
  ['no V18.18 motion import',!main.includes("import './v18.18-motion.css';")],
  ['service worker cache bumped',sw.includes('jyc-cache-v18-23-0-human-final')],
  ['ecosystem has four useful destinations',ecosystem.includes("['clubs','CLUBS'") && ecosystem.includes("['events','EVENTS'") && ecosystem.includes("['my-jyc','MY JYC'") && ecosystem.includes("['team','TEAM'")],
  ['map uses OpenStreetMap',platform.includes('openstreetmap.org/export/embed.html')],
  ['map has venue search',platform.includes('Search JYC venue')],
  ['no fake published seed required',main.includes("published&&c.status!=='archived'")],
];
let failed=0;
for(const [name,ok] of checks){if(ok)console.log(`PASS: ${name}`);else{console.error(`FAIL: ${name}`);failed++;}}
if(failed)process.exit(1);
console.log(`JYC V18.23 FINAL QA PASS (${checks.length} checks)`);
