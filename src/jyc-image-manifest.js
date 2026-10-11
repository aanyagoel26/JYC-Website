// Shared, deployment-fresh image manifest loader for gallery metadata and responsive <picture> sources.
let imageManifestPromise=null;

export function loadJycImageManifest(){
 if(!imageManifestPromise){
  imageManifestPromise=fetch('/image-manifest.json',{cache:'no-cache'})
   .then(response=>{
    if(!response.ok)throw new Error('Image manifest unavailable');
    return response.json();
   })
   .catch(()=>{
    // Allow later route mounts to retry after transient HTTP, network or JSON failures.
    imageManifestPromise=null;
    return null;
   });
 }
 return imageManifestPromise;
}
