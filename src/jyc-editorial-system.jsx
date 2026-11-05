import React,{useEffect,useLayoutEffect} from 'react';
import {useLocation} from 'react-router-dom';

const PAGE_NAMES={'/':'JYC','/about':'About','/clubs':'Communities','/events':'Events','/gallery':'Moments','/archive':'Archive','/team':'People','/contact':'Contact','/history':'History'};
export function JYCEditorialSystem({children}){
 const loc=useLocation();
 const clean=loc.pathname.replace(/\/$/,'')||'/';
 const page=PAGE_NAMES[clean]||(clean.startsWith('/clubs/')?'Community':clean.startsWith('/events/')?'Event':clean.startsWith('/gallery/')?'Moment':'JYC');
 useLayoutEffect(()=>{
   document.documentElement.dataset.jycRoute=clean;
   document.documentElement.dataset.jycPage=page.toLowerCase().replace(/\s+/g,'-');
   window.scrollTo?.({top:0,behavior:'auto'});
   return()=>{delete document.documentElement.dataset.jycRoute;delete document.documentElement.dataset.jycPage};
 },[clean,page]);

 // Progressive reveal: content remains visible if observers are unavailable or
 // the visitor requests reduced motion. Elements are only animated as they enter.
 useEffect(()=>{
   if(typeof window==='undefined'||!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
   const root=document.querySelector('.public-app');
   if(!root) return;
   const targets=[...root.querySelectorAll('main > section, main > .jh-container, main > .jh-community, .public-app > .route-stage > section')];
   if(!targets.length) return;
   const observer=new IntersectionObserver(entries=>{
     entries.forEach(entry=>{
       if(entry.isIntersecting){
         entry.target.classList.add('jyc-reveal-visible');
         observer.unobserve(entry.target);
       }
     });
   },{rootMargin:'0px 0px -8% 0px',threshold:0.06});
   targets.forEach((element,index)=>{
     element.classList.add('jyc-reveal');
     element.style.setProperty('--jyc-reveal-index',String(Math.min(index,7)));
     observer.observe(element);
   });
   return()=>{
     observer.disconnect();
     targets.forEach(element=>{
       element.classList.remove('jyc-reveal','jyc-reveal-visible');
       element.style.removeProperty('--jyc-reveal-index');
     });
   };
 },[clean]);
 return <><div className="jyc-route-transition" aria-hidden="true"/>{children}</>;
}
