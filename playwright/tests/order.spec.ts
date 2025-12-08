import { test } from '@playwright/test'

import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage'
import { OrderCompletePage } from '../pages/OrderCompletePage'

import { randomString, randomNumber } from '../helpers/random'

test.describe('FE test', () => {

    test.beforeEach(async ({ page }) => {
        await new LoginPage(page).loginAsDefaultUser()
    })
  
    test('full E2E purchase flow', async ({ page }) => {

        // 2) INVENTORY PAGE
        const inventory = new InventoryPage(page)
        await inventory.verifyProductList()

        // 3) ADD ALL ITEMS
        const itemCount = await inventory.addAllItems()
        await inventory.goToCart(itemCount)

        // 4) CART PAGE
        const cart = new CartPage(page)
        await cart.verifyCartItems(itemCount)
        await cart.checkout()

        // 5) CHECKOUT INFO (First/Last name, postal code)
        const checkout = new CheckoutPage(page)
        await checkout.fillPersonalInfo(
            randomString(), 
            randomString(), 
            randomNumber(5)
        )

        // 6) CHECKOUT OVERVIEW
        const overview = new CheckoutOverviewPage(page)
        await overview.verifyPricesMatchCart()
        await overview.finishOrder()

        // 7) ORDER COMPLETE
        const complete = new OrderCompletePage(page)
        await complete.verifyCompletion()
    })
})
