import React,{Children,useState}from'react';
import './FlipCard.css';

export default function FlipCard({front,back,children,className='',label='Flip card'}) {
 const [flipped,setFlipped]=useState(false);
 const faces=Children.toArray(children);
 const frontContent=front??faces[0]??null;
 const backContent=back??faces[1]??null;
 const toggle=()=>setFlipped(value=>!value);
 const handleClick=event=>{
  if(event.target.closest('a,button,input,textarea,select,[data-flip-ignore]'))return;
  toggle();
 };
 const handleKeyDown=event=>{
  if(event.target!==event.currentTarget)return;
  if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle()}
 };
 return <div
  className={`flip-card ${flipped?'is-flipped':''} ${className}`.trim()}
  role="group"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  aria-label={label}
  aria-expanded={flipped}
 >
  <span className="flip-card__inner">
   <span className="flip-card__face flip-card__front" aria-hidden={flipped}>{frontContent}</span>
   <span className="flip-card__face flip-card__back" aria-hidden={!flipped}>{backContent}</span>
  </span>
  <span className="flip-card__sr-only">{flipped?'Profile details shown. Activate the card to return to the photo.':'Activate the card to read this profile.'}</span>
 </div>;
}
