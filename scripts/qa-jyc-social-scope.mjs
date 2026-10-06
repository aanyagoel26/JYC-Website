import fs from 'node:fs';
const socials=fs.readFileSync('src/jyc-socials.js','utf8');
const sql=fs.readFileSync('supabase/migrations/202610060003_jyc_social_identity_hardening.sql','utf8');
const now=fs.readFileSync('src/jyc-now.jsx','utf8');
const main=fs.readFileSync('src/main.jsx','utf8');
const config=fs.readFileSync('src/lib/site-config.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const home=fs.readFileSync('src/jyc-editorial-home.jsx','utf8');
const nowSource=fs.readFileSync('src/jyc-now.jsx','utf8');
const failures=[];
for(const needle of [
  "canonicalCampus: 'sector-128'",
  "https://in.linkedin.com/in/jyc128",
  "https://www.instagram.com/jiityouthclub/",
  "https://www.linkedin.com/company/jiityouthclub/"
]) if(!socials.includes(needle)) failures.push('missing social source policy: '+needle);
if(!socials.includes("blockedIdentities: [")||!socials.includes("'https://www.instagram.com/jiityouthclub/'")) failures.push('legacy JYC Instagram is not explicitly blocked');
if(!now.includes('is128SocialProfile')) failures.push('JYC Now does not enforce 128 social profile filtering');
if(!main.includes('social&&is128SocialProfile(social)')) failures.push('public club enrichment does not enforce 128 social profile filtering');
if(!socials.includes("campus: 'review'")||!socials.includes("sourcePriority: 'review-only'")) failures.push('ambiguous GDG identity is not review-gated');
if(!sql.includes("hub_name in ('GDG','RPH')")) failures.push('ambiguous GDG/RPH feeds are not disabled in the social hardening migration');
if(!main.includes('isSector128Venue(e.venue)&&(/fest|impressions|converge|ebullience/i.test')) failures.push('public fests are not explicitly restricted to Sector 128 venues');
if(config.includes("instagram:'https://www.instagram.com/jiityouthclub/'")||config.includes("linkedin:'https://www.linkedin.com/company/jiityouthclub/'")) failures.push('legacy JYC social identity remains in public contact config');
if(index.includes('https://www.instagram.com/jiityouthclub/')||index.includes('https://www.linkedin.com/company/jiityouthclub/')) failures.push('legacy JYC social identity remains in Organization JSON-LD');
if(home.includes('https://www.instagram.com/jiityouthclub/')||home.includes('https://www.linkedin.com/company/jiityouthclub/')) failures.push('legacy JYC social identity remains in homepage source');
if(nowSource.includes("url:'https://www.instagram.com/jiityouthclub/'")||nowSource.includes("url:'https://www.linkedin.com/company/jiityouthclub/'")) failures.push('legacy JYC social identity remains in JYC Now fallback');
if(failures.length){failures.forEach(x=>console.error('FAIL:',x));process.exit(1)}
console.log('PASS: social source policy is explicitly restricted to JIIT Sector 128');
