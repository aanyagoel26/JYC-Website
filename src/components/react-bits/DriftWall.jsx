import React,{useCallback,useEffect,useLayoutEffect,useMemo,useRef,useState}from'react';
import'./DriftWall.css';

const prefersReducedMotion=()=>typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const columnFactor=(index,variance)=>1+variance*(((index*0.6180339887+0.35)%1)*2-1);

export default function DriftWall({
 items=[],columns=5,tileWidth=200,tileHeight=132,gap=18,radius=14,tilt=16,turn=-14,roll=0,
 perspective=1200,depth=120,speed=6,direction='up',variance=.35,parallax=.18,pauseOnHover=true,
 lift=42,fade=.6,dim=.62,grayscale=false,overlayColor='#18161d',className='',style,onOpen,
 ariaLabel='JYC visual archive'
}){
 const root=useRef(null);
 const plane=useRef(null);
 const tracks=useRef([]);
 const offsets=useRef([]);
 const velocities=useRef([]);
 const frame=useRef(0);
 const lastTime=useRef(null);
 const pointer=useRef({x:0,y:0});
 const damp=useRef({x:0,y:0});
 const visible=useRef(true);
 const hoveredColumn=useRef(-1);
 const hovered=useRef(false);
 const [height,setHeight]=useState(600);
 const [active,setActive]=useState(null);
 const [reduced,setReduced]=useState(false);
 const [lowPower,setLowPower]=useState(false);

 const safeItems=useMemo(()=>Array.isArray(items)?items.filter(item=>item?.image):[],[items]);
 const count=Math.max(1,Math.min(columns,safeItems.length||1));
 const columnItems=useMemo(()=>{
  const result=Array.from({length:count},()=>[]);
  safeItems.forEach((item,index)=>result[index%count].push(item));
  return result;
 },[safeItems,count]);

 const columnMeta=useMemo(()=>columnItems.map(column=>{
  const pitch=tileHeight+gap;
  const copyHeight=Math.max(pitch,column.length*pitch);
  return {copyHeight,copies:Math.max(2,Math.ceil((height*1.55)/copyHeight)+1)};
 }),[columnItems,tileHeight,gap,height]);

 const baseVelocity=useMemo(()=>columnItems.map((_,index)=>
  speed*columnFactor(index,variance)*(direction==='up'?1:-1)*(index%2?-1:1)
 ),[columnItems,speed,variance,direction]);

 useEffect(()=>{
  const mq=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const mobile=window.matchMedia?.('(max-width:800px)');
  const coarse=window.matchMedia?.('(pointer:coarse)');
  const syncMotion=()=>setReduced(Boolean(mq?.matches));
  const syncPower=()=>setLowPower(Boolean(mobile?.matches||coarse?.matches));
  syncMotion();syncPower();
  mq?.addEventListener?.('change',syncMotion);
  mobile?.addEventListener?.('change',syncPower);
  coarse?.addEventListener?.('change',syncPower);
  const observer=new IntersectionObserver(([entry])=>{visible.current=entry.isIntersecting},{rootMargin:'180px'});
  if(root.current)observer.observe(root.current);
  return()=>{
   mq?.removeEventListener?.('change',syncMotion);
   mobile?.removeEventListener?.('change',syncPower);
   coarse?.removeEventListener?.('change',syncPower);
   observer.disconnect();
  };
 },[]);

 useLayoutEffect(()=>{
  if(!root.current)return;
  const observer=new ResizeObserver(([entry])=>setHeight(entry.contentRect.height||600));
  observer.observe(root.current);
  return()=>observer.disconnect();
 },[]);

 useEffect(()=>{
  offsets.current=columnMeta.map((meta,index)=>meta.copyHeight*((index*.37)%1));
  velocities.current=columnMeta.map(()=>0);
 },[columnMeta]);

 const applyTransform=useCallback((x=0,y=0)=>{
  if(!plane.current)return;
  plane.current.style.transform=
   `translate(-50%,-50%) scale(1.18) rotateX(${tilt+y}deg) rotateY(${turn+x}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`;
 },[tilt,turn,roll,depth]);

 useEffect(()=>{
  const animate=timestamp=>{
   frame.current=0;
   const delta=lastTime.current==null?0:Math.min(.05,Math.max(0,(timestamp-lastTime.current)/1000));
   lastTime.current=timestamp;
   if(reduced||lowPower||!visible.current){
    applyTransform(0,0);
    lastTime.current=null;
    return;
   }
   const maxParallax=parallax*7;
   const smoothing=1-Math.exp(-delta/.12);
   damp.current.x+=(pointer.current.x*maxParallax-damp.current.x)*smoothing;
   damp.current.y+=(-pointer.current.y*maxParallax-damp.current.y)*smoothing;
   applyTransform(damp.current.x,damp.current.y);
   for(let index=0;index<tracks.current.length;index++){
    const meta=columnMeta[index];
    const target=((hovered.current&&pauseOnHover)||hoveredColumn.current===index)?0:baseVelocity[index];
    const ease=1-Math.exp(-delta/(target===0?.16:.28));
    velocities.current[index]+=(target-velocities.current[index])*ease;
    let offset=(offsets.current[index]||0)+velocities.current[index]*delta;
    offset=((offset%meta.copyHeight)+meta.copyHeight)%meta.copyHeight;
    offsets.current[index]=offset;
    if(tracks.current[index])tracks.current[index].style.transform=`translate3d(0,${-offset}px,0)`;
   }
   frame.current=requestAnimationFrame(animate);
  };
  if(!reduced&&!lowPower&&visible.current)frame.current=requestAnimationFrame(animate);
  return()=>{
   cancelAnimationFrame(frame.current);
   frame.current=0;
   lastTime.current=null;
  };
 },[applyTransform,baseVelocity,columnMeta,lowPower,pauseOnHover,reduced]);

 const handlePointerMove=event=>{
  const rect=root.current?.getBoundingClientRect();
  if(!rect||!parallax||reduced||lowPower)return;
  pointer.current={
   x:(event.clientX-rect.left)/rect.width-.5,
   y:(event.clientY-rect.top)/rect.height-.5
  };
 };

 const handleLeave=()=>{
  hovered.current=false;
  hoveredColumn.current=-1;
  pointer.current={x:0,y:0};
  setActive(null);
 };

 const cssVars={
  '--dw-tile-w':`${tileWidth}px`,'--dw-tile-h':`${tileHeight}px`,'--dw-gap':`${gap}px`,
  '--dw-radius':`${radius}px`,'--dw-perspective':`${perspective}px`,'--dw-lift':`${lift}px`,
  '--dw-dim':dim,'--dw-gray':grayscale?1:0,'--dw-overlay':overlayColor,
  '--dw-edge':`${Math.max(0,(1-fade)*100)}%`,...style
 };

 if(!safeItems.length)return null;

 return <div
  ref={root}
  className={`drift-wall ${reduced?'drift-wall--reduced':''} ${className}`.trim()}
  style={cssVars}
  onPointerMove={handlePointerMove}
  onPointerEnter={()=>{hovered.current=true}}
  onPointerLeave={handleLeave}
  role="group"
  aria-label={ariaLabel}
 >
  <div ref={plane} className="drift-wall__plane">
   {columnItems.map((column,columnIndex)=>{
    const meta=columnMeta[columnIndex];
    return <div className="drift-wall__col" key={columnIndex}>
     <div className="drift-wall__track" ref={element=>{tracks.current[columnIndex]=element}}>
      {Array.from({length:meta.copies}).flatMap((_,copyIndex)=>column.map((item,itemIndex)=>{
       const id=`${columnIndex}-${copyIndex}-${itemIndex}`;
       return <button
        type="button"
        key={id}
        className={`drift-wall__tile ${active===id?'is-active':''}`}
        tabIndex={copyIndex===0?0:-1}
        aria-label={item.title||'JYC gallery image'}
        onMouseEnter={()=>{hoveredColumn.current=columnIndex;setActive(id)}}
        onFocus={()=>{hoveredColumn.current=columnIndex;setActive(id)}}
        onBlur={()=>{hoveredColumn.current=-1;setActive(null)}}
        onClick={()=>{
         if(typeof onOpen==='function')onOpen(item);
         else if(item.href)window.location.href=item.href;
        }}
       >
        <span className="drift-wall__inner">
         <img src={item.image} alt={item.title||''} loading="lazy" decoding="async" draggable="false"/>
         <span className="drift-wall__overlay"/>
        </span>
       </button>;
      }))}
     </div>
    </div>;
   })}
  </div>
 </div>;
}
