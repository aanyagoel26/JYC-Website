import fs from 'node:fs';
import assert from 'node:assert/strict';
const css=fs.readFileSync('src/styles/jyc-nsoc-editorial-effects.css','utf8');
const main=fs.readFileSync('src/main.jsx','utf8');
const checks=[
 ['editorial effects stylesheet is loaded after the shared theme depth layer',main.indexOf("import './styles/jyc-nsoc-editorial-effects.css';")>main.indexOf("import './styles/jyc-depth-motion.css';")],
 ['effects use JYC theme tokens and keep dark/light palettes explicit',css.includes('--jyc-editorial-glow')&&css.includes('html[data-theme="dark"]')&&css.includes('html[data-theme="light"]')],
 ['homepage receives a fine technical grid and animated atmospheric light',css.includes('.jyc-editorial-home.jyc-home::before')&&css.includes('jycEditorialLightTravel')],
 ['section markers use animated editorial index rules',css.includes('.jh-section-number::before')&&css.includes('jycMarkerExtend')],
 ['hero gains restrained orbit rings and a plaque light sweep',css.includes('jycOrbitBreath')&&css.includes('jycPlaqueSweep')],
 ['story and featured event cards gain layered hover feedback',css.includes('.jh-story-card:hover::after')&&css.includes('.jh-featured-event:hover .jh-featured-event-photo')],
 ['CTA and final section gain motion feedback',css.includes('.jh-btn:hover::after')&&css.includes('jycFinalGlow')],
 ['touch layouts avoid hover transforms and reduced motion disables decorative animation',css.includes('@media(max-width:760px)')&&css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('animation:none!important')]
];
let failed=0;for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failed++}
if(failed)process.exit(1);
console.log('NSoC-inspired editorial effects QA: '+checks.length+'/'+checks.length+' checks passed.');

const shader=fs.readFileSync('src/components/JYCWebGLField.jsx','utf8');
const home=fs.readFileSync('src/jyc-editorial-home.jsx','utf8');
const packageJson=JSON.parse(fs.readFileSync('package.json','utf8'));
const shaderChecks=[
 ['homepage lazy-loads a dedicated OGL WebGL field behind its existing emblem',home.includes("const LazyJYCWebGLField = lazy(() => import('./components/JYCWebGLField.jsx').then(m => ({ default: m.JYCWebGLField })))")&&home.includes('<LazyJYCWebGLField />')&&home.includes('<JYCHeroWebGLEmblem />')&&shader.includes("from 'ogl'")],
 ['shader uses procedural FBM domain warping and topographic contour lines',shader.includes('float fbm(')&&shader.includes('float contour =')&&shader.includes('uPointer')],
 ['shader uses a defined monotonic fade function at the edge of the visual field',shader.includes('1.0 - smoothstep(0.18,0.98,length(p) * 0.52)')],
 ['shader adds layered twinkling star particles and a second drifting depth plane',shader.includes('float starLayer(')&&shader.includes('starLayer(p * 1.37')&&shader.includes('float stars =')],
 ['pointer interaction adds a damped concentric ripple without a light sweep',shader.includes('float ripple =')&&shader.includes('pointerDistance')&&!shader.includes('lightSweep')],
 ['GLSL source uses valid template literals without escaped delimiters',shader.includes('const vertex = `#version 300 es')&&shader.includes('const fragment = `#version 300 es')&&!shader.includes('const vertex = \\\\`')&&!shader.includes('const fragment = \\\\`')],
 ['light and dark modes render distinct visual systems, not just recoloured palettes',shader.includes('Day identity: warm sunrise')&&shader.includes('float cloudBand =')&&shader.includes('float sunDisc =')&&shader.includes('moonDisc')&&shader.includes('float ribbons =')&&shader.includes('uTheme.value = document.documentElement.dataset.theme')],
 ['day mode has warm sunrise clouds and drifting dust while night mode has a crescent moon and starfield',shader.includes('float dayDust =')&&shader.includes('float cloudLight =')&&shader.includes('float moon =')&&shader.includes('float stars =')],
 ['shader builds independent atmospheric, distant-cloud and foreground particle depth planes',shader.includes('Depth plane 1:')&&shader.includes('Depth plane 2:')&&shader.includes('Depth plane 3:')&&shader.includes('float aerialPerspective =')&&shader.includes('float nearMotes =')],
 ['day and night atmospheres receive separate horizon haze and cloud treatment',shader.includes('vec3 dayHaze =')&&shader.includes('vec3 nightHaze =')&&shader.includes('float cloudShadow =')&&shader.includes('float nightNebula =')],
 ['shader uses restrained edge atmosphere and keeps flare sweep absent',shader.includes('float edgeAtmosphere =')&&!shader.includes('lightSweep')&&!shader.includes('float lightSweep')],
 ['WebGL context caps pixel ratio and lowers intensity on constrained devices, with a static fallback for low-power/coarse pointers',shader.includes('Math.min(window.devicePixelRatio')&&shader.includes('reducedQuality || coarse ? 1.1 : 1.35')&&shader.includes('uIntensity: { value: reducedQuality ? 0.78 : 1.0 }')&&shader.includes('lowPower || coarse')&&shader.includes('const reducedQuality = cores <= 8 || memory < 8;')],
 ['render loop pauses outside viewport and when the document is hidden',shader.includes('IntersectionObserver')&&shader.includes('visibilitychange')&&shader.includes('cancelAnimationFrame')],
 ['reduced motion renders a static frame rather than animating continuously',shader.includes('prefers-reduced-motion: reduce')&&shader.includes('reduced ? 0 : requestAnimationFrame(draw)')],
 ['GPU resources and observers are cleaned up on unmount',shader.includes('observer?.disconnect()')&&shader.includes('resizeObserver?.disconnect()')&&shader.includes('program?.remove()')&&shader.includes('loseContext')],
 ['CSS provides a non-WebGL fallback and mobile/reduced-motion treatment',css.includes('.jyc-webgl-field-fallback')&&shader.includes("host.dataset.webgl = 'fallback'")&&css.includes('@media(prefers-reduced-motion:reduce)')],
 ['existing OGL dependency is reused without adding another renderer',packageJson.dependencies.ogl==='1.0.11'&&!packageJson.dependencies['three']&&!packageJson.dependencies['@react-three/fiber']]
];
let shaderFailed=0;
for(const [name,ok] of shaderChecks){console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)shaderFailed++}
if(shaderFailed)process.exit(1);
console.log('JYC WebGL field QA: '+shaderChecks.length+'/'+shaderChecks.length+' checks passed.');
