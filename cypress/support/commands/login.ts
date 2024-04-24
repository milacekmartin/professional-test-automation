import * as helpers from '@helpers'

Cypress.Commands.add('login', () => {
    cy
        .clearAllCookies()
        .clearAllLocalStorage()
        .clearAllSessionStorage()

    cy
        .visit('/')

    cy
        .get(helpers.commons.login.username)
        .type(Cypress.env().login.username)

    cy
        .get(helpers.commons.login.password)
        .type(Cypress.env().login.password)

    cy
        .get(helpers.commons.login.submit)
        .click()

    cy
        .url()
        .should('contain', Cypress.config().baseUrl + helpers.commons.url.inventory)
})
