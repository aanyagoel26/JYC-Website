import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx');
const entry=read('src/styles/public-entry.css');
const system=read('src/styles/public-system.css');
const contract=read('src/styles/jyc-theme-contract.css');
const checks=[];
const check=(name,ok,detail='')=>{checks.push({name,ok,detail});console.log((ok?'PASS':'FAIL')+': '+name+(detail?' — '+detail:''));};

const contractImport=main.indexOf("import './styles/jyc-theme-contract.css';");
const teamImport=main.indexOf("import './styles/jyc-team-experience.css';");
check('canonical theme contract is imported',contractImport>=0);
check('theme contract loads after team and other global CSS',contractImport>teamImport&&contractImport>main.indexOf("import './styles/jyc-cohesive-experience.css';"));
check('public entry does not re-import already nested design upgrades',!entry.includes("@import '../jyc-design-upgrades.css';"));
check('public entry does not re-import nested pro redesign',!entry.includes("@import './jyc-pro-redesign.css';"));
check('public system remains the single historical layer aggregator',system.includes("@import '../jyc-design-upgrades.css';")&&system.includes("@import './jyc-pro-redesign.css';"));
check('obsolete dark red palette override is removed from public system',!system.includes('--champagne:#A82420')&&!system.includes('--accent:#ef4444'));
check('light public-system accent no longer defaults to red',system.includes('--jyc-accent: #625889;')&&!system.includes('--jyc-accent: #A82420;'));
check('light palette uses warm paper, violet and champagne tokens',contract.includes('--jyc-canvas: #f5f1e8;')&&contract.includes('--jyc-accent: #625889;')&&contract.includes('--jyc-gold: #76572b;'));
check('dark palette uses midnight, lavender and champagne tokens',contract.includes('--jyc-canvas: #080d1c;')&&contract.includes('--jyc-accent: #c8bcff;')&&contract.includes('--jyc-gold: #e7d19b;'));
check('legacy red and cyan aliases resolve through the active JYC accent',contract.includes('--accent-red: var(--jyc-accent);')&&contract.includes('--tech-cyan: var(--jyc-accent);')&&contract.includes('--tech-crimson: var(--jyc-accent);'));
check('legacy surfaces and text aliases resolve through canonical tokens',contract.includes('--bg-card: var(--jyc-surface);')&&contract.includes('--text-primary: var(--jyc-text-strong);')&&contract.includes('--text-muted: var(--jyc-muted);'));
check('legacy cream and ivory aliases remain readable on dark surfaces',contract.includes('--cream: var(--jyc-text-strong);')&&contract.includes('--ivory: #f7f5ff;'));
check('public text baseline uses readable body sizing and line height',contract.includes('font-size: 16px;')&&contract.includes('line-height: 1.68;'));
check('homepage nested theme variables are reset to canonical palettes',contract.includes('html[data-theme="dark"] .jyc-editorial-home.jyc-home')&&contract.includes('--jh-bg: var(--jyc-canvas);')&&contract.includes('--jh-muted: var(--jyc-muted);'));
check('JYC57 page headings and body copy use separate readable tokens',contract.includes('.jyc57-page :where(p,small,.jyc57-meta')&&contract.includes('.jyc57-page :where(h1,h2,h3,h4,strong,b)'));
check('history and team route shells inherit canonical text tokens',contract.includes('.jyc-history-page')&&contract.includes('.team-page'));
check('shared public surfaces inherit theme tokens',contract.includes('.public-app :where(.card,.featured,.contact-card,.search-modal'));
check('portal-mounted navigation and search surfaces inherit theme tokens',contract.includes('html[data-theme="dark"] .nav')&&contract.includes('html[data-theme="dark"] .search-modal')&&contract.includes('html[data-theme="light"] .more-sheet'));
check('reduced-motion is respected by final public contract',contract.includes('@media (prefers-reduced-motion: reduce)'));

if(checks.some(x=>!x.ok)) process.exit(1);
console.log('JYC THEME CONTRACT QA PASS ('+checks.length+' checks)');
