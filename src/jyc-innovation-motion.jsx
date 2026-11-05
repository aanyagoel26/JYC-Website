import { useEffect, useRef } from 'react';
import './jyc-innovation-motion.css';

function setupReveal() {
  const nodes = [...document.querySelectorAll('.public-app .reveal')];
  if (!nodes.length) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach(node => node.classList.add('jyc-motion-visible'));
    return () => {};
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('jyc-motion-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  nodes.forEach(node => observer.observe(node));
  return () => observer.disconnect();
}

/**
 * Modern High-Performance Background Engine:
 * - Dark Mode: Deep night sky, micro twinkling stars, galaxy nebula & small shooting stars
 * - Light Mode: Warm luxury gold-beige champagne atmospheric field & golden dust
 */
function useAtmosphericCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.width = Math.round(window.innerWidth * dpr);
      height = canvas.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMouseMove = e => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.04;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.04;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Star pool for Dark Mode (small twinkling stars)
    const starCount = Math.min(150, Math.floor(window.innerWidth / 10));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0002,
      radius: Math.random() * 0.9 + 0.6,
      twinkleSpeed: Math.random() * 0.03 + 0.015,
      twinklePhase: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.55 + 0.35,
      color: Math.random() > 0.8 ? '#fcd34d' : (Math.random() > 0.5 ? '#93c5fd' : (Math.random() > 0.25 ? '#e0e7ff' : '#ffffff'))
    }));

    // Golden dust and luminous nodes for Light Mode
    const goldDustCount = Math.min(65, Math.floor(window.innerWidth / 22));
    const goldDust = Array.from({ length: goldDustCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.5 + 0.7,
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? 'rgba(212, 175, 55, ' : 'rgba(234, 179, 8, '
    }));

    // Shooting Stars Queue (realistic comet head with gradient tail)
    const shootingStars = [];
    let lastShootingStarTime = 0;

    const spawnShootingStar = () => {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.25;
      const speed = Math.random() * 16 + 18;
      shootingStars.push({
        x: Math.random() * width * 0.85 + width * 0.05,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 55,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: 0.95,
        fadeSpeed: 0.024 + Math.random() * 0.012,
        width: Math.random() * 1.0 + 1.0
      });
    };

    let isHidden = document.hidden;
    const onVisibilityChange = () => {
      isHidden = document.hidden;
      if (!isHidden && !animId) animId = requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const loop = (timestamp) => {
      if (isHidden) {
        animId = 0;
        return;
      }
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      if (isDark) {
        // ========================================================
        // DARK MODE: CELESTIAL NIGHT SKY, NEBULA & CONSTELLATIONS
        // ========================================================
        // 1. Multi-layered Cosmic Nebulae
        const nebula1 = ctx.createRadialGradient(
          width * 0.25 + mouseX * 0.6,
          height * 0.28 + mouseY * 0.6,
          width * 0.04,
          width * 0.25,
          height * 0.28,
          width * 0.5
        );
        nebula1.addColorStop(0, 'rgba(56, 189, 248, 0.048)');
        nebula1.addColorStop(0.4, 'rgba(147, 51, 234, 0.028)');
        nebula1.addColorStop(0.8, 'rgba(236, 72, 153, 0.012)');
        nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebula1;
        ctx.fillRect(0, 0, width, height);

        const nebula2 = ctx.createRadialGradient(
          width * 0.78 - mouseX * 0.6,
          height * 0.72 - mouseY * 0.6,
          width * 0.04,
          width * 0.78,
          height * 0.72,
          width * 0.45
        );
        nebula2.addColorStop(0, 'rgba(212, 175, 55, 0.038)');
        nebula2.addColorStop(0.5, 'rgba(59, 130, 246, 0.022)');
        nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebula2;
        ctx.fillRect(0, 0, width, height);

        // 2. Update stars & Draw Constellation Lines
        const starCoords = [];
        stars.forEach(star => {
          star.x += star.vx;
          star.y += star.vy;
          if (star.x < 0) star.x = 1;
          if (star.x > 1) star.x = 0;
          if (star.y < 0) star.y = 1;
          if (star.y > 1) star.y = 0;

          const px = star.x * width + mouseX * 0.18;
          const py = star.y * height + mouseY * 0.18;
          const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.35;
          const safeAlpha = Math.max(0.12, Math.min(1, alpha));

          starCoords.push({ px, py, alpha: safeAlpha, color: star.color, radius: star.radius });
        });

        // Constellation webs between nearby stars (distance threshold ~85px)
        const connectDist = Math.min(width * 0.075, 85);
        ctx.lineWidth = 0.55;
        for (let i = 0; i < starCoords.length; i++) {
          for (let j = i + 1; j < starCoords.length; j++) {
            const dx = starCoords[i].px - starCoords[j].px;
            const dy = starCoords[i].py - starCoords[j].py;
            const dist = Math.hypot(dx, dy);
            if (dist < connectDist) {
              const lineAlpha = (1 - dist / connectDist) * 0.18 * starCoords[i].alpha * starCoords[j].alpha;
              if (lineAlpha > 0.015) {
                ctx.strokeStyle = `rgba(147, 197, 253, ${lineAlpha})`;
                ctx.beginPath();
                ctx.moveTo(starCoords[i].px, starCoords[i].py);
                ctx.lineTo(starCoords[j].px, starCoords[j].py);
                ctx.stroke();
              }
            }
          }
        }

        // Render individual stars with subtle glow
        starCoords.forEach(s => {
          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.alpha;
          ctx.beginPath();
          ctx.arc(s.px, s.py, s.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // 3. Dynamic Shooting Stars
        if (timestamp - lastShootingStarTime > 3800 && Math.random() < 0.4) {
          spawnShootingStar();
          lastShootingStarTime = timestamp;
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.x += s.speedX;
          s.y += s.speedY;
          s.opacity -= s.fadeSpeed;

          if (s.opacity <= 0 || s.x > width || s.y > height) {
            shootingStars.splice(i, 1);
            continue;
          }

          const tailX = s.x - (s.speedX / Math.hypot(s.speedX, s.speedY)) * s.length;
          const tailY = s.y - (s.speedY / Math.hypot(s.speedX, s.speedY)) * s.length;

          const streakGrad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          streakGrad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
          streakGrad.addColorStop(0.25, `rgba(212, 175, 55, ${s.opacity * 0.85})`);
          streakGrad.addColorStop(0.7, `rgba(56, 189, 248, ${s.opacity * 0.4})`);
          streakGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = s.width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Shooting star glowing head
          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.width * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }

      } else {
        // ========================================================
        // LIGHT MODE: WARM LUXURY GOLD AURORA & CHAMPAGNE WEB
        // ========================================================
        // 1. Shimmering Sunbeam Aurora Pools
        const aurora1 = ctx.createRadialGradient(
          width * 0.15 + mouseX * 0.5,
          height * 0.15 + mouseY * 0.5,
          width * 0.05,
          width * 0.15,
          height * 0.15,
          width * 0.55
        );
        aurora1.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
        aurora1.addColorStop(0.5, 'rgba(245, 158, 11, 0.035)');
        aurora1.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = aurora1;
        ctx.fillRect(0, 0, width, height);

        const aurora2 = ctx.createRadialGradient(
          width * 0.82 - mouseX * 0.4,
          height * 0.65 - mouseY * 0.4,
          width * 0.05,
          width * 0.82,
          height * 0.65,
          width * 0.48
        );
        aurora2.addColorStop(0, 'rgba(251, 191, 36, 0.06)');
        aurora2.addColorStop(0.6, 'rgba(217, 119, 6, 0.025)');
        aurora2.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = aurora2;
        ctx.fillRect(0, 0, width, height);

        // 2. Drifting Gold Dust & Subtle Geometric Links
        const dustCoords = [];
        goldDust.forEach(dust => {
          dust.x += dust.vx;
          dust.y += dust.vy;
          if (dust.x < 0) dust.x = 1;
          if (dust.x > 1) dust.x = 0;
          if (dust.y < 0) dust.y = 1;
          if (dust.y > 1) dust.y = 0;

          const px = dust.x * width + mouseX * 0.2;
          const py = dust.y * height + mouseY * 0.2;
          const alpha = 0.28 + Math.sin(time * 1.5 + dust.phase) * 0.15;
          dustCoords.push({ px, py, alpha, radius: dust.radius, colorPrefix: dust.color });
        });

        // Golden geometric links between drifting champagne dust
        const dustDist = Math.min(width * 0.065, 75);
        ctx.lineWidth = 0.5;
        for (let i = 0; i < dustCoords.length; i++) {
          for (let j = i + 1; j < dustCoords.length; j++) {
            const dx = dustCoords[i].px - dustCoords[j].px;
            const dy = dustCoords[i].py - dustCoords[j].py;
            const dist = Math.hypot(dx, dy);
            if (dist < dustDist) {
              const linkAlpha = (1 - dist / dustDist) * 0.12 * dustCoords[i].alpha * dustCoords[j].alpha;
              if (linkAlpha > 0.01) {
                ctx.strokeStyle = `rgba(180, 130, 60, ${linkAlpha})`;
                ctx.beginPath();
                ctx.moveTo(dustCoords[i].px, dustCoords[i].py);
                ctx.lineTo(dustCoords[j].px, dustCoords[j].py);
                ctx.stroke();
              }
            }
          }
        }

        // Draw champagne stardust nodes
        dustCoords.forEach(d => {
          ctx.fillStyle = `${d.colorPrefix}${d.alpha})`;
          ctx.beginPath();
          ctx.arc(d.px, d.py, d.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [canvasRef]);
}

export function JYCInnovationMotion() {
  const canvasRef = useRef(null);
  useEffect(() => setupReveal(), []);
  useAtmosphericCanvas(canvasRef);
  return <canvas ref={canvasRef} className="jyc-ambient-canvas" aria-hidden="true" />;
}
