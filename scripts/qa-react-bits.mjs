
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const collectFiles=(dir)=>fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(entry=>{
  const rel=path.join(dir,entry.name);
  return entry.isDirectory()?collectFiles(rel):[rel];
});
const files=[...collectFiles('src/react-bits'),...collectFiles('src/components/react-bits')];
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
const main=read('src/main.jsx');
const now=read('src/jyc-now.jsx');
const micro=read('src/react-bits/JYCMicro.jsx');
const microCss=read('src/react-bits/JYCMicro.css');
const dither=read('src/react-bits/DitherVeil.jsx');
const ditherCss=read('src/react-bits/DitherVeil.css');
const home=read('src/jyc-editorial-home.jsx');
const hero=read('src/components/JYCHeroWebGLEmblem.jsx');
const homeCss=read('src/jyc-editorial-home.css');
const cohesive=read('src/styles/jyc-cohesive-experience.css');
const extraFeaturesSafe=()=>{const f=read('src/extra-features.jsx');return f.includes('LazyDriftWall')&&f.includes('Drift wall')};

const checks=[
 ['React Bits dependencies declared',pkg.dependencies.motion===lock.packages[''].dependencies.motion&&lock.packages['node_modules/motion']?.version===pkg.dependencies.motion&&pkg.dependencies['@hugeicons/react']==='1.1.10'&&pkg.dependencies['@hugeicons/core-free-icons']==='4.3.5'&&pkg.dependencies.ogl==='1.0.11'],
 ['lockfile root matches React Bits/runtime dependencies',lock.packages[''].dependencies.motion===pkg.dependencies.motion&&lock.packages[''].dependencies.ogl==='1.0.11'&&lock.packages['node_modules/ogl']?.version==='1.0.11'],
 ['React Bits micro components present',/BellToggle|JellyRadio|RubberSegment|BorderGlow/.test(micro)],
 ['React Bits motion controls are lazy-loaded',main.includes('LazyRubberSegment')&&main.includes('LazyBellToggle')],
 ['JYC Now uses JellyRadio',now.includes('LazyJellyRadio')&&now.includes('Filter JYC Now by community')],
 ['event view uses RubberSegment',main.includes('LazyRubberSegment')&&main.includes('Event view')],
 ['event reminders use BellToggle',main.includes('EventReminderControl')&&main.includes('scheduleEventReminder')],
 ['Agentic AI popup is isolated from the public shell',!main.includes('AgenticAIPopup')&&!main.includes('agentic-launcher')&&!main.includes('LazyBorderGlow')],
 ['DitherVeil is the current React Bits implementation',dither.includes('const KERNELS =')&&dither.includes('const getBlueNoise')&&dither.includes('const diffuse')&&dither.includes('RenderTarget')&&dither.includes('measureEdge')],
 ['Homepage uses one official crest and a separately lazy-loaded OGL sky, without a duplicate Dither layer',home.includes('<JYCHeroWebGLEmblem />')&&home.includes('heroFieldReady')&&home.includes('LazyJYCWebGLField')&&!home.includes('LazyDitherVeil')&&!home.includes('jh-hero-dither-layer')],
 ['current homepage uses the semantic crest, optimized AVIF/WebP/original fallbacks and lazy OGL field',home.includes('JYCHeroWebGLEmblem')&&home.includes('jh-hero-webgl-stage-wrap')&&hero.includes('role="img"')&&hero.includes('LOGO_FALLBACK')&&hero.includes('LOGO_ORIGINAL')&&home.includes('heroFieldReady')&&home.includes('LazyJYCWebGLField')&&home.includes('LazyMagicBento')&&!home.includes('LazyDitherVeil')&&!home.includes('LazyDriftWall')],
 ['DitherVeil has reduced-motion/visibility lifecycle support',dither.includes("prefers-reduced-motion")&&dither.includes('IntersectionObserver')&&dither.includes('ResizeObserver')],
 ['MagicBento uses router navigation and disables motion for reduced-motion users',read('src/components/react-bits/MagicBento.jsx').includes('onNavigate?onNavigate(item.href)')&&read('src/components/react-bits/MagicBento.jsx').includes("prefers-reduced-motion: reduce")&&home.includes('LazyMagicBento')&&home.includes('enableMagnetism={true}')],
 ['DitherVeil CSS is minimal and scoped',ditherCss.includes('.dither-veil')&&!ditherCss.includes('body{')],
 ['public motion layer is lazy-loaded',main.includes('LazyJYCInnovationMotion')&&main.includes('<Suspense fallback={null}><LazyJYCInnovationMotion/></Suspense>')],
 ['route changes do not animate the whole document scroll',main.includes("window.scrollTo({top:0,behavior:'auto'})")&&!main.includes("window.scrollTo({top:0,behavior:'smooth'})},[loc.pathname])")],
 ['single global image-error fallback listener is canonical',
  (main.match(/document\.addEventListener\('error',onImageError,true\)/g)||[]).length===1&&
  (main.match(/document\.removeEventListener\('error',onImageError,true\)/g)||[]).length===1&&
  main.includes("img.dataset.jycFallback='1'")&&main.includes("img.dataset.jycFallbackApplied='1'")&&main.includes("img.closest('.jyc-responsive-picture')")&&main.includes('img.src=logo')],
 ['no public Control Center launcher added',!main.includes('Control Center</button>')&&!main.includes('Control Center ↗')]
];

const check=(name,ok)=>checks.push([name,ok]);

check('CountUp component is present',fs.existsSync(path.join(root,'src/components/react-bits/CountUp.jsx')));
check('DepthCarousel component is present',fs.existsSync(path.join(root,'src/components/react-bits/DepthCarousel.jsx'))&&fs.readFileSync(path.join(root,'src/components/react-bits/DepthCarousel.css'),'utf8').includes('overflow:hidden'));
check('DepthCarousel avoids a direct GSAP import',!read('src/components/react-bits/DepthCarousel.jsx').includes("from'gsap'")&&!read('src/components/react-bits/DepthCarousel.jsx').includes('from "gsap"'));
check('DepthCarousel is lazy-loaded on public routes',main.includes('LazyDepthCarousel')&&main.includes('<Suspense fallback={<div className="depth-carousel depth-carousel--loading"'));

check('DriftWall remains available for the visual archive',fs.existsSync(path.join(root,'src/components/react-bits/DriftWall.jsx'))&&extraFeaturesSafe());
check('Homepage uses the WebGL emblem and lazy magnetic Bento without a continuously animated photo wall',home.includes('JYCHeroWebGLEmblem')&&home.includes('LazyMagicBento')&&!home.includes('LazyDriftWall')&&home.includes('jh-hero-webgl-stage-wrap')&&home.includes('enableMagnetism={true}')&&hero.includes("prefers-reduced-motion: reduce"));
check('MagicBento remains available as an optional library surface',fs.existsSync(path.join(root,'src/components/react-bits/MagicBento.jsx'))&&pkg.dependencies.gsap==='3.15.0'&&lock.packages['node_modules/gsap']?.version==='3.15.0');
check('FlexCarousel component remains available for future archive surfaces',fs.existsSync(path.join(root,'src/components/react-bits/FlexCarousel.jsx'))&&fs.existsSync(path.join(root,'src/components/react-bits/FlexCarousel.css')));
check('React Bits components do not ship CSP-incompatible remote demo media',!files.some(file=>/\.jsx$/.test(file)&&/images\.unsplash\.com/.test(read(file))));
check('DriftWall archive surface has responsive safeguards',read('src/components/react-bits/DriftWall.css').includes('height')&&read('src/components/react-bits/DriftWall.css').includes('@media'));
check('Homepage visual archive CSS contains no escaped newline literals',!homeCss.includes('\\n'));
check('DriftWall has offscreen, low-power and reduced-motion safeguards',read('src/components/react-bits/DriftWall.jsx').includes('IntersectionObserver')&&read('src/components/react-bits/DriftWall.jsx').includes('lowPower')&&read('src/components/react-bits/DriftWall.jsx').includes('prefers-reduced-motion'));
check('DriftWall is used for event and community visual rails',main.includes('event-drift-wall-section')&&main.includes('club-drift-wall-section')&&main.includes('LazyDriftWall'));
check('MagicBento disables heavy effects on mobile/coarse pointers',read('src/components/react-bits/MagicBento.jsx').includes('(pointer:coarse)')&&read('src/components/react-bits/MagicBento.jsx').includes('max-width:768px'));

check('Dither Veil renders on capable touch devices at capped device-pixel ratio',dither.includes("const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches || window.innerWidth < 800;")&&dither.includes('if (reducedMotion || constrainedHardware)')&&dither.includes('dpr: coarsePointer ? 1 : Math.min(window.devicePixelRatio || 1, 2)'));
check('homepage hero uses the shared day/night palette and reduced-motion safeguards',cohesive.includes('--jh-accent: #c8bcff')&&cohesive.includes('--jh-accent: #625889')&&cohesive.includes('.jh-hero-actions')&&cohesive.includes('@media (prefers-reduced-motion: reduce)'));
check('hero emblem uses optimized AVIF, WebP and original PNG fallbacks',hero.includes("const LOGO_SRC = '/assets/jyc-logo.avif'")&&hero.includes("const LOGO_FALLBACK = '/assets/jyc-logo.webp'")&&hero.includes('LOGO_ORIGINAL')&&hero.includes('setLogoFailed(true)'));
check('hero crest stays lightweight with no per-frame canvas, particle system or autoplay audio',!hero.includes('requestAnimationFrame')&&!hero.includes('particleCount')&&!hero.includes('jyc-emblem-canvas')&&!hero.includes('jycAudio')&&read('src/components/JYCHeroWebGLEmblem.css').includes('prefers-reduced-motion:reduce'));
check('Dither Veil has shader/image failure fallback and WebGL teardown',dither.includes('img.onerror = () =>')&&dither.includes('container.dataset.static = \'1\'')&&dither.includes("getExtension('WEBGL_lose_context')")&&dither.includes('resizeObserver.disconnect()'));
check('Dither Veil static fallback is visible and canvas hidden when static mode is selected',ditherCss.includes('.dither-veil[data-static=\"1\"] canvas{display:none}')&&ditherCss.includes('.dither-veil[data-static=\"1\"] .dither-veil__fallback{display:block}'));
check('Dither Veil falls back instead of running GLSL ES 3 shaders without WebGL2',dither.includes('if (!gl || !renderer?.isWebgl2)')&&dither.includes('container.dataset.static = \'1\''));

let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+' · '+name);if(!ok)failed++}
if(failed)process.exit(1);
console.log('React Bits + interaction/performance QA PASS');
