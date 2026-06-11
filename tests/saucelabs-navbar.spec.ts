import { test, expect } from '@playwright/test';
import { SauceLabsNavPage } from '../pages/SauceLabsNavPage';

// ─────────────────────────────────────────────────────────────────────────────
// Sauce Labs Navbar Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sauce Labs — Navbar Tests', () => {
  let navPage: SauceLabsNavPage;

  test.beforeEach(async ({ page }) => {
    navPage = new SauceLabsNavPage(page);
    await navPage.goto();
    await navPage.verifyPageLoaded();
  });

  // ─── Products dropdown ────────────────────────────────────────────────────

  test('TC-NAV-002 | Hovering Products should show all 4 sections in dropdown', async () => {
    await navPage.hoverProducts();
    await navPage.verifyProductsDropdown();
  });

  // ─── Solutions dropdown ───────────────────────────────────────────────────

  test('TC-NAV-003 | Hovering Solutions should show all 3 sections in dropdown', async () => {
    await navPage.hoverSolutions();
    await navPage.verifySolutionsDropdown();
  });

  // ─── Developers dropdown ──────────────────────────────────────────────────

  test('TC-NAV-004 | Hovering Developers should show all 5 sections in dropdown', async () => {
    await navPage.hoverDevelopers();
    await navPage.verifyDevelopersDropdown();
  });

  // ─── Resources dropdown ───────────────────────────────────────────────────

  test('TC-NAV-005 | Hovering Resources should show all 4 sections in dropdown', async () => {
    await navPage.hoverResources();
    await navPage.verifyResourcesDropdown();
  });

  // ─── Sauce AI page — smoke test ───────────────────────────────────────────

  test('TC-NAV-006 | Clicking Sauce AI should load Sauce AI page', async () => {
    await navPage.clickSauceAI();
    await expect(navPage.page).toHaveURL(/.*solutions\/ai.*/);
    await expect(navPage.page.getByRole('heading', {
      name: 'Explore Sauce AI Agents: Ship with Confidence, Not Chaos.',
    })).toBeVisible();
  });

  // ─── Pricing page — smoke test ────────────────────────────────────────────

  test('TC-NAV-007 | Clicking Pricing should load Pricing page', async () => {
    await navPage.clickPricing();
    await expect(navPage.page).toHaveURL(/.*pricing.*/);
    await expect(navPage.page.getByRole('heading', {
      name: 'Platform for Test',
    })).toBeVisible();
  });

});