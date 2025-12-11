# Playwright E2E Automation Framework

This repository contains a fully isolated **Playwright E2E automation framework**  
built using **TypeScript**, **Page Object Model**, **ENV profiles**,  
and **Yarn workspace**.  

The project is designed to be:

- ✔ Modular  
- ✔ Maintainable  
- ✔ CI/CD friendly  
- ✔ Readable and scalable  
- ✔ Suitable for both demo assignments and real-world automation suites  

---

# 📦 Features

- **Playwright + TypeScript**
- **Page Object Model (POM)**
- **Selectors centralized in `/selectors`**
- **Test data in JSON**
- **Environment switching (test / staging / prod)**
- **Yarn-only workflow (works on macOS & Windows)**
- **Supports both Yarn and npm commands**
- **HTML and Allure reporting**
- **CI/CD pipelines (Jenkins + GitHub Actions)**

---

# 📁 Project Structure

```
playwright/
├── pages/               # Page Object Model classes
├── selectors/           # Centralized selectors for each page
├── helpers/             # Utilities (random data generators etc.)
├── data/                # Test data (JSON)
├── tests/               # All Playwright test files
│
├── configs/             # Environment JSON configs
├── playwright.config.ts # Global Playwright configuration
├── tsconfig.json        # TypeScript config
├── package.json         # Yarn workspace config
└── README.md            # This document
```

---

# 🛠 Installation (Windows & macOS)

## 1️⃣ Install Node.js  
Playwright requires Node.js 16 or higher.

Download from:  
👉 https://nodejs.org/en/download/

Check version:

```sh
node -v
npm -v
```

---

## 2️⃣ Install Yarn (Windows & macOS)

### 🟣 macOS
```sh
brew install yarn
```
(Requires Homebrew: https://brew.sh)

Alternatively:
```sh
npm install -g yarn
```

### 🟦 Windows
```sh
npm install -g yarn
```

Check Yarn version:

```sh
yarn -v
```

---

## 3️⃣ Install dependencies

From the **repo root**, run:

```sh
cd playwright
yarn install
```

Or using NPM:

```sh
npm install
```

---

## 4️⃣ Install Playwright browsers

```sh
npx playwright install
```

Or with Yarn:

```sh
yarn playwright install
```

---

# ▶️ Running Tests (YARN + NPM)

## Run **all tests** (Yarn)
```sh
yarn pw:test
```

## Run all tests (NPM)
```sh
npx playwright test
```

---

## Run in UI mode
```sh
yarn pw:ui
```

NPM:
```sh
npx playwright test --ui
```

---

## Run with specific browser
```sh
yarn pw:test --project=firefox
```

NPM:
```sh
npx playwright test --project=firefox
```

---

## Headed mode
```sh
ENV=test yarn pw:test --headed
```

NPM:
```sh
ENV=test npx playwright test --headed
```

---

# 🌍 Environment Switching

Environment is controlled via:

```
ENV=test | staging | prod
```

Example:

```sh
ENV=staging yarn pw:test
```

Configs are stored in:

```
playwright/configs/<env>.json
```

---

# 🧱 Page Object Model (POM)

Each page has:

- A **Page class** in `/pages`
- A **selector file** in `/selectors`

Example:

```ts
await page.getByTestId(LoginSelectors.username).fill("standard_user");
await page.getByTestId(LoginSelectors.password).fill("secret_sauce");
```

---

# 🎯 Alias Imports

Configured in `tsconfig.json`:

```ts
import { LoginPage } from '@pages/LoginPage'
import { InventorySelectors } from '@selectors/inventory'
import { randomString } from '@helpers/random'
import { login } from '@config/env'
```

---

# 📊 Reporting

## 1️⃣ Playwright HTML report

Generated automatically into:

```
playwright/playwright-report/
```

View locally:

```sh
npx playwright show-report
```

---

## 2️⃣ Allure Reporting

Enabled in config:

```ts
['allure-playwright']
```

Results stored in:

```
playwright/allure-results/
```

Generate report:

```sh
allure generate allure-results --clean -o allure-report
```

---

# 🚀 CI/CD Integration

## ✔ Jenkins Pipeline (`/Jenkinsfile`)
- Yarn installation  
- Playwright browser setup  
- ENV/BROWSER parameters  
- Reporting & artifact archiving  

## ✔ GitHub Actions Workflow
Located in:

```
.github/workflows/playwright.yml
```

Includes:

- Node setup  
- Yarn caching  
- Playwright install  
- Test execution  
- Report upload  
- (Optional) GitHub Pages publishing  

---

# 💡 Best Practices

- Prefer `getByTestId()` for stable locators  
- Keep selectors in `/selectors/*.ts`  
- Page Objects = behavior only  
- Tests = orchestration  
- Use environment switching for multi-profile CI  
- Keep PW isolated from Cypress  

---

# 🛠 Troubleshooting

### Playwright browsers missing?
```sh
npx playwright install
```

### JSON import error?
Add to tsconfig:
```json
"resolveJsonModule": true
```

### Yarn not found (Windows)?
Reinstall Yarn globally:
```sh
npm install -g yarn
```

---

# 🎉 Summary

This framework offers:

- ✔ Full E2E capabilities  
- ✔ Clear & scalable POM architecture  
- ✔ ENV-driven configuration  
- ✔ Browser matrix execution  
- ✔ Allure + HTML reporting  
- ✔ CI/CD ready  
- ✔ Compatible with both Yarn and NPM  

Enjoy your Playwright automation framework! 🚀
