import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {useNavigate} from 'react-router-dom';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {normalizeSearch,matchSearchResults,isPublicSearchRecord} from '../lib/search.js';
import {JYC_EDITORIAL_ACHIEVEMENTS} from '../jyc-editorial-content.js';

const PAGES=[
 ['JIIT Youth Club','Official JYC 128 website, student communities, events and campus life.','PAGE','/','home campus JIIT Noida'],
 ['About JYC','The student-led organisation, its purpose, structure and story.','PAGE','/about','about organisation history'],
 ['Clubs & Communities','Find official JIIT clubs, societies, hubs and student communities.','PAGE','/clubs','societies technical creative cultural sports literary'],
 ['Events','Browse upcoming, live, completed and planned JYC events.','PAGE','/events','workshops competitions fests campus activities'],
 ['Fests','Flagship JYC fests and campus celebrations.','PAGE','/fests','converge ebullience impressions'],
 ['JYC Team','Meet the published JYC leadership and team.','PAGE','/team','leadership apex core faculty coordinators'],
 ['Contact JYC','Official JYC contact channels and campus information.','PAGE','/contact','instagram linkedin whatsapp email'],
 ['JYC Archive','Past published events, clubs, photographs and campus stories.','PAGE','/archive','history memories archive'],
 ['Gallery','Official JYC photographs, event memories and visual stories.','PAGE','/gallery','photos pictures images moments'],
 ['Best of JYC','Curated JYC photography and standout campus moments.','PAGE','/best-of-jyc','photography highlights'],
 ['Achievements','Source-backed JYC awards, recognition and milestones.','PAGE','/achievements','awards wins results'],
 ['Announcements','Published JYC notices, recruitment and registration updates.','PAGE','/announcements','notice bulletin'],
 ['JYC Now','Latest published JYC updates and campus activity.','PAGE','/updates','latest news updates'],
 ['Join JYC','Recruitment information and ways to participate.','PAGE','/join-jyc','recruitment volunteer membership'],
 ['Event Calendar','Published JYC events arranged by date.','PAGE','/calendar','dates schedule calendar']
];
const slug=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const safeRead=(key,fallback)=>{try{return localStorage.getItem(key)??fallback}catch{return fallback}};
const safeWrite=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
const isVisibleRecord=record=>{
 if(!record||typeof record!=='object')return false;
 const status=String(record.status||'').toLowerCase(),publication=String(record.publicationStatus||'').toLowerCase();
 return record.published!==false&&record.archived!==true&&record.private!==true&&record.isArchived!==true&&!['draft','private','archived','unpublished','source-material'].includes(status)&&!['draft','private','archived','unpublished','source-material'].includes(publication);
};
const strings=value=>Array.isArray(value)?value.filter(Boolean).join(' '):String(value||'');
function makeIndex(data){
 const source=data&&typeof data==='object'?data:{},rows=[],seen=new Set();
 const add=item=>{if(item?.key&&item.title&&item.href&&!seen.has(item.key)){seen.add(item.key);rows.push(item)}};
 PAGES.forEach(([title,meta,type,href,keywords],i)=>add({key:'page:'+href,type,title,meta,searchText:[title,meta,keywords,'JYC JIIT 128 Noida'].join(' '),icon:'⌘',href,priority:i===0?18:0}));
 (Array.isArray(source.clubs)?source.clubs:[]).filter(row=>isPublicSearchRecord(row)&&String(row.name||'').trim()).forEach(row=>add({key:'club:'+String(row.id||slug(row.name)),type:'CLUB',title:row.name,meta:row.category||row.type||'JYC community',searchText:[row.name,row.slug,row.category,row.type,row.description,row.about,row.focus,row.family,strings(row.interests),strings(row.activities),strings(row.tags),'society hub club community'].join(' '),icon:'◈',href:'/clubs/'+encodeURIComponent(slug(row.name))}));
 (Array.isArray(source.events)?source.events:[]).filter(row=>isPublicSearchRecord(row)&&String(row.title||'').trim()).forEach(row=>add({key:'event:'+String(row.id||slug(row.title)),type:'EVENT',title:row.title,meta:[row.club,row.date,row.venue].filter(Boolean).join(' · ')||'JYC event',searchText:[row.title,row.slug,row.club,row.venue,row.eventType,row.category,row.description,row.date,row.start,row.eligibility,strings(row.highlights),strings(row.tags),'event workshop competition fest programme'].join(' '),icon:'◷',href:'/events/'+encodeURIComponent(slug(row.slug||row.title))}));
 (Array.isArray(source.team)?source.team:[]).filter(row=>isPublicSearchRecord(row)&&String(row.name||'').trim()).forEach(row=>add({key:'team:'+String(row.id||slug(row.name)),type:'TEAM',title:row.name,meta:row.role||row.position||'JYC team',searchText:[row.name,row.role,row.position,row.bio,row.department,row.club,row.team,row.year,'leadership coordinator apex core team'].join(' '),icon:'✦',href:'/team'}));
 const achievements=Array.isArray(source.achievements)?source.achievements.filter(isPublicSearchRecord):JYC_EDITORIAL_ACHIEVEMENTS.filter(isVisibleRecord);
 achievements.forEach((row,i)=>add({key:'achievement:'+String(row.id||i),type:'ACHIEVEMENT',title:row.title||row.name,meta:[row.category,row.year,row.status].filter(Boolean).join(' · ')||'JYC achievement',searchText:[row.title,row.name,row.summary,row.description,row.category,row.organisation,row.year,row.sourceLabel].join(' '),icon:'✧',href:'/achievements'}));
 (Array.isArray(source.announcements)?source.announcements:[]).filter(row=>isPublicSearchRecord(row)&&String(row.title||row.text||'').trim()).forEach((row,i)=>add({key:'announcement:'+String(row.id||i),type:'ANNOUNCEMENT',title:row.title||row.text,meta:row.date||row.category||'JYC announcement',searchText:[row.title,row.text,row.description,row.summary,row.body,row.message,row.category,row.date,strings(row.tags)].join(' '),icon:'◉',href:'/announcements'}));
 (Array.isArray(source.updates)?source.updates:[]).filter(row=>isPublicSearchRecord(row)&&String(row.title||row.headline||'').trim()).forEach((row,i)=>add({key:'update:'+String(row.id||i),type:'UPDATE',title:row.title||row.headline,meta:row.date||row.category||'JYC update',searchText:[row.title,row.headline,row.summary,row.description,row.text,row.body,row.content,row.excerpt,row.category,row.date,strings(row.tags)].join(' '),icon:'◷',href:'/updates'}));
 if(source.announcement?.on&&String(source.announcement.text||'').trim())add({key:'site-announcement',type:'ANNOUNCEMENT',title:String(source.announcement.text).trim(),meta:'Current site announcement',searchText:source.announcement.text+' JYC notice announcement',icon:'◉',href:'/announcements'});
 (Array.isArray(source.gallery)?source.gallery:[]).filter(row=>isPublicSearchRecord(row)&&row.url).forEach((row,i)=>add({key:'photo:'+String(row.id||i),type:'PHOTO',title:row.caption||row.title||row.association||'JYC photo',meta:[row.association,row.year].filter(Boolean).join(' · ')||'JYC visual archive',searchText:[row.caption,row.title,row.association,row.year,row.alt,row.sourceLabel,strings(row.tags)].join(' '),icon:'▧',href:'/gallery'}));
 return rows;
}
function Highlight({value,query}){
 const text=String(value??''),tokens=normalizeSearch(query).split(' ').filter(Boolean).sort((a,b)=>b.length-a.length).slice(0,8);
 if(!tokens.length)return text;
 const escaped=tokens.map(token=>token.replace(/[.*+?^$()|[\]\\]/g,'\\$&'));
 const pattern=new RegExp('('+escaped.join('|')+')','ig');
 return <>{text.split(pattern).map((part,index)=>tokens.includes(normalizeSearch(part))?<mark className="search-match jyc-search-highlight" key={index}>{part}</mark>:part)}</>;
}
export function JYCSearch({data,close}){
 const navigate=useNavigate(),reducedMotion=useReducedMotion();
 const [query,setQuery]=useState(()=>{try{return new URLSearchParams(window.location.search).get('q')||''}catch{return ''}});
 const [category,setCategory]=useState('ALL'),[active,setActive]=useState(0);
 const [recent,setRecent]=useState(()=>{try{const value=JSON.parse(safeRead('jyc-search-recent','[]'));return Array.isArray(value)?[...new Set(value.filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim().slice(0,120)))].slice(0,6):[]}catch{return []}});
 const inputRef=useRef(null),dialogRef=useRef(null),returnFocusRef=useRef(null),closeTimerRef=useRef(null);
 const [visible,setVisible]=useState(true);
 const index=useMemo(()=>makeIndex(data),[data]),normalized=normalizeSearch(query);
 const ranked=useMemo(()=>{
  if(!normalized)return [];
  const intent=[];
  if(/\b(today|tomorrow|upcoming|this week|events?)\b/.test(normalized))intent.push({key:'intent:events',type:'QUICK ACTION',title:'Explore upcoming events',meta:'Open the JYC event programme',searchText:'today tomorrow upcoming this week events workshops',icon:'◷',href:'/events',priority:80});
  if(/\b(venue|location|where|sector 62|62 campus|sector 128|128 campus)\b/.test(normalized))intent.push({key:'intent:venues',type:'QUICK ACTION',title:'Find events & venues',meta:'Browse published event locations',searchText:'venue location where sector 62 sector 128 campus',icon:'⌖',href:'/events',priority:70});
  return matchSearchResults([...index,...intent],normalized);
 },[index,normalized]);
 const categories=useMemo(()=>['ALL',...new Set(ranked.map(row=>row.type))],[ranked]);
 const filtered=useMemo(()=>category==='ALL'?ranked:ranked.filter(row=>row.type===category),[ranked,category]);
 const results=filtered.slice(0,30),activeId=results[active]?'jyc-search-result-'+active:undefined;
 useEffect(()=>{
  const activeElement=document.activeElement;
  const fallbackFocus=()=>{
   const candidates=[document.querySelector('[data-jyc-search-trigger]'),document.querySelector('.mobile-dock button:last-child')];
   return candidates.find(node=>node instanceof HTMLElement && node.getClientRects().length)
    || candidates.find(node=>node instanceof HTMLElement)
    || null;
  };
  returnFocusRef.current=activeElement instanceof HTMLElement && activeElement!==document.body && activeElement!==document.documentElement ? activeElement : fallbackFocus();
  const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  const timer=window.setTimeout(()=>inputRef.current?.focus(),40);
  const trap=e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();requestClose();return;}if(e.key!=='Tab')return;const root=dialogRef.current;if(!root)return;
   const focusable=[...root.querySelectorAll('button,input,[href],[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled && el.tabIndex>=0 && el.getClientRects().length>0);
   if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  };
  document.addEventListener('keydown',trap);
  return()=>{
   window.clearTimeout(timer);
   window.clearTimeout(closeTimerRef.current);
   document.body.style.overflow=previousOverflow;
   document.removeEventListener('keydown',trap);
   const original=returnFocusRef.current;
   const target=original instanceof HTMLElement && original.isConnected && original.getClientRects().length
    ? original
    : fallbackFocus();
   if(target instanceof HTMLElement)window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>target.focus({preventScroll:true})));
  };
 },[]);
 useEffect(()=>{setActive(0);setCategory('ALL')},[normalized]);
 useEffect(()=>{if(active>=results.length)setActive(Math.max(0,results.length-1))},[active,results.length]);
 useEffect(()=>{if(activeId)document.getElementById(activeId)?.scrollIntoView({block:'nearest'})},[activeId]);
 const remember=value=>{const clean=String(value||'').trim().slice(0,120);if(!clean)return;const next=[clean,...recent.filter(item=>item!==clean)].slice(0,6);setRecent(next);safeWrite('jyc-search-recent',JSON.stringify(next))};
 const requestClose=callback=>{setVisible(false);window.clearTimeout(closeTimerRef.current);closeTimerRef.current=window.setTimeout(()=>{callback?.();close()},reducedMotion?0:260)};
 const go=row=>{if(!row?.href)return;remember(query);requestClose(()=>navigate(row.href))};
 const onKeyDown=e=>{
  if(e.target!==inputRef.current)return;
  if(e.key==='ArrowDown'&&results.length){e.preventDefault();setActive(value=>Math.min(value+1,results.length-1));return}
  if(e.key==='ArrowUp'&&results.length){e.preventDefault();setActive(value=>Math.max(value-1,0));return}
  if(e.key==='Enter'&&results[active]){e.preventDefault();go(results[active])}
 };
 const clear=()=>{setQuery('');setCategory('ALL');inputRef.current?.focus()};
 const clearRecent=()=>{setRecent([]);safeWrite('jyc-search-recent','[]')};
 const suggestions=[['Clubs','/clubs'],['Events','/events'],['People','/team'],['Gallery','/gallery'],['Calendar','/calendar']];
 const content=<AnimatePresence>
  {visible&&<motion.div className="search-overlay jyc-search-backdrop" role="presentation" initial={reducedMotion?false:{opacity:0}} animate={{opacity:1}} exit={reducedMotion?{opacity:1}:{opacity:0}} transition={{duration:.18}} onMouseDown={e=>{if(e.target===e.currentTarget)requestClose()}}>
   <motion.section ref={dialogRef} id="jyc-search-dialog" className="search-modal jyc-search-dialog" role="dialog" aria-modal="true" aria-labelledby="jyc-search-title" onKeyDown={onKeyDown} initial={reducedMotion?false:{opacity:0,y:16,scale:.985}} animate={{opacity:1,y:0,scale:1}} exit={reducedMotion?{opacity:1}:{opacity:0,y:10,scale:.99}} transition={{duration:.24,ease:[.22,1,.36,1]}} onMouseDown={e=>e.stopPropagation()}>
    <header className="jyc-search-header"><div><span className="jyc-search-kicker">JYC SEARCH · JIIT YOUTH CLUB · 128</span><h2 id="jyc-search-title">Find your place.</h2><p>Search communities, people, events and campus stories.</p></div><button type="button" className="search-close jyc-search-dismiss" onClick={()=>requestClose()} aria-label="Close search"><span>ESC</span><b aria-hidden="true">×</b></button></header>
    <label className="jyc-search-field"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 5 5"/></svg><input ref={inputRef} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try “Abhivyakti”, “hackathon” or a person…" aria-label="Search JYC" maxLength={120} autoComplete="off" spellCheck="false" role="combobox" aria-autocomplete="list" aria-expanded={Boolean(normalized&&results.length)} aria-controls="jyc-search-results" aria-activedescendant={activeId}/>{query&&<button type="button" onClick={clear} aria-label="Clear search">×</button>}<kbd>CTRL K</kbd></label>
    <div className="jyc-search-meta"><span>{normalized?filtered.length+' matching result'+(filtered.length===1?'':'s'):'SEARCH THE JYC EXPERIENCE'}</span><span><kbd>↑</kbd><kbd>↓</kbd><kbd>ENTER</kbd><kbd>ESC</kbd></span></div>
    {normalized&&categories.length>1&&<div className="search-category-filters jyc-search-filters" role="group" aria-label="Filter search results by category">{categories.map(type=><button key={type} type="button" aria-pressed={category===type} className={category===type?'is-active':''} onClick={()=>{setCategory(type);setActive(0)}}>{type==='ALL'?'All':type}<span> ({type==='ALL'?ranked.length:ranked.filter(row=>row.type===type).length})</span></button>)}</div>}
    <div className="jyc-search-results" id="jyc-search-results" role={normalized&&results.length?"listbox":"region"} aria-label="Search results">
     {!normalized&&<div className="jyc-search-discover"><div className="jyc-search-discover-head"><span>EXPLORE JYC</span><small>Start anywhere</small></div><div>{suggestions.map(([label,href])=><button type="button" key={href} onClick={()=>requestClose(()=>navigate(href))}><span>{label}</span><b>↗</b></button>)}</div>{recent.length>0&&<section className="jyc-search-recent"><div className="jyc-search-recent-head"><span>RECENT SEARCHES</span><button type="button" onClick={clearRecent}>Clear history</button></div><div>{recent.map(item=><button key={item} type="button" onClick={()=>{setQuery(item);inputRef.current?.focus()}}>{item}<b>↗</b></button>)}</div></section>}</div>}
     {normalized&&results.map((row,i)=><button type="button" role="option" tabIndex={-1} id={'jyc-search-result-'+i} aria-selected={active===i} aria-posinset={i+1} aria-setsize={filtered.length} className={active===i?'is-active search-result-active':''} key={row.key} onMouseEnter={()=>setActive(i)} onClick={()=>go(row)}><span className="jyc-search-result-icon" aria-hidden="true">{row.icon||'↗'}</span><span className="jyc-search-result-copy"><small>{i===0?'BEST MATCH · ':''}{row.type}</small><strong><Highlight value={row.title} query={query}/></strong><em><Highlight value={row.meta} query={query}/></em></span><b className="jyc-search-result-arrow" aria-hidden="true">↗</b></button>)}
     {normalized&&results.length===0&&<div className="search-no-results jyc-search-empty" role="status"><span>⌕</span><strong>No matches for “{query.trim()}”</strong><p>Try a club name, event, person, activity or a shorter spelling.</p><button type="button" onClick={clear}>Clear search</button></div>}
    </div>
    <footer className="jyc-search-footer"><span>JYC · SECTOR 128 · NOIDA</span><span>PUBLIC CONTENT ONLY <i/> RELEVANCE RANKED</span></footer>
    <p className="jyc-search-live" role="status" aria-live="polite">{normalized?filtered.length+' search results':'Search is ready'}</p>
   </motion.section>
  </motion.div>}
 </AnimatePresence>;
 return createPortal(content,document.body);
}
