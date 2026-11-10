import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {JYC_HUB_SOURCE_REGISTRY} from '../src/jyc-hub-registry.js';
import {PUBLIC_EVENT_FALLBACK} from '../src/content/jyc-public-fallbacks.js';

const root=process.cwd();
const sitemapPath=path.join(root,'public','sitemap.xml');
const site='https://jyc-qa.invalid';
const core=['/','/about','/clubs','/events','/fests','/gallery','/archive','/team','/contact','/calendar','/announcements','/updates','/achievements','/best-of-jyc','/join-jyc','/recruitment'];
const slug=value=>String(value||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const staticEventRoutes=PUBLIC_EVENT_FALLBACK.filter(event=>event?.published&&event?.archived!==true).map(event=>'/events/'+slug(event.slug||event.title));
const hiddenEventRoutes=PUBLIC_EVENT_FALLBACK.filter(event=>!event?.published||event?.archived===true).map(event=>'/events/'+slug(event.slug||event.title));
const allowed=new Set([...core,...staticEventRoutes]);
for(const hub of JYC_HUB_SOURCE_REGISTRY.filter(item=>item.publicationStatus==='published')) allowed.add('/clubs/'+slug(hub.name));

const run=spawnSync(process.execPath,['scripts/generate-sitemap.mjs'],{cwd:root,env:{...process.env,VITE_CANONICAL_ORIGIN:site,JYC_CANONICAL_ORIGIN:'',VITE_SITE_URL:'',VERCEL_PROJECT_PRODUCTION_URL:'',VERCEL_URL:''},encoding:'utf8'});
if(run.status!==0){console.error(run.stdout||'');console.error(run.stderr||'');process.exit(run.status||1)}
const xml=fs.readFileSync(sitemapPath,'utf8');
const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replace(site,''));
const failures=[];
const add=(name,ok,detail='')=>{if(!ok)failures.push(name+(detail?' — '+detail:''));console.log((ok?'PASS':'FAIL')+': '+name+(detail?' — '+detail:''));};
add('sitemap exists',xml.includes('<urlset'));
add('sitemap has no duplicate canonical URLs',new Set(locs).size===locs.length,`${locs.length} URLs`);
add('all core public routes are present',core.every(u=>locs.includes(u)));
add('all published fallback event routes are present',staticEventRoutes.every(u=>locs.includes(u)));
add('unpublished or archived fallback event routes are excluded',hiddenEventRoutes.every(u=>!locs.includes(u)));
add('all source-hub routes are canonical',locs.filter(u=>u.startsWith('/clubs/')).every(u=>allowed.has(u)));
add('legacy history alias is excluded from the canonical sitemap',!locs.includes('/history'));
add('no legacy JAI slug is emitted',!locs.includes('/events/agentic-ai-2026'));
add('no stale CodeAI slug is emitted',!locs.includes('/events/codeai-hackathon'));
add('no query strings or hashes are emitted',locs.every(u=>!/[?#]/.test(u)));
add('public URLs are lowercase and slash-normalized',locs.every(u=>u==='/'||(!/[A-Z]/.test(u)&&!u.endsWith('/'))));
add('image sitemap namespace is present',xml.includes('xmlns:image='));
add('image locations stay on the production origin',![...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].some(m=>!m[1].startsWith(site+'/')));
add('published fallback event routes remain unique',staticEventRoutes.every(u=>locs.filter(x=>x===u).length===1));
if(failures.length){console.error(`Sitemap QA failed: ${failures.length}`);process.exit(1)}
console.log(`PASS: sitemap contract (${locs.length} URLs)`);