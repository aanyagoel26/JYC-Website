import fs from 'node:fs';
const content=fs.readFileSync('src/hub-identities.js','utf8');
const main=fs.readFileSync('src/main.jsx','utf8');
const names=['Fortissimo','BDS','VamUnique','Panache','RPH','CICR','Innovation','Zencoders','JODC','CypherX','Arcadia','Neural Nexus','GDG','Dronotics','Aakriti','Aura','Cinekala','Abhivyakti','Prismatic','Eloquence','JSA','Qriosity','JIIT OPTICA'];
const baseBlock=content.slice(content.indexOf('const BASE={'),content.indexOf('};\n\nconst EVENT_PRESETS='));
const count=(baseBlock.match(/^[ \t]*(?:'[^']+'|[^:]+):\{/gm)||[]).length;
if(count!==23) throw new Error(`Expected 23 hub identities, found ${count}`);
for(const n of names){if(!baseBlock.includes(`${n}:`) && !baseBlock.includes(`'${n}':`)) throw new Error(`Missing identity: ${n}`)}
for(const n of ['JAI 2026','DRONO-O-WAR',"RIDE Hack'26",'CodeAI Hackathon','TechTonic 2.0','Code Clash 25.1','Code Clash 25.2']){if(!content.includes(n)) throw new Error(`Missing event identity: ${n}`)}
for(const token of ['hubIdentity','hub-identity-rail','club-identity-card','data-hub']) if(!main.includes(token)) throw new Error(`Missing wiring: ${token}`);
if(!main.includes("'--club-banner':c.banner?`url(${c.banner})`:'none'")) throw new Error('Missing safe club banner fallback');
console.log('PASS: 23 JYC hub identities are defined and wired');
console.log('PASS: club cards and detail pages use shared identity variables');
console.log('PASS: missing banner fallback is safe');
console.log('V23.6 HUB IDENTITY QA: 3/3 passed');
