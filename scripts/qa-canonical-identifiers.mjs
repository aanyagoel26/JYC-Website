import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const legacy='agentic-ai-2026';
const canonical='jai-2026-jaypee-agentic-ai-hackathon';
const files=[];
const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.name==='node_modules'||entry.name==='.git'||entry.name==='dist')continue;if(entry.isDirectory())walk(p);else files.push(p)}};
walk(path.join(root,'src'));
files.push(path.join(root,'scripts','generate-sitemap.mjs'));
const hits=[];
for(const file of files){const text=fs.readFileSync(file,'utf8');if(text.includes(legacy))hits.push(path.relative(root,file));}
const allowed=new Set(['src/main.jsx']);
const failures=hits.filter(file=>!allowed.has(file));
const main=fs.readFileSync(path.join(root,'src/main.jsx'),'utf8');
const checks=[
 ['canonical JAI slug is present in the runtime',main.includes(canonical)],
 ['legacy JAI redirect is explicit',main.includes(`legacyEventSlugMap={'${legacy}':'${canonical}'}`)],
 ['sitemap generator contains canonical JAI slug',fs.readFileSync(path.join(root,'scripts/generate-sitemap.mjs'),'utf8').includes(canonical)],
 ['no stale JAI slug remains in runtime/sitemap generator',failures.length===0,failures.join(', ')],
];
let failed=0;for(const [name,ok,detail] of checks){console.log((ok?'PASS':'FAIL')+': '+name+(detail&&!ok?' — '+detail:''));if(!ok)failed++}
if(failed)process.exit(1);
console.log('PASS: canonical event identifier contract');