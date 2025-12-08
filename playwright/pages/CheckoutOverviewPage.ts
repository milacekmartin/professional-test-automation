import { Page, expect } from '@playwright/test'
import { OverviewSelectors } from '../selectors/overview'

export class CheckoutOverviewPage {
    constructor(private page: Page) {}

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

        await expect(this.page.getByTestId(OverviewSelectors.subtotal)).toContainText(String(total))
        await expect(this.page.getByTestId(OverviewSelectors.tax)).toContainText(String(tax))
        await expect(this.page.getByTestId(OverviewSelectors.total)).toContainText(String(total + tax))
    }

    async finishOrder() {
        await this.page.getByTestId(OverviewSelectors.finishButton).click()
        await expect(this.page).toHaveURL(/checkout-complete/)
    }
}
