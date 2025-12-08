import { Page, expect } from '@playwright/test'
import { InventorySelectors } from '../selectors/inventory'

export class InventoryPage {
    constructor(private page: Page) {}

    async getItems() {
        return this.page.getByTestId(InventorySelectors.item)
    }

    async verifyProductList() {
        const items = this.page.getByTestId(InventorySelectors.item)
        const count = await items.count()

        expect(count).toBeGreaterThan(0)

        for (let i = 0; i < count; i++) {
            const item = items.nth(i)

            await expect(item.locator('img.inventory_item_img')).toBeVisible()
            await expect(item.getByTestId(InventorySelectors.itemDesc)).toBeVisible()
            await expect(item.getByTestId(InventorySelectors.itemPrice)).toContainText('$')
            await expect(item.getByRole('button')).toHaveText('Add to cart')
        }
    }

    async addAllItems() {
        const items = this.page.getByTestId(InventorySelectors.item)
        const count = await items.count()

        for (let i = 0; i < count; i++) {
            const item = items.nth(i)

            const addButton = item.getByRole('button', { name: 'Add to cart' })
            await addButton.click()

            await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible()
        }

        return count
    }

    async goToCart(expectedCount: number) {
        const badge = this.page.getByTestId(InventorySelectors.cartBadge)
        await expect(badge).toHaveText(String(expectedCount))

        await this.page.getByTestId(InventorySelectors.cartLink).click()
        await expect(this.page).toHaveURL(/cart/)
    }
}
