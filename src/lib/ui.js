export function jycToast(message,type='success'){
  if(typeof window==='undefined') return;
  window.dispatchEvent(new CustomEvent('jyc-toast',{detail:{message:String(message||''),type}}));
}
export function jycConfirm({title='Are you sure?',text='',confirmLabel='Confirm',danger=false}={}){
  if(typeof window==='undefined') return Promise.resolve(false);
  return new Promise(resolve=>window.dispatchEvent(new CustomEvent('jyc-confirm',{detail:{title,text,confirmLabel,danger,resolve}})));
}
