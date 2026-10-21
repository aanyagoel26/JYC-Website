#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';

const exts=new Set(['.jpg','.jpeg','.png','.webp','.avif','.gif','.svg','.heic']);
const args=process.argv.slice(2);
if(!args.length){
  console.error('Usage: node scripts/inventory-image-archives.mjs <archive.zip> [...]');
  process.exit(1);
}
const temp=path.join('.tmp-image-inventory');
fs.rmSync(temp,{recursive:true,force:true});
fs.mkdirSync(temp,{recursive:true});

const archives=[];
for(const archive of args){
  if(!fs.existsSync(archive)) throw new Error('Archive not found: '+archive);
  const dir=path.join(temp,path.basename(archive,'.zip'));
  fs.mkdirSync(dir,{recursive:true});
  execFileSync('unzip',['-q',archive,'-d',dir]);
  const files=[];
  const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory())walk(p);else if(exts.has(path.extname(p).toLowerCase()))files.push(p);}};
  walk(dir);
  archives.push({archive,count:files.length,files:files.map(f=>{const bytes=fs.readFileSync(f);return {path:f.slice(dir.length+1),bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}})});
}

const sourceRoots=['src','public'];
const sourceFiles=[];
const walk=d=>{if(!fs.existsSync(d))return;for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory())walk(p);else if(/\.(jsx?|css|html|json|md)$/i.test(p))sourceFiles.push(p);}};
sourceRoots.forEach(walk);
const sourceText=sourceFiles.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const used=new Set();
for(const m of sourceText.matchAll(/(?:["'\`])?(\/assets\/[^"'\`\s)]+\.(?:jpg|jpeg|png|webp|avif|gif|svg))(?:["'\`])?/gi))used.add(m[1]);

const flat=archives.flatMap(a=>a.files.map(f=>({archive:a.archive,file:f.path,base:path.basename(f.path),bytes:f.bytes,sha256:f.sha256})));
const byBase=new Map();
for(const x of flat){const b=x.base.toLowerCase();if(!byBase.has(b))byBase.set(b,[]);byBase.get(b).push(x);}
const usedNames=new Set([...used].map(x=>path.basename(x).toLowerCase()));
const usedArchive=flat.filter(x=>usedNames.has(x.base.toLowerCase()));
const unusedArchive=flat.filter(x=>!usedNames.has(x.base.toLowerCase()));

const uniqueHashes=new Set(flat.map(x=>x.sha256));
const duplicateRelationships=flat.length-uniqueHashes.size;
console.log(JSON.stringify({
  archives:archives.map(a=>({archive:a.archive,count:a.count,bytes:a.files.reduce((n,x)=>n+x.bytes,0),uniqueHashes:new Set(a.files.map(x=>x.sha256)).size})),
  archiveTotal:flat.length,
  uniqueArchiveFilenames:byBase.size,
  repoExplicitAssetReferences:used.size,
  archiveFilesMatchingRepoAssetBasenames:usedArchive.length,
  archiveFilesNotMatchingRepoAssetBasenames:unusedArchive.length,
  duplicatesInArchives:duplicateRelationships,
  uniqueImageHashes:uniqueHashes.size,
  exactDuplicateRelationships:duplicateRelationships
},null,2));
fs.rmSync(temp,{recursive:true,force:true});
