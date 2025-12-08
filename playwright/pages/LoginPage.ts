import { Page, expect } from '@playwright/test'
import { LoginSelectors } from '../selectors/login'

export class LoginPage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto('/')
    }

    async login(username: string, password: string) {
        await this.page.getByTestId(LoginSelectors.username).fill(username)
        await this.page.getByTestId(LoginSelectors.password).fill(password)
        await this.page.getByTestId(LoginSelectors.loginButton).click()

        await expect(this.page).toHaveURL(/inventory/)
    }
}
