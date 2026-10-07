import fs from 'node:fs';
import {JYC_SOURCE_MEDIA_STATS,mergeSourceGallery,sourceEventMedia,buildJycMediaManifest,JYC_SOURCE_ARCHIVE_PHOTO_ITEMS} from '../src/jyc-source-media.js';

const assert=(name,ok,detail='')=>{console.log((ok?'PASS: ':'FAIL: ')+name+(detail?' — '+detail:''));if(!ok)process.exitCode=1};
const mediaSource=fs.readFileSync('src/jyc-source-media.js','utf8');
const forbiddenArchiveIds=[
  'p1-image221','p1-image222','p1-image224','p1-image226','p1-image227','p1-image228','p1-image229','p1-image232','p1-image233','p1-image234','p1-image235','p1-image236','p1-image237','p1-image238','p1-image239','p1-image240','p1-image242','p1-image245','p1-image246','p1-image247','p1-image248','p1-image249','p1-image250','p1-image251','p1-image252','p1-image253','p1-image254','p1-image255','p1-image256','p1-image257','p1-image258','p1-image259','p1-image268','p1-image269','p1-image271','p1-image274','p1-image276','p1-image277','p1-image278','p1-image281','p1-image282','p1-image283','p1-image285','p1-image286','p1-image288','p1-image290','p1-image294','p1-image295','p1-image296','p1-image297','p1-image299','p1-image300','p1-image304','p1-image305','p1-image308','p1-image309','p1-image310','p1-image311','p1-image312','p1-image315','p1-image317','p1-image320','p1-image322','p1-image325','p1-image336','p1-image339','p2-image342',
  'p4-image828','p4-image830','p4-image841','p4-image867','p4-image869','p4-image871','p4-image875','p4-image898','p4-image907','p4-image913','p4-image914','p4-image917','p4-image921','p4-image926','p4-image927','p4-image928','p4-image930','p4-image931','p4-image932',
  'p2-image520','p2-image530','p2-image543','p2-image550','p2-image591','p2-image608',
  'p4-image749','p4-image750','p4-image753','p4-image754','p4-image755','p4-image756','p4-image757','p4-image758','p4-image759','p4-image760','p4-image762','p4-image763','p4-image764','p4-image765','p4-image768','p4-image770','p4-image771','p4-image772','p4-image773','p4-image774','p4-image775','p4-image776','p4-image777','p4-image778','p4-image779','p4-image780','p4-image781','p4-image782','p4-image783','p4-image784','p4-image785','p4-image786','p4-image787','p4-image788','p4-image790','p4-image791','p4-image792','p4-image793','p4-image794'
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
