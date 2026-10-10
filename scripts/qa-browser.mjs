import { spawn, spawnSync } from 'node:child_process';

try { await import('@playwright/test'); }
catch {
  console.error('BROWSER QA NOT RUN: Playwright is not installed. Run `npm install`, then `npx playwright install chromium`.');
  process.exit(2);
}

const env={...process.env};
let preview=null;
let baseUrl=env.JYC_BASE_URL;

if(!baseUrl){
  baseUrl='http://127.0.0.1:4173';
  preview=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'],{
    stdio:'inherit',
    env
  });
  let ready=false;
  for(let attempt=0;attempt<45;attempt++){
    if(preview.exitCode!==null){
      console.error('BROWSER QA FAILED: Vite production preview exited before becoming ready.');
      process.exitCode=1;
      break;
    }
    try{
      const response=await fetch(baseUrl,{signal:AbortSignal.timeout(1500)});
      if(response.ok){ready=true;break}
    }catch{}
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
  if(!ready){
    console.error('BROWSER QA FAILED: production preview did not become ready at '+baseUrl);
    preview.kill('SIGTERM');
    process.exit(1);
  }
}

try{
  const result=spawnSync(process.platform==='win32'?'npx.cmd':'npx',['playwright','test','scripts/browser-smoke.spec.js','scripts/zero-glitch-browser.spec.js'],{
    stdio:'inherit',
    env:{...env,JYC_BASE_URL:baseUrl}
  });
  process.exitCode=result.status??1;
}finally{
  if(preview&&preview.exitCode===null)preview.kill('SIGTERM');
}
