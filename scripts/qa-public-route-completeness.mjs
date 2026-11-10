import fs from 'node:fs';
import assert from 'node:assert/strict';

const main = fs.readFileSync('src/main.jsx', 'utf8');
const shells = fs.readFileSync('scripts/generate-route-shells.mjs', 'utf8');

const routesStart = main.indexOf('function Routes(');
const routesEnd = main.indexOf('function NavIcon(', routesStart);
assert.ok(routesStart >= 0 && routesEnd > routesStart, 'Routes component boundaries must exist');
const routesSource = main.slice(routesStart, routesEnd);
const metadataHook = routesSource.indexOf('usePageMeta(');
const schemaDeclaration = routesSource.indexOf('const schema=');
const firstRenderReturn = routesSource.search(/return\s*<>|return\s*<Navigate|return\s*<section/);
assert.ok(metadataHook >= 0 && schemaDeclaration > metadataHook, 'Metadata and schema hooks must precede route rendering');
assert.ok(firstRenderReturn > schemaDeclaration, 'No route may return before metadata/schema hooks run');
assert.doesNotMatch(routesSource.slice(0, schemaDeclaration), /if\s*\([^\n]*\)\s*return\s*</, 'Route aliases must not return before hooks');

const routes = [
  { path: '/achievements', component: 'Achievements', expected: `if(clean==='/achievements')return <>{schema}<Achievements data={data}/></>;` },
  { path: '/best-of-jyc', component: 'LazyJYCBestOf', expected: `if(clean==='/best-of-jyc')return <>{schema}<Suspense` }
];

for (const route of routes) {
  // Assert the actual component wired to the public route. Best of JYC is
  // intentionally lazy so the gallery experience does not inflate startup JS.
  assert.ok(main.includes(route.expected), `${route.path} must render its dedicated page component`);
  assert.ok(shells.includes(`'${route.path}'`), `${route.path} must have a direct-entry SEO shell`);
}
assert.ok(main.includes('<LazyJYCBestOf data={data}/></Suspense></>;') &&
  main.includes("const LazyJYCBestOf=lazy(()=>import('./jyc57-experience.jsx').then(m=>({default:m.JYCBestOf})))"),
  'Best of JYC must load its dedicated experience component on demand');

assert.ok(main.includes(`if(clean==='/history')return <Navigate to="/about#history" replace/>;`),
  'The legacy history URL must lead to the combined About JYC timeline');
assert.ok(main.includes('id="about-history-heading"') && main.includes('className="about-history-node"'),
  'The combined About JYC page must contain the accessible, source-backed timeline');
assert.ok(shells.includes("route === '/history' ? '/about' : route"),
  'The legacy history shell must canonicalize to the single About JYC destination');
assert.ok(!main.includes(`if(clean==='/achievements'||clean==='/best-of-jyc')return <Navigate to="/about" replace/>;`),
  'Achievements and Best of JYC must not silently redirect to About');
assert.ok(main.includes("import {HISTORY} from './jyc-history-page.jsx';"),
  'The route module should import only the history data it uses, not the removed teaser component');
assert.ok(!main.includes('HistoryTeaser'), 'The removed HistoryTeaser component must not be reintroduced as an unused import');
assert.ok(main.includes('JYCBestOf'));
assert.ok(main.includes('function Achievements({data})'));


const about = main.slice(main.indexOf('function About('), main.indexOf('function Clubs(', main.indexOf('function About(')));
for (const [label, id] of [
  ['Why JYC', 'about-why'],
  ['Communities', 'about-families'],
  ['How it works', 'about-structure'],
  ['Campus life', 'about-programmes'],
  ['Our story', 'history']
]) {
  assert.ok(about.includes(`href="#${id}"`), `About section navigation must link to ${label}`);
  assert.ok(about.includes(`id="${id}"`), `About page must expose the ${label} section target`);
}
assert.ok(about.includes('aria-label="About JYC sections"'), 'About section navigation must have an accessible name');

console.log('Public route completeness contract: PASS (history, achievements, best-of-jyc, About section navigation)');
