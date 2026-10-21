import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const files=[];
function walk(dir){for(const name of fs.readdirSync(dir)){const p=path.join(dir,name);if(['node_modules','.git','dist'].includes(name))continue;const st=fs.statSync(p);if(st.isDirectory())walk(p);else files.push(p)}}
walk(path.join(root,'src')); walk(path.join(root,'supabase')); walk(path.join(root,'scripts'));
const text=files.filter(f=>/\.(js|jsx|mjs|sql)$/.test(f)).map(f=>[f,fs.readFileSync(f,'utf8')]);
const problems=[];
for(const [f,s] of text){
  if(/window\.confirm\(|\balert\(/.test(s)) problems.push(`${path.relative(root,f)}: native alert/confirm remains`);
}
const sql=text.filter(([f])=>f.endsWith('.sql')).map(([,s])=>s).join('\n');
for(const table of ['jyc_event_registrations','jyc_event_reminders','jyc_project_submissions','jyc_clubs','jyc_events','jyc_gallery_items','jyc_push_subscriptions']){
  if(!new RegExp(`alter table(?: if exists)? public\\.${table}\\s+enable row level security`,`i`).test(sql)) problems.push(`RLS missing or not found for ${table}`);
}
for(const f of ['src/lib/ui.js','src/main.jsx','src/extra-features.jsx','src/admin-chunk.jsx','src/v14-platform-plus.jsx']) if(!fs.existsSync(path.join(root,f))) problems.push(`missing ${f}`);
if(!/create or replace function public\.jyc_register_for_event/i.test(sql)) problems.push('transactional registration RPC missing');
if(!/signed in push read/i.test(sql)) problems.push('push privacy hardening missing');
if(problems.length){console.error('FAIL: release QA');for(const p of problems)console.error(' - '+p);process.exit(1)}
console.log('PASS: V17 release QA');
console.log(' - Native alert/confirm removed from source paths');
console.log(' - Critical RLS declarations present');
console.log(' - Global confirmation/toast infrastructure present');
