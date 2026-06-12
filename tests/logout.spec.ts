import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Logout Tests
// Author: Sravan Kumar Redapaka
// Covers: Logout flow + session security after logout
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Logout', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-LOGOUT-001 : Logout from hamburger menu
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-LOGOUT-001 | Clicking Logout should redirect to login page', async ({ page }) => {
    await inventoryPage.logout();

    // Verify redirected to login page
    await loginPage.verifyPageLoaded();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-LOGOUT-002 : After logout, back button should not access inventory
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-LOGOUT-002 | After logout, browser back button should not access inventory', async ({ page }) => {
    await inventoryPage.logout();
    await loginPage.verifyPageLoaded();

    // Press browser back button
    await page.goBack();

    // Should still be on login page — not inventory
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await loginPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-LOGOUT-003 : Cart persists in localStorage across logout/login
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-LOGOUT-003 | After logout and login again, cart should retain added items', async () => {
    // Add a product to cart
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.verifyCartBadgeCount(1);

    await inventoryPage.logout();
    await loginPage.verifyPageLoaded();

    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();

    // SauceDemo persists cart in localStorage across logout/re-login
    await inventoryPage.verifyCartBadgeCount(1);
  });

});