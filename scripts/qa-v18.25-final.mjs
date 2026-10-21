import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const main=read('src/main.jsx');
const phoenix=read('src/v14-platform.jsx');
const css=read('src/v18.25-human-jyc-final.css');
const html=read('index.html');
const pkg=JSON.parse(read('package.json'));
const sw=read('public/sw.js');
let passed=0;
function pass(name){passed++;console.log(`PASS: ${name}`)}
function fail(name){console.error(`FAIL: ${name}`);process.exitCode=1}
const checks=[
 ['version is 18.25.0',pkg.version==='18.25.0'],
 ['Events route component exists',/function Events\(\{data\}\)/.test(main)],
 ['Fests page component exists',/function FestsPage\(\{data\}\)/.test(main)],
 ['Events is rendered from /events route',/clean==='\/events'\)return .*<Events data=\{data\}/s.test(main)],
 ['V18.25 visual layer is imported',main.includes("./v18.25-human-jyc-final.css")],
 ['external local dev cleanup replaces inline script',html.includes('/dev-cleanup.js')&&!/<script>\s*\/\/ Development safety/.test(html)],
 ['Google Fonts import is removed for offline/CSP performance',!read('src/styles.css').includes('fonts.googleapis.com')],
 ['four ecosystem orbit wrappers exist',/nodes\.map\(\(\[id,label,count,path\],i\)=>/.test(phoenix)&&/ecosystem-orbit-node-\$\{i\}/.test(phoenix)],
 ['ecosystem route nodes remain clickable',/onClick=\{\(\)=>nav\(path\)\}/.test(phoenix)],
 ['ecosystem Phoenix is enlarged',/ecosystem-core-action[\s\S]*width:150px/.test(css)],
 ['theme flight crosses left to right',/@keyframes jyc25-bird-flight/.test(css)&&/112vw/.test(css)],
 ['JYC paper light palette exists',/--bg-main:#f4efe3/.test(css)&&/--accent-red:#9f241f/.test(css)],
 ['search panel has staff action',main.includes('Control Center')&&main.includes('search-admin-tools')],
 ['service worker cache is bumped',sw.includes('jyc-cache-v18-25-0-human-final')],
 ['reduced motion disables ecosystem flight',/@media\(prefers-reduced-motion:reduce\)/.test(css)&&/ecosystem-orbit-node\{animation:none/.test(css)],
];
for(const [n,ok] of checks)ok?pass(n):fail(n);
console.log(`V18.25 FINAL QA: ${passed}/${checks.length} passed`);
if(process.exitCode)process.exit(1);
