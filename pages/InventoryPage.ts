import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly header: Locator;
  readonly hamburgerMenu: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly productList: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.header = page.locator('.app_logo');
    this.hamburgerMenu = page.locator('#react-burger-menu-btn');
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.productList = page.locator('[data-test="inventory-list"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  // ─── Page verification ────────────────────────────────────────────────────

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  async verifyHeaderElements() {
    // Center header "Swag Labs" text
    await expect(this.header).toBeVisible();
    await expect(this.header).toHaveText('Swag Labs');

    // Top-left hamburger (three lines) menu
    await expect(this.hamburgerMenu).toBeVisible();

    // Top-right cart icon
    await expect(this.cartIcon).toBeVisible();
  }

  // ─── Product actions ──────────────────────────────────────────────────────

private readonly productDataTestIds: Record<string, string> = {
  'Sauce Labs Backpack':               'add-to-cart-sauce-labs-backpack',
  'Sauce Labs Bike Light':             'add-to-cart-sauce-labs-bike-light',
  'Sauce Labs Bolt T-Shirt':           'add-to-cart-sauce-labs-bolt-t-shirt',
  'Sauce Labs Fleece Jacket':          'add-to-cart-sauce-labs-fleece-jacket',
  'Sauce Labs Onesie':                 'add-to-cart-sauce-labs-onesie',
  'Test.allTheThings() T-Shirt (Red)': 'add-to-cart-test.allthethings()-t-shirt-(red)',
};

async addProductToCartByName(productName: string) {
  const dataTestId = this.productDataTestIds[productName];

  if (!dataTestId) {
    throw new Error(
      `Unknown product: "${productName}". Add it to productDataTestIds in InventoryPage.ts`
    );
  }

  const addButton = this.page.locator(`[data-test="${dataTestId}"]`);
  await expect(addButton).toBeVisible();
  await addButton.click();
}

  async addFirstProductToCart() {
    const firstAddButton = this.page
      .locator('[data-test^="add-to-cart"]')
      .first();
    const productName = await this.page
      .locator('.inventory_item_name')
      .first()
      .textContent();
    await firstAddButton.click();
    return productName?.trim() ?? '';
  }

  async verifyCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
