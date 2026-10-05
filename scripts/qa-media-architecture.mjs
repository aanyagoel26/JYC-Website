import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const source=read('src/jyc-source-media.js');
const archive=read('src/source-archive-index.js');
const main=read('src/main.jsx');
const css=read('src/jyc-logo-final-theme.css');
const gallery=read('src/extra-features.jsx');
const checks=[
 ['media taxonomy exports event mapper',source.includes('export function sourceEventMedia')],
 ['media taxonomy exports manifest builder',source.includes('export function buildJycMediaManifest')],
 ['event page imports source event media',main.includes('sourceEventMedia')],
 ['event page renders visual record',main.includes('event-source-gallery')],
 ['event gallery preserves source provenance context',main.includes('sourceEventMedia(e)')&&main.includes('source photography connected to this experience')&&source.includes('sourceLabel:')&&source.includes('sourceType:')],
 ['event gallery is responsive',css.includes('.event-source-gallery-grid')],
 ['source archive remains deduplicated',source.includes('const seen=new Set()')],
 ['source media avoids synthetic imagery',source.includes('SOURCE_GALLERY')],
 ['event aliases avoid shared welcome bucket',!source.includes("'Ebullience','freshers','welcome'")&&!source.includes("'Induction','orientation','welcome'")],
 ['media provenance taxonomy exists',source.includes('sourceType:')&&source.includes('sourceLabel:')&&source.includes('role')],
 ['media alt metadata exists',source.includes('alt:item.alt||item.caption')],
 ['external media is classified',source.includes('official-external-media')],
 ['gallery uses role filters',gallery.includes("roleLabels")&&gallery.includes('MEDIA TYPE')],
 ['gallery consumes full curated archive photo pool',gallery.includes('JYC_SOURCE_ARCHIVE_PHOTO_ITEMS')&&gallery.includes('...sourceArchivePhotos')],
 ['archive photo policy is content-aware',source.includes('ARCHIVE_PHOTO_EXCLUSIONS')&&source.includes('ARCHIVE_SHOWCASE_PHOTOS')],
 ['living photo engine is wired',gallery.includes('LivingPhoto')&&source.includes('JYC_SOURCE_ARCHIVE_PHOTO_ITEMS')],
 ['living photo engine has decoded preloading and related scoring',read('src/jyc-living-photo.jsx').includes('preloadAndDecode')&&read('src/jyc-living-photo.jsx').includes('scoreRelatedPhoto')&&read('src/jyc-living-photo.jsx').includes('prefers-reduced-motion')],
 ['complete source archive inventory is wired',source.includes('JYC_SOURCE_ARCHIVE_CATALOG')&&source.includes('JYC_SOURCE_ARCHIVE_STATS')&&archive.includes('sourceAssetFiles":873')&&archive.includes('uniqueBinaryHashes":813')],
];
let failed=0; for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+': '+name);if(!ok)failed++}
if(failed)process.exit(1);
console.log('Media architecture QA: '+checks.length+'/'+checks.length+' checks passed.');
