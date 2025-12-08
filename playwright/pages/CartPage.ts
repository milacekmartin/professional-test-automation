import { Page, expect } from '@playwright/test'
import { CartSelectors } from '../selectors/cart'

export class CartPage {
    constructor(private page: Page) {}

    // Open the cart icon in the header
    async openCart() {
        await this.page.getByTestId(CartSelectors.cartLink).click()
        await expect(this.page).toHaveURL(/cart/)
    }

    // Verify specific product is present in the cart
    async verifyItemInCart(productName: string) {
        const item = this.page
            .getByTestId(CartSelectors.itemName)
            .filter({ hasText: productName })

        await expect(item).toBeVisible()
    }

    // Verify number of items in the cart
    async verifyCartItems(expectedCount: number) {
        const items = this.page.getByTestId(CartSelectors.item)
        await expect(items).toHaveCount(expectedCount)
    }

    // Continue to checkout step one
    async checkout() {
        await this.page.getByTestId(CartSelectors.checkoutButton).click()
        await expect(this.page).toHaveURL(/checkout-step-one/)
    }
}
