import fs from 'node:fs';

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
const root=lock.packages?.[''];
const failures=[];
const check=(ok,msg)=>{if(!ok)failures.push(msg);console.log((ok?'PASS':'FAIL')+' · '+msg)};
const nodeVersion=String(pkg.engines?.node||'');
check(nodeVersion==='>=24 <25','package runtime is pinned to Node 24');
check(fs.readFileSync('.nvmrc','utf8').trim()==='24','nvmrc matches Node 24');
for(const workflow of ['ci.yml','jyc-browser.yml','jyc-quality.yml','legacy-redirect-check.yml','legacy-route-matrix.yml','unknown-route-check.yml']){
  const workflowText=fs.readFileSync('.github/workflows/'+workflow,'utf8');
  check(!workflowText.includes('node-version: 22'),'workflow '+workflow+' does not run the stale Node 22 runtime');
  check(workflowText.includes('node-version: 24'),'workflow '+workflow+' runs Node 24');
}

check(lock.name===pkg.name,'package-lock name matches package name');
check(lock.version===pkg.version,'package-lock version matches package version');
check(root?.name===pkg.name,'lock root package name matches');
check(root?.version===pkg.version,'lock root package version matches');

for(const [section,declared] of Object.entries({dependencies:pkg.dependencies||{},devDependencies:pkg.devDependencies||{}})){
  for(const [name,range] of Object.entries(declared)){
    const locked=root?.[section]?.[name];
    check(Boolean(locked),`${section} dependency is locked: ${name}`);
    if(locked) check(typeof locked==='string' && locked===range,`${section} lock spec matches package.json: ${name}`);
  }
}

const sharpLock=lock.packages?.['node_modules/sharp'];
if(pkg.devDependencies?.sharp){
  check(Boolean(sharpLock), 'sharp is present in the lockfile');
  for(const name of Object.keys(sharpLock?.optionalDependencies||{})) check(Boolean(lock.packages?.['node_modules/'+name]), 'sharp optional platform dependency is locked: '+name);
}
if(failures.length){console.error(`Dependency lock contract failed with ${failures.length} issue(s).`);process.exit(1)}
console.log('DEPENDENCY LOCK CONTRACT PASS');
