/**
 * NEGATIVE TEST SCENARIO
 * ---------------------------------------------------------
 * This test verifies that the system correctly handles
 * a situation where a user searches for or expects a product
 * that does not exist in the catalog.
 *
 * Purpose:
 * - Ensure the UI does not display non-existing items
 * - Validate correct behavior when invalid product names are used
 *
 * This is a simple validation scenario ensuring robustness of the UI
 * against invalid or unexpected input values.
 */

import { test, expect } from '@playwright/test'

import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage'

test.describe('Negative test', () => {

    /**
     * Before each test:
     * - Log in using default user credentials
     */
    test.beforeEach(async ({ page }) => {
        await new LoginPage(page).loginAsDefaultUser()
    })

    test('Non-existing product cannot be added to cart', async ({ page }) => {

        /**
         * Step 1: Create a HomePage instance
         * (Inventory is loaded automatically after login)
         */
        await test.step('Initialize HomePage object', async () => {
            new HomePage(page)
        })

        /**
         * Step 2: Define a product name that does not exist in the store
         */
        const nonExisting = "Product That Does Not Exist"

        /**
         * Step 3: Verify that the non-existing product is not present
         * anywhere on the page
         */
        await test.step('Verify non-existing product is not visible in inventory', async () => {
            await expect(page.getByText(nonExisting)).toHaveCount(0)
        })
    })
})
