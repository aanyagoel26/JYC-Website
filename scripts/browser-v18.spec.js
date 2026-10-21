import { test, expect } from '@playwright/test';
const base = process.env.JYC_BASE_URL || 'http://127.0.0.1:5173';

async function errorsFor(page){
  const errors=[];
  page.on('pageerror', e=>errors.push(`pageerror: ${e}`));
  page.on('console', msg=>{if(msg.type()==='error') errors.push(`console: ${msg.text()}`)});
  return errors;
}
async function open(page,path='/'){
  await page.goto(base+path,{waitUntil:'domcontentloaded'});
  await page.locator('body').waitFor();
  await page.waitForTimeout(250);
}

test.describe('JYC V18.17 public + control-center journey',()=>{
  test('home is JYC-first and compact',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    await expect(page).toHaveTitle(/JYC|JIIT YOUTH CLUB/i);
    await expect(page.locator('.home .hero')).toBeVisible();
    await expect(page.locator('.home .phoenix-3d-stage')).toHaveCount(1);
    await expect(page.locator('.home .ecosystem-section')).toHaveCount(0);
    await expect(page.locator('.home .moments-section')).toHaveCount(0);
    await expect(page.locator('.home .phoenix-node')).toHaveCount(3);
    expect(errors).toEqual([]);
  });

  test('primary navigation exposes Moments and Calendar',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    await expect(page.getByRole('button',{name:'Moments'}).first()).toBeVisible();
    await expect(page.getByRole('button',{name:'Calendar'}).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('More is focused and does not repeat Moments or Calendar',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    const more=page.getByRole('button',{name:'More'}).first();
    await more.click();
    await expect(page.getByRole('dialog',{name:'More JYC'})).toBeVisible();
    await expect(page.getByRole('dialog',{name:'More JYC'}).getByText('Moments',{exact:true})).toHaveCount(0);
    await expect(page.getByRole('dialog',{name:'More JYC'}).getByText('Calendar',{exact:true})).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog',{name:'More JYC'})).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('search opens, focuses, navigates and closes',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    await page.getByRole('button',{name:/Search JYC/i}).first().click();
    const dialog=page.locator('.search-modal');
    await expect(dialog).toBeVisible();
    const input=dialog.locator('input').first(); await expect(input).toBeFocused();
    await input.fill('clubs');
    const option=dialog.locator('[role="option"]').first();
    if(await option.count()) await option.click();
    else await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });

  test('Phoenix doors navigate',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    await page.locator('.phoenix-node').first().click();
    await expect(page).toHaveURL(/\/clubs$/);
    expect(errors).toEqual([]);
  });

  test('theme toggle remains functional',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    const toggle=page.getByRole('button',{name:/theme|light|dark/i}).first();
    if(await toggle.count()){
      const before=await page.locator('html').getAttribute('data-theme');
      await toggle.click();
      await expect.poll(()=>page.locator('html').getAttribute('data-theme')).not.toBe(before);
    }
    expect(errors).toEqual([]);
  });

  for(const route of ['/about','/clubs','/events','/gallery','/team','/calendar','/guide','/map','/my-jyc','/contact','/fests']){
    test(`${route} renders without a runtime error`,async({page})=>{
      const errors=await errorsFor(page); await open(page,route);
      await expect(page.locator('body')).toBeVisible();
      expect(errors,`runtime errors on ${route}`).toEqual([]);
    });
  }

  test('mobile public navigation remains visible and compact',async({page})=>{
    const errors=await errorsFor(page); await page.setViewportSize({width:390,height:844}); await open(page);
    await expect(page.locator('.mobile-dock')).toBeVisible();
    await expect(page.locator('.home .phoenix-door-rail')).toBeVisible();
    const box=await page.locator('.home .phoenix-3d-stage').boundingBox();
    expect(box?.height||0).toBeLessThan(360);
    expect(errors).toEqual([]);
  });

  test('mobile More locks scroll and restores it on close',async({page})=>{
    const errors=await errorsFor(page); await page.setViewportSize({width:390,height:844}); await open(page);
    await page.getByRole('button',{name:'More'}).last().click();
    await expect(page.getByRole('dialog',{name:'More JYC'})).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.body).overflow)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog',{name:'More JYC'})).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('admin route never crashes',async({page})=>{
    const errors=await errorsFor(page); await open(page,'/admin');
    await expect(page.locator('body')).toBeVisible();
    expect(errors).toEqual([]);
  });

  for(const viewport of [{width:390,height:844},{width:400,height:580},{width:768,height:1024},{width:1440,height:900}]){
    test(`no horizontal overflow at ${viewport.width}x${viewport.height}`,async({page})=>{
      const errors=await errorsFor(page);
      await page.setViewportSize(viewport);
      await open(page);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
      await expect(page.locator('.nav')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});
