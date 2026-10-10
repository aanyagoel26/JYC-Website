import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const {JYC_SOURCE_ARCHIVE_PHOTO_ITEMS}=await import('../src/jyc-source-media.js');
const allowedArchive=new Set(JYC_SOURCE_ARCHIVE_PHOTO_ITEMS.map(item=>String(item?.url||'')));
const root=path.resolve('public/assets');
const outputRoot=path.resolve('public/assets/photo-derivatives');
const WIDTHS=[480,960,1600];
// Keep Vercel's small build machines responsive: Sharp already uses native workers,
// so a small JS work queue avoids turning derivative generation into a serial bottleneck
// without oversubscribing a 2-core builder.
sharp.concurrency(Math.min(2,Math.max(1,Number(process.env.JYC_SHARP_CONCURRENCY||2))));
const CONCURRENCY=Math.min(2,Math.max(1,Number(process.env.JYC_DERIVATIVE_CONCURRENCY||2)));
const ALLOWED=['source-archive','hub-photos','hub-photos-extra'];
const inputFiles=[];
const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(/\.(jpe?g|png|webp)$/i.test(file))inputFiles.push(file)}};
walk(root);
const sourceFiles=inputFiles.filter(file=>{if(file.includes(path.join('photo-derivatives',path.sep)))return false;const url='/assets/'+path.relative(root,file).replaceAll(path.sep,'/');if(url.startsWith('/assets/source-archive/'))return allowedArchive.has(url);return ALLOWED.some(folder=>url.startsWith('/assets/'+folder+'/'));});
let generated=0,failed=0,skipped=0,completed=0;
const processFile=async file=>{
 const rel=path.relative(root,file).replaceAll(path.sep,'/');
 const base=rel.replace(/\.(jpe?g|png|webp)$/i,'');
 const outDir=path.join(outputRoot,path.dirname(rel));
 fs.mkdirSync(outDir,{recursive:true});
 try{
  const meta=await sharp(file).metadata();
  if(!meta.width||!meta.height){skipped++;return}
  for(const width of WIDTHS){
   if(width>meta.width)continue;
   for(const format of ['avif','webp']){
    const out=path.join(outDir,path.basename(base)+'-'+width+'.'+format);
    if(fs.existsSync(out))continue;
    const pipeline=sharp(file).rotate().resize({width,withoutEnlargement:true});
    if(format==='avif')await pipeline.avif({quality:52,effort:2}).toFile(out);
    else await pipeline.webp({quality:82,effort:3}).toFile(out);
    generated++;
   }
  }
 }catch(error){failed++;console.warn('Derivative failed:',rel,error?.message||error)}
 finally{
  completed++;
  if(completed%25===0||completed===sourceFiles.length)console.log('Photo derivatives: '+completed+'/'+sourceFiles.length+' files processed');
 }
};
let cursor=0;
const workers=Array.from({length:Math.min(CONCURRENCY,sourceFiles.length)},async()=>{
 while(true){
  const index=cursor++;
  if(index>=sourceFiles.length)return;
  await processFile(sourceFiles[index]);
 }
});
await Promise.all(workers);
console.log('Photo derivatives: generated='+generated+' skipped='+skipped+' failed='+failed+' concurrency='+Math.min(CONCURRENCY,sourceFiles.length));
if(failed>0)process.exitCode=1;
