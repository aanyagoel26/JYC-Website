import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const css=read('src/styles/jyc-v55-visual-polish.css');
const main=read('src/main.jsx');
const editorialHome=read('src/jyc-editorial-home.jsx');
const publicCss=read('src/styles/public-system.css');
const checks=[
 ['homepage presentation is intentionally consolidated',editorialHome.includes('jh-photo-frame')&&!editorialHome.includes('<PhotoChapters/>')&&!editorialHome.includes('LazyDriftWall')],
 ['V55 polish stylesheet remains imported',publicCss.includes("./jyc-v55-visual-polish.css")],
 ['public content has centered width contract',css.includes('--jyc-content')&&css.includes('margin-inline:auto')],
 ['global text overflow is guarded',css.includes('overflow-wrap:anywhere')],
 ['public sections are centered',css.includes('.public-app .section,.public-app .page')],
 ['club cards still use source photography',main.includes('sourceHubMedia(c.name)')],
 ['event cards prefer source photography',main.includes('sourceEventMedia(e)?.photoItems')],
 ['gallery uses the current deterministic override',publicCss.includes('.public-app .gallery-grid')&&publicCss.includes('column-count:unset!important')],
 ['gallery has responsive fallback',publicCss.includes('@media(max-width:620px)')&&publicCss.includes('.public-app .gallery-grid')],
 ['club pages expose source photo strip',main.includes('club-living-photo')&&main.includes('LivingPhoto')],
 ['gallery mounts source hub photography',read('src/extra-features.jsx').includes('sourcePhotoItems=useMemo')&&read('src/extra-features.jsx').includes('sourceHubMedia(name).photoItems')],
 ['public club/event/photo cards stay upright',!main.includes('club-card-v41 tilt-card')&&!main.includes('event-card-premium tilt-card')],
 ['event identity contract remains present',main.includes('event-identity-page')&&main.includes('eventIdentity(e)')],
 ['club identity contract remains present',main.includes('club-identity-page')&&main.includes('hubIdentity(c.name)')],
 ['reduced motion is covered',css.includes('prefers-reduced-motion')],
 ['mobile widths are covered',css.includes('@media(max-width:700px)')&&css.includes('@media(max-width:480px)')],
 ['fixed overlays stay above content',css.includes('z-index:10000')&&css.includes('z-index:9000')]
];
let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failed++}
if(failed)process.exit(1);
console.log('Current visual QA: '+checks.length+'/'+checks.length+' checks passed.');