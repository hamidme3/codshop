import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

function runTests() {
  console.log('=== Running Admin Theme Redesign & Commerce Verification Tests ===\n');

  // Test 1: Verify globals.css defines Shopify Polaris Light & Stripe Dark tokens
  console.log('1. Verifying CSS design tokens in globals.css...');
  const globalsCss = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf-8');
  assert(globalsCss.includes('--admin-bg-base: #f8fafc'), 'Light theme must use #f8fafc base');
  assert(globalsCss.includes('--admin-bg-surface: #ffffff'), 'Light theme must use #ffffff surface');
  assert(globalsCss.includes('--admin-border: #e2e8f0'), 'Light theme must use #e2e8f0 border');
  assert(globalsCss.includes('--admin-text-primary: #0f172a'), 'Light theme must use slate-900 primary text');
  assert(globalsCss.includes('--admin-bg-base: #090d16'), 'Dark theme must use #090d16 base');
  assert(globalsCss.includes('--admin-bg-surface: #111827'), 'Dark theme must use #111827 surface');
  assert(globalsCss.includes('--admin-card-shadow:'), 'Admin must define crisp e-commerce card shadow');
  console.log('  ✓ Design tokens for both Light (Shopify Polaris) and Dark (Stripe) verified.\n');

  // Test 2: Verify StoreSwitcher does NOT display raw DNS hostnames
  console.log('2. Verifying StoreSwitcher e-commerce UX...');
  const storeSwitcher = fs.readFileSync(path.join(process.cwd(), 'src/components/admin/StoreSwitcher.tsx'), 'utf-8');
  assert(!storeSwitcher.includes('{currentStore.slug}.codshop.vipone.site'), 'Must not display raw hostname for current store');
  assert(!storeSwitcher.includes('{s.slug}.codshop.vipone.site'), 'Must not display raw hostname for stores in dropdown');
  assert(storeSwitcher.includes('Boutique en ligne'), 'Must display clean e-commerce store status');
  console.log('  ✓ StoreSwitcher uses clean e-commerce store selector without raw DNS hostnames.\n');

  // Test 3: Verify Overview Page (admin/page.tsx) uses clean e-commerce styling
  console.log('3. Verifying Overview Command Center (admin/page.tsx)...');
  const overviewPage = fs.readFileSync(path.join(process.cwd(), 'src/app/admin/page.tsx'), 'utf-8');
  assert(!overviewPage.includes('Tableau de Bord Exécutif —'), 'Removed sysadmin-style header');
  assert(!overviewPage.includes('● TEMPS RÉEL'), 'Removed sysadmin-style green telemetry badge');
  assert(overviewPage.includes('Tableau de bord —'), 'Uses clean merchant welcome header');
  assert(overviewPage.includes('Boutique active'), 'Uses clean retail active store badge');
  assert(overviewPage.includes('bento-card'), 'Uses bento-card CSS class');
  console.log('  ✓ Overview page is styled as a modern e-commerce dashboard.\n');

  // Test 4: Verify Admin Theme Toggle component exists and layout includes it
  console.log('4. Verifying AdminThemeToggle & AdminThemeProvider...');
  const layoutPage = fs.readFileSync(path.join(process.cwd(), 'src/app/admin/layout.tsx'), 'utf-8');
  assert(layoutPage.includes('AdminThemeProvider'), 'Layout must wrap with AdminThemeProvider');
  assert(layoutPage.includes('AdminThemeToggle'), 'Layout must include theme toggle in header');
  assert(!layoutPage.includes('● Opérationnel'), 'Layout must not show server daemon pulse status');
  console.log('  ✓ Interactive theme switcher is integrated into the admin header.\n');

  console.log('🎉 ALL ADMIN THEME REDESIGN VERIFICATION TESTS PASSED (100% SUCCESS)!\n');
}

runTests();
