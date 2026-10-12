import {JYC_OFFICIAL_HUB_DESCRIPTIONS} from './jyc-official-hub-descriptions.js';
/*
 V23.6 HUB DETAIL DATA
 Source hierarchy:
 1) supplied JYC / hub presentation material (all hubs 1.pdf)
 2) previously verified official club-site research for CICR and Innovation
 3) official social profiles (Instagram & LinkedIn)
 No fabricated leadership or claims are included; all entries are drawn from source materials.
*/
export const JYC_HUB_DETAILS = {
  Fortissimo:{
    label:'Music and acoustic performance community',
    activities:['Vocal and instrumental performance','Battle of the Bands','Acoustic jams','Converge stage headliners','Open mic sessions','Western and Indian classical fusion'],
    experience:'Fortissimo is the premier music and band society of JIIT Sector 128. From high-voltage Battle of the Bands at Converge to soulful acoustic jams and orientation open mics, the society unites vocalists, guitarists, drummers, and keyboardists across genres.',
    sourceHighlights:[
      'Official music society uniting vocalists and instrumentalists across JIIT 128',
      'Headlines the Battle of the Bands at Converge and college cultural functions',
      'Conducts regular jam sessions, studio recordings, and campus acoustic nights',
      'Fosters diverse genres spanning rock, metal, pop, semi-classical, and Bollywood fusion'
    ],
    signature:['Battle of the Bands','Acoustic Jam Nights','Converge Headliner Showcase','Orientation Open Mic']
  },
  BDS:{
    label:'Bhangra and cultural dance community',
    sourcePeople:[['Society Head','Ishaan Srivastava'],['Coordinator','Isha Mehrotra']],
    activities:['Folk Bhangra choreography','College performances','Cultural festivals','Inter-college competitions','Workshops and practice sessions','Dhol synchronisation'],
    experience:'Bhangra Dance Society (BDS) is celebrated for its infectious energy, traditional Punjabi folk choreography, and thunderous dhol rhythms. The society represents JIIT across North Indian university cultural fests, winning major accolades.',
    sourceHighlights:[
      '"More than a club. More than a team. A family that dances to the same beat."',
      'Major events: Freshers’ Induction, Ethnic Day Showcase, and Annual Converge Performances',
      'High-energy folk Bhangra choreography, stunts, and thunderous live dhol synchronisation',
      'Interactive campus workshops combining hands-on dance learning, team building, and skill development'
    ],
    signature:['Freshers’ Induction Showcase','Ethnic Day & Diwali Fest','Annual Converge Showcase','Inter-University Bhangra Wars']
  },
  VamUnique:{
    label:'Dance and choreography',
    sourcePeople:[['Society Head','Niyati'],['Coordinator','Naina'],['Choreography Coordinator','Shreya'],['Event Coordinator','Renesha']],
    sourceHighlights:[
      '"Part dance club, part family, part unpaid cardio — where 5, 6, 7, 8 becomes a lifestyle"',
      'Official college dance society of JIIT Sector 128 (Orientation 2026–27)',
      'Multiple genres showcased: Hip-Hop, Contemporary, Bollywood, and Classical',
      'Conducts campus flashmobs, induction showcases, and inter-college fest routines'
    ],
    activities:['Hip hop','Contemporary','Bollywood','Classical','Performances','Induction','Workshops and flashmobs'],
    experience:'The supplied 2026–27 material presents VamUnique as a vibrant dance community where multiple styles share one stage, with high-voltage performances, induction activity, workshops, flashmobs, and a close-knit team culture.',
    signature:['Induction Showcase','Stage performances','Workshops','Flashmobs']
  },
  Panache:{
    label:'Fashion and performance',
    sourcePeople:[
      ['Society Head','Vanya Gupta'],['Society Head','Sarthak Vashisht'],
      ['Super Senior Advisor','Nipun Prakash'],['Senior Advisor','Hannah'],['Senior Advisor','Vansh Chaudhary'],
      ['PR Head','Kashish'],['Creative Head','Shriya'],['Cinematics & Management Head','Mrigakshi Khare']
    ],
    sourceHighlights:[
      'Official fashion society providing a high-profile runway platform for styling, modelling, and self-confidence',
      'Winners of Vogue-IIT Roorkee prelims 2024 and Mosaic IITM awards 2026',
      'Collaborative outdoor photo walks with Aura at Lodhi Garden and Majnu Ka Tila',
      'Student-crafted themed props, avant-garde makeup booth & facepaint, and runway choreography'
    ],
    activities:['Fashion designing','Photowalks','Makeup and face paint','Cosplay','Flashmobs','Stage performances'],
    experience:'The supplied Panache material describes fashion as a platform for talent, teamwork, confidence, and exposure, extending from bespoke styling and modelling to stage production and photography collaborations.',
    signature:['Vogue-IIT Roorkee prelim winner · 2024','Mosaic IITM awards · 2026','Panache × Aura Lodhi Garden Photowalk','Annual Runway Showcase']
  },
  RPH:{
    label:'Coding and problem solving',
    sourcePeople:[
      ['Society Head','Shaurya Goyal'],['Coordinator','Sejal Gupta'],
      ['Technical Lead','Yug Thakral'],['Technical Lead','Yash Sharaswat'],['Technical Lead','Lakshya Mishra'],['Technical Lead','Aryan Mehta'],
      ['Management Lead','Suhani Dubey'],['Management Lead','Moksh Rastogi'],['Management Lead','Ayaansh Rawat'],
      ['Social Media Lead','Nancy Gupta'],['Design Lead','Niharika Saini']
    ],
    sourceHighlights:[
      'Flagship Code Clash series: Code Clash 25.1 with 850+ participants across 2 contests; Code Clash 25.2 with 500+ participants',
      'Coding contests integrated with academic curriculum for practical evaluation and ICPC contest preparation',
      'Structured sessions for 1st & 2nd-year students focused on DSA, Competitive Programming, and modern C++',
      'Senior success stories include alumni placements at global tech leaders like Google, Amazon, and Zomato'
    ],
    activities:['DSA','Competitive Programming','C++ learning','Coding contests','Mentorship','Technical interview preparation'],
    experience:'The supplied RPH material focuses on DSA and Competitive Programming, with structured workshops, mentorship, hands-on problem solving, and preparation for contests, internships, placements, and technical interviews.',
    signature:['Code Clash 2025','Code Clash 25.1 (850+ coders)','Code Clash 25.2 (500+ coders)','DSA Masterclass Sprints']
  },
  CICR:{
    label:'Robotics and prototyping',
    sourceHighlights:[
      'Officially presented as the Robotics Hub of JIIT-128',
      'Official 2026 updates include AI Unlocked (11 August) and ROBOSPARK (21 September)',
      'TechTonic 2.0 is listed as a three-day AI/ML + robotics workshop experience',
      'Circuit Rush and Robo Soccer appear in the public event archive',
      'Hands-on projects, advanced labs, and electronics prototyping form the technical identity'
    ],
    activities:['Robotics projects','Hands-on learning','Advanced labs','Electronics design and prototyping','Workshops','Competitions'],
    experience:'CICR is the robotics hub of JIIT-128. Its official club material centres hands-on projects, learning, prototyping, labs, and an active technical community around robotics and automation.',
    signature:['TechTonic 2.0','Circuit Rush','Robo Soccer','Converge robotics competitions']
  },
  Innovation:{
    label:'Innovation and entrepreneurship',
    officialDescription:'RIDE Innovation at JIIT Noida supports startup teams with maker spaces, prototyping and AI labs, mentorship and expert guidance.',
    sourceHighlights:[
      'RIDE Hack’26 is listed for 1 November 2026; confirm current registration status directly with the organiser',
      'Official Innovation JIIT programme includes RIDE Hack, CodeAI, Innovate, and Climate Data Hackathon',
      'Labs, mentorship, and resources connect student ideas to real-world innovation',
      'Current public Innovation programme also highlights startup-expo and entrepreneurship activity'
    ],
    activities:['Innovation programmes','Mentorship','Prototyping and fabrication','Startup-oriented learning','Hackathons','Technical and business support'],
    experience:'The Innovation JIIT ecosystem connects students with labs, mentorship, resources, and entrepreneurship-oriented programmes. Its public programme history includes RIDE Hack, CodeAI, Innovate, and climate-focused hackathon activity.',
    signature:['RIDE Hack','CodeAI','Innovate','Climate Data Hackathon']
  },
  Zencoders:{
    label:'Programming and development',
    sourcePeople:[
      ['HOD','Mrs. Devpriya Soni'],['Faculty Coordinator','Mr. Shelendra Pal'],
      ['President','Keshav Agrawal'],['Treasurer','Aryan Negi'],
      ['Management Head','Abhi Gautam'],['Technical Head','Harshita Gupta'],['Technical Head','Anmol Sharma'],
      ['Creative Head','Jiya Sharma'],['Digital Head','Divisha Agarwal'],['Cinematics Head','Sheetal Mishra'],
      ['Senior Advisor','Aditya Garg'],['Senior Advisor','Saumya Sharma'],['Senior Advisor','Ananya Agrawal']
    ],
    sourceHighlights:[
      'Origin: "Zen" is derived from "zenith" (the highest point) — coders aiming for the pinnacle of coding excellence',
      'Commitment to ethical coding, diverse perspectives, and community open-source contributions',
      'Comprehensive learning resources: tutorials, coding bootcamps, online tracks, and peer study groups',
      'Hands-on problem solving through hackathons, practical challenges, and real-world software engineering'
    ],
    activities:['Coding practice','Practical sessions','Open-source participation','Coding bootcamps','Study groups','Hackathons and coding challenges'],
    experience:'The supplied ZenCoders material frames coding excellence around confidence, practical learning, and collaboration, with open-source participation, resources, and hands-on challenges.',
    signature:['Code your dreams','Practical sessions','Open-source projects','Zenith Coding Challenge']
  },
  JODC:{
    label:'Open-source development',
    sourceHighlights:[
      'Official LinkedIn identifies JODC as the Open Source Society of JIIT-128',
      'The profile highlights contribution, collaboration, and developer networking',
      'Meetups, dev-sprints, and hackathons support learning and open-source participation'
    ],
    activities:['Open-source contribution','Developer collaboration','Repositories and projects','Community learning'],
    experience:'JODC is listed in the supplied JYC material as the open-source developer circle. The dedicated club repository also centres contribution-oriented developer workflows and community project discovery.',
    signature:['Open source','Contributions','Developer community','Open Summer of Code']
  },
  CypherX:{
    label:'Cybersecurity',
    sourcePeople:[
      ['Advisor','Ms. Chandrima Nath'],['Coordinator','Mr. Ankit Sharma'],
      ['Faculty Coordinator','Mrs. Ruchika Bala'],['Faculty Coordinator','Mrs. Akansha Singh']
    ],
    sourceHighlights:[
      'Official student-led cybersecurity society of JIIT Sector 128',
      'Hands-on Capture-the-Flag (CTF) challenges, network security labs, and ethical hacking workshops',
      'Explores career pathways: Security Analyst, SOC Analyst, Pen-Tester, Cloud Security Engineer, Digital Forensics',
      'Empowers students with leadership qualities and a security-first mindset needed in a digital world'
    ],
    activities:['Cybersecurity workshops','CTFs','Hands-on projects','Senior mentorship','Security awareness','Digital Forensics labs'],
    experience:'The supplied CypherX material focuses on security awareness and practical learning through workshops, Capture the Flag challenges, projects, and mentorship.',
    signature:['CTF Challenges','Cybersecurity Workshops','Digital Defence Sprints','Security Awareness Camps']
  },
  Arcadia:{
    label:'Esports and gaming',
    sourceHighlights:[
      '"Where passion meets play · Play · Compete · Connect · Repeat"',
      'Premier esports and gaming club hosting competitive tournaments, LAN events, and interactive activities',
      'Interactive gaming experiences powered by the campus AR/VR Lab',
      'Featured competitive formats include PC games, mobile esports, Aim Labs challenges, and arcade classics'
    ],
    activities:['Gaming tournaments','Gaming challenges','Community events','Competitive esports','AR/VR experiences','Teamwork and networking'],
    experience:'The supplied Arcadia material presents gaming as both high-octane competition and community building, with tournaments, challenges, networking, and interactive AR/VR Lab experiences.',
    signature:['AR/VR Arena Experiences','PC & Mobile Tournaments','Aim Labs Reflex Challenge','Flappy Bird Retro Jam']
  },
  'Neural Nexus':{
    label:'Artificial intelligence and machine learning',
    sourcePeople:[
      ['Society Coordinator','Tanishka Singh'],
      ['Senior Advisor','Adarsh Sharma']
    ],
    sourceHighlights:[
      '"A community where curiosity meets intelligence, and ideas evolve into innovation"',
      'Official AI/ML Society of JIIT, exploring AI beyond the classroom through practical learning and real-world projects',
      'Structured operational domains: Technical Team (AI/ML models), Management Team, PR & Marketing, and Digital Team',
      'Workshops, hackathons, and research-driven initiatives covering computer vision, NLP, and modern AI tooling'
    ],
    activities:['AI/ML fundamentals','Programming and tools','Real-world projects','Hackathons','Coding competitions','AI challenges','Workshops and guest lectures'],
    experience:'The supplied Neural Nexus material describes a practical AI/ML community where students learn, build, and grow through projects, challenges, workshops, hackathons, and mentor networking.',
    signature:['AI Workshop Sprints','Hackathons & Kaggle Tracks','Real-World Model Deployment','AI Brainstorming Collabs']
  },
  GDG:{
    label:'Developer and cloud community',
    activities:['DevFests and hackathons','Google Cloud Study Jams','Android and Flutter workshops','Solution Challenge sprints','Tech talks and hands-on codelabs'],
    experience:'Google Developer Group (GDG) on Campus connects students with Google technologies, cloud computing, modern web and mobile development frameworks, and peer-to-peer mentoring.',
    sourceHighlights:[
      'Official developer community affiliated with Google technologies',
      'Hosts DevFests, hands-on Cloud Study Jams, and Solution Challenge sprints',
      'Connects JIIT developers to global open-source and developer ecosystems'
    ],
    signature:['DevFest JIIT','Google Cloud Study Jams','Flutter Festival','Solution Challenge Hackathon']
  },
  Dronotics:{
    label:'Drones and aerial robotics',
    sourcePeople:[['Coordinator','Aman Gandotra'],['Senior Advisor','Vaibhav Katariya'],['Faculty Coordinator','Dr. Priyanka Kwatra'],['Faculty Coordinator','Dr. Deepti Singh']],
    sourceHighlights:[
      'Official drone and aerial robotics club of JIIT Sector 128: "Where Innovation Takes Flight"',
      'Dron-O-War 1.0: premier national-level drone competition featuring aerial battles and technical challenges',
      'Top Gun Challenge: signature flight simulation challenge testing precision, reflexes, and pilot navigation',
      'Hands-on drone fabrication, quadcopter engineering, collaborative projects, and aviation workshops'
    ],
    activities:['Drone technology','Hands-on engineering','Technical workshops','Collaborative projects','Flight simulation','Competitions'],
    experience:'The supplied Dronotics material describes an aerial-robotics community built around hands-on learning, innovation, teamwork, and technical excellence.',
    signature:['Dron-O-War 1.0','Top Gun Challenge','Autonomous Flight Labs','Drone Engineering Workshops']
  },
  Aakriti:{
    label:'Fine arts and visual craft',
    sourcePeople:[
      ['Society Head','Shreya Goswami'],
      ['Coordinator','Aarya Garg'],
      ['Coordinator','Vanshik Jain']
    ],
    sourceHighlights:[
      'Official Fine Arts Society of JIIT-128 bringing imagination to life and transforming campus spaces',
      'Signature initiatives: "Art of the Week" and "Best out of Waste" creative recycling competitions',
      'Designs complete campus décor, vibrant backdrops, props, and installations for Converge, Ebullience, and Farewell',
      'Actively competes in inter-college fests at IIT-D, IIIT-D, and DU, consistently winning trophies and awards'
    ],
    activities:['Art of the Week','Best out of Waste','Campus decoration','Exhibitions and competitions','Inter-college participation','Event installations','Farewell decor','Ebullience decor'],
    experience:'The supplied Aakriti material shows the Fine Arts Society shaping campus spaces and events through art, props, installations, competitions, and creative reuse of materials.',
    signature:['Art of the Week','Best out of Waste','Converge Aesthetic Installations','Ebullience Grand Décor','Farewell Stage Magic']
  },
  Aura:{
    label:'Photography and visual storytelling',
    sourceHighlights:[
      'Official photography society of JIIT 128: promoting photography as both fine art and professional craft',
      'Covers campus flagship events, lectures, workshops, seminars, and provides student profile portraits',
      'Conducts signature outdoor Photo Walks: Majnu Ka Tila, Lodhi Garden (Panache × Aura), and Old Delhi',
      'Organised photo exhibitions at Converge & Synergy’25; winner of 1st Prize at IIP Noida Annual Competition'
    ],
    activities:['Campus event coverage','Lectures and workshops','Photo walks','Profile photography','Photography competitions','Studio & low-light shooting'],
    experience:'The supplied Aura material focuses on photography as an art and a practical skill, covering campus events, lectures, workshops, photo walks, and competitions while building professional portfolio experience.',
    signature:['Photo Walk 2025/26 (Majnu Ka Tila)','Panache × Aura Lodhi Garden Photowalk','Old Delhi Photography Workshop','Converge Photography Exhibition']
  },
  Cinekala:{
    label:'Film, cinematography and visual storytelling',
    activities:['Short film productions','Official campus aftermovies','Cinematography and framing','Screenwriting workshops','Trailer cutting and colour grading'],
    experience:'Cinekala is the filmmaking and cinematography society of JIIT. Capturing campus life on 24fps, Cinekala produces cinematic aftermovies for flagship fests like Converge and Ebullience, directs fiction shorts, and trains aspiring filmmakers.',
    sourceHighlights:[
      'Official filmmaking and cinematic production society of JIIT 128',
      'Produces official aftermovies, promotional trailers, and documentary reels',
      'Conducts camera gear handling, directing, and scriptwriting workshops'
    ],
    signature:['Converge Official Aftermovie','Campus Short Film Festival','Cinematography Codelab','Ebullience Reel Showcase']
  },
  Abhivyakti:{
    label:'Dramatics and street theatre society',
    activities:['Nukkad Natak (Street Play)','Rangmanch (Stage Play)','Mono-acting and improv','Social awareness storytelling','Inter-college dramatics circuits','Voice modulation and stagecraft'],
    experience:'Abhivyakti is the dramatics society of JIIT, renowned across Delhi-NCR for its thought-provoking Nukkad Nataks (Street Plays) and gripping stage plays. The society brings pressing social realities to light through sharp dialogue, choreography, and passionate performance.',
    sourceHighlights:[
      'Official dramatics society with high-impact Street and Stage theatre productions',
      'Regular winners at national youth fests including IIT Delhi Rendezvous, DTU, and Converge',
      'Conducts intensive acting, voice projection, and scriptwriting bootcamps'
    ],
    signature:['Annual Nukkad Natak Production','Converge Street Play Championship','Stage Play Rangmanch','Freshers Improv Night']
  },
  Prismatic:{
    label:'Graphic design and visual communication',
    sourceHighlights:[
      'Official Graphic Design Society of JIIT-128 — where creativity meets purpose',
      'A community of creative thinkers, visual storytellers, and aspiring designers transforming ideas into visual communication',
      'Conducts hands-on design sprints, typography workshops, UI/UX conceptualisation, and digital artwork production',
      'Fosters design empathy, creative problem-solving, and visual branding across student initiatives'
    ],
    activities:['Graphic design','Visual storytelling','Hands-on projects','Workshops','Creative collaboration','Real-world design experience','UI/UX systems'],
    experience:'The supplied Prismatic material describes the official Graphic Design Society as a community of creative thinkers and visual storytellers who use design to communicate ideas, solve problems, and inspire change.',
    signature:['Graphic Design Workshops','Visual Identity Systems','Digital Storytelling Sprints','Campus Brand Collaborations']
  },
  Eloquence:{
    label:'Writing and speaking',
    sourcePeople:[
      ['Faculty Coordinator','Dr. Ekta Srivastava'],
      ['Faculty Coordinator','Dr. Himani Bansal']
    ],
    activities:['Debating','Anchoring','Writing','Poetry','Public speaking','Creative writing'],
    experience:'The supplied Eloquence material presents the literary hub as a home for debaters, anchors, writers, and poets, with a strong emphasis on communication, confidence, and creative expression.',
    sourceHighlights:[
      'Literary hub of JIIT-128 for debaters, witty anchors, philosophical writers, and poets',
      'Official Masters of Ceremonies (MCs) for Converge 2026: inaugurations, artist call, dance battles, and awards',
      'Signature events: Grand Conclave 2026 (public speaking & wit) and Miss Matched ’26 (literary pairings)',
      'Publishes literary writings on thyeloquence.blogspot.com'
    ],
    signature:['Grand Conclave 2026','Miss Matched ’26','Triple Trouble Tales','Ebullience’25','Converge Anchoring Showcase']
  },
  JSA:{
    label:'Campus sports',
    activities:['Cricket','Football','Basketball','Volleyball','Lawn tennis','Carrom','Table tennis','Chess','Badminton'],
    experience:'The supplied sports material covers both outdoor and indoor sport at JIIT-128 and presents Kshitij as a recurring annual sports meet with multiple sports and competitive formats.',
    sourceHighlights:[
      'Jaypee Sports Association governing both outdoor and indoor athletic competitions at JIIT-128',
      'Kshitij 1.0: 31 Oct – 2 Nov 2025 with 550+ participants across 7 sports over 3 days of competition',
      'Kshitij 2.0: 20 Feb – 22 Feb 2026 with 400+ participants across 7 sports',
      'Year 26–27 roster includes Kshitij 3.0 (9 titles), Annual 5K Marathon & Sprints, and Kshitij 4.0'
    ],
    signature:['Kshitij 1.0 (550+ Athletes)','Kshitij 2.0 (400+ Athletes)','Kshitij 3.0 & 4.0','Annual 5k Marathon & Sprint']
  },
  Qriosity:{
    label:'Quizzing and knowledge',
    activities:['Quizzes','Knowledge-based competitions','Curiosity and awareness','Critical thinking'],
    experience:'The official JIIT Admission Brochure 2026 identifies Qriosity as the Quizzing Society. Its stated role is to organise quizzes and knowledge-based competitions that promote curiosity, awareness and critical thinking.',
    signature:['Quizzes','Knowledge competitions','Critical thinking'],
    sourceHighlights:['Identified in the official JIIT Admission Brochure 2026','Knowledge-based competitions','Curiosity, awareness and critical thinking']
  },
  'JIIT OPTICA':{
    label:'STEM and scientific exploration',
    activities:['STEM engagement','Scientific curiosity','Student chapter activity','Technical exploration'],
    experience:'The official JIIT Admission Brochure 2026 identifies the JIIT OPTICA student chapter in the Department of Physics and Material Science and Engineering as a scientific society aspiring to inspire students through STEM.',
    signature:['STEM','Scientific curiosity','Technical exploration'],
    sourceHighlights:['Identified in the official JIIT Admission Brochure 2026','Student chapter of OPTICA','Department of Physics and Material Science and Engineering','STEM-focused scientific society']
  },
};

export function hubDetails(name){
  const key=Object.keys(JYC_HUB_DETAILS).find(k=>k.toLowerCase()===String(name||'').trim().toLowerCase());
  return key?{...JYC_HUB_DETAILS[key],officialDescription:JYC_OFFICIAL_HUB_DESCRIPTIONS[key]||'',name:key}:null;
}
