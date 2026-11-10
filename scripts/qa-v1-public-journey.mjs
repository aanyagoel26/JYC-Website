import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=file=>fs.readFileSync(file,'utf8');
const home=read('src/jyc-editorial-home.jsx');
const css=read('src/jyc-editorial-home.css');
const main=read('src/main.jsx');
const config=read('src/public-v1/config.js');
const registration=read('src/extra-features.jsx');
const gallery=read('src/jyc57-experience.jsx');
const motion=read('src/jyc-innovation-motion.jsx');
const motionCss=read('src/styles/jyc-cohesive-experience.css');
const icons=read('src/components/JYCIcon.jsx');
const emblem=read('src/components/JYCHeroWebGLEmblem.jsx');

const checks=[
  ['homepage hero action group is present',home.includes('className="jh-actions jh-hero-actions"')],
  ['shared JYC line icons are used for navigation and dialog controls',icons.includes('export function JYCIcon')&&main.includes("import {JYCIcon} from './components/JYCIcon.jsx'")&&main.includes('function NavIcon({kind}){return <JYCIcon name={kind}/>;}')&&main.includes('<JYCIcon name="close" size={16}/>')],
  ['route transitions use transform/opacity and respect reduced or user-paused motion',main.includes('className="route-stage"')&&motionCss.includes('@keyframes jycRouteEnter')&&motionCss.includes('html[data-jyc-motion="paused"] .route-stage')&&motionCss.includes('@media (prefers-reduced-motion: reduce)')],
  ['users can pause and resume decorative motion from the More JYC sheet',main.includes('function MotionPreferenceControl')&&main.includes('aria-pressed={paused}')&&main.includes("storageSet('jyc-motion-preference'")&&main.includes('jyc-motion-preference-change')],
  ['ambient motion pauses across CSS and canvas effects without hiding page content',motion.includes('jyc-motion-preference-change')&&motion.includes('userPaused')&&motionCss.includes('html[data-jyc-motion="paused"]')&&motionCss.includes('animation-play-state: paused')],
  ['homepage pauses the OGL field and keeps the static crest when the user pauses motion',home.includes('LazyJYCWebGLField')&&home.includes('motionPaused')&&home.includes('setHeroFieldReady(false)')&&!home.includes('LazyDitherVeil')&&!emblem.includes('requestAnimationFrame')],
  ['homepage is route-lazy so OGL and the hero shader stay out of non-home startup',main.includes("const LazyJYCEditorialHome=lazy(()=>import('./jyc-editorial-home.jsx')")&&main.includes('<LazyJYCEditorialHome data={data}/>')],
  ['command search is loaded only when opened, not in the initial public shell',main.includes("const LazyJYCSearch=lazy(()=>import('./search/jyc-search.jsx')")&&main.includes('<LazyJYCSearch data={data}')&&!main.includes("JYCSearch as Search")],
  ['public routes paint curated/cache-backed content before asynchronous live refresh',main.includes('mergePublicFallback(norm(readSiteCache()||empty),{allowContentFallback:true,allowGalleryFallback:false,allowTeamFallback:true})')&&main.includes('const [loading,setLoading]=useState(false)')&&main.includes('const [bootReady,setBootReady]=useState(true)')],
  ['homepage exposes community, event and Join JYC routes',home.includes("nav('/events')")&&home.includes("nav('/clubs')")&&home.includes("nav('/join-jyc')")&&home.includes('Explore communities')&&home.includes('See what’s on')&&home.includes('Join JYC')],
  ['homepage has an editorial introduction and lazy activity discovery',home.includes('jh-about-editorial')&&home.includes('LazyActivityBento activities={activities} nav={nav}')],
  ['homepage avoids unsupported hub and student-reach counters',!home.includes('23+ hubs')&&!home.includes('5,000+')&&!home.includes('thousands of students')],
  ['Join JYC route stays honest about recruitment state',main.includes("clean==='/join-jyc'")&&main.includes('function JoinJYC')&&main.includes('coming soon')],
  ['public registration route is external-only after native RPC revocation',registration.includes('Public native registration is disabled.')&&!registration.includes('className="native-registration"')&&!registration.includes("supabase.rpc('jyc_register_for_event'")],
  ['public external registration URL is validated before rendering a CTA',registration.includes('function safeExternalUrl(value)')&&registration.includes("['http:','https:'].includes(u.protocol)")&&registration.includes('safeExternalUrl(event.registrationUrl)')],
  ['event detail derives registration state from verified dates and URLs',main.includes("const registrationPublished=e.publicStatus!=='planned'||e.registrationVerified===true")&&main.includes('Boolean(safeExternalUrl(e.registrationUrl))')&&main.includes('registrationDeadline')],
  ['event registration labels distinguish planned, open and closed states',main.includes('REGISTRATION NOT PUBLISHED')&&main.includes('REGISTRATION CLOSED')&&main.includes('REGISTER NOW')],
  ['external event registration opens with safe window features',main.includes("window.open(safeExternalUrl(e.registrationUrl),'_blank','noopener,noreferrer')")&&main.includes('rel="noopener noreferrer"')],
  ['event detail links use source slugs',main.includes("nav('/events/'+slug(e.slug||e.title))")||main.includes('eventPath(e)')],
  ['event categories come from the current public configuration',config.includes('JYC_EVENT_CATEGORIES')&&config.includes('Technical')&&config.includes('Cultural')&&config.includes('Sports')],
  ['public information routes remain registered',['/about','/team','/events','/clubs','/gallery','/contact','/calendar','/announcements'].every(route=>main.includes(`'${route}'`))],
  ['gallery supports published albums and shareable photo URLs',gallery.includes('jyc_media_albums')&&gallery.includes("params.get('photo')")&&gallery.includes("const albumRoute=value=>'/gallery/'+encodeURIComponent(value)")],
  ['hero and action layouts support mobile and reduced motion',css.includes('@media (max-width: 760px)')&&css.includes('@media (prefers-reduced-motion: reduce)')]
];
let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failed++}
if(failed){console.error('\nJYC current public journey QA failed: '+failed+' contract(s).');process.exit(1)}
console.log('\nJYC current public journey contract: PASS ('+checks.length+' assertions)');
