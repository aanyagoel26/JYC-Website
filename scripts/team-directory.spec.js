import { test, expect } from '@playwright/test';

test.describe('JYC team directory interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/team', { waitUntil: 'domcontentloaded' });
    await page.locator('.team-page').waitFor({ state: 'visible', timeout: 25000 });
    await page.waitForFunction(() => document.documentElement.dataset.jycContentReady === 'true', { timeout: 20000 });
  });

  test('searches published profiles and exposes a genuine empty state', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: 'Search JYC team members' });
    await search.fill('Devansh Tripathi');
    await expect(page.locator('.team-results-count')).toContainText('1');
    await expect(page.locator('.team-layer-card').filter({ hasText: 'Devansh Tripathi' })).toBeVisible();

    await search.fill('no-real-jyc-profile-should-match');
    await expect(page.getByRole('heading', { name: 'No matching profiles' })).toBeVisible();
    await expect(page.locator('.team-layer-card')).toHaveCount(0);
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(search).toHaveValue('');
    await expect(page.locator('.team-layer-card').first()).toBeVisible();
  });

  test('filters the directory by leadership tier without changing published totals', async ({ page }) => {
    await page.getByRole('button', { name: /Apex leadership/ }).click();
    await expect(page.getByRole('button', { name: /Apex leadership/ })).toHaveAttribute('aria-pressed', 'true');
    const activeSection = page.locator('.team-layer').filter({ hasText: 'APEX LEADERSHIP' });
    await expect(activeSection.locator('.team-layer-head')).toContainText('APEX LEADERSHIP');
    await expect(page.locator('.team-layer').filter({ hasText: 'CORE TEAM' })).toHaveCount(0);
    await page.getByRole('button', { name: /Everyone/ }).click();
    await expect(page.getByRole('button', { name: /Everyone/ })).toHaveAttribute('aria-pressed', 'true');
  });

  test('profile flip cards are keyboard operable and restore the front face on Escape', async ({ page }) => {
    const card = page.locator('.team-member-flip').first();
    const frontTrigger = card.locator('.flip-card__front-trigger');
    await expect(frontTrigger).toBeVisible();
    await frontTrigger.focus();
    await expect(frontTrigger).toBeFocused();
    await page.keyboard.press('Space');
    await expect(frontTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(card.locator('.flip-card__back')).toBeVisible();
    const returnButton = card.getByRole('button', { name: '← Back to photo' });
    await expect(returnButton).toBeVisible();
    const cardBounds = await card.boundingBox();
    const returnBounds = await returnButton.boundingBox();
    expect(returnBounds.y + returnBounds.height).toBeLessThanOrEqual(cardBounds.y + cardBounds.height + 1);
    await expect(card.locator('.flip-card__front')).toHaveAttribute('aria-hidden', 'true');
    await expect(card.locator('.flip-card__back')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(frontTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(card.locator('.flip-card__front')).toBeVisible();
    await expect(frontTrigger).toBeFocused();
  });

  test('switches and persists the day and night theme', async ({ page }) => {
    const toggle = page.locator('.theme-toggle').first();
    await expect(toggle).toBeVisible();
    const before = await page.locator('html').getAttribute('data-theme');
    const expected = before === 'dark' ? 'light' : 'dark';
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
    await expect(toggle).toHaveAttribute('aria-pressed', expected === 'dark' ? 'true' : 'false');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.team-page').waitFor({ state: 'visible', timeout: 25000 });
    await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
  });

  test('shows a working JYC crest fallback in the Team identity', async ({ page }) => {
    await expect(page.getByRole('img', { name: 'JIIT Youth Club crest' }).first()).toBeVisible();
  });

  test('keeps both theme variants readable at 320px and 390px', async ({ page }) => {
    for (const theme of ['light','dark']) {
      await page.evaluate(value => { localStorage.setItem('jyc-theme', value); document.documentElement.dataset.theme = value; }, theme);
      for (const width of [320,390]) {
        await page.setViewportSize({ width, height: 820 });
        const snapshot = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, heading: getComputedStyle(document.querySelector('.team-hero-copy h1')).color, body: getComputedStyle(document.querySelector('.team-hero-copy p')).color, card: document.querySelector('.team-layer-card')?.getBoundingClientRect().width || 0, viewport: document.documentElement.clientWidth }));
        expect(snapshot.overflow, `${theme} team layout overflows at ${width}px`).toBe(false);
        expect(snapshot.card, `${theme} team cards fit at ${width}px`).toBeLessThanOrEqual(snapshot.viewport);
        expect(snapshot.heading).not.toBe(snapshot.body);
      }
    }
  });

  test('keeps the directory usable at narrow phone widths', async ({ page }) => {
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 820 });
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        searchWidth: document.querySelector('.team-search-field')?.getBoundingClientRect().width || 0,
        cardWidth: document.querySelector('.team-layer-card')?.getBoundingClientRect().width || 0,
        viewportWidth: document.documentElement.clientWidth
      }));
      expect(metrics.overflow, 'horizontal overflow at ' + width + 'px').toBe(false);
      expect(metrics.searchWidth, 'search field missing at ' + width + 'px').toBeGreaterThan(200);
      expect(metrics.cardWidth, 'team card missing at ' + width + 'px').toBeGreaterThan(200);
      expect(metrics.cardWidth, 'team card exceeds viewport at ' + width + 'px').toBeLessThanOrEqual(metrics.viewportWidth);
    }
  });
});
