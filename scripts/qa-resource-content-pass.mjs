import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const main = read('src/main.jsx');
const hubs = read('src/v21-hub-content.js');
const details = read('src/v23.6-hub-details.js');
const fallback = read('src/content/jyc-public-fallbacks.js');
const team = main + fallback;
const next = read('src/jyc-next-experience.jsx');
const editorialHome = read('src/jyc-editorial-home.jsx');

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

for (const name of [
  'Fortissimo', 'BDS', 'VamUnique', 'Panache', 'RPH', 'CICR', 'Innovation',
  'Zencoders', 'JODC', 'CypherX', 'Arcadia', 'Neural Nexus', 'GDG', 'Dronotics',
  'Aakriti', 'Aura', 'Cinekala', 'Abhivyakti', 'Prismatic', 'Eloquence', 'JSA',
  'Qriosity', 'JIIT OPTICA'
]) {
  check(
    hubs.includes(name + ':') || hubs.includes("'" + name + "':"),
    'hub content missing ' + name
  );
}

// Match the source-derived claims actually maintained in the current hub records.
// Keep the checks semantic enough to tolerate editorial wording improvements.
check(
  details.includes('Code Clash 25.1 with 850+ participants across 2 contests'),
  'RPH source achievement missing'
);
check(
  details.includes('Dron-O-War 1.0: premier national-level drone competition'),
  'Dronotics source achievement missing'
);
check(details.includes('RIDE Hack'), 'Innovation source programme missing');
check(details.includes('Photo Walk 2025/26'), 'Aura source programme missing');
check(details.includes('Kshitij 4.0'), 'JSA source programme missing');
check(details.includes('Grand Conclave 2026'), 'Eloquence source programme missing');

check(
  team.includes('Dr. Vinay Anand Tikkiwal') &&
    team.includes('Dr. Pankaj Kumar Srivastava'),
  'faculty advisors missing'
);
check(team.includes('Harisha') && team.includes('Dhruv Choudhary'), 'core heads missing');
check(next.includes('23 COMMUNITIES'), 'community count/source label missing');

// Contract the current implementation, rather than the retired PhotoChapters/JYCNetwork
// markup that caused false failures after the homepage composition changed.
check(
  editorialHome.includes('className="jh-hero"') &&
    editorialHome.includes('LazyDitherVeil') &&
    editorialHome.includes('jh-photo-story-grid') &&
    editorialHome.includes('ResponsivePhoto'),
  'homepage should retain the current logo-led hero and responsive editorial photo-story grid'
);
check(main.includes('JYCNowStrip'), 'homepage retains the consolidated JYC Now rail export');

if (failures.length) {
  failures.forEach(message => console.error('FAIL:', message));
  process.exit(1);
}

console.log('Resource content QA PASS: source-derived hub, achievement, leadership and current homepage contracts are present.');
