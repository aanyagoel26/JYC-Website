import fs from 'node:fs';
const socials=fs.readFileSync('src/jyc-socials.js','utf8');
const now=fs.readFileSync('src/jyc-now.jsx','utf8');
const main=fs.readFileSync('src/main.jsx','utf8');
const failures=[];
for(const needle of [
  "canonicalCampus: 'sector-128'",
  "https://in.linkedin.com/in/jyc128",
  "https://www.instagram.com/jiityouthclub/",
  "https://www.linkedin.com/company/jiityouthclub/"
]) if(!socials.includes(needle)) failures.push('missing social source policy: '+needle);
if(!now.includes('is128SocialProfile')) failures.push('JYC Now does not enforce 128 social profile filtering');
if(!main.includes('social&&is128SocialProfile(social)')) failures.push('public club enrichment does not enforce 128 social profile filtering');
if(!main.includes('isSector128Venue(e.venue)&&(/fest|impressions|converge|ebullience/i.test')) failures.push('public fests are not explicitly restricted to Sector 128 venues');
if(failures.length){failures.forEach(x=>console.error('FAIL:',x));process.exit(1)}
console.log('PASS: social source policy is explicitly restricted to JIIT Sector 128');
