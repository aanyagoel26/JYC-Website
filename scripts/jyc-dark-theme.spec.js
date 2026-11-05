import { test, expect } from '@playwright/test';

const routes = ['/', '/about', '/clubs', '/events', '/gallery'];
const viewports = [
  { name: 'desktop', width: 1440, height: 960 },
  { name: 'phone', width: 390, height: 844 }
];

async function waitForJyc(page, route) {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.locator('.public-app').waitFor({ state: 'visible', timeout: 25000 });
  await page.waitForFunction(() => document.documentElement.dataset.jycContentReady === 'true', null, { timeout: 20000 });
  await page.evaluate(() => document.fonts?.ready.then(() => true));
}

async function themeSnapshot(page) {
  return page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const app = document.querySelector('.public-app');
    const heading = app?.querySelector('h1');
    const paragraph = app?.querySelector('.jh-lead, .about-hero-copy p, .section-head p, p');
    const parse = value => {
      const text = String(value).trim();
      if (/^#[0-9a-f]{6}$/i.test(text)) {
        return [1,3,5].map(index => parseInt(text.slice(index,index+2),16));
      }
      if (/^#[0-9a-f]{3}$/i.test(text)) {
        return text.slice(1).split('').map(char => parseInt(char+char,16));
      }
      const match = text.match(/\d+(?:\.\d+)?/g);
      return match ? match.slice(0, 3).map(Number) : [0, 0, 0];
    };
    const luminance = value => {
      const rgb = parse(value).map(channel => {
        const c = channel / 255;
        return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
      });
      return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
    };
    const contrast = (a, b) => {
      const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (values[0] + .05) / (values[1] + .05);
    };
    const canvas = root.getPropertyValue('--jyc-canvas').trim();
    const headingColor = heading ? getComputedStyle(heading).color : '';
    const paragraphColor = paragraph ? getComputedStyle(paragraph).color : '';
    const home = document.querySelector('.jyc-editorial-home.jyc-home');
    const toggle = document.querySelector('.theme-toggle');
    return {
      canvas,
      accent: root.getPropertyValue('--jyc-brand-oxblood').trim(),
      text: root.getPropertyValue('--jyc-text-strong').trim(),
      bodyBackgroundImage: getComputedStyle(document.body).backgroundImage,
      headingColor,
      paragraphColor,
      headingContrast: headingColor ? contrast(headingColor, canvas) : 0,
      paragraphContrast: paragraphColor ? contrast(paragraphColor, canvas) : 0,
      homeBackground: home ? getComputedStyle(home).getPropertyValue('--jh-bg').trim() : '',
      togglePressed: toggle?.getAttribute('aria-pressed') ?? null,
      documentOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  });
}

test.describe('JYC shared day/night theme contract', () => {
  for (const viewport of viewports) {
    for (const route of routes) {
      test(`night-sky theme stays readable — ${viewport.name} — ${route}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.addInitScript(() => localStorage.setItem('jyc-theme', 'dark'));
        await waitForJyc(page, route);
        const dark = await themeSnapshot(page);
        expect(dark.canvas).toBe('#080d1c');
        expect(dark.accent).toBe('#c8bcff');
        expect(dark.homeBackground === '' || dark.homeBackground === '#080d1c').toBe(true);
        expect(dark.bodyBackgroundImage).toContain('radial-gradient');
        expect(dark.headingContrast, 'dark heading contrast must meet WCAG AA').toBeGreaterThanOrEqual(4.5);
        expect(dark.paragraphContrast, 'dark body copy contrast must meet WCAG AA').toBeGreaterThanOrEqual(4.5);
        if (viewport.width <= 390) expect(dark.documentOverflow, `${route} must not overflow the phone viewport`).toBe(false);
      });
    }
  }
});

test('day theme keeps warm paper, readable text and a consistent accent', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('jyc-theme', 'light'));
  await waitForJyc(page, '/');
  const light = await themeSnapshot(page);
  expect(light.canvas).toBe('#f5f1e8');
  expect(light.accent).toBe('#625889');
  expect(light.bodyBackgroundImage).toContain('radial-gradient');
  expect(light.headingContrast).toBeGreaterThanOrEqual(4.5);
  expect(light.paragraphContrast).toBeGreaterThanOrEqual(4.5);
  expect(light.documentOverflow).toBe(false);
});

test('theme toggle switches day/night, persists the preference and exposes its state', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(() => localStorage.setItem('jyc-theme', 'dark'));
  await waitForJyc(page, '/');
  const toDay = page.getByRole('button', { name: 'Switch to day theme' });
  await expect(toDay).toHaveAttribute('aria-pressed', 'true');
  await toDay.click();
  const toNight = page.getByRole('button', { name: 'Switch to night theme' });
  await expect(toNight).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--jyc-canvas').trim())).toBe('#f5f1e8');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('jyc-theme'))).toBe('light');
  await toNight.click();
  await expect(page.getByRole('button', { name: 'Switch to day theme' })).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--jyc-canvas').trim())).toBe('#080d1c');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('jyc-theme'))).toBe('dark');
});

test('homepage hero crest loads an optimized official logo and stays clear of the phone dock', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() => localStorage.setItem('jyc-theme', 'dark'));
  await waitForJyc(page, '/');
  const logo = page.locator('.jyc-emblem-logo-img');
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(logo).toHaveAttribute('src', /jyc-logo\.avif|jyc-logo\.webp|JYC%20Logo/);
  const geometry = await page.evaluate(() => {
    const rect = selector => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const r = element.getBoundingClientRect();
      return { left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height };
    };
    return {
      viewport:window.innerWidth,
      overflow:document.documentElement.scrollWidth>window.innerWidth+1,
      hero:rect('.jh-hero'),
      visual:rect('.jh-hero-webgl-stage-wrap'),
      actions:rect('.jh-hero-actions'),
      dock:rect('.mobile-dock')
    };
  });
  expect(geometry.overflow).toBe(false);
  expect(geometry.hero).not.toBeNull();
  expect(geometry.visual).not.toBeNull();
  expect(geometry.actions).not.toBeNull();
  expect(geometry.dock).not.toBeNull();
  for (const box of [geometry.hero,geometry.visual,geometry.actions]) {
    expect(box.left).toBeGreaterThanOrEqual(-1);
    expect(box.right).toBeLessThanOrEqual(geometry.viewport+1);
  }
  expect(geometry.actions.bottom).toBeLessThan(geometry.dock.top);
});

test('About page remains structured and readable at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() => localStorage.setItem('jyc-theme', 'light'));
  await waitForJyc(page, '/about');
  await expect(page.locator('.about-hero-copy h1')).toBeVisible();
  await expect(page.locator('.about-family-grid-v28>button')).toHaveCount(5);
  await expect(page.locator('.about-history-section')).toBeVisible();
  const layout = await page.evaluate(() => ({
    overflow:document.documentElement.scrollWidth>window.innerWidth+1,
    hero:document.querySelector('.about-hero-v28')?.getBoundingClientRect().toJSON(),
    familyGrid:document.querySelector('.about-family-grid-v28')?.getBoundingClientRect().toJSON(),
    metrics:document.querySelector('.v40-about-metrics')?.getBoundingClientRect().toJSON()
  }));
  expect(layout.overflow).toBe(false);
  expect(layout.hero.width).toBeLessThanOrEqual(322);
  expect(layout.familyGrid.width).toBeLessThanOrEqual(322);
  expect(layout.metrics.width).toBeLessThanOrEqual(322);
});
