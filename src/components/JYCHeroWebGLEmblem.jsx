import React, { useRef, useState } from 'react';
import './JYCHeroWebGLEmblem.css';

const LOGO_SRC = '/assets/jyc-logo.avif';
const LOGO_FALLBACK = '/assets/jyc-logo.webp';
const LOGO_ORIGINAL = '/JYC%20Logo(4).png';

export function JYCHeroWebGLEmblem() {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [logoFailed, setLogoFailed] = useState(false);

  const handlePointerMove = event => {
    if (!containerRef.current || !window.matchMedia?.('(hover:hover) and (pointer:fine)').matches || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.jycMotion === 'paused') return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 7, y: x * 9 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={containerRef}
      className="jyc-hero-emblem-stage"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      role="img"
      aria-label="JIIT Youth Club crest"
    >
      <div
        className="jyc-emblem-card-3d"
        style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
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
