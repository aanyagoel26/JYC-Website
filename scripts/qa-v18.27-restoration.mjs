import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const main=read('src/main.jsx');
const admin=read('src/admin-chunk.jsx');
const css=read('src/v18.26-human-jyc-finish.css');
const restoration=read('src/v18.27-jyc-restoration.css');
const html=read('index.html');
const pkg=JSON.parse(read('package.json'));
const sw=read('public/sw.js');
let passed=0,failed=0;
function check(name,ok){if(ok){passed++;console.log(`PASS: ${name}`)}else{failed++;console.error(`FAIL: ${name}`)}}
const checks=[
 ['version is 18.27.0',pkg.version==='18.27.0'],
 ['V18.27 restoration layer is imported',main.includes("./v18.27-jyc-restoration.css")],
 ['Restoration layer disables old image flight',restoration.includes('body.theme-flight:before')&&restoration.includes('content:none')],
 ['Real SVG bird flight exists',main.includes('jyc-flight-bird')&&main.includes('jyc-flight-wing')],
 ['Ecosystem route cards stay upright',restoration.includes('animation:none!important')&&restoration.includes('translate(-50%,-50%)')],
 ['Light UI accent is beige',restoration.includes('--accent-red:#b89d7a!important')&&restoration.includes('background:#b89d7a!important')],
 ['Events route remains defined',/function Events\(\{data\}\)/.test(main)],
 ['Fest route remains defined',/function Fest\(\{data\}\)/.test(main)],
 ['Fest theme switcher is wired',main.includes('changeFestTheme')&&main.includes('fest-theme-switcher')],
 ['Fest theme persistence is scoped',main.includes('jyc-fest-theme-')],
 ['Admin Fest workspace is reachable',admin.includes("['fest','Fest Mode']")&&admin.includes("tab==='fest'&&<ManageFest")],
 ['Admin has the same six visual theme presets',admin.includes("['jyc','cyberpunk','diwali','neon','aurora','heritage']")],
 ['Admin theme persists locally',admin.includes("jyc-admin-theme")],
 ['Native View Transition API is used',main.includes('document.startViewTransition')&&css.includes('::view-transition-new(root)')],
 ['Phoenix theme flight crosses left to right',restoration.includes('jyc27-bird-cross')&&restoration.includes('calc(100vw + 135px)')],
 ['Light mode uses beige interface accent',restoration.includes('--accent-red:#b89d7a!important')&&restoration.includes('--accent-gold:#92795c!important')],
 ['Light mode keeps Phoenix red imagery separate',css.includes('rgba(168,36,32,.18)')],
 ['Fest theme sheen exists',css.includes('.fest-theme-sheen')&&css.includes('@keyframes fest-theme-sheen')],
 ['Admin theme tokens exist for all presets',['admin-theme-jyc','admin-theme-cyberpunk','admin-theme-diwali','admin-theme-neon','admin-theme-aurora','admin-theme-heritage'].every(x=>css.includes('.'+x))],
 ['Google Fonts remote import remains absent',!read('src/styles.css').includes('fonts.googleapis.com')],
 ['Development cleanup stays externalized',html.includes('/dev-cleanup.js')&&!/<script>\s*\/\/ Development safety/.test(html)],
 ['Service worker cache is bumped',sw.includes('jyc-cache-v18-27-0-restoration')],
 ['Reduced motion disables theme flight',css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('body.theme-flight:after,body.theme-flight:before{display:none')],
 ['No V18.18 motion layer is imported',!main.includes("./v18.18-motion.css")],
 ['Admin command palette remains',admin.includes('Quick Find')&&admin.includes('commandOpen')],
];
for(const [name,ok] of checks)check(name,ok);
console.log(`V18.27 RESTORATION QA: ${passed}/${checks.length} passed`);
if(failed)process.exit(1);
