import fs from 'node:fs';
const main=fs.readFileSync('src/main.jsx','utf8');
const css=fs.readFileSync('src/v41-club-experience.css','utf8');
const publicCss=fs.readFileSync('src/styles/public-system.css','utf8');
const checks=[
 ['v41 club index class',main.includes('clubs-page-v41')],
 ['v41 club detail class',main.includes('club-detail-v41')],
 ['v41 hub directory class',main.includes('hub-directory-v41')],
 ['v41 club card class',main.includes('club-card-v41')],
 ['club card pointer spotlight variables',main.includes('--pointer-x')&&main.includes('--pointer-y')],
 ['loading screen removes orbit markup',main.includes('loading-v41')&&!main.includes('<div className="loading-grid"/>')&&!main.includes('loading-orbit loading-orbit-a')],
 ['loading uses JYC identity mark',main.includes('loading-v41-mark-wrap')&&main.includes('<LogoImage alt="JIIT Youth Club"/>')],
 ['v41 stylesheet is wired through public system',publicCss.includes("@import '../v41-club-experience.css';")],
 ['v41 stylesheet has reduced motion contract',css.includes('@media(prefers-reduced-motion:reduce)')],
 ['v41 stylesheet has mobile contract',css.includes('@media (max-width:680px)')],
 ['v41 stylesheet uses senior logo palette',css.includes('var(--jyc-navy)')&&css.includes('var(--jyc-champagne)')&&css.includes('var(--jyc-ivory)')],
 ['no custom cursor added',!css.includes('cursor:none')&&!main.includes('custom-cursor')],
];
let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+' · '+name);if(!ok)failed++}
if(failed)process.exit(1);
