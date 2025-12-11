/**
 * CART PAGE OBJECT
 * ---------------------------------------------------------
 * This Page Object encapsulates all interactions and validations
 * related to the shopping cart page in the SauceDemo application.
 *
 * Responsibilities:
 * - Opening the cart page
 * - Verifying that the correct items are present in the cart
 * - Validating the number of items added to the cart
 * - Navigating from the cart to the checkout process
 *
 * Each action is implemented as an atomic, reusable method that can be
 * used across multiple test scenarios.
 */

import { Page, expect } from '@playwright/test'
import { CartSelectors } from '../selectors/cart'

export class CartPage {
    constructor(private page: Page) {}

    /**
     * Opens the shopping cart view by clicking on the cart icon.
     * Validates navigation by checking the cart URL.
     */
    async openCart() {
        await this.page.getByTestId(CartSelectors.cartLink).click()
        await expect(this.page).toHaveURL(/cart/)
    }

    /**
     * Verifies that a specific product is present in the cart.
     *
     * @param productName - The exact product name expected to appear in the cart.
     */
    async verifyItemInCart(productName: string) {
        const item = this.page
            .getByTestId(CartSelectors.itemName)
            .filter({ hasText: productName })

        await expect(item).toBeVisible()
    }

    /**
     * Verifies that the shopping cart contains the correct number of items.
     *
     * @param expectedCount - The expected number of cart items.
     */
    async verifyCartItems(expectedCount: number) {
        const items = this.page.getByTestId(CartSelectors.item)
        await expect(items).toHaveCount(expectedCount)
    }

    /**
     * Proceeds from the cart to the first checkout step.
     * Confirms navigation by validating the checkout-step-one URL.
     */
    async checkout() {
        await this.page.getByTestId(CartSelectors.checkoutButton).click()
        await expect(this.page).toHaveURL(/checkout-step-one/)
    }
}
