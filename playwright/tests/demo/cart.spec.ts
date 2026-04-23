import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
}

test('Demo · Add Sauce Labs Backpack to cart', async ({ page }) => {
  await login(page);
  await page.locator('.inventory_item', { hasText: 'Sauce Labs Backpack' })
    .locator('button.btn_inventory').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('Demo · Complete full checkout', async ({ page }) => {
  await login(page);
  await page.locator('.inventory_item', { hasText: 'Sauce Labs Backpack' })
    .locator('button.btn_inventory').click();
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await page.locator('#checkout').click();
  await page.locator('#first-name').fill('Martin');
  await page.locator('#last-name').fill('Milacek');
  await page.locator('#postal-code').fill('84104');
  await page.locator('#continue').click();
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await page.locator('#finish').click();
  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(page.locator('.complete-header')).toContainText('Thank you for your order');
});
