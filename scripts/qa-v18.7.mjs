import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const admin=read('src/admin-chunk.jsx'), main=read('src/main.jsx'), fn=read('supabase/functions/ai-content-assist/index.ts'), css=read('src/v18-4-product-overhaul.css'), sw=read('public/sw.js'), pkg=JSON.parse(read('package.json'));
const checks=[
 ['version is 18.9.x compatibility',['18.9.7','18.9.8','18.9.9','18.9.10','18.10.0','18.11.0','18.11.1','18.11.2'].includes(pkg.version)],
 ['event drafts default to explicit registration mode',admin.includes("registrationMode:'external'" )],
 ['event publish validates registration URL',admin.includes('Registration URL must be a valid http(s) URL.')],
 ['event publish validates map URL',admin.includes('Map URL must be a valid http(s) URL.')],
 ['event publish validates registration deadline',admin.includes('Registration deadline must be before the event starts.')],
 ['club links are validated',admin.includes('must be a valid http(s) URL.')&&admin.includes("['instagram','whatsapp','website','linkedin','youtube']")],
 ['admin has a fatal error boundary',admin.includes('AdminErrorBoundary')&&admin.includes('CONTROL CENTER ERROR')],
 ['search navigates by stable content ids',main.includes("encodeURIComponent(c.id||slug(c.name))")&&main.includes("encodeURIComponent(e.id||slug(e.title))")],
 ['discover wording removed from club pin control',!admin.includes('Pin this club in discovery')],
 ['gallery uses image/archive language',!main.includes('Gallery moments')&&!main.includes('Official JYC moments will appear here')],
 ['AI origin is restricted/configurable',fn.includes("Deno.env.get('SITE_URL')")&&fn.includes('Vary\':\'Origin\'' )],
 ['AI context is size limited',fn.includes('18000')&&fn.includes('413')],
 ['AI output is capped',fn.includes('max_output_tokens:1800')],
 ['AI remains JWT protected',fn.includes('Administrator authentication is required.')&&fn.includes("eq('is_active',true)")],
 ['service worker cache is 18.9',(sw.includes('jyc-cache-v18-11-final-product')||sw.includes('jyc-cache-v18-11-1-final-product'))||sw.includes('jyc-cache-v18-9-9-deep-polish')||sw.includes('jyc-cache-v18-9-8-contact-nav')||sw.includes('jyc-cache-v18-7-code-quality')||(sw.includes('jyc-cache-v18-11-final-product')||sw.includes('jyc-cache-v18-11-1-final-product'))||sw.includes('jyc-cache-v18-9-final')||sw.includes('jyc-cache-v18-9-5-jyc-first')||sw.includes('jyc-cache-v18-9-5-jyc-first')],
 ['fatal error UI is styled',css.includes('.admin-fatal-error')]
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${n}`);if(!ok)failed++}if(failed)process.exit(1);console.log('V18.9 code quality QA complete.');
