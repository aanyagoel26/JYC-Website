import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const main=fs.readFileSync(path.join(root,'src/main.jsx'),'utf8');
const admin=fs.readFileSync(path.join(root,'src/admin-chunk.jsx'),'utf8');
const phoenix=fs.readFileSync(path.join(root,'src/v14-platform.jsx'),'utf8');
const map=fs.readFileSync(path.join(root,'src/v14-platform-plus.jsx'),'utf8');
const css=fs.readFileSync(path.join(root,'src/v18-4-product-overhaul.css'),'utf8');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const checks=[
 ['version is 18.9',['18.9.7','18.9.8','18.9.9','18.9.10','18.10.0','18.11.0','18.11.1','18.11.2'].includes(pkg.version)],
 ['Discover is not a primary route',main.includes("if(clean==='/discover')return <Navigate to=\"/clubs\" replace/>")],
 ['Projects redirect is preserved without a public project page',main.includes("if(clean==='/projects'||clean==='/projects/submit')return <Navigate to=\"/clubs\" replace/>")],
 ['Admin no longer exposes project tab',!admin.match(/roleTabs=.*projects/) && !admin.includes("['projects','Project submissions']")],
 ['Phoenix routes are Clubs Events Fests Guide',phoenix.includes("['CLUBS','/clubs'","['EVENTS','/events'","['FESTS','/fests'","['GUIDE','/guide'")],
 ['Site-wide atmosphere exists',main.includes('<SiteAtmosphere/>')&&css.includes('.site-atmosphere')],
 ['Dark shooting stars exist',css.includes('.shooting-star')&&css.includes('data-theme=dark')],
 ['JYC Assistant is navigation-only',main.includes('JYC Assistant')&&main.includes('openAssistant')&&!main.includes('assistant&&<JYCAssistant')===false],
 ['Search uses relevance scoring',main.includes('rankSearchResults')&&main.includes('_score')],
 ['Fests are indexed in search',main.includes("['Fests','Flagship JIIT and JYC fest experiences.'")],
 ['Creator spotlight exists',main.includes('creator-card')&&main.includes('BUILT FOR JYC')],
 ['Map filters venues by selected campus',map.includes("String(x.campus||campus)===String(campus)")],
 ['Selected venue gets actions',map.includes('selected-venue-card')&&map.includes('Open venue map')],
 ['Guide is club-first',main.includes('THE JYC GUIDE')&&main.includes('Club first. Tools second.')&&!main.includes('jiitshelf.vercel.app')&&!main.includes('jiit-pulse.vercel.app')],
 ['No obsolete project copy in onboarding',!main.includes('Submit a project.')],
 ['Admin AI copilot is wired into content workspaces',admin.includes('AdminAICopilot')&&admin.includes('ai-content-assist')],
 ['AI assist applies to club/event/fest drafts',admin.includes('onAiApply')&&admin.includes('aiContext={{draft:form')],
 ['AI Edge Function exists',fs.existsSync(path.join(root,'supabase/functions/ai-content-assist/index.ts'))],
 ['AI Edge Function is JWT protected',fs.readFileSync(path.join(root,'supabase/config.toml'),'utf8').includes('[functions.ai-content-assist]')],
 ['Service worker cache is v18.9',((fs.readFileSync(path.join(root,'public/sw.js'),'utf8').includes('jyc-cache-v18-11-final-product')||fs.readFileSync(path.join(root,'public/sw.js'),'utf8').includes('jyc-cache-v18-11-1-final-product'))||fs.readFileSync(path.join(root,'public/sw.js'),'utf8').includes('jyc-cache-v18-9-9-deep-polish')||fs.readFileSync(path.join(root,'public/sw.js'),'utf8').includes('jyc-cache-v18-9-8-contact-nav')||fs.readFileSync(path.join(root,'public/sw.js'),'utf8').includes('jyc-cache-v18-7-code-quality')||fs.readFileSync(path.join(root,'public/sw.js'),'utf8').includes('jyc-cache-v18-9-final')||fs.readFileSync(path.join(root,'public/sw.js'),'utf8').includes('jyc-cache-v18-9-5-jyc-first'))],
];
let failed=0; for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${n}`);if(!ok)failed++;}
if(failed)process.exit(1); console.log('V18.9 compatibility QA complete.');
