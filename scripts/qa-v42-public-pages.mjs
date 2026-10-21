import fs from 'node:fs';
const main=fs.readFileSync('src/main.jsx','utf8');
const extra=fs.readFileSync('src/extra-features.jsx','utf8');
const css=fs.readFileSync('src/v42-public-pages.css','utf8');
const publicCss=fs.readFileSync('src/styles/public-system.css','utf8');
const hub=fs.readFileSync('src/v21-hub-content.js','utf8');
const pdf=fs.readFileSync('src/pdf-hub-content.js','utf8');
const checks=[
 ['About public page exists',main.includes('function About({data})')&&main.includes('about-page')],
 ['About includes vision and mission',main.includes('VISION')&&main.includes('MISSION')],
 ['About includes seven public principles',main.includes('about-principles-v33')&&main.includes('Student voice')&&main.includes('Campus spirit')],
 ['About uses supplied programme archive',main.includes('PDF_HUB_PROGRAMME.map')],
 ['Events have lifecycle views',main.includes("['upcoming','Upcoming'")&&main.includes("['live','Ongoing'")&&main.includes("['past','Completed'")],
 ['Events have calendar view',main.includes("view==='calendar'")&&main.includes('<Calendar events={filtered}/>')],
 ['Events use supplied programme media',main.includes('PDF_HUB_PROGRAMME.map')],
 ['Gallery is exported',extra.includes('export function Gallery({data})')],
 ['Gallery uses hub family filtering',extra.includes('JYC_HUB_FAMILIES')&&extra.includes('collectionOf')],
 ['Gallery has source provenance ledger',extra.includes('gallery-source-ledger')&&extra.includes('SOURCE ARCHIVE')],
 ['Gallery retains keyboard lightbox',extra.includes('ArrowRight')&&extra.includes('ArrowLeft')&&extra.includes('Escape')],
 ['Contact has official channels',main.includes('JYC_CONTACTS.instagram')&&main.includes('JYC_CONTACTS.linkedin')&&main.includes('JYC_CONTACTS.whatsapp')],
 ['Contact has public submission guard',main.includes("supabase.functions.invoke('public-submission'")],
 ['JYC maintains 23 sourced communities',Object.keys({}).length===0&&((hub.match(/^\s{2}(?:'[^']+'|[A-Za-z][^:]+):\{/gm)||[]).length===23)],
 ['PDF archive modules are wired',main.includes('PDF_HUB_GALLERY')&&main.includes('PDF_HUB_EXTRA_GALLERY')&&main.includes('PDF_HUB_PROGRAMME')],
 ['V42 stylesheet wired through public system',publicCss.includes("@import '../v42-public-pages.css';")],
 ['V42 has responsive layouts',css.includes('@media(max-width:1000px)')&&css.includes('@media(max-width:680px)')],
 ['V42 respects reduced motion',css.includes('@media(prefers-reduced-motion:reduce)')],
 ['V42 stays within JYC palette',css.includes('var(--jyc-navy)')&&css.includes('var(--jyc-champagne)')&&css.includes('var(--jyc-ivory)')],
 ['No custom cursor introduced',!css.includes('cursor:none')&&!main.includes('custom-cursor')],
 ['PDF gallery has substantial source material',pdf.includes('PDF_HUB_GALLERY')&&pdf.includes('pdf-jyc-01')&&pdf.includes('pdf-vamunique-01')&&pdf.includes('pdf-arcadia-01')],
];
let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+' · '+name);if(!ok)failed++}
if(failed)process.exit(1);
