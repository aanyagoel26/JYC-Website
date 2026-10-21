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

test.describe('JYC V18.26 public + Control Center journey',()=>{
  test('home is compact and Phoenix ecosystem is interactive',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    await expect(page).toHaveTitle(/JYC|JIIT YOUTH CLUB/i);
    await expect(page.locator('.home .hero')).toBeVisible();
    await expect(page.locator('.home .phoenix-3d-stage')).toHaveCount(1);
    await expect(page.locator('.home .ecosystem-section')).toBeVisible();
    await expect(page.locator('.home .ecosystem-node')).toHaveCount(4);
    await expect(page.locator('.home .ecosystem-connector')).toHaveCount(4);
    await page.locator('.home .ecosystem-node').first().hover();
    await expect(page.locator('.home .ecosystem-node').first()).toHaveClass(/is-active/);
    expect(errors).toEqual([]);
  });

  test('navbar is compact and More has no FAQ duplicate',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    const nav=page.locator('.nav');
    await expect(nav).toBeVisible();
    const h=await nav.boundingBox(); expect(h?.height||999).toBeLessThanOrEqual(70);
    await page.getByRole('button',{name:'More'}).first().click();
    const dialog=page.getByRole('dialog',{name:'More JYC'});
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/FAQ/i)).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('JYC Assistant searches useful destinations',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    await page.getByRole('button',{name:/More/i}).first().click();
    await page.getByRole('dialog',{name:'More JYC'}).getByText('Ask JYC Assistant',{exact:false}).click();
    const dialog=page.locator('.assistant-panel-modern');
    await expect(dialog).toBeVisible();
    const input=dialog.locator('input').first(); await input.fill('planner');
    await expect(dialog.getByRole('option').first()).toContainText(/Planner/i);
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });

  test('theme toggle changes theme and can launch bird transition',async({page})=>{
    const errors=await errorsFor(page); await open(page);
    const toggle=page.getByRole('button',{name:/Switch to/i}).first();
    const before=await page.locator('html').getAttribute('data-theme');
    await toggle.click();
    await expect.poll(()=>page.locator('html').getAttribute('data-theme')).not.toBe(before);
    expect(errors).toEqual([]);
  });

  test('My JYC shows inline sync when signed out',async({page})=>{
    const errors=await errorsFor(page); await open(page,'/my-jyc');
    await expect(page.locator('.my-jyc-sync-card')).toBeVisible();
    await expect(page.locator('#jyc-sync-email')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('Planner exposes device calendar sync',async({page})=>{
    const errors=await errorsFor(page); await open(page,'/planner');
    await expect(page.locator('.calendar-page')).toBeVisible();
    await expect(page.getByText('JYC PLANNER',{exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:/Add JYC dates to device/i})).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('About contains compact quick answers instead of FAQ page',async({page})=>{
    const errors=await errorsFor(page); await open(page,'/about');
    await expect(page.locator('.about-quick-answers details')).toHaveCount(3);
    await page.locator('.about-quick-answers details').first().locator('summary').click();
    await expect(page.locator('.about-quick-answers details').first()).toHaveAttribute('open','');
    expect(errors).toEqual([]);
  });

  for(const route of ['/about','/clubs','/events','/gallery','/team','/planner','/map','/my-jyc','/contact','/fests','/guide']){
    test(`${route} renders without a runtime error`,async({page})=>{
      const errors=await errorsFor(page); await open(page,route);
      await expect(page.locator('body')).toBeVisible();
      expect(errors,`runtime errors on ${route}`).toEqual([]);
    });
  }

  test('admin login is compact with centered JYC mark',async({page})=>{
    const errors=await errorsFor(page); await open(page,'/admin');
    await expect(page.locator('.login-card')).toBeVisible();
    await expect(page.locator('.login-card .login-mark')).toBeVisible();
    const card=await page.locator('.login-card').boundingBox();
    const mark=await page.locator('.login-card .login-mark').boundingBox();
    expect(card&&mark).toBeTruthy();
    expect(Math.abs((mark.x+mark.width/2)-(card.x+card.width/2))).toBeLessThan(8);
    expect(errors).toEqual([]);
  });

  for(const viewport of [{width:390,height:844},{width:400,height:580},{width:768,height:1024},{width:1440,height:900}]){
    test(`no horizontal overflow at ${viewport.width}x${viewport.height}`,async({page})=>{
      const errors=await errorsFor(page); await page.setViewportSize(viewport); await open(page);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
      await expect(page.locator('.nav')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});
