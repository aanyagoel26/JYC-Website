import { test, expect } from '@playwright/test';
const base = process.env.JYC_BASE_URL || 'http://127.0.0.1:5173';

test.describe('JYC V17 public smoke', () => {
  test('home loads with accessible identity', async ({ page }) => {
    await page.goto(base, { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/JYC|JIIT YOUTH CLUB/i);
    await expect(page.getByRole('img', { name: /JYC/i }).first()).toBeVisible();
  });
  for (const route of ['/clubs','/events','/projects','/gallery','/team','/guide','/resources','/map','/my-jyc']) {
    test(`${route} renders without a fatal page error`, async ({ page }) => {
      const errors=[];
      page.on('pageerror', e=>errors.push(String(e)));
      await page.goto(base+route, {waitUntil:'domcontentloaded'});
      await expect(page.locator('body')).toBeVisible();
      expect(errors, `page errors on ${route}`).toEqual([]);
    });
  }
  test('mobile viewport keeps navigation reachable', async ({ page }) => {
    await page.setViewportSize({width:390,height:844});
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await expect(page.locator('nav').last()).toBeVisible();
  });
});
