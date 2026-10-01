import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateStandardPolicies } from '../src/lib/policy-generator';
import {
  getStorePagesMock,
  getStorePageBySlugMock,
  createOrUpdateStorePageMock,
  deleteStorePageMock,
  generateStandardStorePoliciesMock,
  MOCK_PAGES_STORE,
} from '../src/lib/mocks';
import { validateMenuNesting } from '../src/lib/mocks';
import type { MenuItem } from '../src/lib/types';
import { GET as getPages, POST as postPages } from '../src/app/api/stores/[slug]/pages/route';
import {
  GET as getSinglePage,
  PUT as putSinglePage,
  DELETE as deleteSinglePage,
} from '../src/app/api/stores/[slug]/pages/[pageSlug]/route';
import { POST as generatePoliciesRoute } from '../src/app/api/stores/[slug]/pages/generate-policies/route';
import { NextRequest } from 'next/server';

describe('Custom Pages, Standard Legal Policies & Menu Integration Test Suite', () => {
  const storeSlug = 'test-leather-store';

  describe('1. Standard Legal Policy Generator & Compliance', () => {
    test('Generates 5 standard Moroccan COD legal policy pages with customized context', () => {
      const policies = generateStandardPolicies({
        storeName: 'Atlas Cuir Luxe',
        storeSlug: 'atlas-cuir',
        phone: '+212 6 12 34 56 78',
        email: 'contact@atlascuir.ma',
        city: 'Fès',
        currency: 'MAD',
        deliveryTimeframe: '24h à 48h',
        freeShippingThreshold: 500,
      });

      assert.equal(policies.length, 5, 'Must generate exactly 5 policies');

      const slugs = policies.map((p) => p.slug);
      assert.ok(slugs.includes('terms'), 'Must include terms');
      assert.ok(slugs.includes('privacy'), 'Must include privacy');
      assert.ok(slugs.includes('shipping-policy'), 'Must include shipping-policy');
      assert.ok(slugs.includes('returns'), 'Must include returns');
      assert.ok(slugs.includes('about-us'), 'Must include about-us');

      // Verify placeholder replacements
      const terms = policies.find((p) => p.slug === 'terms')!;
      assert.ok(terms.content.includes('Atlas Cuir Luxe'), 'Must contain store name');
      assert.ok(terms.content.includes('Fès'), 'Must contain city');
      assert.ok(terms.content.includes('+212 6 12 34 56 78'), 'Must contain phone');
      assert.ok(terms.content.includes('contact@atlascuir.ma'), 'Must contain email');
      assert.ok(terms.content.includes('MAD'), 'Must contain MAD currency');
    });

    test('STRICT RULE: NO 3rd-party carriers in shipping policy or any other legal document', () => {
      const policies = generateStandardPolicies({
        storeName: 'Casa Store',
        storeSlug: 'casa-store',
      });

      const allContent = policies.map((p) => p.content).join('\n');
      const forbiddenCarriers = ['ozon', 'sendit', 'cathedis', 'amana', 'poste maroc', 'chronopost', 'aramex', 'dhl'];

      for (const carrier of forbiddenCarriers) {
        assert.equal(
          allContent.toLowerCase().includes(carrier),
          false,
          `Forbidden 3rd-party carrier "${carrier}" must NOT appear in any policy content!`
        );
      }

      // Verify internal direct delivery team statement
      const shipping = policies.find((p) => p.slug === 'shipping-policy')!;
      assert.ok(
        shipping.content.includes('notre équipe') || shipping.content.includes('notre réseau de livreurs'),
        'Shipping policy must specify internal/direct delivery personnel'
      );
    });

    test('Moroccan Parcel Inspection Guarantee clause is explicitly present', () => {
      const policies = generateStandardPolicies({
        storeName: 'Marrakech Artisanat',
        storeSlug: 'kech-art',
      });

      const shipping = policies.find((p) => p.slug === 'shipping-policy')!;
      assert.ok(
        shipping.content.includes('Inspection Autorisée') || shipping.content.includes('Inspection Avant Paiement'),
        'Must contain Parcel Inspection Guarantee header'
      );
      assert.ok(
        shipping.content.includes('عاين سلعتك'),
        'Must contain authentic Darija parcel inspection reassurance (عاين سلعتك)'
      );
    });

    test('Universal personal data protection and COD privacy compliance', () => {
      const policies = generateStandardPolicies({
        storeName: 'Global Tech Store',
        storeSlug: 'global-tech',
      });

      const privacy = policies.find((p) => p.slug === 'privacy')!;
      assert.ok(
        privacy.content.includes('Protection des Données Personnelles'),
        'Privacy policy must specify personal data protection'
      );
      assert.ok(
        privacy.content.includes('aucune coordonnée bancaire'),
        'Must assure buyers that no banking cards are processed since it is COD'
      );
      assert.ok(
        privacy.content.includes("d'accès") && privacy.content.includes('rectification'),
        'Must guarantee right to access and rectify personal data'
      );
    });

    test('Universal multi-country policy generation adapts country and currency dynamically', () => {
      const saudiPolicies = generateStandardPolicies({
        storeName: 'Riyadh Perfumes',
        storeSlug: 'riyadh-perfumes',
        country: 'SA',
        city: 'Riyadh',
      });

      const saudiTerms = saudiPolicies.find((p) => p.slug === 'terms')!;
      assert.ok(saudiTerms.content.includes('SAR'), 'Must adapt currency to SAR for Saudi Arabia');
      assert.ok(saudiTerms.content.includes('Arabie Saoudite'), 'Must include country name');

      const uaePolicies = generateStandardPolicies({
        storeName: 'Dubai Gadgets',
        storeSlug: 'dubai-gadgets',
        country: 'AE',
        city: 'Dubai',
      });

      const uaeShipping = uaePolicies.find((p) => p.slug === 'shipping-policy')!;
      assert.ok(uaeShipping.content.includes('AED'), 'Must adapt currency to AED for UAE');
      assert.ok(uaeShipping.content.includes('Émirats Arabes Unis'), 'Must include country name');
    });
  });

  describe('2. In-Memory Mock Store & Repository Methods', () => {
    test('Generates default store pages and retrieves them', () => {
      delete MOCK_PAGES_STORE[storeSlug];
      const pages = getStorePagesMock(storeSlug);
      assert.ok(pages.length >= 5, 'Should initialize with at least 5 standard pages');

      const terms = getStorePageBySlugMock(storeSlug, 'terms');
      assert.ok(terms, 'Must retrieve terms by slug');
      assert.equal(terms.slug, 'terms');
    });

    test('Creates custom page and auto-normalizes slug', () => {
      const created = createOrUpdateStorePageMock(storeSlug, {
        title: 'Guide des Tailles Ceintures & Babouches',
        slug: 'guide des tailles babouches',
        content: '# Guide des Tailles\n\nMesurez votre pied en centimètres.',
        policyType: 'custom',
        isPublished: true,
      });

      assert.equal(created.slug, 'guide-des-tailles-babouches', 'Slug must be normalized to hyphenated lowercase');
      assert.equal(created.isPublished, true);

      const found = getStorePageBySlugMock(storeSlug, 'guide-des-tailles-babouches');
      assert.ok(found, 'Must find newly created page');
      assert.equal(found.title, 'Guide des Tailles Ceintures & Babouches');
    });

    test('Updates existing page content and status', () => {
      const updated = createOrUpdateStorePageMock(storeSlug, {
        title: 'Guide des Tailles 2026',
        slug: 'guide-des-tailles-babouches',
        content: '# Nouveau Guide 2026\n\nMise à jour des mesures.',
        isPublished: false,
      });

      assert.equal(updated.title, 'Guide des Tailles 2026');
      assert.equal(updated.isPublished, false);

      const found = getStorePageBySlugMock(storeSlug, 'guide-des-tailles-babouches');
      assert.equal(found?.isPublished, false);
      assert.ok(found?.content.includes('Nouveau Guide 2026'));
    });

    test('Deletes custom page by slug', () => {
      const deleted = deleteStorePageMock(storeSlug, 'guide-des-tailles-babouches');
      assert.equal(deleted, true);

      const found = getStorePageBySlugMock(storeSlug, 'guide-des-tailles-babouches');
      assert.equal(found, null, 'Deleted page must no longer be found');
    });

    test('Regenerates standard store policies without errors', () => {
      const all = generateStandardStorePoliciesMock(storeSlug);
      assert.ok(all.length >= 5);
      const privacy = all.find((p) => p.slug === 'privacy');
      assert.ok(privacy);
      assert.equal(privacy.isSystemPolicy, true);
    });
  });

  describe('3. API Routes Endpoints', () => {
    test('GET /api/stores/[slug]/pages returns list of pages', async () => {
      const req = new NextRequest(`http://localhost:3000/api/stores/${storeSlug}/pages`);
      const res = await getPages(req, { params: Promise.resolve({ slug: storeSlug }) });
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(Array.isArray(data.pages));
      assert.ok(data.pages.length >= 5);
    });

    test('POST /api/stores/[slug]/pages creates a new page with sanitized inputs', async () => {
      const req = new NextRequest(`http://localhost:3000/api/stores/${storeSlug}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'FAQ Livraison & Commandes <script>alert("xss")</script>',
          slug: 'faq-livraison',
          content: '# Questions Fréquentes\n\nTout savoir sur le paiement à la livraison.',
          policyType: 'custom',
        }),
      });

      const res = await postPages(req, { params: Promise.resolve({ slug: storeSlug }) });
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.page.slug, 'faq-livraison');
      assert.ok(!data.page.title.includes('<script>'), 'Title must be XSS sanitized');
    });

    test('GET /api/stores/[slug]/pages/[pageSlug] returns single page', async () => {
      const req = new NextRequest(`http://localhost:3000/api/stores/${storeSlug}/pages/faq-livraison`);
      const res = await getSinglePage(req, {
        params: Promise.resolve({ slug: storeSlug, pageSlug: 'faq-livraison' }),
      });
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.page.slug, 'faq-livraison');
    });

    test('PUT /api/stores/[slug]/pages/[pageSlug] updates page', async () => {
      const req = new NextRequest(`http://localhost:3000/api/stores/${storeSlug}/pages/faq-livraison`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'FAQ Livraison & Commandes Officielle',
          content: '# FAQ Mise à jour\n\nNouveaux détails.',
        }),
      });

      const res = await putSinglePage(req, {
        params: Promise.resolve({ slug: storeSlug, pageSlug: 'faq-livraison' }),
      });
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.page.title, 'FAQ Livraison & Commandes Officielle');
    });

    test('DELETE /api/stores/[slug]/pages/[pageSlug] removes page', async () => {
      const req = new NextRequest(`http://localhost:3000/api/stores/${storeSlug}/pages/faq-livraison`, {
        method: 'DELETE',
      });

      const res = await deleteSinglePage(req, {
        params: Promise.resolve({ slug: storeSlug, pageSlug: 'faq-livraison' }),
      });
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
    });

    test('POST /api/stores/[slug]/pages/generate-policies triggers batch generation', async () => {
      const req = new NextRequest(`http://localhost:3000/api/stores/${storeSlug}/pages/generate-policies`, {
        method: 'POST',
      });

      const res = await generatePoliciesRoute(req, {
        params: Promise.resolve({ slug: storeSlug }),
      });
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.count >= 5);
    });
  });

  describe('4. Menu Integration with Custom Pages', () => {
    test('Menu items can target custom pages with type "page" and valid URL format', () => {
      const menuItems: MenuItem[] = [
        {
          id: 'item_home',
          label: 'Accueil',
          type: 'home',
          url: '/',
          order: 0,
        },
        {
          id: 'item_policies_parent',
          label: 'Informations Légales',
          type: 'page',
          url: '/p/terms',
          targetId: 'terms',
          order: 1,
          children: [
            {
              id: 'item_privacy',
              label: 'Politique de Confidentialité',
              type: 'page',
              url: '/p/privacy',
              targetId: 'privacy',
              order: 0,
            },
            {
              id: 'item_shipping',
              label: 'Livraison & Inspection Colis',
              type: 'page',
              url: '/p/shipping-policy',
              targetId: 'shipping-policy',
              order: 1,
              children: [
                {
                  id: 'item_returns',
                  label: 'Retours & Échanges 7j',
                  type: 'page',
                  url: '/p/returns',
                  targetId: 'returns',
                  order: 0,
                },
              ],
            },
          ],
        },
      ];

      // Test that 3-tier nesting is strictly accepted under max-2 levels rule
      const isValid = validateMenuNesting(menuItems);
      assert.equal(isValid, true, 'Hierarchy with 2 nesting levels must pass validation');

      // Verify that URLs correctly point to /p/[slug]
      assert.equal(menuItems[1].url, '/p/terms');
      assert.equal(menuItems[1].children![0].url, '/p/privacy');
      assert.equal(menuItems[1].children![1].url, '/p/shipping-policy');
      assert.equal(menuItems[1].children![1].children![0].url, '/p/returns');
    });
  });
});
