import React,{useEffect,useLayoutEffect,useState} from 'react';
import {photoDerivativeUrls} from './jyc-photo-intelligence.js';
import {loadJycImageManifest} from './jyc-image-manifest.js';
const LOGO_FALLBACK=import.meta.env.PROD?'/assets/jyc-logo.webp':'/JYC%20Logo(4).png';
const ORIGINAL_LOGO='/JYC%20Logo(4).png';
const isDerivativeSource=url=>/^\/assets\/(?:source-archive|hub-photos|hub-photos-extra|events|home|team)\//.test(String(url||''));
export function ResponsivePhoto({src,alt='',width,height,sizes='100vw',loading='lazy',fetchPriority,decoding='async',className='',style,onError,objectPosition,fallbackSrc=LOGO_FALLBACK,fallbackAlt='Official JYC logo placeholder; image unavailable'}){
 // An empty src makes browsers request the current document as an image. Normalize it to a branded local asset before any state, manifest lookup or <img> is created.
 const source=typeof src==='string'&&src.trim()?src.trim():(fallbackSrc||LOGO_FALLBACK);
 const [sourceDimensions,setSourceDimensions]=useState(()=>({src:source,width:0,derivativesEligible:false}));
 const [fallbackState,setFallbackState]=useState(()=>({src:source,fallbackSrc,stage:0}));
 const intrinsicWidth=sourceDimensions.src===source&&sourceDimensions.derivativesEligible?sourceDimensions.width:0;
 const derivativesEnabled=import.meta.env.PROD||import.meta.env.VITE_ENABLE_PHOTO_DERIVATIVES==='true';
 const stage=fallbackState.src===source&&fallbackState.fallbackSrc===fallbackSrc?fallbackState.stage:0;
 const candidates=[fallbackSrc,LOGO_FALLBACK,ORIGINAL_LOGO].filter((url,index,all)=>Boolean(url)&&url!==source&&all.indexOf(url)===index);
 const failed=stage>candidates.length;
 const activeFallback=stage>0&&!failed;
 // Only emit srcset candidates after the generated manifest confirms intrinsic dimensions and derivative eligibility.
 // If the manifest is unavailable, keep the original source rather than guessing derivative URLs that may 404 or upscale.
 const variants=stage===0&&derivativesEnabled&&intrinsicWidth>0?photoDerivativeUrls(source,intrinsicWidth):null;
 // Keep the original source in the img element as the final format-compatibility fallback;
 // supported browsers select the optimized AVIF/WebP sources above it.
 const resolvedSrc=stage===0?source:activeFallback?candidates[stage-1]:undefined;
 useEffect(()=>{
  let active=true;
  if(!derivativesEnabled||!isDerivativeSource(source))return()=>{active=false};
  loadJycImageManifest().then(manifest=>{
   const entry=manifest?.images?.[source];
   const measured=Number(entry?.width);
   if(active&&entry?.derivativesEligible===true&&measured>0)setSourceDimensions({src:source,width:measured,derivativesEligible:true});
  });
  return()=>{active=false};
 },[source,derivativesEnabled]);
 useLayoutEffect(()=>{setFallbackState(previous=>previous.src===source&&previous.fallbackSrc===fallbackSrc?previous:{src:source,fallbackSrc,stage:0})},[source,fallbackSrc]);
 const baseStyle=objectPosition?{...style,objectPosition}:style;
 const sourceSet=list=>list.map(x=>x.url+' '+x.width+'w').join(', ');
 const handleError=e=>{
  setFallbackState(previous=>{
   const currentStage=previous.src===source&&previous.fallbackSrc===fallbackSrc?previous.stage:0;
   return {src:source,fallbackSrc,stage:currentStage+1};
  });
  onError?.(e);
 };
 return <picture className={className?'jyc-responsive-picture '+className:'jyc-responsive-picture'}>
  {variants&&<source type="image/avif" srcSet={sourceSet(variants.avif)} sizes={sizes}/>}
  {variants&&<source type="image/webp" srcSet={sourceSet(variants.webp)} sizes={sizes}/>}
  <img src={resolvedSrc} alt={activeFallback?fallbackAlt:alt} width={width} height={height} loading={loading} fetchPriority={fetchPriority} decoding={decoding} sizes={sizes} data-image-fallback-stage={failed?'failed':activeFallback?String(stage):undefined} style={failed?{...baseStyle,visibility:'hidden'}:baseStyle} onError={handleError}/>
 </picture>;
}
