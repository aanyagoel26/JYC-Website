import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx');
const metadata=read('src/extra-features.jsx');
const productionQa=read('scripts/qa-production.mjs');
const sitemapContract=read('scripts/qa-sitemap-contract.mjs');
const envExample=read('.env.example');
const gallery=read('src/jyc57-experience.jsx');
const responsive=read('src/jyc-responsive-photo.jsx');
const homeCss=read('src/jyc-editorial-home.css');
const design=read('src/jyc-design-upgrades.css');
const editorialHome=read('src/jyc-editorial-home.jsx');
const flip=read('src/components/react-bits/FlipCard.jsx');
const indexHtml=read('index.html');
const socials=read('src/jyc-socials.js');
const hubs=read('src/v21-hub-content.js');
const hubDetails=read('src/v23.6-hub-details.js');
const derivatives=read('scripts/generate-photo-derivatives.mjs');
const productionMediaOptimizer=read('scripts/optimize-production-media.mjs');
const imageManifestGenerator=read('scripts/generate-image-manifest.mjs');
const bot=read('src/jyc-bot.jsx');
const assistant=read('src/jyc-assistant.jsx');
const browser=read('scripts/browser-smoke.spec.js');
const browserRunner=read('scripts/qa-browser.mjs');
const browserWorkflow=read('.github/workflows/jyc-browser.yml');
const dither=read('src/react-bits/DitherVeil.jsx');
const bento=read('src/components/react-bits/MagicBento.jsx');
const bentoCss=read('src/components/react-bits/MagicBento.css');
const identities=read('src/hub-identities.js');
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
 ['club logo assets are contained identity marks rather than cropped card photography',gallery.includes('jyc57-club-fallback-logo')&&!gallery.includes('||club?.logo||\'\'')&&design.includes('object-fit:contain!important')],
 ['each event card receives its own title-based visual identity',gallery.includes('eventIdentity(e).accent||identityAccent(e.title||e.slug||e.club)')&&gallery.includes('jyc57-event-card')],
 ['Dither logo fallback is eager and resilient when WebGL is unavailable',dither.includes('loading="eager" fetchPriority="high"')&&dither.includes('catch {')&&dither.includes('container.dataset.static = \'1\'')&&dither.includes('img.onerror = () =>')&&dither.includes('img.onerror = null;')&&dither.includes("renderer?.gl?.getExtension('WEBGL_lose_context')?.loseContext()")],
 ['derivative candidates use intrinsic manifest dimensions and only approved photo assets',responsive.includes('photoDerivativeUrls(src,intrinsicWidth)')&&responsive.includes('const entry=manifest?.images?.[src]')&&responsive.includes('entry?.derivativesEligible===true')&&responsive.includes("fetch('/image-manifest.json'")&&responsive.includes('source-archive|hub-photos|hub-photos-extra')&&responsive.includes('if(!derivativesEnabled||!isDerivativeSource(src))')&&imageManifestGenerator.includes('derivativesEligible:derivativeEligible(url)')&&imageManifestGenerator.includes('derivativeArchiveUrls.has(url)')&&intelligence.includes('photoDerivativeUrls(url,sourceWidth)')&&intelligence.includes('width<=Number(sourceWidth)')],
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
 ['production media build emits a compact official-logo WebP derivative',productionMediaOptimizer.includes("const logoOutput=path.join(root,'assets','jyc-logo.webp')")&&productionMediaOptimizer.includes("path.resolve('public/JYC Logo(4).png')")&&productionMediaOptimizer.includes("webp({quality:92,effort:5,alphaQuality:100})")],
 ['GLB bot renders after model-viewer loads without a circular availability gate',bot.includes('modelReady&&!modelFailed?<model-viewer')&&bot.includes('onLoad={handleModelLoad}')&&bot.includes('setModelAvailable(true)')],
 ['GLB bot failure restores the safe fallback state',bot.includes('onError={handleModelError}')&&bot.includes('setModelAvailable(false)')&&bot.includes('setModelFailed(true)')],
 ['GLB bot animation respects reduced-motion preference',bot.includes("prefers-reduced-motion: reduce")&&bot.includes("if(prefersReducedMotion()){setMotion('');return}")],
 ['GLB bot keeps the bundled local model and avoids auto-rotation',bot.includes('src="/models/jyc-spatial.glb"')&&bot.includes('camera-orbit="0deg 75deg auto"')&&bot.includes('disable-zoom')],
 ['assistant dialog is labelled by its visible heading',assistant.includes('aria-labelledby="jyc-assistant-title"')&&assistant.includes('id="jyc-assistant-title"')],
 ['assistant brand uses compact official logo and falls back to the original PNG',assistant.includes("const JYC_LOGO=import.meta.env.PROD?'/assets/jyc-logo.webp':'/JYC%20Logo(4).png'")&&assistant.includes('src={JYC_LOGO}')&&assistant.includes('image.dataset.logoFallback="1"')&&assistant.includes('image.src="/JYC%20Logo(4).png"')],
 ['assistant keyboard focus is trapped and restored',assistant.includes('if(e.shiftKey&&(active===first||!root.contains(active)))')&&assistant.includes('target.focus({preventScroll:true})})};')],
 ['assistant quick routes use a compact two-column mobile layout',assistant.includes('grid-template-columns:repeat(2,minmax(0,1fr));gap:8px')],
 ['assistant quick routes have distinct destinations and stable keys',assistant.includes("const quick=context==='clubs'?[['Explore all clubs','/clubs'],['Upcoming events','/events'],['JYC archive','/archive'],['Contact JYC','/contact']]")&&assistant.includes('key={`${label}-${path}`}')],
 ['public pages balance headings and provide visible keyboard focus',globalStyles.includes(':focus-visible')&&globalStyles.includes('text-wrap:balance')&&globalStyles.includes('text-wrap:pretty')],
 ['editorial homepage uses the JYC antique-gold accent',homeCss.includes('--jh-accent:#bf9c6f')&&!homeCss.includes('--jh-accent:#e42b35')],
 ['gold primary actions use dark readable text and visible keyboard focus',homeCss.includes('.jh-btn-primary')&&homeCss.includes('color: #151316;')&&homeCss.includes(':focus-visible')],
 ['responsive photos enable derivatives in production',responsive.includes('import.meta.env.PROD')],
 ['route metadata shell generator is wired',pkg.scripts?.postbuild==='node scripts/optimize-production-media.mjs && node scripts/generate-route-shells.mjs'&&routeShells.includes("<link rel=\"canonical\" href=\"${siteOrigin}${route}\" />")&&routeShells.includes("/events/jai-2026-jaypee-agentic-ai-hackathon")],
 ['static route shells expose route-specific headings and a single primary heading',routeShells.includes('Clubs, Events &amp; Fests')&&routeShells.includes('Preparing the JYC experience…')&&routeShells.includes('const escapedTitle=meta.title.replaceAll')&&routeShells.includes('escapedTitle}$2')&&routeShells.includes('<noscript')&&routeShells.includes("'$1<p$2>$3</p>'")],
 ['route shells add valid route-specific WebPage JSON-LD',routeShells.includes("'@type':'WebPage'")&&routeShells.includes("url:`${siteOrigin}${route}`")&&routeShells.includes('isPartOf')&&routeShells.includes('application/ld+json')],
 ['browser suite guards static SEO across public route types with one H1',browser.includes('public route shells keep route-specific SEO content and one primary heading without JavaScript')&&browser.includes('JYC Communities & Clubs | JIIT Youth Club 128')&&browser.includes('JAI 2026 — Jaypee Agentic AI Hackathon | JYC')&&browser.includes('toHaveCount(1)')&&browser.includes('toHaveTitle(title)')&&browser.includes('link[rel="canonical"]')],
 ['browser suite validates route-specific WebPage structured data',browser.includes("schema['@type'] === 'WebPage'")&&browser.includes('schema.name === title && schema.url === canonical')],
 ['browser suite protects runtime canonical and Open Graph hosts on previews',browser.includes('runtime metadata keeps canonical URLs on the production domain from a preview host')&&browser.includes('meta[property="og:url"]')&&browser.includes('https://www.jiityouthclub128.in')],
 ['browser QA launches a production preview when no base URL is supplied',browserRunner.includes('node_modules/vite/bin/vite.js')&&browserRunner.includes("'--port','4173'")&&browserRunner.includes('JYC_BASE_URL:baseUrl')&&browserRunner.includes("preview.kill('SIGTERM')")],
 ['browser workflow builds production before running browser QA',browserWorkflow.includes('name: Build production bundle')&&browserWorkflow.includes('run: npm run build')&&browserWorkflow.includes('run: npm run qa:browser')],
 ['static SEO browser regression blocks Vite and all JavaScript module formats',browser.includes("/\.(?:js|jsx|mjs)$/")&&browser.includes("pathname === '/@vite/client'")&&browser.includes('return route.abort()')],
 ['route-shell canonicals ignore preview URL environment variables',routeShells.includes("process.env.VITE_CANONICAL_ORIGIN||process.env.JYC_CANONICAL_ORIGIN||'https://www.jiityouthclub128.in'")&&!routeShells.includes('process.env.VERCEL_URL')&&!routeShells.includes('process.env.VITE_SITE_URL')],
 ['sitemap canonicals ignore preview URL environment variables',sitemap.includes("process.env.VITE_CANONICAL_ORIGIN||process.env.JYC_CANONICAL_ORIGIN||'https://www.jiityouthclub128.in'")&&!sitemap.includes('process.env.VERCEL_URL')&&!sitemap.includes('process.env.VERCEL_PROJECT_PRODUCTION_URL')&&!sitemap.includes('process.env.VITE_SITE_URL')],
 ['runtime canonical and Open Graph metadata ignore preview hostnames',metadata.includes("import.meta.env.VITE_CANONICAL_ORIGIN||'https://www.jiityouthclub128.in'")&&!metadata.includes('const origin=(import.meta.env.VITE_SITE_URL||window.location.origin)')],
 ['canonical origin is documented for Vite and build-time generators',envExample.includes('VITE_CANONICAL_ORIGIN=https://www.jiityouthclub128.in')],
 ['production origin QA and sitemap contract use canonical override',productionQa.includes('process.env.VITE_CANONICAL_ORIGIN')&&productionQa.includes("env.includes('VITE_CANONICAL_ORIGIN=')")&&sitemapContract.includes('JYC_CANONICAL_ORIGIN:site')],
 ['route shells cover all static public entry pages', ['/announcements','/updates','/calendar','/fests','/recruitment','/join-jyc','/achievements','/best-of-jyc'].every(route=>routeShells.includes(`'${route}':`))],
 ['route shells cover maintained public hubs',routeShells.includes('JYC_HUB_SOURCE_REGISTRY')&&routeShells.includes("'/clubs/'+String(hub.name).toLowerCase().replace(/[^a-z0-9]+/g,'-')")],
 ['homepage hero uses the official logo through lazy Dither Veil without a continuous photo wall',editorialHome.includes('LazyDitherVeil')&&editorialHome.includes('jh-dither-mark')&&editorialHome.includes("const FALLBACK=import.meta.env.PROD?'/assets/jyc-logo.webp':'/JYC%20Logo(4).png'")&&editorialHome.includes('src={FALLBACK}')&&dither.includes('fallbackSrc = DEFAULT_SRC')&&dither.includes('dither-veil__fallback')&&!editorialHome.includes('LazyDriftWall')&&!design.includes('.jh-hero-drift-wall')],
 ['team flip-card renders children as front/back and keeps hidden links inert',flip.includes('Children.toArray(children)')&&flip.includes('frontContent=front??faces[0]')&&flip.includes('backContent=back??faces[1]')&&flip.includes('inert={!flipped}')&&main.includes('team-member-back-content')&&main.includes('safeExternalUrl(m.linkedin||m.socials?.linkedin)')],
 ['responsive photo fallback removes failed derivative source sets and retries PNG after WebP',responsive.includes("querySelectorAll('source')")&&responsive.includes("removeAttribute('srcset')")&&responsive.includes('image.src=next')&&responsive.includes('image.src="/JYC%20Logo(4).png"')&&responsive.includes("image.dataset.imageFallbackStage='2'")],
 ['club cards use real responsive hub photos and magnetic interaction',gallery.includes('clubCardPhoto(c)')&&gallery.includes('sourceHubMedia')&&gallery.includes('onPointerMove={magneticMove}')&&gallery.includes('identityAccent(c.name)')],
 ['event cards use source photography and unique visual accents',gallery.includes('eventCardPhoto(e)')&&gallery.includes('sourceEventMedia')&&gallery.includes('jyc57-event-art')&&gallery.includes('eventIdentity(e).accent||identityAccent(e.title||e.slug||e.club)')],
 ['public directories have responsive bento and reduced-motion contracts',design.includes('.jyc57-club-wall{display:grid')&&design.includes('.jyc57-club-card:nth-child')&&design.includes('@media(max-width:760px)')&&design.includes('@media(prefers-reduced-motion:reduce)')],
 ['about family cards use supplied orientation descriptions and community examples',main.includes('JYC_ORIENTATION_FAMILIES.find(item=>item.name===family)')&&main.includes('profile?.description')&&main.includes('profile?.examples')],
 ['search and More overlays use theme-aware surface tokens',design.includes('.search-modal,.more-sheet{background:var(--bg-card')&&design.includes(':root[data-theme="dark"] .search-modal')&&design.includes(':root[data-theme="dark"] .more-sheet')],
 ['boot screen uses the optimized official logo with PNG fallback and reduced-motion support',indexHtml.includes('src="/assets/jyc-logo.webp"')&&indexHtml.includes('data-boot-fallback="/JYC%20Logo(4).png"')&&indexHtml.includes('boot-logo')&&indexHtml.includes('.boot-fallback:after')&&indexHtml.includes('@media(prefers-reduced-motion:reduce)')],
 ['browser regression covers Dither Veil hero and team profile flip',browser.includes('homepage hero uses the official JYC logo through Dither Veil without a continuous photo wall')&&browser.includes('team profiles flip to readable biographies and verified LinkedIn links')],
 ['browser regression covers intended magnetic card movement',browser.includes('magnetic bento motion is limited to intended club and event cards')&&browser.includes('legacy public cards stay flat outside the intentional magnetic bento')],
 ['team flip browser test includes an official LinkedIn profile',browser.includes('team-member-flip:has(.team-social-row a[href*="linkedin.com"])')&&browser.includes("toHaveAttribute('href', /^https:\\/\\/(?:www\\.|in\\.)?linkedin\\.com\\//)")],
 ['hub social links remain separated by verified identity',socials.includes("Fortissimo: {},")&&socials.includes("Panache: {},")&&socials.includes("Prismatic: {},")&&socials.includes("JYC_SOCIAL_SOURCE_POLICY")],
 ['official club profiles and event history are source-verified without inventing upcoming events',socials.includes("verifiedOn: '2026-10-10'")&&socials.includes('TechTonic 2.0 with date TBA')&&socials.includes('Code Clash 25.2')&&socials.includes('VamUnique as the dance society of JIIT Sector 128')&&socials.includes('currently links registration; verify current status directly with the organiser')&&hubs.includes('550+ students')&&hubs.includes('current auditions and performance dates')&&hubs.includes('newly established in 2026')&&hubDetails.includes('AI Unlocked (11 August) and ROBOSPARK (21 September)')&&hubDetails.includes('The profile highlights contribution, collaboration and developer networking')&&hubDetails.includes('RIDE Innovation at JIIT Noida supports startup teams')&&hubDetails.includes('confirm current registration status directly with the organiser')],
 ['photo DriftWall is reserved for bounded gallery and event/community rails',metadata.includes('LazyDriftWall')&&metadata.includes('const wallItems=useMemo(()=>rankJycPhotoItems(items,{limit:24}),[items])')&&main.includes('event-drift-wall-section')&&main.includes('club-drift-wall-section')&&!editorialHome.includes('LazyDriftWall')],
 ['official hero logo uses the compact production asset and falls back only to the original JYC PNG',editorialHome.includes('<img className="jh-hero-logo"')&&editorialHome.includes('image.dataset.logoFallback="1"')&&editorialHome.includes('image.src="/JYC%20Logo(4).png"')&&editorialHome.includes('src={FALLBACK}')&&!editorialHome.includes('<Img className="jh-hero-logo"')],
 ['photo-only browser audit excludes the optimized and original official logo',browser.includes("'/JYC%20Logo(4).png','/assets/jyc-logo.webp'")&&browser.includes('new URL(img.currentSrc||img.src,window.location.href).pathname')&&browser.includes('jyc-logo\\.webp')],
 ['club, fest and event detail photography uses responsive image handling',main.includes('club-hero-photo-wall')&&main.includes('event-detail-poster-image-wrap')&&main.includes('fest-hero-photo-wall')&&main.includes("ResponsivePhoto src={e.summitLogo")],
 ['team flip focus and expanded-state assertions target the actual face controls',flip.includes('frontRef=useRef(null),backRef=useRef(null)')&&flip.includes('(flipped?backRef.current:frontRef.current)?.focus')&&flip.includes('flip-card__back-trigger')&&browser.includes("await card.locator('.flip-card__back-trigger').click()")&&browser.includes("await expect(card.locator('.flip-card__front')).toHaveAttribute('aria-expanded', 'true')")&&browser.includes("card.locator('.team-member-face-content .tag').first()")&&browser.includes("card.locator('.team-photo-editorial img').first()")],
 ['theme browser regression checks Search and More in both modes',browser.includes('search and More sheets keep their surfaces readable in light and dark themes')&&browser.includes("const darkSearch")&&browser.includes("const lightMore")],
 ['home identity browser regression covers Dither Veil logo and magnetic activity Bento',browser.includes('homepage renders the official logo through Dither Veil and a magnetic activity Bento')&&browser.includes('jh-dither-mark')&&browser.includes('magic-bento-card')],
 ['hero Dither Veil uses the real JYC logo, compact production source and PNG fallback',editorialHome.includes('LazyDitherVeil')&&editorialHome.includes('src={FALLBACK}')&&editorialHome.includes('fallbackSrc="/JYC%20Logo(4).png"')&&editorialHome.includes('jh-dither-mark')&&dither.includes('reducedMotion || coarsePointer')&&dither.includes('dither-veil__fallback')&&dither.includes('logoFallbackAttempted')],
 ['activity Bento is viewport-deferred, desktop-magnetic, router-safe, and resets transforms on leave',editorialHome.includes('LazyActivityBento activities={activities} nav={nav}')&&editorialHome.includes("rootMargin:'360px 0px'")&&editorialHome.includes('LazyMagicBento')&&editorialHome.includes('enableMagnetism={true}')&&bento.includes('onNavigate?onNavigate(item.href)')&&bento.includes('reducedMotion')&&bento.includes('gsap.to(el,vars)')&&bento.includes('x:0,y:0,rotateX:0,rotateY:0')&&bento.includes("clearProps:'transform'")&&bentoCss.includes('.magic-bento-card')&&homeCss.includes('magic-bento-card:nth-child(8){grid-column:span 2}')&&homeCss.includes('magic-bento-card:nth-child(8){grid-column:auto}')],
 ['magnetic Bento coalesces pointer movement per frame, cancels pending work and guards zero-size cards',bento.includes('let moveFrame=0,lastEvent=null')&&bento.includes('moveFrame=requestAnimationFrame')&&bento.includes('if(moveFrame){cancelAnimationFrame(moveFrame);moveFrame=0}')&&bento.includes('if(moveFrame)cancelAnimationFrame(moveFrame)')&&bento.includes('Math.max(cy,1)')&&bento.includes('Math.max(cx,1)')],
 ['club identities remain distinct while staying inside the JYC palette',identities.includes('const BASE=')&&identities.includes('accent:')&&identities.includes('motif:')&&homeCss.includes('--jh-accent:#bf9c6f')],
 ['team flip-back reads biography, LinkedIn headline fields and safe public social links',main.includes('m.bio||m.about||m.description||m.linkedinBio||m.linkedin_bio')&&main.includes('m.linkedinHeadline||m.linkedin_headline||m.headline||m.tagline')&&main.includes('safeExternalUrl(m.linkedin||m.linkedinUrl||m.linkedin_url||m.socials?.linkedin)')&&main.includes('team-member-headline')&&main.includes('aria-label={`Open ${name} LinkedIn profile`}')&&flip.includes('aria-expanded={flipped}')],
 ['team and directory media use lazy responsive images',main.includes('<ResponsivePhoto src={photo} alt={name} loading="lazy"')&&gallery.includes('ResponsivePhoto src={photo} alt="" loading="lazy"')&&gallery.includes('ResponsivePhoto src={photo} alt="" loading="lazy" decoding="async"')],
 ['About family tiles expose supplied PDF examples',main.includes('profile?.examples||[]')&&main.includes('profile?.description||')&&design.includes('.about-family-grid-v28>button>p')]
];
let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+' · '+name);if(!ok)failed++}
if(failed)process.exit(1);
console.log('JYC V64 editorial/release contract PASS ('+checks.length+' checks)');
