import { spawnSync } from 'node:child_process';

try { await import('@playwright/test'); }
catch {
  console.error('BROWSER QA NOT RUN: Playwright is not installed. Run `npm install`, then `npx playwright install chromium firefox webkit`.');
  process.exit(2);
}

// Playwright's webServer owns the dev/production-preview lifecycle. Starting
// another Vite preview here duplicated the server in CI and wasted memory.
const baseUrl=process.env.JYC_BASE_URL||'http://127.0.0.1:5173';
const result=spawnSync(process.platform==='win32'?'npx.cmd':'npx',['playwright','test','--project=mobile-320','--project=mobile-360','--project=mobile-390','--project=mobile-430','--project=tablet-768','--project=tablet-1024','--project=desktop-1280','--project=desktop-1440','--project=desktop-1920','--project=dark-theme','--project=search-more','--project=team-directory','--project=about-interactions','--project=compat-chromium','--project=compat-firefox','--project=compat-webkit','--project=text-readability','--project=motion-accessibility','--project=visual-matrix','scripts/browser-smoke.spec.js','scripts/zero-glitch-browser.spec.js','scripts/mobile-320-layout.spec.js','scripts/jyc-dark-theme.spec.js','scripts/overlay-experience.spec.js','scripts/team-directory.spec.js','scripts/cross-browser-smoke.spec.js','scripts/text-readability.spec.js','scripts/motion-system.spec.js','scripts/visual-route-matrix.spec.js'],{
  stdio:'inherit',
  env:{...process.env,JYC_BASE_URL:baseUrl}
});
process.exitCode=result.status??1;
