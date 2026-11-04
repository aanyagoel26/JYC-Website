import { test, expect } from '@playwright/test';

const routes = ['/', '/clubs', '/events', '/gallery'];
const viewports = [
  { name: 'desktop', width: 1440, height: 960 },
  { name: 'mobile', width: 390, height: 844 }
];

test.describe('JYC Jai Hack-inspired dark theme', () => {
  for (const viewport of viewports) {
    for (const route of routes) {
      test(`dark theme contract — ${viewport.name} — ${route}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.locator('.public-app').waitFor({ state: 'visible', timeout: 25000 });
        await page.waitForFunction(
          () => document.documentElement.dataset.jycContentReady === 'true',
          null,
          { timeout: 20000 }
        );

        await page.evaluate(() => {
          localStorage.setItem('jyc-theme', 'dark');
          document.documentElement.dataset.theme = 'dark';
        });

        const dark = await page.evaluate(() => {
          const root = getComputedStyle(document.documentElement);
          const body = getComputedStyle(document.body);
          const heading = document.querySelector('.public-app h1');
          const nav = document.querySelector('.public-app .nav');
          return {
            backgroundToken: root.getPropertyValue('--jyc-bg').trim(),
            primaryToken: root.getPropertyValue('--jyc-brand-oxblood').trim(),
            bodyBackground: body.backgroundColor,
            bodyFont: body.fontFamily,
            headingFont: heading ? getComputedStyle(heading).fontFamily : '',
            navBackground: nav ? getComputedStyle(nav).backgroundColor : ''
          };
        });

        expect(dark.backgroundToken).toBe('#050811');
        expect(dark.primaryToken).toBe('#38bdf8');
        expect(dark.bodyBackground).toBe('rgb(5, 8, 17)');
        expect(dark.bodyFont).toContain('DM Sans');
        expect(dark.headingFont).toContain('Space Grotesk');
        expect(dark.navBackground).not.toBe('rgba(0, 0, 0, 0)');

        // The new visual contract must not bleed into the existing light theme.
        await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
        const lightPrimary = await page.evaluate(
          () => getComputedStyle(document.documentElement).getPropertyValue('--jyc-brand-oxblood').trim()
        );
        expect(lightPrimary).not.toBe('#38bdf8');
      });
    }
  }
});
