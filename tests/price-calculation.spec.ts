import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, CHECKOUT_INFO } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Price Calculation Tests
// Author: Sravan Kumar Redapaka
// Pattern: Data Capture & Compare — capture prices from inventory,
// verify totals are calculated correctly on checkout overview
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Price Calculation', () => {
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
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PRICE-001 : Item total on overview matches sum of added product prices
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PRICE-001 | Item total on checkout overview should match sum of product prices', async ({ page }) => {
    const productsToAdd = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
    ];

    // Step 1: Capture prices from inventory BEFORE adding to cart
    const capturedPrices: number[] = [];

    for (const product of productsToAdd) {
      // Get price for this specific product from inventory
      const priceText = await page
        .locator('.inventory_item')
        .filter({ hasText: product })
        .locator('.inventory_item_price')
        .innerText();

      const price = parseFloat(priceText.replace('$', ''));
      capturedPrices.push(price);
      console.log(`${product}: $${price}`);

      // Add to cart
      await inventoryPage.addProductToCartByName(product);
    }

    // Step 2: Calculate expected total
    const expectedTotal = capturedPrices.reduce((sum, price) => sum + price, 0);
    console.log(`Expected item total: $${expectedTotal.toFixed(2)}`);

    // Step 3: Go through checkout to overview
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.zipCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.verifyStepTwoLoaded();

    // Step 4: Get item total shown on overview
    const itemTotalText = await page
      .locator('[data-test="subtotal-label"]')
      .innerText();
    const shownItemTotal = parseFloat(
      itemTotalText.replace('Item total: $', '')
    );
    console.log(`Shown item total: $${shownItemTotal}`);

    // Step 5: Compare — captured sum must match shown total
    expect(shownItemTotal).toBeCloseTo(expectedTotal, 2);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PRICE-002 : Final total = item total + tax
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PRICE-002 | Final total on overview should equal item total plus tax', async ({ page }) => {
    // Add 3 products
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.addProductToCartByName('Sauce Labs Fleece Jacket');
    await inventoryPage.addProductToCartByName('Sauce Labs Onesie');

    // Go to checkout overview
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.zipCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.verifyStepTwoLoaded();

    // Capture item total from overview
    const itemTotalText = await page
      .locator('[data-test="subtotal-label"]')
      .innerText();
    const itemTotal = parseFloat(itemTotalText.replace('Item total: $', ''));

    // Capture tax from overview
    const taxText = await page
      .locator('[data-test="tax-label"]')
      .innerText();
    const tax = parseFloat(taxText.replace('Tax: $', ''));

    // Capture final total from overview
    const totalText = await page
      .locator('[data-test="total-label"]')
      .innerText();
    const finalTotal = parseFloat(totalText.replace('Total: $', ''));

    console.log(`Item total: $${itemTotal}`);
    console.log(`Tax: $${tax}`);
    console.log(`Final total: $${finalTotal}`);

    // Verify: item total + tax = final total
    expect(finalTotal).toBeCloseTo(itemTotal + tax, 2);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PRICE-003 : All 6 products total price calculation
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PRICE-003 | Adding all 6 products total should be calculated correctly', async ({ page }) => {
    const allProducts = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ];

    // Capture all prices from inventory
    const capturedPrices: number[] = [];

    for (const product of allProducts) {
      const priceText = await page
        .locator('.inventory_item')
        .filter({ hasText: product })
        .locator('.inventory_item_price')
        .innerText();

      const price = parseFloat(priceText.replace('$', ''));
      capturedPrices.push(price);
      await inventoryPage.addProductToCartByName(product);
    }

    const expectedTotal = capturedPrices.reduce((sum, p) => sum + p, 0);
    console.log(`Expected total for all 6 products: $${expectedTotal.toFixed(2)}`);

    // Go to checkout overview
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.zipCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.verifyStepTwoLoaded();

    // Verify item total
    const itemTotalText = await page
      .locator('[data-test="subtotal-label"]')
      .innerText();
    const shownTotal = parseFloat(itemTotalText.replace('Item total: $', ''));

    expect(shownTotal).toBeCloseTo(expectedTotal, 2);

    // Verify final total = item total + tax
    const taxText = await page.locator('[data-test="tax-label"]').innerText();
    const tax = parseFloat(taxText.replace('Tax: $', ''));

    const finalTotalText = await page.locator('[data-test="total-label"]').innerText();
    const finalTotal = parseFloat(finalTotalText.replace('Total: $', ''));

    expect(finalTotal).toBeCloseTo(shownTotal + tax, 2);
  });

});