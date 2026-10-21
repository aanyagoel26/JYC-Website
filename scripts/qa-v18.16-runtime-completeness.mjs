import fs from 'node:fs';
const root=new URL('..',import.meta.url).pathname;
const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const extra=fs.readFileSync(new URL('../src/extra-features.jsx',import.meta.url),'utf8');
const checks=[
 ['InteractivePhoenix imported',/import\s*\{[^}]*\bInteractivePhoenix\b[^}]*\}\s*from ['"]\.\/v14-platform\.jsx['"]/.test(main)],
 ['EcosystemSection imported',/import\s*\{[^}]*\bEcosystemSection\b[^}]*\}\s*from ['"]\.\/v14-platform\.jsx['"]/.test(main)],
 ['MomentsSection imported',/import\s*\{[^}]*\bMomentsSection\b[^}]*\}\s*from ['"]\.\/v14-platform\.jsx['"]/.test(main)],
 ['Footer declared',/function Footer\(\{data,admin\}\)/.test(main)],
 ['Contact declared',/function Contact\(\{data\}\)/.test(main)],
 ['GuidePage declared',/function GuidePage\(\{data\}\)/.test(main)],
 ['FestsPage declared',/function FestsPage\(\{data\}\)/.test(main)],
 ['Events declared',/function Events\(\{data\}\)/.test(main)],
 ['CampusFeed absent',!/\bCampusFeed\b/.test(main)],
 ['Recovery screen retained',/JYC · RECOVERY/.test(extra)],
 ['Runtime fix CSS loaded',/v18\.15-runtime-fix\.css|v18\.16-runtime-fix\.css/.test(main)],
];
let bad=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`); if(!ok)bad++;}
if(bad) process.exit(1); console.log('V18.16 RUNTIME COMPLETENESS PASS');
