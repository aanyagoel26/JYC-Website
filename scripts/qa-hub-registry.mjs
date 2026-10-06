import fs from 'node:fs';

const registry=fs.readFileSync('src/jyc-hub-registry.js','utf8');
const identities=fs.readFileSync('src/hub-identities.js','utf8');
const contentFile=fs.readFileSync('src/v21-hub-content.js','utf8');
const fail=[];
const expect=(ok,msg)=>{if(!ok)fail.push(msg)};
const registryNames=[...registry.matchAll(/\{name:'([^']+)'/g)].map(m=>m[1]);
const brochure=[...registry.matchAll(/status:'brochure-verified'/g)].length;
const orientation=[...registry.matchAll(/status:'orientation-verified'/g)].length;
const source=[...registry.matchAll(/status:'source-material'/g)].length;
expect(registryNames.length===23,'expected 23 registry entries, found '+registryNames.length);
expect(brochure===2,'expected 2 brochure-verified entries, found '+brochure);
expect(orientation===15,'expected 15 orientation-verified entries, found '+orientation);
expect(source===6,'expected 6 source-material entries, found '+source);
expect(!registry.includes("status:'verified-current'"),'stale verified-current status remains');
expect(identities.includes('Qriosity:') && identities.includes("'JIIT OPTICA':"),'Qriosity/OPTICA identity coverage missing');
expect(contentFile.includes('Qriosity:') && contentFile.includes("'JIIT OPTICA':"),'Qriosity/OPTICA content coverage missing');
for(const n of ['Qriosity','JIIT OPTICA']) expect(registryNames.includes(n),'registry missing '+n);
if(fail.length){for(const x of fail)console.error('FAIL:',x);process.exit(1)}
console.log('PASS: 23 hub registry entries');
console.log('PASS: 15 orientation-verified + 2 brochure-verified + 6 source-material entries');
console.log('PASS: no stale verified-current registry state');
console.log('PASS: Qriosity and JIIT OPTICA identity/content coverage');