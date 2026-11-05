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
    await expect(page.locator('.team-layer-head')).toContainText('APEX LEADERSHIP');
    await expect(page.locator('.team-layer-head')).not.toContainText('CORE TEAM');
    await page.getByRole('button', { name: /Everyone/ }).click();
    await expect(page.getByRole('button', { name: /Everyone/ })).toHaveAttribute('aria-pressed', 'true');
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
