import React, { useEffect, useRef, useState } from 'react';
import './JYCHeroWebGLEmblem.css';
import { jycAudio } from '../lib/jyc-audio.js';

const LOGO_SRC = '/assets/jyc-logo.avif';
const LOGO_FALLBACK = '/assets/jyc-logo.webp';
const LOGO_ORIGINAL = '/JYC%20Logo(4).png';
const MODEL_URL = '/models/jyc-spatial.glb';
const MODEL_VIEWER_CDN = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.4.0/model-viewer.min.js';

export function JYCHeroWebGLEmblem() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mode3D, setMode3D] = useState('hologram'); // 'hologram' | 'spatial'
  const [modelViewerReady, setModelViewerReady] = useState(() => typeof window !== 'undefined' && !!window.customElements?.get('model-viewer'));
  const [modelViewerError, setModelViewerError] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    if (mode3D !== 'spatial') return;
    if (typeof window === 'undefined' || !window.customElements) {
      setModelViewerError(true);
      return;
    }
    if (window.customElements.get('model-viewer')) {
      setModelViewerReady(true);
      setModelViewerError(false);
      return;
    }
    setModelViewerReady(false);
    setModelViewerError(false);
    let active = true;
    let script = document.querySelector('script[data-jyc-model-viewer]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'module';
      script.src = MODEL_VIEWER_CDN;
      script.dataset.jycModelViewer = 'true';
    }
    const handleError = () => {
      if (!active) return;
      setModelViewerError(true);
      script.remove();
    };
    script.addEventListener('error', handleError, { once: true });
    const timeout = window.setTimeout(() => {
      if (active && !window.customElements.get('model-viewer')) setModelViewerError(true);
    }, 15000);
    window.customElements.whenDefined('model-viewer').then(() => {
      if (active) {
        setModelViewerReady(true);
        setModelViewerError(false);
      }
    });
    if (!script.isConnected) document.head.appendChild(script);
    return () => {
      active = false;
      window.clearTimeout(timeout);
      script.removeEventListener('error', handleError);
      if (!window.customElements.get('model-viewer') && script.dataset.jycModelViewer === 'true') script.remove();
    };
  }, [mode3D]);



  const toggleSound = e => {
    e.stopPropagation();
    const active = jycAudio.toggle();
    setIsAudioActive(active);
  };

  // Canvas-rendered 3D-style gyroscopic rings; optional spatial mode uses the GLB WebGL viewer.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let renderDpr = 1;
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const saveData = Boolean(navigator.connection?.saveData);
    const targetFrameMs = isMobile ? 1000 / 24 : 1000 / 30;
    let lastFrameAt = -Infinity;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderDpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      width = canvas.width = Math.round(rect.width * renderDpr);
      height = canvas.height = Math.round(rect.height * renderDpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Orbital particles & shooting satellites
    const particleCount = isMobile ? 12 : saveData ? 24 : 40;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      distance: 105 + (i % 8) * 16,
      speed: (0.004 + (i % 5) * 0.002) * (i % 2 === 0 ? 1 : -1),
      size: 1.2 + (i % 3) * 0.9,
      alpha: 0.22 + (i % 6) * 0.09,
      tiltAxis: (i % 3) * 0.35
    }));

    // Mouse movement inertia
    const handleMove = e => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetPointerX = nx * 40;
      targetPointerY = ny * 40;
    };
    if (!isMobile) window.addEventListener('mousemove', handleMove, { passive: true });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let isVisible = !document.hidden;

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && !reducedMotion && !animId) animId = requestAnimationFrame(draw);
    };
    const handleMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        cancelAnimationFrame(animId);
        animId = 0;
      } else if (isVisible && !animId) {
        animId = requestAnimationFrame(draw);
      }
    };
    motionQuery.addEventListener('change', handleMotionPreference);
    document.addEventListener('visibilitychange', handleVisibility);

    const draw = (timestamp = 0) => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      if (timestamp - lastFrameAt < targetFrameMs) { animId = requestAnimationFrame(draw); return; }
      lastFrameAt = timestamp;
      time += targetFrameMs / 1000;
      pointerX += (targetPointerX - pointerX) * 0.08;
      pointerY += (targetPointerY - pointerY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const dpr = renderDpr;
      const cx = width / 2 + pointerX * dpr;
      const cy = height / 2 + pointerY * dpr;
      const baseRadius = Math.min(width, height) * 0.38;

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const primaryStroke = isDark ? 'rgba(200, 188, 255, ' : 'rgba(98, 88, 137, ';
      const secondaryStroke = isDark ? 'rgba(231, 209, 155, ' : 'rgba(140, 109, 54, ';
      const tertiaryStroke = isDark ? 'rgba(151, 169, 221, ' : 'rgba(145, 133, 183, ';

      // 1. Ambient Central Coronas
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.15, cx, cy, baseRadius * 1.6);
      if (isDark) {
        glowGrad.addColorStop(0, 'rgba(200, 188, 255, 0.22)');
        glowGrad.addColorStop(0.35, 'rgba(151, 169, 221, 0.12)');
        glowGrad.addColorStop(0.7, 'rgba(231, 209, 155, 0.07)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(172, 156, 207, 0.22)');
        glowGrad.addColorStop(0.4, 'rgba(222, 188, 122, 0.13)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. 3D Concentric Gyroscopic Rings
      ctx.save();
      ctx.translate(cx, cy);

      // Ring A - Outer telemetry coordinate track
      ctx.strokeStyle = primaryStroke + '0.28)';
      ctx.lineWidth = 1.2 * dpr;
      ctx.setLineDash([6 * dpr, 8 * dpr]);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.32, baseRadius * 1.32 * 0.86, time * 0.18, 0, Math.PI * 2);
      ctx.stroke();

      // Ring B - Middle counter-rotating neon laser track
      ctx.strokeStyle = secondaryStroke + '0.42)';
      ctx.lineWidth = 1.4 * dpr;
      ctx.setLineDash([14 * dpr, 20 * dpr]);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.18, baseRadius * 1.18 * 0.90, -time * 0.28, 0, Math.PI * 2);
      ctx.stroke();

      // Ring C - Third tilted gyroscopic orbit
      ctx.strokeStyle = tertiaryStroke + '0.35)';
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([4 * dpr, 10 * dpr]);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.05, baseRadius * 1.05 * 0.78, time * 0.32 + Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      // Inner crisp solid gold rim
      ctx.strokeStyle = primaryStroke + '0.65)';
      ctx.lineWidth = 1.6 * dpr;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.96, 0, Math.PI * 2);
      ctx.stroke();

      // Degree radial tick marks
      const ticks = 24;
      for (let i = 0; i < ticks; i++) {
        const a = (i / ticks) * Math.PI * 2 + time * 0.08;
        const r1 = baseRadius * 0.97;
        const r2 = baseRadius * (i % 6 === 0 ? 1.08 : i % 2 === 0 ? 1.04 : 1.01);
        ctx.strokeStyle = i % 6 === 0 ? (isDark ? '#e7d19b' : '#8c6d36') : (primaryStroke + '0.45)');
        ctx.lineWidth = (i % 6 === 0 ? 1.8 : 1) * dpr;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.stroke();
      }

      ctx.restore();

      // 3. Stardust particles orbiting the emblem
      const particleColors = isDark ? ['#c8bcff', '#e7d19b', '#aeb8e4'] : ['#625889', '#8c6d36', '#b59a64'];
      particles.forEach((p, index) => {
        p.angle += p.speed;
        const scale = dpr * (baseRadius / 155);
        const px = cx + Math.cos(p.angle) * p.distance * scale;
        const py = cy + Math.sin(p.angle) * p.distance * scale * 0.85;
        const pulse = 0.65 + Math.sin(time * 2.2 + p.angle * 3) * 0.35;

        ctx.fillStyle = particleColors[index % particleColors.length];
        ctx.globalAlpha = p.alpha * pulse;
        ctx.beginPath();
        ctx.arc(px, py, p.size * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animId = reducedMotion ? 0 : requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (!isMobile) window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  // 3D Tilt calculation
  const handlePointerMove = e => {
    if (!containerRef.current || !window.matchMedia?.('(hover:hover) and (pointer:fine)').matches || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -y * 22, // Pitch
      y: x * 26   // Yaw
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={`jyc-hero-emblem-stage ${isHovered ? 'is-hovered' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        if (!window.matchMedia?.('(hover:hover) and (pointer:fine)').matches || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
        setIsHovered(true);
        jycAudio.playNodeHover();
      }}
      onPointerLeave={handlePointerLeave}
      aria-label="JYC animated emblem with optional interactive 3D model"
    >
      {/* Canvas orbital system; the optional spatial mode uses the GLB WebGL viewer. */}
      <canvas ref={canvasRef} className="jyc-emblem-canvas" aria-hidden="true" />

      {/* 3D Perspective Tilt Card */}
      <div
        className="jyc-emblem-card-3d"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`
        }}
      >
        {/* Specular Hologram Light Flare */}
        <div className="jyc-emblem-light-sweep" aria-hidden="true" />

        {/* Central Display: Holographic Crest or Spatial 3D Model */}
        {mode3D === 'spatial' ? (
          <div className="jyc-emblem-model-viewer-wrap" style={{ transform: 'translateZ(28px)' }}>
            {modelViewerReady && !modelViewerError ? (
              <model-viewer
                src={MODEL_URL}
                poster="/assets/jyc-logo.avif"
                camera-orbit="0deg 75deg auto"
                auto-rotate
                rotation-per-second="18deg"
                interaction-prompt="none"
                camera-controls
                touch-action="pan-y"
                shadow-intensity="0.6"
                exposure="1.2"
                loading="lazy"
                reveal="auto"
                className="jyc-hero-model-viewer"
                alt="Interactive 3D JYC spatial emblem"
                aria-label="Interactive 3D JYC spatial emblem. Drag to rotate."
                onError={() => setModelViewerError(true)}
              />
            ) : (
              <div className="jyc-emblem-model-viewer-state" role="status">
                {modelViewerError ? (
                  <>
                    <span>The 3D preview is unavailable right now.</span>
                    <a href={MODEL_URL} download>Download the spatial model</a>
                  </>
                ) : <span>Loading the JYC spatial model…</span>}
              </div>
            )}
          </div>
        ) : (
          <div className="jyc-emblem-seal-container">
            <div className="jyc-emblem-glow-backing" aria-hidden="true" />
            {logoFailed ? <span className="jyc-emblem-logo-fallback" role="img" aria-label="JIIT Youth Club logo">JYC</span> : <img
              src={LOGO_SRC}
              alt="JIIT Youth Club Crest"
              className="jyc-emblem-logo-img"
              width="480"
              height="480"
              loading="eager"
              decoding="async"
              onError={e => {
                const image = e.currentTarget;
                const stage = Number(image.dataset.logoFallbackStage || 0);
                const candidates = [LOGO_FALLBACK, LOGO_ORIGINAL];
                if (stage < candidates.length) {
                  image.dataset.logoFallbackStage = String(stage + 1);
                  image.src = candidates[stage];
                } else {
                  setLogoFailed(true);
                }
              }}
            />}
          </div>
        )}

        {/* Floating Telemetry Satellite Badges */}
        <div className="jyc-emblem-badge badge-top-left" style={{ transform: `translateZ(34px)` }}>
          <span className="badge-dot" />
          <span className="badge-text">JIIT 128 · SECTOR 128 NOIDA</span>
        </div>

        <div className="jyc-emblem-badge badge-top-right" style={{ transform: `translateZ(38px)` }}>
          <span className="badge-accent">EST. 2004</span>
          <span className="badge-text">STUDENT COMMUNITY</span>
        </div>

        <div className="jyc-emblem-badge badge-bottom" style={{ transform: `translateZ(44px)` }}>
          <span className="badge-icon" aria-hidden="true">🦅</span>
          <span className="badge-text">READY TO SOAR · OFFICIAL MARK</span>
          <span className="badge-live-pulse" />
        </div>
      </div>

      {/* Floating Controls Bar: 3D Mode Toggle & Ambient Cosmic Audio */}
      <div className="jyc-emblem-controls-bar">
        <button
          type="button"
          className={`emblem-control-pill ${mode3D === 'spatial' ? 'active' : ''}`}
          onClick={() => setMode3D(m => m === 'hologram' ? 'spatial' : 'hologram')}
          title="Toggle 3D Spatial Model Mesh"
          aria-pressed={mode3D === 'spatial'}
        >
          <span>{mode3D === 'spatial' ? '🌐 3D MESH ACTIVE' : '✨ 3D MESH'}</span>
        </button>

        <button
          type="button"
          className={`emblem-control-pill ${isAudioActive ? 'active sound-on' : ''}`}
          onClick={toggleSound}
          title="Toggle Ambient Cosmic Audio Synthesizer"
          aria-label={isAudioActive ? 'AUDIO ON' : 'COSMIC SOUND'}
          aria-pressed={isAudioActive}
        >
          <span aria-hidden="true">{isAudioActive ? '🔊' : '🔈'}</span>
          <span>{isAudioActive ? 'AUDIO ON' : 'COSMIC SOUND'}</span>
          {isAudioActive && <span className="audio-sound-wave" />}
        </button>
      </div>
    </div>
  );
}
