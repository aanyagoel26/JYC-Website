import { relevanceScore, rankSearchResults } from '../src/lib/search.js';
const fail=[];
const ok=(name,cond)=>{if(cond)console.log(`PASS: ${name}`);else{console.log(`FAIL: ${name}`);fail.push(name)}};
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
ok('prefix match follows exact title',ranked[1]?.key==='prefix');
const brand=rankSearchResults([{key:'club',title:'JYC Technical Club',meta:'club',text:'',type:'CLUB'},{key:'home',title:'JIIT Youth Club',meta:'Official JYC website',text:'JIIT Noida clubs events',type:'PAGE'}],'JYC');
ok('official JIIT Youth Club page leads brand search',brand[0]?.key==='home');
if(fail.length)process.exit(1);
console.log(`Search QA complete: ${5+1}/6 checks passed.`);
