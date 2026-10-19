import React, { useEffect, useRef, useState } from 'react';

const LOGO_SRC = '/JYC%20Logo(4).png';
const LOGO_FALLBACK = '/assets/jyc-logo.avif';

export function JYCHeroWebGLEmblem() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeBadge, setActiveBadge] = useState(0);

  // Auto-cycle badges
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBadge(prev => (prev + 1) % 3);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // WebGL / Canvas Orbiting Rings & Particle Stardust System
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

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = Math.round(rect.width * dpr);
      height = canvas.height = Math.round(rect.height * dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Orbital particles
    const particleCount = 48;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      distance: 110 + (i % 6) * 18,
      speed: (0.003 + (i % 4) * 0.002) * (i % 2 === 0 ? 1 : -1),
      size: 1.2 + (i % 3) * 0.8,
      alpha: 0.25 + (i % 5) * 0.15,
      tiltAxis: (i % 3) * 0.35,
      color: i % 3 === 0 ? '#38bdf8' : '#d4af37' // Cyan & Gold accents
    }));

    // Mouse movement
    const handleMove = e => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetPointerX = nx * 35;
      targetPointerY = ny * 35;
    };
    window.addEventListener('mousemove', handleMove, { passive: true });

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && !animId) animId = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const draw = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      time += 0.015;
      pointerX += (targetPointerX - pointerX) * 0.08;
      pointerY += (targetPointerY - pointerY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cx = width / 2 + pointerX * dpr;
      const cy = height / 2 + pointerY * dpr;
      const baseRadius = Math.min(width, height) * 0.36;

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const goldStroke = isDark ? 'rgba(212, 175, 55, ' : 'rgba(191, 156, 111, ';
      const cyanStroke = isDark ? 'rgba(56, 189, 248, ' : 'rgba(112, 43, 59, ';

      // 1. Ambient Central Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.2, cx, cy, baseRadius * 1.5);
      if (isDark) {
        glowGrad.addColorStop(0, 'rgba(212, 175, 55, 0.14)');
        glowGrad.addColorStop(0.45, 'rgba(56, 189, 248, 0.05)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(212, 175, 55, 0.18)');
        glowGrad.addColorStop(0.5, 'rgba(191, 156, 111, 0.07)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Primary Concentric Golden Orbital Rings (3D perspective tilted)
      ctx.save();
      ctx.translate(cx, cy);

      // Outer telemetry ring
      ctx.strokeStyle = goldStroke + '0.24)';
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([4 * dpr, 6 * dpr]);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.28, baseRadius * 1.28 * 0.88, time * 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // Middle counter-rotating ring with tick notches
      ctx.strokeStyle = cyanStroke + '0.35)';
      ctx.lineWidth = 1.2 * dpr;
      ctx.setLineDash([12 * dpr, 18 * dpr]);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.15, baseRadius * 1.15 * 0.92, -time * 0.25, 0, Math.PI * 2);
      ctx.stroke();

      // Inner crisp gold halo
      ctx.strokeStyle = goldStroke + '0.55)';
      ctx.lineWidth = 1.5 * dpr;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 0.98, baseRadius * 0.98, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Degree tick accents around inner ring
      const ticks = 16;
      for (let i = 0; i < ticks; i++) {
        const a = (i / ticks) * Math.PI * 2 + time * 0.1;
        const r1 = baseRadius * 0.99;
        const r2 = baseRadius * (i % 4 === 0 ? 1.05 : 1.02);
        ctx.strokeStyle = i % 4 === 0 ? (isDark ? '#38bdf8' : '#c59b27') : (goldStroke + '0.4)');
        ctx.lineWidth = (i % 4 === 0 ? 1.5 : 1) * dpr;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.stroke();
      }

      ctx.restore();

      // 3. Stardust particles orbiting the emblem
      particles.forEach(p => {
        p.angle += p.speed;
        const scale = dpr * (baseRadius / 150);
        const px = cx + Math.cos(p.angle) * p.distance * scale;
        const py = cy + Math.sin(p.angle) * p.distance * scale * 0.82;
        const pulse = 0.65 + Math.sin(time * 2 + p.angle * 3) * 0.35;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * pulse;
        ctx.beginPath();
        ctx.arc(px, py, p.size * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // 3D Tilt calculation
  const handlePointerMove = e => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -y * 18, // Pitch
      y: x * 22   // Yaw
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
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      aria-label="Official JIIT Youth Club Holographic Emblem"
    >
      {/* Interactive WebGL / Canvas Orbital System */}
      <canvas ref={canvasRef} className="jyc-emblem-canvas" aria-hidden="true" />

      {/* 3D Perspective Tilt Card */}
      <div
        className="jyc-emblem-card-3d"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`
        }}
      >
        {/* Specular Hologram Light Sweep */}
        <div className="jyc-emblem-light-sweep" aria-hidden="true" />

        {/* Central Gold Eagle Seal */}
        <div className="jyc-emblem-seal-container">
          <div className="jyc-emblem-glow-backing" aria-hidden="true" />
          <img
            src={LOGO_SRC}
            alt="JIIT Youth Club Crest"
            className="jyc-emblem-logo-img"
            loading="eager"
            decoding="async"
            onError={e => {
              if (e.currentTarget.src !== LOGO_FALLBACK) {
                e.currentTarget.src = LOGO_FALLBACK;
              }
            }}
          />
        </div>

        {/* Floating Telemetry Satellite Badges */}
        <div className="jyc-emblem-badge badge-top-left" style={{ transform: `translateZ(32px)` }}>
          <span className="badge-dot" />
          <span className="badge-text">JIIT 128 · SECTOR 128 NOIDA</span>
        </div>

        <div className="jyc-emblem-badge badge-top-right" style={{ transform: `translateZ(36px)` }}>
          <span className="badge-accent">EST. 2004</span>
          <span className="badge-text">STUDENT COMMUNITY</span>
        </div>

        <div className="jyc-emblem-badge badge-bottom" style={{ transform: `translateZ(42px)` }}>
          <span className="badge-icon">🦅</span>
          <span className="badge-text">READY TO SOAR · OFFICIAL MARK</span>
          <span className="badge-live-pulse" />
        </div>
      </div>
    </div>
  );
}
