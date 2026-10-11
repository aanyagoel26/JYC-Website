import React,{useEffect,useMemo,useRef,useState} from 'react';

const normal=v=>String(v??'').trim().toLowerCase();
const tokenize=v=>normal(v).split(/[^a-z0-9]+/).filter(Boolean);
const stableHash=value=>{
  let h=2166136261;
  for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return h>>>0;
};

const fieldValues=item=>({
  event:normal(item?.event||item?.eventTitle||item?.association),
  club:normal(item?.club||item?.community||item?.hub||item?.association),
  family:normal(item?.family||item?.category),
  year:normal(item?.year||item?.date?.slice?.(0,4)),
  kind:normal(item?.mediaKind||item?.visualType||'photo'),
  source:normal(item?.sourceLabel||item?.sourceType||item?.source)
});

export function scoreRelatedPhoto(current,candidate){
  if(!candidate?.url||candidate.url===current?.url)return -Infinity;
  const a=fieldValues(current),b=fieldValues(candidate);
  let score=0;
  if(a.event&&a.event===b.event)score+=100;
  if(a.club&&a.club===b.club)score+=80;
  if(a.family&&a.family===b.family)score+=45;
  if(a.year&&a.year===b.year)score+=28;
  if(a.kind&&a.kind===b.kind)score+=16;
  const at=new Set(tokenize([a.event,a.club,a.family].join(' ')));
  const bt=new Set(tokenize([b.event,b.club,b.family].join(' ')));
  let overlap=0;for(const token of at)if(bt.has(token))overlap++;
  score+=Math.min(20,overlap*5);
  return score;
}

export function buildRelatedPhotoSequence(items,seed=0,{maxItems=12}={}){
  const pool=Array.from(new Map((items||[]).filter(x=>x?.url).map(x=>[String(x.url),x])).values());
  if(pool.length<2)return pool;
  const first=pool[Math.abs(Number(seed)||0)%pool.length];
  const sequence=[first],used=new Set([first.url]);
  while(sequence.length<Math.min(maxItems,pool.length)){
    const current=sequence[sequence.length-1];
    const candidates=pool.filter(x=>!used.has(x.url));
    candidates.sort((a,b)=>{
      const score=scoreRelatedPhoto(current,b)-scoreRelatedPhoto(current,a);
      if(score)return score;
      return stableHash(String(a.url)+String(sequence.length))-stableHash(String(b.url)+String(sequence.length));
    });
    const next=candidates[0];
    if(!next)break;
    sequence.push(next);used.add(next.url);
  }
  return sequence;
}

export function pickRelatedPhoto(current,items,history=[]){
  const recent=new Set(history);
  const candidates=(items||[]).filter(x=>x?.url&&x.url!==current?.url&&!recent.has(x.url));
  if(!candidates.length)return (items||[]).find(x=>x?.url&&x.url!==current?.url)||current;
  return candidates.slice().sort((a,b)=>{
    const score=scoreRelatedPhoto(current,b)-scoreRelatedPhoto(current,a);
    if(score)return score;
    return stableHash(String(a.url)+String(current?.url))-stableHash(String(b.url)+String(current?.url));
  })[0]||current;
}

function supportsReducedMotion(){
  return typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function preloadAndDecode(url,cache){
  if(cache?.has(url))return cache.get(url);
  const promise=new Promise((resolve,reject)=>{
    if(!url)return reject(new Error('Missing image URL'));
    const img=new Image();
    img.decoding='async';
    try{img.fetchPriority='low'}catch{}
    img.onload=()=>{if(typeof img.decode==='function')img.decode().catch(()=>{}).finally(()=>resolve(img));else resolve(img)};
    img.onerror=reject;
    img.src=url;
  });
  if(cache){
    cache.set(url,promise);
    while(cache.size>3)cache.delete(cache.keys().next().value);
  }
  return promise;
}

export function LivingPhoto({items=[],seed=0,interval=6000,className='',altFallback='JYC visual archive moment',onChange}){
  const pool=useMemo(()=>Array.from(new Map(items.filter(x=>x?.url).map(x=>[String(x.url),x])).values()),[items]);
  const initial=useMemo(()=>pool.length?buildRelatedPhotoSequence(pool,seed,{maxItems:12}):[],[pool,seed]);
  const [sequence,setSequence]=useState(initial);
  const [index,setIndex]=useState(0);
  const [ready,setReady]=useState(true);
  const [paused,setPaused]=useState(false);
  const [reduced,setReduced]=useState(()=>supportsReducedMotion());
  const [error,setError]=useState(false);
  const [outgoing,setOutgoing]=useState(null);
  const historyRef=useRef([]);
  const mountedRef=useRef(true);
  const timerRef=useRef(null);
  const preloadCacheRef=useRef(new Map());

  useEffect(()=>()=>{mountedRef.current=false;if(timerRef.current)clearTimeout(timerRef.current)},[]);
  useEffect(()=>{
    const next=initial[0];
    setSequence(initial);setIndex(0);setReady(Boolean(next));setError(false);historyRef.current=[];
  },[initial]);

  useEffect(()=>{
    if(typeof window==='undefined'||!window.matchMedia)return;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media.matches);
    update();media.addEventListener?.('change',update);
    return()=>media.removeEventListener?.('change',update);
  },[]);

  const current=sequence[index]||pool[0];
  const nextCandidate=useMemo(()=>{
    if(!current)return null;
    if(index+1<sequence.length)return sequence[index+1];
    return pickRelatedPhoto(current,pool,historyRef.current.slice(-4));
  },[current,index,sequence,pool]);

  useEffect(()=>{
    if(!nextCandidate?.url)return;
    let cancelled=false;
    preloadAndDecode(nextCandidate.url,preloadCacheRef.current).catch(()=>{if(!cancelled)setError(true)});
    return()=>{cancelled=true};
  },[nextCandidate?.url]);

  const advance=async(direction=1)=>{
    if(!current||pool.length<2)return;
    const target=direction<0
      ? sequence[(index-1+sequence.length)%sequence.length]
      : nextCandidate;
    if(!target?.url)return;
    setReady(false);
    try{
      await preloadAndDecode(target.url,preloadCacheRef.current);
      if(!mountedRef.current)return;
      const targetIndex=sequence.findIndex(x=>x.url===target.url);
      if(targetIndex>=0){setOutgoing(current);historyRef.current=[...historyRef.current,target.url].slice(-6);setIndex(targetIndex);window.setTimeout(()=>mountedRef.current&&setOutgoing(null),700)}
      else{
        const nextSequence=[...sequence,target];
        historyRef.current=[...historyRef.current,target.url].slice(-6);
        setSequence(nextSequence);setIndex(nextSequence.length-1);
      }
      setReady(true);setError(false);onChange?.(target);
    }catch{setReady(true);setError(true)}
  };

  useEffect(()=>{
    if(paused||reduced||pool.length<2||document.visibilityState==='hidden')return;
    timerRef.current=window.setTimeout(()=>advance(1),interval);
    return()=>{if(timerRef.current)clearTimeout(timerRef.current)};
  },[paused,reduced,current?.url,nextCandidate?.url,interval,pool.length]);

  useEffect(()=>{
    const onVisibility=()=>setPaused(document.visibilityState==='hidden');
    document.addEventListener('visibilitychange',onVisibility);
    return()=>document.removeEventListener('visibilitychange',onVisibility);
  },[]);

  if(!current)return null;
  const label=current.caption||current.title||current.association||altFallback;
  return <div className={`jyc-living-photo ${className}`} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={()=>setPaused(false)}>
    <div className="jyc-living-photo-stage" aria-live="polite">
      {outgoing?.url&&<img className="jyc-living-photo-image is-outgoing" src={outgoing.url} alt="" aria-hidden="true" loading="eager" decoding="async" sizes="(max-width: 700px) calc(100vw - 24px), min(1180px, calc(100vw - 32px))" onError={event=>{const image=event.currentTarget;image.style.opacity="0";image.alt="";image.setAttribute("aria-hidden","true")}}/>}
      <img className={`jyc-living-photo-image is-current ${ready?'is-ready':''}`} data-source={current.url} src={current.url} alt={current.alt||label} loading="eager" decoding="async" fetchPriority="high" sizes="(max-width: 700px) calc(100vw - 24px), min(1180px, calc(100vw - 32px))" onError={event=>{const image=event.currentTarget;const source=image.dataset.source||current.url;if(image.dataset.fallbackSource!==source){image.dataset.fallbackSource=source;image.dataset.fallback="1";image.src="/assets/jyc-logo.webp";image.alt="Official JYC logo placeholder; archive photo unavailable";image.style.objectFit="contain";image.style.padding="18px";image.style.background="#f8f1e5";setError(true);return}if(image.dataset.fallback==="1"){image.dataset.fallback="2";image.src="/JYC%20Logo(4).png";image.alt="Official JYC logo placeholder; archive photo unavailable";image.style.objectFit="contain";image.style.padding="18px";image.style.background="#f8f1e5";return}image.style.opacity="0";image.alt="";image.setAttribute("aria-hidden","true");setError(true)}}/>
      <div className="jyc-living-photo-scrim" aria-hidden="true"/>
      <div className="jyc-living-photo-meta"><span>{current.association||current.sourceLabel||'JYC Archive'}{current.year?' · '+current.year:''}</span><strong>{label}</strong></div>
      <div className="jyc-living-photo-controls">
        <button type="button" onClick={()=>advance(-1)} aria-label="Previous related photograph">‹</button>
        <button type="button" onClick={()=>setPaused(v=>!v)} aria-pressed={paused} aria-label={paused?'Resume automatic photo transition':'Pause automatic photo transition'}>{paused?'▶':'Ⅱ'}</button>
        <button type="button" onClick={()=>advance(1)} aria-label="Next related photograph">›</button>
      </div>
      {error&&<span className="jyc-living-photo-status" role="status">A photo could not load; the current image or official JYC mark remains in place.</span>}
    </div>
  </div>;
}

export default LivingPhoto;
