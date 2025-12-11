/**
 * CHECKOUT OVERVIEW PAGE OBJECT
 * ---------------------------------------------------------
 * This Page Object represents the order summary page
 * in the SauceDemo checkout process.
 *
 * Responsibilities:
 * - Validating item prices and calculating totals
 * - Verifying that displayed subtotal, tax, and final total
 *   match expected computed values
 * - Completing the purchase and navigating to the final confirmation page
 *
 * This page is critical for ensuring pricing accuracy and
 * correct order calculations.
 */

import { Page, expect } from '@playwright/test'
import { OverviewSelectors } from '../selectors/overview'

export class CheckoutOverviewPage {
    constructor(private page: Page) {}

    /**
     * Validates that the displayed subtotal, tax, and final total
     * match the calculations based on individual item prices.
     *
     * Logic:
     * - Extract item prices from the overview page
     * - Convert text values (e.g., "$29.99") into numeric values
     * - Sum all item prices to compute subtotal
     * - Compute tax (8%) based on subtotal
     * - Verify that UI-displayed values match expected ones
     */
    async verifyPricesMatchCart() {
        const items = this.page.getByTestId(OverviewSelectors.item)
        const count = await items.count()

        let total = 0

        for (let i = 0; i < count; i++) {
            const priceText = await items
                .nth(i)
                .getByTestId(OverviewSelectors.price)
                .textContent()

            const priceValue = Number(priceText?.replace('$', ''))
            total += priceValue
        }

        const tax = Math.round((total * 0.08 + Number.EPSILON) * 100) / 100

        await expect(this.page.getByTestId(OverviewSelectors.subtotal))
            .toContainText(String(total))

        await expect(this.page.getByTestId(OverviewSelectors.tax))
            .toContainText(String(tax))

        await expect(this.page.getByTestId(OverviewSelectors.total))
            .toContainText(String(total + tax))
    }

    /**
     * Finalizes the purchase by clicking the "Finish" button
     * and validates navigation to the order completion page.
     */
    async finishOrder() {
        await this.page.getByTestId(OverviewSelectors.finishButton).click()
        await expect(this.page).toHaveURL(/checkout-complete/)
    }
}
