import { Page, expect } from '@playwright/test'
import { CartSelectors } from '../selectors/cart'

export class CartPage {
    constructor(private page: Page) {}

    async openCart() {
        await this.page.getByTestId(CartSelectors.cartLink).click()
        await expect(this.page).toHaveURL(/cart/)
    }

    async verifyItemInCart(productName: string) {
        const item = this.page
            .getByTestId(CartSelectors.itemName)
            .filter({ hasText: productName })

        await expect(item).toBeVisible()
    }

    async verifyCartItems(expectedCount: number) {
        const items = this.page.getByTestId(CartSelectors.item)
        await expect(items).toHaveCount(expectedCount)
    }

    async checkout() {
        await this.page.getByTestId(CartSelectors.checkoutButton).click()
        await expect(this.page).toHaveURL(/checkout-step-one/)
    }
}
