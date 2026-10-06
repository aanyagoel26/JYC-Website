export const JYC_HUB_SOURCE_REGISTRY = [
  {name:'Aakriti',family:'Creative',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Abhivyakti',family:'Creative',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Aura',family:'Creative',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'BDS',family:'Cultural',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'CICR',family:'Technical',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Cinekala',family:'Creative',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Eloquence',family:'Literary',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Fortissimo',family:'Cultural',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Innovation Club',family:'Technical',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material; source deck labels the society as Innovation'},
  {name:'JODC',family:'Technical',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'JSA',family:'Sports',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Panache',family:'Cultural',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Prismatic',family:'Creative',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'RPH',family:'Technical',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'VamUnique',family:'Cultural',status:'orientation-verified',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Arcadia',family:'Technical',status:'source-material',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'CypherX',family:'Technical',status:'source-material',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Dronotics',family:'Technical',status:'source-material',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'GDG',family:'Technical',status:'source-material',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Neural Nexus',family:'Technical',status:'source-material',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Zencoders',family:'Technical',status:'source-material',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'JIIT OPTICA',family:'Technical',status:'brochure-verified',source:'JIIT Admission Brochure 2026'},
  {name:'Qriosity',family:'Literary',status:'brochure-verified',source:'JIIT Admission Brochure 2026'}
];

export const JYC_HUB_SOURCE_STATUS = Object.fromEntries(JYC_HUB_SOURCE_REGISTRY.map(x=>[x.name,x]));
export const JYC_HUB_VERIFIED_CURRENT = JYC_HUB_SOURCE_REGISTRY.filter(x=>x.status==='orientation-verified'||x.status==='brochure-verified');
export const JYC_HUB_SOURCE_ONLY = JYC_HUB_SOURCE_REGISTRY.filter(x=>x.status==='source-material');
