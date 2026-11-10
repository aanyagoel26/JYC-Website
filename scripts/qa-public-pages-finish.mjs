import fs from 'node:fs';
import assert from 'node:assert/strict';

const main = fs.readFileSync('src/main.jsx', 'utf8');
const home = fs.readFileSync('src/jyc-editorial-home.jsx', 'utf8');
const config = fs.readFileSync('src/lib/site-config.js', 'utf8');
const css = fs.readFileSync('src/styles/jyc-public-pages-master-finish.css', 'utf8');
const responsivePhoto = fs.readFileSync('src/jyc-responsive-photo.jsx', 'utf8');

const checks = [
  ['student coordinators are not automatically classified as faculty', main.includes('/faculty|faculty advisor|faculty coordinator|staff advisor|mentor/i') && !main.includes('/faculty|advisor|coordinator/i')],
  ['team hub navigation uses client-side buttons', main.includes("onClick={()=>nav('/clubs/'+slug(name))}") && !main.includes("<a href={'/clubs/'+slug(name)}")],
  ['About page has section navigation, source-backed history and all key journeys', main.includes('about-contents-nav') && main.includes('about-history-timeline-v2') && main.includes("nav('/clubs')") && main.includes("nav('/team')") && main.includes("nav('/contact')")],
  ['Contact portfolio name links to the requested portfolio', main.includes('href="https://kaustubhdua.vercel.app/"') && main.includes("c.name==='Kaustubh Dua'")],
  ['creator LinkedIn, GitHub and email destinations remain intact', config.includes("linkedin:'https://www.linkedin.com/in/kaustubh-dua-2b5a76416'") && config.includes("github:'https://github.com/kaustubhdua'") && config.includes("email:'kaustubhdua1991@gmail.com'")],
  ['official JYC social routes remain intact', config.includes("instagram:'https://www.instagram.com/jiityouthclub128/'") && config.includes("linkedin:'https://in.linkedin.com/in/jyc128'") && config.includes('whatsapp:')],
  ['Contact form limits input lengths and provides an accessible character counter', main.includes('maxLength={80}') && main.includes('maxLength={254}') && main.includes('maxLength={2000}') && main.includes('{form.message.length}/2000 characters')],
  ['Contact form never reports success when the inbox is unconfigured', main.includes('if(!supabase.__configured)') && main.includes('The live contact inbox is not configured yet.')],
  ['home page highlights published leadership in role order', home.includes('const team = (data?.team || []).filter(x => x?.published === true).slice().sort') && home.includes('general secretary') && home.includes("nav('/team')")],
  ['home page never promotes a past event as the current featured event', home.includes('const featured = upcoming[0];') && !home.includes('const featured = upcoming[0] || events[0];')],
  ['home page offers a direct Contact JYC action', home.includes("nav('/contact')") && home.includes('Contact JYC')],
  ['public pages use theme tokens rather than fixed page palettes', css.includes('var(--jyc-surface)') && css.includes('var(--jyc-text-strong)') && css.includes('var(--jyc-muted)')],
  ['home sections have a responsive editorial rhythm', css.includes('.jh-about-editorial') && css.includes('.jh-photo-story') && css.includes('.jh-events') && css.includes('@media (max-width:760px)')],
  ['About navigation and cards include deliberate hover/focus states', css.includes('.about-contents-nav a:hover') && css.includes('.about-history-node-card):hover')],
  ['Contact form and channel cards have clear visual and interactive states', css.includes('.contact-card') && css.includes('.contact-form :is(input,textarea):focus') && css.includes('.contact-creator-portfolio')],
  ['Team profiles and community navigation are touch-friendly', css.includes('.team-member-flip .flip-card__back-trigger') && css.includes('.team-hub-directory button')],
  ['all four public journeys respect reduced-motion preferences', css.includes('@media (prefers-reduced-motion:reduce)') && css.includes('.jyc-editorial-home.jyc-home')],
  ['all public page layouts include phone and tablet breakpoints', css.includes('@media (max-width:760px)') && css.includes('@media (max-width:480px)')],
  ['dark theme kicker badges retain readable contrast on warm gold surfaces', css.includes('html[data-theme="dark"] .jyc57-page .jh-kicker b') && css.includes('color: #080d1c !important')],
  ['generated image derivatives recover their original manifest source and emit responsive variants', responsivePhoto.includes('isGeneratedDerivative') && responsivePhoto.includes('variantSource:manifestSource') && responsivePhoto.includes('photoDerivativeUrls(variantSource,intrinsicWidth)')],
  ['About and Contact copy is visitor-first rather than internal editorial language', main.includes('Faculty guides support the apex student body') && main.includes('JYC communities span Cultural, Technical, Creative, Literary and Sports families') && main.includes('Start a conversation.') && !main.includes('supplied orientation material instead of inventing a parallel hierarchy')],
];

let failures = 0;
for (const [label, pass] of checks) {
  console.log((pass ? 'PASS: ' : 'FAIL: ') + label);
  if (!pass) failures += 1;
}
assert.equal(failures, 0, 'Public-page QA failed ' + failures + '/' + checks.length + ' checks');
console.log('Public-page QA passed (' + checks.length + ' checks)');
