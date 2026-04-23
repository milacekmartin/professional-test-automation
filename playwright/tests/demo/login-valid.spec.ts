import { test, expect } from '@playwright/test';

test('Demo · Login — valid', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});
