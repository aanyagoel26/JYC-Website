import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const main=fs.readFileSync(path.join(root,'src','styles','public-system.css'),'utf8');
const css=fs.readFileSync(path.join(root,'src','styles','jyc-v56-9-editorial.css'),'utf8');
const checks=[
  ['V56.9 editorial stylesheet is imported',main.includes("@import './jyc-v56-9-editorial.css';")],
  ['Editorial paper palette is present',css.includes('--jyc-editorial-paper:#f5f1e6')],
  ['Homepage uses editorial two-column hero',css.includes('.public-app .home .hero')&&css.includes('grid-template-columns:minmax(0,1.05fr)')],
  ['Hero typography is intentionally large',css.includes('font-size:clamp(52px,7.2vw,104px)')],
  ['Card grids use restrained editorial separators',css.includes('gap:1px!important')&&css.includes('background:var(--jyc-editorial-line)')],
  ['Gallery keeps photography dominant',css.includes('.public-app .gallery-item img')&&css.includes('saturate(.88)')],
  ['Mobile hero collapses to one column',css.includes('@media (max-width:900px)')&&css.includes('grid-template-columns:1fr!important')],
  ['Reduced-motion contract remains present',css.includes('@media (prefers-reduced-motion:reduce)')]
];
let failed=0;
for(const [name,ok] of checks){
  if(ok) console.log('PASS:',name);
  else { console.error('FAIL:',name); failed++; }
}
if(failed) process.exit(1);
console.log('V56.9 editorial visual contract passed.');
