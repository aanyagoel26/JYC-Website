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

    // Micro Stars Pool for Dark Mode (small, 0.6px - 1.5px)
    const starCount = Math.min(140, Math.floor(window.innerWidth / 12));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 0.9 + 0.6,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.55 + 0.35,
      color: Math.random() > 0.75 ? '#d4af37' : (Math.random() > 0.5 ? '#93c5fd' : '#ffffff')
    }));

    // Golden Dust Pool for Light Mode
    const goldDustCount = Math.min(50, Math.floor(window.innerWidth / 30));
    const goldDust = Array.from({ length: goldDustCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.4 + 0.8,
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      phase: Math.random() * Math.PI * 2
    }));

    // Shooting Stars Queue (small, fast, graceful)
    const shootingStars = [];
    let lastShootingStarTime = 0;

    const spawnShootingStar = () => {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // ~45 degrees trajectory
      const speed = Math.random() * 14 + 16;
      shootingStars.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.35,
        length: Math.random() * 65 + 45, // Small tail
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: 0.9,
        fadeSpeed: 0.028 + Math.random() * 0.015,
        width: Math.random() * 0.8 + 0.9
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
        // --- DARK MODE: CELESTIAL NIGHT SKY & GALAXY NEBULA ---
        // 1. Subtle Galaxy Nebula Glows
        const nebula1 = ctx.createRadialGradient(
          width * 0.25 + mouseX * 0.5,
          height * 0.3 + mouseY * 0.5,
          width * 0.05,
          width * 0.25,
          height * 0.3,
          width * 0.45
        );
        nebula1.addColorStop(0, 'rgba(56, 189, 248, 0.038)');
        nebula1.addColorStop(0.5, 'rgba(147, 51, 234, 0.018)');
        nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebula1;
        ctx.fillRect(0, 0, width, height);

        const nebula2 = ctx.createRadialGradient(
          width * 0.8 - mouseX * 0.5,
          height * 0.7 - mouseY * 0.5,
          width * 0.05,
          width * 0.8,
          height * 0.7,
          width * 0.4
        );
        nebula2.addColorStop(0, 'rgba(212, 175, 55, 0.028)');
        nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebula2;
        ctx.fillRect(0, 0, width, height);

        // 2. Micro Twinkling Stars
        stars.forEach(star => {
          const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.35;
          const px = star.x * width + mouseX * 0.15;
          const py = star.y * height + mouseY * 0.15;

          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
          ctx.beginPath();
          ctx.arc(px, py, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // 3. Small Shooting Stars
        if (timestamp - lastShootingStarTime > 4500 && Math.random() < 0.35) {
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
          streakGrad.addColorStop(0.3, `rgba(212, 175, 55, ${s.opacity * 0.7})`);
          streakGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = s.width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }

      } else {
        // --- LIGHT MODE: WARM LUXURY GOLD BEIGE & CHAMPAGNE STARDUST ---
        // 1. Soft Warm Gold Light Pools
        const goldPool = ctx.createRadialGradient(
          width * 0.2 + mouseX * 0.5,
          height * 0.2 + mouseY * 0.5,
          width * 0.05,
          width * 0.2,
          height * 0.2,
          width * 0.5
        );
        goldPool.addColorStop(0, 'rgba(212, 175, 55, 0.06)');
        goldPool.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = goldPool;
        ctx.fillRect(0, 0, width, height);

        // 2. Drifting Gold Dust
        goldDust.forEach(dust => {
          dust.x += dust.vx;
          dust.y += dust.vy;
          if (dust.x < 0) dust.x = 1;
          if (dust.x > 1) dust.x = 0;
          if (dust.y < 0) dust.y = 1;
          if (dust.y > 1) dust.y = 0;

          const px = dust.x * width + mouseX * 0.2;
          const py = dust.y * height + mouseY * 0.2;
          const alpha = 0.2 + Math.sin(time + dust.phase) * 0.12;

          ctx.fillStyle = `rgba(191, 156, 111, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, dust.radius, 0, Math.PI * 2);
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
