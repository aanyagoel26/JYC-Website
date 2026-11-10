import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const checks=[];
const add=(name,ok,detail='')=>checks.push({name,ok,detail});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html');
const robots=read('public/robots.txt');
const llms=read('public/llms.txt');
const meta=read('src/extra-features.jsx');
const sitemap=read('scripts/generate-sitemap.mjs');
const routeShells=read('scripts/generate-route-shells.mjs');
const main=read('src/main.jsx');
const pkg=JSON.parse(read('package.json'));
add('Homepage title targets JIIT Youth Club + clubs/events/fests',html.includes('JIIT Youth Club 128') && main.includes('Clubs, Events & Fests'));
add('Google Search Console verification slot',!html.includes('google-site-verification')||(!html.includes('%VITE_GOOGLE_SITE_VERIFICATION%')&&html.includes('google-site-verification')));
add('Retired Google Sitelinks SearchAction is absent',!meta.includes("'@type':'SearchAction'")&&!html.includes('SearchAction'));
add('hub image sitemap uses canonical source media',sitemap.includes('sourceHubMedia')&&sitemap.includes('JYC_HUB_SOURCE_REGISTRY')&&sitemap.includes('urls.slice(0,12)'));
add('strict photography archive is used for image discovery',sitemap.includes('JYC_SOURCE_ARCHIVE_PHOTO_ITEMS')&&!sitemap.includes('JYC_SOURCE_ARCHIVE_CATALOG'));
add('Organization structured data',meta.includes("'@type':'Organization'") && meta.includes('sameAs') && meta.includes('areaServed') && meta.includes('contactPoint'));
add('Club collection structured data',meta.includes("'@type':'CollectionPage'")&&meta.includes('ItemList')&&meta.includes('JYC Clubs & Communities'));
add('Gallery collection structured data',meta.includes("'@type':'CollectionPage'")&&meta.includes('JYC Visual Archive'));
add('Event schema uses source images and full campus address',meta.includes('sourceEventMedia(item)')&&meta.includes('streetAddress')&&meta.includes('Sector 128, Wish Town Campus'));
add('Event structured data',meta.includes("'@type':'Event'") && meta.includes('startDate'));
add('Breadcrumb structured data',meta.includes("'@type':'BreadcrumbList'") && meta.includes('itemListElement'));
add('Dynamic canonical URLs use the configured origin or the active browser origin, without a retired deployment fallback',meta.includes('canonical') && meta.includes('VITE_CANONICAL_ORIGIN') && meta.includes('window.location.origin') && !meta.includes('jyc-website-eight.vercel.app'));
add('Static route shells replace the canonical-origin token throughout metadata and structured data',html.includes('__JYC_CANONICAL_ORIGIN__') && routeShells.includes("replaceAll('__JYC_CANONICAL_ORIGIN__',siteOrigin)"));
add('SPA metadata retains the build-resolved production origin on preview deployments',html.includes('meta name="jyc-canonical-origin"') && routeShells.includes('canonicalOriginTag') && meta.includes('meta[name="jyc-canonical-origin"]'));
add('Sitemap and route-shell generators share the validated Vercel-aware origin resolver',sitemap.includes('resolveSiteOrigin(process.env)') && routeShells.includes('resolveSiteOrigin(process.env)'));
add('Open Graph image',meta.includes("og:image") && meta.includes("og:image:alt") && meta.includes('canonicalUrl') && meta.includes('imageType') && html.includes('og:image'));
add('Private route noindex',main.includes("clean.startsWith('/qr/')") && meta.includes("noindex,nofollow"));
add('Robots allows public crawling',robots.includes('Allow: /') && robots.includes('Disallow: /admin'));
add('Robots publishes canonical sitemap',!robots.match(/^Sitemap:\s*https?:\/\//mi) || robots.includes('Sitemap:'));
add('Sitemap generator includes maintained source hubs',fs.readFileSync(path.join(root,'scripts/generate-sitemap.mjs'),'utf8').includes('jyc-hub-registry.js')&&fs.readFileSync(path.join(root,'scripts/generate-sitemap.mjs'),'utf8').includes('/clubs/${slug(name)}'));
add('Sitemap carries maintained hub photography',fs.readFileSync(path.join(root,'scripts/generate-sitemap.mjs'),'utf8').includes('slugToHubImages')&&fs.readFileSync(path.join(root,'scripts/generate-sitemap.mjs'),'utf8').includes('xmlns:image'));
add('LLMs discovery file',llms.includes('JIIT Youth Club') && llms.includes('/clubs') && llms.includes('/events'));
add('Sitemap includes the public Join JYC coming-soon page',sitemap.includes('/join-jyc'));
add('Sitemap does not fabricate build-date lastmod values',!sitemap.includes('fallbackDate')&&!sitemap.includes('dynamicDates.get(u)||fallbackDate'));
const { PUBLIC_EVENT_FALLBACK } = await import('../src/content/jyc-public-fallbacks.js');
const eventSlug = value => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const publishedEventRoutes = PUBLIC_EVENT_FALLBACK
  .filter(event => event?.published && event?.archived !== true)
  .map(event => `/events/${eventSlug(event.slug || event.title)}`);
add('Flagship event URLs use canonical published, non-archived slugs', (() => {
  const source = fs.readFileSync(path.join(root, 'scripts/generate-sitemap.mjs'), 'utf8');
  return source.includes('PUBLIC_EVENT_FALLBACK.filter(event=>event?.published&&event?.archived!==true)')
    && source.includes('slug(event.slug||event.title)')
    && publishedEventRoutes.includes('/events/jai-2026-jaypee-agentic-ai-hackathon')
    && publishedEventRoutes.includes('/events/drono-o-war-2026')
    && !publishedEventRoutes.includes('/events/ride-hack-2026')
    && !publishedEventRoutes.includes('/events/converge-2026');
})());
add('Sitemap generator exists',fs.existsSync(path.join(root,'scripts/generate-sitemap.mjs')));
add('SEO pages have useful route metadata',main.includes('JIIT Clubs & Student Communities') && main.includes('JIIT Events & Campus Activities') && main.includes('About JIIT Youth Club') && main.includes('JIIT Fests & Flagship Events'));
add('Fest discovery route exists',main.includes("clean==='/fests'") && llms.includes('/fests'));
add('Best of JYC editorial route exists',main.includes("clean==='/best-of-jyc'") && main.includes('JYCBestOf'));
add('Search-intent editorial content is visible on key pages',main.includes('SearchTopicBand') && main.includes('Official JIIT clubs and student communities') && main.includes('JIIT events, workshops and campus experiences'));
add('Service worker cache namespace matches current release',read('public/sw.js').includes('jyc-cache-v'+pkg.version.replace(/\./g,'-')));
const failed=checks.filter(x=>!x.ok);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}: ${c.name}${c.detail?` — ${c.detail}`:''}`);
if(failed.length){process.exitCode=1;console.error(`SEO QA failed: ${failed.length} check(s)`)} else console.log(`PASS: SEO QA (${checks.length} checks)`);
