import fs from 'node:fs';

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
const root=lock.packages?.[''];
const failures=[];
const check=(ok,msg)=>{if(!ok)failures.push(msg);console.log((ok?'PASS':'FAIL')+' · '+msg)};

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

if(failures.length){console.error(`Dependency lock contract failed with ${failures.length} issue(s).`);process.exit(1)}
console.log('DEPENDENCY LOCK CONTRACT PASS');
