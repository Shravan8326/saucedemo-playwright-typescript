import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Sorting Tests — Product sort dropdown on Inventory page
// Author: Sravan Kumar Redapaka
// Framework: Playwright + TypeScript | Pattern: POM + Data Driven
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Product Sorting', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();
  });

  // ─── TC-SORT-001 : Name A to Z ───────────────────────────────────────────
  test('TC-SORT-001 | Sort by Name (A to Z) → product names should be in ascending order', async () => {
    await inventoryPage.sortProducts('az');

    const names = await inventoryPage.getAllProductNames();

    // verify names are sorted A to Z
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  // ─── TC-SORT-002 : Name Z to A ───────────────────────────────────────────
  test('TC-SORT-002 | Sort by Name (Z to A) → product names should be in descending order', async () => {
    await inventoryPage.sortProducts('za');

    const names = await inventoryPage.getAllProductNames();

    // verify names are sorted Z to A
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  // ─── TC-SORT-003 : Price low to high ─────────────────────────────────────
  test('TC-SORT-003 | Sort by Price (low to high) → prices should be in ascending order', async () => {
    await inventoryPage.sortProducts('lohi');

    const prices = await inventoryPage.getAllProductPrices();

    // verify each price is less than or equal to the next one
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  // ─── TC-SORT-004 : Price high to low ─────────────────────────────────────
  test('TC-SORT-004 | Sort by Price (high to low) → prices should be in descending order', async () => {
    await inventoryPage.sortProducts('hilo');

    const prices = await inventoryPage.getAllProductPrices();

    // verify each price is greater than or equal to the next one
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

});