import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx');
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
const manifest=JSON.parse(read('public/manifest.json'));
const sw=read('public/sw.js');
const phoenix=read('src/v14-platform.jsx');
const css=read('src/v18.12-best-jyc.css');
const admin=read('src/admin-chunk.jsx');
const extra=read('src/extra-features.jsx');
const functional=read('src/v15-functional.js');
const index=read('index.html');

const checks=[
 ['version is 18.12.0',pkg.version==='18.12.0'],
 ['package-lock root version is 18.12.0',lock.packages?.['']?.version==='18.12.0'],
 ['no orphaned CampusFeed reference',!/\bCampusFeed\b/.test(main)],
 ['club-first editorial homepage is present',/Where JYC\s*<br\/>\s*<em>comes alive\./.test(main)],
 ['homepage keeps three Phoenix doors',/hero-bird-node node-clubs/.test(main)&&/hero-bird-node node-events/.test(main)&&/hero-bird-node node-team/.test(main)],
 ['JYC communities section is present',/JYC COMMUNITIES/.test(main)],
 ['JYC moments/gallery section is present',/JYC MOMENTS/.test(main)&&/GalleryItems/.test(main)],
 ['JYC team section is preserved',/Meet the people behind JYC/.test(main)],
 ['fests remain mode-gated',/isFestMode\(data\)/.test(main)&&/\/fests/.test(main)],
 ['recruitment remains homepage-gated',/recruitmentEnabled\(data\)/.test(main)],
 ['My JYC route is preserved',/clean==='\/my-jyc'/.test(main)],
 ['calendar route is preserved',/clean==='\/calendar'/.test(main)],
 ['campus map route is preserved',/clean==='\/map'/.test(main)],
 ['admin remains separate',/clean==='\/admin'/.test(main)&&/isAdmin=loc\.pathname\.startsWith\('\/admin'\)/.test(main)],
 ['club detail runtime is preserved',/function ClubDetail/.test(main)],
 ['event detail runtime is preserved',/function Events/.test(main)&&/function EventDetail/.test(main)],
 ['search ranking runtime is preserved',/rankSearchResults/.test(main)],
 ['AI assistant remains optional',/JYCAssistant/.test(main)&&/openAssistant/.test(main)],
 ['admin error boundary exists',/class AdminErrorBoundary/.test(admin)],
 ['admin publishing workspace exists',/AdminContent|AdminOverview|AdminAICopilot/.test(admin)],
 ['GalleryItems has an import/export contract',/GalleryItems/.test(main)&&/GalleryItems/.test(extra)],
 ['event reminders/calendar tools preserved',/EventReminderButton/.test(main)&&/DownloadICS/.test(main)&&/googleCalendarUrl/.test(main)],
 ['site cache/offline resilience preserved',/readSiteCache/.test(main)&&/writeSiteCache/.test(main)],
 ['Supabase missing-env no longer white-screens',/createSafeFallback/.test(read('src/lib/supabase.js'))&&/Missing VITE_SUPABASE_URL/.test(read('src/lib/supabase.js'))],
 ['V18.12 stylesheet is loaded last',/v18\.12-best-jyc\.css/.test(main)],
 ['direct pointer cursor tracking is present',/dot\.current\.style\.left=`\$\{x\}px`/.test(main)&&!/pos\.current\.x/.test(main.slice(main.indexOf('function CustomCursor'),main.indexOf('function App(')))],
 ['mobile hamburger has explicit dark-mode white contrast',/data-theme="dark".*\.hamb i/s.test(css)&&/background:#fff/.test(css)],
 ['mobile More overlay is viewport locked',/\.more-sheet-overlay\{[\s\S]*position:fixed[\s\S]*inset:0/.test(css)&&/body:has\(\.more-sheet-overlay\)/.test(css)],
 ['search uses SVG icon instead of stray glyph',/search-field-icon/.test(main)],
 ['Phoenix continuous motion is disabled',/hero-bird-main img\{[\s\S]*animation:none/.test(css)],
 ['calm secondary Phoenix implementation exists',/phoenix-calm-stage/.test(phoenix)],
 ['admin sidebar fills viewport',/\.admin-side\{[\s\S]*height:100dvh/.test(css)],
 ['PWA manifest is root-scoped',manifest.start_url==='/'&&manifest.scope==='/'],
 ['PWA shortcuts are same-origin relative paths',manifest.shortcuts?.every(x=>typeof x.url==='string'&&x.url.startsWith('/'))],
 ['service worker cache is V18.12.0',/jyc-cache-v18-12-0-best-jyc/.test(sw)],
 ['service worker has valid notification options',/icon:\s*payload\.icon/.test(sw)&&/badge:\s*payload\.badge/.test(sw)],
 ['service worker syntax parses',true],
 ['index contains manifest link',/rel=["']manifest["']/.test(index)],
];
let failed=0;
for(const [label,ok] of checks){
 if(label==='service worker syntax parses'){
   try{execFileSync(process.execPath,['--check',path.join(root,'public/sw.js')],{stdio:'ignore'});}
   catch{failed++;console.log('FAIL:',label);continue;}
 }
 console.log(`${ok?'PASS':'FAIL'}: ${label}`);
 if(!ok)failed++;
}
if(failed){console.log(`V18.12 BEST JYC STATIC QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log('V18.12 BEST JYC STATIC QA PASS');
