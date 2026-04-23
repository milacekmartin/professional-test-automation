import { test, expect } from '@playwright/test';

test.describe('Demo · Checkout — negative (missing fields)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await page.locator('.inventory_item', { hasText: 'Sauce Labs Backpack' })
      .locator('button.btn_inventory').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('#checkout').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test('missing last name is rejected', async ({ page }) => {
    await page.locator('#first-name').fill('Martin');
    await page.locator('#postal-code').fill('84104');
    await page.locator('#continue').click();
    await expect(page.getByTestId('error')).toContainText('Last Name is required');
  });

  test('missing zip code is rejected', async ({ page }) => {
    await page.locator('#first-name').fill('Martin');
    await page.locator('#last-name').fill('Milacek');
    await page.locator('#continue').click();
    await expect(page.getByTestId('error')).toContainText('Postal Code is required');
  });
});
