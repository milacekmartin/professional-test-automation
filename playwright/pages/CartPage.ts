import { Page, expect } from '@playwright/test'
import { CartSelectors } from '../selectors/cart'

export class CartPage {
    constructor(private page: Page) {}

    async verifyCartItems(expectedCount: number) {
        const items = this.page.getByTestId(CartSelectors.item)
        await expect(items).toHaveCount(expectedCount)
    }

    async checkout() {
        await this.page.getByTestId(CartSelectors.checkoutButton).click()
        await expect(this.page).toHaveURL(/checkout-step-one/)
    }
}
