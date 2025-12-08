import { test } from '@playwright/test'

import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage'
import { OrderCompletePage } from '../pages/OrderCompletePage'

import { randomString, randomNumber } from '../helpers/random'
import { login } from '../env'

test.describe('FE test', () => {
  
    test('full E2E purchase flow', async ({ page }) => {
        
        // 1) LOGIN
        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login(login.username, login.password)

        // 2) INVENTORY LIST
        const inventory = new InventoryPage(page)
        await inventory.verifyProductList()

        // 3) ADD ALL ITEMS
        const itemCount = await inventory.addAllItems()
        await inventory.goToCart(itemCount)

        // 4) CART PAGE
        const cart = new CartPage(page)
        await cart.verifyCartItems(itemCount)
        await cart.checkout()

        // 5) CHECKOUT INFO
        const checkout = new CheckoutPage(page)
        await checkout.fillPersonalInfo(randomString(), randomString(), randomNumber(5))

        // 6) CHECKOUT OVERVIEW
        const overview = new CheckoutOverviewPage(page)
        await overview.verifyPricesMatchCart()
        await overview.finishOrder()

        // 7) ORDER COMPLETE
        const complete = new OrderCompletePage(page)
        await complete.verifyCompletion()
    })
})
