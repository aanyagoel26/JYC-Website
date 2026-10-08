import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'dist');
const index=path.join(dist,'index.html');

if(!fs.existsSync(index)){
  console.error('dist/index.html not found; run vite build first.');
  process.exit(1);
}

const html=fs.readFileSync(index,'utf8');
const routes={
  '/about':{
    title:'About JIIT Youth Club 128 | JYC',
    description:'Learn about JIIT Youth Club 128, its purpose, community families, activities and role across the JIIT Wish Town campus.'
  },
  '/clubs':{
    title:'JYC Communities & Clubs | JIIT Youth Club 128',
    description:'Explore JIIT Youth Club 128 communities, technical and cultural clubs, activities, events and official connections.'
  },
  '/events':{
    title:'JYC Events | JIIT Youth Club 128',
    description:'Discover published JYC events, programmes, organisers, dates, venues and official event details at JIIT Wish Town.'
  },
  '/gallery':{
    title:'JYC Moments & Photography | JIIT Youth Club 128',
    description:'Explore the official JYC visual archive, photographic moments, collections and campus stories.'
  },
  '/archive':{
    title:'JYC Archive | JIIT Youth Club 128',
    description:'Browse the JIIT Youth Club archive of published events, communities and official campus memories.'
  },
  '/team':{
    title:'JYC Leadership & People | JIIT Youth Club 128',
    description:'Meet the people behind JIIT Youth Club 128: faculty guidance, student leadership, core teams and communities.'
  },
  '/contact':{
    title:'Contact JIIT Youth Club 128 | JYC',
    description:'Connect with JIIT Youth Club 128 through official contact channels and community links.'
  },
  '/history':{
    title:'JYC History | JIIT Youth Club 128',
    description:'Explore the history, purpose and evolution of JIIT Youth Club 128.'
  },
  '/events/jai-2026-jaypee-agentic-ai-hackathon':{
    title:'JAI 2026 — Jaypee Agentic AI Hackathon | JYC',
    description:'Official JYC event record for JAI 2026, the Jaypee Agentic AI Hackathon.'
  }
};

function shellFor(meta,route){
  let out=html;
  const tags=[
    ['title',meta.title],
    ['meta[name="description"]',meta.description],
    ['meta[property="og:title"]',meta.title],
    ['meta[property="og:description"]',meta.description],
    ['meta[name="twitter:title"]',meta.title],
    ['meta[name="twitter:description"]',meta.description]
  ];
  out=out.replace(/<title>[^<]*<\/title>/i,`<title>${meta.title.replaceAll('&','&amp;')}</title>`);
  for(const [selector,value] of tags.slice(1)){
    const esc=value.replaceAll('&','&amp;').replaceAll('"','&quot;');
    if(selector.startsWith('meta[name="description"]')){
      out=out.replace(/<meta name="description" content="[^"]*"\s*\/>/i,`<meta name="description" content="${esc}" />`);
    }else if(selector.includes('og:title')){
      out=out.replace(/<meta property="og:title" content="[^"]*"\s*\/>/i,`<meta property="og:title" content="${esc}" />`);
    }else if(selector.includes('og:description')){
      out=out.replace(/<meta property="og:description" content="[^"]*"\s*\/>/i,`<meta property="og:description" content="${esc}" />`);
    }else if(selector.includes('twitter:title')){
      out=out.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/i,`<meta name="twitter:title" content="${esc}" />`);
    }else if(selector.includes('twitter:description')){
      out=out.replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/i,`<meta name="twitter:description" content="${esc}" />`);
    }
  }
  out=out.replace(/<meta property="og:url" content="[^"]*"\s*\/>/i,`<meta property="og:url" content="__JYC_CANONICAL_ROUTE__" />`);
  out=out.replace('__JYC_CANONICAL_ROUTE__',`__JYC_ORIGIN__${route}`);
  out=out.replace(/<link rel="canonical" href="[^"]*"\s*\/>/i,`<link rel="canonical" href="__JYC_ORIGIN__${route}" />`);
  return out;
}

for(const [route,meta] of Object.entries(routes)){
  const dir=path.join(dist,...route.replace(/^\//,'').split('/'));
  fs.mkdirSync(dir,{recursive:true});
  let shell=shellFor(meta,route);
  shell=shell.replaceAll('__JYC_ORIGIN__','/');
  // Keep the canonical origin relative so the deployed host is always correct.
  shell=shell.replace(`content="/${route.replace(/^\//,'')}"`,`content="${route}"`);
  fs.writeFileSync(path.join(dir,'index.html'),shell);
}
console.log(`Generated ${Object.keys(routes).length} route-specific HTML shells.`);
