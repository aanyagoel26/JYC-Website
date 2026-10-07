import React,{useEffect,useMemo,useState} from 'react';
import {supabase} from './lib/supabase';

const empty={clubs:[],events:[],gallery:[],reviews:[],verification:[]};
const pct=(a,b)=>b?Math.round((a/b)*100):0;

export function AdminTrustDashboard(){
 const [data,setData]=useState(empty),[busy,setBusy]=useState(true),[error,setError]=useState('');
 const load=async()=>{
  setBusy(true);setError('');
  try{
   const [clubs,events,gallery,verification,reviews]=await Promise.all([
    supabase.from('jyc_clubs').select('id,status').limit(200),
    supabase.from('jyc_events').select('id,status,club_id').limit(300),
    supabase.from('jyc_gallery_items').select('id,status,club_id,event_id').limit(500),
    supabase.from('jyc_content_verification').select('entity_type,entity_id,campus_id,status,source_url,verified_at,last_updated_at').order('last_updated_at',{ascending:false}).limit(500),
    supabase.from('jyc_content_reviews').select('id,entity_type,entity_id,status,created_at,reviewed_at').order('created_at',{ascending:false}).limit(100)
   ]);
   const first=[clubs,events,gallery,verification,reviews].find(x=>x.error);
   if(first?.error)throw first.error;
   setData({clubs:clubs.data||[],events:events.data||[],gallery:gallery.data||[],reviews:reviews.data||[],verification:verification.data||[]});
  }catch(e){setError(e?.message||'Could not load the trust dashboard.')}
  finally{setBusy(false)}
 };
 useEffect(()=>{load()},[]);
 const stats=useMemo(()=>{
  const v=data.verification||[];
  const verified=(type)=>v.filter(x=>x.entity_type===type&&['verified','published'].includes(x.status)).length;
  const review=(type)=>v.filter(x=>x.entity_type===type&&x.status==='review').length;
  const published=(rows)=>rows.filter(x=>['published','approved'].includes(x.status)).length;
  const clubs=data.clubs,events=data.events,gallery=data.gallery;
  return {
   clubsPublished:published(clubs),eventsPublished:published(events),galleryPublished:published(gallery),
   clubsVerified:verified('club'),eventsVerified:verified('event'),galleryVerified:verified('gallery'),
   clubsReview:review('club'),eventsReview:review('event'),galleryReview:review('gallery'),
   eventsLinked:events.filter(x=>x.club_id).length,galleryClubLinked:gallery.filter(x=>x.club_id).length,galleryEventLinked:gallery.filter(x=>x.event_id).length,
   reviewQueue:data.reviews.filter(x=>!['approved','rejected'].includes(x.status)).length
  };
 },[data]);
 const card=(label,value,detail)=> <div className="metric"><strong>{value}</strong><span>{label}</span><small>{detail}</small></div>;
 return <section className="admin-content">
  <div className="content-head"><div><span className="eyebrow">TRUST · CONTENT GRAPH</span><h2>Publication health</h2><p className="admin-note">A read-only operational view of provenance, publication coverage and relationship completeness. It never marks content verified automatically.</p></div><button className="btn secondary" disabled={busy} onClick={load}>{busy?'Refreshing…':'Refresh'}</button></div>
  {error&&<div className="error-box" role="alert">{error}</div>}
  {busy&&!data.verification.length?<div className="editor-card">Loading live publication health…</div>:<>
   <div className="metric-grid">
    {card('Published clubs',stats.clubsPublished,stats.clubsVerified+' verified')}
    {card('Published events',stats.eventsPublished,stats.eventsVerified+' verified')}
    {card('Approved gallery',stats.galleryPublished,stats.galleryVerified+' verified')}
    {card('Verification queue',stats.clubsReview+stats.eventsReview+stats.galleryReview,stats.clubsReview+' clubs · '+stats.eventsReview+' events · '+stats.galleryReview+' gallery')}
    {card('Open content reviews',stats.reviewQueue,'Editorial workflow only')}
   </div>
   <div className="editor-card">
    <span className="eyebrow">PROVENANCE COVERAGE</span><h3>Verification must precede official publication</h3>
    <div className="trust-table">
     {[
      ['Clubs',stats.clubsPublished,stats.clubsVerified,stats.clubsReview],
      ['Events',stats.eventsPublished,stats.eventsVerified,stats.eventsReview],
      ['Gallery',stats.galleryPublished,stats.galleryVerified,stats.galleryReview]
     ].map(([label,total,verified,inReview])=><div className="analytics-row" key={label}><span><strong>{label}</strong><small>{verified}/{total} verified · {inReview} in review</small></span><strong>{pct(verified,total)}%</strong></div>)}
    </div>
   </div>
   <div className="editor-card">
    <span className="eyebrow">RELATIONSHIPS</span><h3>Content graph coverage</h3>
    <div className="trust-table">
     <div className="analytics-row"><span>Events linked to clubs</span><strong>{stats.eventsLinked}/{data.events.length}</strong></div>
     <div className="analytics-row"><span>Gallery linked to clubs</span><strong>{stats.galleryClubLinked}/{data.gallery.length}</strong></div>
     <div className="analytics-row"><span>Gallery linked to events</span><strong>{stats.galleryEventLinked}/{data.gallery.length}</strong></div>
     <div className="analytics-row"><span>Event people / club members / club links</span><strong>Populate when authoritative rosters exist</strong></div>
    </div>
    <p className="admin-note">The dashboard intentionally exposes missing relationships instead of inventing people, event-gallery associations or recruitment claims.</p>
   </div>
   <div className="editor-card">
    <span className="eyebrow">NEXT ACTIONS</span><h3>What should be resolved before the next release</h3>
    <ol className="trust-next-actions">
     <li>Resolve every club/event/gallery record still in <b>review</b> with a current Sector-128 source.</li>
     <li>Keep planned events from exposing registration until an authoritative registration path exists.</li>
     <li>Link galleries to events only when the source explicitly establishes the relationship.</li>
     <li>Populate people, club members and official links from authoritative rosters rather than estimates.</li>
    </ol>
   </div>
  </>}
 </section>
}
