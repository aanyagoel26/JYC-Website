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
    const target = page.locator('.about-next-v28.reveal');
    await expect(target).toBeAttached();
    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveClass(/jyc-motion-visible/, { timeout: 7000 });
    const state = await target.evaluate(el => ({
      opacity: Number(getComputedStyle(el).opacity),
      transform: getComputedStyle(el).transform
    }));
    expect(state.opacity).toBeGreaterThan(0.98);
    expect(state.transform).toBe('none');
  });

  test('new SPA route content is observed after navigation without a full reload', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await ready(page, '/about');
    const before = await page.evaluate(() => performance.getEntriesByType('navigation').length);
    await page.locator('.nav').getByRole('button', { name: 'Clubs', exact: true }).click();
    await expect(page).toHaveURL(/\/clubs$/);
    const target = page.locator('.public-app .section-head.reveal').first();
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
    const states = await reveals.evaluateAll(nodes => nodes.map(node => ({
      visible: node.classList.contains('jyc-motion-visible'),
      opacity: Number(getComputedStyle(node).opacity),
      transform: getComputedStyle(node).transform
    })));
    expect(states.every(state => state.visible && state.opacity > 0.98 && state.transform === 'none')).toBe(true);
  });

  test('content remains visible when IntersectionObserver is unavailable', async ({ page }) => {
    await page.addInitScript(() => { window.IntersectionObserver = undefined; });
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, '/about');
    const reveals = page.locator('.public-app .reveal');
    const count = await reveals.count();
    expect(count).toBeGreaterThan(2);
    const states = await reveals.evaluateAll(nodes => nodes.map(node => ({
      visible: node.classList.contains('jyc-motion-visible'),
      opacity: Number(getComputedStyle(node).opacity)
    })));
    expect(states.every(state => state.visible && state.opacity > 0.98)).toBe(true);
  });
  test('ambient canvas pauses and clears when reduced motion is enabled at runtime', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await ready(page, '/');
    const canvas = page.locator('.jyc-ambient-canvas');
    await expect(canvas).toBeAttached();
    await page.waitForTimeout(180);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(80);
    const pausedFrame = await canvas.evaluate(node => node.toDataURL());
    await page.waitForTimeout(160);
    const nextFrame = await canvas.evaluate(node => node.toDataURL());
    expect(nextFrame).toBe(pausedFrame);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(180);
    const resumedFrame = await canvas.evaluate(node => node.toDataURL());
    expect(resumedFrame).not.toBe(pausedFrame);
  });

});
