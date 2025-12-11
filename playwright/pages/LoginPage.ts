/**
 * LOGIN PAGE OBJECT
 * ---------------------------------------------------------
 * Represents the login form of the application.
 *
 * Responsibilities:
 * - Load login page
 * - Perform login with provided credentials
 * - Provide a helper method to log in using default test credentials
 */

import { Page } from '@playwright/test'
import { login } from '../env'

export class LoginPage {
    constructor(private page: Page) {}

    /**
     * Navigates to the root URL (login form).
     */
    async goto() {
        await this.page.goto('/')
    }

    /**
     * Fills in login credentials and submits the form.
     *
     * @param username - User's login username
     * @param password - User's login password
     */
    async login(username: string, password: string) {
        await this.page.getByTestId('username').fill(username)
        await this.page.getByTestId('password').fill(password)
        await this.page.getByTestId('login-button').click()
    }

    /**
     * Logs in using credentials from env.ts (default test user).
     */
    async loginAsDefaultUser() {
        await this.goto()
        await this.login(login.username, login.password)
    }
}
