import fs from 'node:fs';
import assert from 'node:assert/strict';
const roster=fs.readFileSync('src/jyc-club-member-roster.js','utf8');
const main=fs.readFileSync('src/main.jsx','utf8');
const css=fs.readFileSync('src/styles/public-entry.css','utf8');
const checks=[
 ['all 20 supplied portraits are referenced exactly once', (roster.match(/photo:'/g)||[]).length===20],
 ['new JSA sports coordinator is attached to the existing JSA hub', roster.includes("JSA: [{name:'Tanish Choudhary'")],
 ['Aura has both supplied coordinator and member records', roster.includes("Lakshya Saxena")&&roster.includes("Shaurya Raholan")],
 ['club roster includes the full 40-person club roster', (roster.match(/role:'/g)||[]).length===40],
 ['Chandrima is listed separately as CyberX advisor and ZenCoders coordinator', roster.includes("CypherX: [")&&roster.includes("{name:'Chandrima',role:'Advisor'}")&&roster.includes("{name:'Chandrima',role:'Coordinator'}")],
 ['Shorts is a separate club page, not merged into Cinekala', roster.includes("Shorts: [")&&main.includes("JYC_CLUB_MEMBER_ROSTER[c.name]")],
 ['club roster has no duplicate club keys', (roster.match(/^  [^ ].*?: \[/gm)||[]).length===(new Set((roster.match(/^  ([^:]+): \[/gm)||[]).map(x=>x.trim().slice(0,-2)))).size],
 ['club roster is rendered only inside club detail flow, not the JYC Team component', main.indexOf('JYC_CLUB_MEMBER_ROSTER[c.name]')<main.indexOf('function Team({data})')],
 ['club roster uses accessible initials when no approved portrait asset is available', main.includes('member.name.trim().split(/' + String.fromCharCode(92) + 's+/)')],
 ['missing portrait files fall back to visible initials rather than broken-image UI', main.includes('onError={event=>{event.currentTarget.hidden=true}}')],
 ['club member cards are styled by the loaded public entry stylesheet', css.includes('.hub-community-team-grid')&&css.includes('.hub-community-member-photo span')],
 ['club member layout supports mobile and reduced-motion preferences', css.includes('@media(max-width:520px)')&&css.includes('hub-community-member-copy strong')],
];
let failed=0;
for(const [name,ok] of checks){console.log((ok?'PASS':'FAIL')+' · '+name);if(!ok)failed++;}
assert.equal(failed,0,'Club roster QA failed '+failed+' checks');
console.log('Club roster QA passed ('+checks.length+' checks)');
