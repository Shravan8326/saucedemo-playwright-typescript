# Bug Report — SauceDemo (Practice Project)

While building and running my automation framework against SauceDemo, 

I observed several behavioral differences across user types. 

SauceDemo intentionally introduces these bugs to simulate real-world 

QA scenarios. I've documented them below following standard bug 

reporting practices I use in my professional work.

---

## Bug Summary

| Bug ID | Affected User | Severity | Area | Status |

|---|---|---|---|---|

| BUG-001 | error_user | P0 — Critical | Checkout | Documented |

| BUG-002 | problem_user | P1 — High | Product Images | Documented |

| BUG-003 | error_user | P1 — High | Sorting | Documented |

| BUG-004 | problem_user | P1 — High | Checkout | Documented |

| BUG-005 | visual_user | P2 — Medium | Product Images | Documented |

| BUG-006 | visual_user | P2 — Medium | Cart Icon | Documented |

| BUG-007 | problem_user | P2 — Medium | Sorting | Documented |

| BUG-008 | performance_glitch_user | P3 — Low | Login Performance | Documented |

---

## Detailed Bug Reports

### BUG-001 | P0 — Critical

**Title:** Checkout cannot be completed — Finish button non-functional  

**Affected User:** error_user  

**Area:** Checkout Flow  

**Steps to Reproduce:**

1. Login as error_user

2. Add any product to cart

3. Navigate to cart → click Checkout

4. Fill First Name and Zip Code (Last Name field is broken — see BUG-003)

5. Click Continue → Checkout Overview loads

6. Click Finish

**Expected:** Order confirmation page loads  

**Actual:** Finish button does not complete the order, stays on overview page  

**Impact:** User cannot place any order — complete checkout flow is blocked

---

### BUG-002 | P1 — High

**Title:** All product images show the same incorrect image  

**Affected User:** problem_user  

**Area:** Product Listing  

**Steps to Reproduce:**

1. Login as problem_user

2. Navigate to Products page

3. Observe product images

**Expected:** Each product shows its own unique image  

**Actual:** All 6 products display the same image regardless of the product  

**Impact:** Customer cannot visually identify products before purchase

---

### BUG-003 | P1 — High

**Title:** Sorting triggers unhandled browser alert popup  

**Affected User:** error_user  

**Area:** Product Sorting  

**Steps to Reproduce:**

1. Login as error_user

2. On Products page, click the sort dropdown

3. Select any sort option (e.g. Name Z to A)

**Expected:** Products sort correctly  

**Actual:** Browser alert popup appears saying "Sorting is broken" — error reported to Backtrace but not handled gracefully  

**Impact:** Poor user experience — unhandled errors should be caught and shown as inline messages, not browser popups

---

### BUG-004 | P1 — High

**Title:** Last name field does not accept input during checkout  

**Affected User:** problem_user, error_user  

**Area:** Checkout — Your Information  

**Steps to Reproduce:**

1. Login as problem_user or error_user

2. Add product to cart → Checkout

3. Try typing in the Last Name field

**Expected:** Last Name field accepts typed input  

**Actual:** Field appears active but does not retain any typed value — stays empty  

**Impact:** Checkout cannot be completed without last name

---

### BUG-005 | P2 — Medium

**Title:** Product preview image differs from detail page image  

**Affected User:** visual_user  

**Area:** Product Images  

**Steps to Reproduce:**

1. Login as visual_user

2. Note the image shown for any product on the inventory page

3. Click on that product to open the detail page

4. Compare images

**Expected:** Same product image on both inventory and detail page  

**Actual:** Different images shown — inventory shows one image, detail page shows another  

**Impact:** Inconsistent product visuals — customer may feel misled

---

### BUG-006 | P2 — Medium

**Title:** Cart icon and checkout icon are misplaced  

**Affected User:** visual_user  

**Area:** Navigation / UI Layout  

**Steps to Reproduce:**

1. Login as visual_user

2. Observe the cart icon position in the header

3. Compare with standard_user layout

**Expected:** Cart icon in top-right corner (consistent with standard layout)  

**Actual:** Cart icon position differs from expected layout — visually misaligned  

**Impact:** Navigation confusion — users may not find the cart easily

---

### BUG-007 | P2 — Medium

**Title:** Name Z to A sorting does not work correctly  

**Affected User:** problem_user  

**Area:** Product Sorting  

**Steps to Reproduce:**

1. Login as problem_user

2. Select Name (Z to A) from sort dropdown

**Expected:** Products listed in reverse alphabetical order  

**Actual:** Products do not sort in Z to A order — order remains incorrect  

**Impact:** Sorting feature unreliable for this user type

---

### BUG-008 | P3 — Low

**Title:** Login takes 2000ms+ compared to ~300ms for standard user  

**Affected User:** performance_glitch_user  

**Area:** Login Performance  

**Steps to Reproduce:**

1. Login as performance_glitch_user

2. Measure time from clicking Login to inventory page loading

**Expected:** Login completes within acceptable response time (~500ms)  

**Actual:** Login takes between 2000ms–5000ms  

**Impact:** Poor user experience under normal network conditions — would cause user drop-off in production

---

## How These Were Caught

All bugs above were caught by automated tests in this framework.  

Failed test cases, screenshots, and video recordings are automatically 

generated and stored in the `test-results/` folder on failure.

Relevant test files:

- `tests/problem-user.spec.ts`

- `tests/error-user.spec.ts`

- `tests/visual-user.spec.ts`

- `tests/performance-glitch-user.spec.ts`