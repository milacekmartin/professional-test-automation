import { Page, expect } from '@playwright/test'
import { CheckoutSelectors } from '../selectors/checkout'

export class CheckoutPage {
    constructor(private page: Page) {}

    async fillPersonalInfo(firstName: string, lastName: string, postalCode: string) {
        await this.page.getByTestId(CheckoutSelectors.firstName).fill(firstName)
        await this.page.getByTestId(CheckoutSelectors.lastName).fill(lastName)
        await this.page.getByTestId(CheckoutSelectors.postalCode).fill(postalCode)

        await this.page.getByTestId(CheckoutSelectors.continueButton).click()
        await expect(this.page).toHaveURL(/checkout-step-two/)
    }
}
