import React, { useRef } from 'react';
import './JYCHeroWebGLEmblem.css';

const LOGO_SRC = '/assets/jyc-logo.avif';
const LOGO_FALLBACK = '/assets/jyc-logo.webp';
const LOGO_ORIGINAL = '/JYC%20Logo(4).png';

export function JYCHeroWebGLEmblem() {
  const containerRef = useRef(null);
  const handlePointerMove = event => {
    const stage = containerRef.current;
    if (!stage || !window.matchMedia?.('(hover:hover) and (pointer:fine)').matches
      || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      || document.documentElement.dataset.jycMotion === 'paused') return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty('--crest-tilt-x', (-y * 5) + 'deg');
    stage.style.setProperty('--crest-tilt-y', (x * 6) + 'deg');
  };
  const resetTilt = () => {
    const stage = containerRef.current;
    if (!stage) return;
    stage.style.setProperty('--crest-tilt-x', '0deg');
    stage.style.setProperty('--crest-tilt-y', '0deg');
  };
  return (
    <div className="jyc-hero-emblem-stage" ref={containerRef}
      onPointerMove={handlePointerMove} onPointerLeave={resetTilt}
      role="group" aria-label="JIIT Youth Club identity">
      <div className="jyc-hero-identity-rail" aria-label="JIIT Youth Club details">
        <span className="jyc-hero-identity-location"><i aria-hidden="true" />JIIT 128 <b>·</b> Sector 128, Noida</span>
        <span className="jyc-hero-identity-founded"><b>EST. 2004</b><i aria-hidden="true" />Student community</span>
      </div>
      <div className="jyc-emblem-orbit" aria-hidden="true">
        <span className="jyc-emblem-orbit-track jyc-emblem-orbit-track-a" />
        <span className="jyc-emblem-orbit-track jyc-emblem-orbit-track-b" />
        <span className="jyc-emblem-orbit-track jyc-emblem-orbit-track-c" />
        <span className="jyc-emblem-orbit-star jyc-emblem-orbit-star-a" />
        <span className="jyc-emblem-orbit-star jyc-emblem-orbit-star-b" />
      </div>
      <div className="jyc-emblem-card-3d">
        <div className="jyc-emblem-glow-backing" aria-hidden="true" />
        <div className="jyc-emblem-seal-container">
          <img src={LOGO_SRC}
            srcSet={import.meta.env.PROD ? "/assets/jyc-logo-270.avif 270w, /assets/jyc-logo-320.avif 320w, /assets/jyc-logo.avif 480w" : undefined}
            sizes="(max-width: 680px) 250px, (max-width: 1024px) 340px, 430px"
            alt="JIIT Youth Club official crest" className="jyc-emblem-logo-img"
            width="480" height="480" loading="eager" fetchPriority="high" decoding="async"
            onError={event => {
              const image = event.currentTarget;
              image.removeAttribute('srcset');
              const stage = Number(image.dataset.logoFallbackStage || 0);
              const candidates = [LOGO_FALLBACK, LOGO_ORIGINAL];
              if (stage < candidates.length) {
                image.dataset.logoFallbackStage = String(stage + 1);
                image.src = candidates[stage];
              } else {
                const fallback = document.createElement('span');
                fallback.className = 'jyc-emblem-logo-fallback';
                fallback.textContent = 'JYC';
                image.replaceWith(fallback);
              }
            }} />
        </div>
      </div>
      <div className="jyc-hero-emblem-caption">
        <span className="jyc-hero-emblem-caption-mark" aria-hidden="true">✦</span>
        <span><b>READY TO SOAR</b><small>JIIT YOUTH CLUB · OFFICIAL MARK</small></span>
      </div>
    </div>
  );
}
