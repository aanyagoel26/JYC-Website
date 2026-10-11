// Shared, deployment-fresh image manifest loader for gallery metadata and responsive <picture> sources.
let imageManifestPromise=null;

const isRecord=value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);

// Do not trust a non-empty `images` object alone: a stale/error page can still
// return HTTP 200 JSON. Every advertised record must carry dimensions and the
// exact fields used by srcset generation before the payload can be shared.
export function isValidJycImageManifest(payload){
 if(!isRecord(payload)||payload.version!==1||!isRecord(payload.images))return false;
 const entries=Object.entries(payload.images);
 if(!entries.length)return false;
 return entries.every(([url,entry])=>{
  if(!url.startsWith('/assets/')||url.includes('..')||url.includes('?')||url.includes('#')||!isRecord(entry))return false;
  const {width,height,aspectRatio:ratio}=entry;
  if(typeof width!=='number'||!Number.isInteger(width)||width<=0||typeof height!=='number'||!Number.isInteger(height)||height<=0||typeof ratio!=='number'||typeof entry.derivativesEligible!=='boolean')return false;
  if(!Number.isFinite(ratio)||Math.abs(ratio-Number((width/height).toFixed(5)))>0.000001)return false;
  const orientation=width===height?'square':width>height?'landscape':'portrait';
  return entry.orientation===orientation;
 });
}

export function loadJycImageManifest(){
 if(!imageManifestPromise){
  imageManifestPromise=fetch('/image-manifest.json',{cache:'no-cache'})
   .then(response=>{
    if(!response.ok)throw new Error('Image manifest unavailable');
    return response.json();
   })
   .then(payload=>{
    if(isValidJycImageManifest(payload))return payload;
    imageManifestPromise=null;
    return null;
   })
   .catch(()=>{
    // Allow later route mounts to retry after transient HTTP, network or JSON failures.
    imageManifestPromise=null;
    return null;
   });
 }
 return imageManifestPromise;
}
