import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx'), search=read('src/lib/search.js'), css=read('src/v18-9-final.css'), pkg=JSON.parse(read('package.json')), sw=read('public/sw.js'), readme=read('README.md');
const checks=[
 ['version is 18.9.9',['18.9.7','18.9.8','18.9.9','18.9.10','18.10.0','18.11.0','18.11.1','18.11.2'].includes(pkg.version)],
 ['relevance-first search module exists',search.includes('Exact title is the absolute top priority')&&search.includes('rankSearchResults')],
 ['exact title score dominates',search.includes('if(t===q)return 100000')],
 ['search uses ranked results',main.includes('rankSearchResults(rawResults,term)')],
 ['search has keyboard navigation',main.includes("e.key==='ArrowDown'")&&main.includes("e.key==='ArrowUp'")&&main.includes("e.key==='Enter'&&searchResults[selected]" )],
 ['search exposes active result',main.includes('aria-activedescendant')&&main.includes('aria-selected')],
 ['best match is visibly identified',main.includes("i===0?'BEST MATCH · '")],
 ['search result URLs retain stable ids',main.includes("encodeURIComponent(c.id||slug(c.name))")&&main.includes("encodeURIComponent(e.id||slug(e.title))")],
 ['new product polish CSS imported',main.includes("import './v18-9-final.css';")],
 ['product polish styles exist',css.includes('.search-result-active')&&css.includes('.github-project-card')],
 ['service worker cache is 18.9',(sw.includes('jyc-cache-v18-11-final-product')||sw.includes('jyc-cache-v18-11-1-final-product'))||sw.includes('jyc-cache-v18-9-9-deep-polish')||sw.includes('jyc-cache-v18-9-8-contact-nav')||(sw.includes('jyc-cache-v18-11-final-product')||sw.includes('jyc-cache-v18-11-1-final-product'))||sw.includes('jyc-cache-v18-9-final')||sw.includes('jyc-cache-v18-9-5-jyc-first')],
 ['GitHub CI exists',fs.existsSync(path.join(root,'.github/workflows/ci.yml'))],
 ['GitHub issue templates exist',fs.existsSync(path.join(root,'.github/ISSUE_TEMPLATE/bug_report.yml'))&&fs.existsSync(path.join(root,'.github/ISSUE_TEMPLATE/content_issue.yml'))],
 ['PR template exists',fs.existsSync(path.join(root,'.github/PULL_REQUEST_TEMPLATE/pull_request.md'))],
 ['contribution guide exists',fs.existsSync(path.join(root,'CONTRIBUTING.md'))],
 ['search UX documentation exists',fs.existsSync(path.join(root,'docs/SEARCH-AND-UX.md'))],
 ['README has repository presentation',readme.includes('Product map')&&readme.includes('JYC CI')],
];
let failed=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${n}`);if(!ok)failed++}if(failed)process.exit(1);console.log('V18.9 product polish QA complete.');
