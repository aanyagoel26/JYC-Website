import React,{useEffect,useRef} from 'react';
import {photoDerivativeUrls} from './jyc-photo-intelligence.js';
const LOGO_FALLBACK='/JYC%20Logo(4).png';
const fallback=(e,src,fallbackSrc,fallbackAlt)=>{
 const image=e.currentTarget;
 const stage=image.dataset.imageFallbackStage||'0';
 const picture=image.parentElement;
 if(picture?.tagName?.toLowerCase()==='picture')picture.querySelectorAll('source').forEach(source=>{source.removeAttribute('srcset');source.removeAttribute('sizes')});
 if(stage==='0'){
  image.dataset.imageFallbackStage='1';
  const next=fallbackSrc&&fallbackSrc!==src?fallbackSrc:(src!==LOGO_FALLBACK?LOGO_FALLBACK:'');
  if(next){image.alt=fallbackAlt??'Official JYC logo placeholder; image unavailable';image.src=next;return}
 }
 if(stage!=='2'&&src!==LOGO_FALLBACK&&(image.currentSrc||image.src)!==LOGO_FALLBACK){
  image.dataset.imageFallbackStage='2';
  image.alt=fallbackAlt||'JYC image fallback';
  image.src=LOGO_FALLBACK;
  return;
 }
 image.dataset.imageFallbackStage='failed';
 image.removeAttribute('src');
 image.style.visibility='hidden';
};
export function ResponsivePhoto({src,alt='',width,height,sizes='100vw',loading='lazy',fetchPriority,decoding='async',className='',style,onError,objectPosition,fallbackSrc='/JYC%20Logo(4).png',fallbackAlt='Official JYC logo placeholder; image unavailable'}){
 const imageRef=useRef(null);
 useEffect(()=>{if(imageRef.current){delete imageRef.current.dataset.imageFallbackStage;imageRef.current.style.visibility='';imageRef.current.alt=alt}},[src,fallbackSrc,alt]);
 const derivativesEnabled=import.meta.env.PROD||import.meta.env.VITE_ENABLE_PHOTO_DERIVATIVES==='true';
 const variants=derivativesEnabled?photoDerivativeUrls(src,width):null;
 const fallbackImage=variants?.webp?.at(-1)?.url||src;
 const sourceSet=list=>list.map(x=>x.url+' '+x.width+'w').join(', ');
 return <picture className={className?'jyc-responsive-picture '+className:'jyc-responsive-picture'}>
  {variants&&<source type="image/avif" srcSet={sourceSet(variants.avif)} sizes={sizes}/>}
  {variants&&<source type="image/webp" srcSet={sourceSet(variants.webp)} sizes={sizes}/>}
  <img ref={imageRef} src={variants?fallbackImage:src} alt={alt} width={width} height={height} loading={loading} fetchPriority={fetchPriority} decoding={decoding} sizes={sizes} style={objectPosition?{...style,objectPosition}:style} onError={e=>{fallback(e,src,fallbackSrc,fallbackAlt);onError?.(e)}}/>
 </picture>;
}
