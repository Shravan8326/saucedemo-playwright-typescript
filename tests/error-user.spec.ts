import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CHECKOUT_INFO } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Error User Tests
// Author: Sravan Kumar Redapaka
// error_user has these intentional bugs:
//   - Sorting is broken (reports to Backtrace)
//   - Last name field in checkout does not accept input
//   - Finish button on checkout overview is broken
//   - Logout works correctly
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Error User', () => {
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
    await loginPage.login(USERS.error.username, USERS.error.password);
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-ERR-001 : Sorting is broken for error_user — shows error message
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-ERR-001 | Error user sorting should trigger an error popup', async ({ page }) => {
    // Listen for dialog BEFORE triggering the sort
    let dialogMessage = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
  
    await inventoryPage.sortProducts('za');
  
    // Verify the dialog appeared and contained error text
    expect(dialogMessage).toContain('Sorting is broken');
  });
  // ───────────────────────────────────────────────────────────────────────────
  // TC-ERR-002 : Last name field does not accept input in checkout
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-ERR-002 | Error user last name field should not accept input', async ({ page }) => {
    // Add product and navigate to checkout
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();

    // Fill checkout info
    await checkoutPage.fillCheckoutInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.zipCode
    );

    // Verify last name field value is empty despite filling it
    const lastNameValue = await page
      .locator('[data-test="lastName"]')
      .inputValue();

    console.log(`Last name field value: "${lastNameValue}"`);

    // For error_user — last name field doesn't accept input so it stays empty
    expect(lastNameValue).toBe('');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-ERR-003 : Finish button is broken on checkout overview
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-ERR-003 | Error user Finish button should not complete the order', async ({ page }) => {
    // Add product and go through checkout
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Fill only first name and zip since last name is broken
    await page.locator('[data-test="firstName"]').fill(CHECKOUT_INFO.valid.firstName);
    await page.locator('[data-test="postalCode"]').fill(CHECKOUT_INFO.valid.zipCode);
    await checkoutPage.clickContinue();

    // Should reach overview page
    await checkoutPage.verifyStepTwoLoaded();

    // Click finish
    await checkoutPage.clickFinish();

    // For error_user — finish is broken, should NOT reach complete page
    await expect(page).not.toHaveURL(/.*checkout-complete.html/);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-ERR-004 : Logout works correctly for error_user
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-ERR-004 | Error user should be able to logout successfully', async ({ page }) => {
    await inventoryPage.logout();
    await loginPage.verifyPageLoaded();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

});