import React, { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uTheme;
uniform float uIntensity;
in vec2 vUv;
out vec4 fragColor;
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0,0.0)), f.x),
             mix(hash21(i + vec2(0.0,1.0)), hash21(i + vec2(1.0,1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float value = 0.0, amplitude = 0.5;
  mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i=0; i<5; i++) { value += amplitude * noise(p); p = turn * p * 2.03 + 17.1; amplitude *= 0.5; }
  return value;
}
float starLayer(vec2 p, float scale, float drift) {
  vec2 grid = p * scale;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float seed = hash21(cell);
  vec2 offset = vec2(hash21(cell + 3.7), hash21(cell + 9.2)) * 0.72 - 0.36;
  float distanceToStar = length(local - offset);
  float star = (1.0 - smoothstep(0.012, 0.045, distanceToStar)) * step(0.965, seed);
  float twinkle = 0.58 + 0.42 * sin(uTime * (1.1 + seed * 2.4) + seed * 45.0);
  return star * twinkle * drift;
}
void main() {
  vec2 p = (vUv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 pointer = (uPointer - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  float time = uTime * 0.075;
  float field = fbm(p * 2.15 + vec2(time, -time * 0.7));
  vec2 warp = vec2(fbm(p * 1.45 + field + time), fbm(p * 1.7 - field - time * 0.8));
  float aurora = fbm(p * 2.8 + warp * 1.15 + vec2(0.0, time * 1.8));
  float ridge = 1.0 - abs(aurora * 2.0 - 1.0);
  float contour = 1.0 - smoothstep(0.0, 0.035, abs(fract(aurora * 12.0) - 0.5));
  float halo = exp(-length(p - pointer * 0.22) * 2.5);
  float radial = exp(-length(p) * 2.3);
  float stars = starLayer(p + vec2(time * 0.035, -time * 0.018), 34.0, 0.72)
              + starLayer(p * 1.37 - vec2(time * 0.02, time * 0.03), 57.0, 0.42);
  float pointerDistance = length(p - pointer * 0.22);
  float ripplePhase = abs(fract(pointerDistance * 3.4 - time * 0.28) - 0.5);
  float ripple = (1.0 - smoothstep(0.018, 0.055, ripplePhase)) * exp(-pointerDistance * 1.7) * 0.12;
  float ribbons = smoothstep(0.42, 0.88, ridge + halo * 0.12) * (0.24 + 0.76 * field);
  vec3 violet = uTheme > 0.5 ? vec3(0.53,0.48,0.88) : vec3(0.34,0.29,0.55);
  vec3 blue = uTheme > 0.5 ? vec3(0.30,0.42,0.68) : vec3(0.47,0.48,0.66);
  vec3 gold = uTheme > 0.5 ? vec3(0.91,0.79,0.53) : vec3(0.61,0.45,0.22);
  vec3 color = mix(violet, blue, smoothstep(0.2,0.9,field));
  color = mix(color, gold, smoothstep(0.68,0.96,aurora) * 0.58);
  float line = contour * smoothstep(0.56,0.9,field) * 0.12;
  color += gold * line;
  color += mix(blue, gold, 0.62) * ripple;
  color += vec3(0.78, 0.82, 1.0) * stars * 0.8;
  float alpha = (ribbons * 0.20 + radial * 0.045 + line + ripple + stars * 0.52) * uIntensity;
  alpha *= (1.0 - smoothstep(0.18,0.98,length(p) * 0.52));
  alpha += halo * 0.035 * uIntensity;
  fragColor = vec4(color, clamp(alpha, 0.0, 0.34));
}`;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export function JYCWebGLField() {
  const hostRef = useRef(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof window === 'undefined') return;
    let renderer, program, mesh, frame = 0, visible = false, disposed = false;
    let width = 1, height = 1, time = 0, lastFrame = 0;
    let reduced = prefersReducedMotion();
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const lowPower = Boolean(navigator.connection?.saveData) || (navigator.hardwareConcurrency || 8) <= 4;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const canvas = document.createElement('canvas');
    canvas.className = 'jyc-webgl-field-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
    const fallback = () => { host.dataset.webgl = 'fallback'; canvas.remove(); };
    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width)); height = Math.max(1, Math.round(rect.height));
      if (renderer) { renderer.setSize(width, height); program.uniforms.uResolution.value = [width, height]; }
      if (reduced && visible) draw(performance.now());
    };
    const draw = timestamp => {
      if (disposed || !visible || !renderer || !program || !mesh) { frame = 0; return; }
      const interval = lowPower || coarse ? 1000 / 24 : 1000 / 30;
      if (!reduced && timestamp - lastFrame < interval) { frame = requestAnimationFrame(draw); return; }
      lastFrame = timestamp;
      if (!reduced) time += interval / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.055; pointer.y += (pointer.ty - pointer.y) * 0.055;
      program.uniforms.uTime.value = time;
      program.uniforms.uPointer.value = [pointer.x, 1.0 - pointer.y];
      program.uniforms.uTheme.value = document.documentElement.dataset.theme === 'light' ? 0.0 : 1.0;
      renderer.render({ scene: mesh });
      frame = reduced ? 0 : requestAnimationFrame(draw);
    };
    const start = () => { if (visible && !reduced && !frame) frame = requestAnimationFrame(draw); };
    const onPointer = event => {
      const rect = host.getBoundingClientRect();
      pointer.tx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      pointer.ty = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    };
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => {
      reduced = motion.matches;
      if (reduced) stop();
      if (visible) { if (reduced) draw(performance.now()); else start(); }
    };
    try {
      renderer = new Renderer({ canvas, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, lowPower || coarse ? 1 : 1.35), webgl: 2 });
      renderer.setSize(width, height);
      const gl = renderer.gl;
      program = new Program(gl, {
        vertex, fragment, transparent: true, depthTest: false, depthWrite: false,
        uniforms: {
          uResolution: { value: [width, height] }, uPointer: { value: [0.5, 0.5] },
          uTime: { value: 0 }, uTheme: { value: document.documentElement.dataset.theme === 'light' ? 0 : 1 },
          uIntensity: { value: lowPower ? 0.72 : 1.0 }
        }
      });
      mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
      host.dataset.webgl = 'ready';
      resize();
    } catch {
      fallback();
      return () => { disposed = true; stop(); canvas.remove(); };
    }
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      visible = Boolean(entries[0]?.isIntersecting) && !document.hidden;
      if (visible) { resize(); if (reduced) draw(performance.now()); else start(); } else stop();
    }, { rootMargin: '120px 0px', threshold: 0 }) : null;
    observer?.observe(host);
    if (!observer) { visible = true; resize(); if (reduced) draw(performance.now()); else start(); }
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(host);
    if (!coarse) host.addEventListener('pointermove', onPointer, { passive: true });
    motion.addEventListener?.('change', onMotion);
    const onVisibility = () => {
      visible = !document.hidden && host.getBoundingClientRect().bottom > -120 && host.getBoundingClientRect().top < innerHeight + 120;
      if (visible) { if (reduced) draw(performance.now()); else start(); } else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    return () => {
      disposed = true; stop(); observer?.disconnect(); resizeObserver?.disconnect();
      motion.removeEventListener?.('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
      if (!coarse) host.removeEventListener('pointermove', onPointer);
      program?.remove(); mesh?.geometry?.remove();
      try { renderer?.gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch {}
      canvas.remove();
    };
  }, []);
  return <div ref={hostRef} className="jyc-webgl-field" data-webgl="loading" aria-hidden="true"><span className="jyc-webgl-field-fallback" /></div>;
}
