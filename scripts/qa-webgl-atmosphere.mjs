import fs from 'node:fs';
import assert from 'node:assert/strict';

const shader = fs.readFileSync('src/components/JYCWebGLField.jsx', 'utf8');
const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const hero = fs.readFileSync('src/styles/jyc-home-hero-finish.css', 'utf8');
const atmosphere = fs.readFileSync('src/styles/jyc-atmosphere.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert.ok(shader.includes('Galactic plane: a soft, tilted Milky Way'), 'night shader documents its galactic-plane treatment');
assert.ok(shader.includes('float milkyWay =') && shader.includes('float darkRift ='), 'night shader renders a Milky Way band and a structured dark dust rift');
assert.ok(shader.includes('float nebulaRed =') && shader.includes('float nebulaBlue ='), 'night shader includes distinct hydrogen-red and blue reflection-cloud accents');
assert.ok(shader.includes('float distantStars =') && shader.includes('galaxyP += (pointer - 0.5)'), 'deep star layer gains restrained pointer-responsive depth');
assert.ok(shader.includes('vec3 daySky = vec3(0.91,0.84,0.72)') && shader.includes('vec3 dayGold = vec3(0.91,0.68,0.35)'), 'day shader uses a champagne and warm-gold palette rather than a blue sky');
assert.ok(shader.includes("addEventListener('webglcontextlost'") && shader.includes('onContextLost'), 'WebGL context loss switches to a safe static fallback');
assert.ok(shader.includes('distantStars * 0.36 + milkyWay * 0.11'), 'galactic detail contributes to the translucent shader output');
assert.ok(shader.includes('prefersReducedMotion') && shader.includes('motion.addEventListener'), 'WebGL renderer observes reduced-motion preference changes');
assert.ok(shader.includes('IntersectionObserver') && shader.includes('visibilitychange'), 'WebGL animation pauses when offscreen or document-hidden');
assert.ok(shader.includes('WEBGL_lose_context') && shader.includes("host.dataset.webgl = 'fallback'"), 'WebGL cleanup and graceful fallback remain in place');
assert.ok(home.includes('<LazyJYCWebGLField />') && home.includes('const LazyJYCWebGLField = lazy('), 'homepage lazy-loads the shared WebGL atmosphere after its static first paint');
assert.ok(hero.includes('jh-hero-visual') && hero.includes('prefers-reduced-motion:reduce'), 'hero composition has responsive reduced-motion styling');
assert.ok(atmosphere.includes('html[data-theme="light"] body::before') && atmosphere.includes('html[data-theme="dark"] body::after'), 'daylight and night global atmospheres remain separate');
assert.ok(!('@react-three/fiber' in pkg.dependencies), 'no second WebGL framework is added to the runtime');
console.log('WebGL atmosphere QA passed: Milky Way, dust rift, nebula palette, pointer depth, lifecycle, fallbacks and theme separation.');
