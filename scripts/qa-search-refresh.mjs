import fs from 'node:fs';
import assert from 'node:assert/strict';
import {normalizeSearch,matchSearchResults,isPublicSearchRecord} from '../src/lib/search.js';

const source=fs.readFileSync('src/search/jyc-search.jsx','utf8');
const main=fs.readFileSync('src/main.jsx','utf8');
const css=fs.readFileSync('src/styles/jyc-celestial-refresh.css','utf8');
const checks=[];
const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(value=>parseInt(value,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
const contrast=(foreground,background)=>{const [light,dark]=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);return (light+.05)/(dark+.05)};
const token=name=>css.match(new RegExp(name+':(#[0-9a-f]{6})','i'))?.[1];
const check=(name,condition)=>{checks.push({name,condition:Boolean(condition)});if(!condition)console.error('FAIL:',name);else console.log('PASS:',name)};

check('global navigation demand-loads the new search module only when opened',main.includes("const LazyJYCSearch=lazy(()=>import('./search/jyc-search.jsx').then(m=>({default:m.JYCSearch})))")&&main.includes('<LazyJYCSearch data={data} admin={admin} close={()=>setSearch(false)}/>')&&main.includes('<Suspense fallback={null}>'));
check('legacy inline search implementation is removed',!main.includes('function SearchMatch(')&&!main.includes('function Search({data,admin,close})'));
check('Fests remains discoverable in every homepage mode',source.includes('PAGES.forEach(([title,meta,type,href,keywords],i)=>')&&!source.includes("PAGES.filter(([title])=>title!=='Fests'"));
check('index includes all public JYC content families',source.includes('source.clubs')&&source.includes('source.events')&&source.includes('source.team')&&source.includes('source.gallery')&&source.includes('source.announcements')&&source.includes('source.updates')&&source.includes('JYC_EDITORIAL_ACHIEVEMENTS'));
check('index excludes unpublished, archived and private records',source.includes('isPublicSearchRecord(row)')&&source.includes('source.achievements.filter(isPublicSearchRecord)')&&source.includes('JYC_EDITORIAL_ACHIEVEMENTS.filter(isVisibleRecord)')&&source.includes('record.published!==false')&&source.includes('record.private!==true'));
check('search supports keyboard result navigation and selection',source.includes("e.key==='ArrowDown'")&&source.includes("e.key==='ArrowUp'")&&source.includes("e.key==='Enter'")&&source.includes("e.key==='Escape'")&&source.includes('Math.min(value+1,results.length-1)')&&source.includes('Math.max(value-1,0)'));
check('search provides focus management and a modal focus trap',source.includes('returnFocusRef')&&source.includes('document.addEventListener(\'keydown\',trap)')&&source.includes('aria-modal="true"')&&source.includes('onKeyDown={onKeyDown}')&&source.includes('if(e.target!==inputRef.current)return;'));
check('search exposes combobox and listbox semantics',source.includes('role="combobox"')&&source.includes('aria-activedescendant')&&source.includes("activeId=results[active]?'jyc-search-result-'+active:undefined")&&source.includes('role={normalized&&results.length?"listbox":"region"}')&&source.includes('role="option"')&&source.includes('tabIndex={-1}')&&source.includes('aria-posinset={i+1}')&&source.includes('aria-setsize={filtered.length}')&&source.includes('el.tabIndex>=0'));
check('search preserves stable browser hooks for modal, results, filters and empty states',source.includes('search-overlay jyc-search-backdrop')&&source.includes('search-modal jyc-search-dialog')&&source.includes('search-close jyc-search-dismiss')&&source.includes('search-category-filters jyc-search-filters')&&source.includes('search-result-active')&&source.includes('search-match jyc-search-highlight')&&source.includes('search-no-results jyc-search-empty')&&source.includes('id="jyc-search-results"'));
check('browser smoke tests target the new accessible combobox',fs.readFileSync('scripts/browser-smoke.spec.js','utf8').includes("getByRole('combobox', { name: 'Search JYC' })"));
check('search remembers recent queries without failing when storage is unavailable',source.includes("jyc-search-recent")&&source.includes('safeRead')&&source.includes('safeWrite')&&source.includes('clearRecent')&&source.includes('Clear history')&&source.includes('maxLength={120}')&&source.includes('new Set(value.filter(x=>typeof x===\'string\'&&x.trim()).map(x=>x.trim().slice(0,120)))'));
check('focus trap checks rendered geometry rather than offsetParent and sanitizes restored history',source.includes('el.getClientRects().length>0')&&source.includes('new Set(value.filter(x=>typeof x===\'string\'&&x.trim()).map(x=>x.trim().slice(0,120)))'));
check('search builds a memoized index and ranks results',source.includes('useMemo(()=>makeIndex(data),[data])')&&source.includes('matchSearchResults([...index,...intent],normalized)'));
check('day theme uses warm parchment and gold tokens',css.includes('--jyc-canvas:#f1eadb !important')&&css.includes('--jyc-surface:#fffaf0 !important')&&css.includes('--jyc-gold:#765f36 !important'));
check('day theme has a restrained constellation atmosphere',css.includes('html[data-theme="light"] body::after')&&css.includes('radial-gradient(1px 1px at'));
check('night theme retains the midnight observatory palette',css.includes('--jyc-canvas:#080d1c')&&css.includes('--jyc-accent:#c8bcff')&&css.includes('--jyc-gold:#e7d19b'));
check('mobile search becomes a bottom-sheet layout',css.includes('@media(max-width:620px)')&&css.includes('place-items:end center')&&css.includes('86dvh'));
check('search modal controls meet the 44px touch-target floor',css.includes('min-width:44px;min-height:44px')&&css.includes('.jyc-search-field>button{flex:0 0 auto;min-width:44px;min-height:44px')&&css.includes('.jyc-search-filters button{')&&css.includes('min-height:44px;padding:9px 12px')&&css.includes('.jyc-search-recent button{min-height:44px')&&css.includes('.jyc-search-empty button{min-height:44px'));
check('motion honours reduced-motion preferences',css.includes('prefers-reduced-motion:reduce')&&css.includes('transition-duration:.01ms'));
check('global search shortcut remains wired in navigation',main.includes("(e.ctrlKey||e.metaKey)")&&main.includes("e.key?.toLowerCase()==='k'"));

assert.equal(normalizeSearch('Éloquence & JYC'),'eloquence jyc');
assert.equal(normalizeSearch('नमस्ते'),'नमस्ते');
assert.equal(normalizeSearch('हिन्दी JYC'),'हिन्दी jyc');
assert.equal(normalizeSearch('café'),'cafe');
assert.equal(normalizeSearch('İstanbul JIIT'),'istanbul jiit');
check('Unicode normalization preserves Hindi vowel signs and virama while folding Latin accents',normalizeSearch('नमस्ते')==='नमस्ते'&&normalizeSearch('हिन्दी JYC')==='हिन्दी jyc'&&normalizeSearch('café')==='cafe'&&normalizeSearch('İstanbul JIIT')==='istanbul jiit');
const rows=[
 {key:'exact',title:'Abhivyakti',meta:'Dramatics',searchText:'theatre stage acting',type:'CLUB'},
 {key:'near',title:'Abhivyakti Theatre Workshop',meta:'Event',searchText:'drama performance',type:'EVENT'},
 {key:'other',title:'Eloquence',meta:'Literary society',searchText:'writing poetry',type:'CLUB'}
];
check('exact club result ranks above related content',matchSearchResults(rows,'Abhivyakti')[0]?.key==='exact');
check('descriptive terms discover content beyond the title',matchSearchResults(rows,'performance')[0]?.key==='near');
check('typo tolerance keeps a near-exact club name discoverable',matchSearchResults(rows,'Abhivyaktii').some(row=>row.key==='exact'));
check('unrelated queries return an honest empty set',matchSearchResults(rows,'quantum banana').length===0);
check('multi-word query matches across title and descriptive fields',matchSearchResults([{key:'multi',title:'Abhivyakti',meta:'Dramatics',searchText:'theatre stage acting',type:'CLUB'}],'Abhivyakti theatre')[0]?.key==='multi');
check('multi-word query rejects candidates matching only one of two terms',matchSearchResults([{key:'partial',title:'Abhivyakti',meta:'Dramatics',searchText:'theatre stage acting',type:'CLUB'}],'Abhivyakti banana').length===0);
check('Fests is present in the static destination catalogue',source.includes("['Fests','Flagship JYC fests and campus celebrations.'"));
check('public index policy excludes draft, private and archived rows',!isPublicSearchRecord({published:true,status:'draft'})&&!isPublicSearchRecord({published:true,private:true})&&!isPublicSearchRecord({published:true,archived:true}));
check('public index policy accepts published CMS and registry records',isPublicSearchRecord({published:true})&&isPublicSearchRecord({status:'published'})&&isPublicSearchRecord({publicationStatus:'published'}));

const dayPairs=[
 ['--jyc-text','--jyc-canvas'],['--jyc-text','--jyc-surface'],
 ['--jyc-muted','--jyc-canvas'],['--jyc-muted','--jyc-surface'],['--jyc-muted','--jyc-surface-soft'],
 ['--jyc-subtle','--jyc-surface-soft'],['--jyc-accent','--jyc-surface-soft'],
 ['--jyc-gold','--jyc-canvas'],['--jyc-gold','--jyc-surface'],['--jyc-gold','--jyc-surface-soft'],
 ['--jyc-focus','--jyc-canvas']
];
check('daylight text and gold accents meet WCAG AA 4.5:1 across paper surfaces',dayPairs.every(([fg,bg])=>token(fg)&&token(bg)&&contrast(token(fg),token(bg))>=4.5));
check('daylight primary button text meets WCAG AA against antique gold',contrast('#fffaf0',token('--jyc-gold'))>=4.5);
check('night text, muted copy, lavender and gold retain AA contrast',contrast('#e6e8f4','#080d1c')>=4.5&&contrast('#e6e8f4','#111b31')>=4.5&&contrast('#c0c4da','#111b31')>=4.5&&contrast('#c8bcff','#111b31')>=4.5&&contrast('#e7d19b','#111b31')>=4.5);
check('constellation texture sits above the canvas but below interactive app content',css.includes('body::after{content:"";position:fixed;inset:0;z-index:0;pointer-events:none')&&css.includes('#root{position:relative;z-index:1}'));

const failed=checks.filter(item=>!item.condition);
console.log('Search + celestial refresh QA: '+(checks.length-failed.length)+'/'+checks.length+' checks passed.');
if(failed.length)process.exit(1);
