import React,{useEffect,useRef} from 'react';

function makeShader(gl,type,source){
 const shader=gl.createShader(type);
 if(!shader)return null;
 gl.shaderSource(shader,source);gl.compileShader(shader);
 if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}
 return shader;
}
function makeProgram(gl){
 const vertex=makeShader(gl,gl.VERTEX_SHADER,`
  attribute vec2 a_position;
  attribute float a_size;
  attribute float a_alpha;
  uniform vec2 u_resolution;
  varying float v_alpha;
  void main(){
   vec2 zeroToOne=a_position/u_resolution;
   vec2 clip=zeroToOne*2.0-1.0;
   gl_Position=vec4(clip*vec2(1.0,-1.0),0.0,1.0);
   gl_PointSize=a_size;
   v_alpha=a_alpha;
  }`);
 const fragment=makeShader(gl,gl.FRAGMENT_SHADER,`
  precision mediump float;
  varying float v_alpha;
  void main(){
   vec2 p=gl_PointCoord-0.5;
   float d=length(p);
   float soft=1.0-smoothstep(0.05,0.5,d);
   gl_FragColor=vec4(0.75,0.61,0.43,v_alpha*soft);
  }`);
 if(!vertex||!fragment)return null;
 const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);return null;}
 return program;
}
export function JYCWebGLIdentity(){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const coarse=window.matchMedia?.('(hover: none), (pointer: coarse)');
  const saveData=navigator.connection?.saveData;
  if(reduced?.matches||coarse?.matches||saveData)return;
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});
  if(!gl)return;
  const program=makeProgram(gl);if(!program)return;
  const positionBuffer=gl.createBuffer(),sizeBuffer=gl.createBuffer(),alphaBuffer=gl.createBuffer();
  if(!positionBuffer||!sizeBuffer||!alphaBuffer)return;
  const positionLoc=gl.getAttribLocation(program,'a_position');
  const sizeLoc=gl.getAttribLocation(program,'a_size');
  const alphaLoc=gl.getAttribLocation(program,'a_alpha');
  const resolutionLoc=gl.getUniformLocation(program,'u_resolution');
  const count=56;
  const points=Array.from({length:count},(_,i)=>{
   const a=(i/count)*Math.PI*2+(i%5)*0.17;
   const radius=58+(i%7)*18+(i%3)*9;
   return {x:0,y:0,baseX:Math.cos(a)*radius,baseY:Math.sin(a)*radius*.72,phase:i*0.37,size:1.5+(i%3)*.65,alpha:.16+(i%5)*.035};
  });
  let width=1,height=1,raf=0,visible=true,last=0;
  const resize=()=>{
   const dpr=Math.min(window.devicePixelRatio||1,1.5);
   const rect=canvas.getBoundingClientRect();width=Math.max(1,Math.round(rect.width*dpr));height=Math.max(1,Math.round(rect.height*dpr));
   canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);
  };
  const draw=(now)=>{
   if(!visible){raf=0;return;}
   const t=now*.00025;
   gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
   gl.uniform2f(resolutionLoc,width,height);
   const cx=width/2,cy=height/2;const scale=Math.min(width,height)/420;
   const pos=new Float32Array(count*2),sizes=new Float32Array(count),alphas=new Float32Array(count);
   points.forEach((p,i)=>{
    const drift=Math.sin(t+p.phase)*5;
    pos[i*2]=cx+(p.baseX+drift)*scale;
    pos[i*2+1]=cy+(p.baseY+Math.cos(t*.9+p.phase)*4)*scale;
    sizes[i]=p.size*(window.devicePixelRatio||1);
    alphas[i]=p.alpha*(.72+.28*Math.sin(t*1.4+p.phase));
   });
   gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,pos,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(positionLoc);gl.vertexAttribPointer(positionLoc,2,gl.FLOAT,false,0,0);
   gl.bindBuffer(gl.ARRAY_BUFFER,sizeBuffer);gl.bufferData(gl.ARRAY_BUFFER,sizes,gl.STATIC_DRAW);gl.enableVertexAttribArray(sizeLoc);gl.vertexAttribPointer(sizeLoc,1,gl.FLOAT,false,0,0);
   gl.bindBuffer(gl.ARRAY_BUFFER,alphaBuffer);gl.bufferData(gl.ARRAY_BUFFER,alphas,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(alphaLoc);gl.vertexAttribPointer(alphaLoc,1,gl.FLOAT,false,0,0);
   gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.drawArrays(gl.POINTS,0,count);
   last=now;raf=requestAnimationFrame(draw);
  };
  const onVisibility=()=>{visible=document.visibilityState==='visible';if(visible&&!raf)raf=requestAnimationFrame(draw);};
  resize();window.addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',onVisibility);
  raf=requestAnimationFrame(draw);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',onVisibility);gl.deleteBuffer(positionBuffer);gl.deleteBuffer(sizeBuffer);gl.deleteBuffer(alphaBuffer);gl.deleteProgram(program);};
 },[]);
 return <canvas ref={ref} className="jyc-webgl-identity" aria-hidden="true"/>;
}
