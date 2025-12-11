/**
 * ORDER COMPLETE PAGE OBJECT
 * ---------------------------------------------------------
 * Represents the final confirmation screen displayed after
 * a successful purchase.
 *
 * Responsibilities:
 * - Verify that the user sees the thank-you message
 * - Ensure that the UI confirms order completion
 */

import { Page, expect } from '@playwright/test'
import { CompleteSelectors } from '../selectors/complete'

export class OrderCompletePage {
    constructor(private page: Page) {}

    /**
     * Validates that the order was successfully completed
     * by verifying the thank-you message and presence of UI elements.
     */
    async verifyCompletion() {
        await expect(this.page.getByTestId(CompleteSelectors.header))
            .toContainText('Thank you for your order!')

        await expect(this.page.getByTestId(CompleteSelectors.backHome))
            .toBeVisible()
    }
}
