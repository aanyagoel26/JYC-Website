export const JYC_HUB_SOURCE_REGISTRY = [
  {name:'Aakriti',family:'Creative',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Abhivyakti',family:'Creative',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Aura',family:'Creative',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'BDS',family:'Cultural',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'CICR',family:'Technical',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material',website:'https://www.cicr.in/',linkedin:'https://in.linkedin.com/company/cicrjiit128'},
  {name:'Cinekala',family:'Creative',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Eloquence',family:'Literary',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material',website:'https://thyeloquence.blogspot.com/',linkedin:'https://www.linkedin.com/company/eloquence-litsoc'},
  {name:'Fortissimo',family:'Cultural',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Innovation Club',family:'Technical',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material; source deck labels the society as Innovation'},
  {name:'JODC',family:'Technical',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material',website:'',linkedin:'https://in.linkedin.com/company/jodc'},
  {name:'JSA',family:'Sports',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Panache',family:'Cultural',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Prismatic',family:'Creative',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'RPH',family:'Technical',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'VamUnique',family:'Cultural',status:'orientation-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material',website:'',linkedin:'https://www.linkedin.com/company/vamunique-the-dance-society-jiit-noida'},
  {name:'Arcadia',family:'Technical',status:'orientation-verified',publicationStatus:'draft',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'CypherX',family:'Technical',status:'orientation-verified',publicationStatus:'draft',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material',website:'',linkedin:'https://in.linkedin.com/company/cypherx-jiit'},
  {name:'Dronotics',family:'Technical',status:'orientation-verified',publicationStatus:'draft',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material',website:'https://www.dronotics.in/',linkedin:'https://www.linkedin.com/company/dronotics-jiit-128'},
  {name:'GDG',family:'Technical',status:'orientation-verified',publicationStatus:'draft',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material',website:'https://gdg-jiit.com/',linkedin:'https://in.linkedin.com/company/dsc-jiit'},
  {name:'Neural Nexus',family:'Technical',status:'orientation-verified',publicationStatus:'draft',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material'},
  {name:'Zencoders',family:'Technical',status:'orientation-verified',publicationStatus:'draft',verifiedOn:'2026-10-06',source:'Supplied JYC Orientation Program 2026–2027 / All Hubs material',website:'',linkedin:'https://www.linkedin.com/company/zencoders'},
  {name:'JIIT OPTICA',family:'Technical',status:'brochure-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'JIIT Admission Brochure 2026'},
  {name:'Qriosity',family:'Literary',status:'brochure-verified',publicationStatus:'published',verifiedOn:'2026-10-06',source:'JIIT Admission Brochure 2026'}
];

export const JYC_HUB_SOURCE_STATUS = Object.fromEntries(JYC_HUB_SOURCE_REGISTRY.map(x=>[x.name,x]));
export const JYC_HUB_VERIFIED_CURRENT = JYC_HUB_SOURCE_REGISTRY.filter(x=>x.status==='orientation-verified'||x.status==='brochure-verified');
export const JYC_HUB_SOURCE_ONLY = JYC_HUB_SOURCE_REGISTRY.filter(x=>x.status==='source-material');
