import { test } from '@playwright/test'
import products from '../data/products.json'

import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage'
import { CartPage } from '../pages/CartPage'

import { login } from '../env'

test.describe('Add to cart', () => {

    test.beforeEach(async ({ page }) => {
        await new LoginPage(page).loginAsDefaultUser()
    })

    test('User can add a product to the cart', async ({ page }) => {
        const home = new HomePage(page)
        const cart = new CartPage(page)

        await home.addProductToCart(products.productToBuy)
        await cart.openCart()

        await cart.verifyItemInCart(products.productToBuy)
    })
})
