import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx');
const platform=read('src/v14-platform.jsx');
const extra=read('src/extra-features.jsx');
const admin=read('src/admin-chunk.jsx');
const css=read('src/v18.24-jyc-human-final.css');
const pkg=JSON.parse(read('package.json'));
const sw=read('public/sw.js');
const checks=[
 ['version is 18.24.0',pkg.version==='18.24.0'],
 ['V18.24 visual layer is imported',main.includes("v18.24-jyc-human-final.css")],
 ['rejected V18.18 motion layer is not imported',!main.includes("v18.18-motion.css")],
 ['guide/FAQ page is no longer rendered',!main.includes("GuidePage data={data}")],
 ['legacy guide route redirects to About',main.includes("if(clean==='/guide')return <Navigate to=\"/about\" replace/>;")],
 ['More sheet has no FAQ duplicate',!main.includes("JYC FAQ")],
 ['About contains quick answers',main.includes("about-quick-answers")],
 ['Assistant has About, My JYC and Map destinations',main.includes("About JYC")&&main.includes("My JYC")&&main.includes("Campus Map")],
 ['ecosystem has four interactive connectors',platform.includes("ecosystem-connector-0")&&platform.includes("ecosystem-connector-3")],
 ['ecosystem nodes have active interaction state',platform.includes("is-active")&&platform.includes("setActive")],
 ['ecosystem avoids empty club zero state',platform.includes("Math.max(clubs,25)")],
 ['Phoenix fourth orbit is styled',css.includes("phoenix-orbit-d")],
 ['Phoenix aura is contained',css.includes("phoenix-orbital-system{")&&css.includes("inset:5px 0 25px")],
 ['My JYC has inline account sync',extra.includes("my-jyc-sync-card")&&extra.includes("signInWithOtp")],
 ['My JYC supports device calendar export',extra.includes("Add to device calendar")&&extra.includes("downloadAgenda")],
 ['My JYC supports Google Calendar',extra.includes("openGoogleAgenda")&&extra.includes("googleCalendarUrl")],
 ['Planner supports device calendar export',extra.includes("downloadMonthICS")&&extra.includes("Add JYC dates to device")],
 ['Planner explains browser/device sync honestly',extra.includes("Browser reminders can notify you when supported.")],
 ['theme switch has flying bird transition',main.includes("theme-flight")&&css.includes("jyc24-bird-flight")],
 ['admin login centers JYC mark',css.includes(".login-card .login-mark{margin:0 auto")],
 ['admin guide and command palette remain',admin.includes("AdminGuide")&&admin.includes("AdminAINavigator")&&admin.includes("admin-command-overlay")],
 ['mobile-first overrides exist',css.includes("@media (max-width:900px)")&&css.includes("@media (max-width:600px)")],
 ['reduced motion disables flight/orbits',css.includes("prefers-reduced-motion")&&css.includes("body.theme-flight:after")],
 ['light mode uses JYC paper palette',css.includes("#f5f1e6")&&css.includes("rgba(168,36,32,.075)")],
 ['service worker cache is bumped',sw.includes("jyc-cache-v18-24-0-human-final")],
];
let failed=0;
for(const [label,ok] of checks){if(ok) console.log(`PASS: ${label}`);else {console.error(`FAIL: ${label}`);failed++;}}
console.log(`V18.24 FINAL QA: ${checks.length-failed}/${checks.length} passed`);
if(failed)process.exit(1);
