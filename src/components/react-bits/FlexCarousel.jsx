import React,{useEffect,useMemo,useRef,useState}from'react';import'./FlexCarousel.css';

const PRESETS={liquid:{tilt:62,bend:.34,dispersion:.45},ribbon:{tilt:0,bend:.34,dispersion:.4},vortex:{tilt:30,bend:.46,dispersion:.5},arch:{tilt:0,bend:.3,dispersion:.4}};
const clamp=(n,a,b)=>Math.min(Math.max(n,a),b);

export default function FlexCarousel({items=[],preset='liquid',intro='rise',fit='natural',cardHeight=.5,gap=12,radius=0,lensWidth,lensHeight,tilt,bend,dispersion,squeeze=.2,focusOnClick=true,autoplay=false,interval=4,captions=true,captureWheel=true,onChange,onSelect,className='',style}){
 const list=useMemo(()=>Array.isArray(items)&&items.length?items:[],[items]);
 const [active,setActive]=useState(0),[focused,setFocused]=useState(-1);
 const root=useRef(null),track=useRef(null),drag=useRef({on:false,x:0,start:0});
 const base=PRESETS[preset]||PRESETS.liquid;
 const settings={tilt:tilt??base.tilt,bend:bend??base.bend,dispersion:dispersion??base.dispersion};
 useEffect(()=>{if(active>=list.length)setActive(Math.max(0,list.length-1))},[active,list.length]);
 useEffect(()=>{if(!list.length||!onChange)return;onChange(active,list[active])},[active,list,onChange]);
 useEffect(()=>{if(!autoplay||focused>=0||list.length<2)return;const id=setInterval(()=>setActive(i=>(i+1)%list.length),Math.max(2,interval)*1000);return()=>clearInterval(id)},[autoplay,interval,focused,list.length]);
 useEffect(()=>{const el=root.current;if(!el)return;const key=e=>{if(e.key==='ArrowRight'){e.preventDefault();setActive(i=>(i+1)%list.length)}if(e.key==='ArrowLeft'){e.preventDefault();setActive(i=>(i-1+list.length)%list.length)}if(e.key==='Escape')setFocused(-1);if(e.key==='Enter'||e.key===' '){if(active>=0){e.preventDefault();onSelect?.(active,list[active]);if(focusOnClick)setFocused(active)}}};el.addEventListener('keydown',key);return()=>el.removeEventListener('keydown',key)},[active,focusOnClick,list,onSelect]);
 const move=(x)=>{if(!root.current)return;const r=root.current.getBoundingClientRect();const p=clamp((x-r.left)/r.width,0,1);track.current?.style.setProperty('--cursor-x',p.toString())};
 const down=e=>{if(focused>=0){setFocused(-1);return}drag.current={on:true,x:e.clientX,start:active};root.current?.setPointerCapture?.(e.pointerId)};
 const up=e=>{if(!drag.current.on)return;const dx=e.clientX-drag.current.x;drag.current.on=false;if(Math.abs(dx)>35)setActive(i=>clamp(i-(dx>0?1:-1),0,Math.max(0,list.length-1)))};
 const wheel=e=>{if(!captureWheel||focused>=0||Math.abs(e.deltaY)<Math.abs(e.deltaX))return;e.preventDefault();setActive(i=>clamp(i+(e.deltaY>0?1:-1),0,Math.max(0,list.length-1)))};
 if(!list.length)return <div className={'flex-carousel flex-carousel--empty '+className}/>;
 return <div ref={root} className={`flex-carousel flex-carousel--${intro} ${className}`.trim()} style={{...style,'--fc-height':`${clamp(cardHeight,.25,1)*100}%`,'--fc-gap':`${gap}px`,'--fc-radius':`${radius}px`,'--fc-lens-width':`${(lensWidth??.74)*100}%`,'--fc-lens-height':`${(lensHeight??1.05)*100}%`,'--fc-tilt':`${settings.tilt}deg`,'--fc-bend':settings.bend,'--fc-dispersion':settings.dispersion}} role="region" aria-roledescription="carousel" aria-label="JYC visual carousel" tabIndex={0} onPointerMove={e=>move(e.clientX)} onPointerDown={down} onPointerUp={up} onPointerCancel={()=>{drag.current.on=false}} onWheel={wheel}>
   <div className="flex-carousel__lens" aria-hidden="true"/>
   <div ref={track} className="flex-carousel__track" style={{'--fc-active':active}}>
    {list.map((item,i)=>{const d=Math.abs(i-active);return <button type="button" key={item.id||item.src||i} className={`flex-carousel__card ${i===active?'is-active':''} ${focused===i?'is-focused':''}`} style={{'--fc-distance':d}} onClick={e=>{e.stopPropagation();if(i!==active){setActive(i);return}onSelect?.(i,item);if(focusOnClick)setFocused(i)}} aria-label={item.title||item.alt||`Image ${i+1}`}><span className="flex-carousel__image-wrap"><img src={item.src} alt={item.alt||''} loading={i<3?'eager':'lazy'} decoding="async"/><span className="flex-carousel__glass"/></span></button>})}
   </div>
   {captions&&<div className="flex-carousel__caption"><span className="flex-carousel__eyebrow">JYC VISUAL ARCHIVE</span><strong>{list[active]?.title||list[active]?.alt||'JYC archive'}</strong>{list[active]?.subtitle&&<small>{list[active].subtitle}</small>}<span className="flex-carousel__count">{String(active+1).padStart(2,'0')} / {String(list.length).padStart(2,'0')}</span></div>}
   <span className="flex-carousel__hint">Drag · scroll · select</span>
   <span className="flex-carousel__live" aria-live="polite">{list[active]?.title||list[active]?.alt||'JYC archive'}, {active+1} of {list.length}</span>
 </div>
}