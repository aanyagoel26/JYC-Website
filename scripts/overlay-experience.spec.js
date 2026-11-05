import { test, expect } from '@playwright/test';

const base=(process.env.JYC_BASE_URL||'http://127.0.0.1:5173').replace(/\/$/,'');
const viewports=[{name:'phone',width:390,height:844},{name:'tablet',width:768,height:1024},{name:'desktop',width:1440,height:960}];

test.describe('JYC Search and More overlay experience',()=>{
  for(const viewport of viewports){
    test(`Search and More remain usable at ${viewport.name} width`,async({page})=>{
      await page.setViewportSize({width:viewport.width,height:viewport.height});
      await page.goto(base,{waitUntil:'domcontentloaded'});
      await page.locator('.public-app').waitFor({state:'visible',timeout:25000});
      await page.waitForFunction(()=>document.documentElement.dataset.jycContentReady==='true',null,{timeout:20000});

      await page.locator('.search-trigger').click();
      const search=page.getByRole('dialog',{name:/what are you looking for/i});
      await expect(search).toBeVisible();
      await expect(search.getByRole('textbox',{name:'Search JYC content'})).toBeFocused();
      await expect(page.locator('body')).toHaveCSS('overflow','hidden');
      await search.getByRole('textbox',{name:'Search JYC content'}).fill('robotics');
      await expect(search.getByRole('group',{name:'Filter search results'})).toBeVisible();
      await search.getByRole('button',{name:'Clubs',exact:true}).click();
      await expect(search.locator('.jyc-search-count')).toContainText(/match/);
      const searchBounds=await search.evaluate(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}));
      expect(searchBounds.scrollWidth).toBeLessThanOrEqual(searchBounds.clientWidth+2);
      await page.keyboard.press('Escape');
      await expect(search).toBeHidden();

      if(viewport.width<=900){
        await page.locator('.mobile-dock button').filter({hasText:'More'}).click();
      } else {
        await page.locator('.nav-more-trigger').click();
      }
      const more=page.getByRole('dialog',{name:/more to discover/i});
      await expect(more).toBeVisible();
      await expect(more.getByRole('textbox',{name:'Search the More directory'})).toBeFocused();
      await expect(page.locator('body')).toHaveCSS('overflow','hidden');
      await more.getByRole('textbox',{name:'Search the More directory'}).fill('calendar');
      await expect(more.getByRole('button',{name:/event calendar/i})).toBeVisible();
      const moreBounds=await more.evaluate(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}));
      expect(moreBounds.scrollWidth).toBeLessThanOrEqual(moreBounds.clientWidth+2);
      await page.keyboard.press('Escape');
      await expect(more).toBeHidden();
    });
  }
});
