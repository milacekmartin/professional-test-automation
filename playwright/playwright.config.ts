/**
 * PLAYWRIGHT TEST CONFIGURATION
 * ---------------------------------------------------------
 * Central configuration for Playwright test runner.
 *
 * This file configures:
 * - Test directory
 * - Execution behavior (parallelization, retries, workers)
 * - Global browser/page settings
 * - Screenshot, video, and trace collection rules
 * - Reporters (console, Allure, HTML)
 * - Multi-browser projects
 *
 * Additional options that Playwright supports (informational):
 * -----------------------------------------------------------
 * - timeout:        Max duration for a single test
 * - globalTimeout:  Max duration for entire test suite
 * - expect:         Configure assertion timeout behavior
 * - snapshotDir:    Custom folder for UI snapshots
 * - maxFailures:    Stop test run early after X failures
 * - forbidOnly:     Fail CI if .only is committed
 * - retries:        Retry failed tests (useful in unstable CI)
 * - outputDir:      Where to store traces/screenshots
 * - reporterTimeout: Timeout for reporters during heavy runs
 *
 * These options are not all enabled here, but listed for clarity.
 */

import { defineConfig } from '@playwright/test'
import { baseUrl } from './env'

export default defineConfig({

    /**
     * Folder containing all test files.
     */
    testDir: './tests',

    /**
     * Execution behavior:
     *
     * fullyParallel:
     *   - false: tests run sequentially
     *   - true: tests run in parallel when safe
     *
     * workers:
     *   - Controls number of test workers. Useful in CI.
     *
     * retries:
     *   - Number of times to retry failing tests.
     *
     * Additional related options (not used here):
     *   - maxFailures: Fail fast after X failed tests
     *   - forbidOnly: Prevents accidental pushes with test.only
     */
    fullyParallel: false,
    workers: 1,
    retries: 0,

    /**
     * Global settings applied to every browser context/page.
     *
     * Available options (documented):
     * ---------------------------------------------
     * baseURL: base URL for page.goto()
     * headless: run in headless mode
     * testIdAttribute: which attribute Playwright uses for getByTestId()
     * screenshot: take screenshots on failure / always / never
     * video: record video retain-on-failure / on / off
     * trace: capture Playwright trace files
     *
     * Additional useful options Playwright supports (not used here):
     * ---------------------------------------------
     * viewport: { width, height }
     * userAgent: custom user agent string
     * locale: browser locale (e.g., 'en-US')
     * permissions: grant permissions (geolocation, clipboard…)
     * colorScheme: 'light' | 'dark'
     * timezoneId: 'Europe/Bratislava'
     * storageState: preload authentication state
     * bypassCSP: disable Content-Security-Policy (useful for UI debugging)
     */
    use: {
        baseURL: baseUrl,
        headless: true,
        testIdAttribute: 'data-test',

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
    },

    /**
     * Reporter configuration.
     *
     * list:
     *   - Default CLI reporter
     *
     * allure-playwright:
     *   - Produces Allure XML/JSON results for CI pipelines
     *
     * html:
     *   - Built-in Playwright HTML dashboard (static, interactive)
     *
     * Other reporters available (not used here):
     * -----------------------------------------------------
     * - dot: minimalistic CI reporter
     * - line: verbose test-per-line reporter
     * - junit: for Jenkins + other enterprise CI tools
     * - json: export test results programmatically
     * - blob: used by Playwright Test to enable show-report
     */
    reporter: [
        ['list'],
        [
            'allure-playwright',
            {
                outputFolder: 'allure-results',
                detail: true,
                suiteTitle: false
            }
        ],
        ['html', { outputFolder: 'playwright-report', open: 'never' }]
    ],

    /**
     * Multi-browser project configuration.
     *
     * Playwright supports parallel multi-browser CI execution.
     * Each project runs independently with its own configuration.
     *
     * Additional options that could be defined per-project:
     * -----------------------------------------------------
     * - viewport overrides
     * - device simulation (e.g. iPhone 14 settings)
     * - contextOptions (locale, timezone, geolocation)
     * - launchOptions (headless, args, slowMo)
     */
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' }
        },
        {
            name: 'firefox',
            use: { browserName: 'firefox' }
        },
        {
            name: 'webkit',
            use: { browserName: 'webkit' }
        }
    ]
})
