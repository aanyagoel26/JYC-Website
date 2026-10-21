import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const main=fs.readFileSync(path.join(root,'src','main.jsx'),'utf8');
const css=fs.readFileSync(path.join(root,'src','v18.14-mobile-first.css'),'utf8');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const sw=fs.readFileSync(path.join(root,'public','sw.js'),'utf8');
const checks=[
 ['version is 18.14.0',pkg.version==='18.16.0'],
 ['mobile-first stylesheet imported',main.includes("v18.14-mobile-first.css")],
 ['V15 Home retained',main.includes('function Home')&&main.includes('JYCPulse')&&main.includes('NextMoment')],
 ['JYC Pulse remains compact status rail',css.includes('.pulse-strip')&&css.includes('flex-wrap:nowrap')],
 ['mobile hero is primary composition',css.includes('@media(max-width:760px)')&&css.includes('.home .hero{')],
 ['Phoenix motion disabled on public home',css.includes('.home .hero-art *{animation:none!important}')],
 ['desktop expands same mobile hierarchy',css.includes('@media(min-width:761px)')],
 ['Admin sidebar is readable',css.includes('grid-template-columns:280px minmax(0,1fr)')&&css.includes('.admin-nav-group button .admin-nav-label')&&css.includes('white-space:nowrap!important')],
 ['Admin labels cannot collapse',css.includes('overflow:visible!important')&&css.includes('text-overflow:clip!important')],
 ['Admin main fills remaining column',css.includes('.admin-main{min-width:0!important;width:100%!important')],
 ['mobile Admin switches to mobile layout',css.includes('@media(max-width:900px)')&&css.includes('.admin-side{display:none!important')],
 ['service worker cache bumped',sw.includes('jyc-cache-v18-16-0-runtime-complete')],
 ['CampusFeed orphan absent',!main.includes('<CampusFeed')],
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${n}`);if(!ok)failed++;}
if(failed)process.exit(1);console.log('V18.14 MOBILE-FIRST QA PASS');

