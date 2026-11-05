import { test, expect } from '@playwright/test';

const routes = [
  '/', '/about', '/clubs', '/events', '/team', '/contact', '/join-jyc',
  '/converge', '/achievements', '/gallery', '/best-of-jyc', '/updates',
  '/announcements', '/archive', '/calendar'
];
const viewports = [
  { name: 'desktop', width: 1440, height: 960 },
  { name: 'mobile', width: 390, height: 844 }
];

test.describe('JYC complete editorial / night-sky theme coverage', () => {
  for (const viewport of viewports) {
    for (const route of routes) {
      test(`theme consistency — ${viewport.name} — ${route}`, async ({ page }) => {
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
          const app = document.querySelector('.public-app');
          const heading = app?.querySelector('h1');
          const nav = document.querySelector('.public-app .nav');
          const visibleSurface = [...(app?.querySelectorAll(
            '.card,.club-card,.event-card,.team-card,.contact-card,.feature-card,.jyc57-page,.jyc-route-card,.jyc-hub-signal-card'
          ) || [])].find(el => el.getClientRects().length);
          const surfaceStyle = visibleSurface ? getComputedStyle(visibleSurface) : null;
          return {
            backgroundToken: root.getPropertyValue('--jyc-bg').trim(),
            primaryToken: root.getPropertyValue('--jyc-brand-oxblood').trim(),
            darkAccent: root.getPropertyValue('--accent-red').trim(),
            moonlightToken: root.getPropertyValue('--jh-cyan').trim(),
            semanticRed: root.getPropertyValue('--jyc-red').trim(),
            semanticGold: root.getPropertyValue('--jyc-gold').trim(),
            bodyBackground: body.backgroundColor,
            bodyFont: body.fontFamily,
            headingFont: heading ? getComputedStyle(heading).fontFamily : '',
            navBackground: nav ? getComputedStyle(nav).backgroundColor : '',
            surfaceBackground: surfaceStyle?.backgroundColor || '',
            surfaceColor: surfaceStyle?.color || '',
            routeTextColor: app ? getComputedStyle(app).color : '',
            homeBackground: document.querySelector('.jyc-editorial-home.jyc-home')
              ? getComputedStyle(document.querySelector('.jyc-editorial-home.jyc-home')).getPropertyValue('--jh-bg').trim()
              : ''
          };
        });

        expect(dark.backgroundToken).toBe('#090b19');
        expect(dark.primaryToken).toBe('#c9b8f2');
        expect(dark.darkAccent).toBe('#c9b8f2');
        expect(dark.moonlightToken).toBe('#e6d4a8');
        expect(dark.semanticRed).toBe('#c9b8f2');
        expect(dark.semanticGold).toBe('#e6d4a8');
        expect(dark.primaryToken).not.toMatch(/#(?:ed8064|ff9a7e|38bdf8|c92a2a)/i);
        expect(dark.bodyBackground).toMatch(/rgba?\(/);
        expect(dark.bodyFont).toMatch(/Inter|system-ui/i);
        expect(dark.headingFont).toContain('Space Grotesk');
        expect(dark.navBackground).not.toBe('rgba(0, 0, 0, 0)');
        expect(dark.routeTextColor).not.toBe('rgba(0, 0, 0, 0)');
        if (dark.surfaceBackground) {
          expect(dark.surfaceBackground).not.toMatch(/rgb\(255, 255, 255\)|rgb\(248, 250, 252\)/);
        }
        if (route === '/') expect(dark.homeBackground).toBe('#090b19');

        await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
        const light = await page.evaluate(() => {
          const root = getComputedStyle(document.documentElement);
          return {
            paper: root.getPropertyValue('--jyc-bg').trim(),
            accent: root.getPropertyValue('--jyc-brand-oxblood').trim(),
            gold: root.getPropertyValue('--jyc-gold').trim()
          };
        });
        expect(light.paper).toBe('#f6f2e9');
        expect(light.accent).toBe('#843b35');
        expect(light.gold).toBe('#98784e');
      });
    }
  }
});

test('Search and More overlays inherit the active theme, including their micro-controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.public-app').waitFor({ state: 'visible', timeout: 25000 });
  await page.waitForFunction(() => document.documentElement.dataset.jycContentReady === 'true');
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });

  const searchTrigger = page.locator('.search-trigger').first();
  if (await searchTrigger.isVisible()) {
    await searchTrigger.click();
    const dialog = page.locator('.jyc-search-dialog');
    await expect(dialog).toBeVisible();
    const searchColors = await dialog.evaluate(el => ({
      background: getComputedStyle(el).backgroundColor,
      color: getComputedStyle(el).color,
      icon: el.querySelector('svg') ? getComputedStyle(el.querySelector('svg')).color : ''
    }));
    expect(searchColors.color).not.toBe('rgb(0, 0, 0)');
    await page.keyboard.press('Escape');
  }

  const moreTrigger = page.locator('.nav-more-trigger').first();
  if (await moreTrigger.isVisible()) {
    await moreTrigger.click();
    const more = page.locator('.jyc-more-experience');
    await expect(more).toBeVisible();
    const moreColors = await more.evaluate(el => ({
      background: getComputedStyle(el).backgroundColor,
      color: getComputedStyle(el).color,
      icon: el.querySelector('svg') ? getComputedStyle(el.querySelector('svg')).color : ''
    }));
    expect(moreColors.color).not.toBe('rgb(0, 0, 0)');
  }
});


test('About page chapter navigation reaches every published section on desktop and mobile', async ({ page }) => {
  for (const viewport of [{width:1440,height:960},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await page.locator('.public-app .about-page').waitFor({ state: 'visible', timeout: 25000 });
    await page.waitForFunction(() => document.documentElement.dataset.jycContentReady === 'true');
    const nav = page.locator('.about-chapter-nav');
    await expect(nav).toBeVisible();
    const targets = ['about-at-a-glance','about-purpose','about-ecosystem','about-how-it-works','about-programmes','history'];
    for (const id of targets) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
      const link = nav.locator(`a[href="#${id}"]`);
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      const visible = await page.locator(`#${id}`).evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top < window.innerHeight;
      });
      expect(visible, `About chapter ${id} should scroll into view`).toBeTruthy();
    }
  }
});


test('About page inherited editorial layers resolve to the exact site palette', async ({ page }) => {
  await page.goto('/about', { waitUntil: 'domcontentloaded' });
  const about = page.locator('.public-app .about-page');
  await expect(about).toBeVisible();
  await page.waitForFunction(() => document.documentElement.dataset.jycContentReady === 'true');
  const read = () => about.evaluate(el => {
    const root = getComputedStyle(el);
    const hero = el.querySelector('.about-hero-v28');
    const logoTile = el.querySelector('.about-hero-mark>div');
    const metric = el.querySelector('.v40-about-metrics article strong');
    const snapshot = el.querySelector('.v40-about-snapshot-intro');
    return {
      bg: root.getPropertyValue('--v40-bg').trim(),
      surface: root.getPropertyValue('--v40-surface').trim(),
      text: root.getPropertyValue('--v40-text').trim(),
      muted: root.getPropertyValue('--v40-muted').trim(),
      accent: root.getPropertyValue('--v40-bronze').trim(),
      gold: root.getPropertyValue('--v40-champ').trim(),
      heroBackground: hero ? getComputedStyle(hero).backgroundColor : '',
      logoTileBackground: logoTile ? getComputedStyle(logoTile).backgroundColor : '',
      metricColor: metric ? getComputedStyle(metric).color : '',
      snapshotBackground: snapshot ? getComputedStyle(snapshot).backgroundImage : ''
    };
  });

  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  const dark = await read();
  expect(dark.bg).toBe('#090b19');
  expect(dark.surface).toBe('#15182b');
  expect(dark.text).toBe('#f2efff');
  expect(dark.muted).toBe('#c0bad5');
  expect(dark.accent).toBe('#c9b8f2');
  expect(dark.gold).toBe('#e6d4a8');
  expect(dark.metricColor).toBe('rgb(230, 212, 168)');

  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
  const light = await read();
  expect(light.bg).toBe('#f6f2e9');
  expect(light.surface).toBe('#fffdf8');
  expect(light.text).toBe('#211d22');
  expect(light.muted).toBe('#655d66');
  expect(light.accent).toBe('#843b35');
  expect(light.gold).toBe('#98784e');
});
