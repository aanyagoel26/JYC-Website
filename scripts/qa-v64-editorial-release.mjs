import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx');
const gallery=read('src/jyc57-experience.jsx');
const responsive=read('src/jyc-responsive-photo.jsx');
const homeCss=read('src/jyc-editorial-home.css');
const derivatives=read('scripts/generate-photo-derivatives.mjs');
const bot=read('src/jyc-bot.jsx');
const assistant=read('src/jyc-assistant.jsx');
const browser=read('scripts/browser-smoke.spec.js');
const globalStyles=read('src/styles.css');
const intelligence=read('src/jyc-photo-intelligence.js');
const routeShells=read('scripts/generate-route-shells.mjs');
const sitemap=read('scripts/generate-sitemap.mjs');
const pkg=JSON.parse(read('package.json'));
const checks=[
 ['society detail exposes organisation, activities, events, people and photography',/function ClubDetail/.test(main)&&/HUB PROFILE/.test(main)&&/ACTIVITIES/.test(main)&&/EVENTS/.test(main)&&/PEOPLE/.test(main)&&/CLUB PHOTOGRAPHY/.test(main)],
 ['event detail has lifecycle state and participation action',/eventState\(e\)/.test(main)&&/LIVE NOW/.test(main)&&/REGISTER NOW/.test(main)&&/REGISTRATION CLOSED/.test(main)],
 ['event card and detail share the same media layout id',main.includes('layoutId={\`event-media-\${slug(e.id||e.slug||e.title)}\`')&&main.includes('event-detail-poster')],
 ['gallery card and lightbox share the same media layout id',gallery.includes('layoutId={\`photo-\${String(g.id||g.url)}\`')&&gallery.includes('layoutId={\`photo-\${String(active.id||active.url)}\`}')],
 ['gallery transition is reduced-motion aware',gallery.includes('shouldReduceMotion?0:.28')],
 ['responsive photos provide AVIF/WebP srcset and sizes',responsive.includes('srcSet={sourceSet(variants.avif)}')&&responsive.includes('srcSet={sourceSet(variants.webp)}')&&responsive.includes('sizes={sizes}')],
 ['derivative candidates respect source dimensions',responsive.includes('photoDerivativeUrls(src,width)')&&intelligence.includes('photoDerivativeUrls(url,sourceWidth)')&&intelligence.includes('width<=Number(sourceWidth)*1.15')],
 ['canonical JAI slug is the only sitemap slug',sitemap.includes('/events/jai-2026-jaypee-agentic-ai-hackathon')&&!sitemap.includes('/events/agentic-ai-2026')&&!sitemap.includes('/events/codeai-hackathon')],
 ['sitemap resolves dynamic event slugs from canonical data',sitemap.includes('slug(e.slug||e.title)')],
 ['legacy JAI redirect remains explicit in runtime',main.includes("legacyEventSlugMap={'agentic-ai-2026':'jai-2026-jaypee-agentic-ai-hackathon'}")],
 ['Sector 128 event boundary remains enforced',main.includes('isSector128Venue')&&main.includes('events.filter(e=>isSector128Venue')],
 ['editorial QA remains wired',pkg.scripts?.['qa:editorial']==='node scripts/qa-editorial-system.mjs'],
 ['new V64 QA is wired',pkg.scripts?.['qa:v64-editorial']==='node scripts/qa-v64-editorial-release.mjs'],
 ['release metadata is V64',/^64\.\d+\.\d+$/.test(pkg.version)],
 ['production prebuild generates real photo derivatives',pkg.scripts?.prebuild?.includes('generate-photo-derivatives.mjs')],
 ['desktop homepage headline is constrained to its copy column',homeCss.includes('font-size: clamp(48px, 4.5vw, 78px) !important;')&&homeCss.includes('line-height: .9 !important;')],
 ['tablet homepage headline has its own responsive scale',homeCss.includes('font-size: clamp(58px, 8.5vw, 92px) !important;')],
 ['mobile hero CTAs use equal flexible columns',homeCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr));')&&homeCss.includes('min-height: 48px;')],
 ['contact route exposes a primary H1',main.includes('function SectionHead({eyebrow,title,text,level=2})')&&main.includes('<SectionHead level={1} eyebrow="CONTACT"')],
 ['photo derivative encoding uses build-friendly effort settings',derivatives.includes('.avif({quality:52,effort:2})')&&derivatives.includes('.webp({quality:82,effort:3})')&&derivatives.includes('completed%25===0')],
 ['GLB bot renders after model-viewer loads without a circular availability gate',bot.includes('modelReady&&!modelFailed?<model-viewer')&&bot.includes('onLoad={handleModelLoad}')&&bot.includes('setModelAvailable(true)')],
 ['GLB bot failure restores the safe fallback state',bot.includes('onError={handleModelError}')&&bot.includes('setModelAvailable(false)')&&bot.includes('setModelFailed(true)')],
 ['GLB bot animation respects reduced-motion preference',bot.includes("prefers-reduced-motion: reduce")&&bot.includes("if(prefersReducedMotion()){setMotion('');return}")],
 ['GLB bot keeps the bundled local model and avoids auto-rotation',bot.includes('src="/models/jyc-spatial.glb"')&&bot.includes('camera-orbit="0deg 75deg auto"')&&bot.includes('disable-zoom')],
 ['assistant dialog is labelled by its visible heading',assistant.includes('aria-labelledby="jyc-assistant-title"')&&assistant.includes('id="jyc-assistant-title"')],
 ['assistant keyboard focus is trapped and restored',assistant.includes('if(e.shiftKey&&(active===first||!root.contains(active)))')&&assistant.includes('target.focus({preventScroll:true})})};')],
 ['assistant quick routes use a compact two-column mobile layout',assistant.includes('grid-template-columns:repeat(2,minmax(0,1fr));gap:8px')],
 ['assistant quick routes have distinct destinations and stable keys',assistant.includes("const quick=context==='clubs'?[['Explore all clubs','/clubs'],['Upcoming events','/events'],['JYC archive','/archive'],['Contact JYC','/contact']]")&&assistant.includes('key={`${label}-${path}`}')],
 ['public pages balance headings and provide visible keyboard focus',globalStyles.includes(':focus-visible')&&globalStyles.includes('text-wrap:balance')&&globalStyles.includes('text-wrap:pretty')],
 ['editorial homepage uses the JYC antique-gold accent',homeCss.includes('--jh-accent:#bf9c6f')&&!homeCss.includes('--jh-accent:#e42b35')],
 ['gold primary actions use dark readable text and visible keyboard focus',homeCss.includes('.jh-btn-primary')&&homeCss.includes('color: #151316;')&&homeCss.includes(':focus-visible')],
 ['responsive photos enable derivatives in production',responsive.includes('import.meta.env.PROD')],
 ['route metadata shell generator is wired',pkg.scripts?.postbuild==='node scripts/optimize-production-media.mjs && node scripts/generate-route-shells.mjs'&&routeShells.includes("<link rel=\"canonical\" href=\"${siteOrigin}${route}\" />")&&routeShells.includes("/events/jai-2026-jaypee-agentic-ai-hackathon")],
 ['static route shells expose route-specific headings before React hydrates',routeShells.includes('Clubs, Events &amp; Fests')&&routeShells.includes('Preparing the JYC experience…')&&routeShells.includes('const escapedTitle=meta.title.replaceAll')&&routeShells.includes('escapedTitle}$2')],
 ['browser suite guards JAI route SEO with JavaScript disabled',browser.includes('JAI event route has route-specific static SEO content without JavaScript')&&browser.includes("toHaveTitle('JAI 2026 — Jaypee Agentic AI Hackathon | JYC')")&&browser.includes("getByRole('heading', { level: 1 })")&&browser.includes("link[rel=\"canonical\"]")],
 ['route-shell canonicals use a stable production origin fallback',!routeShells.includes('process.env.VERCEL_URL')&&routeShells.includes("process.env.VITE_SITE_URL||'https://www.jiityouthclub128.in'")],
 ['sitemap uses a stable production origin fallback',!sitemap.includes('process.env.VERCEL_URL')&&sitemap.includes("process.env.VERCEL_PROJECT_PRODUCTION_URL||'https://www.jiityouthclub128.in'")],
 ['route shells cover all static public entry pages', ['/announcements','/updates','/calendar','/fests','/recruitment','/join-jyc','/achievements','/best-of-jyc'].every(route=>routeShells.includes(`'${route}':`))],
 ['route shells cover maintained public hubs',routeShells.includes('JYC_HUB_SOURCE_REGISTRY')&&routeShells.includes("'/clubs/'+String(hub.name).toLowerCase().replace(/[^a-z0-9]+/g,'-')")]
];
let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+' · '+name);if(!ok)failed++}
if(failed)process.exit(1);
console.log('JYC V64 editorial/release contract PASS ('+checks.length+' checks)');
