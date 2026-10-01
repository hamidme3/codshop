import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Color Contrast & Adaptive Theme Integrity Suite', () => {
  test('LanguageToggle is adaptive in light and dark mode', () => {
    const filePath = path.join(process.cwd(), 'src/components/LanguageToggle.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    // Must have light and dark background classes
    assert.match(content, /bg-slate-100 dark:bg-slate-950/);
    assert.match(content, /border-slate-200 dark:border-slate-800/);
    assert.match(content, /text-slate-600 hover:text-slate-900.*dark:text-slate-400 dark:hover:text-white/);
  });

  test('Admin Orders Kanban card and action buttons are adaptive', () => {
    const filePath = path.join(process.cwd(), 'src/app/(app)/admin/orders/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    // Kanban card background must be adaptive
    assert.match(content, /bg-white hover:bg-slate-50 dark:bg-\[#13171c\]/);
    assert.match(content, /text-slate-900 dark:text-white.*order\.customerName/);

    // Direct call button must be adaptive
    assert.match(content, /bg-slate-100 hover:bg-slate-200.*dark:bg-slate-800.*dark:text-slate-300/);
    // Suspense fallback must not be hardcoded text-white
    assert.doesNotMatch(content, /<Suspense fallback={<div className="p-8 text-white">/);
  });

  test('Admin Customers header and refresh button are adaptive', () => {
    const filePath = path.join(process.cwd(), 'src/app/(app)/admin/customers/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    // Title must be adaptive
    assert.match(content, /text-slate-900 dark:text-white tracking-tight flex items-center gap-2\.5/);
    // Refresh button must be adaptive
    assert.match(content, /bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900.*dark:bg-zinc-900/);
    // Suspense fallback must not be hardcoded text-white
    assert.doesNotMatch(content, /<Suspense fallback={<div className="p-8 text-white">/);
  });

  test('Admin KYC Identity header is adaptive', () => {
    const filePath = path.join(process.cwd(), 'src/app/(app)/admin/identity/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    // H1 title must be adaptive
    assert.match(content, /text-2xl font-black text-slate-900 dark:text-white tracking-tight/);
    assert.match(content, /text-slate-500 dark:text-zinc-400/);
  });

  test('Admin Support Ticket detail page is adaptive', () => {
    const filePath = path.join(process.cwd(), 'src/app/(app)/admin/support/tickets/[id]/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    // Header card must be adaptive
    assert.match(content, /bg-white dark:bg-slate-900\/80 border border-slate-200 dark:border-slate-800/);
    // Subject title must be adaptive
    assert.match(content, /text-xl font-bold text-slate-900 dark:text-white tracking-tight/);
    // Reply form must be adaptive
    assert.match(content, /bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/);
    assert.match(content, /bg-slate-50 dark:bg-slate-800\/80.*text-slate-900 dark:text-white/);
  });

  test('Storefront Policy page 404 state uses theme CSS variables', () => {
    const filePath = path.join(process.cwd(), 'src/app/(app)/p/[slug]/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    // 404 title and description must use CSS variables
    assert.match(content, /style=\{\{ color: 'var\(--theme-text-primary\)' \}\}>Page Non Trouvée/);
    assert.match(content, /style=\{\{ color: 'var\(--theme-text-secondary\)' \}\}/);
    // Reassurance banner must not have white text on pastel background
    assert.match(content, /style=\{\{ color: 'var\(--theme-text-primary\)' \}\}>/);
  });

  test('Admin Suspense fallbacks do not use invisible text-white on light backgrounds', () => {
    const files = [
      'src/app/(app)/admin/orders/page.tsx',
      'src/app/(app)/admin/customers/page.tsx',
      'src/app/(app)/admin/funnel/page.tsx',
      'src/app/(app)/admin/payments/page.tsx',
      'src/app/(app)/admin/billing/page.tsx'
    ];

    for (const f of files) {
      const content = fs.readFileSync(path.join(process.cwd(), f), 'utf8');
      assert.doesNotMatch(
        content,
        /<Suspense fallback={<div className="p-8 text-white">/,
        `File ${f} must not have text-white in Suspense fallback`
      );
    }
  });
});
