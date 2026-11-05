import { test, expect } from '@playwright/test';

const routes = ['/', '/clubs', '/events', '/gallery'];
const viewports = [
  { name: 'desktop', width: 1440, height: 960 },
  { name: 'mobile', width: 390, height: 844 }
];

test.describe('JYC celestial night-sky dark theme', () => {
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
          const nav = document.querySelector('.public-app .nav');\n          const constellation = document.querySelector('.jyc-3d-explorer-section');\n          const hud = document.querySelector('.jyc-3d-hud-card');
          return {
            backgroundToken: root.getPropertyValue('--jyc-bg').trim(),
            primaryToken: root.getPropertyValue('--jyc-brand-oxblood').trim(),
            darkAccent: root.getPropertyValue('--accent-red').trim(),
            moonlightToken: root.getPropertyValue('--jh-cyan').trim(),
            bodyBackground: body.backgroundColor,
            bodyFont: body.fontFamily,
            headingFont: heading ? getComputedStyle(heading).fontFamily : '',
            navBackground: nav ? getComputedStyle(nav).backgroundColor : '',\n            constellationBackground: constellation ? getComputedStyle(constellation).backgroundImage : '',\n            constellationHudAccent: hud ? getComputedStyle(hud).getPropertyValue('--hud-color').trim() : '',
            homeBackground: document.querySelector('.jyc-editorial-home.jyc-home')
              ? getComputedStyle(document.querySelector('.jyc-editorial-home.jyc-home')).getPropertyValue('--jh-bg').trim()
              : ''
          };
        });

        expect(dark.backgroundToken).toBe('#090b19');
        expect(dark.primaryToken).toBe('#c9b8f2');
        expect(dark.darkAccent).toBe('#c9b8f2');
        expect(dark.moonlightToken).toBe('#e6d4a8');
        expect(dark.primaryToken).not.toMatch(/#(?:ed8064|ff9a7e|38bdf8)/i);
        expect(dark.bodyBackground).toMatch(/rgba?\(/);
        expect(dark.bodyFont).toMatch(/Inter|system-ui/i);
        expect(dark.headingFont).toContain('Space Grotesk');
        expect(dark.navBackground).not.toBe('rgba(0, 0, 0, 0)');
        if (route === '/') {\n          expect(dark.homeBackground).toBe('#090b19');\n          expect(dark.constellationBackground).toContain('gradient');\n          expect(dark.constellationHudAccent).toBe('#c9b8f2');\n        }

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
