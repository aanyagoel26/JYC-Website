import { relevanceScore, rankSearchResults, matchSearchResults } from '../src/lib/search.js';
const fail=[];
let checks=0;
const ok=(name,cond)=>{checks++;if(cond)console.log(`PASS: ${name}`);else{console.log(`FAIL: ${name}`);fail.push(name)}};
const exact=relevanceScore({title:'AITronics',meta:'Technical club',text:'AI and robotics',query:'AITronics'});
const meta=relevanceScore({title:'Technical Club',meta:'AITronics',text:'AI robotics',query:'AITronics'});
const typo=relevanceScore({title:'AITronics',meta:'Technical club',text:'AI robotics',query:'AItroncs'});
ok('exact title beats metadata match',exact>meta);
ok('exact title has a dominant score',exact>=100000);
ok('typo-tolerant title remains searchable',typo>meta);
const ranked=rankSearchResults([
 {key:'generic',title:'Technical Resources',meta:'AITronics resources',text:'',type:'PAGE'},
 {key:'target',title:'AITronics',meta:'Technical club',text:'AI robotics',type:'CLUB'},
 {key:'prefix',title:'AITronics Workshop',meta:'Event',text:'',type:'EVENT'}
],'AITronics');
ok('best match is the exact searched entity',ranked[0]?.key==='target');
const descriptive=rankSearchResults([{key:'description',title:'Creative Society',meta:'Community',searchText:'photography filmmaking visual storytelling',type:'CLUB'},{key:'other',title:'Technical Club',meta:'Technology',searchText:'coding robotics',type:'CLUB'}],'filmmaking');
ok('search indexes descriptive text beyond title and metadata',descriptive[0]?.key==='description'&&descriptive[0]?._score>descriptive[1]?._score);
ok('prefix match follows exact title',ranked[1]?.key==='prefix');
const brand=rankSearchResults([{key:'club',title:'JYC Technical Club',meta:'club',text:'',type:'CLUB'},{key:'home',title:'JIIT Youth Club',meta:'Official JYC website',text:'JIIT Noida clubs events',type:'PAGE'}],'JYC');
ok('official JIIT Youth Club page leads brand search',brand[0]?.key==='home');
const many=rankSearchResults(Array.from({length:24},(_,i)=>({key:`item-${i}`,title:`AITronics ${i+1}`,meta:'Technical club',text:'AI robotics',type:'CLUB'})),'AITronics');
ok('ranking preserves every candidate so the UI can report an accurate total',many.length===24);
const filtered=matchSearchResults([{key:'hit',title:'AITronics',meta:'Technical club',searchText:'robotics',type:'CLUB'},{key:'miss',title:'Literary Society',meta:'Books and writing',searchText:'poetry',type:'CLUB'}],'AITronics');
ok('search results exclude zero-score non-matches',filtered.length===1&&filtered[0]?.key==='hit');
ok('unrelated queries produce a real empty result set',matchSearchResults([{title:'Literary Society',meta:'Books',searchText:'poetry',type:'CLUB'}],'quantum banana').length===0);
ok('ranking remains relevance ordered beyond the first 16 results',many[0]?._score>=many[15]?._score&&many[15]?._score>=many[23]?._score);
const intentSource={key:'intent',title:'Upcoming events',meta:'Open the event calendar',text:'',type:'QUICK ACTION',priority:120};
const intent=rankSearchResults([{key:'page',title:'Events',meta:'JYC events',text:'',type:'PAGE'},intentSource],'upcoming events');
ok('intent shortcuts participate in the same ranking and can surface above generic pages',intent[0]?.key==='intent');
ok('intent priority is additive and does not mutate source objects',intent[0]?._score>intent[1]?._score&&!Object.hasOwn(intentSource,'_score'));
if(fail.length)process.exit(1);
console.log(`Search QA complete: ${checks-fail.length}/${checks} checks passed.`);

import { isPublicSearchRecord } from '../src/lib/search.js';
ok('CMS boolean published records are searchable',isPublicSearchRecord({name:'CineKala',published:true}));
ok('registry published status records are searchable',isPublicSearchRecord({name:'CICR',status:'published'}));
ok('registry publicationStatus records are searchable',isPublicSearchRecord({name:'AITronics',publicationStatus:'published'}));
ok('draft records are excluded from public search',!isPublicSearchRecord({name:'Draft Hub',status:'draft'}));
ok('source-material records are excluded from public search',!isPublicSearchRecord({name:'Unverified Hub',publicationStatus:'source-material'}));
ok('archived records stay excluded even if legacy published flag remains true',!isPublicSearchRecord({name:'Old Event',published:true,archived:true}));

ok('explicit unpublished flag overrides a published status',!isPublicSearchRecord({name:'Hidden Hub',published:false,status:'published'}));
