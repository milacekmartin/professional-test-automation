# Playwright E2E Automation Framework

This directory contains a fully isolated **Playwright E2E test automation framework** designed for clean separation from Cypress.  
It includes:

- **TypeScript**
- **Page Object Model (POM)**
- **Centralized data-test selectors**
- **Environment profiles (ENV=test | staging | prod)**
- **Allure reporting**
- **Yarn-only workflow**
- **CI/CD-ready (Jenkins pipeline included)**

---

## 📁 Project Structure

```
playwright/
│
├── pages/               # Page Object Model (LoginPage, InventoryPage, CartPage…)
├── selectors/           # Centralized data-test selectors for each page
├── helpers/             # Utilities (randomString, randomNumber, attachments…)
│
├── tests/               # All test suites (order.spec.ts, api.spec.ts…)
│
├── tsconfig.json        # TypeScript config with alias paths
├── playwright.config.ts # Playwright configuration (Allure + environment support)
│
├── package.json         # Yarn-based Playwright workspace
└── README.md            # This document
```

---

## 🛠 Installation

From the **root project directory**:

```sh
cd playwright
yarn install
npx playwright install
```

This installs:

- Playwright browsers  
- Playwright’s own Node modules  
- Allure integration  

---

## ▶️ Running Tests

### Run all Playwright tests:

```sh
yarn pw:test
```

### Run in UI mode:

```sh
yarn pw:ui
```

### Run with a specific browser:

```sh
yarn pw:test --project=firefox
```

### Run in headed mode:

```sh
ENV=test yarn pw:test --headed
```

---

## 🌍 Environment Switching

The framework reads environment config via:

```
ENV=test | staging | prod
```

Example:

```sh
ENV=staging yarn pw:test
```

Environment files live in:

```
playwright/configs/<env>.json
```

---

## 🧱 Page Object Model Structure

Each page consists of:

- Its own selector file (`selectors/*.ts`)
- Its Page Object class (`pages/*.ts`)

Example selector usage:

```ts
await page.getByTestId(LoginSelectors.username).fill("standard_user");
await page.getByTestId(LoginSelectors.password).fill("secret_sauce");
```

---

## 🎯 Alias Imports

`tsconfig.json` defines clean aliases:

```ts
import { LoginPage } from '@pages/LoginPage'
import { InventorySelectors } from '@selectors/inventory'
import { randomString } from '@helpers/random'
import { login } from '@config/env'
```

---

## 📊 Allure Reporting

Enabled in `playwright.config.ts`:

```ts
reporter: [
  ['list'],
  ['allure-playwright']
]
```

Results are stored in:

```
playwright/allure-results/
```

### Generate report:

```sh
yarn pw:report
```

### Open generated report:

```sh
yarn pw:open
```

### Live server:

```sh
yarn pw:serve
```

---

## 🧪 Example Full E2E Test Execution

```sh
yarn pw:test
```

Output example:

```
Running 1 test using 1 worker
✓ full E2E purchase flow (3.7s)
```

Allure output appears in:

```
playwright/allure-results
playwright/allure-report
```

---

## 🏗 Jenkins Integration

The project includes a ready-to-use Jenkins pipeline:

```
/Jenkinsfile
```

Features:

- Yarn-based Playwright installation
- ENV, BROWSER, HEADLESS parameters
- Artifact archiving
- Allure result publishing
- CI stable workflow

---

## 💡 Best Practices

- Always use `getByTestId()` for maximum stability
- Keep selectors isolated in `selectors/*.ts`
- Page Objects should strictly represent UI behavior
- Tests should orchestrate logic, not Page Objects
- Keep Playwright isolated from Cypress to avoid dependency conflicts

---

## 🎉 Summary

This Playwright framework is:

- 🔒 Fully isolated from Cypress  
- ⚡ Fast and modern  
- 🧩 Modular and clean  
- 📊 Integrated with Allure  
- 🧱 CI/CD ready  
- 🧼 Maintanable and scalable  

Enjoy your new Playwright automation environment! 🚀
