import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const drift=read('src/components/react-bits/DriftWall.jsx');
const dither=read('src/react-bits/DitherVeil.jsx');
const bento=read('src/components/react-bits/MagicBento.jsx');
const home=read('src/jyc-editorial-home.jsx');
const hero=read('src/components/JYCHeroWebGLEmblem.jsx');
const explorer=read('src/components/JYC3DInteractiveExplorer.jsx');
const main=read('src/main.jsx');
const failures=[];
let totalChecks=0;
const check=(name,ok)=>{totalChecks++;console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failures.push(name)};

check('DriftWall does not schedule an idle RAF when reduced/low-power/offscreen',drift.includes('if(reduced||lowPower||!visible.current)')&&drift.includes('if(!reduced&&!lowPower&&visible.current)frame.current=requestAnimationFrame(animate)'));
check('Homepage uses one accessible responsive crest, a lazy OGL sky and the magnetic Bento',home.includes('JYCHeroWebGLEmblem')&&home.includes('heroFieldReady')&&home.includes('LazyJYCWebGLField')&&!home.includes('LazyDitherVeil')&&!home.includes('LazyDriftWall')&&home.includes('jh-hero-webgl-stage-wrap')&&home.includes('activities.map'));
check('DriftWall remains bounded on event and club rails',main.includes('event-drift-wall-section')&&main.includes('club-drift-wall-section')&&main.includes('.slice(0,18)')&&main.includes('.slice(0,24)'));
check('DriftWall remains bounded on Gallery page',read('src/extra-features.jsx').includes('const wallItems=useMemo(()=>rankJycPhotoItems(items,{limit:24}),[items])'));
check('DriftWall images are lazy and async decoded',drift.includes('loading="lazy"')&&drift.includes('decoding="async"'));
check('DitherVeil uses capped-DPR WebGL on capable touch devices and a static fallback for reduced motion or constrained hardware',dither.includes("(pointer: coarse)")&&dither.includes('reducedMotion || constrainedHardware')&&dither.includes('dither-veil__fallback')&&dither.includes('dpr: coarsePointer ? 1'));
check('The OGL hero field caps desktop rendering and reduces resolution on ordinary hardware',read('src/components/JYCWebGLField.jsx').includes('reducedQuality ? 1000 / 24 : 1000 / 30')&&read('src/components/JYCWebGLField.jsx').includes('reducedQuality || coarse ? 1.1 : 1.35'));
check('Homepage does not mount a duplicate Dither crest, animated orbital canvas or model viewer',!home.includes('LazyDitherVeil')&&!home.includes('jh-hero-dither-layer')&&!hero.includes('requestAnimationFrame')&&!hero.includes('model-viewer'));
check('MagicBento disables heavy effects on coarse/mobile/reduced-motion',bento.includes('(pointer:coarse)')&&bento.includes("'(prefers-reduced-motion: reduce)'")&&bento.includes('const disabled=disableAnimations||mobile||reducedMotion||userPaused'));
check('MagicBento combines tilt/magnetism in one tween and resets on pointer leave',bento.includes('gsap.to(el,vars)')&&bento.includes('x:0,y:0,rotateX:0,rotateY:0')&&bento.includes("clearProps:'transform'"));
check('MagicBento coalesces pointer movement to one animation frame, cancels pending work and guards zero-size cards',bento.includes('let moveFrame=0,lastEvent=null')&&bento.includes('moveFrame=requestAnimationFrame')&&bento.includes('if(moveFrame){cancelAnimationFrame(moveFrame);moveFrame=0}')&&bento.includes('if(moveFrame)cancelAnimationFrame(moveFrame)')&&bento.includes('Math.max(cy,1)')&&bento.includes('Math.max(cx,1)'));
check('MagicBento does not permanently reserve transform compositing',read('src/components/react-bits/MagicBento.css').includes('.magic-bento-card:hover{will-change:transform')&&!read('src/components/react-bits/MagicBento.css').includes('background:#18161d;color:#fff8e9;isolation:isolate;box-shadow:0 16px 40px rgba(17,19,24,.08);transform-style:preserve-3d;will-change:transform'));
check('Homepage non-critical imagery stays lazy',home.includes('loading="lazy"'));
check('Crest tilt and OGL sky respect reduced motion while Bento disables pointer effects',read('src/components/JYCHeroWebGLEmblem.css').includes('prefers-reduced-motion:reduce')&&read('src/components/JYCHeroWebGLEmblem.jsx').includes("'(prefers-reduced-motion: reduce)'")&&read('src/components/JYCWebGLField.jsx').includes("prefers-reduced-motion")&&bento.includes("'(pointer:coarse)'")&&bento.includes("'(prefers-reduced-motion: reduce)'")&&bento.includes('const disabled=disableAnimations||mobile||reducedMotion||userPaused'));
check('hero emblem has no continuous canvas loop, particles or autoplay effects',!hero.includes('requestAnimationFrame')&&!hero.includes('jyc-emblem-canvas')&&!hero.includes('particleCount')&&!hero.includes('jycAudio'));
check('3D explorer content is generated only from published hub registry records',explorer.includes("JYC_HUB_SOURCE_REGISTRY")&&explorer.includes("hub.publicationStatus === 'published'")&&explorer.includes("JYC_HUB_CONTENT[hub.name]"));
check('3D explorer has no unsupported static membership counts or independent content inventory',!explorer.includes("members: '")&&!explorer.includes("120+ Active")&&!explorer.includes("250+ Devs")&&!explorer.includes("80+ Pilots"));
check('community explorer uses a static, data-driven directory instead of an always-running 3D canvas',!explorer.includes('requestAnimationFrame')&&!explorer.includes('WebGLRenderer')&&explorer.includes('JYC_HUB_SOURCE_REGISTRY'));
check('community directory remains motion-light and does not create background animation loops',!explorer.includes('requestAnimationFrame')&&!explorer.includes('setInterval')&&read('src/components/JYC3DInteractiveExplorer.css').includes('@media (prefers-reduced-motion: reduce)'));
check('community directory exposes keyboard-operable search, pressed-state family filters and navigable cards',explorer.includes('aria-label="Search published JYC communities"')&&explorer.includes('aria-pressed={active}')&&explorer.includes('navigate(`/clubs/${hub.id}`)')&&explorer.includes('role="status"'));

check('Official hero crest uses a responsive AVIF source with WebP and original PNG fallbacks',hero.includes("const LOGO_SRC = '/assets/jyc-logo.avif'")&&hero.includes("const LOGO_FALLBACK = '/assets/jyc-logo.webp'")&&hero.includes('LOGO_ORIGINAL')&&hero.includes('srcSet={import.meta.env.PROD ?')&&hero.includes('onError='));
check('Standalone DitherVeil retains its optional global pointer lifecycle',dither.includes("window.addEventListener('pointermove', onGlobalMove")&&dither.includes("window.removeEventListener('pointermove', onGlobalMove"));
check('DitherVeil optimized source and fallback assets are present in the public build',fs.existsSync('public/assets/jyc-logo.avif')&&fs.existsSync('public/assets/jyc-logo.webp'));
check('DitherVeil keeps WebGL enabled on typical four-core mobile devices while retaining a low-memory fallback',dither.includes('const constrainedHardware = (navigator.hardwareConcurrency || 4) < 4 || (navigator.deviceMemory || 4) < 2')&&dither.includes('coarsePointer ? 1'));
check('ambient canvas skips continuous rendering on constrained or data-saver devices',read('src/jyc-innovation-motion.jsx').includes('(navigator.hardwareConcurrency || 8) <= 4')&&read('src/jyc-innovation-motion.jsx').includes('(navigator.deviceMemory || 8) < 4')&&read('src/jyc-innovation-motion.jsx').includes('navigator.connection?.saveData'));
check('ambient atmosphere canvas is fixed, non-interactive and hidden for reduced motion',read('src/jyc-innovation-motion.css').includes('.jyc-ambient-canvas')&&read('src/jyc-innovation-motion.css').includes('position:fixed')&&read('src/jyc-innovation-motion.css').includes('pointer-events:none')&&read('src/jyc-innovation-motion.css').includes('@media(prefers-reduced-motion:reduce)'));
check('reveal content is visible before motion enhancement initializes and only hides after observer setup',read('src/jyc-innovation-motion.css').includes('.public-app .reveal{opacity:1;transform:none}')&&read('src/jyc-innovation-motion.css').includes('html.jyc-motion-ready .public-app .reveal')&&read('src/jyc-innovation-motion.jsx').includes("document.documentElement.classList.add('jyc-motion-ready')")&&read('src/jyc-innovation-motion.jsx').includes("document.documentElement.classList.remove('jyc-motion-ready')"));
const motionSource = read('src/jyc-innovation-motion.jsx');
const supportsMotionQueryChange = motionSource.includes('motionQuery.addEventListener?.') ||
  (motionSource.includes("typeof motionQuery.addEventListener === 'function'") &&
    motionSource.includes('motionQuery.addListener?.(onMotionChange)'));
const supportsCanvasCleanup = motionSource.includes('ctx.clearRect(0, 0, width, height)');
check(
  'route reveal observes SPA-inserted content and gracefully reveals content without IntersectionObserver',
  motionSource.includes('new MutationObserver') &&
    motionSource.includes("typeof IntersectionObserver !== 'function'") &&
    motionSource.includes('jyc-motion-visible') &&
    supportsMotionQueryChange &&
    supportsCanvasCleanup
);
check('MagicBento disables pointer-driven GSAP effects when the user pauses decorative motion',bento.includes('userPaused')&&bento.includes('jyc-motion-preference-change')&&bento.includes('||userPaused'));
check('homepage OGL field returns to its static fallback when decorative motion is paused',home.includes('motionPaused')&&home.includes('setHeroFieldReady(false)')&&home.includes('jyc-motion-preference-change'));
check('ambient canvas keeps touch-first devices on the static CSS atmosphere',read('src/jyc-innovation-motion.jsx').includes('lowPower || reducedCanvas || isCoarsePointer'));
check('homepage ambient orbs remain static on touch-first devices and reduced motion',read('src/styles/jyc-home-final-refinement.css').includes('.jh-ambient-orb {animation:none!important')&&read('src/styles/jyc-home-final-refinement.css').includes('prefers-reduced-motion:reduce'));
check('full-page atmospheric drift is static on touch-first devices',read('src/styles/jyc-final-refinement.css').includes('@media(max-width:760px),(hover:none),(pointer:coarse)')&&read('src/styles/jyc-final-refinement.css').includes('body::after {animation:none!important}'));
check('ambient canvas cancels its animation frame when decorative motion is paused',read('src/jyc-innovation-motion.jsx').includes('userPaused')&&read('src/jyc-innovation-motion.jsx').includes('window.addEventListener(\'jyc-motion-preference-change\''));
check('main shell does not eagerly import Motion or command search; search is demand-loaded',!main.includes("from 'motion/react'")&&!main.includes('JYCSearch as Search')&&main.includes("const LazyJYCSearch=lazy(()=>import('./search/jyc-search.jsx')")&&main.includes('<LazyJYCSearch data={data}'));

const revealSetup=read('src/jyc-innovation-motion.jsx').slice(read('src/jyc-innovation-motion.jsx').indexOf('function setupReveal()'),read('src/jyc-innovation-motion.jsx').indexOf('function useAtmosphericCanvas'));
check('reveal preference handler never references the separately scoped ambient canvas',!revealSetup.includes('canvas.style')&&!revealSetup.includes('canvasRef'));
check('crest pointer tilt is RAF-coalesced and does not re-render React on pointer movement',hero.includes('requestAnimationFrame')&&hero.includes('cardRef.current.style.transform')&&!hero.includes('setTilt'));
check('homepage uses one OGL WebGL field instead of a second crest renderer',!hero.includes('JYCWebGLIdentity')&&!read('src/main.jsx').includes('jyc-webgl-identity'));
if(failures.length)process.exit(1);
console.log('JYC animation/media performance contract: '+(totalChecks-failures.length)+'/'+totalChecks);
