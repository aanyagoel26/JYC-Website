import React,{useState}from'react';
import './FlipCard.css';

export default function FlipCard({front,back,className='',label='Flip card'}) {
 const [flipped,setFlipped]=useState(false);
 const toggle=()=>setFlipped(v=>!v);
 return <div className={`flip-card ${flipped?'is-flipped':''} ${className}`.trim()} role="button" tabIndex={0} onClick={toggle} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}}} aria-label={label} aria-pressed={flipped}>
  <span className="flip-card__inner">
   <span className="flip-card__face flip-card__front">{front}</span>
   <span className="flip-card__face flip-card__back">{back}</span>
  </span>
 </div>;
}
