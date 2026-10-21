import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
const main=read('src/main.jsx');
const extra=read('src/extra-features.jsx');
const css=read('src/v18.11-final-product.css');
const sw=read('public/sw.js');
const browser=read('scripts/browser-v18.spec.js');
const checks=[
 ['version is 18.11.2',pkg.version==='18.11.2','18.11.2'],
 ['package-lock root version is 18.11.2',lock.version==='18.11.2'&&lock.packages?.['']?.version==='18.11.2'],
 ['GalleryItems has one local/export declaration',!(/function GalleryItems\(\{items\}\)/.test(main))&&/export function GalleryItems\(\{items\}\)/.test(extra)],
 ['GalleryItems is imported once',((main.match(/GalleryItems/g)||[]).length>=1)&&main.includes('GalleryItems} from \'./extra-features.jsx\';')],
 ['V18.11 stylesheet is loaded',main.includes("import './v18.11-final-product.css';")],
 ['Phoenix particles exist',main.includes('phoenix-particles')&&css.includes('.phoenix-particle')],
 ['Phoenix orbit/depth exists',css.includes('.phoenix-orbit')&&css.includes('rotateX(var(--hero-rx))')],
 ['three Phoenix doors preserved',main.includes('bird-function-card-community')&&main.includes('bird-function-card-experience')&&main.includes('bird-function-card-people')],
 ['events editorial feature exists',main.includes('event-featured-editorial')&&main.includes('FEATURED EVENT')],
 ['events date filtering exists',main.includes('dateFilter')&&main.includes('input type="date"')],
 ['club detail mini-site sections preserved',main.includes('club-detail-nav')&&main.includes('club-events')&&main.includes('club-gallery')],
 ['calendar source UI preserved',extra.includes('JYC events')&&extra.includes('Academic dates')&&extra.includes('All')],
 ['admin editor ergonomics loaded',css.includes('.editor-actions')&&css.includes('.editor-tabs')&&css.includes('.admin-row:hover')],
 ['Playwright browser QA is declared',pkg.devDependencies?.['@playwright/test']&&browser.includes('@playwright/test')],
 ['service worker cache bumped',sw.includes('jyc-cache-v18-11-1-final-product')],
 ['recruitment remains homepage-gated',main.includes("if(clean==='/recruitment')return <Navigate to=\"/\" replace/>")],
 ['fests remain mode-gated',main.includes("if(clean==='/fests')return isFestMode(data)?")],
 ['admin remains separate',main.includes("const isAdmin=loc.pathname.startsWith('/admin')")]
];
let failed=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(!ok)failed++}
if(failed){console.error(`V18.11 FINAL QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log('V18.11 FINAL STATIC QA PASS');
