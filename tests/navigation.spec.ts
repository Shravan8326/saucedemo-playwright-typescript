import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Navigation Tests — Hamburger Menu & Footer
// Author: Sravan Kumar Redapaka
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Navigation & Hamburger Menu', () => {
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
  // TC-NAV-001 : Hamburger menu → About → Smoke test Sauce Labs about page
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-001 | About link should open Sauce Labs about page with correct heading', async ({ page }) => {
    await inventoryPage.hamburgerMenu.click();

    const aboutLink = page.locator('#about_sidebar_link');
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();

    await page.waitForURL('https://saucelabs.com/**');

    const heading = page.getByText(
      "The World's Only Full-Lifecycle AI-Quality Platform",
      { exact: false }
    );
    await expect(heading).toBeVisible();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-NAV-002 : Hamburger All Items from INVENTORY page
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-002 | All Items from inventory page should stay on inventory', async () => {
    await inventoryPage.clickAllItems();
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-NAV-003 : Hamburger All Items from CART page
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-003 | All Items from cart page should return to inventory', async () => {
    await inventoryPage.goToCart();
    await cartPage.verifyPageLoaded();
    await inventoryPage.clickAllItems();
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-NAV-004 : Hamburger All Items from CHECKOUT page
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-004 | All Items from checkout page should return to inventory', async () => {
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyStepOneLoaded();
    await inventoryPage.clickAllItems();
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-NAV-005 : Reset App State clears cart badge
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-005 | Reset App State should clear cart badge', async () => {
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addProductToCartByName('Sauce Labs Bolt T-Shirt');
    await inventoryPage.verifyCartBadgeCount(3);
    await inventoryPage.clickResetAppState();
    await inventoryPage.verifyCartBadgeNotVisible();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-NAV-006 : Reset App State resets all Add to Cart buttons
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-006 | Reset App State should reset all Add to Cart buttons', async () => {
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addProductToCartByName('Sauce Labs Bolt T-Shirt');
    await inventoryPage.clickResetAppState();
    await inventoryPage.verifyAllAddToCartButtonsVisible();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-NAV-007 : Footer Twitter/X link opens correct URL in new tab
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-007 | Footer Twitter/X link should open correct URL', async ({ page, context }) => {
    const twitterLink = page.locator('[data-test="social-twitter"]');
    await expect(twitterLink).toBeVisible();
    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      twitterLink.click(),
    ]);
    await newTab.waitForLoadState();
    expect(newTab.url()).toContain('x.com/saucelabs');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-NAV-008 : Footer Facebook link opens correct URL in new tab
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-008 | Footer Facebook link should open correct URL', async ({ page, context }) => {
    const facebookLink = page.locator('[data-test="social-facebook"]');
    await expect(facebookLink).toBeVisible();
    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      facebookLink.click(),
    ]);
    await newTab.waitForLoadState();
    expect(newTab.url()).toContain('facebook.com/saucelabs');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-NAV-009 : Footer LinkedIn link opens correct URL in new tab
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-009 | Footer LinkedIn link should open correct URL', async ({ page, context }) => {
    const linkedinLink = page.locator('[data-test="social-linkedin"]');
    await expect(linkedinLink).toBeVisible();
    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      linkedinLink.click(),
    ]);
    await newTab.waitForLoadState();
    expect(newTab.url()).toContain('linkedin.com/company/sauce-labs');
  });

});