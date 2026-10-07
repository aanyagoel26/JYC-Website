import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const checks=[
 ['public read bridge exposes club links',read('supabase/migrations/202610080001_public_club_links_read_bridge.sql').includes("'links',coalesce")],
 ['club detail renders normalized club links',read('src/main.jsx').includes('Array.isArray(c.links)')&&read('src/main.jsx').includes('x.label,x.url')], ['trust dashboard exists',fs.existsSync(path.join(root,'src/admin-trust-dashboard.jsx'))],
 ['trust dashboard uses verification table',read('src/admin-trust-dashboard.jsx').includes("from('jyc_content_verification')")],
 ['trust dashboard exposes relationship coverage',read('src/admin-trust-dashboard.jsx').includes('Content graph coverage')],
 ['trust dashboard does not auto-verify',read('src/admin-trust-dashboard.jsx').includes('never marks content verified automatically')],
 ['admin imports trust dashboard',read('src/admin-chunk.jsx').includes("AdminTrustDashboard")],
 ['publication health tab is role-gated',read('src/admin-chunk.jsx').includes("'trust'")&&read('src/admin-chunk.jsx').includes("roleTabs={")],
 ['publication health navigation is visible',read('src/admin-chunk.jsx').includes("['trust','Publication Health']")],
 ['projects remain excluded from public navigation',!read('src/main.jsx').includes("['Projects','/projects'")&&!read('src/main.jsx').includes("['Impact','/impact'")],
 ['FAQ remains excluded from public navigation',!read('src/main.jsx').includes("['FAQ','/faq'")],
 ['Sector 128 remains the event boundary',read('src/jyc57-experience.jsx').includes('Sector 128 only')]
];
let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failed++}
if(failed){console.error(failed+' trust/CMS contract(s) failed');process.exit(1)}
console.log('V58 TRUST/CMS CONTRACT PASSED');
