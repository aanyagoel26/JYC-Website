import fs from 'node:fs';
import assert from 'node:assert/strict';
import {normalizeSearch,matchSearchResults,isPublicSearchRecord} from '../src/lib/search.js';

const source=fs.readFileSync('src/search/jyc-search.jsx','utf8');
const main=fs.readFileSync('src/main.jsx','utf8');
const css=fs.readFileSync('src/styles/jyc-celestial-refresh.css','utf8');
const checks=[];
const check=(name,condition)=>{checks.push({name,condition:Boolean(condition)});if(!condition)console.error('FAIL:',name);else console.log('PASS:',name)};

check('global navigation mounts the new search module',main.includes("import { JYCSearch as Search } from './search/jyc-search.jsx'")&&main.includes('<Search data={data} admin={admin} close={()=>setSearch(false)}/>'));
check('legacy inline search implementation is removed',!main.includes('function SearchMatch(')&&!main.includes('function Search({data,admin,close})'));
check('index includes all public JYC content families',source.includes('source.clubs')&&source.includes('source.events')&&source.includes('source.team')&&source.includes('source.gallery')&&source.includes('source.announcements')&&source.includes('source.updates')&&source.includes('JYC_EDITORIAL_ACHIEVEMENTS'));
check('index excludes unpublished, archived and private records',source.includes('isPublicSearchRecord(row)')&&source.includes('achievements.filter(isVisibleRecord)')&&source.includes('record.published!==false')&&source.includes('record.private!==true'));
check('search supports keyboard result navigation and selection',source.includes("e.key==='ArrowDown'")&&source.includes("e.key==='ArrowUp'")&&source.includes("e.key==='Enter'")&&source.includes("e.key==='Escape'"));
check('search provides focus management and a modal focus trap',source.includes('returnFocusRef')&&source.includes('document.addEventListener(\'keydown\',trap)')&&source.includes('aria-modal="true"'));
check('search exposes combobox and listbox semantics',source.includes('role="combobox"')&&source.includes('aria-activedescendant')&&source.includes("activeId=results[active]?'jyc-search-result-'+active:undefined")&&source.includes('role={normalized&&results.length?"listbox":"region"}')&&source.includes('role="option"'));
check('search preserves stable browser hooks for modal, results, filters and empty states',source.includes('search-overlay jyc-search-backdrop')&&source.includes('search-modal jyc-search-dialog')&&source.includes('search-close jyc-search-dismiss')&&source.includes('search-category-filters jyc-search-filters')&&source.includes('search-result-active')&&source.includes('search-match jyc-search-highlight')&&source.includes('search-no-results jyc-search-empty')&&source.includes('id="jyc-search-results"'));
check('browser smoke tests target the new accessible combobox',fs.readFileSync('scripts/browser-smoke.spec.js','utf8').includes("getByRole('combobox', { name: 'Search JYC' })"));
check('search remembers recent queries without failing when storage is unavailable',source.includes("jyc-search-recent")&&source.includes('safeRead')&&source.includes('safeWrite'));
check('search builds a memoized index and ranks results',source.includes('useMemo(()=>makeIndex(data),[data])')&&source.includes('matchSearchResults([...index,...intent],normalized)'));
check('day theme uses warm parchment and gold tokens',css.includes('--jyc-canvas:#f1eadb !important')&&css.includes('--jyc-surface:#fffaf0 !important')&&css.includes('--jyc-gold:#967037 !important'));
check('day theme has a restrained constellation atmosphere',css.includes('html[data-theme="light"] body::after')&&css.includes('radial-gradient(1px 1px at'));
check('night theme retains the midnight observatory palette',css.includes('--jyc-canvas:#080d1c')&&css.includes('--jyc-accent:#c8bcff')&&css.includes('--jyc-gold:#e7d19b'));
check('mobile search becomes a bottom-sheet layout',css.includes('@media(max-width:620px)')&&css.includes('place-items:end center')&&css.includes('86dvh'));
check('motion honours reduced-motion preferences',css.includes('prefers-reduced-motion:reduce')&&css.includes('transition-duration:.01ms'));
check('global search shortcut remains wired in navigation',main.includes("(e.ctrlKey||e.metaKey)")&&main.includes("e.key?.toLowerCase()==='k'"));

assert.equal(normalizeSearch('Éloquence & JYC'),'eloquence jyc');
const rows=[
 {key:'exact',title:'Abhivyakti',meta:'Dramatics',searchText:'theatre stage acting',type:'CLUB'},
 {key:'near',title:'Abhivyakti Theatre Workshop',meta:'Event',searchText:'drama performance',type:'EVENT'},
 {key:'other',title:'Eloquence',meta:'Literary society',searchText:'writing poetry',type:'CLUB'}
];
check('exact club result ranks above related content',matchSearchResults(rows,'Abhivyakti')[0]?.key==='exact');
check('descriptive terms discover content beyond the title',matchSearchResults(rows,'performance')[0]?.key==='near');
check('typo tolerance keeps a near-exact club name discoverable',matchSearchResults(rows,'Abhivyaktii').some(row=>row.key==='exact'));
check('unrelated queries return an honest empty set',matchSearchResults(rows,'quantum banana').length===0);
check('public index policy excludes draft, private and archived rows',!isPublicSearchRecord({published:true,status:'draft'})&&!isPublicSearchRecord({published:true,private:true})&&!isPublicSearchRecord({published:true,archived:true}));
check('public index policy accepts published CMS and registry records',isPublicSearchRecord({published:true})&&isPublicSearchRecord({status:'published'})&&isPublicSearchRecord({publicationStatus:'published'}));

const failed=checks.filter(item=>!item.condition);
console.log('Search + celestial refresh QA: '+(checks.length-failed.length)+'/'+checks.length+' checks passed.');
if(failed.length)process.exit(1);
