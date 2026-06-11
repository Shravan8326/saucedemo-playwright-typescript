import { Page, Locator, expect } from '@playwright/test';

export class SauceLabsNavPage {
  readonly page: Page;

  // Navbar items
  readonly productsMenu: Locator;
  readonly solutionsMenu: Locator;
  readonly developersMenu: Locator;
  readonly resourcesMenu: Locator;
  readonly sauceAILink: Locator;
  readonly pricingLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsMenu   = page.locator('.navMenuLabel', { hasText: 'Products' });
this.solutionsMenu  = page.locator('.navMenuLabel', { hasText: 'Solutions' });
this.developersMenu = page.locator('.navMenuLabel', { hasText: 'Developers' });
this.resourcesMenu  = page.locator('.navMenuLabel', { hasText: 'Resources' });
this.sauceAILink    = page.locator('.navMenuLabel', { hasText: 'Sauce AI' });
this.pricingLink    = page.locator('.navMenuLabel', { hasText: 'Pricing' });
  }

  async goto() {
    await this.page.goto('https://saucelabs.com');
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL('https://saucelabs.com/');
    await expect(this.page.getByRole('heading', {
      name: "The World's Only Full-Lifecycle AI-Quality Platform"
    })).toBeVisible();
  }

  // ─── Hover actions ────────────────────────────────────────────────────────

  async hoverProducts() {
    await this.productsMenu.hover();
  }

  async hoverSolutions() {
    await this.solutionsMenu.hover();
  }

  async hoverDevelopers() {
    await this.developersMenu.hover();
  }

  async hoverResources() {
    await this.resourcesMenu.hover();
  }

  // ─── Products dropdown verification ──────────────────────────────────────

  async verifyProductsDropdown() {
  await expect(this.page.getByText('Platform for AI-Driven Quality').first()).toBeVisible();
  await expect(this.page.getByText('Global Tools').first()).toBeVisible();
  await expect(this.page.getByText('Setup & Integrate').first()).toBeVisible();
  await expect(this.page.getByText('Demo Center').first()).toBeVisible();
}

  // ─── Solutions dropdown verification ─────────────────────────────────────

  async verifySolutionsDropdown() {
  await expect(this.page.getByText('Enterprise Solutions').first()).toBeVisible();
  await expect(this.page.getByText('Use Cases').first()).toBeVisible();
  await expect(this.page.getByText('Industries').first()).toBeVisible();
}

  // ─── Developers dropdown verification ────────────────────────────────────

  async verifyDevelopersDropdown() {
  await expect(this.page.getByText('Resources for Devs & Testers').first()).toBeVisible();
  await expect(this.page.getByText('Quickstart Guides').first()).toBeVisible();
  await expect(this.page.getByText('Getting Started Guides').first()).toBeVisible();
  await expect(this.page.getByText('Set Up & Configure').first()).toBeVisible();
}


  // ─── Resources dropdown verification ─────────────────────────────────────

  async verifyResourcesDropdown() {
  await expect(this.page.getByText('EXPLORE & LEARN')).toBeVisible();
  await expect(this.page.getByText('WHY SAUCE LABS?')).toBeVisible();
  await expect(this.page.getByText("WHAT'S NEW")).toBeVisible();
  // verify a unique item inside Resources section
  await expect(this.page.getByText('ROI Calculator')).toBeVisible();
}

  // ─── Click actions ────────────────────────────────────────────────────────

  async clickSauceAI() {
    await this.sauceAILink.click();
  }

  async clickPricing() {
    await this.pricingLink.click();
  }
}