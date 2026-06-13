import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { USERS } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Product Detail Page Tests
// Author: Sravan Kumar Redapaka
// Pattern: Data Capture & Compare — no hardcoding, app tells us the data
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Product Detail Page', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let detailPage: ProductDetailPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage    = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    detailPage   = new ProductDetailPage(page);
    cartPage     = new CartPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-DETAIL-001 : Click product NAME → opens detail page
  // Data capture & compare — capture from inventory BEFORE clicking
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-DETAIL-001 | Clicking product name should open detail page with correct data', async () => {
    // Step 1: Capture product details from inventory BEFORE clicking
    const captured = await inventoryPage.captureFirstProductDetails();

    // Step 2: Click product name
    await inventoryPage.clickFirstProductName();

    // Step 3: Verify detail page loaded
    await detailPage.verifyPageLoaded();

    // Step 4: Get details shown on detail page
    const shown = await detailPage.getProductDetails();

    // Step 5: Compare — what inventory showed must match detail page
    expect(shown.name).toBe(captured.name);
    expect(shown.desc).toBe(captured.desc);
    expect(shown.price).toBe(captured.price);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-DETAIL-002 : Click product IMAGE → opens same detail page
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-DETAIL-002 | Clicking product image should open detail page with correct data', async () => {
    // Capture before clicking image
    const captured = await inventoryPage.captureFirstProductDetails();

    // Click product image
    await inventoryPage.clickFirstProductImage();

    // Verify detail page loaded
    await detailPage.verifyPageLoaded();

    // Compare data
    const shown = await detailPage.getProductDetails();
    expect(shown.name).toBe(captured.name);
    expect(shown.desc).toBe(captured.desc);
    expect(shown.price).toBe(captured.price);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-DETAIL-003 : Add to cart from detail page
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-DETAIL-003 | Adding to cart from detail page should update cart badge', async ({ page }) => {
    // Go to detail page
    await inventoryPage.clickFirstProductName();
    await detailPage.verifyPageLoaded();

    // Add to cart from detail page
    await detailPage.addToCart();

    // Verify button changed to Remove
    await detailPage.verifyAddToCartChangedToRemove();

    // Verify cart badge shows 1
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-DETAIL-004 : Back button returns to inventory page
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-DETAIL-004 | Back button on detail page should return to inventory', async () => {
    await inventoryPage.clickFirstProductName();
    await detailPage.verifyPageLoaded();

    // Click back button on detail page
    await detailPage.clickBackButton();

    // Verify back on inventory
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-DETAIL-005 : Browser back button returns to inventory page
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-DETAIL-005 | Browser back button from detail page should return to inventory', async ({ page }) => {
    await inventoryPage.clickFirstProductName();
    await detailPage.verifyPageLoaded();

    // Browser back button
    await page.goBack();

    // Verify back on inventory
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-DETAIL-006 : Add to cart from detail page → verify in cart
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-DETAIL-006 | Product added from detail page should appear in cart', async ({ page }) => {
    // Capture product name before navigating
    const captured = await inventoryPage.captureFirstProductDetails();

    // Go to detail and add to cart
    await inventoryPage.clickFirstProductName();
    await detailPage.addToCart();

    // Go to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await cartPage.verifyPageLoaded();

    // Verify correct product is in cart
    await cartPage.verifyProductInCart(captured.name);
    await cartPage.verifyCartItemCount(1);
  });
});