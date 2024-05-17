import { expect, browser, $ } from '@wdio/globals'

class LoginPage {
    get username() { return $('#user-name') }
    get password() { return $('#password') }
    get submitBtn() { return $('#login-button') }
    get error() { return $('.error-message-container.error') }

    async open() {
        await browser.url('https://www.saucedemo.com/')
    }

    async login(username, password) {
        await this.username.setValue(username)
        await this.password.setValue(password)

        expect(await this.username.getValue()).toBe(username)
        expect(await this.password.getValue()).toBe(password)

        expect(await this.password.getAttribute('type')).toBe('password')

        await this.submitBtn.click()
    }
}

describe('Check Login page', () => {
    it('should login with valid credentials and redirect to main page', async () => {
        const loginPage = new LoginPage()
        await loginPage.open()
        await loginPage.login('standard_user', 'secret_sauce')

        const url = await browser.getUrl()
        console.log(`Current URL is: ${url}`)

        const expectedUrl = 'https://www.saucedemo.com/inventory.html'
        expect(url).toBe(expectedUrl)
    })

    it('should not login with invalid credentials', async () => {
        const loginPage = new LoginPage()
        await loginPage.open()
        await loginPage.login('invalid_user', 'invalid_password')

        const url = await browser.getUrl()
        console.log(`Current URL is: ${url}`)

        const expectedUrl = 'https://www.saucedemo.com/'
        expect(url).toBe(expectedUrl)

        expect(await loginPage.error.isExisting()).toBe(true)
    })
})
