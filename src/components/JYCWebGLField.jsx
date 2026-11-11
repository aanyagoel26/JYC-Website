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
  float stars = (starLayer(p + vec2(time * 0.035, -time * 0.018), 34.0, 0.72)
              + starLayer(p * 1.37 - vec2(time * 0.02, time * 0.03), 57.0, 0.42)) * uTheme;

  // Galactic plane: a soft, tilted Milky Way with a broken dark dust rift.
  // The low-frequency structure is deliberately broad so it reads as a sky,
  // not as a synthetic neon ribbon or a distracting animated wallpaper.
  vec2 galaxyP = vec2(p.x * 0.906 + p.y * 0.423, -p.x * 0.423 + p.y * 0.906);
  galaxyP += (pointer - 0.5) * vec2(0.018, 0.012);
  float galacticCurve = 0.075 * sin(galaxyP.x * 1.55 + time * 0.025);
  float galacticDistance = abs(galaxyP.y - galacticCurve);
  float galacticDust = fbm(galaxyP * 4.8 + vec2(8.4, -3.1));
  float galacticCloud = fbm(galaxyP * 1.85 + vec2(time * 0.012, -time * 0.009));
  float milkyWay = exp(-galacticDistance * galacticDistance * 7.2)
                 * smoothstep(0.34, 0.78, galacticCloud) * uTheme;
  float darkRift = exp(-pow((galaxyP.y - galacticCurve - 0.018) * 15.0, 2.0))
                 * smoothstep(0.42, 0.78, galacticDust) * milkyWay;
  float nebulaRed = smoothstep(0.58, 0.86, fbm(galaxyP * 3.2 + vec2(2.7, 8.1))) * milkyWay;
  float nebulaBlue = smoothstep(0.54, 0.82, fbm(galaxyP * 2.7 + vec2(-6.2, 4.3))) * milkyWay;
  float distantStars = starLayer(galaxyP + vec2(-time * 0.012, time * 0.008), 82.0, 0.38) * uTheme;
  float pointerDistance = length(p - pointer * 0.22);
  float ripplePhase = abs(fract(pointerDistance * 3.4 - time * 0.28) - 0.5);
  float ripple = (1.0 - smoothstep(0.018, 0.055, ripplePhase)) * exp(-pointerDistance * 1.7) * 0.12;
  float ribbons = smoothstep(0.42, 0.88, ridge + halo * 0.12) * (0.24 + 0.76 * field) * uTheme;
  vec2 moonPoint = p - vec2(0.48, 0.22);
  float moonDisc = 1.0 - smoothstep(0.105, 0.12, length(moonPoint));
  float moonShadow = 1.0 - smoothstep(0.095, 0.11, length(moonPoint - vec2(0.055, 0.025)));
  float moon = max(0.0, moonDisc - moonShadow) * uTheme;
  vec3 nightViolet = vec3(0.53,0.48,0.88);
  vec3 nightBlue = vec3(0.30,0.42,0.68);
  vec3 nightGold = vec3(0.91,0.79,0.53);
  vec3 nightColor = mix(nightViolet, nightBlue, smoothstep(0.2,0.9,field));
  nightColor = mix(nightColor, nightGold, smoothstep(0.68,0.96,aurora) * 0.58);
  float nightLine = contour * smoothstep(0.56,0.9,field) * 0.12 * uTheme;
  nightColor += nightGold * nightLine + vec3(0.78,0.82,1.0) * stars * 0.8 + nightGold * moon * 0.9;
  nightColor += vec3(0.48,0.39,0.76) * milkyWay * 0.18;
  nightColor += vec3(0.31,0.56,0.76) * nebulaBlue * 0.11;
  nightColor += vec3(0.72,0.30,0.38) * nebulaRed * 0.075;
  nightColor += vec3(0.82,0.86,1.0) * distantStars * 0.72;
  nightColor *= 1.0 - darkRift * 0.38;

  // Day identity: warm sunrise, soft cloud banks and drifting pollen-like motes.
  vec2 sunPoint = p - vec2(-0.43, 0.16);
  float sunDistance = length(sunPoint);
  float sunDisc = 1.0 - smoothstep(0.19, 0.205, sunDistance);
  float sunHalo = exp(-sunDistance * 3.4) * 0.32;
  float dayCloudNoise = fbm(p * 2.25 + vec2(time * 0.10, -time * 0.035) + vec2(field));
  float cloudBand = smoothstep(0.48, 0.76, dayCloudNoise + sin(p.y * 4.0 + p.x * 1.7) * 0.10);
  float cloudLight = cloudBand * (0.48 + 0.52 * fbm(p * 5.2 - time * 0.06));
  float dayDust = starLayer(p + vec2(time * 0.025, time * 0.018), 23.0, 0.35) * (1.0 - uTheme);
  float dayRays = pow(max(0.0, dot(normalize(sunPoint + vec2(0.0001)), normalize(vec2(sin(time * 0.12), cos(time * 0.12))))), 18.0) * exp(-sunDistance * 1.25) * (1.0 - uTheme) * 0.10;
  vec3 dayLavender = vec3(0.72,0.66,0.63);
  vec3 daySky = vec3(0.91,0.84,0.72);
  vec3 dayGold = vec3(0.91,0.68,0.35);
  vec3 dayColor = mix(dayLavender, daySky, smoothstep(-0.35,0.65,p.y));
  dayColor = mix(dayColor, vec3(0.96,0.82,0.64), sunHalo * 0.72);
  dayColor = mix(dayColor, vec3(0.97,0.91,0.79), cloudLight * 0.38);
  dayColor += dayGold * (sunDisc * 0.72 + dayRays + dayDust * 0.35);
  float dayLine = contour * smoothstep(0.56,0.9,field) * 0.035 * (1.0 - uTheme);

  // Depth plane 1: distant atmospheric haze and soft horizon falloff.
  float horizon = exp(-pow((p.y + 0.24 + sin(p.x * 0.8 + time * 0.15) * 0.035) * 3.2, 2.0));
  float aerialPerspective = smoothstep(-0.65, 0.65, p.y) * 0.16;
  vec3 dayHaze = mix(vec3(0.88,0.84,0.77), vec3(0.91,0.77,0.60), smoothstep(-0.45,0.35,p.y));
  vec3 nightHaze = mix(vec3(0.10,0.16,0.30), vec3(0.24,0.20,0.39), smoothstep(-0.5,0.45,p.y));
  dayColor = mix(dayColor, dayHaze, horizon * 0.42 + aerialPerspective * 0.18);
  nightColor = mix(nightColor, nightHaze, horizon * 0.25 + aerialPerspective * 0.12);

  // Depth plane 2: broad, low-frequency cloud banks drift independently.
  float distantCloud = fbm(p * 1.05 + vec2(-time * 0.035, time * 0.012));
  float cloudShadow = smoothstep(0.48,0.78,distantCloud + sin(p.x * 2.0 + time * 0.1) * 0.07);
  float cloudEdge = smoothstep(0.56,0.84,distantCloud);
  float dayCloudShade = cloudShadow * (1.0-cloudLight) * (1.0-uTheme) * 0.10;
  float nightNebula = smoothstep(0.53,0.82,fbm(p * 1.7 + vec2(time * 0.018, -time * 0.014))) * uTheme;
  dayColor = mix(dayColor, vec3(0.72,0.70,0.70), dayCloudShade);
  nightColor = mix(nightColor, vec3(0.30,0.25,0.48), nightNebula * 0.24);

  // Depth plane 3: nearer floating dust / firefly bokeh, intentionally sparse.
  vec2 nearP = p * 18.0 + vec2(-time * 0.11, time * 0.07);
  vec2 nearCell = floor(nearP);
  vec2 nearLocal = fract(nearP) - 0.5;
  float nearSeed = hash21(nearCell + 71.3);
  vec2 nearOffset = vec2(hash21(nearCell + 17.1), hash21(nearCell + 29.4)) * 0.68 - 0.34;
  float nearDot = 1.0 - smoothstep(0.018,0.055,length(nearLocal-nearOffset));
  float nearMotes = nearDot * step(0.982,nearSeed) * (0.65 + 0.35*sin(time*2.2+nearSeed*60.0));
  float dayMotes = nearMotes * (1.0-uTheme);
  float nightMotes = nearMotes * uTheme;

  // Separate soft optical halos add depth without a sweeping flare.
  float vignette = smoothstep(1.12,0.18,length(p * vec2(0.78,1.05)));
  float edgeAtmosphere = (1.0-vignette) * 0.12;
  vec3 color = mix(dayColor, nightColor, uTheme);
  color += mix(dayGold * dayLine, nightGold * nightLine, uTheme);
  color += mix(dayGold * dayDust * 0.4 + vec3(0.98,0.78,0.48)*dayMotes*0.55,
               nightGold * stars * 0.12 + vec3(0.62,0.72,1.0)*nightMotes*0.62, uTheme);
  color += mix(daySky, nightBlue, uTheme) * ripple;
  color = mix(color, mix(dayHaze,nightHaze,uTheme), edgeAtmosphere);
  float depthAlpha = (cloudEdge * 0.045 + dayMotes * 0.10) * (1.0-uTheme)
                   + (nightNebula * 0.045 + nightMotes * 0.12) * uTheme;
  float alpha = ((cloudLight * 0.10 + sunHalo * 0.09 + sunDisc * 0.12 + dayRays + dayLine + dayDust * 0.35) * (1.0-uTheme)
              + (ribbons * 0.20 + radial * 0.045 + nightLine + stars * 0.52 + distantStars * 0.36 + milkyWay * 0.11 + nebulaRed * 0.025 + nebulaBlue * 0.025 + moon * 0.12) * uTheme + ripple + depthAlpha) * uIntensity;
  alpha *= (1.0 - smoothstep(0.18,0.98,length(p) * 0.52));
  alpha += halo * 0.035 * uIntensity;
  fragColor = vec4(color, clamp(alpha, 0.0, 0.38));
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
    const cores = navigator.hardwareConcurrency || 8;
    const memory = navigator.deviceMemory || 8;
    const lowPower = Boolean(navigator.connection?.saveData) || cores <= 4 || memory < 4 || document.documentElement.dataset.performance === 'lite';
    const reducedQuality = cores <= 8 || memory < 8;
    if (lowPower || coarse) { host.dataset.webgl = 'fallback'; return; }
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const canvas = document.createElement('canvas');
    canvas.className = 'jyc-webgl-field-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
    const fallback = () => { host.dataset.webgl = 'fallback'; canvas.remove(); };
    const onContextLost = event => { event.preventDefault(); disposed = true; stop(); fallback(); };
    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width)); height = Math.max(1, Math.round(rect.height));
      if (renderer) { renderer.setSize(width, height); program.uniforms.uResolution.value = [width, height]; }
      if (reduced && visible) draw(performance.now());
    };
    const draw = timestamp => {
      if (disposed || !visible || !renderer || !program || !mesh) { frame = 0; return; }
      const interval = reducedQuality ? 1000 / 20 : 1000 / 24;
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
    canvas.addEventListener('webglcontextlost', onContextLost, { passive: false });
    try {
      renderer = new Renderer({ canvas, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, reducedQuality || coarse ? 1.0 : 1.2), webgl: 2 });
      renderer.setSize(width, height);
      const gl = renderer.gl;
      program = new Program(gl, {
        vertex, fragment, transparent: true, depthTest: false, depthWrite: false,
        uniforms: {
          uResolution: { value: [width, height] }, uPointer: { value: [0.5, 0.5] },
          uTime: { value: 0 }, uTheme: { value: document.documentElement.dataset.theme === 'light' ? 0 : 1 },
          uIntensity: { value: reducedQuality ? 0.78 : 1.0 }
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
      canvas.removeEventListener('webglcontextlost', onContextLost);
      document.removeEventListener('visibilitychange', onVisibility);
      if (!coarse) host.removeEventListener('pointermove', onPointer);
      program?.remove(); mesh?.geometry?.remove();
      try { renderer?.gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch {}
      canvas.remove();
    };
  }, []);
  return <div ref={hostRef} className="jyc-webgl-field" data-webgl="loading" aria-hidden="true"><span className="jyc-webgl-field-fallback" /></div>;
}
