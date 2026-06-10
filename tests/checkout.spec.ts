import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CHECKOUT_INFO, PRODUCTS } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// TC-001 to TC-010 : Full E2E Checkout Flow — SauceDemo
// App: https://www.saucedemo.com
// Author: Sravan Kumar Redapaka
// Framework: Playwright + TypeScript | Pattern: POM
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — End-to-End Checkout Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-001 : Verify login page loads at base URL
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-001 | Login page should load at base URL', async ({ page }) => {
    await loginPage.goto();
    await loginPage.verifyPageLoaded();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-002 : Successful login with standard_user
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-002 | Successful login should redirect to inventory page', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-003 : Verify inventory page header elements after login
  //          (center "Swag Labs" text, hamburger menu, cart icon)
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-003 | Inventory page should show Swag Labs header, hamburger menu, and cart icon', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();
    await inventoryPage.verifyHeaderElements();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-004 : Add a product to cart and verify badge count updates
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-004 | Adding a product should update cart badge to 1', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.verifyCartBadgeCount(1);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-005 : Navigate to cart page and verify added product is present
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-005 | Cart page should display the added product', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.verifyProductInCart(PRODUCTS.backpack);
    await cartPage.verifyCartItemCount(1);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-006 : Checkout step one — Your Information page loads on clicking Checkout
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-006 | Clicking Checkout should load the Your Information page', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-007 : Checkout step one — Error when continuing with empty fields
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-007 | Continuing with empty checkout fields should show error', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();
    await checkoutPage.clickContinue();
    await checkoutPage.verifyStepOneError('First Name is required');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-008 : Checkout step two — Overview page loads after valid info entry
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-008 | Filling checkout info and continuing should load Overview page', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();
    await checkoutPage.fillCheckoutInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.zipCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.verifyStepTwoLoaded();
    await checkoutPage.verifyProductInOverview(PRODUCTS.backpack);
    await checkoutPage.verifyOrderSummaryVisible();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-009 : Order placed — Complete page loads after clicking Finish
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-009 | Clicking Finish should show the Order Complete confirmation page', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.zipCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();
    await checkoutPage.verifyOrderCompletePage();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-010 : Full E2E — Login → Add to Cart → Checkout → Back to Home
  //          This is the complete happy-path flow you explored manually
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-010 | FULL E2E: Login → Add to Cart → Checkout → Order Confirmed → Back Home', async () => {
    // Step 1: Navigate to site
    await loginPage.goto();
    await loginPage.verifyPageLoaded();

    // Step 2: Login
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    // Step 3: Verify logged in — header elements visible
    await inventoryPage.verifyPageLoaded();
    await inventoryPage.verifyHeaderElements();

    // Step 4: Add product to cart
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.verifyCartBadgeCount(1);

    // Step 5: Go to cart
    await inventoryPage.goToCart();
    await cartPage.verifyPageLoaded();
    await cartPage.verifyProductInCart(PRODUCTS.backpack);

    // Step 6: Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();

    // Step 7: Fill in checkout information
    await checkoutPage.fillCheckoutInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.zipCode
    );
    await checkoutPage.clickContinue();

    // Step 8: Verify overview page
    await checkoutPage.verifyStepTwoLoaded();
    await checkoutPage.verifyProductInOverview(PRODUCTS.backpack);
    await checkoutPage.verifyOrderSummaryVisible();

    // Step 9: Place order
    await checkoutPage.clickFinish();
    await checkoutPage.verifyOrderCompletePage();

    // Step 10: Back to home (products page)
    await checkoutPage.clickBackHome();
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-011 : Negative — Locked out user cannot log in
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-011 | Locked out user should see error message on login', async () => {
    await loginPage.goto();
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
    await loginPage.verifyErrorMessage(
      'Sorry, this user has been locked out'
    );
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-012 : Negative — Invalid credentials should show error
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-012 | Invalid credentials should show an error message', async () => {
    await loginPage.goto();
    await loginPage.login('wrong_user', 'wrong_pass');
    await loginPage.verifyErrorMessage(
      'Username and password do not match'
    );
  });
});
