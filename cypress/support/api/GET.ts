Cypress.Commands.add('GET', (url: string, failOnStatusCode: boolean = true, log = true) => {
    cy
        .request({
            url: Cypress.env().api + url,
            method: 'GET',

            failOnStatusCode: failOnStatusCode,
            log: log
        
        }).then($resp => { return cy.wrap($resp, {log: log}) })
})
