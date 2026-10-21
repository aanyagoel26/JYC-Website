import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const main=read('src/main.jsx');
const phoenix=read('src/v14-platform.jsx');
const admin=read('src/admin-chunk.jsx');
const sw=read('public/sw.js');
const css=read('src/v21-ui-functional.css');
const checks=[
 ['version is 18.17.0',pkg.version==='18.17.0'],
 ['V18.17 UI CSS is loaded last',/v21-ui-functional\.css/.test(main)],
 ['homepage has one Phoenix composition',!/<EcosystemSection data=\{data\}\/>/.test(main)&&!/<MomentsSection data=\{data\}\/>/.test(main)],
 ['homepage compact layout is supported',/compactHome/.test(main)&&/\['events','intro','clubs','gallery','cta'\]/.test(main)],
 ['Phoenix uses compact three-door navigation',/phoenix-door-rail/.test(phoenix)&&((phoenix.match(/\['(CLUBS|EVENTS|TEAM)'/g)||[]).length===3)&&!/node-four/.test(phoenix)],
 ['desktop primary nav uses Moments and Calendar',/\['Moments','\/gallery'\]/.test(main)&&/\['Calendar','\/calendar'\]/.test(main)],
 ['More menu does not duplicate top-level destinations',!/\['\/gallery','Gallery'/.test(main)&&!/\['\/calendar','Calendar'/.test(main)],
 ['More menu has modal focus and scroll handling',/document\.body\.style\.overflow='hidden'/.test(main)&&/querySelectorAll\('button,a,input/.test(main)],
 ['admin AI navigator is not mounted on Overview',/tab!==['"]overview['"]&&<AdminAINavigator/.test(admin)],
 ['service worker cache bumped for V18.17',sw.includes('jyc-cache-v18-17-0-ui-functional')],
 ['custom cursor stays above overlays',css.includes('z-index: 2147483647')],
 ['mobile Phoenix is motion-light',/prefers-reduced-motion/.test(css)&&/max-width: 600px/.test(css)],
 ['admin layout has a bounded readable content width',/max-width: 1440px/.test(css)&&/grid-template-columns: 252px/.test(css)],
 ['no orphan CampusFeed',!/\bCampusFeed\b/.test(main)],
 ['Supabase fallback remains non-fatal',/supabase\.__configured===false/.test(main)],
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(!ok)failed++;}
if(failed){console.error(`V18.17 UI/FUNCTIONAL QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log('V18.17 UI/FUNCTIONAL QA PASS');
