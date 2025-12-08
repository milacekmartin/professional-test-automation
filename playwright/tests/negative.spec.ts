import { test, expect } from '@playwright/test'

import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage'
import { login } from '../env'

test.describe('Negative test', () => {

    test.beforeEach(async ({ page }) => {
        await new LoginPage(page).loginAsDefaultUser()
    })

    test('Non-existing product cannot be added to cart', async ({ page }) => {
        const home = new HomePage(page)

        const nonExisting = "Product That Does Not Exist"
        await expect(page.getByText(nonExisting)).toHaveCount(0)
    })
})
