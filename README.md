<div align="center">

# Professional Test Automation — Framework Showcase

**Three production-grade test frameworks, one reference app, one goal: show what good QA automation looks like in 2026.**

[![Cypress Tests](https://github.com/milacekmartin/professional-test-automation/actions/workflows/cypress.yml/badge.svg)](https://github.com/milacekmartin/professional-test-automation/actions/workflows/cypress.yml)
[![Playwright Tests](https://github.com/milacekmartin/professional-test-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/milacekmartin/professional-test-automation/actions/workflows/playwright.yml)
[![Cucumber (Selenium + Java)](https://github.com/milacekmartin/professional-test-automation/actions/workflows/cucumber.yml/badge.svg)](https://github.com/milacekmartin/professional-test-automation/actions/workflows/cucumber.yml)

[**📊 Live reports** →](https://milacekmartin.github.io/professional-test-automation/) · [**🌐 Professional Test Automation s.r.o.**](https://professional-test-automation.com)

</div>

---

## What's in this repository

Three independent test automation frameworks, each targeting the same reference application ([saucedemo.com](https://www.saucedemo.com)), so you can compare the same scenarios implemented three different ways — idiomatic to each tool.

| Framework | Language | Style | Report | Source |
|---|---|---|---|---|
| 🟢 **Cypress 15** | TypeScript | Chained, in-browser | [Allure HTML](https://milacekmartin.github.io/professional-test-automation/cypress/) | [`cypress/`](./cypress) |
| 🟠 **Playwright** | TypeScript | Async, out-of-browser | [Playwright HTML](https://milacekmartin.github.io/professional-test-automation/playwright/) | [`playwright/`](./playwright) |
| 🟩 **Cucumber + Selenium** | Java 21 | BDD / Gherkin | [Cucumber HTML](https://milacekmartin.github.io/professional-test-automation/cucumber/) | [`cucumber-selenium/`](./cucumber-selenium) |

Each framework includes **positive and negative scenarios**, CI/CD integration, and auto-published HTML reports on every push.

---

## Architecture

```
professional-test-automation/
├── cypress/              # Cypress 15 + TypeScript framework
│   ├── e2e/              # FE + BE test specs
│   ├── support/          # custom commands, API helpers, schema validation
│   ├── helpers/pages/    # Page Object Model
│   └── configs/          # per-env configs
│
├── playwright/           # Playwright + TypeScript framework
│   ├── tests/            # add-to-cart, order, negative scenarios
│   ├── pages/            # Page Object Model
│   └── data/             # fixtures
│
├── cucumber-selenium/    # Cucumber + Java + Selenium framework (BDD)
│   └── src/test/
│       ├── java/com/pta/
│       │   ├── pages/    # POM in Java
│       │   ├── steps/    # Gherkin step definitions
│       │   ├── hooks/    # @Before/@After + DriverFactory
│       │   └── runners/  # JUnit 5 Suite runner
│       └── resources/features/   # .feature files in Gherkin
│
├── docs/landing/         # GitHub Pages landing
└── .github/workflows/    # one workflow per framework + landing publisher
```

---

## Running locally

### Cypress

```bash
yarn install
yarn cy:test:open     # interactive
yarn cy:test:run      # headless
yarn allure:report    # generate + open Allure HTML
```

### Playwright

```bash
cd playwright
yarn install
yarn pw:test          # headless
yarn pw:report        # open HTML report
```

### Cucumber + Selenium

```bash
cd cucumber-selenium
mvn test                                    # all scenarios, headless Chrome
mvn test -Plocal                            # visible browser
mvn test -Dcucumber.filter.tags="@smoke"    # only smoke
mvn test -Dcucumber.filter.tags="@negative" # only negative
mvn test -Dbrowser=firefox                  # Firefox
```

Full Cucumber documentation → [cucumber-selenium/README.md](./cucumber-selenium/README.md)

---

## Continuous integration

Every push to `main` triggers the relevant workflow (path-filtered) — each framework runs tests, produces an HTML report, and publishes it to the [`gh-pages`](https://milacekmartin.github.io/professional-test-automation/) branch.

| Workflow | Trigger | Report path |
|---|---|---|
| [`cypress.yml`](./.github/workflows/cypress.yml) | `cypress/**` | [`/cypress/`](https://milacekmartin.github.io/professional-test-automation/cypress/) |
| [`playwright.yml`](./.github/workflows/playwright.yml) | `playwright/**` | [`/playwright/`](https://milacekmartin.github.io/professional-test-automation/playwright/) |
| [`cucumber.yml`](./.github/workflows/cucumber.yml) | `cucumber-selenium/**` | [`/cucumber/`](https://milacekmartin.github.io/professional-test-automation/cucumber/) |
| [`pages-landing.yml`](./.github/workflows/pages-landing.yml) | `docs/landing/**` | Landing root |

All workflows are also **manually triggerable** via the Actions tab → *Run workflow*, with parameters (tag filters, environment).

---

## Reference application

All three frameworks target **[saucedemo.com](https://www.saucedemo.com)** — a free, stable demo storefront maintained by Sauce Labs. It exposes real login flows, product listings, shopping cart, and checkout — enough surface area to demonstrate meaningful UI automation without needing a dedicated test environment.

Scenarios covered (across frameworks):

**Positive:**
- Login with valid credentials (all user roles)
- Add single product → checkout → order confirmation
- Add multiple products via data-driven tables

**Negative:**
- Locked-out user cannot log in
- Invalid password rejected
- Empty username rejected
- Missing last name / zip code on checkout

---

## Who runs this?

This showcase is maintained by [**Professional Test Automation s.r.o.**](https://professional-test-automation.com) — a Slovak/Czech QA automation studio offering **fixed-price** test automation services:

- 🎯 **Web E2E testing** from €2,490 (Cypress or Playwright)
- 📱 **Mobile automation** from €4,990 (Appium + iOS/Android)
- ⚙️ **CI/CD integration** from €1,990
- 🔄 **Azure DevOps ↔ Jira sync** from €3,490

**No hourly billing.** Code delivered straight to your GitHub. [Book a 30-min discovery call →](https://professional-test-automation.com/kontakt/?utm_source=github&utm_medium=readme&utm_campaign=framework_showcase)

---

<div align="center">
<sub>© 2026 Professional Test Automation s.r.o. — MIT licensed framework code, free to fork.</sub>
</div>
