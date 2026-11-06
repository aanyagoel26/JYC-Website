import fs from 'node:fs';
import assert from 'node:assert/strict';
const css=fs.readFileSync('src/styles/jyc-nsoc-editorial-effects.css','utf8');
const main=fs.readFileSync('src/main.jsx','utf8');
const checks=[
 ['editorial effects stylesheet is loaded after the shared theme depth layer',main.indexOf("import './styles/jyc-nsoc-editorial-effects.css';")>main.indexOf("import './styles/jyc-depth-motion.css';")],
 ['effects use JYC theme tokens and keep dark/light palettes explicit',css.includes('--jyc-editorial-glow')&&css.includes('html[data-theme="dark"]')&&css.includes('html[data-theme="light"]')],
 ['homepage receives a fine technical grid and animated atmospheric light',css.includes('.jyc-editorial-home.jyc-home::before')&&css.includes('jycEditorialLightTravel')],
 ['section markers use animated editorial index rules',css.includes('.jh-section-number::before')&&css.includes('jycMarkerExtend')],
 ['hero gains restrained orbit rings and a plaque light sweep',css.includes('jycOrbitBreath')&&css.includes('jycPlaqueSweep')],
 ['story and featured event cards gain layered hover feedback',css.includes('.jh-story-card:hover::after')&&css.includes('.jh-featured-event:hover .jh-featured-event-photo')],
 ['CTA and final section gain motion feedback',css.includes('.jh-btn:hover::after')&&css.includes('jycFinalGlow')],
 ['touch layouts avoid hover transforms and reduced motion disables decorative animation',css.includes('@media(max-width:760px)')&&css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('animation:none!important')]
];
let failed=0;for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failed++}
if(failed)process.exit(1);
console.log('NSoC-inspired editorial effects QA: '+checks.length+'/'+checks.length+' checks passed.');
