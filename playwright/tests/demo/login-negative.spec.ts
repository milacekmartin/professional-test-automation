import { test, expect } from '@playwright/test';

test.describe('Demo · Login — negative', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('locked_out_user is rejected', async ({ page }) => {
    await page.getByTestId('username').fill('locked_out_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toContainText('Sorry, this user has been locked out');
  });

  test('wrong password is rejected', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('WRONG');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toContainText('Username and password do not match');
  });

  test('empty username shows error', async ({ page }) => {
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toContainText('Username is required');
  });
});
