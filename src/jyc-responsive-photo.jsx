import React,{useEffect,useRef} from 'react';
import {photoDerivativeUrls} from './jyc-photo-intelligence.js';
const fallback=(e,src)=>{const image=e.currentTarget;if(image.dataset.fallbackSrc===src)return;image.dataset.fallbackSrc=src;const picture=image.parentElement;if(picture?.tagName?.toLowerCase()==='picture')picture.querySelectorAll('source').forEach(source=>{source.removeAttribute('srcset');source.removeAttribute('sizes')});if(image.getAttribute('src')!==src)image.setAttribute('src',src)};
export function ResponsivePhoto({src,alt='',width,height,sizes='100vw',loading='lazy',fetchPriority,decoding='async',className='',style,onError,objectPosition}){
 const imageRef=useRef(null);
 useEffect(()=>{if(imageRef.current)delete imageRef.current.dataset.fallbackSrc},[src]);
 const derivativesEnabled=import.meta.env.PROD||import.meta.env.VITE_ENABLE_PHOTO_DERIVATIVES==='true';
 const variants=derivativesEnabled?photoDerivativeUrls(src,width):null;
 const fallbackSrc=variants?.webp?.at(-1)?.url||src;
 const sourceSet=list=>list.map(x=>x.url+' '+x.width+'w').join(', ');
 return <picture className={className?'jyc-responsive-picture '+className:'jyc-responsive-picture'}>
  {variants&&<source type="image/avif" srcSet={sourceSet(variants.avif)} sizes={sizes}/>}
  {variants&&<source type="image/webp" srcSet={sourceSet(variants.webp)} sizes={sizes}/>}
  <img ref={imageRef} src={variants?fallbackSrc:src} alt={alt} width={width} height={height} loading={loading} fetchPriority={fetchPriority} decoding={decoding} sizes={sizes} style={objectPosition?{...style,objectPosition}:style} onError={e=>{fallback(e,src);onError?.(e)}}/>
 </picture>;
}
