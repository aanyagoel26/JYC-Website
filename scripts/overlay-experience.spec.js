import { test, expect } from '@playwright/test';

const viewports = [
  { name:'compact-phone', width:320, height:740 },
  { name:'phone', width:390, height:844 },
  { name:'tablet', width:768, height:1024 },
  { name:'desktop', width:1280, height:900 }
];

async function ready(page) {
  await page.goto('/', { waitUntil:'domcontentloaded' });
  await page.locator('.public-app').waitFor({ state:'visible', timeout:25000 });
  await page.waitForFunction(() => document.documentElement.dataset.jycContentReady === 'true', null, { timeout:20000 });
}

test.describe('JYC Search and More interaction contract', () => {
  for (const viewport of viewports) {
    for (const theme of ['light','dark']) {
      test(`Search and More work without clipping on ${viewport.name} in ${theme} theme`, async ({ page }) => {
      await page.setViewportSize({ width:viewport.width, height:viewport.height });
      await page.addInitScript(value => localStorage.setItem('jyc-theme', value), theme);
      await ready(page);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      const searchTrigger = page.locator('[data-jyc-search-trigger]');
      await expect(searchTrigger).toBeVisible();
      await searchTrigger.click();
      const search = page.getByRole('dialog', { name:'Find your place.' });
      await expect(search).toBeVisible();
      const input = search.getByRole('combobox', { name:'Search JYC' });
      await expect(input).toBeFocused();
      await expect(page.locator('body')).toHaveCSS('overflow','hidden');
      await input.fill('JYC');
      await expect(search.getByRole('group', { name:'Filter search results by category' })).toBeVisible();
      await expect(search.locator('.search-category-filters button').first()).toContainText('All');
      const width = await search.evaluate(el => ({ scroll:el.scrollWidth, client:el.clientWidth }));
      expect(width.scroll).toBeLessThanOrEqual(width.client+1);

      // A category filter belongs to the current query only. Changing the query must restore All.
      await input.fill('AITronics');
      const clubFilter = search.locator('.search-category-filters button').filter({ hasText:/CLUB/ }).first();
      if (await clubFilter.count()) {
        await clubFilter.click();
        await expect(clubFilter).toHaveAttribute('aria-pressed','true');
        await input.fill('Devansh Tripathi');
        await expect(search.locator('.search-category-filters button').first()).toHaveAttribute('aria-pressed','true');
        await expect(search.locator('.search-category-filters button').first()).toContainText('All');
        await expect(search.locator('.search-result-active')).toContainText('Devansh Tripathi');
      }

      await input.fill('zzzxqv987');
      await expect(search.locator('.search-no-results')).toBeVisible();
      await search.locator('.search-input-wrap .search-clear').click();
      await expect(input).toHaveValue('');
      await page.keyboard.press('Escape');
      await expect(search).toHaveCount(0);
      await expect(searchTrigger).toBeFocused();
      await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');

      const moreTrigger = viewport.width <= 900
        ? page.locator('.mobile-dock button').filter({ hasText:'More' })
        : page.locator('.nav-more-trigger');
      await expect(moreTrigger).toBeVisible();
      await moreTrigger.click();
      const more = page.getByRole('dialog', { name:'More JYC' });
      await expect(more).toBeVisible();
      await expect(more.getByRole('button', { name:/About JYC/ })).toBeVisible();
      await expect(more.locator('.more-sheet-grid').first()).toBeVisible();
      const moreWidth = await more.evaluate(el => ({ scroll:el.scrollWidth, client:el.clientWidth }));
      expect(moreWidth.scroll).toBeLessThanOrEqual(moreWidth.client+1);

      await more.getByRole('button', { name:'Search JYC' }).click();
      await expect(page.getByRole('dialog', { name:'Find your place.' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog', { name:'Find your place.' })).toHaveCount(0);
      });
    }
  }
});
