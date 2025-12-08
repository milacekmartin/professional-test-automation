import { defineConfig } from '@playwright/test'
import { baseUrl } from './env'

export default defineConfig({
    testDir: './tests',

    use: {
        baseURL: baseUrl,
        headless: true,

        testIdAttribute: 'data-test',

        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    
    reporter: [
        ['list'],
        ['allure-playwright']
    ],

    fullyParallel: true,
})
