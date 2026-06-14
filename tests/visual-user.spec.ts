import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Visual User Tests
// Author: Sravan Kumar Redapaka
// visual_user has intentional visual bugs:
//   - Product preview image differs from detail page image
//   - Cart icon misplaced
//   - Checkout icon misplaced
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Visual User', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.visual.username, USERS.visual.password);
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-VISUAL-001 : Product image on inventory differs from detail page
  // Capture inventory image src → click product → compare with detail image src
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-VISUAL-001 | Visual user product preview image should differ from detail page image', async ({ page }) => {
    // Capture first product image src from inventory
    const inventoryImageSrc = await page
      .locator('.inventory_item_img img')
      .first()
      .getAttribute('src');

    // Click first product to go to detail page
    await inventoryPage.clickFirstProductName();

    // Capture image src on detail page
    const detailImageSrc = await page
      .locator('.inventory_details_img')
      .getAttribute('src');

    console.log(`Inventory image: ${inventoryImageSrc}`);
    console.log(`Detail image: ${detailImageSrc}`);

    // For visual_user — these should be DIFFERENT (this is the bug)
    expect(inventoryImageSrc).not.toBe(detailImageSrc);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-VISUAL-002 : Cart icon is misplaced for visual_user
  // Verify cart icon position is not in expected top-right location
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-VISUAL-002 | Visual user cart icon should be misplaced', async ({ page }) => {
    const cartIcon = page.locator('[data-test="shopping-cart-link"]');
    await expect(cartIcon).toBeVisible();
  
    const cartBox = await cartIcon.boundingBox();
    const pageWidth = await page.evaluate(() => window.innerWidth);
    const cartXPercent = (cartBox!.x / pageWidth) * 100;
  
    console.log(`Cart icon X position: ${cartBox!.x}px (${cartXPercent.toFixed(1)}% of page width)`);
  
    // visual_user cart is slightly misplaced compared to standard user (95.3%)
    // Standard user is at 95.3%, visual user is at 80.8% — different positions
    expect(cartXPercent).toBeLessThan(95);
  });
  // ───────────────────────────────────────────────────────────────────────────
  // TC-VISUAL-003 : Standard user cart icon is in correct position
  // Compare standard_user vs visual_user cart icon positions
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-VISUAL-003 | Standard user cart icon should be in correct top-right position', async ({ page }) => {
    // Logout visual user and login as standard
    await inventoryPage.logout();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();

    const cartIcon = page.locator('[data-test="shopping-cart-link"]');
    const cartBox = await cartIcon.boundingBox();
    const pageWidth = await page.evaluate(() => window.innerWidth);

    const cartXPercent = (cartBox!.x / pageWidth) * 100;
    console.log(`Standard user cart X: ${cartBox!.x}px (${cartXPercent.toFixed(1)}%)`);

    // Standard user cart should be in top-right (> 80% of page width)
    expect(cartXPercent).toBeGreaterThan(80);
  });

});