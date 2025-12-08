import { Page } from '@playwright/test'
import { login } from '../env'

export class LoginPage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto('/')
    }

    async login(username: string, password: string) {
        await this.page.getByTestId('username').fill(username)
        await this.page.getByTestId('password').fill(password)
        await this.page.getByTestId('login-button').click()
    }

    async loginAsDefaultUser() {
        await this.goto()
        await this.login(login.username, login.password)
    }
}
