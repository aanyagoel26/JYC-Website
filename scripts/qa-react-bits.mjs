import fs from 'node:fs';
const root=process.cwd();
const read=p=>fs.readFileSync(new URL(p,import.meta.url).pathname.replace(/scripts[\\/]qa-react-bits\.mjs$/,'')+p,'utf8');
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
const main=read('src/main.jsx');
const now=read('src/jyc-now.jsx');
const bits=read('src/react-bits/JYCMicro.jsx');
const css=read('src/react-bits/JYCMicro.css');
const checks=[
 ['React Bits dependency declared',pkg.dependencies.motion==='12.23.22'&&pkg.dependencies['@hugeicons/react']==='1.1.10'&&pkg.dependencies['@hugeicons/core-free-icons']==='4.3.5'],
 ['lockfile root matches',lock.packages[''].dependencies.motion==='12.23.22'&&lock.packages[''].dependencies['@hugeicons/react']==='1.1.10'],
 ['React Bits components present',/BellToggle|JellyRadio|RubberSegment|FlipCard|BorderGlow/.test(bits)],
 ['Motion is lazy-loaded',main.includes("LazyRubberSegment")&&main.includes("LazyBorderGlow")&&main.includes("LazyBellToggle")],
 ['JYC Now uses JellyRadio',now.includes('LazyJellyRadio')&&now.includes('Filter JYC Now by community')],
 ['event view uses RubberSegment',main.includes('LazyRubberSegment')&&main.includes('Event view')],
 ['event reminders use BellToggle',main.includes('EventReminderControl')&&main.includes('scheduleEventReminder')],
 ['Agentic AI popup uses BorderGlow',main.includes('AgenticAIPopup')&&main.includes('LazyBorderGlow')&&main.includes('demo-agentic-ai-website.vercel.app')],
 ['React Bits reduced motion styles exist',css.includes('prefers-reduced-motion')],
 ['no public Control Center launcher added',!main.includes('Control Center</button>')&&!main.includes('Control Center ↗')]
];
let failed=0;for(const[c,ok]of checks){console.log((ok?'PASS':'FAIL')+' · '+c);if(!ok)failed++}process.exit(failed?1:0);
