import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async verifyProductInCart(productName: string) {
    await expect(
      this.page.locator('.inventory_item_name', { hasText: productName })
    ).toBeVisible();
  }

  async verifyCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
  async removeProductByName(productName: string) {
    const removeButton = this.page.locator('.cart_item')
      .filter({ hasText: productName })
      .locator('[data-test^="remove"]');
    await expect(removeButton).toBeVisible();
    await removeButton.click();
  }
  
  async verifyCartIsEmpty() {
    await expect(this.cartItems).toHaveCount(0);
    await expect(this.page.locator('.cart_item')).toHaveCount(0);
  }
  
  async verifyCartBadgeNotVisible() {
    await expect(
      this.page.locator('[data-test="shopping-cart-badge"]')
    ).not.toBeVisible();
  }
}
