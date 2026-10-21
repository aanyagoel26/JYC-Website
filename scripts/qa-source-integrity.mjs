import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const sourceRoot=path.join(root,'src');
const extensions=['.js','.jsx','.css'];
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(/\.(?:js|jsx|css)$/.test(entry.name))files.push(p)}}
walk(sourceRoot);
const failures=[];
for(const file of files){
  const text=fs.readFileSync(file,'utf8');
  const re=/(?:from\s*|import\s*)["'](\.[^"']+)["']/g;
  let m;
  while((m=re.exec(text))){
    const ref=m[1];
    const base=path.resolve(path.dirname(file),ref);
    const candidates=[base,...extensions.map(ext=>base+ext),path.join(base,'index.js')];
    if(!candidates.some(fs.existsSync)) failures.push(`${path.relative(root,file)} → ${ref}`);
  }
}
console.log(`${failures.length?'FAIL':'PASS'}: relative source imports resolve (${files.length} files checked)`);
for(const failure of failures.slice(0,30)) console.log(`  ${failure}`);
if(failures.length) process.exit(1);
