import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const main=read('src/main.jsx');
const home=read('src/jyc-editorial-home.jsx');
const homeCss=read('src/jyc-editorial-home.css');
const publicCss=read('src/styles/public-system.css');
const suite=read('scripts/run-qa-suite.mjs');
const admin=read('src/admin-chunk.jsx');
const browser=read('scripts/browser-smoke.spec.js');
const checks=[];
const add=(name,ok,detail='')=>checks.push([name,Boolean(ok),detail]);
add('release metadata is V64',/^64\.\d+\.\d+$/.test(pkg.version));
add('homepage is content-first and visually consolidated',home.includes('jh-hero')&&home.includes('jh-intro')&&home.includes('jh-dark-section')&&home.includes('jh-events')&&home.includes('jh-activities')&&!home.includes('jh-archive-section'));
add('homepage has no retired PhotoChapters mount',!home.includes('<PhotoChapters/>'));add('homepage has no heavy MagicBento mount',!home.includes('LazyMagicBento'));
add('homepage has no retired DriftWall mount',!home.includes('LazyDriftWall'));
add('homepage family cards are media-free',home.includes('jh-family-index')&&!home.includes('jh-family-image'));
add('homepage activity cards are media-free',!home.includes('image:gallery['));
add('homepage has one hero image and one featured-event image path',home.includes('jh-photo-frame')&&home.includes('jh-featured-event'));
add('homepage hero uses photographs only, never posters or identity graphics',home.includes("g?.url&&g?.mediaKind==='photo'"));
add('homepage event links use the stored canonical slug used by event details and sitemap',home.includes("const eventPath=e=>`/events/${slug(e?.slug||e?.title)}`"));
add('gallery uses deterministic grid contract',publicCss.includes('.public-app .gallery-grid{')&&publicCss.includes('display:grid!important')&&publicCss.includes('column-count:unset!important')&&publicCss.includes('aspect-ratio:4/3!important'));
add('gallery archive uses deterministic rows',publicCss.includes('.public-app .jyc57-masonry')&&publicCss.includes('grid-auto-rows:auto!important')&&publicCss.includes('.public-app .jyc57-masonry .jyc57-photo'));
add('gallery has mobile layout contracts',publicCss.includes('@media(max-width:620px)')&&publicCss.includes('.public-app .gallery-grid'));
add('homepage media CSS has family-index contract',homeCss.includes('.jh-family-index'));
add('active suite contains current media/layout QA',suite.includes('qa-media-layout.mjs')&&suite.includes('qa-current-release-coherence.mjs'));
add('homepage CMS cannot restore retired visual surfaces',!admin.includes('move=(id,dir)')&&!admin.includes('Photo Chapters')&&!admin.includes('Hub Photo Wall'));
add('browser QA guards homepage composition',browser.includes('homepage media composition stays editorial')&&browser.includes('activity image duplication'));
const suiteFiles=[...suite.matchAll(/'([^']+\.mjs)'/g)].map(m=>m[1]).filter(p=>p.startsWith('qa-'));
const stale=[];
const stalePatterns=[/pkg\.version===['"](?:5[0-9]|6[0-3])\./,/release is v(?:5[0-9]|6[0-3])/i,/release version is V(?:5[0-9]|6[0-3])/i,/gallery\.slice\(0,4\)/,/jh-photo-grid/,/column-count:4/];
for(const file of suiteFiles){
 if(file==='qa-current-release-coherence.mjs'||file==='qa-zero-glitch-contract.mjs') continue;
 const full=path.join('scripts',file);
 if(!fs.existsSync(path.join(root,full))){stale.push(full+' (missing)');continue}
 const text=read(full);
 for(const pattern of stalePatterns) if(pattern.test(text)) stale.push(full+' :: '+pattern);
}
add('active QA suite has no stale homepage/layout assertions',stale.length===0,stale.slice(0,12).join('; '));
const failures=checks.filter(x=>!x[1]);
for(const [name,ok,detail] of checks) console.log((ok?'PASS':'FAIL')+' · '+name+(detail?' — '+detail:''));
if(failures.length){console.error('\nCurrent release coherence QA failed: '+failures.length);process.exit(1)}
console.log('\nCurrent release coherence QA PASS ('+checks.length+' checks).');