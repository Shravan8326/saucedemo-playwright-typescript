import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Step one - Your Information
  readonly stepOneTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly stepOneError: Locator;

  // Step two - Overview
  readonly stepTwoTitle: Locator;
  readonly overviewItems: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly itemTotal: Locator;
  readonly taxAmount: Locator;
  readonly orderTotal: Locator;
  readonly finishButton: Locator;

  // Complete page
  readonly completeTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly checkIcon: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step one
    this.stepOneTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.stepOneError = page.locator('[data-test="error"]');

    // Step two
    this.stepTwoTitle = page.locator('[data-test="title"]');
    this.overviewItems = page.locator('[data-test="cart-item"]');
    this.paymentInfo = page.locator('[data-test="payment-info-value"]');
    this.shippingInfo = page.locator('[data-test="shipping-info-value"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.taxAmount = page.locator('[data-test="tax-label"]');
    this.orderTotal = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    // Complete
    this.completeTitle = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.checkIcon = page.locator('[data-test="pony-express"]');
  }

  // ─── Step One ─────────────────────────────────────────────────────────────

  async verifyStepOneLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
    await expect(this.stepOneTitle).toHaveText('Checkout: Your Information');
  }

  async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async verifyStepOneError(message: string) {
    await expect(this.stepOneError).toBeVisible();
    await expect(this.stepOneError).toContainText(message);
  }

  // ─── Step Two ─────────────────────────────────────────────────────────────

  async verifyStepTwoLoaded() {
    await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
    await expect(this.stepTwoTitle).toHaveText('Checkout: Overview');
  }

  async verifyProductInOverview(productName: string) {
    await expect(
      this.page.locator('.inventory_item_name', { hasText: productName })
    ).toBeVisible();
  }

  async verifyOrderSummaryVisible() {
    await expect(this.paymentInfo).toBeVisible();
    await expect(this.shippingInfo).toBeVisible();
    await expect(this.itemTotal).toBeVisible();
    await expect(this.taxAmount).toBeVisible();
    await expect(this.orderTotal).toBeVisible();
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  // ─── Complete page ────────────────────────────────────────────────────────

  async verifyOrderCompletePage() {
    await expect(this.page).toHaveURL(/.*checkout-complete.html/);
    await expect(this.completeTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.completeText).toContainText(
      'Your order has been dispatched'
    );
    await expect(this.checkIcon).toBeVisible();
  }

  async clickBackHome() {
    await this.backHomeButton.click();
  }
}
