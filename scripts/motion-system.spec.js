import { test, expect } from '@playwright/test';

const base=(process.env.JYC_BASE_URL||'http://127.0.0.1:5173').replace(/\/$/,'');

test.describe('JYC motion system',()=>{
  test('editorial sections reveal as they enter the viewport without hiding content',async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.locator('.public-app main').waitFor({state:'visible',timeout:25000});
    await page.waitForFunction(()=>document.documentElement.dataset.jycContentReady==='true',null,{timeout:20000});
    const sections=page.locator('.public-app main > section.jyc-reveal');
    await expect(sections.first()).toBeAttached({timeout:10000});
    const target=sections.nth(Math.min(2,await sections.count()-1));
    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveClass(/jyc-reveal-visible/,{timeout:5000});
    const state=await target.evaluate(el=>({opacity:getComputedStyle(el).opacity,transform:getComputedStyle(el).transform}));
    expect(Number(state.opacity)).toBeGreaterThan(.98);
    const matrix=new DOMMatrix(state.transform);
    expect(Math.abs(matrix.m41)).toBeLessThan(1);
    expect(Math.abs(matrix.m42)).toBeLessThan(1);
  });

  test('reduced-motion preference keeps all homepage sections immediately visible',async({page})=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.setViewportSize({width:390,height:844});
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.locator('.public-app main').waitFor({state:'visible',timeout:25000});
    await page.waitForFunction(()=>document.documentElement.dataset.jycContentReady==='true',null,{timeout:20000});
    const sections=page.locator('.public-app main > section');
    const count=await sections.count();
    expect(count).toBeGreaterThan(2);
    const results=await sections.evaluateAll(items=>items.map(el=>({
      opacity:getComputedStyle(el).opacity,
      visible:!!(el.getBoundingClientRect().width&&el.getBoundingClientRect().height)
    })));
    expect(results.every(x=>x.visible&&Number(x.opacity)>.98)).toBe(true);
  });
});
