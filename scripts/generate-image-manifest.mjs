import fs from 'node:fs';
import path from 'node:path';
import {isDerivativeDimensionEligible,parseImageDimensions} from '../src/jyc-photo-intelligence.js';

const root=path.resolve('public/assets');
const out=path.resolve('public/image-manifest.json');
const {JYC_SOURCE_ARCHIVE_PHOTO_ITEMS,JYC_SOURCE_ARCHIVE_IDENTITY_ASSETS}=await import('../src/jyc-source-media.js');
const derivativeArchiveUrls=new Set(JYC_SOURCE_ARCHIVE_PHOTO_ITEMS.map(item=>String(item?.url||'')));
const derivativeEligible=(url,width,height)=>{
 const pathEligible=url.startsWith('/assets/source-archive/')?derivativeArchiveUrls.has(url):['/assets/hub-photos/','/assets/hub-photos-extra/','/assets/events/','/assets/home/','/assets/team/'].some(prefix=>url.startsWith(prefix));
 return pathEligible&&isDerivativeDimensionEligible(width,height);
};
const allowedArchiveUrls=new Set([...JYC_SOURCE_ARCHIVE_PHOTO_ITEMS,...JYC_SOURCE_ARCHIVE_IDENTITY_ASSETS].map(item=>String(item?.url||'')));
function walk(dir){const out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);e.isDirectory()?out.push(...walk(f)):out.push(f)}return out}
const manifest={version:1,generatedAt:new Date().toISOString(),images:{}};
for(const file of walk(root).filter(f=>/\.(png|jpe?g|webp)$/i.test(f))){try{const d=parseImageDimensions(fs.readFileSync(file));if(!d?.width||!d?.height)continue;const url='/'+path.relative('public',file).split(path.sep).join('/');if(url.startsWith('/assets/photo-derivatives/'))continue;if(url.startsWith('/assets/source-archive/')&&!allowedArchiveUrls.has(url))continue;manifest.images[url]={width:d.width,height:d.height,aspectRatio:Number((d.width/d.height).toFixed(5)),orientation:d.width===d.height?'square':d.width>d.height?'landscape':'portrait',derivativesEligible:derivativeEligible(url,d.width,d.height)}}catch{}}
fs.writeFileSync(out,JSON.stringify(manifest));
console.log('Image manifest: '+Object.keys(manifest.images).length+' images');
