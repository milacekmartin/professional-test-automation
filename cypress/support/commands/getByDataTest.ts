Cypress.Commands.add('getByDataTest', (locator: string) => {
    return cy.get('[data-test = "' + locator + '"]')
})
