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

            // obrázok
            await expect(item.locator('img.inventory_item_img')).toBeVisible()

            // popis
            await expect(item.getByTestId(InventorySelectors.itemDesc)).toBeVisible()

            // cena
            await expect(item.getByTestId(InventorySelectors.itemPrice)).toContainText('$')

            // button Add to cart
            await expect(item.getByRole('button')).toHaveText('Add to cart')
        }
    }

    async addAllItems() {
        const items = this.page.getByTestId(InventorySelectors.item)
        const count = await items.count()

        for (let i = 0; i < count; i++) {
            const item = items.nth(i)

            // klik na Add to cart
            const addButton = item.getByRole('button', { name: 'Add to cart' })
            await addButton.click()

            // čakáme na stav Remove
            await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible()
        }

        return count
    }

    async goToCart(expectedCount: number) {
        // odznak počtu položiek
        const badge = this.page.getByTestId(InventorySelectors.cartBadge)
        await expect(badge).toHaveText(String(expectedCount))

        // klik na ikonku košíka
        await this.page.getByTestId(InventorySelectors.cartLink).click()

        // overíme URL
        await expect(this.page).toHaveURL(/cart/)
    }
}
