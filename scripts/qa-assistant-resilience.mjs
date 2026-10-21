import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const failures=[];
const check=(name,ok)=>{console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failures.push(name)};

const bot=read('src/jyc-bot.jsx');
const qa=read('scripts/qa-production.mjs');
const publicCss=read('src/styles/public-system.css');

check('3D model viewer is interaction-loaded',bot.includes('loadModelViewer')&&bot.includes('onPointerEnter={loadModelViewer}')&&bot.includes('onFocus={loadModelViewer}')&&!/useEffect\(\(\)=>\{[^}]*document\.createElement\('script'\)/s.test(bot));
check('3D model remains fixed and non-rotating',bot.includes('camera-orbit="0deg 75deg auto"')&&bot.includes('disable-zoom'));
check('assistant opens immediately on bot click',bot.includes('setAssistantOpen(true)')&&bot.includes('onClick={openAssistant}'));
check('production sitemap QA is build-safe',qa.includes('Generated sitemap uses the configured production origin')&&qa.includes('Sitemap will be generated during the production build'));
check('JYC identity palette remains intact',publicCss.includes('--jyc-bg: #f8f1e4')&&publicCss.includes('--jyc-accent: #a47b43'));
check('reduced motion remains explicit',publicCss.includes('@media (prefers-reduced-motion: reduce)'));

if(failures.length){console.error('ASSISTANT/RESILIENCE QA FAIL');failures.forEach(x=>console.error('FAIL:',x));process.exit(1)}
console.log('ASSISTANT/RESILIENCE QA PASS');
