import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();const main=fs.readFileSync(path.join(root,'src','main.jsx'),'utf8');const css=fs.readFileSync(path.join(root,'src','v18.13-jyc-compact.css'),'utf8');let fail=0;
const checks=[
 ['V15 Home structure restored',/function Home\(\{data\}\)[\s\S]*?JYCPulse data=\{data\}[\s\S]*?NextMoment data=\{data\}/.test(main)],
 ['No orphaned CampusFeed',!/<CampusFeed\b/.test(main)],
 ['Supabase missing-env is non-fatal',/supabase\.__configured===false/.test(main)],
 ['Compact desktop hero',/home \.hero h1\{[^}]*font-size:clamp\(62px/.test(css)],
 ['Compact mobile hero',/home \.hero h1\{font-size:clamp\(48px/.test(css)],
 ['Admin sidebar fixed width',/grid-template-columns:260px minmax\(0,1fr\)/.test(css)],
 ['Admin labels cannot collapse',/\.admin-nav-label\{[\s\S]*?white-space:nowrap/.test(css)],
 ['Mobile admin hides desktop sidebar',/\.admin-side\{display:none!important\}/.test(css)],
 ['Phoenix motion calmed',/\.home \.hero-art \.phoenix-artwork img\{[^}]*animation:none!important/.test(css)],
 ['Direct cursor transitions',/\.jyc-cursor-dot,\.jyc-cursor-ring\{transition:opacity 80ms/.test(css)],
];
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(!ok)fail++;}if(fail)process.exit(1);console.log('V18.13 BEST JYC STATIC QA PASS');
