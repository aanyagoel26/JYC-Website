import React,{Children,useEffect,useRef,useState}from'react';
import './FlipCard.css';

export default function FlipCard({front,back,children,className='',label='Flip card'}) {
 const [flipped,setFlipped]=useState(false);
 const frontRef=useRef(null),backRef=useRef(null),hasFlipped=useRef(false);
 useEffect(()=>{if(!hasFlipped.current)return;(flipped?backRef.current:frontRef.current)?.focus({preventScroll:true})},[flipped]);
 const faces=Children.toArray(children);
 const frontContent=front??faces[0]??null;
 const backContent=back??faces[1]??null;
 const toggle=()=>{hasFlipped.current=true;setFlipped(value=>!value)};
 const handleBackClick=event=>{
  if(event.target.closest('a,button,input,textarea,select,[data-flip-ignore]'))return;
  toggle();
 };
 return <div className={`flip-card ${flipped?'is-flipped':''} ${className}`.trim()} role="group" aria-label={label} onClick={handleBackClick}>
  <span className="flip-card__inner">
   <button ref={frontRef} type="button" className="flip-card__face flip-card__front" aria-label={label} aria-expanded={flipped} aria-hidden={flipped} inert={flipped} onClick={toggle}>{frontContent}</button>
   <span className="flip-card__face flip-card__back" aria-hidden={!flipped} inert={!flipped}>{backContent}<button ref={backRef} type="button" className="flip-card__back-trigger" aria-label={`Return to photo for ${label}`} aria-expanded={flipped} onClick={toggle}>← Back to photo</button></span>
  </span>
  <span className="flip-card__sr-only" aria-live="polite">{flipped?'Profile details shown.':'Photo shown.'}</span>
 </div>;
}
