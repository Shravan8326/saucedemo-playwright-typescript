# saucedemo-playwright-ts

> End-to-End Automation Framework for [SauceDemo](https://www.saucedemo.com) using **Playwright + TypeScript** with **Page Object Model (POM)** design pattern.

![Playwright](https://img.shields.io/badge/Playwright-1.44-green?logo=playwright)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![CI](https://github.com/<your-username>/saucedemo-playwright-ts/actions/workflows/playwright.yml/badge.svg)

---

## About this project

This project automates the complete E2E checkout flow of the SauceDemo web application, covering login, product selection, cart management, checkout, and order confirmation. Built to demonstrate industry-standard QA automation practices aligned with real-world SDET roles in financial and enterprise domains.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Playwright | Browser automation |
| TypeScript | Type-safe test scripting |
| Page Object Model | Test maintainability & reuse |
| GitHub Actions | CI/CD pipeline |
| HTML Reporter | Test execution reports |

---

## Project Structure

```
saucedemo-playwright-ts/
├── pages/
│   ├── LoginPage.ts          # Login page locators & actions
│   ├── InventoryPage.ts      # Products page locators & actions
│   ├── CartPage.ts           # Cart page locators & actions
│   └── CheckoutPage.ts       # Checkout (step1, step2, complete) locators & actions
├── tests/
│   └── checkout.spec.ts      # All 12 test cases
├── utils/
│   └── testData.ts           # Centralized test data (users, checkout info, URLs)
├── .github/
│   └── workflows/
│       └── playwright.yml    # GitHub Actions CI pipeline
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Test Cases

| TC ID | Description | Type |
|---|---|---|
| TC-001 | Login page loads at base URL | Positive |
| TC-002 | Successful login redirects to inventory page | Positive |
| TC-003 | Header shows Swag Labs, hamburger menu, and cart icon | Positive |
| TC-004 | Adding a product updates cart badge to 1 | Positive |
| TC-005 | Cart page displays the added product | Positive |
| TC-006 | Clicking Checkout loads Your Information page | Positive |
| TC-007 | Continuing with empty fields shows validation error | Negative |
| TC-008 | Filling info and continuing loads Overview page | Positive |
| TC-009 | Clicking Finish shows Order Complete page | Positive |
| TC-010 | **Full E2E: Login → Add to Cart → Checkout → Back Home** | E2E |
| TC-011 | Locked out user sees error on login | Negative |
| TC-012 | Invalid credentials show error message | Negative |

---

## Setup & Run

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/<your-username>/saucedemo-playwright-ts.git
cd saucedemo-playwright-ts
npm install
npx playwright install chromium
```

### Run all tests

```bash
npm test
```

### Run headed (watch browser)

```bash
npm run test:headed
```

### Run specific test file

```bash
npm run test:checkout
```

### View HTML report

```bash
npm run test:report
```

---

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions. The HTML report is uploaded as an artifact and retained for 30 days.

---

## Author

**Sravan Kumar Redapaka**  
QA Automation Engineer | Playwright · TypeScript · Selenium · Java · AWS  
[LinkedIn](https://linkedin.com/in/your-profile) | [GitHub](https://github.com/your-username)
