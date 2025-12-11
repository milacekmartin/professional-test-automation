/**
 * FULL E2E PURCHASE FLOW
 * ---------------------------------------------------------
 * This test simulates a complete end-to-end purchase flow 
 * on the SauceDemo e-commerce application.
 *
 * Purpose:
 * - Validate login functionality (handled in beforeEach)
 * - Verify product inventory loads correctly
 * - Add all products to the cart
 * - Confirm correct cart contents and proceed to checkout
 * - Fill in personal information during checkout
 * - Verify pricing summary and totals
 * - Complete the order
 * - Confirm order completion success message
 *
 * This test covers the full “happy path” purchase scenario.
 */

import { test } from '@playwright/test'

import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage'
import { OrderCompletePage } from '../pages/OrderCompletePage'

import { randomString, randomNumber } from '../helpers/random'

test.describe('FE test', () => {

    /**
     * Before each test:
     * - Log in using default credentials
     */
    test.beforeEach(async ({ page }) => {
        await new LoginPage(page).loginAsDefaultUser()
    })
  
    test('full E2E purchase flow', async ({ page }) => {

        /**
         * Step 1: Verify that the inventory page loads and displays products
         */
        const inventory = new InventoryPage(page)
        await inventory.verifyProductList()

        /**
         * Step 2: Add all available items to the cart
         * and navigate to the cart page
         */
        const itemCount = await inventory.addAllItems()
        await inventory.goToCart(itemCount)

        /**
         * Step 3: Validate the number of products in the cart
         * and continue to the checkout process
         */
        const cart = new CartPage(page)
        await cart.verifyCartItems(itemCount)
        await cart.checkout()

        /**
         * Step 4: Fill out personal information required for checkout
         */
        const checkout = new CheckoutPage(page)
        await checkout.fillPersonalInfo(
            randomString(),     // First name
            randomString(),     // Last name
            randomNumber(5)     // Postal code
        )

        /**
         * Step 5: Verify pricing details and finalize the order
         */
        const overview = new CheckoutOverviewPage(page)
        await overview.verifyPricesMatchCart()
        await overview.finishOrder()

        /**
         * Step 6: Confirm that the order completion page is displayed successfully
         */
        const complete = new OrderCompletePage(page)
        await complete.verifyCompletion()
    })
})
