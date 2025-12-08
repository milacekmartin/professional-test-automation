import { Page, expect } from '@playwright/test'
import { CompleteSelectors } from '../selectors/complete'

export class OrderCompletePage {
    constructor(private page: Page) {}

    async verifyCompletion() {
        await expect(this.page.getByTestId(CompleteSelectors.header))
            .toContainText('Thank you for your order!')

        await expect(this.page.getByTestId(CompleteSelectors.backHome)).toBeVisible()
    }
}
