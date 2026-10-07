import fs from 'node:fs';
import {JYC_SOURCE_MEDIA_STATS,mergeSourceGallery,sourceEventMedia,buildJycMediaManifest,JYC_SOURCE_ARCHIVE_PHOTO_ITEMS} from '../src/jyc-source-media.js';

const assert=(name,ok,detail='')=>{console.log((ok?'PASS: ':'FAIL: ')+name+(detail?' — '+detail:''));if(!ok)process.exitCode=1};
const mediaSource=fs.readFileSync('src/jyc-source-media.js','utf8');
const forbiddenArchiveIds=[
  'p1-image240','p1-image336','p1-image339','p2-image342',
  'p4-image828','p4-image830','p4-image841','p4-image907','p4-image932',
  'p2-image520','p2-image530','p2-image543','p2-image550','p2-image591','p2-image608',
  'p4-image749','p4-image750','p4-image753','p4-image754','p4-image755','p4-image756','p4-image758','p4-image760','p4-image770','p4-image774','p4-image786','p4-image790'
];

assert('non-photographic club override cleanup',mediaSource.includes("CypherX:[]")&&mediaSource.includes("Zencoders:[]")&&mediaSource.includes("NeuralNexus:[]")&&mediaSource.includes("Arcadia:[]")&&mediaSource.includes("Dronotics:[]")&&mediaSource.includes("Eloquence:[]"));
assert('visual archive exclusions include Aakriti and Panache',mediaSource.includes("'festivals/aakriti':new Set")&&mediaSource.includes("'clubs/panache':new Set"));
assert('event gallery placements include Dron-O-War and Converge',mediaSource.includes("'Dron-O-War'")&&mediaSource.includes("'Converge'"));
assert('new visual archive exclusions are locked',forbiddenArchiveIds.every(id=>mediaSource.includes(`'${id}'`)));
const gallery=mergeSourceGallery([]);
const galleryUiSource=fs.readFileSync('src/extra-features.jsx','utf8');
const manifest=buildJycMediaManifest([]);
const urls=gallery.map(x=>x.url).filter(Boolean);
const duplicateUrls=urls.filter((url,i)=>urls.indexOf(url)!==i);
const missing=gallery.filter(x=>!x.url||!x.association||!x.alt||!x.role||!x.sourceLabel);
const presentationWithoutPage=gallery.filter(x=>x.sourceType==='presentation-export'&&!x.page);
const event=sourceEventMedia('Ebullience');
const induction=sourceEventMedia('Induction');
const normalizedEvents=['Converge 2026','JAI 2026 · Jaypee Agentic AI Hackathon',"RIDE Hack'26",'DRONO-O-WAR 1.0','CodeAI Hackathon','Code Clash 25.1','Code Clash 25.2','TechTonic 2.0'];
const normalizedEventMappings=normalizedEvents.map(name=>[name,sourceEventMedia(name).collection]);
const eventUrls=new Set(event.items.map(x=>x.url));
const inductionUrls=new Set(induction.items.map(x=>x.url));
const archivePhotoUrls=new Set(JYC_SOURCE_ARCHIVE_PHOTO_ITEMS.map(x=>x.url));
const eventPhotoItems=event.photoItems||[];

assert('curated archive photography pool is exposed',JYC_SOURCE_ARCHIVE_PHOTO_ITEMS.length>500,`found ${JYC_SOURCE_ARCHIVE_PHOTO_ITEMS.length}`);
assert('curated featured overrides remain explicit',mediaSource.includes('const QUALITY_OVERRIDES=')&&mediaSource.includes("Aakriti:[")&&mediaSource.includes("Panache:[")&&mediaSource.includes("CICR:[")&&mediaSource.includes("Innovation:["));
assert('source gallery has maintained communities',JYC_SOURCE_MEDIA_STATS.maintainedCommunities>0);
assert('source gallery is non-empty',gallery.length>0);
assert('gallery opens in photography mode',galleryUiSource.includes("const [filter,setFilter]=useState('All'); const [role,setRole]=useState('All'); const [visual,setVisual]=useState('photo');"));
assert('complete supplied archive is represented',manifest.total>=873,`manifest=${manifest.total}`);
assert('manifest total matches merged source gallery',manifest.total===gallery.length);
assert('source gallery has no duplicate URLs',duplicateUrls.length===0,duplicateUrls.slice(0,3).join(', '));
assert('every published media item has provenance and alt metadata',missing.length===0,missing.slice(0,3).map(x=>x.id||x.url).join(', '));
assert('presentation exports preserve source-page context',presentationWithoutPage.length===0,presentationWithoutPage.slice(0,3).map(x=>x.id).join(', '));
assert('Ebullience maps to its own source collection',event.items.length>0);
assert('Induction does not inherit Ebullience photography',[...inductionUrls].every(url=>!eventUrls.has(url)));
assert('manifest exposes visual roles',manifest.roles.includes('club')&&manifest.roles.includes('event')&&manifest.roles.includes('archive'));
assert('manifest exposes source types',manifest.sourceTypes.includes('presentation-export')&&manifest.sourceTypes.includes('maintained-jyc-media'));
assert('normalized event names resolve to deterministic collections',normalizedEventMappings.every(([name,collection])=>collection&&collection!=='JYC Archive'),JSON.stringify(normalizedEventMappings));
assert('newly audited non-photo archive assets stay out of photo pool',forbiddenArchiveIds.every(id=>![...archivePhotoUrls].some(url=>url.includes('/'+id+'.webp'))),forbiddenArchiveIds.filter(id=>[...archivePhotoUrls].some(url=>url.includes('/'+id+'.webp'))).join(', '));
assert('event photo rail exposes only explicit photography',eventPhotoItems.every(x=>x?.mediaKind==='photo'));
assert('event media still retains broader source records separately',event.items.length>=eventPhotoItems.length);
if(process.exitCode)process.exit(1);
console.log('Photo integrity QA: all checks passed.');
