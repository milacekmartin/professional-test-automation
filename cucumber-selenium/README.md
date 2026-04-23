# Cucumber + Selenium + Java

BDD (Behavior-Driven Development) test framework using **Gherkin** feature files, executed by **Cucumber 7** on top of **Selenium 4** and **Java 21**.

## Stack

| Component | Version |
|---|---|
| Java | 21 |
| Maven | 3.9+ |
| Cucumber | 7.20.1 |
| Selenium | 4.27.0 |
| JUnit 5 | 5.11.4 |
| WebDriverManager | 5.9.3 (auto browser driver) |

## Structure

```
cucumber-selenium/
├── pom.xml
└── src/test/
    ├── java/com/pta/
    │   ├── pages/          # Page Object Model
    │   ├── steps/          # Cucumber step definitions
    │   ├── hooks/          # @Before / @After + DriverFactory
    │   └── runners/        # JUnit suite runner
    └── resources/
        └── features/       # Gherkin .feature files
```

## Run locally

```bash
cd cucumber-selenium

# Headless (default) — Chrome
mvn test

# Visible browser
mvn test -Plocal

# Only smoke tests
mvn test -Dcucumber.filter.tags="@smoke"

# Only negative scenarios
mvn test -Dcucumber.filter.tags="@negative"

# Firefox
mvn test -Dbrowser=firefox
```

HTML report is generated at `target/cucumber-report/index.html`.

## Test coverage

**Positive scenarios:**
- Login with all valid user roles (Scenario Outline)
- Add single product → checkout → confirmation
- Add multiple products via DataTable

**Negative scenarios:**
- Locked-out user cannot log in
- Invalid password rejected
- Empty username rejected
- Missing last name on checkout
- Missing ZIP code on checkout

## CI

Runs on every push via [`.github/workflows/cucumber.yml`](../.github/workflows/cucumber.yml) — HTML report is published to [gh-pages](https://milacekmartin.github.io/professional-test-automation/cucumber/).
