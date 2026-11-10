import { test, expect } from '@playwright/test';

async function ready(page, route = '/about') {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.locator('.public-app').waitFor({ state: 'visible', timeout: 25000 });
  await page.waitForFunction(() => document.documentElement.dataset.jycContentReady === 'true', null, { timeout: 20000 });
}

test.describe('JYC motion system', () => {
  test('route reveal content becomes fully visible as it enters the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await ready(page, '/about');
    const target = page.locator('.public-app .reveal').last();
    await expect(target).toBeAttached();
    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveClass(/jyc-motion-visible/, { timeout: 7000 });
    await expect.poll(() => target.evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.98);
    await expect.poll(() => target.evaluate(el => { const matrix=new DOMMatrixReadOnly(getComputedStyle(el).transform); return Math.hypot(matrix.m41,matrix.m42); })).toBeLessThanOrEqual(12);
    const state = await target.evaluate(el => ({ opacity:Number(getComputedStyle(el).opacity), transform:getComputedStyle(el).transform }));
    expect(state.opacity).toBeGreaterThan(0.98);
  });

  test('new SPA route content is observed after navigation without a full reload', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await ready(page, '/about');
    const before = await page.evaluate(() => performance.getEntriesByType('navigation').length);
    await page.locator('.nav').getByRole('button', { name: 'Clubs', exact: true }).click();
    await expect(page).toHaveURL(/\/clubs$/);
    const target = page.locator('.public-app .route-stage .reveal').first();
    await expect(target).toBeAttached();
    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveClass(/jyc-motion-visible/, { timeout: 7000 });
    const after = await page.evaluate(() => performance.getEntriesByType('navigation').length);
    expect(after).toBe(before);
    await expect.poll(() => target.evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.98);
  });

  test('reduced-motion preference reveals route content immediately without transforms', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, '/about');
    const reveals = page.locator('.public-app .reveal');
    const count = await reveals.count();
    expect(count).toBeGreaterThan(2);
    await expect.poll(() => reveals.evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).every(node => node.classList.contains('jyc-motion-visible') && Number(getComputedStyle(node).opacity) > 0.98 && getComputedStyle(node).transform === 'none'))).toBe(true);
  });

  test('content remains visible when IntersectionObserver is unavailable', async ({ page }) => {
    await page.addInitScript(() => { window.IntersectionObserver = undefined; });
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, '/about');
    const reveals = page.locator('.public-app .reveal');
    const count = await reveals.count();
    expect(count).toBeGreaterThan(2);
    await expect.poll(() => reveals.evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).every(node => node.classList.contains('jyc-motion-visible') && Number(getComputedStyle(node).opacity) > 0.98))).toBe(true);
  });
  test('reveal content remains visible when the motion enhancement is not initialized', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, '/about');
    await page.evaluate(() => document.documentElement.classList.remove('jyc-motion-ready'));
    const target = page.locator('.public-app .reveal').last();
    await expect.poll(() => target.evaluate(el => ({opacity:Number(getComputedStyle(el).opacity),transform:getComputedStyle(el).transform}))).toEqual({opacity:1,transform:'none'});
  });

  test('reveal content stays visible when MutationObserver is unavailable', async ({ page }) => {
    await page.addInitScript(() => { window.MutationObserver = undefined; });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/about', { waitUntil:'load' });
    await page.waitForTimeout(1200);
    const state = await page.evaluate(() => { const node=document.querySelector('.public-app .reveal:last-of-type') || document.querySelector('.public-app .reveal'); return {exists:Boolean(node),opacity:node?Number(getComputedStyle(node).opacity):0,transform:node?getComputedStyle(node).transform:'missing',motionReady:document.documentElement.classList.contains('jyc-motion-ready')}; });
    expect(state.exists).toBe(true);
    expect(state.motionReady).toBe(false);
    expect(state.opacity).toBeGreaterThan(0.98);
    expect(state.transform).toBe('none');
  });

  test('ambient canvas stays fixed behind content and never occupies page layout on high-performance devices', async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { value: 16, configurable: true }); Object.defineProperty(navigator, 'deviceMemory', { value: 16, configurable: true }); Object.defineProperty(navigator, 'connection', { value: { saveData: false }, configurable: true }); });
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, '/');
    const metrics = await page.locator('.jyc-ambient-canvas').evaluate(canvas => {
      const rect = canvas.getBoundingClientRect();
      const style = getComputedStyle(canvas);
      return {
        position: style.position,
        pointerEvents: style.pointerEvents,
        zIndex: style.zIndex,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    });
    expect(metrics.position).toBe('fixed');
    expect(metrics.pointerEvents).toBe('none');
    expect(Number(metrics.zIndex)).toBeLessThanOrEqual(0);
    const rootZIndex = await page.evaluate(() => Number(getComputedStyle(document.querySelector('#root')).zIndex));
    expect(rootZIndex).toBeGreaterThanOrEqual(Number(metrics.zIndex));
    expect(Math.abs(metrics.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(metrics.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(metrics.width - metrics.viewportWidth)).toBeLessThanOrEqual(1);
    expect(Math.abs(metrics.height - metrics.viewportHeight)).toBeLessThanOrEqual(1);
  });

  test('ambient canvas pauses and clears when reduced motion is enabled at runtime', async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { value: 16, configurable: true }); Object.defineProperty(navigator, 'deviceMemory', { value: 16, configurable: true }); Object.defineProperty(navigator, 'connection', { value: { saveData: false }, configurable: true }); });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await ready(page, '/');
    const canvas = page.locator('.jyc-ambient-canvas');
    await expect(canvas).toBeAttached();
    await page.waitForTimeout(180);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(250);
    const pausedFrame = await canvas.evaluate(node => node.toDataURL());
    await page.waitForTimeout(300);
    const nextFrame = await canvas.evaluate(node => node.toDataURL());
    expect(nextFrame).toBe(pausedFrame);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(300);
    const resumedFrame = await canvas.evaluate(node => node.toDataURL());
    expect(resumedFrame).not.toBe(pausedFrame);
  });
  test('day and night surfaces use their own theme palette and atmospheric depth', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await ready(page, '/');
    for (const theme of ['light', 'dark']) {
      await page.evaluate(value => {
        document.documentElement.dataset.theme = value;
        localStorage.setItem('jyc-theme', value);
      }, theme);
      const surface = await page.locator('body').evaluate(node => {
        const style = getComputedStyle(node);
        const root = getComputedStyle(document.documentElement);
        return { backgroundImage: style.backgroundImage, accent: root.getPropertyValue('--jyc-accent').trim(), canvas: root.getPropertyValue('--jyc-canvas').trim(), surface: root.getPropertyValue('--jyc-surface').trim() };
      });
      expect(surface.backgroundImage).toContain('radial-gradient');
      expect(surface.canvas).toBe(theme === 'dark' ? '#080d1c' : '#f1eadb');
      expect(surface.accent).toBe(theme === 'dark' ? '#c8bcff' : '#705b3a');
      expect(surface.surface).toBe(theme === 'dark' ? '#111b31' : '#fffaf0');
    }
  });

  test('homepage depth animations run when motion is allowed and stop for reduced motion', async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(navigator,'hardwareConcurrency',{value:16,configurable:true}); Object.defineProperty(navigator,'deviceMemory',{value:16,configurable:true}); Object.defineProperty(navigator,'connection',{value:{saveData:false},configurable:true}); });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await ready(page, '/');
    const emblem = page.locator('.jyc-emblem-glow-backing');
    const ambient = page.locator('.jyc-ambient-canvas');
    await expect(emblem).toBeVisible();
    await expect(ambient).toBeVisible();
    await expect.poll(() => emblem.evaluate(node => getComputedStyle(node).animationName)).toBe('emblemPulse');
    await expect.poll(() => ambient.evaluate(node => getComputedStyle(node).display)).not.toBe('none');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect.poll(() => emblem.evaluate(node => getComputedStyle(node).animationName)).toBe('none');
    await expect.poll(() => ambient.evaluate(node => getComputedStyle(node).display)).toBe('none');
  });


});
