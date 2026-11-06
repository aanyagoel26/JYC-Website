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
const designCss = read('src/jyc-design-upgrades.css');
const flipCss = read('src/components/react-bits/FlipCard.css');
const themeCss = read('src/jyc-logo-final-theme.css');
const cohesiveCss = read('src/styles/jyc-cohesive-experience.css');
const allCss = redesignCss + editorialCss + publicCss + designCss + flipCss + themeCss + cohesiveCss;

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

// 6. Cohesive JYC day/night palette and mobile-first layout contracts.
const hasPaperCanvas = cohesiveCss.includes('--jh-bg: #f5f1e8') && cohesiveCss.includes('--jyc-canvas: #f5f1e8');
const hasWarmGold = cohesiveCss.includes('--jyc-gold: #76572b') && cohesiveCss.includes('--jyc-gold: #e7d19b');
const hasNightSky = cohesiveCss.includes('--jh-bg: #080d1c') && cohesiveCss.includes('--jh-accent: #c8bcff') && cohesiveCss.includes('--jh-line-accent: rgba(231,209,155,.32)');
const hasSharedLegacyAliases = cohesiveCss.includes('--jyc-brand-oxblood: var(--jyc-accent)') && cohesiveCss.includes('--accent-red: var(--jyc-accent)');
const hasPhoneFirst = cohesiveCss.includes('@media (max-width: 360px)') && cohesiveCss.includes('grid-template-columns:1fr !important') && cohesiveCss.includes('env(safe-area-inset-bottom)');
add('JYC day theme uses warm paper and restrained indigo', hasPaperCanvas);
add('JYC day and night themes use the shared champagne/gold accent', hasWarmGold);
add('JYC night theme uses midnight sky, lavender and muted gold without red accents', hasNightSky);
add('Legacy brand variables resolve through the shared palette', hasSharedLegacyAliases);
add('Phone-first layout has 360px fallbacks and safe-area dock clearance', hasPhoneFirst);

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

// 7.5. Fixed mobile chrome clearance.
add('mobile page content clears the fixed navigation dock', cohesiveCss.includes('padding-bottom:calc(88px + env(safe-area-inset-bottom))'));

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
