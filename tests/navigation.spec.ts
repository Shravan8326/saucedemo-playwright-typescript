import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Navigation Tests — Hamburger Menu flows
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Navigation & Hamburger Menu', () => {
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
  // TC-NAV-001 : Hamburger menu → About → Smoke test Sauce Labs about page
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-NAV-001 | About link should open Sauce Labs about page with correct heading', async ({ page }) => {
    // Step 1: Open hamburger menu
    await inventoryPage.hamburgerMenu.click();

    // Step 2: Click About link
    const aboutLink = page.locator('#about_sidebar_link');
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();

    // Step 3: Wait for Sauce Labs website to load
   // Step 3: Wait for Sauce Labs website to load
await page.waitForURL('https://saucelabs.com/**');

// Step 4: Smoke test — verify heading exists on page
const heading = page.getByText(
  "The World's Only Full-Lifecycle AI-Quality Platform",
  { exact: false }
);
await expect(heading).toBeVisible();
  });

});