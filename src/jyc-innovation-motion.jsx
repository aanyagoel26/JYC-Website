import { useEffect, useRef } from 'react';
import './jyc-innovation-motion.css';

function setupReveal() {
  const selector = '.public-app .reveal';
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = document.documentElement.dataset.jycMotion === 'paused';
  let observer = null;
  let observed = new WeakSet();

  const show = node => node.classList.add('jyc-motion-visible');
  const createObserver = () => {
    if (typeof IntersectionObserver !== 'function') return null;
    return new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer?.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  };

  const observeNode = node => {
    if (!(node instanceof Element)) return;
    const candidates = [];
    if (node.matches(selector)) candidates.push(node);
    candidates.push(...node.querySelectorAll(selector));
    candidates.forEach(candidate => {
      if (motionQuery.matches || userPaused || !observer) {
        show(candidate);
      } else if (!observed.has(candidate)) {
        observed.add(candidate);
        observer.observe(candidate);
      }
    });
  };

  observer = createObserver();
  const root = document.querySelector('.public-app') || document.body;

  // Only enable the hidden-before-reveal state after the route observer is
  // installed. If this enhancement cannot initialize, CSS leaves all content
  // visible instead of hiding text behind an animation that never runs.
  const mutationObserver = typeof MutationObserver === 'function'
    ? new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(observeNode)))
    : null;
  if (mutationObserver) document.documentElement.classList.add('jyc-motion-ready');
  observeNode(root);
  mutationObserver?.observe(root, { childList: true, subtree: true });

  const onMotionChange = () => {
    userPaused = document.documentElement.dataset.jycMotion === 'paused';
    observer?.disconnect();
    observer = createObserver();
    observed = new WeakSet();
    document.querySelectorAll(selector).forEach(node => {
      if (motionQuery.matches || userPaused || !observer) show(node);
      else {
        observed.add(node);
        observer.observe(node);
      }
    });
  };
  const onUserMotionChange = () => onMotionChange();
  if (typeof motionQuery.addEventListener === 'function') motionQuery.addEventListener('change', onMotionChange);
  else motionQuery.addListener?.(onMotionChange);
  window.addEventListener('jyc-motion-preference-change', onUserMotionChange);

  return () => {
    mutationObserver?.disconnect();
    observer?.disconnect();
    document.documentElement.classList.remove('jyc-motion-ready');
    if (typeof motionQuery.removeEventListener === 'function') motionQuery.removeEventListener('change', onMotionChange);
    else motionQuery.removeListener?.(onMotionChange);
    window.removeEventListener('jyc-motion-preference-change', onUserMotionChange);
  };
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
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let userPaused = document.documentElement.dataset.jycMotion === 'paused';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 8 || (navigator.deviceMemory || 8) < 8 || Boolean(navigator.connection?.saveData);
    if (lowPower) { canvas.style.display = 'none'; return; } // CSS aurora/nebula remains as a static fallback on constrained devices.

    let width = 0;
    let height = 0;
    let animId = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let time = 0;
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const targetFrameMs = isCoarsePointer ? 80 : 1000 / 20;
    let lastFrameAt = -Infinity;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isCoarsePointer ? 1.1 : 1.5);
      width = canvas.width = Math.round(window.innerWidth * dpr);
      height = canvas.height = Math.round(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMouseMove = e => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.04;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.04;
    };
    if (!isCoarsePointer) window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Star pool for Dark Mode (small twinkling stars)
    const starCount = Math.min(isCoarsePointer ? 16 : 40, Math.floor(window.innerWidth / (isCoarsePointer ? 24 : 28)));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0002,
      radius: Math.random() * 0.9 + 0.6,
      twinkleSpeed: Math.random() * 0.03 + 0.015,
      twinklePhase: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.55 + 0.35,
      color: Math.random() > 0.8 ? '#e7d19b' : (Math.random() > 0.5 ? '#aeb8e4' : (Math.random() > 0.25 ? '#c8bcff' : '#f7f5ff'))
    }));

    // Golden dust and luminous nodes for Light Mode
    const goldDustCount = Math.min(isCoarsePointer ? 8 : 20, Math.floor(window.innerWidth / (isCoarsePointer ? 44 : 56)));
    const goldDust = Array.from({ length: goldDustCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.5 + 0.7,
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? 'rgba(140, 109, 54, ' : 'rgba(164, 123, 67, '
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
      if (!isHidden && !reducedMotion && !userPaused && !animId) animId = requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const loop = (timestamp) => {
      if (isHidden || reducedMotion || userPaused) {
        animId = 0;
        return;
      }
      if (timestamp - lastFrameAt < targetFrameMs) { animId = requestAnimationFrame(loop); return; }
      lastFrameAt = timestamp;
      time += targetFrameMs / 1000;
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
        nebula1.addColorStop(0, 'rgba(200, 188, 255, 0.052)');
        nebula1.addColorStop(0.4, 'rgba(151, 169, 221, 0.032)');
        nebula1.addColorStop(0.8, 'rgba(231, 209, 155, 0.012)');
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
        nebula2.addColorStop(0, 'rgba(231, 209, 155, 0.042)');
        nebula2.addColorStop(0.5, 'rgba(98, 88, 137, 0.022)');
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
                ctx.strokeStyle = `rgba(174, 184, 228, ${lineAlpha})`;
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
        if (!isCoarsePointer && timestamp - lastShootingStarTime > 3800 && Math.random() < 0.4) {
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
          streakGrad.addColorStop(0.25, `rgba(231, 209, 155, ${s.opacity * 0.85})`);
          streakGrad.addColorStop(0.7, `rgba(200, 188, 255, ${s.opacity * 0.4})`);
          streakGrad.addColorStop(1, 'rgba(200, 188, 255, 0)');

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
        aurora1.addColorStop(0, 'rgba(231, 209, 155, 0.09)');
        aurora1.addColorStop(0.5, 'rgba(164, 123, 67, 0.035)');
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
        aurora2.addColorStop(0, 'rgba(200, 188, 255, 0.055)');
        aurora2.addColorStop(0.6, 'rgba(129, 117, 168, 0.028)');
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
                ctx.strokeStyle = `rgba(140, 109, 54, ${linkAlpha})`;
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

    const onMotionChange = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion || userPaused) {
        if (animId) cancelAnimationFrame(animId);
        animId = 0;
        ctx.clearRect(0, 0, width, height);
      } else if (!isHidden && !animId) {
        animId = requestAnimationFrame(loop);
      }
    };
    const onUserMotionChange = () => {
      userPaused = document.documentElement.dataset.jycMotion === 'paused';
      if (userPaused) {
        if (animId) cancelAnimationFrame(animId);
        animId = 0;
        ctx.clearRect(0, 0, width, height);
      } else if (!reducedMotion && !isHidden && !animId) {
        animId = requestAnimationFrame(loop);
      }
    };
    if (typeof motionQuery.addEventListener === 'function') motionQuery.addEventListener('change', onMotionChange);
    else motionQuery.addListener?.(onMotionChange);
    window.addEventListener('jyc-motion-preference-change', onUserMotionChange);
    if (!reducedMotion && !userPaused && !isHidden) animId = requestAnimationFrame(loop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (typeof motionQuery.removeEventListener === 'function') motionQuery.removeEventListener('change', onMotionChange);
      else motionQuery.removeListener?.(onMotionChange);
      window.removeEventListener('jyc-motion-preference-change', onUserMotionChange);
      window.removeEventListener('resize', resize);
      if (!isCoarsePointer) window.removeEventListener('mousemove', onMouseMove);
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
