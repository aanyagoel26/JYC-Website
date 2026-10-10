import {useEffect} from 'react';
import './jyc-innovation-motion.css';

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

export function JYCInnovationMotion(){
  useEffect(()=>setupReveal(),[]);
  return null;
}
