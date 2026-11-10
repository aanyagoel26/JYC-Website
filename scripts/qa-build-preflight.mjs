import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx');
const loader=main.slice(main.indexOf('async function loadData()'),main.indexOf('\nasync function saveData'));
const admin=read('src/admin-chunk.jsx');
const html=read('index.html');
const routeShells=read('scripts/generate-route-shells.mjs');
const fallbackStart=main.indexOf('function readOnlySiteFallback(');
const fallbackEnd=main.indexOf('\nasync function loadData()',fallbackStart);
const readOnlyFallback=fallbackStart>=0&&fallbackEnd>fallbackStart?main.slice(fallbackStart,fallbackEnd):'';
const cssFiles=[];
function walkCss(dir){ for(const entry of fs.readdirSync(dir,{withFileTypes:true})){ const full=path.join(dir,entry.name); if(entry.isDirectory()) walkCss(full); else if(entry.isFile() && full.endsWith('.css')) cssFiles.push(full); } }
walkCss(path.join(root,'src'));
const cssText=cssFiles.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const checks=[
 ['featured/event navigation contract is present', /function EventCard\([\s\S]*?events\//.test(main) || /<EventCard key=\{e\.id\} e=\{e\}/.test(main)],
 ['canonical URL is not root-directory asset syntax', !html.includes('<link rel="canonical" href="/" />')],
 ['canonical URL uses an absolute verified origin or a build-time origin token that the route-shell generator replaces', /<link rel="canonical" href="https?:\/\//.test(html) || (html.includes('<link rel="canonical" href="__JYC_CANONICAL_ORIGIN__/') && routeShells.includes("replaceAll('__JYC_CANONICAL_ORIGIN__',siteOrigin)"))],
 ['GalleryItems is not redeclared locally', !/function GalleryItems\(\{items\}\)/.test(main)],
 ['AdminErrorBoundary import does not collide with local class', !(/class AdminErrorBoundary extends/.test(admin) && /import[^;]*\bAdminErrorBoundary\b[^;]*from ['\"]\.\/admin-extra\.jsx['\"]/.test(admin))],
 ['CSS keyframe identifiers are valid', !/@keyframes\s+[0-9]/.test(cssText) && !/animation(?:-name)?\s*:\s*[0-9]/.test(cssText)],
 ['Production initialization uses only cache/curated public content; demo fixtures remain development-only', main.includes("import.meta.env.DEV?publicDemoData():mergePublicFallback(norm(readSiteCache()||empty),{allowContentFallback:true,allowGalleryFallback:false,allowTeamFallback:true})") && !main.includes("const [data,setData]=useState(()=>publicDemoData())")],
 ['Production missing-config and missing-RPC paths use the publication-gated read-only fallback, never demo fixtures', /if\(supabase\.__configured===false\)[\s\S]*?if\(import\.meta\.env\.DEV\)return publicDemoData\(\);\s*return readOnlySiteFallback/.test(loader) && /if\(error\)\{[\s\S]*?if\(import\.meta\.env\.DEV\)return publicDemoData\(\);\s*return readOnlySiteFallback/.test(loader) && readOnlyFallback.includes('mergePublicFallback(source,{allowContentFallback:true,allowGalleryFallback:false,allowTeamFallback:true})')],
 ['Multi-day events use dateEnd for lifecycle state', main.includes('const effectiveEndDate=e.dateEnd||e.date') || main.includes("const end=parseEventMoment(e.dateEnd||e.date,e.end,'23:59')")],
 ['retired academic calendar data is not in the active public feature bundle', !fs.readFileSync(path.join(root,'src/extra-features.jsx'),'utf8').includes('academicKeyDates') && !fs.readFileSync(path.join(root,'src/extra-features.jsx'),'utf8').includes('Academic dates')],
 ['GLB bot supports model-native animation without auto-rotation', fs.readFileSync(path.join(root,'src/jyc-bot.jsx'),'utf8').includes('availableAnimations') && fs.readFileSync(path.join(root,'src/jyc-bot.jsx'),'utf8').includes('disable-pan') && !fs.readFileSync(path.join(root,'src/jyc-bot.jsx'),'utf8').includes('auto-rotate')],
];
let failed=0; for(const [name,ok] of checks){ console.log(`${ok?'PASS':'FAIL'}: ${name}`); if(!ok) failed++; }
if(failed){ console.error(`BUILD PREFLIGHT FAILED: ${failed} check(s)`); process.exit(1); }
console.log('BUILD PREFLIGHT PASS');
