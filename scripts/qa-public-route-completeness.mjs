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
  { path: '/achievements', component: 'Achievements' },
  { path: '/best-of-jyc', component: 'JYCBestOf' }
];

for (const route of routes) {
  // Assert the component actually wired to the current public route.
  // Keep this contract aligned with the production router, not an assumed
  // lazy-loading implementation that is not present in this release.
  const expected = `if(clean==='${route.path}')return <>{schema}<${route.component} data={data}/></>;`;
  assert.ok(main.includes(expected), `${route.path} must render its dedicated page component`);
  assert.ok(shells.includes(`'${route.path}'`), `${route.path} must have a direct-entry SEO shell`);
}

assert.ok(main.includes("if(clean==='/history')return <Navigate to=\"/about#history\" replace/>;"),
  'The legacy history URL must lead to the combined About JYC timeline');
assert.ok(main.includes('id="about-history-heading"') && main.includes('className="about-history-node"'),
  'The combined About JYC page must contain the accessible, source-backed timeline');
assert.ok(shells.includes("route === '/history' ? '/about' : route"),
  'The legacy history shell must canonicalize to the single About JYC destination');
assert.ok(!main.includes("if(clean==='/history')return <>{schema}<JYCHistory data={data}/></>;"),
  'History must not remain a separate public destination');
assert.ok(!main.includes("if(clean==='/achievements'||clean==='/best-of-jyc')return <Navigate to=\"/about\" replace/>;"),
  'Achievements and Best of JYC must not silently redirect to About');
assert.ok(main.includes("import {HistoryTeaser,HISTORY} from './jyc-history-page.jsx';"));
assert.ok(main.includes('JYCBestOf'));
assert.ok(main.includes('function Achievements({data})'));

console.log('Public route completeness contract: PASS (history, achievements, best-of-jyc)');
