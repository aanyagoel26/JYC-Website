import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const main=fs.readFileSync(path.join(root,'src/main.jsx'),'utf8');
const css=fs.readFileSync(path.join(root,'src/v19.8-contact-nav.css'),'utf8');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const sw=fs.readFileSync(path.join(root,'public/sw.js'),'utf8');
const checks=[
 ['version is 18.9.9',['18.9.9','18.9.10','18.10.0','18.11.0','18.11.1','18.11.2'].includes(pkg.version)],
 ['primary nav removes Fests and Recruitment',main.includes("const links=[['Home','/'],['Clubs','/clubs'],['Events','/events'],['Team','/team'],['Contact','/contact']]")&&!main.includes("links=[['Home','/'],['Clubs','/clubs'],['Events','/events'],['Fests','/fests']")],
 ['Fests are gated by fest mode',main.includes("isFestMode(data)?<>{schema}<FestsPage data={data}/></>:<Navigate to=\"/events\" replace/>")],
 ['Fests search is gated',main.includes("...(isFestMode(data)?[['JIIT FESTS','/fests']]:[])")],
 ['Recruitment is homepage-only',main.includes("if(clean==='/recruitment')return <Navigate to=\"/\" replace/>")&&!main.includes("['Recruitment','Find clubs with open recruitment.'")],
 ['Recruitment is editor-gated on homepage',main.includes('recruitmentEnabled(data)?clubs.filter(c=>c.recruitment?.on):[]')],
 ['Contact is primary navigation',main.includes("['Contact','/contact']")],
 ['Contact channels exist',main.includes('@jiityouthclub128')&&main.includes('JYC WhatsApp Group')&&main.includes('mailto:')],
 ['Exact-title search remains relevance-first',main.includes('rankSearchResults(rawResults,term)')&&main.includes('BEST MATCH')],
 ['Search index excludes hidden recruitment',!main.includes("['Recruitment','Find clubs with open recruitment.'")],
 ['Contact motion polish loaded',main.includes("import './v19.8-contact-nav.css';")&&css.includes('@keyframes jyc-contact-float')],
 ['Service worker cache bumped',(sw.includes('jyc-cache-v18-11-final-product')||sw.includes('jyc-cache-v18-11-1-final-product'))||sw.includes('jyc-cache-v18-9-9-deep-polish')||sw.includes('jyc-cache-v18-9-8-contact-nav')]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${n}`);if(!ok)failed++;}
if(failed)process.exit(1);console.log('V18.9.9 deep product QA complete.');
