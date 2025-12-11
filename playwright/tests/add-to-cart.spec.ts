/**
 * ADD TO CART TEST SCENARIO
 * ---------------------------------------------------------
 * This test verifies that a user can add a product to the shopping cart
 * after logging into the application.
 *
 * Purpose:
 * - Ensure a product defined in external JSON test data can be located
 * - Validate that adding the product to the cart succeeds
 * - Confirm that the cart contains the expected item after navigation
 *
 * This scenario represents a basic functional flow commonly used 
 * in e-commerce applications.
 */

import { test } from '@playwright/test'
import products from '../data/products.json'

import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage'
import { CartPage } from '../pages/CartPage'

test.describe('Add to cart', () => {

    /**
     * Before each test:
     * - Log in using default credentials
     */
    test.beforeEach(async ({ page }) => {
        await new LoginPage(page).loginAsDefaultUser()
    })

    test('User can add a product to the cart', async ({ page }) => {

        /**
         * Step 1: Navigate to the home page (inventory page)
         */
        const home = new HomePage(page)
        await test.step('Locate product from JSON test data', async () => {
            // nothing to perform here — creation of POM object covered above
        })

        /**
         * Step 2: Add the product specified in JSON test data
         */
        await test.step(`Add product "${products.productToBuy}" to cart`, async () => {
            await home.addProductToCart(products.productToBuy)
        })

        /**
         * Step 3: Open the shopping cart
         */
        const cart = new CartPage(page)
        await test.step('Open shopping cart view', async () => {
            await cart.openCart()
        })

        /**
         * Step 4: Verify that the desired product appears in the cart
         */
        await test.step(`Verify product "${products.productToBuy}" is in cart`, async () => {
            await cart.verifyItemInCart(products.productToBuy)
        })
    })
})
