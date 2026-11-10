import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync('scripts/generate-route-shells.mjs','utf8');
const checks=[
 ['dynamic route loader exists', source.includes('async function loadDynamicRoutes()')],
 ['loader is awaited before shells are written', source.includes('await loadDynamicRoutes();')],
 ['published events are filtered', source.includes('event?.published')],
 ['static event shells derive only from published, non-archived fallback records', source.includes('PUBLIC_EVENT_FALLBACK.filter(item=>item?.published&&item?.archived!==true)')],
 ['static hub shells exclude draft source-registry entries', source.includes("JYC_HUB_SOURCE_REGISTRY.filter(item=>item.publicationStatus==='published')")],
 ['stale hard-coded event shells are not reintroduced', !source.includes("'/events/ride-hack-2026':") && !source.includes("'/events/converge-2026':")],
 ['published clubs are filtered', source.includes('club?.published')],
 ['curated route metadata is preserved', source.includes('if(routes[route])continue;')],
 ['CMS outage is non-fatal', source.includes('dynamic metadata unavailable')],
 ['canonical metadata is generated per route', source.includes('const canonicalUrl=')],
 ['route metadata is escaped before HTML insertion', source.includes('const escapeHtml=') && source.includes('const escapeAttr=')]
];
let failures=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failures++;}
assert.equal(failures,0,'Dynamic route shell checks failed');
