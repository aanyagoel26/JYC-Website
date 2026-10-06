import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const failures=[];
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

const migrationDir=path.join(root,'supabase','migrations');
const migrations=fs.readdirSync(migrationDir);
const trust=migrations.find(f=>f==='202610060004_v57_trust_contract.sql');
if(!trust) failures.push('missing V57 trust contract migration');
else {
  const sql=read('supabase/migrations/'+trust);
  for(const needle of [
    "confidence text not null default 'review'",
    "source_captured_at",
    "review_reason",
    "v.campus_id='sector-128'",
    "v.confidence in ('official','strong','corroborated')",
    "jyc_guard_normalized_publication_v57"
  ]) if(!sql.includes(needle)) failures.push('V57 trust contract missing '+needle);
}

const socials=read('src/jyc-socials.js');
if(socials.includes("instagram: 'https://www.instagram.com/jiityouthclub/'")) failures.push('legacy JYC Instagram remains in canonical social registry');
if(socials.includes("linkedin: 'https://www.linkedin.com/company/jiityouthclub/'")) failures.push('legacy JYC LinkedIn remains in canonical social registry');
if(!socials.includes("official: 'https://linktr.ee/jiityouthclub'")) failures.push('verified JYC link hub missing');
if(!socials.includes("linkedin: 'https://in.linkedin.com/in/jyc128'")) failures.push('verified JYC 128 LinkedIn missing');

const main=read('src/main.jsx');
if(!main.includes('is128SocialProfile')) failures.push('public social enrichment is not 128-gated');
if(!main.includes('isSector128Venue')) failures.push('public event venue guard missing');

const pkg=JSON.parse(read('package.json'));
if(pkg.scripts?.['qa:trust']!=='node scripts/qa-trust-contract.mjs') failures.push('qa:trust script missing');

if(failures.length){console.error('TRUST CONTRACT QA FAIL');failures.forEach(f=>console.error('FAIL:',f));process.exit(1)}
console.log('TRUST CONTRACT QA PASS');
