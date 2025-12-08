import { defineConfig } from '@playwright/test'
import { baseUrl } from './env'

export default defineConfig({

    testDir: './tests',

    fullyParallel: false,
    workers: 1,
    retries: 0,

    use: {
        baseURL: baseUrl,
        headless: true,
        testIdAttribute: 'data-test',

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
    },

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
