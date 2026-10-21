import fs from 'node:fs';
const failures=[];
const read=p=>fs.readFileSync(p,'utf8');
const fail=x=>failures.push(x);
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
if(pkg.version!=='50.0.0')fail('package version must be 50.0.0');
if(lock.version!=='50.0.0'||lock.packages?.['']?.version!=='50.0.0')fail('lockfile root version must be 50.0.0');
const main=read('src/main.jsx'),socials=read('src/jyc-socials.js'),hubs=read('src/v21-hub-content.js'),api=read('api/jyc-updates.js'),index=read('index.html'),theme=read('src/jyc-logo-final-theme.css');
const requiredHubs=['Fortissimo','BDS','VamUnique','Panache','RPH','CICR','Innovation','Zencoders','JODC','CypherX','Arcadia','Neural Nexus','GDG','Dronotics','Aakriti','Aura','Cinekala','Abhivyakti','Prismatic','Eloquence','JSA'];
for(const hub of requiredHubs){if(!hubs.includes(hub))fail('hub missing from canonical content: '+hub);if(!(socials.includes(hub+':')||socials.includes("'"+hub+"':")||socials.includes('"'+hub+'":')))fail('hub missing from social registry: '+hub);}
for(const route of ['/','/about','/history','/clubs','/events','/fests','/team','/gallery','/contact','/calendar','/recruitment','/updates'])if(!main.includes("'"+route+"'"))fail('public route contract missing: '+route);
if(!main.includes('unknownRoute'))fail('unknown-route handling is missing');
if(!main.includes('noindex:privateRoute||unknownRoute'))fail('unknown/private routes must not be indexed');
if(!index.includes('rel="canonical"')||!index.includes('application/ld+json'))fail('index SEO contract missing');
if(!api.includes('sync&&!process.env.JYC_SYNC_SECRET')||!api.includes("sync&&req.headers['x-jyc-sync-secret']"))fail('sync endpoint guard missing');
if(!api.includes("process.env.JYC_LINKEDIN_VERSION||'202609'"))fail('LinkedIn connector must default to 202609');
if(/custom-cursor|cursor-dot/i.test(theme))fail('custom cursor styling is present in final theme');
if(!theme.includes('.hero-logo-ring')||!theme.includes('display:none!important'))fail('rejected orbital UI is not explicitly disabled');
if(!fs.existsSync('src/jyc-production-pass.css'))fail('production motion stylesheet missing');
const headers=JSON.parse(read('vercel.json')).headers||[];
if(!headers.some(x=>x.source==='/(.*)'))fail('global security headers missing');
if(!headers.some(x=>x.source==='/assets/:path*'))fail('immutable asset cache rule missing');
if(failures.length){console.error('V50 PRODUCTION FINISH QA FAIL');failures.forEach(x=>console.error('FAIL:',x));process.exit(1)}
console.log('V50 PRODUCTION FINISH QA PASS');
