import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ResponsivePhoto} from './jyc-responsive-photo.jsx';

const safeDate=e=>{
 const raw=String(e?.date||'').trim();
 if(!raw)return Infinity;
 const timestamp=Date.parse(/[T ]\\d{1,2}:\\d{2}/.test(raw)?raw.replace(' ','T'):`${raw}T${String(e?.start||'00:00').padStart(5,'0')}`);
 return Number.isFinite(timestamp)?timestamp:Infinity;
};
const slugify=value=>String(value||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const eventPath=e=>`/events/${encodeURIComponent(String(e?.slug||slugify(e?.title)||e?.id||''))}`;
function Empty({eyebrow,title,text}){return <div className="jyc57-empty"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>}

export function JYC57Archive({data}){
 const nav=useNavigate();
 const events=Array.isArray(data?.events)?data.events.filter(e=>e?.published&&e?.archived!==true):[];
 const years=[...new Set(events.map(e=>String(e.date||'').slice(0,4)).filter(Boolean))].sort((a,b)=>Number(b)-Number(a));
 const [year,setYear]=useState(years[0]||'all');
 const selected=(year==='all'?events:events.filter(e=>String(e.date||'').startsWith(year))).slice().sort((a,b)=>safeDate(b)-safeDate(a));
 const photos=(Array.isArray(data?.gallery)?data.gallery:[]).filter(g=>g?.url||g?.src).slice(0,6);
 return <section className="section page unified-public-page jyc57-page">
  <header className="jyc57-archive-head"><div><span className="eyebrow">JYC · 04 / HISTORY</span><h1>What happened stays.</h1><p>The public archive connects years, events and photographs so JYC feels like a living organisation rather than a list of current pages.</p></div><div className="jyc57-year-switch">{['all',...years].map(y=><button type="button" key={y} className={year===y?'active':''} onClick={()=>setYear(y)}>{y==='all'?'All':y}</button>)}</div></header>
  <div className="jyc57-archive-grid"><div><div className="jyc57-list-head"><span>{selected.length} archived/published events</span><small>Year: {year==='all'?'All':year}</small></div>{selected.map(e=><button type="button" className="jyc57-archive-row" key={e.id||e.title} onClick={()=>nav(eventPath(e))}><span>{e.date||'TBA'}</span><div><strong>{e.title}</strong><small>{e.club||'JYC'} · {e.venue||'JIIT Sector 128'}</small></div><b>↗</b></button>)}{!selected.length&&<Empty eyebrow="ARCHIVE" title="No records for this year." text="Published records will appear here when available."/>}</div><aside className="jyc57-archive-story"><span className="eyebrow">VISUAL MEMORY</span><h2>People. Places. Participation.</h2><div className="jyc57-story-grid">{photos.map((g,i)=><ResponsivePhoto key={g.id||i} src={g.url||g.src} alt={g.caption||'JYC archive'} loading="lazy" sizes="(max-width: 700px) 50vw, 20vw" fallbackSrc="/assets/photo-unavailable.svg" fallbackAlt="Photograph unavailable"/>)}</div><button type="button" className="jyc57-text-link" onClick={()=>nav('/gallery')}>Open the full gallery →</button></aside></div>
 </section>
}
