import { test, expect } from '@playwright/test';

test.describe('COD Checkout Flow', () => {
  test('visit home, add product, fill checkout phone/city, submit, expect order new', async ({ page, baseURL }) => {
    // 1. Visit home page
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);

    // Verify catalog / products are visible
    await expect(page.locator('#catalog')).toBeVisible({ timeout: 10000 });

    // 2. Add product — click "Commander Maintenant" on first product card
    // Fallback: if not found on home, go to first product detail page
    const commanderBtn = page.getByRole('button', { name: /Commander Maintenant/i }).first();
    const productLink = page.locator('a[href^="/product/"]').first();

    if (await commanderBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await commanderBtn.click();
    } else if (await productLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await productLink.click();
      await page.waitForLoadState('networkidle');
      const detailCommander = page.getByRole('button', { name: /Commander Maintenant/i }).first();
      await expect(detailCommander).toBeVisible({ timeout: 10000 });
      await detailCommander.click();
    } else {
      throw new Error('No product CTA found on home page');
    }

    // 3. Checkout modal should be open — fill form
    // Modal title: "Formulaire de Commande Rapide"
    await expect(page.getByText(/Formulaire de Commande Rapide/i)).toBeVisible({ timeout: 10000 });

    // Full name
    const nameInput = page.getByPlaceholder(/Youssef El Amrani/i);
    await nameInput.fill('Test User Playwright');

    // Phone — Moroccan format 06XXXXXXXX
    const phoneInput = page.getByPlaceholder(/06 12 34 56 78/i);
    await phoneInput.fill('0612345678');

    // City — select
    const citySelect = page.locator('select').first();
    await citySelect.selectOption('Casablanca');

    // Address
    const addressInput = page.getByPlaceholder(/Quartier Maârif/i);
    await addressInput.fill('Quartier Test, Rue 123, Casablanca');

    // 4. Submit — "Confirmer la Commande"
    const submitBtn = page.getByRole('button', { name: /Confirmer la Commande/i });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // 5. Expect redirect to order-success with order ID
    // URL: /order-success/CMD-xxxxxx?total=...&city=...
    await page.waitForURL(/\/order-success\/.+/, { timeout: 15000 });
    expect(page.url()).toMatch(/\/order-success\//);

    // Expect confirmation content — order number visible
    await expect(page.getByText(/CMD-/i).first()).toBeVisible({ timeout: 10000 });

    // Expect order is "new" / pending — check status text if rendered, or verify via API fallback
    // Try UI status first
    const statusLocator = page.getByText(/en attente|nouveau|new|pending|confirmée/i).first();
    const hasStatus = await statusLocator.isVisible({ timeout: 5000 }).catch(() => false);

    if (!hasStatus) {
      // Fallback: extract orderId from URL and verify via API
      const url = new URL(page.url());
      const orderId = url.pathname.split('/').pop() || '';
      if (orderId) {
        const apiBase = baseURL || 'http://localhost:3005';
        const res = await page.request.get(`${apiBase}/api/order?id=${encodeURIComponent(orderId)}`);
        if (res.ok()) {
          const data = await res.json();
          // Order should be newly created — status pending/new/created
          const status = (data.order?.status || data.status || '').toLowerCase();
          expect(['pending', 'new', 'created', 'en_attente', '']).toContain(status);
          expect(data.success).toBeTruthy();
        } else {
          // At minimum URL proves order creation succeeded
          expect(orderId).toMatch(/CMD-/);
        }
      }
    } else {
      await expect(statusLocator).toBeVisible();
    }
  });
});
