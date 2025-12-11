/**
 * HOME (INVENTORY LIST) PAGE OBJECT
 * ---------------------------------------------------------
 * Represents the main product listing page displayed after login.
 *
 * Responsibilities:
 * - Locate a product by name
 * - Add a specific product to the shopping cart
 */

import { Page } from '@playwright/test'
import { HomeSelectors } from '../selectors/home'

export class HomePage {
    constructor(private page: Page) {}

    /**
     * Adds a specific product to the cart, identified by name.
     *
     * @param name - Product name exactly as shown in UI
     */
    async addProductToCart(name: string) {
        const item = this.page
            .getByTestId(HomeSelectors.item)
            .filter({ hasText: name })

        await item.getByRole('button', { name: 'Add to cart' }).click()
    }
}
