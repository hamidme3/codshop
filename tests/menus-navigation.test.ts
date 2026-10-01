import assert from 'node:assert';
import { 
  getDefaultStoreMenus, 
  getStoreMenusMock, 
  getStoreMenuByPlacementMock, 
  updateStoreMenuMock, 
  resetStoreMenuMock, 
  validateMenuNesting 
} from '../src/lib/mocks';
import { getStoreMenus, getStoreMenuByPlacement, updateStoreMenu, resetStoreMenu } from '../src/lib/db-repository';
import { GET as getMenusRoute, PUT as putMenuRoute } from '../src/app/api/stores/[slug]/menus/route';
import { POST as resetMenuRoute } from '../src/app/api/stores/[slug]/menus/reset/route';
import type { MenuItem, MenuPlacement } from '../src/lib/types';

console.log('🧪 Starting Store Navigation Menus Test Suite...\n');

async function runMenuTests() {
  const storeSlug = 'test-store-menus';

  // ── 1. Default Menus Initialization & Placements ───────────────
  console.log('1. Testing Default Store Menus Initialization...');
  const defaultMenus = getDefaultStoreMenus(storeSlug);
  assert.strictEqual(defaultMenus.length, 4, 'Must return exactly 4 default menu placements');
  
  const placements = defaultMenus.map((m) => m.placement);
  assert.ok(placements.includes('header'), 'Must include header placement');
  assert.ok(placements.includes('mobile_drawer'), 'Must include mobile_drawer placement');
  assert.ok(placements.includes('footer_col_1'), 'Must include footer_col_1 placement');
  assert.ok(placements.includes('footer_col_2'), 'Must include footer_col_2 placement');

  const headerMenu = defaultMenus.find((m) => m.placement === 'header');
  assert.ok(headerMenu, 'Header menu must exist');
  assert.ok(headerMenu.items.length >= 3, 'Header menu must have at least 3 default items');
  console.log(`  ✓ 4 default menu placements correctly generated (${headerMenu.items.length} header items).`);

  // ── 2. Nesting Depth Validation (Strict Max 2-Level Limit) ──────
  console.log('2. Testing Nesting Depth Rule Enforcement (Max 2 Levels of Nesting)...');
  
  // A. Flat list (0 levels of nesting)
  const flatItems: MenuItem[] = [
    { id: '1', label: 'Home', type: 'home', url: '/', order: 0 },
    { id: '2', label: 'Catalog', type: 'catalog', url: '/catalog', order: 1 },
  ];
  assert.strictEqual(validateMenuNesting(flatItems), true, 'Flat list must pass validation');

  // B. 1 level of nesting (Parent -> Child)
  const oneLevelItems: MenuItem[] = [
    {
      id: '1',
      label: 'Collections',
      type: 'catalog',
      url: '/catalog',
      order: 0,
      children: [
        { id: '1-1', label: 'Shoes', type: 'category', url: '/catalog?category=shoes', order: 0 },
      ],
    },
  ];
  assert.strictEqual(validateMenuNesting(oneLevelItems), true, '1-level nesting must pass validation');

  // C. 2 levels of nesting (Parent -> Submenu -> Nested Sub-item)
  const twoLevelItems: MenuItem[] = [
    {
      id: '1',
      label: 'Collections',
      type: 'catalog',
      url: '/catalog',
      order: 0,
      children: [
        {
          id: '1-1',
          label: 'Men',
          type: 'catalog',
          url: '/catalog',
          order: 0,
          children: [
            { id: '1-1-1', label: 'Leather Boots', type: 'category', url: '/catalog?category=boots', order: 0 },
          ],
        },
      ],
    },
  ];
  assert.strictEqual(validateMenuNesting(twoLevelItems), true, '2-level nesting must pass validation');

  // D. 3 levels of nesting (Parent -> Submenu -> Sub-item -> Excess Child) -> MUST FAIL
  const threeLevelItems: MenuItem[] = [
    {
      id: '1',
      label: 'Level 0',
      type: 'catalog',
      url: '/catalog',
      order: 0,
      children: [
        {
          id: '1-1',
          label: 'Level 1',
          type: 'catalog',
          url: '/catalog',
          order: 0,
          children: [
            {
              id: '1-1-1',
              label: 'Level 2',
              type: 'catalog',
              url: '/catalog',
              order: 0,
              children: [
                { id: '1-1-1-1', label: 'Level 3 (Excess)', type: 'url', url: '/excess', order: 0 },
              ],
            },
          ],
        },
      ],
    },
  ];
  assert.strictEqual(validateMenuNesting(threeLevelItems), false, '3-level nesting must be REJECTED');
  console.log('  ✓ Nesting validation strictly permits <= 2 levels and rejects 3+ levels.');

  // ── 3. Store Repository Menus CRUD ─────────────────────────────
  console.log('3. Testing Repository CRUD & Mutations...');
  const repoMenus = await getStoreMenus(storeSlug);
  assert.strictEqual(repoMenus.length, 4, 'Repo must return all 4 menus for store');

  const customHeaderItems: MenuItem[] = [
    { id: 'cust_1', label: 'Accueil VIP', type: 'home', url: '/', order: 0 },
    {
      id: 'cust_2',
      label: 'Maroquinerie Artisanale',
      type: 'category',
      url: '/catalog?category=maroquinerie',
      badgeText: 'NOUVEAU',
      badgeColor: 'rose',
      order: 1,
      children: [
        { id: 'cust_2_1', label: 'Sacs à Main Cuir', type: 'category', url: '/catalog?category=sacs', order: 0 },
      ],
    },
  ];

  const updatedMenu = await updateStoreMenu(storeSlug, 'header', customHeaderItems, 'Menu VIP 2026');
  assert.strictEqual(updatedMenu.items.length, 2, 'Updated menu must have 2 items');
  assert.strictEqual(updatedMenu.items[1].label, 'Maroquinerie Artisanale');
  assert.strictEqual(updatedMenu.items[1].badgeText, 'NOUVEAU');

  const fetchedUpdated = await getStoreMenuByPlacement(storeSlug, 'header');
  assert.strictEqual(fetchedUpdated.items[1].badgeText, 'NOUVEAU');
  console.log('  ✓ Menu successfully updated and retrieved from repository.');

  // ── 4. Reset to Default Functionality ──────────────────────────
  console.log('4. Testing Menu Reset to Defaults...');
  const resetMenu = await resetStoreMenu(storeSlug, 'header');
  assert.ok(resetMenu.items.length >= 3, 'Reset menu must restore default items');
  assert.strictEqual(resetMenu.items[0].label, 'Accueil');
  console.log('  ✓ Reset restores default recommended items successfully.');

  // ── 5. REST API Route Verification ─────────────────────────────
  console.log('5. Testing API Routes (GET, PUT, POST Reset)...');
  const paramsPromise = Promise.resolve({ slug: storeSlug });

  // A. GET /api/stores/[slug]/menus
  const getReq = new Request(`http://localhost:3000/api/stores/${storeSlug}/menus`);
  const getRes = await getMenusRoute(getReq, { params: paramsPromise });
  const getData = await getRes.json();
  assert.strictEqual(getRes.status, 200);
  assert.strictEqual(getData.success, true);
  assert.strictEqual(getData.menus.length, 4);
  console.log('  ✓ GET /api/stores/[slug]/menus returned HTTP 200 with 4 menus.');

  // B. PUT /api/stores/[slug]/menus with invalid placement -> 400
  const putInvalidReq = new Request(`http://localhost:3000/api/stores/${storeSlug}/menus`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placement: 'invalid_placement', items: [] }),
  });
  const putInvalidRes = await putMenuRoute(putInvalidReq, { params: paramsPromise });
  assert.strictEqual(putInvalidRes.status, 400, 'Invalid placement must return 400');
  console.log('  ✓ PUT with invalid placement correctly rejected with 400.');

  // C. PUT /api/stores/[slug]/menus with > 2 levels of nesting -> 400
  const putTooDeepReq = new Request(`http://localhost:3000/api/stores/${storeSlug}/menus`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placement: 'header', items: threeLevelItems }),
  });
  const putTooDeepRes = await putMenuRoute(putTooDeepReq, { params: paramsPromise });
  const putTooDeepData = await putTooDeepRes.json();
  assert.strictEqual(putTooDeepRes.status, 400, 'Excessive nesting must return 400');
  assert.ok(putTooDeepData.error.includes('Maximum 2 levels of nesting exceeded'));
  console.log('  ✓ PUT with >2 nesting levels rejected with 400 and clear error message.');

  // D. PUT /api/stores/[slug]/menus with valid items and XSS attack payload -> Sanitized
  const putValidReq = new Request(`http://localhost:3000/api/stores/${storeSlug}/menus`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      placement: 'header',
      items: [
        {
          id: 'test_xss',
          label: '<script>alert(1)</script>Montres Homme',
          type: 'category',
          url: '/catalog?category=montres',
          badgeText: '<b>HOT</b>',
          order: 0,
        },
      ],
    }),
  });
  const putValidRes = await putMenuRoute(putValidReq, { params: paramsPromise });
  const putValidData = await putValidRes.json();
  assert.strictEqual(putValidRes.status, 200);
  assert.strictEqual(putValidData.success, true);
  assert.ok(!putValidData.menu.items[0].label.includes('<script>'), 'Script tag must be sanitized');
  console.log('  ✓ PUT with valid items saved and XSS payload neutralized.');

  // E. POST /api/stores/[slug]/menus/reset
  const resetReq = new Request(`http://localhost:3000/api/stores/${storeSlug}/menus/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placement: 'header' }),
  });
  const resetRes = await resetMenuRoute(resetReq, { params: paramsPromise });
  const resetData = await resetRes.json();
  assert.strictEqual(resetRes.status, 200);
  assert.strictEqual(resetData.success, true);
  assert.ok(resetData.menu.items.length >= 3);
  console.log('  ✓ POST /api/stores/[slug]/menus/reset restored header menu to default.');

  console.log('\n🎉 ALL 5 STORE NAVIGATION MENUS TEST SUITES PASSED (100%)!\n');
}

runMenuTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
