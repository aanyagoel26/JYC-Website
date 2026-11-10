import { test, expect } from '@playwright/test';

const base = process.env.JYC_BASE_URL || 'http://127.0.0.1:5173';
const ready = async page => {
  await page.locator('.public-app').waitFor({ state: 'visible', timeout: 25000 });
  await page.waitForFunction(() => document.documentElement.dataset.jycContentReady === 'true', { timeout: 20000 });
};

test('browser-compat: public route families render without uncaught errors or horizontal overflow', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['/', '/clubs', '/events', '/gallery', '/team', '/join-jyc', '/updates', '/contact']) {
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await ready(page);
    await expect(page.locator('.public-app h1').first()).toBeVisible();
    const width = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(width.content, route + ' horizontal overflow').toBeLessThanOrEqual(width.viewport + 1);
  }
  expect(errors, errors.join(' | ')).toEqual([]);
});

test('browser-compat: Search and More dialogs are named, dismissible and restore focus', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await ready(page);
  const searchTrigger = page.locator('[data-jyc-search-trigger]').first();
  await searchTrigger.click();
  const search = page.getByRole('dialog', { name: 'Find your place.' });
  await expect(search).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(search).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.activeElement?.matches('[data-jyc-search-trigger]') === true)).toBe(true);

  const moreTrigger = page.locator('.nav-more-trigger').first();
  await moreTrigger.click();
  const more = page.getByRole('dialog', { name: 'More JYC' });
  await expect(more).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(more).toHaveCount(0);
  await expect(moreTrigger).toBeFocused();
});

test('browser-compat: reduced-motion mode keeps navigation and controls usable on mobile', async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/clubs', { waitUntil: 'domcontentloaded' });
  await ready(page);
  const motion = await page.evaluate(() => ({
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  expect(motion.scroll).toBe('auto');
  expect(motion.content).toBeLessThanOrEqual(motion.viewport + 1);
  await expect(page.locator('.public-app h1').first()).toBeVisible();
});
