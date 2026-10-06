// Source-first public editorial records for JYC 128.
// Only records with an attributable public/source reference belong here.
// Empty operational fields intentionally remain empty until JYC publishes them.

export const JYC_EDITORIAL_ACHIEVEMENTS = [
  {
    id:'sih-finalist',
    title:'Smart India Hackathon finalist',
    organisation:'JYC / supplied hub material',
    year:'2026',
    category:'Competition',
    status:'Finalist',
    summary:'The supplied JYC material records an SIH finalist achievement in the Wall of Fame material.',
    sourceLabel:'Supplied JYC Wall of Fame material',
    sourceType:'supplied-material'
  }
];

export const JYC_EDITORIAL_PROJECTS = [
  {
    id:'dron-o-war',
    title:'Dron-O-War',
    community:'Dronotics',
    category:'Aerial robotics',
    year:'2026',
    summary:'A drone and aerial-robotics competition highlighted in the supplied JYC ecosystem material, with FPV racing, payload delivery, autonomous missions and aircraft challenges.',
    sourceLabel:'Official Dronotics event material',
    sourceUrl:'https://www.dronotics.in/'
  },
  {
    id:'codeai-hackathon',
    title:'CodeAI Hackathon',
    community:'Innovation Club',
    category:'Artificial intelligence',
    year:'2026',
    summary:'An AI-focused hackathon covering cybersecurity, NLP and healthcare-oriented innovation, with mentorship and team problem solving.',
    sourceLabel:'Official JIIT Innovation website',
    sourceUrl:'https://www.innovationjiit.in/'
  },
  {
    id:'ride-hack-26',
    title:"RIDE Hack '26",
    community:'Innovation Club',
    category:'Innovation / entrepreneurship',
    year:'2026',
    summary:'A build-and-innovation experience associated with the Innovation JIIT ecosystem.',
    sourceLabel:'Official JIIT Innovation website',
    sourceUrl:'https://www.innovationjiit.in/'
  }
];

export const JYC_IMPACT_RECORDS = [
  {
    id:'anti-ragging-awareness-2025',
    title:'Anti-Ragging Awareness Program',
    year:'2025',
    category:'Awareness',
    summary:'A published JYC activity with Thespian focused on anti-ragging awareness, campus safety and an inclusive student environment.',
    sourceLabel:'JYIT Youth Club public update',
    sourceUrl:'https://www.linkedin.com/company/jiityouthclub/'
  }
];

export const JYC_FAQ = [
  ['What is JYC?','JIIT Youth Club is the student-governed coordinating body connecting JIIT communities, hubs, societies, volunteers and major campus experiences at Sector 128.'],
  ['What is the difference between JYC and a club?','JYC is the coordinating student body; clubs and hubs are individual communities with their own focus, activities and leadership.'],
  ['How many communities are listed?','The maintained public index currently contains 23 named communities across Cultural, Technical, Creative, Literary and Sports families.'],
  ['How do I join a club?','Join through the club’s officially published recruitment cycle. When a club opens applications, its official registration link should appear on the club and recruitment pages.'],
  ['Where are JYC events published?','Published events appear on the Events page and the JYC calendar. Important notices can also appear in JYC Now / Announcements.'],
  ['Where can I find past events?','Use the Archive and Gallery to explore published event records and source-backed visual memories.'],
  ['Can I submit a project or achievement?','Public project and achievement records should be published only after verification by the JYC publishing team.'],
  ['How can I contact JYC?','Use the official Contact page and the verified JYC social channels listed there.']
];

export const JYC_CONTENT_GAPS = [
  {area:'club leadership',priority:'P0',needed:'Current heads, faculty advisors and verified socials for all 23 communities.'},
  {area:'event outcomes',priority:'P0',needed:'Winner/result/recap records for completed events where official results exist.'},
  {area:'gallery metadata',priority:'P0',needed:'Event, year, photographer/source and caption metadata for selected albums.'},
  {area:'past leadership',priority:'P1',needed:'Year-by-year JYC apex/core leadership archive from official records.'},
  {area:'impact archive',priority:'P1',needed:'Verified outreach, awareness, volunteering and community initiatives.'},
  {area:'recruitment',priority:'P1',needed:'Official application windows, eligibility, deadlines and links when a cycle opens.'},
  {area:'projects',priority:'P1',needed:'Club projects with team, repository/demo, outcome and event relationships.'},
  {area:'testimonials',priority:'P2',needed:'Only attributed student/alumni testimonials approved for publication.'}
];
