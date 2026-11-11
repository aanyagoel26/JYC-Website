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

    // Route pages are authored with semantic sections rather than animation
    // classes. Promote those sections into the shared reveal system so SPA
    // navigation, reduced motion and observer fallbacks all use one contract.
    const stages = node.matches('.route-stage')
      ? [node]
      : [...node.querySelectorAll('.route-stage')];
    const containingStage = node.closest('.route-stage');
    if (containingStage) stages.push(containingStage);
    [...new Set(stages)].forEach(stage => {
      const targets = [...stage.children];
      // Include the page root and semantic sections. Some legacy routes use
      // div-based page shells, so section-only discovery misses SPA updates.
      if (node !== stage && node.parentElement === stage) targets.push(node);
      if (node.matches('section, article, main') && stage.contains(node)) targets.push(node);
      targets.push(...stage.querySelectorAll('section, article, main, [class*="page-section"], [class*="-section"], .section-card'));
      targets.forEach(target => target.classList.add('reveal'));
    });

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
    canvas.style.display = motionQuery.matches || userPaused ? 'none' : 'block';
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
export function JYCInnovationMotion() {
  // The shared CSS atmosphere is the low-cost sitewide backdrop. The dedicated
  // OGL field remains on the homepage hero, avoiding a second full-screen canvas.
  useEffect(() => setupReveal(), []);
  return null;
}
