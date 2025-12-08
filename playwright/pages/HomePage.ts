import { Page } from '@playwright/test'
import { HomeSelectors } from '../selectors/home'

export class HomePage {
    constructor(private page: Page) {}

    async addProductToCart(name: string) {
        const item = this.page
        .getByTestId(HomeSelectors.item)
        .filter({ hasText: name })

        await item.getByRole('button', { name: 'Add to cart' }).click()
    }
}
