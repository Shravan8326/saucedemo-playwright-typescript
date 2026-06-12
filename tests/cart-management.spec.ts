import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS, PRODUCTS } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Cart Management Tests
// Covers: Add multiple products, partial remove, full remove
// ─────────────────────────────────────────────────────────────────────────────

// 5 products to use across tests
const FIVE_PRODUCTS = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
];

test.describe('SauceDemo — Cart Management', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-CART-001 : Add 5 products and verify badge count
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-CART-001 | Adding 5 products should update cart badge to 5', async () => {
    // Add all 5 products one by one
    for (const product of FIVE_PRODUCTS) {
      await inventoryPage.addProductToCartByName(product);
    }

    // Verify badge shows 5
    await inventoryPage.verifyCartBadgeCount(5);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-CART-002 : Verify all 5 products appear in cart
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-CART-002 | All 5 added products should appear in cart', async () => {
    // Add all 5
    for (const product of FIVE_PRODUCTS) {
      await inventoryPage.addProductToCartByName(product);
    }

    // Go to cart
    await inventoryPage.goToCart();
    await cartPage.verifyPageLoaded();

    // Verify all 5 are in cart
    await cartPage.verifyCartItemCount(5);

    // Verify each product by name
    for (const product of FIVE_PRODUCTS) {
      await cartPage.verifyProductInCart(product);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-CART-003 : Remove some products and verify remaining count is correct
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-CART-003 | Removing 2 products should leave 3 in cart', async () => {
    // Add all 5
    for (const product of FIVE_PRODUCTS) {
      await inventoryPage.addProductToCartByName(product);
    }

    // Go to cart
    await inventoryPage.goToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.verifyCartItemCount(5);

    // Remove first 2 products
    await cartPage.removeProductByName(FIVE_PRODUCTS[0]); // Backpack
    await cartPage.removeProductByName(FIVE_PRODUCTS[1]); // Bike Light

    // Verify 3 remain
    await cartPage.verifyCartItemCount(3);

    // Verify the removed ones are gone
    await expect(
      cartPage.page.locator('.inventory_item_name', { hasText: FIVE_PRODUCTS[0] })
    ).not.toBeVisible();
    await expect(
      cartPage.page.locator('.inventory_item_name', { hasText: FIVE_PRODUCTS[1] })
    ).not.toBeVisible();

    // Verify remaining 3 still exist
    for (const product of FIVE_PRODUCTS.slice(2)) {
      await cartPage.verifyProductInCart(product);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-CART-004 : Remove all products one by one — cart should be empty
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-CART-004 | Removing all 5 products one by one should empty the cart', async () => {
    // Add all 5
    for (const product of FIVE_PRODUCTS) {
      await inventoryPage.addProductToCartByName(product);
    }

    // Go to cart
    await inventoryPage.goToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.verifyCartItemCount(5);

    // Remove all 5 one by one and verify count decreases
    for (let i = 0; i < FIVE_PRODUCTS.length; i++) {
      await cartPage.removeProductByName(FIVE_PRODUCTS[i]);
      const remaining = FIVE_PRODUCTS.length - (i + 1);
      if (remaining > 0) {
        await cartPage.verifyCartItemCount(remaining);
      }
    }

    // Verify cart is completely empty
    await cartPage.verifyCartIsEmpty();

    // Verify cart badge is gone from header
    await cartPage.verifyCartBadgeNotVisible();
  });

});