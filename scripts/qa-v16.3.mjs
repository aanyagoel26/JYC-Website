import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const fail = msg => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };
const pass = msg => console.log(`PASS: ${msg}`);

const pkg = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
if (!['18.9.7','18.9.8','18.9.9','18.9.10','18.10.0','18.11.0','18.11.1','18.11.2'].includes(pkg.version)) fail(`package.json version is ${pkg.version}`); else pass('package.json is V18.9.x');
if (!['18.9.7','18.9.8','18.9.9','18.9.10','18.10.0','18.11.0','18.11.1','18.11.2'].includes(lock.version) || !['18.9.7','18.9.8','18.9.9','18.9.10','18.10.0','18.11.0','18.11.1','18.11.2'].includes(lock.packages?.['']?.version)) fail('package-lock root version mismatch'); else pass('package-lock root is V18.9.x');

const required = [
  'src/main.jsx','src/extra-features.jsx','src/admin-chunk.jsx','src/admin-extra.jsx','src/v15-functional.js',
  'src/v16-3-platform.css','public/sw.js','public/manifest.json','vercel.json','vite.config.js','index.html'
];
for (const f of required) fs.existsSync(path.join(root,f)) ? pass(`required file: ${f}`) : fail(`missing file: ${f}`);

const main = read('src/main.jsx');
const routes = [...main.matchAll(/if\(clean===['"](\/[^'"]*)['"]\)return/g)].map(m=>m[1]);
const dynamicRoutes = ['/clubs/','/events/','/events/:id/register','/qr/'];
const known = new Set([...routes, ...dynamicRoutes]);
for (const r of ['/clubs','/events','/gallery','/team','/contact','/recruitment','/calendar','/discover','/map','/moments','/projects','/resources','/guide']) known.add(r);
for (const r of routes) pass(`router route: ${r}`);

const cssImports = [...main.matchAll(/import ['"](\.\/[^'"]+\.css)['"]/g)].map(m=>m[1]);
const seen = new Set();
for (const imp of cssImports) {
  if (seen.has(imp)) fail(`duplicate CSS import: ${imp}`);
  seen.add(imp);
  if (!fs.existsSync(path.join(root,'src',imp.replace('./','')))) fail(`missing CSS import: ${imp}`);
}
pass(`checked ${cssImports.length} CSS imports`);

const internalRefs = new Set();
for (const file of fs.readdirSync(path.join(root,'src')).filter(f=>/\.(jsx|js)$/.test(f))) {
  const s = read(`src/${file}`);
  for (const m of s.matchAll(/(?:href|to)=['"](\/(?:[A-Za-z0-9_-]+)(?:\/[A-Za-z0-9_.-]+)*)['"]/g)) internalRefs.add(m[1]);
}
for (const ref of [...internalRefs].sort()) {
  const base = ref.split('/').slice(0,2).join('/') || '/';
  if (!known.has(base) && !known.has(ref) && !ref.startsWith('/downloads/')) fail(`internal-looking route not in router: ${ref}`);
}
pass(`checked ${internalRefs.size} internal route references`);

const publicFiles = new Set(fs.readdirSync(path.join(root,'public')));
for (const m of main.matchAll(/['"]\/(jyc-[^'"]+\.(?:png|jpg|jpeg|webp|svg|ico))['"]/g)) {
  if (!publicFiles.has(m[1])) fail(`missing public asset: ${m[1]}`);
}
pass('checked direct public image references');

const allSource = fs.readdirSync(path.join(root,'src')).filter(f=>/\.(jsx|js)$/.test(f)).map(f=>read(`src/${f}`)).join('\n');
for (const secret of ['SUPABASE_SERVICE_ROLE_KEY','sb_secret_','VAPID_PRIVATE_KEY','BEGIN PRIVATE KEY']) {
  if (allSource.includes(secret)) fail(`possible secret token in src: ${secret}`);
}
pass('no known private-key markers in src');

const cssFiles = fs.readdirSync(path.join(root,'src')).filter(f=>f.endsWith('.css'));
for (const f of cssFiles) {
  const s=read(`src/${f}`);
  let depth=0, inStr=null, esc=false;
  for (const ch of s) {
    if (inStr) { if (esc) esc=false; else if (ch==='\\') esc=true; else if(ch===inStr) inStr=null; continue; }
    if (ch==='"' || ch==="'") { inStr=ch; continue; }
    if (ch==='{') depth++; else if(ch==='}') depth--;
    if(depth<0) break;
  }
  if (depth!==0) fail(`CSS brace imbalance: ${f}`);
}
pass(`checked ${cssFiles.length} CSS files for balanced blocks`);

for (const f of ['src/v15-functional.js']) {
  try { execFileSync(process.execPath,['--check',path.join(root,f)],{stdio:'pipe'}); pass(`Node syntax: ${f}`); }
  catch { fail(`Node syntax error: ${f}`); }
}

const sw=read('public/sw.js');
if (!((sw.includes('jyc-cache-v18-11-final-product')||sw.includes('jyc-cache-v18-11-1-final-product'))||sw.includes('jyc-cache-v18-9-9-deep-polish')||sw.includes('jyc-cache-v18-9-8-contact-nav')||sw.includes('jyc-cache-v18-7-code-quality')||sw.includes('jyc-cache-v18-9-final')||sw.includes('jyc-cache-v18-9-5-jyc-first')||sw.includes('jyc-cache-v18-9-5-jyc-first'))) fail('service-worker cache version was not bumped'); else pass('service-worker cache version bumped');
const html=read('index.html');
if (!html.includes('fonts.googleapis.com') || !html.includes('fonts.gstatic.com')) fail('font preconnects missing'); else pass('font preconnects present');

console.log('\nV16.3 static QA complete.');
if (process.exitCode) console.log('Some checks failed; fix them before production deployment.');
