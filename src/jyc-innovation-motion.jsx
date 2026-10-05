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
  // Public card tilt was intentionally retired: it conflicts with the senior/V1 editorial direction,
  // can feel unstable on touch hardware, and adds pointer-driven layout work. Keep reveal + image hover only.
  return()=>{};
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
