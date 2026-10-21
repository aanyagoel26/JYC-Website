const required=['VITE_SUPABASE_URL','VITE_SUPABASE_PUBLISHABLE_KEY'];
const missing=required.filter(k=>!process.env[k]);
if(missing.length){console.log('ENV CHECK: missing '+missing.join(', ')+'. Production/browser verification requires these values.');process.exit(0)}
if(!/^https:\/\/[^/]+\.supabase\.co$/.test(process.env.VITE_SUPABASE_URL)){console.error('ENV CHECK FAIL: invalid Supabase URL');process.exit(1)}
if(/YOUR_|replace|example/i.test(process.env.VITE_SUPABASE_PUBLISHABLE_KEY)){console.error('ENV CHECK FAIL: publishable key looks like a placeholder');process.exit(1)}
console.log('ENV CHECK PASS');
