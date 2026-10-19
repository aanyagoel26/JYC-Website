import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const drift=read('src/components/react-bits/DriftWall.jsx');
const dither=read('src/react-bits/DitherVeil.jsx');
const bento=read('src/components/react-bits/MagicBento.jsx');
const home=read('src/jyc-editorial-home.jsx');
const hero=read('src/components/JYCHeroWebGLEmblem.jsx');
const main=read('src/main.jsx');
const failures=[];
const check=(name,ok)=>{console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failures.push(name)};

check('DriftWall does not schedule an idle RAF when reduced/low-power/offscreen',drift.includes('if(reduced||lowPower||!visible.current)')&&drift.includes('if(!reduced&&!lowPower&&visible.current)frame.current=requestAnimationFrame(animate)'));
check('Homepage uses the current canvas emblem and lazy magnetic Bento, not a continuously animated photo wall',home.includes('JYCHeroWebGLEmblem')&&home.includes('LazyMagicBento')&&!home.includes('LazyDriftWall')&&home.includes('jh-hero-webgl-stage-wrap')&&home.includes('activities.map'));
check('DriftWall remains bounded on event and club rails',main.includes('event-drift-wall-section')&&main.includes('club-drift-wall-section')&&main.includes('.slice(0,18)')&&main.includes('.slice(0,24)'));
check('DriftWall remains bounded on Gallery page',read('src/extra-features.jsx').includes('const wallItems=useMemo(()=>rankJycPhotoItems(items,{limit:24}),[items])'));
check('DriftWall images are lazy and async decoded',drift.includes('loading="lazy"')&&drift.includes('decoding="async"'));
check('DitherVeil uses capped-DPR WebGL on capable touch devices and a static fallback for reduced motion or constrained hardware',dither.includes("(pointer: coarse)")&&dither.includes('reducedMotion || constrainedHardware')&&dither.includes('dither-veil__fallback')&&dither.includes('dpr: coarsePointer ? 1'));
check('MagicBento disables heavy effects on coarse/mobile/reduced-motion',bento.includes('(pointer:coarse)')&&bento.includes("'(prefers-reduced-motion: reduce)'")&&bento.includes('const disabled=disableAnimations||mobile||reducedMotion'));
check('MagicBento combines tilt/magnetism in one tween and resets on pointer leave',bento.includes('gsap.to(el,vars)')&&bento.includes('x:0,y:0,rotateX:0,rotateY:0')&&bento.includes("clearProps:'transform'"));
check('MagicBento coalesces pointer movement to one animation frame, cancels pending work and guards zero-size cards',bento.includes('let moveFrame=0,lastEvent=null')&&bento.includes('moveFrame=requestAnimationFrame')&&bento.includes('if(moveFrame){cancelAnimationFrame(moveFrame);moveFrame=0}')&&bento.includes('if(moveFrame)cancelAnimationFrame(moveFrame)')&&bento.includes('Math.max(cy,1)')&&bento.includes('Math.max(cx,1)'));
check('MagicBento does not permanently reserve transform compositing',read('src/components/react-bits/MagicBento.css').includes('.magic-bento-card:hover{will-change:transform')&&!read('src/components/react-bits/MagicBento.css').includes('background:#18161d;color:#fff8e9;isolation:isolate;box-shadow:0 16px 40px rgba(17,19,24,.08);transform-style:preserve-3d;will-change:transform'));
check('Homepage non-critical imagery stays lazy',home.includes('loading="lazy"'));
check('Canvas hero honors reduced motion while Bento is coarse-pointer/reduced-motion safe',hero.includes("prefers-reduced-motion: reduce")&&hero.includes('motionQuery.addEventListener')&&hero.includes('cancelAnimationFrame(animId)')&&bento.includes("'(pointer:coarse)'")&&bento.includes("'(prefers-reduced-motion: reduce)'")&&bento.includes('const disabled=disableAnimations||mobile||reducedMotion'));
if(failures.length)process.exit(1);
console.log('JYC animation/media performance contract: '+(11-failures.length)+'/11');
