import { test, expect } from '@playwright/test';

test('Demo · Intentional bug (expected-to-fail)', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  // BUG: SauceDemo shows 6 items; assert 42 so the report shows a clear red failure.
  await expect(page.locator('.inventory_item')).toHaveCount(42);
});
