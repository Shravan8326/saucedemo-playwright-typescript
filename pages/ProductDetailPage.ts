import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productDesc: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName    = page.locator('[data-test="inventory-item-name"]');
    this.productDesc    = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice   = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton   = page.locator('[data-test^="remove"]');
    this.backButton     = page.locator('[data-test="back-to-products"]');
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/.*inventory-item.html/);
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
  }

  async getProductDetails() {
    return {
      name:  await this.productName.innerText(),
      desc:  await this.productDesc.innerText(),
      price: await this.productPrice.innerText(),
    };
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async verifyAddToCartChangedToRemove() {
    await expect(this.removeButton).toBeVisible();
    await expect(this.addToCartButton).not.toBeVisible();
  }

  async clickBackButton() {
    await this.backButton.click();
  }
}