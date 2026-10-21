import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const main=read('src/main.jsx');
const motion=read('src/v18.18-motion.jsx');
const css=read('src/v18.18-motion.css');
const sw=read('public/sw.js');
const index=read('index.html');
const checks=[
 ['version is 18.18.0',pkg.version==='18.18.0'],
 ['motion layer is loaded after V18.17 styles',/v18\.18-motion\.css/.test(main)],
 ['new motion components are imported',/JYCTicker.*JYCNowStrip.*JYCClubDirectory.*JYCEventTimeline.*JYCMomentsRail.*JYCArchive.*JYCActivityFeed/.test(main)],
 ['homepage uses the JYC Motion hero',/className="home j18-home"/.test(main)&&/className="j18-hero"/.test(main)],
 ['homepage uses real content-driven sections',/JYCClubDirectory data=\{data\}/.test(main)&&/JYCEventTimeline data=\{data\}/.test(main)&&/JYCMomentsRail data=\{data\}/.test(main)],
 ['club directory has hover/focus behavior',/onMouseEnter=\{\(\)=>setActive\(i\)\}/.test(motion)&&/onFocus=\{\(\)=>setActive\(i\)\}/.test(motion)],
 ['event timeline is content-driven',/publishedEvents\(data\)/.test(motion)&&/j18-event-row/.test(motion)],
 ['moments rail supports touch/desktop scrolling',/scrollBy\(\{left:dir\*360,behavior:'smooth'\}\)/.test(motion)&&/overflow-x:auto/.test(css)],
 ['archive uses published event years',/new Set\(publishedEvents\(data\).*slice\(0,4\)/.test(motion)],
 ['mobile motion has reduced-motion fallback',/prefers-reduced-motion:reduce/.test(css)&&/max-width:760px/.test(css)],
 ['mobile custom cursor is disabled',/pointer:coarse/.test(read('src/v13-9-polish.css'))||/pointer:coarse/.test(css)],
 ['service worker cache bumped for V18.18',sw.includes('jyc-cache-v18-18-0-motion')],
 ['SearchAction can resolve to the site search overlay',/SearchAction/.test(read('src/extra-features.jsx'))&&/new URLSearchParams\(loc\.search/.test(main)],
 ['public search does not expose Control Center to anonymous users',/const adminPages=admin\?/.test(main)],
 ['brand search priority is implemented',/Brand\/entity matches/.test(read('src/lib/search.js'))],
 ['static SEO has Organization + WebSite structured data',/"@type":"Organization"/.test(index)&&/"@type":"WebSite"/.test(index)],
 ['public sitemap exists',fs.existsSync(path.join(root,'public','sitemap.xml'))],
 ['robots points at sitemap',/Sitemap:\s*https:\/\/jycjiit\.vercel\.app\/sitemap\.xml/.test(read('public/robots.txt'))],
];
let failed=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(!ok)failed++;}
if(failed){console.error(`V18.18 MOTION QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log(`V18.18 MOTION QA PASS (${checks.length} checks)`);
