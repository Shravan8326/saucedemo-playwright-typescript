import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../utils/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Performance Glitch User Tests
// Author: Sravan Kumar Redapaka
// performance_glitch_user has deliberately slow login to simulate
// real-world performance degradation scenarios
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Performance Glitch User', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PERF-001 : Login is slow but eventually succeeds
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PERF-001 | Performance glitch user login should eventually succeed', async () => {
    await loginPage.login(
      USERS.performanceGlitch.username,
      USERS.performanceGlitch.password
    );
    await inventoryPage.verifyPageLoaded();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PERF-002 : Login takes longer than standard_user
  // Measure actual login time and assert it is slower than threshold
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PERF-002 | Performance glitch user login should take longer than 2 seconds', async ({ page }) => {
    const startTime = Date.now();

    await loginPage.login(
      USERS.performanceGlitch.username,
      USERS.performanceGlitch.password
    );
    await inventoryPage.verifyPageLoaded();

    const loginTime = Date.now() - startTime;

    // performance_glitch_user login always takes 2-5 seconds
    // Assert it took longer than 2000ms — proving the glitch exists
    expect(loginTime).toBeGreaterThan(2000);

    console.log(`Performance glitch user login time: ${loginTime}ms`);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PERF-003 : Standard user login is faster than performance glitch user
  // Compare both login times
  // ───────────────────────────────────────────────────────────────────────────
  test('TC-PERF-003 | Standard user login should be faster than performance glitch user', async ({ page }) => {
    // Measure standard user login time
    const standardStart = Date.now();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.verifyPageLoaded();
    const standardTime = Date.now() - standardStart;

    // Reset — go back to login page
    await page.goto('/');

    // Measure performance glitch user login time
    const glitchStart = Date.now();
    await loginPage.login(
      USERS.performanceGlitch.username,
      USERS.performanceGlitch.password
    );
    await inventoryPage.verifyPageLoaded();
    const glitchTime = Date.now() - glitchStart;

    console.log(`Standard user: ${standardTime}ms`);
    console.log(`Performance glitch user: ${glitchTime}ms`);

    // Glitch user must be slower than standard user
    expect(glitchTime).toBeGreaterThan(standardTime);
  });

});