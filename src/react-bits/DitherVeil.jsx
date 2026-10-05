'use client';
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import './DitherVeil.css';

const VERTEX = ['#version 300 es','in vec2 position;','in vec2 uv;','out vec2 vUv;','void main(){vUv=uv;gl_Position=vec4(position,0.0,1.0);}'].join('\n');
const FRAGMENT = ['#version 300 es','precision highp float;','in vec2 vUv; out vec4 fragColor;','uniform sampler2D tImage; uniform vec2 uResolution; uniform vec2 uCover; uniform float uCell;','uniform vec3 uInk; uniform vec3 uPaper; uniform float uContrast; uniform float uBrightness;','uniform vec2 uPointer; uniform float uRadius; uniform float uSoftness; uniform float uReveal; uniform float uClick; uniform float uIntro;','float bayer(vec2 p){ivec2 q=ivec2(mod(floor(p),8.0));int v=q.x^q.y;int m=((v&1)<<5)|((q.y&1)<<4)|((v&2)<<2)|((q.y&2)<<1)|((v&4)>>1)|((q.y&4)>>2);return(float(m)+0.5)/64.0;}','vec2 imageUv(vec2 uv){return(uv-0.5)*uCover+0.5;}','void main(){','vec2 px=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y);vec2 cell=floor(px/uCell);vec2 cuv=(cell+0.5)*uCell/uResolution;','vec2 suv=imageUv(cuv);vec3 raw=texture(tImage,suv).rgb;float inside=step(0.0,suv.x)*step(suv.x,1.0)*step(0.0,suv.y)*step(suv.y,1.0);','float lum=dot(raw,vec3(.2126,.7152,.0722));lum=pow(clamp((lum-.5)*uContrast+.5+uBrightness,0.,1.),1.6);','float dither=step(bayer(cell),lum);vec3 ink=mix(uInk,uPaper,dither);','vec2 p=vec2(cuv.x,1.0-cuv.y)*uResolution;float d=distance(p,uPointer);float reveal=1.0-smoothstep(uRadius,uRadius*max(.01,uSoftness),d);','float burst=max(0.,1.-abs(d-uRadius)/(max(uRadius*.8,1.)));reveal=max(reveal,burst*uClick);','vec3 color=mix(ink,raw,reveal*uReveal);color=mix(uInk,color,step(.999,uIntro));fragColor=vec4(mix(uInk,color,inside),1.);','}'].join('\n');

const hexToRgb=(hex)=>{let h=String(hex||'').replace('#','');if(h.length===3)h=h.replace(/./g,c=>c+c);const n=parseInt(h.slice(0,6),16);return Number.isFinite(n)?[((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255]:[0,0,0]};
const fitScale=(w,h,iw,ih,contain)=>{const ratio=w/h/(iw/ih);if(contain)return ratio>1?[ratio,1]:[1,1/ratio];return ratio>1?[1,1/ratio]:[ratio,1]};

export default function DitherVeil({src,fit='contain',pattern='floyd',pixelSize=2,levels=2,inkColor='#101a2d',paperColor='#f4f1e6',contrast=1.15,brightness=0,revealRadius=200,softness=.6,linger=1,rimColor='#c7a56d',rim=0,reverse=false,wander=false,clickBurst=true,className='',style}){
const ref=useRef(null);const settings=useRef({});
useEffect(()=>{settings.current={fit,pattern,pixelSize,levels,inkColor,paperColor,contrast,brightness,revealRadius,softness,linger,rimColor,rim,reverse,wander,clickBurst}},[fit,pattern,pixelSize,levels,inkColor,paperColor,contrast,brightness,revealRadius,softness,linger,rimColor,rim,reverse,wander,clickBurst]);
useEffect(()=>{
const el=ref.current;if(!el)return;const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const renderer=new Renderer({dpr:Math.min(window.devicePixelRatio||1,2),alpha:false,antialias:false});const gl=renderer.gl;const canvas=gl.canvas;canvas.style.cssText='display:block;width:100%;height:100%';el.appendChild(canvas);
const geometry=new Triangle(gl);const texture=new Texture(gl,{minFilter:gl.LINEAR,magFilter:gl.LINEAR});
const uniforms={tImage:{value:texture},uResolution:{value:[1,1]},uCover:{value:[1,1]},uCell:{value:2},uInk:{value:[0,0,0]},uPaper:{value:[1,1,1]},uContrast:{value:1.15},uBrightness:{value:0},uPointer:{value:[0,0]},uRadius:{value:200},uSoftness:{value:.6},uReveal:{value:1},uClick:{value:0},uIntro:{value:0}};
const program=new Program(gl,{vertex:VERTEX,fragment:FRAGMENT,uniforms,depthTest:false,depthWrite:false});const mesh=new Mesh(gl,{geometry,program});
let image=null,raf=0,last=performance.now(),intro=0,click=0,visible=true,width=1,height=1;const pointer={x:0,y:0,inside:false};
const resize=()=>{width=Math.max(1,el.clientWidth);height=Math.max(1,el.clientHeight);renderer.setSize(width,height);uniforms.uResolution.value=[canvas.width,canvas.height];if(image)uniforms.uCover.value=fitScale(canvas.width,canvas.height,image.naturalWidth,image.naturalHeight,settings.current.fit==='contain');if(!pointer.inside){pointer.x=width/2;pointer.y=height/2}};
const frame=(now)=>{raf=0;const s=settings.current;const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;intro=Math.min(1,intro+dt/1.1);click=Math.max(0,click-dt/1.2);uniforms.uCell.value=Math.max(1,Math.round(s.pixelSize*(renderer.dpr||1)));uniforms.uInk.value=hexToRgb(s.inkColor);uniforms.uPaper.value=hexToRgb(s.paperColor);uniforms.uContrast.value=s.contrast;uniforms.uBrightness.value=s.brightness;uniforms.uRadius.value=s.revealRadius;uniforms.uSoftness.value=Math.max(.01,s.softness);uniforms.uReveal.value=s.reverse?0:1;uniforms.uPointer.value=[pointer.x,height-pointer.y];uniforms.uClick.value=click?1:0;uniforms.uIntro.value=1-Math.pow(1-intro,2);renderer.render({scene:mesh});const moving=pointer.inside||click>0||intro<1;if(visible&&(moving||!reduced))raf=requestAnimationFrame(frame)};
const wake=()=>{if(!raf&&visible){last=performance.now();raf=requestAnimationFrame(frame)}};
const img=new Image();img.crossOrigin='anonymous';img.decoding='async';img.onload=()=>{image=img;texture.image=img;resize();wake()};img.src=src;
const move=e=>{const r=el.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;pointer.inside=true;wake()};const leave=()=>{pointer.inside=false;wake()};const down=e=>{move(e);if(settings.current.clickBurst)click=1};
el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerenter',move,{passive:true});el.addEventListener('pointerleave',leave,{passive:true});el.addEventListener('pointerdown',down,{passive:true});
const ro=new ResizeObserver(()=>{resize();wake()});ro.observe(el);const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake()});io.observe(el);resize();wake();
return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerenter',move);el.removeEventListener('pointerleave',leave);el.removeEventListener('pointerdown',down);gl.getExtension('WEBGL_lose_context')?.loseContext();canvas.remove()};
},[src]);
return <div ref={ref} className={['dither-veil',className].filter(Boolean).join(' ')} style={style} aria-hidden='true'/>;
}
