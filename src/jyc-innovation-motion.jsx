import React,{useEffect} from 'react';
import './jyc-innovation-motion.css';

const TILT_TARGETS=[
  '.public-app .club-card-v41',
  '.public-app .club-card-premium',
  '.public-app .event-card-premium',
  '.public-app .gallery-card',
  '.public-app .jyc-living-spotlight'
];

function setupReveal(){
  const nodes=[...document.querySelectorAll('.public-app .reveal')];
  if(!nodes.length)return()=>{};
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    nodes.forEach(node=>node.classList.add('jyc-motion-visible'));
    return()=>{};
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('jyc-motion-visible');
        observer.unobserve(entry.target);
      }
    });
  },{rootMargin:'0px 0px -10% 0px',threshold:.08});
  nodes.forEach(node=>observer.observe(node));
  return()=>observer.disconnect();
}

function setupTilt(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return()=>{};
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return()=>{};
  const cleanups=[];
  TILT_TARGETS.forEach(selector=>{
    document.querySelectorAll(selector).forEach(card=>{
      if(card.dataset.jycMotionBound==='1')return;
      card.dataset.jycMotionBound='1';
      const move=e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width;
        const y=(e.clientY-r.top)/r.height;
        card.style.setProperty('--pointer-x',String(Math.round(x*100))+'%');
        card.style.setProperty('--pointer-y',String(Math.round(y*100))+'%');
        card.style.setProperty('--tilt-x',((.5-y)*2.2).toFixed(2)+'deg');
        card.style.setProperty('--tilt-y',((x-.5)*2.2).toFixed(2)+'deg');
        card.classList.add('jyc-pointer-active');
      };
      const leave=()=>{
        card.style.setProperty('--tilt-x','0deg');
        card.style.setProperty('--tilt-y','0deg');
        card.classList.remove('jyc-pointer-active');
      };
      card.addEventListener('pointermove',move,{passive:true});
      card.addEventListener('pointerleave',leave,{passive:true});
      cleanups.push(()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);});
    });
  });
  return()=>cleanups.forEach(fn=>fn());
}

export function JYCInnovationMotion(){
  useEffect(()=>{
    const cleanups=[setupReveal(),setupTilt()];
    const root=document.querySelector('.public-app');
    if(!root)return()=>cleanups.forEach(fn=>fn());
    const refresh=()=>{cleanups[1]?.();cleanups[1]=setupTilt();};
    const observer=new MutationObserver(refresh);
    observer.observe(root,{childList:true,subtree:true});
    return()=>{observer.disconnect();cleanups.forEach(fn=>fn());};
  },[]);
  return null;
}
