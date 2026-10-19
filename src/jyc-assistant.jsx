import React,{useEffect,useMemo,useRef,useState} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import {normalizeSearch,rankSearchResults} from './lib/search.js';
import {JYC_HUB_SOURCE_REGISTRY} from './jyc-hub-registry.js';
import {sourceHubMedia} from './jyc-source-media.js';
import {hubDetails} from './v23.6-hub-details.js';

const JYC_LOGO=import.meta.env.PROD?'/assets/jyc-logo.webp':'/JYC%20Logo(4).png';

const published=data=>({
 clubs:(data?.clubs||[]).filter(c=>c?.published&&c?.status!=='archived'),
 events:(data?.events||[]).filter(e=>e?.published&&!e?.archived),
 team:(data?.team||[]).filter(m=>m?.published===true),
 gallery:(data?.gallery||[]).filter(g=>g?.url&&g?.published!==false)
});

const QUICK_CHIPS = [
  { label: '🤖 Robotics & AI', query: 'robotics' },
  { label: '🎸 Live Music & Bands', query: 'music' },
  { label: '💃 Dance & Dramatics', query: 'dance' },
  { label: '🚀 Fests & Hackathons', query: 'fest' },
  { label: '🏆 Campus Sports', query: 'sports' },
  { label: '👥 Team & Leadership', query: 'team' }
];

export function JYCAssistant({data,onClose}){
 const nav=useNavigate(),loc=useLocation(),inputRef=useRef(null),dialogRef=useRef(null),returnFocusRef=useRef(null),onCloseRef=useRef(onClose),[query,setQuery]=useState('');
 const {clubs,events,team,gallery}=useMemo(()=>published(data),[data]);
 const context=loc.pathname.startsWith('/clubs')?'clubs':loc.pathname.startsWith('/events')?'events':loc.pathname.startsWith('/gallery')?'gallery':loc.pathname.startsWith('/team')||loc.pathname.startsWith('/leadership')?'leadership':'home';
 const contextCopy={home:'Search any society, upcoming event or campus initiative.',clubs:'Find a community by name, technical domain or activity.',events:'Find upcoming hackathons, fests and live experiences.',gallery:'Explore verified campus photographs and fest memories.',leadership:'Meet the faculty, Apex body and society coordinators.'}[context];

 useEffect(()=>{onCloseRef.current=onClose},[onClose]);
 useEffect(()=>{
  returnFocusRef.current=document.activeElement;
  const focusTimer=window.setTimeout(()=>inputRef.current?.focus({preventScroll:true}),40);
  const onKey=e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onCloseRef.current?.();return}
   if(e.key!=='Tab')return;
   const root=dialogRef.current;if(!root)return;
   const focusable=[...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.getAttribute('aria-hidden')!=='true'&&el.getClientRects().length>0);
   if(!focusable.length){e.preventDefault();root.focus();return}
   const first=focusable[0],last=focusable[focusable.length-1],active=document.activeElement;
   if(e.shiftKey&&(active===first||!root.contains(active))){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&(active===last||!root.contains(active))){e.preventDefault();first.focus()}
  };
  document.addEventListener('keydown',onKey,true);
  return()=>{window.clearTimeout(focusTimer);document.removeEventListener('keydown',onKey,true);const target=returnFocusRef.current;window.requestAnimationFrame(()=>{if(target?.isConnected&&typeof target.focus==='function')target.focus({preventScroll:true})})};
 },[]);

 const go=path=>{onClose?.();nav(path)};
 const pages=[['JYC Home','Official JIIT Youth Club 128 digital ecosystem.','PAGE','/'],['About JYC','How JYC works, student governance, values and structure.','PAGE','/about'],['Clubs & Societies','Explore 28+ technical, cultural, literary and sports hubs.','PAGE','/clubs'],['Events & Fests','Upcoming competitions, hackathons and cultural nights.','PAGE','/events'],['Campus Gallery','High-resolution verified photographs and campus moments.','PAGE','/gallery'],['Leadership & Team','Faculty mentors, apex student body and coordinators.','PAGE','/team'],['Contact & Join','Official channels, social profiles and recruitment info.','PAGE','/contact']];
 
 const raw=[
  ...pages.map(([title,meta,type,path])=>({key:'page-'+path,title,meta,type,go:()=>go(path)})),
  ...clubs.map(c=>{const d=hubDetails(c.name);return {key:'club-'+c.id,title:c.name,meta:c.category||c.type||d?.label||'JYC community',type:'CLUB',searchText:[c.name,c.category,c.type,c.description,c.about,(c.interests||[]).join(' '),d?.label,d?.experience,(d?.activities||[]).join(' '),(d?.signature||[]).join(' ')].filter(Boolean).join(' '),go:()=>go('/clubs/'+encodeURIComponent(c.id||c.name))}}),
  ...events.map(e=>({key:'event-'+e.id,title:e.title,meta:[e.club,e.venue,e.date].filter(Boolean).join(' · '),type:'EVENT',searchText:[e.title,e.club,e.eventType,e.venue,(e.highlights||[]).join(' ')].join(' '),go:()=>go('/events/'+encodeURIComponent(e.id||e.title))})),
  ...team.map(m=>({key:'team-'+m.id,title:m.name,meta:m.role||m.position||'JYC Team',type:'TEAM',searchText:[m.name,m.role,m.position,m.bio].join(' '),go:()=>go('/team')}))
 ];

 const term=normalizeSearch(query);
 const results=term?rankSearchResults(raw.map(x=>({...x,text:x.searchText||x.meta})),term).slice(0,8):[];
 const quick=context==='clubs'?[['Explore all clubs','/clubs'],['Upcoming events','/events'],['JYC archive','/archive'],['Contact JYC','/contact']]:context==='events'?[['Upcoming events','/events'],['Event calendar','/calendar'],['JYC archive','/archive'],['Explore hubs','/clubs']]:[['Explore clubs','/clubs'],['Upcoming events','/events'],['Campus Map','/contact'],['Meet Leadership','/team']];

 return <div className="jyc-assistant-overlay" role="dialog" aria-modal="true" aria-labelledby="jyc-assistant-title" onMouseDown={e=>e.target===e.currentTarget&&onClose?.()}>
  <section ref={dialogRef} className="jyc-assistant-panel" tabIndex={-1}>
   <div className="jyc-assistant-head">
     <div className="jyc-assistant-brand">
       <span className="jyc-assistant-mark">
         <img src={JYC_LOGO} alt="" loading="lazy" decoding="async" onError={event=>{event.currentTarget.src="/assets/jyc-logo.avif"}}/>
       </span>
       <div>
         <span className="eyebrow">JYC AI ASSISTANT · INTEL</span>
         <h2 id="jyc-assistant-title">Ask JYC. Find your route.</h2>
         <p>{contextCopy}</p>
       </div>
     </div>
     <button type="button" className="jyc-assistant-close" onClick={onClose} aria-label="Close JYC Assistant">×</button>
   </div>

   {/* Search Input Bar */}
   <div className="jyc-assistant-search">
     <span className="search-icon" aria-hidden="true">⌕</span>
     <input
       ref={inputRef}
       value={query}
       onChange={e=>setQuery(e.target.value)}
       placeholder="Search 'CICR', 'hackathons', 'dance', 'Battle of Bands'..."
       aria-label="Search JYC content"
     />
     {query&&<button type="button" onClick={()=>setQuery('')} aria-label="Clear assistant search">×</button>}
   </div>

   {/* Quick Explore Chips */}
   <div className="jyc-assistant-chips" aria-label="Quick suggestion chips">
     {QUICK_CHIPS.map(chip => (
       <button
         key={chip.label}
         type="button"
         className={`chip-btn ${query.toLowerCase() === chip.query ? 'active' : ''}`}
         onClick={() => setQuery(chip.query)}
       >
         {chip.label}
       </button>
     ))}
   </div>

   {!term&&<div className="jyc-assistant-quick"><span className="eyebrow">PRIMARY PORTALS</span><div>{quick.map(([label,path])=><button type="button" key={`${label}-${path}`} onClick={()=>go(path)}>{label}<b>↗</b></button>)}</div></div>}

   {term&&<div className="jyc-assistant-results" aria-live="polite">
     <div className="jyc-assistant-result-meta">
       <span>{results.length} relevant result{results.length===1?'':'s'}</span>
       <span>Verified JYC Database</span>
     </div>
     {results.length?results.map((r,i)=>(
       <button type="button" key={r.key} className="jyc-assistant-result" onClick={r.go}>
         <small>{i===0?'TOP MATCH · ':''}{r.type}</small>
         <strong>{r.title}</strong>
         <span>{r.meta}</span>
         <b>↗</b>
       </button>
     )):(
       <div className="jyc-assistant-empty">
         <strong>No direct match found.</strong>
         <p>Try searching for a society name, domain like "Robotics", or event title.</p>
         <button type="button" onClick={()=>go('/clubs')}>Browse all societies →</button>
       </div>
     )}
   </div>}

   {!term&&<div className="jyc-assistant-note">
     <span>⚡</span>
     <p>Indexed in real-time from the official JIIT Youth Club Sector 128 verified platform registry.</p>
   </div>}

   <div className="jyc-assistant-foot">
     <span>JIIT-128 · NOIDA · AY 2026–27</span>
     <button type="button" onClick={()=>go('/contact')}>Official Help Desk →</button>
   </div>
  </section>
  <style>{`
   .jyc-assistant-overlay{position:fixed;inset:0;z-index:12000;display:grid;place-items:center;padding:18px;background:rgba(8,11,18,.75);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);animation:jycAssistantIn .22s cubic-bezier(0.16,1,0.3,1) both}
   .jyc-assistant-panel{width:min(780px,calc(100vw - 28px));max-height:min(780px,calc(100dvh - 28px));overflow:auto;border:1px solid rgba(212,175,55,.32);border-radius:28px;background:#0d111c;color:#f8fafc;box-shadow:0 36px 100px rgba(0,0,0,.55),0 0 40px rgba(212,175,55,.08);padding:24px}
   html[data-theme="light"] .jyc-assistant-panel{background:#fffcf7;color:#1e1915;border-color:rgba(191,156,111,.45);box-shadow:0 30px 80px rgba(184,134,11,.15)}
   
   .jyc-assistant-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}
   .jyc-assistant-brand{display:flex;gap:14px;align-items:flex-start}
   .jyc-assistant-mark{width:48px;height:48px;flex:0 0 48px;display:grid;place-items:center;border-radius:14px;background:#141926;border:1px solid rgba(212,175,55,.38);box-shadow:0 10px 24px rgba(0,0,0,.3);overflow:hidden}
   html[data-theme="light"] .jyc-assistant-mark{background:#fdfbf7;border-color:rgba(191,156,111,.5)}
   .jyc-assistant-mark img{width:40px;height:40px;object-fit:contain}
   .jyc-assistant-head h2{margin:3px 0 5px;font-family:'Space Grotesk',sans-serif;font-size:clamp(24px,4vw,34px);letter-spacing:-.035em}
   .jyc-assistant-head p{margin:0;opacity:.75;font-size:13.5px;line-height:1.5}
   .jyc-assistant-close{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:transparent;font-size:24px;cursor:pointer;color:inherit;display:grid;place-items:center;transition:all .2s ease}
   .jyc-assistant-close:hover{background:rgba(255,255,255,.1);border-color:#d4af37}
   
   .jyc-assistant-search{display:flex;align-items:center;gap:12px;margin:20px 0 14px;padding:8px 16px;border:1px solid rgba(212,175,55,.28);border-radius:18px;background:rgba(255,255,255,.04);transition:all .25s ease}
   .jyc-assistant-search:focus-within{border-color:#d4af37;box-shadow:0 0 0 3px rgba(212,175,55,.2);background:rgba(255,255,255,.07)}
   html[data-theme="light"] .jyc-assistant-search{background:rgba(0,0,0,.03);border-color:rgba(191,156,111,.35)}
   .jyc-assistant-search .search-icon{font-size:22px;color:#d4af37}
   .jyc-assistant-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:inherit;font-family:'Space Grotesk',sans-serif;font-size:15px;padding:8px 0}
   .jyc-assistant-search button{width:32px;height:32px;border:0;border-radius:8px;background:transparent;color:inherit;font-size:20px;cursor:pointer}
   
   .jyc-assistant-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
   .chip-btn{padding:6px 12px;border-radius:999px;font-size:11.5px;font-family:'Space Grotesk',sans-serif;font-weight:600;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:inherit;cursor:pointer;transition:all .2s ease}
   .chip-btn:hover,.chip-btn.active{background:rgba(212,175,55,.18);border-color:#d4af37;color:#d4af37;transform:translateY(-1px)}
   html[data-theme="light"] .chip-btn{background:rgba(0,0,0,.04);border-color:rgba(0,0,0,.1)}
   html[data-theme="light"] .chip-btn:hover,.chip-btn.active{background:rgba(184,134,11,.12);border-color:#b8860b;color:#b8860b}

   .jyc-assistant-quick>span,.jyc-assistant-result-meta{display:flex;justify-content:space-between}
   .jyc-assistant-quick>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}
   .jyc-assistant-quick button{min-height:54px;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border:1px solid rgba(255,255,255,.09);border-radius:16px;background:rgba(255,255,255,.02);color:inherit;font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s ease}
   .jyc-assistant-quick button:hover{transform:translateY(-2px);border-color:rgba(212,175,55,.5);background:rgba(212,175,55,.08)}
   .jyc-assistant-quick b{color:#d4af37}
   
   .jyc-assistant-results{display:grid;gap:9px}
   .jyc-assistant-result-meta{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;opacity:.65;padding:0 2px 4px}
   .jyc-assistant-result{display:grid;grid-template-columns:minmax(0,1fr) 26px;gap:4px 12px;text-align:left;padding:14px 16px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.02);color:inherit;cursor:pointer;transition:all .2s ease}
   .jyc-assistant-result:hover{transform:translateY(-2px);border-color:#d4af37;background:rgba(212,175,55,.08)}
   .jyc-assistant-result small{grid-column:1/-1;letter-spacing:.12em;font-size:9.5px;font-weight:700;color:#d4af37}
   .jyc-assistant-result strong{font-family:'Space Grotesk',sans-serif;font-size:16px}
   .jyc-assistant-result span{font-size:12.5px;opacity:.72;line-height:1.4}
   .jyc-assistant-result>b{grid-row:2;grid-column:2;color:#d4af37}
   
   .jyc-assistant-empty{padding:28px 4px;text-align:center}
   .jyc-assistant-empty strong{font-size:18px;display:block;margin-bottom:6px}
   .jyc-assistant-empty p{opacity:.75;line-height:1.55;max-width:400px;margin:0 auto 16px}
   .jyc-assistant-empty button{min-height:42px;border:1px solid #d4af37;border-radius:12px;background:rgba(212,175,55,.12);color:inherit;font-weight:600;padding:0 18px;cursor:pointer}
   
   .jyc-assistant-note{display:flex;align-items:center;gap:10px;margin-top:18px;padding:12px 16px;border-radius:14px;background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.2);font-size:12px;opacity:.88}
   .jyc-assistant-foot{display:flex;justify-content:space-between;align-items:center;margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.08);font-size:11px;opacity:.75}
   .jyc-assistant-foot button{border:0;background:none;color:#d4af37;font-weight:700;cursor:pointer}
   
   @keyframes jycAssistantIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
   @media(max-width:600px){
     .jyc-assistant-overlay{padding:10px}
     .jyc-assistant-panel{padding:18px;border-radius:22px}
     .jyc-assistant-quick>div{grid-template-columns:1fr}
     .jyc-assistant-foot{flex-direction:column;align-items:flex-start;gap:8px}
   }
  `}</style>
 </div>
}
