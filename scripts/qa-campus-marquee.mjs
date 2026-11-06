import fs from 'node:fs';
import assert from 'node:assert/strict';
const home=fs.readFileSync('src/jyc-editorial-home.jsx','utf8');
const jsx=fs.readFileSync('src/components/JYCCampusMarquee.jsx','utf8');
const css=fs.readFileSync('src/components/JYCCampusMarquee.css','utf8');
const checks=[
 ['campus ribbon is mounted directly after the hero',home.indexOf('<JYCCampusMarquee />')>home.indexOf('</section>')&&home.includes("import { JYCCampusMarquee } from './components/JYCCampusMarquee.jsx';")],
 ['ribbon labels reflect the published JYC community pillars', ['TECHNOLOGY','CULTURE','PERFORMANCE','SPORT','LITERARY','COMMUNITY'].every(x=>jsx.includes(x))],
 ['marquee loops in opposing directions with duplicate track content',jsx.includes('jyc-campus-marquee__group')&&css.includes('jycMarqueeForward')&&css.includes('jycMarqueeReverse')],
 ['marquee has accessible section naming and hides decorative duplicates',jsx.includes('aria-label="Explore the many sides of JYC"')&&jsx.includes('aria-hidden="true"')],
 ['hover pauses motion and reduced-motion disables automatic animation',css.includes('animation-play-state:paused')&&css.includes('prefers-reduced-motion:reduce')&&css.includes('animation:none!important')],
 ['spotlight effects are restricted to pointer-capable devices and theme tokens',css.includes('pointer:fine')&&css.includes('--jyc-gold')],
 ['responsive rules cover compact mobile layouts',css.includes('@media(max-width:680px)')]
];
let failures=0;for(const [label,ok] of checks){console.log((ok?'PASS':'FAIL')+': '+label);if(!ok)failures++}
assert.equal(failures,0,'Campus marquee QA failed');
console.log('Campus marquee QA: '+checks.length+'/'+checks.length+' passed.');
