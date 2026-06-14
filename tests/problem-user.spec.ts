import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CHECKOUT_INFO } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Problem User Tests
// Author: Sravan Kumar Redapaka
// problem_user is intentionally broken to simulate real-world bugs:
//   - Wrong product images
//   - Sorting doesn't work
//   - Checkout input fields broken
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Problem User', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage    = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage     = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.problem.username, USERS.problem.password);
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PROB-001 : Product images are broken/wrong for problem_user
  // All images show the same wrong image (not matching the product)
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PROB-001 | Problem user should see broken product images', async ({ page }) => {
    const images = await page.locator('.inventory_item_img img').all();

    // Collect all image src values
    const srcs = await Promise.all(images.map(img => img.getAttribute('src')));

    // For problem_user all images point to the same wrong src
    // Verify they are all identical (broken — same image for every product)
    const allSame = srcs.every(src => src === srcs[0]);
    expect(allSame).toBe(true);
  });
  // ───────────────────────────────────────────────────────────────────────────
  // TC-PROB-003 : Sorting by Name Z-A does not work for problem_user
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PROB-003 | Problem user sort by Name Z-A should NOT work correctly', async () => {
    await inventoryPage.sortProducts('za');

    const names = await inventoryPage.getAllProductNames();
    const sortedDesc = [...names].sort().reverse();

    expect(names).not.toEqual(sortedDesc);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PROB-004 : Checkout input fields are broken for problem_user
  // Last name field does not accept input
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PROB-004 | Problem user checkout input fields should be broken', async ({ page }) => {
    // Add product and navigate to checkout
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();

    // Try to fill checkout info
    await checkoutPage.fillCheckoutInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.zipCode
    );

    // Click continue
    await checkoutPage.clickContinue();

    // For problem_user — checkout is broken, should show error or not proceed
    // Verify still on step one (cannot proceed)
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PROB-005 : Logout still works for problem_user
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PROB-005 | Problem user should still be able to logout', async ({ page }) => {
    await inventoryPage.logout();
    await loginPage.verifyPageLoaded();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

});