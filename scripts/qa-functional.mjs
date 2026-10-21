import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const source = fs.readFileSync(new URL('../src/v15-functional.js', import.meta.url), 'utf8')
  .replace("import { supabase } from './lib/supabase';", "const supabase = { from(){ return { upsert: async()=>({error:null}) }; } };");
const dir = fs.mkdtempSync(path.join(os.tmpdir(),'jyc-qa-'));
const file = path.join(dir,'v15-functional.mjs');
fs.writeFileSync(file, source);

const store = new Map();
globalThis.localStorage = { getItem:k=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)), removeItem:k=>store.delete(k) };
globalThis.window = { dispatchEvent(){}, addEventListener(){}, removeEventListener(){}, setTimeout, clearTimeout };
globalThis.CustomEvent = class { constructor(type,init){this.type=type;this.detail=init?.detail;} };

action();
async function action(){
  const mod = await import(pathToFileURL(file).href+'?t='+Date.now());
  const { googleCalendarUrl, setSaved, isSaved, clearLocalReminder, hasLocalReminder } = mod;
  const url = googleCalendarUrl({title:'JYC Test',date:'2026-09-20',start:'9:00',end:'10:30'});
  if(!decodeURIComponent(url).includes('20260920T090000/20260920T103000')) throw new Error('Google Calendar 9:00 formatting failed');
  setSaved('club','qa-club',true);
  if(!isSaved('club','qa-club')) throw new Error('Saved club state failed');
  setSaved('event','qa-event',true);
  if(!isSaved('event','qa-event')) throw new Error('Saved event state failed');
  setSaved('event','qa-event',false);
  if(isSaved('event','qa-event')) throw new Error('Saved event removal failed');
  store.set('jyc-local-reminder-qa-reminder', JSON.stringify({eventId:'qa-reminder'}));
  if(!hasLocalReminder('qa-reminder')) throw new Error('Reminder state failed');
  clearLocalReminder('qa-reminder');
  if(hasLocalReminder('qa-reminder')) throw new Error('Reminder clear failed');
  console.log('PASS: functional utility smoke tests');
}
