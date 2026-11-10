import React, { useEffect, useRef, useState } from 'react';
import './JYCHeroWebGLEmblem.css';

const LOGO_SRC = '/assets/jyc-logo.avif';
const LOGO_FALLBACK = '/assets/jyc-logo.webp';
const LOGO_ORIGINAL = '/JYC%20Logo(4).png';

export function JYCHeroWebGLEmblem() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const frameRef = useRef(0);
  const tiltRef = useRef({ x: 0, y: 0 });
  const [logoFailed, setLogoFailed] = useState(false);

  const handlePointerMove = event => {
    if (!containerRef.current || !window.matchMedia?.('(hover:hover) and (pointer:fine)').matches || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.jycMotion === 'paused') return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current = { x: -y * 4, y: x * 5 };
    if (!frameRef.current) frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      if (cardRef.current) cardRef.current.style.transform = `perspective(1200px) rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg)`;
    });
  };

  const resetTilt = () => {
    tiltRef.current = { x: 0, y: 0 };
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  };
  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }, []);

  return (
    <div
      ref={containerRef}
      className="jyc-hero-emblem-stage"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      role="img"
      aria-label="JIIT Youth Club crest"
    >
      <div className="jyc-emblem-orbit orbit-outer" aria-hidden="true" />
      <div className="jyc-emblem-orbit orbit-inner" aria-hidden="true" />
      <div className="jyc-emblem-orbit orbit-equator" aria-hidden="true" />
      <div
        ref={cardRef}
        className="jyc-emblem-card-3d"
      >
        <div className="jyc-emblem-glow-backing" aria-hidden="true" />
        <div className="jyc-emblem-seal-container">
          {logoFailed ? (
            <span className="jyc-emblem-logo-fallback" aria-hidden="true">JYC</span>
          ) : (
            <img
              src={LOGO_SRC}
              srcSet={import.meta.env.PROD ? "/assets/jyc-logo-270.avif 270w, /assets/jyc-logo-320.avif 320w, /assets/jyc-logo.avif 480w" : undefined}
              sizes="(max-width: 680px) 220px, (max-width: 1024px) 280px, 320px"
              alt=""
              aria-hidden="true"
              className="jyc-emblem-logo-img"
              width="480"
              height="480"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={event => {
                const image = event.currentTarget;
                image.removeAttribute('srcset');
                const stage = Number(image.dataset.logoFallbackStage || 0);
                const candidates = [LOGO_FALLBACK, LOGO_ORIGINAL];
                if (stage < candidates.length) {
                  image.dataset.logoFallbackStage = String(stage + 1);
                  image.src = candidates[stage];
                } else {
                  setLogoFailed(true);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
