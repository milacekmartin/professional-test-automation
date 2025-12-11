/**
 * CHECKOUT PAGE OBJECT
 * ---------------------------------------------------------
 * Represents the first step of the checkout process where
 * the user fills in personal information required to proceed.
 *
 * Responsibilities:
 * - Enter first name, last name, and postal code
 * - Navigate to checkout step two after validation
 */

import { Page, expect } from '@playwright/test'
import { CheckoutSelectors } from '../selectors/checkout'

export class CheckoutPage {
    constructor(private page: Page) {}

    /**
     * Fills in personal information and navigates
     * to checkout step two.
     *
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param postalCode - Customer postal/ZIP code
     */
    async fillPersonalInfo(firstName: string, lastName: string, postalCode: string) {
        await this.page.getByTestId(CheckoutSelectors.firstName).fill(firstName)
        await this.page.getByTestId(CheckoutSelectors.lastName).fill(lastName)
        await this.page.getByTestId(CheckoutSelectors.postalCode).fill(postalCode)

        await this.page.getByTestId(CheckoutSelectors.continueButton).click()
        await expect(this.page).toHaveURL(/checkout-step-two/)
    }
}
