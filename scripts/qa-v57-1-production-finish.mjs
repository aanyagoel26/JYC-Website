import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
const main=read('src/main.jsx');
const exp=read('src/jyc57-experience.jsx');
const extra=read('src/extra-features.jsx');
const sw=read('public/sw.js');
const readme=read('README.md');

const checks=[];
const add=(name,ok)=>checks.push([name,Boolean(ok)]);

add('release is v57.1.0',pkg.version==='57.1.0'&&lock.version==='57.1.0'&&lock.packages?.['']?.version==='57.1.0');
add('service worker cache is rotated',sw.includes('jyc-cache-v57-1-0')&&!sw.includes('jyc-cache-v57-0-0'));
add('README release is v57.1.0',readme.includes('Current release: V57.1.0')&&readme.includes('V57.1.0 is the current code release'));
add('event detail has registration action',/id="event-register"/.test(main)&&/REGISTER NOW|REGISTRATIONS CLOSED/.test(main));
add('event detail gates unverified planned registration',/registrationPublished=e\.publicStatus!=='planned'\|\|e\.registrationVerified===true/.test(main)&&/Boolean\(e\.registrationUrl\|\|e\.registrationMode==='native'\)/.test(main));
add('event detail has share and ICS tools',/ShareButton/.test(main)&&/DownloadICS/.test(main));
add('event detail has source/provenance surface',/Official event sources|source photography|VISUAL RECORD/.test(main));
add('event detail has related event/community links',/relatedEvents/.test(main)&&/relatedClub/.test(main));
add('club detail runtime is preserved',/function ClubDetail/.test(main));
add('club detail supports recruitment and official links',/recruitment/.test(main)&&/socials|website|linkedin|instagram/.test(main));
add('calendar route is preserved',/clean==='\\/calendar'/.test(main)&&/JYCCalendarPage/.test(main));
add('calendar supports Google Calendar',/calendar\.google\.com/.test(main));
add('public calendar exports the selected month as ICS',/const downloadMonthICS=/.test(main)&&/Add month to device/.test(main)&&/replace\(\/-\/g,''\).*T/.test(main));
add('calendar controls expose accessible month semantics',/aria-label="Previous month"/.test(main)&&/aria-label="Next month"/.test(main)&&/aria-live="polite"/.test(main));
add('club side panel chooses the next live/upcoming event',/const upcomingEvents=events\.filter\(e=>eventState\(e\)!=='past'\)/.test(main)&&/upcomingEvents\[0\]/.test(main));
add('calendar/ICS helper remains available',/DownloadICS/.test(main)&&/googleCalendarUrl/.test(main));
add('Sector 128 event boundary remains enforced',/isSector128Venue/.test(main)&&/events\.filter\(e=>isSector128Venue/.test(main));
add('retired Projects/Impact/FAQ navigation remains absent',!main.includes("['/projects','Projects'")&&!main.includes("['/impact','Impact'")&&!main.includes("['/faq','FAQ'"));
add('reduced-motion CSS contract remains present',/prefers-reduced-motion/.test(read('src/styles/public-system.css')));
add('no new animation/icon dependency was introduced',pkg.dependencies?.motion==='14.0.0'&&pkg.dependencies?.gsap==='3.15.0'&&pkg.dependencies?.['@hugeicons/react']==='1.1.10');
add('v57.1 experience routes remain wired',main.includes('JYC57Events')&&main.includes('JYC57Clubs')&&main.includes('JYC57Gallery')&&main.includes('JYC57Archive')&&exp.includes('Sector 128 only'));

let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+' · '+name);if(!ok)failed++}
if(failed)process.exit(1);
console.log('JYC V57.1 production-finish contract PASS ('+checks.length+' checks)');
