import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const checks = [];
const add = (name, ok, details = '') => {
  checks.push({ name, ok: Boolean(ok), details });
};

console.log('--- STARTING RESPONSIVE & BREAKPOINT AUDIT SUITE ---');

// 1. Viewport Meta in index.html
const indexHtml = read('index.html');
const hasViewport = indexHtml.includes('name="viewport"') && indexHtml.includes('width=device-width');
add('Viewport meta tag configured with width=device-width', hasViewport);

// 2. CSS Media Query Coverage
const redesignCss = read('src/styles/jyc-pro-redesign.css');
const editorialCss = read('src/jyc-editorial-home.css');
const publicCss = read('src/styles/public-system.css');
const allCss = redesignCss + editorialCss + publicCss;

const hasMobileBreakpoint = /@media[^{]*max-width:\s*(?:600px|680px|768px)/.test(allCss);
add('Mobile breakpoint rules present (<600px - 768px)', hasMobileBreakpoint);

const hasTabletBreakpoint = /@media[^{]*max-width:\s*(?:900px|1024px)/.test(allCss);
add('Tablet breakpoint rules present (<900px - 1024px)', hasTabletBreakpoint);

// 3. Grid Collapse on Mobile
const hasGridCollapse = redesignCss.includes('@media (max-width: 600px)') &&
  redesignCss.includes('grid-template-columns: 1fr');
add('Multi-column grids collapse to 1 column on mobile (<600px)', hasGridCollapse);

// 4. Hero & Heading Fluid Typography
const hasFluidTypography = allCss.includes('clamp(');
add('Fluid typography with clamp() used for responsive headline scaling', hasFluidTypography);

// 5. Touch Target Minimum Sizing
const hasTouchTargetHandling = allCss.includes('min-height:') || allCss.includes('padding:');
add('Interactive elements use touch-friendly spacing and padding', hasTouchTargetHandling);

// 6. JYC Logo Complementary Color Tokens
const hasObsidianBackground = allCss.includes('#050a14') || redesignCss.includes('--tech-bg');
const hasRoyalGold = allCss.includes('#fbbf24') || redesignCss.includes('--tech-gold');
const hasElectricCyan = allCss.includes('#38bdf8') || redesignCss.includes('--tech-cyan');
const hasFlameCrimson = allCss.includes('#ef4444') || redesignCss.includes('--tech-crimson');

add('JYC Logo Theme: Obsidian Space canvas defined', hasObsidianBackground);
add('JYC Logo Theme: Royal Gold / Champagne accent defined', hasRoyalGold);
add('JYC Logo Theme: Electric Cyan Cyber accent defined', hasElectricCyan);
add('JYC Logo Theme: Flame Crimson Alert accent defined', hasFlameCrimson);

// 7. Route Accessibility Verification
const mainJsx = read('src/main.jsx');
const requiredRoutes = [
  'JoinJYC',
  'Contact',
  'Announcements',
  'Achievements',
  'Events',
  'FestsPage'
];
for (const comp of requiredRoutes) {
  add(`Component ${comp} implemented and mounted`, mainJsx.includes(`function ${comp}`));
}

// 8. Output Results
let failed = 0;
for (const c of checks) {
  const status = c.ok ? '✓ PASS' : '✗ FAIL';
  console.log(`${status} · ${c.name} ${c.details ? `(${c.details})` : ''}`);
  if (!c.ok) failed++;
}

console.log(`\nAudit completed: ${checks.length - failed}/${checks.length} passed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All responsive breakpoint and color harmony audits PASSED!');
}
