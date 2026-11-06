import fs from 'node:fs';

const registry=fs.readFileSync('src/jyc-hub-registry.js','utf8');
const identities=fs.readFileSync('src/hub-identities.js','utf8');
const contentFile=fs.readFileSync('src/v21-hub-content.js','utf8');
const explorer=fs.readFileSync('src/components/JYC3DInteractiveExplorer.jsx','utf8');
const fail=[];
const expect=(ok,msg)=>{if(!ok)fail.push(msg)};
const registryNames=[...registry.matchAll(/\{name:'([^']+)'/g)].map(m=>m[1]);
const contentNames=[...contentFile.matchAll(/^  ['"]?([A-Za-z][A-Za-z0-9 ]*)['"]?:\{/gm)].map(m=>m[1].trim());
const brochure=[...registry.matchAll(/status:'brochure-verified'/g)].length;
const orientation=[...registry.matchAll(/status:'orientation-verified'/g)].length;
const source=[...registry.matchAll(/status:'source-material'/g)].length;
expect(registryNames.length===24,'expected 24 registry entries, found '+registryNames.length);
expect(brochure===2,'expected 2 brochure-verified entries, found '+brochure);
expect(orientation===21,'expected 21 orientation-verified entries, found '+orientation);
expect(source===1,'expected 1 source-material entry (Shorts), found '+source);
expect(registryNames.every(name=>contentNames.includes(name)),'registry/content canonical name mismatch: '+registryNames.filter(name=>!contentNames.includes(name)).join(', '));
expect(!registry.includes("status:'verified-current'"),'stale verified-current status remains');
expect(identities.includes('Qriosity:') && identities.includes("'JIIT OPTICA':"),'Qriosity/OPTICA identity coverage missing');
expect(contentFile.includes('Qriosity:') && contentFile.includes("'JIIT OPTICA':"),'Qriosity/OPTICA content coverage missing');
for(const n of ['Qriosity','JIIT OPTICA']) expect(registryNames.includes(n),'registry missing '+n);

expect(explorer.includes("JYC_HUB_SOURCE_REGISTRY") && explorer.includes("hub.publicationStatus === 'published'"),'3D constellation must use the publication-gated registry');
expect(explorer.includes('JYC_HUB_CONTENT[hub.name]'),'3D constellation descriptions must come from maintained hub content');
expect(!/members:\s*['"][^'"]*\d+\+/.test(explorer),'3D constellation must not publish unsupported member counts');
expect(!explorer.includes("const HUBS = ["),'3D constellation must not maintain a duplicate static community inventory');
if(fail.length){for(const x of fail)console.error('FAIL:',x);process.exit(1)}
console.log('PASS: 24 hub registry entries');
console.log('PASS: 21 orientation-verified + 2 brochure-verified + 1 source-material entry');
console.log('PASS: no stale verified-current registry state');
console.log('PASS: Qriosity and JIIT OPTICA identity/content coverage');