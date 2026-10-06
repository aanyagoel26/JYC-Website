import fs from 'node:fs';

const registry=fs.readFileSync('src/jyc-hub-registry.js','utf8');
const team=fs.readFileSync('src/content/jyc-public-fallbacks.js','utf8');
const socials=fs.readFileSync('src/jyc-socials.js','utf8');
const audit=fs.readFileSync('docs/SUPPLIED-MATERIAL-2026-27-AUDIT.md','utf8');
const requiredOrientation=[
  'Aakriti','Abhivyakti','Aura','BDS','CICR','Cinekala','Eloquence','Fortissimo',
  'Innovation Club','JODC','JSA','Panache','Prismatic','RPH','VamUnique',
  'Arcadia','CypherX','Dronotics','GDG','Neural Nexus','Zencoders'
];
const requiredLeadership=[
  ['Devansh Tripathi','General Secretary'],['Amrit Kumar Jha','Vice President'],
  ['Daksh Sachdeva','Finance Secretary / Treasurer'],['Saksham Kotia','Joint Secretary'],
  ['Aradhyaa Singh','Executive Head'],['Divye Bajaj','PR Head'],['Shriya Singh','Digital Head'],
  ['Revant Srivastava','Management Head'],['Juhi Hatuka','Hospitality Head'],
  ['Asmi Srivastava','Hospitality Head'],['Vansh Mahajan','Security Head'],['Pratik Kumar','Security Head']
];
const failures=[];
const check=(name,ok)=>{console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failures.push(name)};
check('21 orientation-backed hubs are in the registry',requiredOrientation.every(name=>registry.includes("name:'"+name+"'")&&registry.includes("status:'orientation-verified'")));
check('Qriosity and JIIT OPTICA remain brochure-verified',registry.includes("name:'Qriosity'")&&registry.includes("name:'JIIT OPTICA'")&&registry.split("name:'Qriosity'")[1]?.includes("status:'brochure-verified'")&&registry.split("name:'JIIT OPTICA'")[1]?.includes("status:'brochure-verified'"));
check('supplied-material audit is committed',audit.includes('21 communities')&&audit.includes('Devansh Tripathi')&&audit.includes('photos.zip'));
check('official JYC 128 Instagram is sourced',socials.includes("instagram: 'https://www.instagram.com/jiityouthclub128/'")&&socials.includes("@jiityouthclub128"));
check('all 12 photographed leadership identities remain in fallback data',requiredLeadership.every(([name,role])=>team.includes("name:'"+name+"'")&&team.includes("role:'"+role+"'")));
check('Divye leadership campaign is represented in gallery fallback',team.includes("team-divye-campaign")&&team.includes("divye-bajaj.webp"));
if(failures.length){console.error('SUPPLIED MATERIAL QA FAILED: '+failures.length);process.exit(1)}
console.log('SUPPLIED MATERIAL QA PASS');
