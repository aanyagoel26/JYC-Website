import { test, expect } from '@playwright/test';

const base = (process.env.JYC_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const routes = ['/', '/about', '/history', '/clubs', '/events', '/team', '/gallery', '/achievements', '/announcements', '/recruitment', '/calendar', '/archive', '/updates', '/contact', '/fests', '/converge', '/join-jyc', '/best-of-jyc', '/leadership', '/event-calendar', '/converge-live', '/clubs/dronotics', '/events/jai-2026-jaypee-agentic-ai-hackathon', '/events/jai-2026-jaypee-agentic-ai-hackathon/register', '/gallery/dronotics'];
const viewports = [
  { name: 'phone-320', width: 320, height: 740 },
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 960 }
];

async function waitForContent(page, route) {
  await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  await page.locator('.public-app').waitFor({ state: 'visible', timeout: 25000 });
  await page.waitForFunction(() => document.documentElement.dataset.jycContentReady === 'true', null, { timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
}

test.describe('JYC text readability — all public routes, themes and device sizes', () => {
  test.setTimeout(240000);
  for (const viewport of viewports) {
    test(`text readability — ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const detailRoutes = [];
      for (const sourceRoute of ['/clubs', '/events', '/gallery']) {
        await waitForContent(page, sourceRoute);
        const prefix = sourceRoute + '/';
        const hrefs = await page.locator('a[href^="' + prefix + '"]').evaluateAll(links =>
          [...new Set(links.map(link => new URL(link.href).pathname))]
            .filter(path => path.split('/').filter(Boolean).length > 1)
            .slice(0, 3)
        );
        detailRoutes.push(...hrefs);
      }
      for (const route of [...routes, ...new Set(detailRoutes)]) {
        await waitForContent(page, route);
        for (const theme of ['light', 'dark']) {
          await page.evaluate(value => {
            document.documentElement.setAttribute('data-theme', value);
            document.documentElement.style.colorScheme = value;
          }, theme);
          const audit = await page.evaluate(() => {
            const parse = value => {
              const match = String(value || '').match(/rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
              return match ? [Number(match[1]), Number(match[2]), Number(match[3]), match[4] === undefined ? 1 : Number(match[4])] : null;
            };
            const blend = (top, bottom) => {
              if (!top) return bottom;
              const a = top[3];
              return [0,1,2].map(i => top[i] * a + bottom[i] * (1-a)).concat(1);
            };
            const luminance = color => {
              const channels = color.slice(0,3).map(v => {
                const x = v / 255;
                return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4;
              });
              return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
            };
            const contrast = (a,b) => {
              const x=luminance(a), y=luminance(b);
              return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
            };
            const bodyBg = parse(getComputedStyle(document.body).backgroundColor);
            const pageBg = bodyBg && bodyBg[3] > .95 ? bodyBg : (document.documentElement.dataset.theme === 'dark' ? [9,11,25,1] : [246,242,233,1]);
            const isVisible = el => {
              const s=getComputedStyle(el), r=el.getBoundingClientRect();
              return s.display!=='none' && s.visibility!=='hidden' && Number(s.opacity)>.05 && r.width>0 && r.height>0 && !el.closest('[aria-hidden="true"]');
            };
            const nodes=[...document.querySelectorAll('body *')].filter(el => isVisible(el) && [...el.childNodes].some(n => n.nodeType===Node.TEXT_NODE && n.textContent.trim()));
            const issues=[];
            const samples=[];
            for(const el of nodes){
              const text=(el.innerText||el.textContent||'').trim().replace(/\s+/g,' ');
              if(!text) continue;
              const s=getComputedStyle(el);
              const fg=parse(s.color);
              if(!fg) continue;
              let bg=pageBg;
              const chain=[];
              for(let n=el;n&&n!==document.documentElement;n=n.parentElement) chain.push(n);
              let hasComplexBackground=false;
              for(const n of chain.reverse()){
                const style=getComputedStyle(n);
                if(style.backgroundImage && style.backgroundImage!=='none') hasComplexBackground=true;
                if(style.mixBlendMode && style.mixBlendMode!=='normal') hasComplexBackground=true;
                for(const pseudo of ['::before','::after']){
                  const pseudoStyle=getComputedStyle(n,pseudo);
                  if(pseudoStyle.backgroundImage && pseudoStyle.backgroundImage!=='none') hasComplexBackground=true;
                  const pseudoColor=parse(pseudoStyle.backgroundColor);
                  if(pseudoColor && pseudoColor[3]>0) hasComplexBackground=true;
                }
                const color=parse(style.backgroundColor);
                if(color && color[3]>0) bg=blend(color,bg);
              }
              const ratio=contrast(fg,bg);
              const size=parseFloat(s.fontSize)||0;
              const weight=parseInt(s.fontWeight,10)||400;
              const large=size>=24 || (size>=18.66 && weight>=700);
              const minimum=large?3:4.5;
              const className=typeof el.className==='string'?el.className:'';
              const item={tag:el.tagName.toLowerCase(),className,text:text.slice(0,90),fontSize:size,lineHeight:s.lineHeight,contrast:Number(ratio.toFixed(2)),required:minimum};
              if(size>0 && size<11) issues.push({...item,problem:'text smaller than 11px'});
              if(!hasComplexBackground && size>=11 && ratio<minimum) issues.push({...item,problem:'insufficient text contrast'});
              if(samples.length<4) samples.push(item);
            }
            return {count:nodes.length,issues:issues.slice(0,30),totalIssues:issues.length,samples};
          });
          expect(audit.totalIssues, `${route} ${theme} ${viewport.name}: unreadable text: ${JSON.stringify(audit.issues)}`).toBe(0);
        }
      }
    });
  }
});
